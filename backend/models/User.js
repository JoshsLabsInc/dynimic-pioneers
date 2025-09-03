const { query, execute } = require('../config/db');

class User {
    static async create({ username, email, password }) {
        const result = await execute(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, password]
        );
        return { id: result.insertId, username, email };
    }

    static async findByEmail(email) {
        const [user] = await query('SELECT * FROM users WHERE email = ?', [email]);
        return user;
    }

    static async findById(id) {
        const [user] = await query('SELECT * FROM users WHERE id = ?', [id]);
        return user;
    }

    static async updatePassword(id, newPassword) {
        await execute('UPDATE users SET password = ? WHERE id = ?', [newPassword, id]);
    }
}

module.exports = User;