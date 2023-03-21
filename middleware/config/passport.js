const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

module.exports = function(passport, User) {

    // LocalStrategy
    passport.use(new LocalStrategy({ usernameField: 'username', passwordField: 'password' },
        (username, password, done) => {
            // Find user
            User.findOne({where: {username}}).then(user => {
                if ( !user ) {
                    return done(null, false, {message: `User ${username} is not found!`})
                }
                // Check password validity
                user.getPassword().then(userPassword => {
                    bcrypt.compare(password, userPassword.password, (err, isMatch) => {
                        if ( err ) { return done(err) }
                        if ( isMatch ) {
                            return done(null, user, {message: "Login successful."})
                        } else {
                            return done(null, false, {message: "Incorrect password."})
                        }     
                    })
                }).catch(err => done(err))
            }).catch(err => done(err))
        })
    )

    // Serializer
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    // Deserializer
    passport.deserializeUser((id, done) => {
        User.findByPk(id)
            .then(user => done(null, user))
            .catch(err => done(err))
    })
}
