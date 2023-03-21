const isAuthenticated = (req, res, next) => {
  // Redirect unauthenticated user
  if ( !req.isAuthenticated() ) {
    return res.redirect('/login') 
  }

  next()
}

const isNotAuthenticated = (req, res, next) => {
  // Redirect authenticated user
  if ( req.isAuthenticated() ) {
    return res.redirect('/home')
  }

  next()
}

module.exports = { isAuthenticated, isNotAuthenticated }
