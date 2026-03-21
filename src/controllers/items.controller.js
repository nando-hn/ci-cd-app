const pool = require('../models/db');

// GET
const getItems = async (req, res) => {
  const result = await pool.query('SELECT * FROM items');
  res.json(result.rows);
};

// POST
const createItem = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  const result = await pool.query(
    'INSERT INTO items (name) VALUES ($1) RETURNING *',
    [name]
  );

  res.status(201).json(result.rows[0]);
};

// DELETE
const deleteItem = async (req, res) => {
  const { id } = req.params;

  const result = await pool.query(
    'DELETE FROM items WHERE id = $1 RETURNING *',
    [id]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ error: 'Item not found' });
  }

  res.json({ message: 'Deleted' });
};

module.exports = {
  getItems,
  createItem,
  deleteItem,
};