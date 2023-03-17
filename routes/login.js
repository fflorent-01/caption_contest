const express = require('express');
const router = express.Router();
const passport= require('passport')
const { isNotAuthenticated } = require('../middleware/authentication')
const { body, validationResult } = require('express-validator')


router.route('/').all(isNotAuthenticated)
    .get((req, res) => {
        res.render('pages/login', { messages: req.flash() })
    })
    .post(
        [
            body('username')
                .trim()
                .not()
                .isEmpty()
                .isString(),
            body('password')
                .trim()
                .not()
                .isEmpty()
        ],
        (req, res, next) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                req.flash('error', errors.array().map(element => {
                    return `${element.msg} for ${element.param}`
                }))
                return res.redirect('/login')
            }
            next()
        },
        passport.authenticate('local', {
            successRedirect: '/home',
            failureRedirect: '/login',
            failureFlash: true,
            successFlash: true,
        })
    )

module.exports = router