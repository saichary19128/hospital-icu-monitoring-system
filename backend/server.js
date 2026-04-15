const express = require("express");
const cors = require("cors");
require("dotenv").config();

const ocrRoutes = require("./routes/ocrRoutes");


const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const bedRoutes = require("./routes/bedRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/hospitals", require("./routes/hospitalRoutes"));

app.use("/api", ocrRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/beds", bedRoutes);

app.get("/", (req, res) => {
  res.send("API Running 🚀");
});
const PORT=process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
