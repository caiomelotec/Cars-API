const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const authSession = req.session;

  if (!authSession || !authSession.login) {
    return res
      .status(401)
      .send({ message: "Session or login information is missing" });
  }

  const token = authSession.login.token;

  if (token === undefined) {
    return res.status(401).send({ message: "Missing login token" });
  }

  jwt.verify(token, "jwtkey", (err, data) => {
    if (err) {
      return res.status(401).send({ message: "Invalid token" });
    }

    next();
  });
}

module.exports = verifyToken;
