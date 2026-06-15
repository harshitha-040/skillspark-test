const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "23nm220",
  database: "skillspark",
});

db.connect((err) => {
  if (err) {
    console.error("DB connection failed:", err);
    process.exit(1);
  }
  console.log("Connected to MySQL");

  const sql = "ALTER TABLE test_results ADD COLUMN IF NOT EXISTS time_taken INT DEFAULT 0 AFTER difficulty";
  
  db.query(sql, (err) => {
    if (err) {
      console.error("Error altering table:", err);
      process.exit(1);
    }
    console.log("Table altered successfully (time_taken added)");
    db.end();
  });
});
