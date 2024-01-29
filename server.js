const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mysql = require('mysql');

const app = express();
const port = 3000;

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'crud_img_db'
});

db.connect((err) => {
    if (err) {
        console.error('Error connection to database');
    } else {
        console.log('Connected to database');
    }
});

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

app.get('/add', (req, res) => {
    res.render('add');
});

app.post('/add', (req, res) => {
    let message = req.body.message;
    let imageLink = req.body.imageLink;
    let sql = 'INSERT INTO messages (message, image_link) VALUES (?, ?)';
    db.query(sql, [message, imageLink], (err, result) => {
      if (err) throw err;
      res.redirect('/');
    });
});

app.get('/', (req, res) => {
    let sql = 'SELECT * FROM messages';
    db.query(sql, (err, results) => {
      if (err) throw err;
      res.render('index', { messages: results });
    });
});

app.get('/delete/:id', (req, res) => {
    let sql = 'DELETE FROM messages WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
      if (err) throw err;
      res.redirect('/');
    });
});

app.get('/edit/:id', (req, res) => {
    let sql = 'SELECT * FROM messages WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
      if (err) throw err;
      res.render('edit', { message: result[0] });
    });
});

app.post('/edit/:id', (req, res) => {
    let newMessage = req.body.message;
    let newImageLink = req.body.imageLink;
    let sql = 'UPDATE messages SET message = ?, image_link = ? WHERE id = ?';
    db.query(sql, [newMessage, newImageLink, req.params.id], (err, result) => {
      if (err) throw err;
      res.redirect('/');
    });
});

app.listen(port, () => {
    console.log('Server is running');
});