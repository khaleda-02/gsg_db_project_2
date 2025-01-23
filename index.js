const express = require("express");
const { Pool } = require("pg");
require("dotenv").config();
const app = express();
const port = 3001 || process.env.PORT;

const pool = new Pool({
  user: "postgres",
  password: "root",
  host: "localhost",
  port: 5432,
  database: "db_ad",
});

app.use(express.json());
app.use(express.urlencoded());

// Routes
// app.use("/api/auth", require("./routes/authRoutes"));
app.get("/api/data", async (req, res) => {
  try {
    const data = await pool.query("select * from movies_partitioned limit 10");
    return res.json(data.rows);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Server error" });
  }
});

app.post("/api/data", async (req, res) => {
  try {
    const { title, genre, director, year } = req.body;
    const data = await pool.query(
      `insert into movies_partitioned  (title, genre, director, release_year) values ('${title}', '${genre}','${director}', ${year})`,
    );
    return res.json("successfully added");
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Server error" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
