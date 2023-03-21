const session = require('express-session')
const SequelizeStore = require('connect-session-sequelize')(session.Store)
const db = require('../../database/models/index.js')

const sessionConfig = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true, // require and HTTPS server
        httpOnly: true,
        sameSite: 'Strict',
        maxAge: 60 * 60 * 1000
    },
    store: new SequelizeStore({
        db: db.sequelize,
        checkExpirationInterval: 5 * 60 * 1000,
        expiration: 60 * 60 * 1000
      })
  }

module.exports = sessionConfig

