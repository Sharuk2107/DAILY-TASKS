const express = require('express');
const cors = require('cors');
const {
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
} = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist')));

// Initialize Database
initDb();

// Login / Register
app.post('/api/login', async (req, res) => {
    try {
        const { username } = req.body;
        if (!username) return res.status(400).json({ error: 'Username required' });

        let user = await getUserByUsername(username);

        if (!user) {
            const id = Math.random().toString(36).substring(2) + Date.now().toString(36);
            user = await createUser(id, username, new Date().toISOString());
        }

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Current Task
app.get('/api/task/:userId', async (req, res) => {
    try {
        const task = await getTaskByUserId(req.params.userId);

        // Logic to clear task if it's from a previous day and not completed
        // (This matches the frontend logic we had)
        if (task) {
            const today = new Date().toDateString();
            const taskDate = new Date(task.created_at).toDateString();

            if (taskDate !== today && !task.completed) {
                return res.json(null);
            }
            // Convert 1/0 to boolean
            task.completed = !!task.completed;
        }

        res.json(task || null);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create Task
app.post('/api/task', async (req, res) => {
    try {
        const { userId, text, id, createdAt } = req.body;
        const task = {
            id: id || Math.random().toString(36).substring(2),
            userId,
            text,
            completed: false,
            createdAt: createdAt || new Date().toISOString()
        };

        await createTask(task);
        res.json(task);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Complete Task
app.post('/api/task/complete', async (req, res) => {
    try {
        const { taskId, userId, completedAt } = req.body;

        // Update task
        await updateTask(taskId, true, completedAt);

        // Update Streak Logic
        const today = new Date(completedAt).toDateString();

        // Add to history
        // Check if duplicate for today first? (Implementation detail: UI prevents double clicks, but backend should be safe)
        // For simplicity, we'll just add it and handle duplicates in retrieval or here
        const existingDates = await getCompletedDates(userId);
        const alreadyCompletedToday = existingDates.includes(today);

        if (!alreadyCompletedToday) {
            await addCompletedDate(userId, today);

            let streakData = await getStreak(userId);
            let newStreak = streakData.current_streak;

            if (streakData.last_completed_date) {
                const lastDate = new Date(streakData.last_completed_date);
                const currentDate = new Date(today);
                const diffDays = Math.floor((currentDate - lastDate) / (1000 * 60 * 60 * 24));

                if (diffDays === 1) {
                    newStreak += 1;
                } else if (diffDays > 1) {
                    newStreak = 1;
                }
            } else {
                newStreak = 1;
            }

            await updateStreak(userId, newStreak, today);
        }

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Streak Data
app.get('/api/streak/:userId', async (req, res) => {
    try {
        const streak = await getStreak(req.params.userId);
        const completedDates = await getCompletedDates(req.params.userId);

        res.json({
            currentStreak: streak.current_streak,
            lastCompletedDate: streak.last_completed_date,
            completedDates: completedDates
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Serve index.html for any other requests (Client-side routing)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
