const jwt = require("jsonwebtoken");

const generateToken = (userId, role = "user") => {
  const payload = {
    sub: userId, // subject
    "https://hasura.io/jwt/claims": {
      "x-hasura-allowed-roles": [role],
      "x-hasura-default-role": role,
      "x-hasura-user-id": userId.toString(),
    },
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  return token;
};
module.exports = { generateToken };
