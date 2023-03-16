const express = require('express');
const router = express.Router();
const passport= require('passport')

router.route('/')
    .all((req, res, next) => {
        if ( req.isAuthenticated() ) {
            res.redirect('/home')
        }
        next()
    })
    .get((req, res) => {
        res.render('pages/login')
    })
    .post(passport.authenticate('local', {
        successRedirect: '/home',
        failureRedirect: '/login',
        failureFlash: true,
        successFlash: true,
    }))

module.exports = router