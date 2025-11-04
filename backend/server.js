const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect("mongodb+srv://shreyabonala_db_user:EmanrNWgJOu2QSmY@cluster0.tus6z2c.mongodb.net/?appName=Cluster0")
  .then(console.log("Connected to Dev database"));
const formDataSchema = new mongoose.Schema(
  {
    // Owner of this card (username from simple auth)
    owner: {
      type: String,
      trim: true,
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phNo: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },

    // --- Individual Skill Fields (Matches Form Input) ---
    skill1: {
      type: String,
      trim: true,
    },
    skill2: {
      type: String,
      trim: true,
    },
    skill3: {
      type: String,
      trim: true,
    },
    skill4: {
      type: String,
      trim: true,
    },

    // --- Customization/Design Properties ---
    gradient1: {
      type: String, // Stores hex code (e.g., '#000000')
      trim: true,
    },
    gradient2: {
      type: String, // Stores hex code
      trim: true,
    },
    color: {
      type: String, // Stores hex code
      trim: true,
    },
    radius: {
      type: String, // Stores the value as a number (e.g., 75)
      trim: true,
    },
  },
  {
    // Adds 'createdAt' and 'updatedAt' fields automatically
    timestamps: true,
  }
);

const formModel = mongoose.model("businessCard", formDataSchema);

// Simple user schema (stores username and plain password as requested)
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

app.post("/user/save", async (req, res) => {
  try {
    console.log("Received data:", req.body);
    const newUser = new formModel(req.body);
    const savedUser = await newUser.save();
    console.log("Data saved:", savedUser);
    res.status(201).json({
      message: "Data saved successfully",
      user: savedUser,
    });
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).json({
      message: "Error saving data",
      error: error.message,
    });
  }
});

// Register a new user (stores plain password per request — insecure in production)
app.post("/auth/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "username and password required" });
    }
    const exists = await User.findOne({ username });
    if (exists) {
      return res.status(409).json({ message: "username already exists" });
    }
    const newUser = new User({ username, password });
    await newUser.save();
    return res.status(201).json({ message: "User registered" });
  } catch (error) {
    console.error("Error registering user:", error);
    return res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
});

// Simple login (no tokens) — returns success if username/password match
app.post("/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "username and password required" });
    }
    const user = await User.findOne({ username, password });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    return res
      .status(200)
      .json({ message: "Login successful", user: { username: user.username } });
  } catch (error) {
    console.error("Error during login:", error);
    return res
      .status(500)
      .json({ message: "Error during login", error: error.message });
  }
});

// Endpoint to fetch all business cards (optionally filtered by username)
app.get("/user/cards", async (req, res) => {
  try {
    // If username query param is provided, return only that user's cards
    const username = req.query.username;
    const filter = {};
    if (username) filter.owner = username;
    const cards = await formModel.find(filter).sort({ createdAt: -1 });
    console.log(`Fetched ${cards.length} cards for`, username || "all users");
    res
      .status(200)
      .json({ message: "Cards fetched successfully", cards: cards });
  } catch (error) {
    console.error("Error fetching cards:", error);
    res
      .status(500)
      .json({ message: "Error fetching cards", error: error.message });
  }
});

app.listen(5000, () => {
  console.log("Server is running on 'http://localhost:5000'");
});

