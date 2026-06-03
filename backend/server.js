const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();

/* =========================
   MIDDLEWARE
========================= */

app.use(cors());
app.use(express.json());

/* =========================
   MYSQL CONNECTION
========================= */

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "23nm220",
  database: "skillspark",
});

db.connect((err) => {

  if (err) {

    console.log(
      "DB connection failed:",
      err
    );

  } else {

    console.log(
      "Connected to MySQL"
    );

  }

});

/* =========================
   HOME ROUTE
========================= */

app.get("/", (req, res) => {

  res.send(
    "SkillSpark Backend Running"
  );

});

/* =========================
   SIGNUP API
========================= */

app.post("/signup", (req, res) => {

  const {
  username,
  email,
  password,
  plan,
} = req.body;

  const sql = `
    INSERT INTO users
    (
      username,
      email,
      password,
      plan
    )
    VALUES (?, ?, ?, ?)
  `;

  db.query(

    sql,

    [
  username,
  email,
  password,
  plan || "free",
],

    (err) => {

      if (err) {

        console.log(err);

        return res.json({
          success: false,
          message:
            "Error inserting user",
        });

      }

      res.json({
        success: true,
        message:
          "User registered successfully",
      });

    }

  );

});

/* =========================
   LOGIN API
========================= */

app.post("/login", (req, res) => {

  const {
    email,
    password,
  } = req.body;

  const sql = `
    SELECT *
    FROM users
    WHERE email = ?
  `;

  db.query(
    sql,
    [email],
    (err, result) => {

      if (err) {

        return res.json({
          success: false,
          message: "Server error",
        });

      }

      if (
        result.length === 0
      ) {

        return res.json({
          success: false,
          message:
            "User not found",
        });

      }

      const user = result[0];

      if (
        user.password !==
        password
      ) {

        return res.json({
          success: false,
          message:
            "Wrong password",
        });

      }

      const {
        password: _,
        ...safeUser
      } = user;

      res.json({
        success: true,
        user: safeUser,
      });

    }
  );

});

/* =========================
   SELECT PLAN API
========================= */

app.post(
  "/api/select-plan",
  (req, res) => {

    const {
      userId,
      plan,
    } = req.body;

    const sql = `
      UPDATE users
      SET plan = ?
      WHERE id = ?
    `;

    db.query(
      sql,
      [plan, userId],
      (err) => {

        if (err) {

          console.log(
            "Plan Update Error:",
            err
          );

          return res.status(500).json({
            success: false,
          });

        }

        res.json({
          success: true,
        });

      }
    );

  }
);

/* =========================
   SAVE TEST RESULT API
========================= */

app.post(
  "/api/save-result",
  (req, res) => {

    console.log(
      "SAVE RESULT BODY:",
      req.body
    );

    const {

      user_id,
      technology_id,
      score,
      total_questions,
      correct_answers,
      difficulty,

    } = req.body;

    /* =========================
       GET USER PLAN
    ========================= */

    const userSql = `
      SELECT plan
      FROM users
      WHERE id = ?
    `;

    db.query(
      userSql,
      [user_id],
      (err, userResult) => {

        if (err) {

          console.log(err);

          return res.status(500).json({
            success: false,
          });

        }

        const user =
          userResult[0];

        if (!user) {

          return res.status(404).json({
            success: false,
          });

        }

        /* =========================
           FREE PLAN LIMIT
        ========================= */

        const countSql = `
          SELECT COUNT(*) AS total
          FROM test_results
          WHERE user_id = ?
        `;

        db.query(
          countSql,
          [user_id],
          (err, countResult) => {

            if (err) {

              console.log(err);

              return res.status(500).json({
                success: false,
              });

            }

            const totalTests =
              countResult[0].total;

            if (
              user.plan ===
                "free" &&
              totalTests >= 2
            ) {

              return res.status(403).json({
                success: false,
                message:
                  "Free plan limit reached",
              });

            }

            /* =========================
               SAVE RESULT
            ========================= */

            const saveSql = `
              INSERT INTO test_results
              (
                user_id,
                technology_id,
                score,
                total_questions,
                correct_answers,
                difficulty
              )
              VALUES (?, ?, ?, ?, ?, ?)
            `;

            db.query(

              saveSql,

              [
                user_id,
                technology_id,
                score,
                total_questions,
                correct_answers,
                difficulty,
              ],

              (err) => {

                if (err) {

                  console.log(
                    "SAVE ERROR:",
                    err
                  );

                  return res.status(500).json({
                    success: false,
                  });

                }

                console.log(
                  "RESULT SAVED"
                );

                res.json({
                  success: true,
                });

              }

            );

          }
        );

      }
    );

  }
);

