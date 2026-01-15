const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = process.env.DB_PATH || path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

function initDb() {
    db.serialize(() => {
        // Users table
        db.run(`CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE,
      created_at TEXT
    )`);

        // Tasks table
        db.run(`CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      text TEXT,
      completed BOOLEAN,
      created_at TEXT,
      completed_at TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )`);

        // Streaks table
        db.run(`CREATE TABLE IF NOT EXISTS streaks (
      user_id TEXT PRIMARY KEY,
      current_streak INTEGER,
      last_completed_date TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )`);

        // Completed Dates (history for visualization)
        db.run(`CREATE TABLE IF NOT EXISTS completed_dates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT,
      date TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )`);
    });
}

// Database Helper Functions

const getUserByUsername = (username) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

const createUser = (id, username, createdAt) => {
    return new Promise((resolve, reject) => {
        db.run(
            'INSERT INTO users (id, username, created_at) VALUES (?, ?, ?)',
            [id, username, createdAt],
            function (err) {
                if (err) reject(err);
                else resolve({ id, username, created_at: createdAt });
            }
        );
    });
};

const getTaskByUserId = (userId) => {
    return new Promise((resolve, reject) => {
        // Get the most recent task
        db.get(
            'SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
            [userId],
            (err, row) => {
                if (err) reject(err);
                else resolve(row);
            }
        );
    });
};

const createTask = (task) => {
    return new Promise((resolve, reject) => {
        db.run(
            'INSERT INTO tasks (id, user_id, text, completed, created_at) VALUES (?, ?, ?, ?, ?)',
            [task.id, task.userId, task.text, task.completed ? 1 : 0, task.createdAt],
            function (err) {
                if (err) reject(err);
                else resolve(task);
            }
        );
    });
};

const updateTask = (id, completed, completedAt) => {
    return new Promise((resolve, reject) => {
        db.run(
            'UPDATE tasks SET completed = ?, completed_at = ? WHERE id = ?',
            [completed ? 1 : 0, completedAt, id],
            function (err) {
                if (err) reject(err);
                else resolve({ id, completed, completedAt });
            }
        );
    });
};

const getStreak = (userId) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM streaks WHERE user_id = ?', [userId], (err, row) => {
            if (err) reject(err);
            else resolve(row || { user_id: userId, current_streak: 0, last_completed_date: null });
        });
    });
};

const updateStreak = (userId, currentStreak, lastCompletedDate) => {
    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO streaks (user_id, current_streak, last_completed_date) 
       VALUES (?, ?, ?) 
       ON CONFLICT(user_id) DO UPDATE SET 
       current_streak = ?, last_completed_date = ?`,
            [userId, currentStreak, lastCompletedDate, currentStreak, lastCompletedDate],
            function (err) {
                if (err) reject(err);
                else resolve();
            }
        );
    });
};

const addCompletedDate = (userId, date) => {
    return new Promise((resolve, reject) => {
        db.run(
            'INSERT INTO completed_dates (user_id, date) VALUES (?, ?)',
            [userId, date],
            function (err) {
                if (err) reject(err);
                else resolve();
            }
        );
    });
};

const getCompletedDates = (userId, limit = 30) => {
    return new Promise((resolve, reject) => {
        db.all(
            'SELECT date FROM completed_dates WHERE user_id = ? ORDER BY date DESC LIMIT ?',
            [userId, limit],
            (err, rows) => {
                if (err) reject(err);
                else resolve(rows.map(r => r.date));
            }
        );
    });
};

module.exports = {
    db,
    initDb,
    getUserByUsername,
    createUser,
    getTaskByUserId,
    createTask,
    updateTask,
    getStreak,
    updateStreak,
    addCompletedDate,
    getCompletedDates
};
