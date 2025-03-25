const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const distressRoutes = require("./routes/distressRoutes");
const ngoRoutes = require("./routes/ngoRoutes");
const imageRoutes = require("./routes/imageRoutes");
const cors = require("cors");
dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes); // Login Routes -- Tested
app.use("/api/distress", distressRoutes); // Distress calls Routes -- Tested
app.use("/api/ngos", ngoRoutes); // NGO routes -- Tested
app.use("/api/images", imageRoutes); // Image upload routes -- Tested

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
