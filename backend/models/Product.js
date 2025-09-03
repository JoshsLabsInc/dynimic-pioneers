const { query, execute } = require('../config/db');

class Product {
    static async create({ name, description, price, category, sector, image_url }) {
        const result = await execute(
        `INSERT INTO products (name, description, price, category, sector, image_url) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        [name, description, price, category, sector, image_url]
        );
        return { id: result.insertId, ...product };
    }

    static async findBySector(sector) {
        return await query('SELECT * FROM products WHERE sector = ?', [sector]);
    }

    static async findByCategory(category) {
        return await query('SELECT * FROM products WHERE category = ?', [category]);
    }

    static async findById(id) {
        const [product] = await query('SELECT * FROM products WHERE id = ?', [id]);
        return product;
    }

    static async update(id, updates) {
        const { name, description, price, category, sector, image_url } = updates;
        await execute(
        `UPDATE products SET 
            name = COALESCE(?, name),
            description = COALESCE(?, description),
            price = COALESCE(?, price),
            category = COALESCE(?, category),
            sector = COALESCE(?, sector),
            image_url = COALESCE(?, image_url)
        WHERE id = ?`,
        [name, description, price, category, sector, image_url, id]
        );
        return this.findById(id);
    }

    static async delete(id) {
        await execute('DELETE FROM products WHERE id = ?', [id]);
    }
}

module.exports = Product;