const express = require('express');
const router = express.Router();

// Temporary route for testing
router.post('/products', (req, res) => {
    res.json({ message: 'Admin product endpoint works!' });
});

module.exports = router;