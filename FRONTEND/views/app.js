// frontend/app.js
const express = require('express');
const app = express();
const path = require('path');

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Frontend running at http://localhost:${PORT}`);
});