/* =========================
   DASHBOARD STATS API
========================= */


/* =========================
   CHECK TEST ACCESS API
========================= */

app.get(
  "/api/check-test-access/:userId",

  (req, res) => {

    const userId =
      req.params.userId;

    /* =========================
       GET USER PLAN
    ========================= */

    const userSql = `
      SELECT plan
      FROM users
      WHERE id = ?
    `;

    db.query(
      userSql,
      [userId],

      (err, userResult) => {

        if (err) {

          return res.status(500).json({
            success: false,
          });

        }

        if (
          userResult.length === 0
        ) {

          return res.status(404).json({
            success: false,
          });

        }

        const user =
          userResult[0];

        /* =========================
           COUNT TESTS
        ========================= */

        const countSql = `
          SELECT COUNT(*) AS totalTests
          FROM test_results
          WHERE user_id = ?
        `;

        db.query(
          countSql,
          [userId],

          (err, result) => {

            if (err) {

              return res.status(500).json({
                success: false,
              });

            }

            const totalTests =
              Number(
                result[0].totalTests
              );

            /* =========================
               FREE PLAN LIMIT
            ========================= */

            if (
              user.plan === "free" &&
              totalTests >= 2
            ) {

              return res.json({

                allowed: false,

                message:
                  "Free plan test limit reached",

              });

            }

            return res.json({

              allowed: true,

            });

          }
        );

      }
    );

  }
);

app.get(
  "/api/dashboard/:userId",
  (req, res) => {

    const userId =
      req.params.userId;

    const sql = `
      SELECT

        COUNT(*) AS totalTests,

        ROUND(
          AVG(score),
          2
        ) AS averageScore,

        COUNT(
  DISTINCT CASE
    WHEN score >= 75
    THEN technology_id
  END
) AS technologies,

        MAX(score)
        AS highestScore

      FROM test_results

      WHERE user_id = ?
    `;

    db.query(
      sql,
      [userId],
      (err, result) => {

        if (err) {

          console.log(err);

          return res.status(500).json({
            success: false,
          });

        }

        res.json(result[0]);

      }
    );

  }
);

/* =========================
   CHART DATA API
========================= */

app.get(
  "/api/chart-data/:userId",
  (req, res) => {

    const userId =
      req.params.userId;

    /* =========================
       PERFORMANCE CHART
    ========================= */

    const performanceSql = `
SELECT
  DATE_FORMAT(created_at, '%d %b %h:%i %p') AS label,
  t.name AS technology,
  score
FROM test_results tr
JOIN technologies t
ON tr.technology_id = t.id
WHERE tr.user_id = ?
ORDER BY created_at ASC
LIMIT 10
`;

    /* =========================
       PIE CHART
    ========================= */

    const techSql = `
  SELECT

    t.name AS name,

    CAST(
      ROUND(AVG(tr.score), 0)
      AS SIGNED
    ) AS value

  FROM test_results tr

  JOIN technologies t
  ON tr.technology_id = t.id

  WHERE tr.user_id = ?

  GROUP BY t.name

  ORDER BY AVG(tr.score) DESC
`;

    /* =========================
       BAR CHART
    ========================= */

    const scoreSql = `
  SELECT

    t.name AS tech,

    CAST(
      ROUND(AVG(tr.score), 0)
      AS SIGNED
    ) AS score

  FROM test_results tr

  JOIN technologies t
  ON tr.technology_id = t.id

  WHERE tr.user_id = ?

  GROUP BY t.name

  ORDER BY AVG(tr.score) DESC
`;

    db.query(

      performanceSql,

      [userId],

      (err, performanceData) => {

        if (err) {

          console.log(
            "Performance Error:",
            err
          );

          return res.status(500).json({
            success: false,
          });

        }

        db.query(
          techSql,
          [userId],
          (err, techData) => {

            if (err) {

              console.log(
                "Tech Error:",
                err
              );

              return res.status(500).json({
                success: false,
              });

            }

            db.query(
              scoreSql,
              [userId],
              (err, scoreData) => {

                if (err) {

                  console.log(
                    "Score Error:",
                    err
                  );

                  return res.status(500).json({
                    success: false,
                  });

                }

                res.json({

                  performanceData,

                  techData,

                  scoreData,

                });

              }
            );

          }
        );

      }
    );

  }
);

