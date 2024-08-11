const express = require("express");
require("dotenv").config();
const pool = require("../../config/db");

const createProblem = async (req, res) => {
  const { problemName, description, constraints, examples, testCases } =
    req.body;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Insert problem
    const result = await client.query(
      "INSERT INTO problems(problem_name, description, constraints) VALUES($1, $2, $3) RETURNING id",
      [problemName, description, constraints]
    );

    const problemId = result.rows[0].id;

    // Insert examples
    if (examples && examples.length > 0) {
      for (const example of examples) {
        await client.query(
          "INSERT INTO examples(problem_id, example) VALUES($1, $2)",
          [problemId, example]
        );
      }
    }

    // Insert test cases
    if (testCases && testCases.length > 0) {
      for (const testCase of testCases) {
        await client.query(
          "INSERT INTO test_cases(problem_id, input, output) VALUES($1, $2, $3)",
          [problemId, testCase.input, testCase.output]
        );
      }
    }

    await client.query("COMMIT");
    res.status(201).json({ message: "Problem created successfully!" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error creating problem:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.release();
  }
};

const getSpecProblem = async (req, res) => {
  const problemId = parseInt(req.params.id, 10);

  if (isNaN(problemId)) {
    return res.status(400).json({ error: "Invalid problem ID" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const problemResult = await client.query(
      "SELECT * FROM problems WHERE id = $1",
      [problemId]
    );

    if (problemResult.rows.length === 0) {
      return res.status(404).json({ error: "Problem not found" });
    }

    const problem = problemResult.rows[0];

    // Fetch examples
    const examplesResult = await client.query(
      "SELECT example FROM examples WHERE problem_id = $1",
      [problemId]
    );

    // Fetch test cases
    const testCasesResult = await client.query(
      "SELECT input, output FROM test_cases WHERE problem_id = $1",
      [problemId]
    );

    await client.query("COMMIT");

    res.json({
      ...problem,
      examples: examplesResult.rows.map((row) => row.example),
      testCases: testCasesResult.rows,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error fetching problem:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.release();
  }
};
const getAllProblems = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Fetch all problems
    const problemsResult = await client.query("SELECT * FROM problems");

    const problems = problemsResult.rows;

    // // Fetch examples and test cases for each problem
    // for (let problem of problems) {
    //   const examplesResult = await client.query(
    //     "SELECT example FROM examples WHERE problem_id = $1",
    //     [problem.id]
    //   );

    //   const testCasesResult = await client.query(
    //     "SELECT input, output FROM test_cases WHERE problem_id = $1",
    //     [problem.id]
    //   );

    //   problem.examples = examplesResult.rows.map((row) => row.example);
    //   problem.testCases = testCasesResult.rows;
    // }

    await client.query("COMMIT");
    res.json(problems);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error fetching problems:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.release();
  }
};

const getAllSubmissions = async (req, res) => {
  const { userId, problemId } = req.query;
  if (!userId || !problemId) {
    return res.status(400).json({ error: "userId and problemId are required" });
  }

  try {
    const query = `
      SELECT id, attempted, is_correct ,created_at
      FROM public.submissions
      WHERE user_id = $1 AND problem_id = $2;
    `;
    const values = [userId, problemId];

    const result = await pool.query(query, values);
    const submissions = result.rows;
    res.json({ submissions });

  } catch (error) {
    console.error("Error fetching submissions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const router = new express.Router();

router.post("/create-problem", createProblem);
router.get("/get-problem/:id", getSpecProblem);
router.get("/all-problems", getAllProblems);
router.get("/getSubmissions", getAllSubmissions);

module.exports = router;
