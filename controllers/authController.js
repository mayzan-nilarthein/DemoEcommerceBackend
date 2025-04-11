const axios = require("axios");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const { generateToken } = require("../utils/generateToken");

dotenv.config();

exports.registerUser = async (req, res) => {
  const { email, name, password } = req.body;

  try {
    const hashed = await bcrypt.hash(password, 10);
    const mutation = `
  mutation RegisterUser($email: String!, $name: String!, $password: String!) {
    insert_users_one(object: {email: $email, name: $name, password: $password}) {
      id
      email
      name
    }
  }
`;

    const response = await axios.post(
      process.env.HASURA_GRAPHQL_ENDPOINT,
      {
        query: mutation,
        variables: { email, name, password: hashed },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET,
        },
      }
    );

    const user = response.data.data.insert_users_one;

    const token = generateToken(user.id);

    res.status(201).json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration Failed!" });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  const query = `
    query GetUser($email: String!) {
      users(where: {email: {_eq: $email}}) {
        id
        email
        name
        password
      }
    }
  `;

  try {
    const response = await axios.post(
      process.env.HASURA_GRAPHQL_ENDPOINT,
      {
        query,
        variables: { email },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET,
        },
      }
    );

    const user = response.data.data.users[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user.id);

    res.status(200).json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
};
