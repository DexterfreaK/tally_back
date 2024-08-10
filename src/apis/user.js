const express = require("express");
const pool = require("../config/db");
const bcrypt = require("bcrypt"); // For password hashing
const jwt = require("jsonwebtoken"); // For token generation

const router = express.Router();

// Middleware for parsing JSON bodies
router.use(express.json());

// Create a new user
router.post("/register", async (req, res) => {
  const { username, email, password, full_name } = req.body;
  try {
    // Check if user already exists
    const userCheckQuery =
      "SELECT * FROM users WHERE username = $1 OR email = $2";
    const userCheck = await pool.query(userCheckQuery, [username, email]);

    if (userCheck.rows.length > 0) {
      return res
        .status(400)
        .json({ message: "Username or Email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into the database
    const insertUserQuery = `
      INSERT INTO Users (username, email, password_hash, full_name)
      VALUES ($1, $2, $3, $4)
      RETURNING user_id, username, email, full_name, created_at
    `;
    const newUser = await pool.query(insertUserQuery, [
      username,
      email,
      hashedPassword,
      full_name,
    ]);

    res.status(201).json(newUser.rows[0]);
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }   
});

// User login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    // Trim input
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    // Find user by username or email
    const userQuery = `
      SELECT user_id, username, email, password_hash, full_name, bio, profile_picture_url, created_at, updated_at
      FROM users
      WHERE username = $1
    `;
    const userResult = await pool.query(userQuery, [trimmedUsername]);

    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const user = userResult.rows[0];

    // Compare password with hashed password in database
    const isPasswordMatch = await bcrypt.compare(
      trimmedPassword,
      user.password_hash
    );

    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { user_id: user.user_id, username: user.username },
      "your_jwt_secret_key", // Replace this with your secret key
      { expiresIn: "1h" } // Token expiration time
    );

    // Send response with token and user details
    res.status(200).json({
      token,
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        bio: user.bio,
        profile_picture_url: user.profile_picture_url,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    });
  } catch (err) {
    console.error("Error logging in user:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
  

// Get user details (authenticated access)
router.get("/me", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, "your_jwt_secret");
    const result = await pool.query("SELECT * FROM users WHERE user_id = $1", [
      decoded.userId,
    ]);
    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "Invalid token" });
  }
});

module.exports = router;
