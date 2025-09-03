const express = require("express");
const router = express.Router();

// Example route (adjust later to real DB logic)
router.post("/login", (req, res) => {
    const { email, password } = req.body;
    if (email === "test@test.com" && password === "1234") {
        res.json({ message: "Login successful" });
    } else {
        res.status(401).json({ message: "Invalid credentials" });
    }
});

router.post("/register", (req, res) => {
    const { email, password } = req.body;
    res.json({ message: `User ${email} registered successfully` });
});

module.exports = router;
