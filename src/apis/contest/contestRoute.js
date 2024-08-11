const express = require("express");
require("dotenv").config();
const pool = require("../../config/db");

const getAllContests = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const contestsResult = await client.query(`
      SELECT c.contest_id, c.contest_name, c.description, c.start_date, c.end_date, c.leaderboard_id, 
             u.user_id, u.username, u.email, u.name, u.bio, u.profile_picture_url
      FROM public.contests c
      JOIN public.users u ON c.created_by_user_id = u.user_id
    `);

    const contests = contestsResult.rows;

    await client.query("COMMIT");
    res.json(contests);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error fetching contests:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.release();
  }
};

const getSpec = async (req, res) => {

  const contestId = parseInt(req.params.id, 10);
  const client = await pool.connect();
  try {
    // Start a transaction
    await client.query("BEGIN");

    // Query to get the contest details
    const contestQuery = `
      SELECT contest_id, created_by_user_id, contest_name, description, start_date, end_date, leaderboard_id, created_at
      FROM public.contests
      WHERE contest_id = $1;
    `;
    const contestResult = await client.query(contestQuery, [contestId]);
    

    if (contestResult.rows.length === 0) {
      throw new Error("Contest not found");
    }

    const contest = contestResult.rows[0];

    // Query to get all problems associated with the contest
    const problemsQuery = `
      SELECT p.id, p.problem_name, p.description, p."constraints"
      FROM public.problems p
      INNER JOIN public.contest_problems cp ON p.id = cp.problem_id
      WHERE cp.contest_id = $1;
    `;
    const problemsResult = await client.query(problemsQuery, [contestId]);

    const problems = problemsResult.rows;

    // Commit the transaction
    await client.query("COMMIT");

    // Combine contest details and problems into a single object
    return res.json({
      contest,
      problems,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error fetching contests:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.release();
  }
};

const router = new express.Router();
router.get("/all-contests", getAllContests);
router.get("/spec-contests/:id", getSpec);
module.exports = router;
