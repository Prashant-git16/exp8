const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());

// LOGIN API
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  // dummy user check
  if (email === "test@example.com" && password === "123456") {
    const token = jwt.sign(
      { id: 1, role: "admin" }, // change role to "user" to test
      "secretkey",
      { expiresIn: "1h" }
    );

    return res.json({ token });
  }

  res.status(401).json({ error: "Invalid credentials" });
});

// PROTECTED ROUTE
app.get("/api/protected", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Missing token" });
  }

  try {
    const decoded = jwt.verify(token, "secretkey");
    res.json({ message: "Welcome " + decoded.role });
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
});

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});