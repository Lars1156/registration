const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');

const app = express();
// Database Conntection 

const db  = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password:'kishan1156',
    database:'registration',
    insecureAuth:true,
});

db.connect((err)=>{
    if(err){
        console.error('Database connection failed: ', err.stack);
        return;
    }
    console.log('Database connection done');
});

// express middleware 
app.use(session({
    secret :"Your_secrect_key",
    resave: true,
    saveUninitialized: true
}));

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname,'public')));

app.get('/',(req, res)=>{
  res.redirect('login');
});

app.get('/login', (req,res)=>{
    res.render('login.ejs');

});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
  
     db.query (query,[username,password], (err,results)=>{
        if(err) throw err;
        if(results.length>0){
            req.session.username = username;
            req.redirect('./home');
        }
        else{
            res.redirect('./login');
        }
     });
});

app.post('/register', (req, res) => {
    const { username, password } = req.body;
    const query = 'INSERT INTO users (username, password) VALUES (?, ?)';

    db.query(query, [username, password], (err) => {
        if (err) throw err;
        res.redirect('/login');
    });
});

app.get('/home', (req, res) => {
    if (req.session.username) {
        res.render('home.ejs', { username: req.session.username });
    } else {
        res.redirect('/login');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

// Start the server
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
