const jwt = require("jsonwebtoken");

const auth = function (req, res, next) {
  // const token = req.header("Authorization");
  let token = req.header("Authorization"); // Express headers are auto converted to lowercase
  if (!token) return res.status(401).send("Access Denied");

  if (token) {
    jwt.verify(token, "process.env.TOKEN_SECRET", (err, decoded) => {
      if (err) {
        return res.status(403).send({
          success: false,
          message: "Forbidden",
          error: err,
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(401).send({
      success: false,
      message: "Auth token is not supplied",
    });
  }
};
module.exports = { auth };
