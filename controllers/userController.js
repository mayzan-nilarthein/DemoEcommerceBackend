const axios = require("axios");
const bcrypt = require("bcryptjs");
const { GET_USER_BY_ID } = require("../graphql/queries");
const { UPDATE_USER_BY_ID, UPDATE_PASSWORD } = require("../graphql/mutations");

exports.getUserProfile = async (req, res) => {
  const userId = req.user.sub;

  const query = GET_USER_BY_ID;

  try {
    const response = await axios.post(
      process.env.HASURA_GRAPHQL_ENDPOINT,
      {
        query,
        variables: { id: parseInt(userId) },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET,
        },
      }
    );

    return res.status(200).json(response.data.data.users_by_pk);
  } catch (err) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};
exports.updateUserProfile = async (req, res) => {
  const userId = req.user.sub;
  const { name } = req.body;

  const mutation = UPDATE_USER_BY_ID;

  try {
    const response = await axios.post(
      process.env.HASURA_GRAPHQL_ENDPOINT,
      {
        query: mutation,
        variables: { id: parseInt(userId), name },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET,
        },
      }
    );

    res.status(200).json(response.data.data.update_users_by_pk);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

exports.updatePassword = async (req, res) => {
  const userId = req.user.sub;
  const { newPassword } = req.body;

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const mutation = UPDATE_PASSWORD;

  try {
    await axios.post(
      process.env.HASURA_GRAPHQL_ENDPOINT,
      {
        query: mutation,
        variables: { id: parseInt(userId), password: hashedPassword },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET,
        },
      }
    );

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Could not update password" });
  }
};
