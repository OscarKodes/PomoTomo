
// middleware object

let middlewareObj = {};

// Middleware functions
middlewareObj.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()){
    return next();
  } else {
    res.redirect("/front");
  }
}

module.exports = middlewareObj;
