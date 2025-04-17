const express = require("express");
const fetch = require("node-fetch");
const verifyToken = require("../middlewares/verifyToken");
require("dotenv").config();

const router = express.Router();

router.post("/", verifyToken, async (req, res) => {
  try {
    const response = await fetch(process.env.HASURA_GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET,
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to call Hasura " });
  }
});

module.exports = router;
