import pool from '../config/db.js';

async function createTasksTable() {
    try {
        const connection = await pool.getConnection();
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS tasks (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                completed BOOLEAN DEFAULT FALSE
            )
        `);
        connection.release();
    } catch (error) {
        console.error('Error creating tasks table:', error);
        throw error;
    }
}

export {
    createTasksTable,
    pool
}; 