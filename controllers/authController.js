const axios = require("axios");

exports.registerUser = async (req, res) => {
  const { email, name } = req.body;

  try {
    const mutation = `
      mutation RegisterUser($email: String!, $name: String!) {
        insert_users(objects: {email: $email, name: $name}) {
          returning {
            id
            email
            name
          }
        }
      }
    `;

    const response = await axios.post(
      process.env.HASURA_GRAPHQL_ENDPOINT,
      {
        query: mutation,
        variables: { email, name },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET,
        },
      }
    );

    res.status(200).json(response.data.data.insert_users.returning[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};
