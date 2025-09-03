const express = require('express');
const router = express.Router();

// Temporary route for testing
router.post('/add', (req, res) => {
    res.json({ message: 'Add to cart endpoint works!' });
});

module.exports = router;