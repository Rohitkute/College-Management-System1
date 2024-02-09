const exp = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bp = require('body-parser');

const app = exp();

app.use(cors());
app.use(bp.json());

app.listen(9000, () => {
    console.log('Server is running on port 9000 for the mini project...!');
});

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'miniproject',
});

con.connect((err) => {
    if (!err) {
        console.log('DB connected');
    } else {
        console.log('DB not connected');
        console.log(err.toString());
    }
});


app.post('/login', (req, res) => {
    const { email, password } = req.body;

    con.query(
        'SELECT * FROM tenant WHERE Email = ? AND Password = ?',
        [email, password],
        (err, results) => {
            if (err) {
                console.error('Login Error:', err);
                res.status(500).json({ error: 'Internal Server Error' });
            } else {
                if (results.length > 0) {
                    res.json({ success: true, user: results[0] });
                    console.log(results.toString())
                } else {
                    res.json({ success: false, message: 'Invalid email or password' });
                    console.log(res.toString());
                }
            }
        }
    );
});



app.post('/tenant', (req, res) => {
    console.log(req.body.name);
    con.query(
        'INSERT INTO tenant(Name, Mobile_Number, Email, Password) VALUES (?, ?, ?, ?)',
        [req.body.name, req.body.mobile, req.body.email, req.body.password],
        (err) => {
            if (!err) {
                res.send('Success...!');
            } else {
                console.log(err.toString());
                res.send('Failed...!');
            }
        }
    );
});

app.all('*', (req, res) => {
    res.send('Check URL');
});