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

const regUser = async (req, res) => {
  const { contest_id, user_id } = req.body;
  const client = await pool.connect();

  if (!contest_id || !user_id) {
    return res
      .status(400)
      .json({ error: "contest_id and user_id are required" });
  }

  try {
    await client.query("BEGIN");
    // Fetch the leaderboard_id associated with the contest_id
    const leaderboardResult = await client.query(
      "SELECT leaderboard_id FROM public.leaderboards WHERE contest_id = $1",
      [contest_id]
    );

    if (leaderboardResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res
        .status(404)
        .json({ error: "Leaderboard not found for this contest_id" });
    }

    const leaderboard_id = leaderboardResult.rows[0].leaderboard_id;
    // Check if the user is already registered in the leaderboard

    const existingEntryResult = await client.query(
      "SELECT entry_id FROM public.leaderboard_entries WHERE leaderboard_id = $1 AND user_id = $2",
      [leaderboard_id, user_id]
    );

    if (existingEntryResult.rows.length > 0) {
      await client.query("ROLLBACK");
      return res
        .status(201)
        .json({ message: "User is already registered in this leaderboard" });
    }

    // Insert a new entry in the leaderboard_entries table with score 0
    const insertResult = await client.query(
      "INSERT INTO public.leaderboard_entries (leaderboard_id, user_id, score, last_updated) VALUES ($1, $2, 0, NOW()) RETURNING entry_id",
      [leaderboard_id, user_id]
    );

    const entry_id = insertResult.rows[0].entry_id;
    await client.query("COMMIT");
    res.status(201).json({ message: "User registered successfully", entry_id });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const router = new express.Router();
router.get("/all-contests", getAllContests);
router.get("/spec-contests/:id", getSpec);
router.post("/reg-user", regUser);
module.exports = router;
