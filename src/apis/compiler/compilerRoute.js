const fs = require("fs");
const express = require("express");

require("dotenv").config();
const pool = require("../../config/db");

const Docker = require("dockerode");
const docker = new Docker();
const { exec } = require("child_process");

function removeSequence(str) {
  const lines = str.split("\n");

  // Process each line
  const processedLines = lines.map((line) => {
    const lineBuffer = Buffer.from(line, "utf8");
    return lineBuffer.toString("utf8", 8);
  });
  const result = processedLines.join("\n");
  return result;
}

function normalizeOutput(output) {
  return String(output)
    .trim()
    .replace(/\r?\n$/, "");
}

async function runPythonCode(code, inputs = "", timeout = 1000) {
  return new Promise(async (resolve, reject) => {
    let container;
    let timeoutHandle;

    try {
      container = await docker.createContainer({
        Image: "python-executor",
        Cmd: ["python", "-c", code],
        HostConfig: {
          Memory: 50 * 1024 * 1024, // Limit memory to 50MB
          CpuShares: 512, // Set CPU shares for resource allocation
          PidsLimit: 100, // Limit the number of processes
          Binds: ["/tmp:/tmp"], // Example of binding a directory (limit to specific directories)
          NetworkMode: "none", // Disable network access if not required
          privileged: false,
        },
        AttachStdin: true,
        AttachStdout: true,
        AttachStderr: true,
        Tty: false,
        OpenStdin: true,
        StdinOnce: false,
        stdin: true,
      });

      const startTime = Date.now();

      // Start the container
      await container.start();

      // Send the input to the container's stdin
      const stream = await container.attach({
        hijack: true,
        stream: true,
        stdin: true,
        stdout: true,
        stderr: true,
      });

      stream.write(inputs + "\n");
      stream.end();

      //   Set up the timeout mechanism
      timeoutHandle = setTimeout(async () => {
        console.log("Timeout reached, forcefully stopping the container...");
        try {
          await container.stop({ t: 0 }); // Forcefully stop the container immediately
        } catch (err) {
          console.error("Failed to stop the container:", err);
        }
        reject(new Error("Container execution timed out"));
      }, timeout);

      const waitForCompletion = container.wait();

      const logs = await container.logs({
        follow: true,
        stdout: true,
        stderr: true,
      });

      let rawOutput = "";
      logs.on("data", (data) => {
        rawOutput += removeSequence(data.toString("utf8"));
      });

      await waitForCompletion;

      // Clear the timeout if the container finishes in time
      clearTimeout(timeoutHandle);

      const endTime = Date.now();
      const executionTime = endTime - startTime;

      const stats = await new Promise((resolve, reject) => {
        exec(
          `docker stats --no-stream --format "{{.MemUsage}} {{.CPUPerc}}" ${container.id}`,
          (error, stdout, stderr) => {
            if (error) {
              reject(`Error: ${error.message}`);
            }
            if (stderr) {
              reject(`Stderr: ${stderr}`);
            }
            resolve(stdout.trim());
          }
        );
      });

      const [memoryUsage, cpuUsage] = stats.split(" ");
      const output = rawOutput;

      resolve({
        executionTime,
        memoryUsage,
        output,
      });
    } catch (error) {
      console.log(error);
      reject(error);
    } finally {
      if (container) {
        // Ensure the container is stopped and removed
        await container.stop().catch(() => {});
        await container.remove().catch(() => {});
      }
      clearTimeout(timeoutHandle);
    }
  });
}

const createSub = async (req, res) => {
  const {
    compilerId,
    source,
    inputs,
    compare_tc,
    pb_id,
    user_id,
    contest_id,
    language,
  } = req.body;

  try {
    if (compare_tc && pb_id > 0) {
      const client = await pool.connect();

      try {
        await client.query("BEGIN");

        const submissionResult = await client.query(
          `INSERT INTO submissions (problem_id, user_id, contest_id, code, attempted, is_correct, is_contest_submission, language)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
          [
            pb_id,
            user_id,
            contest_id || null,
            source,
            true,
            false,
            Boolean(contest_id),
            language,
          ]
        );
        const submissionId = submissionResult.rows[0].id;
        console.log(submissionId);

        const testCasesResult = await client.query(
          "SELECT id ,input, output FROM test_cases WHERE problem_id = $1",
          [pb_id]
        );

        const testCases = testCasesResult.rows;
        let testCaseResults = [];

        for (const testCase of testCases) {
          const { id: testCaseId, input, output: expectedOutput } = testCase;
          const testCaseOutput = await runPythonCode(source, input);

          const testCaseResult = {
            input,
            expectedOutput,
            actualOutput: testCaseOutput.output,
            executionTime: testCaseOutput.executionTime,
            memoryUsage: testCaseOutput.memoryUsage,
            passed:
              normalizeOutput(testCaseOutput.output) ===
              normalizeOutput(expectedOutput),
            diff:
              normalizeOutput(testCaseOutput.output) !==
              normalizeOutput(expectedOutput)
                ? `Expected "${expectedOutput}" but got "${testCaseOutput.output}"`
                : null,
          };

          testCaseResults.push(testCaseResult);

          await client.query(
            `INSERT INTO test_case_results (submission_id, test_case_id, actual_output, execution_time, memory_usage, passed)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [
              submissionId,
              testCaseId,
              testCaseResult.actualOutput,
              testCaseResult.executionTime,
              0,
              testCaseResult.passed,
            ]
          );
        }
        const allTestsPassed = testCaseResults.every((result) => result.passed);

        if (!allTestsPassed) {
          // Update the submission to mark it as incorrect
          await client.query(
            `UPDATE submissions SET is_correct = $1 WHERE id = $2`,
            [false, submissionId]
          );
          
          await client.query("COMMIT");
          return res.status(200).json({
            error: "Some test cases failed",
            results: testCaseResults,
          });
        }

        // Update the submission to mark it as correct
        await client.query(
          `UPDATE submissions SET is_correct = $1 WHERE id = $2`,
          [true, submissionId]
        );

        await client.query("COMMIT");
        return res.status(200).json({
          message: "All test cases passed",
          results: testCaseResults,
        });
      } catch (error) {
        await client.query("ROLLBACK");
        console.error("Error fetching problem:", error);
        res.status(500).json({ error: "Internal Server Error" });
      } finally {
        client.release();
      }
    } else {
      const output = await runPythonCode(source, inputs);
      return res.status(201).json({ output });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Execution failed" });
  }
};

const router = new express.Router();

router.post("/create-sub", createSub);
module.exports = router;
