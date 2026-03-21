const express = require('express');
const itemsRoutes = require('./routes/items.routes');

const app = express();

app.use(express.json());
app.use('/items', itemsRoutes);

module.exports = app;