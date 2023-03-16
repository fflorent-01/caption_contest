const express = require('express');
const router = express.Router();

router.route('/')
    .get((req, res) => {
        req.logout(() => res.redirect('/'))
    })

module.exports = router