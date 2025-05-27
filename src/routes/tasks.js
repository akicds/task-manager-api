import express from 'express';
import { pool } from '../models/task.js';

const router = express.Router();

// Get all tasks
router.get('/', async (req, res) => {
    try {
        const [tasks] = await pool.execute('SELECT * FROM tasks');
        // Convert completed from TINYINT to boolean
        const formattedTasks = tasks.map(task => ({
            ...task,
            completed: Boolean(task.completed)
        }));
        res.json(formattedTasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a new task
router.post('/', async (req, res) => {
    try {
        const { title } = req.body;
        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        const [result] = await pool.execute(
            'INSERT INTO tasks (title) VALUES (?)',
            [title]
        );
        res.status(201).json({ message: 'Task created', id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a task
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { completed } = req.body;

        if (completed === undefined) {
            return res.status(400).json({ error: 'Completed field is required' });
        }

        // Check if task exists
        const [existingTask] = await pool.execute(
            'SELECT id FROM tasks WHERE id = ?',
            [id]
        );

        if (existingTask.length === 0) {
            return res.status(404).json({ error: `Task with id ${id} not found` });
        }

        await pool.execute(
            'UPDATE tasks SET completed = ? WHERE id = ?',
            [completed, id]
        );

        res.json({ message: 'Task updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a task
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.execute('DELETE FROM tasks WHERE id = ?', [id]);
        res.json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router; 