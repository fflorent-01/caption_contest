/**
 * IMPORTS
*/

// General import
require('dotenv').config()

const path = require('path')
const https = require('https')
const fs = require('fs')

// App import
const express = require('express')

// General middleware import
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')

// Security imports
const helmet = require('helmet')
const helmetConfig = require('./config/helmet')
const session = require('express-session')
const sessionConfig = require('./config/session')
const passport = require('passport')
const passportConfig = require('./config/passport')


// Custom middleware
const isAuthenticated = require('./middleware/authentication')

/**
 * LOAD DATABASE
*/
const db = require('./database/models/index')
// Test database connection
db.sequelize
  .authenticate()
  .then(() => {
    console.log(`Connection has been established successfully to *${process.env.DEV_DB_NAME}*.`);
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
// Sync database
if ( process.env.NODE_ENV === 'development' ) {
  db.sequelize.sync({alter: true})
    .then(() => console.log("Sync Complete"))
    .catch(err => console.error('Unable to sync to the database:', err))
}
 // Would preferably use migration in production


/**
 * LAUNCH APP AND LOAD MIDDLEWARES
*/

// Initiate app
const app = express()

// Load view engine
app.set("view engine", "ejs")

// Set static path
app.use(express.static(path.join(__dirname, "static")))

// Load general middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Load security middleware
app.use(helmet(helmetConfig))

/**
 * SESSION AUTHENTICATION
 */
app.use(session(sessionConfig))
app.use(flash())
passportConfig(passport, db.User)
app.use(passport.initialize())
app.use(passport.session())


/**
* ROUTERS
*/
// Entry routes
app.get('/', isAuthenticated, (req, res) => {
  res.redirect('/home')
})
app.get('/home', isAuthenticated, (req, res) => {
  res.render('home', {user: req.user.username,})
})


// Register router
const registerRouter = require('./routes/register')
app.use('/register', registerRouter)

// Login router
const loginRouter = require('./routes/login')
app.use('/login', loginRouter)

// Logout router
const logoutRouter = require('./routes/logout')
app.use('/logout', logoutRouter)


/**
 * START SERVER
 */
const options = {
    cert: fs.readFileSync(process.env.SSL_CERT_FILE),
    key: fs.readFileSync(process.env.SSL_KEY_FILE)
  };
  
// Https server  
https.createServer(options, app).listen(process.env.APP_PORT, () => {
    console.log(`HTTPS server listening on port ${process.env.APP_PORT} in *${process.env.NODE_ENV}* mode`);
  });
