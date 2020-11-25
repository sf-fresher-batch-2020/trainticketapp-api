const express = require('express')
const app = express()
app.use(express.json())
const port = 3000
const mysql = require("mysql2/promise");
const pool = mysql.createPool({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "saibrindha2704!",
    database: "test1_db",
    connectionLimit: 10
});
//routes
app.post('/api/users', createUser);
app.get("/api/users", getAllUsers);
app.post("/api/users/login", login);
app.get("/api/trains", listAllTrains);
app.post('/api/addtrains', addTrains);
async function createUser(req, res) {
    let user = req.body;
    console.log(user);
    //insert the user details into users table
    let params = [user.name, user.email, user.password, user.role];
    const result = await pool.query("insert into users (name,email,password,role) values ( ?,?,?,?)", params);
    let id = result[0].insertId;
    res.status(200).json({ id: id });
}
//get the user details
async function getAllUsers(req, res) {
    const result = await pool.query("select id,name,email,role from users");
    let users = result[0];
    res.status(200).json(users);
}
//login api
async function login(req, res) {
    let { email, password } = req.body;
    let params = [email, password];
    let result = await pool.query("select id,name,email,role from users where email=? and password = ?", params);
    let users = result[0];
    if (users.length == 0) {
        res.json({ message: "Invalid Login Credentials" });
    }
    else {
        let user = users[0];
        res.json(user);
    }
}
//get the train details
async function listAllTrains(req, res) {
    const result = await pool.query("select trainnumber,trainname,source,destination from trains");
    let trains = result[0];
    res.status(200).json(trains);
}

 //insert the train details into trains table
async function addTrains(req, res) {
   const addTrain = req.body;
   console.log(addTrain);
   let params = [addTrain.trainnumber, addTrain.trainname, addTrain.source, addTrain.destination];
   const result = await pool.query("insert into trains (trainnumber,trainname,source,destination) values ( ?,?,?,?)", params);
   let id = result[0].insertId;
   res.status(200).json({ id: id }); 


app.listen(port, () => console.log(`Example app listening on port port!`))
}