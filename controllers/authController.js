const axios = require("axios");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

const { generateToken } = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail");
const generateOTP = require("../utils/generateOTP");
const { GET_USER_BY_EMAIL } = require("../graphql/queries");
const { REGISTER_USER, UPDATE_USER_STATE } = require("../graphql/mutations");

dotenv.config();

let otpStore = {};

exports.registerUser = async (req, res) => {
  const { email, name, password } = req.body.input || req.body;

  try {
    const hashed = await bcrypt.hash(password, 10);
    const mutation = REGISTER_USER;

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

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration Failed!" });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body.input || req.body;
  console.log("Login Param", email, password);

  const query = GET_USER_BY_EMAIL;

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
    console.log("Graphql user response:", user);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const token = generateToken(user.id);
    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
};

exports.sendOTP = async (req, res) => {
  const { email } = req.body.input || req.body;

  const otp = generateOTP();
  otpStore[email] = otp;
  console.log("OTPSTOREVALUE", otpStore);

  console.log("generated otp : ", otp);

  try {
    await sendEmail(email, "KiKi Demo Ecommerce App", `Your OTP is: ${otp}`);
    res.status(200).json({ success: true, message: "OTP sent successfully" });
    console.log("Sending Email Response:", res);
  } catch (err) {
    console.error("Sending Email Error >>", err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
};

exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body.input || req.body;
  console.log("OTP STORE VALUE >>", otpStore);

  if (otpStore[email] && otpStore[email] === otp) {
    delete otpStore[email];
    const updateUser = await axios.post(
      HASURA_ENDPOINT,
      {
        query: UPDATE_USER_STATE,
        variables: { email },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET,
        },
      }
    );
    console.log("Update User Result", updateUser);

    return res.status(200).json({ success: true, message: "OTP verified" });
  } else {
    return res.status(400).json({ success: false, message: "Invalid OTP" });
  }
};
