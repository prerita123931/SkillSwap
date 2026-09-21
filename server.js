const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const app = express();

// ===============================
// MIDDLEWARE
// ===============================

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve HTML, CSS and JS files
app.use(express.static(__dirname));


// ===============================
// MYSQL CONNECTION
// ===============================

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "prerita",
    database: "skillswap"
});


// ===============================
// TEST DATABASE CONNECTION
// ===============================

app.get("/api/test", async (req, res) => {
    try {
        await db.query("SELECT 1");

        res.json({
            success: true,
            message: "MySQL connected successfully!"
        });

    } catch (error) {
        console.error("Database Error:", error);

        res.status(500).json({
            success: false,
            message: "Database connection failed"
        });
    }
});


// ===============================
// SIGNUP
// ===============================

app.post("/api/signup", async (req, res) => {
    try {

        const {
            name,
            email,
            college,
            password
        } = req.body;

        // Check empty fields
        if (!name || !email || !college || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Check existing email
        const [existingUser] = await db.query(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Email already registered"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        const [result] = await db.query(
            `INSERT INTO users
            (name, email, college, password)
            VALUES (?, ?, ?, ?)`,
            [
                name,
                email,
                college,
                hashedPassword
            ]
        );

        res.json({
            success: true,
            message: "Account created successfully!",
            userId: result.insertId
        });

    } catch (error) {
        console.error("Signup Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});


// ===============================
// LOGIN
// ===============================

app.post("/api/login", async (req, res) => {
    try {

        const {
            email,
            password
        } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const [users] = await db.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const user = users[0];

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        res.json({
            success: true,
            message: "Login successful!",
            userId: user.id,
            userName: user.name
        });

    } catch (error) {
        console.error("Login Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});


// ===============================
// GET ALL SKILLS
// ===============================

app.get("/api/skills", async (req, res) => {
    try {

        const [skills] = await db.query(
            "SELECT * FROM skills ORDER BY id ASC"
        );

        res.json({
            success: true,
            skills: skills
        });

    } catch (error) {
        console.error("Get Skills Error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to fetch skills"
        });
    }
});


// ===============================
// ADD NEW SKILL
// ===============================

app.post("/api/skills", async (req, res) => {
    try {

        const { skill_name } = req.body;

        if (!skill_name || skill_name.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Skill name is required"
            });
        }

        const cleanSkill = skill_name.trim();

        // Check duplicate
        const [existing] = await db.query(
            `SELECT id
             FROM skills
             WHERE LOWER(skill_name) = LOWER(?)`,
            [cleanSkill]
        );

        if (existing.length > 0) {
            return res.status(400).json({
                success: false,
                message: "This skill already exists"
            });
        }

        // Insert skill
        const [result] = await db.query(
            `INSERT INTO skills
            (skill_name, category)
            VALUES (?, ?)`,
            [
                cleanSkill,
                "General"
            ]
        );

        res.json({
            success: true,
            message: "Skill added successfully",
            skillId: result.insertId
        });

    } catch (error) {
        console.error("Add Skill Error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to add skill"
        });
    }
});


// ===============================
// DELETE SKILL
// ===============================

app.delete("/api/skills/:id", async (req, res) => {
    try {

        const skillId = req.params.id;

        // Check whether skill is already used
        const [usedSkill] = await db.query(
            `SELECT id
             FROM user_skills
             WHERE skill_id = ?
             LIMIT 1`,
            [skillId]
        );

        if (usedSkill.length > 0) {
            return res.status(400).json({
                success: false,
                message:
                    "This skill is already used by a user and cannot be deleted."
            });
        }

        const [result] = await db.query(
            "DELETE FROM skills WHERE id = ?",
            [skillId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Skill not found"
            });
        }

        res.json({
            success: true,
            message: "Skill deleted successfully"
        });

    } catch (error) {
        console.error("Delete Skill Error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to delete skill"
        });
    }
});


// ===============================
// SAVE USER TEACHING & LEARNING SKILLS
// ===============================

app.post("/api/user-skills", async (req, res) => {
    try {

        const {
            userId,
            teachingSkills,
            learningSkills
        } = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        // =========================
        // TEACHING SKILLS
        // =========================

        for (const skillName of teachingSkills || []) {

            if (!skillName || skillName.trim() === "") {
                continue;
            }

            const cleanSkill = skillName.trim();

            // Check if skill exists
            const [existingSkill] = await db.query(
                `SELECT id
                 FROM skills
                 WHERE LOWER(skill_name) = LOWER(?)`,
                [cleanSkill]
            );

            let skillId;

            if (existingSkill.length > 0) {

                skillId = existingSkill[0].id;

            } else {

                // Create skill automatically
                const [newSkill] = await db.query(
                    `INSERT INTO skills
                    (skill_name, category)
                    VALUES (?, ?)`,
                    [
                        cleanSkill,
                        "General"
                    ]
                );

                skillId = newSkill.insertId;
            }

            // Check duplicate user skill
            const [alreadyAdded] = await db.query(
                `SELECT id
                 FROM user_skills
                 WHERE user_id = ?
                 AND skill_id = ?
                 AND skill_type = 'Teaching'`,
                [
                    userId,
                    skillId
                ]
            );

            if (alreadyAdded.length === 0) {

                await db.query(
                    `INSERT INTO user_skills
                    (user_id, skill_id, skill_type)
                    VALUES (?, ?, 'Teaching')`,
                    [
                        userId,
                        skillId
                    ]
                );
            }
        }


        // =========================
        // LEARNING SKILLS
        // =========================

        for (const skillName of learningSkills || []) {

            if (!skillName || skillName.trim() === "") {
                continue;
            }

            const cleanSkill = skillName.trim();

            // Check if skill exists
            const [existingSkill] = await db.query(
                `SELECT id
                 FROM skills
                 WHERE LOWER(skill_name) = LOWER(?)`,
                [cleanSkill]
            );

            let skillId;

            if (existingSkill.length > 0) {

                skillId = existingSkill[0].id;

            } else {

                // Create skill automatically
                const [newSkill] = await db.query(
                    `INSERT INTO skills
                    (skill_name, category)
                    VALUES (?, ?)`,
                    [
                        cleanSkill,
                        "General"
                    ]
                );

                skillId = newSkill.insertId;
            }

            // Check duplicate
            const [alreadyAdded] = await db.query(
                `SELECT id
                 FROM user_skills
                 WHERE user_id = ?
                 AND skill_id = ?
                 AND skill_type = 'Learning'`,
                [
                    userId,
                    skillId
                ]
            );

            if (alreadyAdded.length === 0) {

                await db.query(
                    `INSERT INTO user_skills
                    (user_id, skill_id, skill_type)
                    VALUES (?, ?, 'Learning')`,
                    [
                        userId,
                        skillId
                    ]
                );
            }
        }


        res.json({
            success: true,
            message: "Skills saved successfully!"
        });

    } catch (error) {

        console.error("User Skills Error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to save skills"
        });
    }
});


// ===============================
// GET REAL SKILL MATCHES
// ===============================

app.get("/api/matches", async (req, res) => {
    try {

        const [rows] = await db.query(`
            SELECT DISTINCT
                u.id,
                u.name,
                u.college,
                s.skill_name,
                us_teach.skill_type AS matched_type
            FROM user_skills us_learn

            JOIN user_skills us_teach
                ON us_learn.skill_id = us_teach.skill_id
                AND us_learn.user_id <> us_teach.user_id
                AND us_learn.skill_type = 'Learning'
                AND us_teach.skill_type = 'Teaching'

            JOIN users u
                ON u.id = us_teach.user_id

            JOIN skills s
                ON s.id = us_teach.skill_id

            ORDER BY u.name
        `);

        res.json({
            success: true,
            matches: rows
        });

    } catch (error) {

        console.error("Match Error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to fetch matches"
        });
    }
});

// ===============================
// START SERVER
// ===============================

const PORT = 5000;

const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`SkillSwap server running at http://localhost:${PORT}`);
});

server.on("error", (error) => {
    console.error("SERVER ERROR:", error);
});

setInterval(() => {
    console.log("SERVER IS STILL RUNNING...");
}, 5000);