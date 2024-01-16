const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
    const authSession =  req.session

  if (!authSession) {
    return res.status(401).send({ message: "Session is missing" });
  }

  const token = authSession.login.token;

  jwt.verify(token, "jwtkey", (err, data) => {
    if (err) {
      return res.send({ message: "Invalid token" });
    }

    next();
  });
}

module.exports = verifyToken;