/* =========================
   AI INSIGHTS API
========================= */
app.get(
  "/api/ai-insights/:userId",

  (req, res) => {

    const userId =
      req.params.userId;

    const query = `

      SELECT

        technologies.name AS technology,

        CAST(
          ROUND(
            AVG(test_results.score),
            0
          ) AS SIGNED
        ) AS averageScore

      FROM test_results

      JOIN technologies
      ON test_results.technology_id = technologies.id

      WHERE test_results.user_id = ?

      GROUP BY technologies.name

      ORDER BY averageScore DESC

    `;

    db.query(

      query,

      [userId],

      (err, results) => {

        if (err) {

          console.log(err);

          return res.status(500).json({
            error: "Database error",
          });

        }

        if (results.length === 0) {

          return res.json({

            strongestSkill: "No Data",
            strongestScore: 0,

            weakestSkill: "No Data",
            weakestScore: 0,

            recommendation:
              "Take tests to get AI insights.",

          });

        }

        const strongest =
          results[0];

        const weakest =
          results[
            results.length - 1
          ];

        const recommendation =
          `Improve ${weakest.technology} with focused practice.`;

        res.json({

          strongestSkill:
            strongest.technology,

          strongestScore:
            strongest.averageScore,

          weakestSkill:
            weakest.technology,

          weakestScore:
            weakest.averageScore,

          recommendation,

        });

      }

    );

  }

);

/* =========================
   BADGES API
========================= */

