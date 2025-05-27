import express from 'express';
import cors from 'cors';
import tasksRouter from './routes/tasks.js';
import { createTasksTable } from './models/task.js';
import pool from './config/db.js';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Pretty print JSON responses
app.set('json spaces', 2);

// Function to wait for database connection
const waitForDatabase = async (retries = 10, delay = 5000) => {
    for (let i = 0; i < retries; i++) {
        try {
            const connection = await pool.getConnection();
            connection.release();
            console.log('Successfully connected to database');
            return true;
        } catch (error) {
            if (i === retries - 1) throw error;
            console.log(`Database not ready, retrying in ${delay}ms... (${i + 1}/${retries})`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
};

// Initialize database and start server
waitForDatabase()
    .then(() => createTasksTable())
    .then(() => {
        // Routes
        app.use('/tasks', tasksRouter);

        // Health check endpoint
        app.get('/health', async (req, res) => {
            try {
                const [result] = await pool.execute('SELECT 1');
                res.json({
                    status: 'healthy',
                    database: 'connected',
                    result: result[0]
                });
            } catch (error) {
                res.status(500).json({
                    status: 'unhealthy',
                    database: 'disconnected',
                    error: error.message
                });
            }
        });

        // Error handling middleware
        app.use((err, req, res, next) => {
            console.error(err.stack);
            res.status(500).json({
                status: 'error',
                message: 'Something went wrong!',
                error: process.env.NODE_ENV === 'development' ? err.message : undefined
            });
        });

        // 404 handler
        app.use((req, res) => {
            res.status(404).json({
                status: 'error',
                message: 'Route not found'
            });
        });

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch(error => {
        console.error('Failed to initialize database:', error);
        process.exit(1);
    }); 