// load the things we need
const express = require('express');
const app = express();
const path = require('path');

app.use(express.static('public'));

// set the view engine to ejs
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(8080);
console.log('8080 is the magic port');