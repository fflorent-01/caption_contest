const express = require('express')
const router = express.Router()
const db = require('../database/models/index.js')
const bcrypt = require('bcrypt')
const { isNotAuthenticated } = require('../middleware/authentication')
const { body, validationResult } = require('express-validator')

router.route('/').all(isNotAuthenticated)
    .get((req, res) => {
        res.render('pages/register',  { messages: req.flash() })
    })
    .post(
        [
            body('username')
                .trim()
                .escape()
                .not()
                .isEmpty()
                .withMessage('You must provide a username.')
                .isLength({min: 8})
                .withMessage('Username must have at least 8 characters.'),
            body('email')
                .isEmail()
                .normalizeEmail()
                .withMessage('You did not provide a valid email.'),
            body(['password', 'confirmPassword'])
                .trim()
                .escape()
                .not()
                .isEmpty()
                .withMessage('You must provide a password and confirm it.')
                .isLength({min: 8})
                .withMessage('Password must have at least 8 characters.')
        ],
        (req, res, next) => {
            console.log(req.body.username)
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                req.flash('errors', errors.array().map(element => {
                    return element.msg
                }))
                return res.status(400).redirect('/register')
            }
            next()
        },
        async (req, res) => {

        const { username, email, password, confirmPassword, ToS } = req.body
        const errorMessage = {};

        // Check username duplicate
        if ( await db.User.findOne({where: { username }}) ) {
            errorMessage['username'] =  `Username "${username}" already exist!`;
        } 
        // Check email duplicate
        if ( await db.User.findOne({where: { email }}) ) {
            errorMessage['email'] =  `There is already a user using this email!`;
        }
        // Check for non-matchig password
        if ( password !== confirmPassword ) {
            errorMessage['password'] =  `Password validation doesn't match!`;
        }
        // Check for Term of Service agreement
        if ( !ToS ) {
            errorMessage['ToS'] =  `You must agree to the term of service to use this site!`;
        }

        // If any errorMessage found render error message
        if ( Object.keys(errorMessage).length ) {
            res.status(400).render("pages/register", { username, email, password, ToS, errorMessage })
        }

        // If no error found create new user, hash and save password
        else {
            // Build the new user
            const newUser = db.User.build({ 
                username, 
                email
            })
            // Hash the password and save
            if ( newUser ) {
                 await bcrypt.genSalt(parseInt(process.env.SALT_ROUND))
                    .then(salt => bcrypt.hash(password, salt))
                    .then(hash => db.Password.create({password: hash}))
                    .then(async newPassword =>  {
                        await newUser.save()
                        await newUser.setPassword(newPassword)
                    })
                    .catch(err => console.log(`Unable to hash password for ${newUser.username}: ${err}`))
            }
            // Redirect to login page
            res.status(201).redirect('/login')
        }
    })

module.exports = router
