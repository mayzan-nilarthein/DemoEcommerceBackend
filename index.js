require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const graphqlRoutes = require("./routes/graphqlRoute");
const adminRoutes = require("./routes/adminRoutes");
const imageRoute = require("./routes/imageRoute");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/auth/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/graphql", graphqlRoutes);
app.use("/", imageRoute);

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
