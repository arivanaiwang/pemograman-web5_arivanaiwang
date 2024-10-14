const express = require ('express')
const mysql = require ('mysql2')
const bodyParser = require ('body-parser')

const ariv = express()
ariv.use(bodyParser.urlencoded({extended : false}))
ariv.use(bodyParser.json())

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ariv'
})

connection.connect((err) => {
    if (err) {
        console.error("eror conecting to my mysql ;", err.stack)
        return
    }
    console.log("connected mysql berhasil " + connection.threadId)
})

ariv.set('view engine', 'ejs')

ariv.get('/', (req, res) => {
    const query = 'SELECT * FROM users'
    connection.query(query, (err, results) => {
        res.render('index', {users: results})
    })
})

ariv.post('/add', (req, res) => {
    const {name, email, phone} = req.body
    const query = 'INSERT INTO users (name, email, phone) VALUE (?,?,?)'
    connection.query(query, [name, email, phone], (err, results) => {
        if(err) throw err
        res.redirect('/')
    })
})

ariv.get('/edit/id:', (req, res) => {
    const query = 'SELECT * FROM users WHERE id = ?'
    connection.query(query, [req.params.id], (err, results) => {
        if(err) throw err
        res.render('edit', {user: results[0]})
    })
})

ariv.post('/update/:id', (req, res) => {
    const {name, email, phone} = req.body
    const query = 'UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?'
    connection.query(query, [name, email, phone, req.params.id], (err, results) => {
        if(err) throw err
        res.redirect('/')
    })
})


ariv.listen(3001, () =>{
    console.log('server berjalan di port 3000, buka di http://localhost:3001')
})