app.get(
  "/api/badges/:userId",

  (req, res) => {

    const userId =
      req.params.userId;

    /* =========================
       GET USER PLAN
    ========================= */

    const planSql = `
      SELECT plan
      FROM users
      WHERE id = ?
    `;

    /* =========================
       USER STATS
    ========================= */

    const statsSql = `
      SELECT

        COUNT(*) AS totalTests,

        COUNT(
          DISTINCT technology_id
        ) AS technologies,

        CAST(
          ROUND(
            AVG(score),
            0
          ) AS SIGNED
        ) AS avgScore,

        MAX(score)
        AS highestScore

      FROM test_results

      WHERE user_id = ?
    `;

    /* =========================
       ADVANCED TEST COUNT
    ========================= */

    const advancedSql = `
      SELECT COUNT(*) AS total

      FROM test_results

      WHERE user_id = ?

      AND difficulty = 'Advanced'
    `;

    /* =========================
       TECHNOLOGY AVERAGES
    ========================= */

    const techSql = `
      SELECT

        t.name,

        CAST(
          ROUND(
            AVG(tr.score),
            0
          ) AS SIGNED
        ) AS avgScore

      FROM test_results tr

      JOIN technologies t
      ON tr.technology_id = t.id

      WHERE tr.user_id = ?

      GROUP BY t.name
    `;

    db.query(
      planSql,
      [userId],

      (err, planResult) => {

        if (err) {

          console.log(err);

          return res.status(500).json({
            success: false,
          });

        }

        const userPlan =
          planResult[0]?.plan
            ?.toLowerCase() || "free";

        db.query(
          statsSql,
          [userId],

          (err, statsResult) => {

            if (err) {

              console.log(err);

              return res.status(500).json({
                success: false,
              });

            }

            db.query(
              advancedSql,
              [userId],

              (err, advancedResult) => {

                if (err) {

                  console.log(err);

                  return res.status(500).json({
                    success: false,
                  });

                }

                db.query(
                  techSql,
                  [userId],

                  (err, techResult) => {

                    if (err) {

                      console.log(err);

                      return res.status(500).json({
                        success: false,
                      });

                    }

                    const stats =
                      statsResult[0];

                    const earned = [];

                    const locked = [];

                    /* =========================
                       FREE BADGES
                    ========================= */

                    if (
                      stats.totalTests >= 1
                    ) {

                      earned.push({
                        title:
                          "First Attempt",

                        icon: "🏁",

                        tier: "free",
                      });

                    }

                    if (
                      stats.totalTests >= 5
                    ) {

                      earned.push({
                        title:
                          "Learner",

                        icon: "📚",

                        tier: "free",
                      });

                    }

                    if (
                      stats.highestScore >= 80
                    ) {

                      earned.push({
                        title:
                          "High Scorer",

                        icon: "🎯",

                        tier: "free",
                      });

                    }

                    if (
                      stats.technologies >= 3
                    ) {

                      earned.push({
                        title:
                          "Curious Mind",

                        icon: "🧠",

                        tier: "free",
                      });

                    }

                    /* =========================
                       STANDARD BADGES
                    ========================= */

                    if (
                      userPlan === "standard" ||
                      userPlan === "pro"
                    ) {

                      if (
                        stats.avgScore >= 70
                      ) {

                        earned.push({
                          title:
                            "Rising Developer",

                          icon: "🚀",

                          tier: "standard",
                        });

                      }

                    } else {

                      locked.push({
                        title:
                          "Rising Developer",

                        icon: "🔒",

                        tier: "standard",
                      });

                    }

                    /* =========================
                       PRO BADGES
                    ========================= */

                    if (
                      userPlan === "pro"
                    ) {

                      if (
                        advancedResult[0]
                          .total > 0
                      ) {

                        earned.push({
                          title:
                            "Advanced Challenger",

                          icon: "👑",

                          tier: "pro",
                        });

                      }

                      if (
                        stats.avgScore >= 85
                      ) {

                        earned.push({
                          title:
                            "Elite Developer",

                          icon: "💎",

                          tier: "pro",
                        });

                      }

                      techResult.forEach(
                        (tech) => {

                          if (

                            tech.name
                              .toLowerCase() ===
                              "core java"

                            &&

                            tech.avgScore >= 80

                          ) {

                            earned.push({
                              title:
                                "Core Java Master",

                              icon: "☕",

                              tier: "pro",
                            });

                          }

                          if (

                            tech.name
                              .toLowerCase() ===
                              "python"

                            &&

                            tech.avgScore >= 80

                          ) {

                            earned.push({
                              title:
                                "Python Master",

                              icon: "🐍",

                              tier: "pro",
                            });

                          }

                        }
                      );

                    } else {

                      locked.push({
                        title:
                          "Advanced Challenger",

                        icon: "🔒",

                        tier: "pro",
                      });

                      locked.push({
                        title:
                          "Elite Developer",

                        icon: "🔒",

                        tier: "pro",
                      });

                      locked.push({
                        title:
                          "Core Java Master",

                        icon: "🔒",

                        tier: "pro",
                      });

                      locked.push({
                        title:
                          "Python Master",

                        icon: "🔒",

                        tier: "pro",
                      });

                    }

                    res.json({

                      earned,

                      locked,

                    });

                  }
                );

              }
            );

          }
        );

      }
    );

  }

);
/* =========================
   GET TECHNOLOGIES API
========================= */

app.get(
  "/api/technologies",
  (req, res) => {

    const sql = `
      SELECT *
      FROM technologies
      ORDER BY id ASC
    `;

    db.query(
      sql,
      (err, result) => {

        if (err) {

          console.log(err);

          return res.status(500).json({
            success: false,
          });

        }

        res.json(result);

      }
    );

  }
);

/* =========================
   START SERVER
========================= */

app.listen(5000, () => {

  console.log(
    "Server running on port 5000"
  );

});