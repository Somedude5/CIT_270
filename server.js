const express = require("express");

const app = express();

const port = 3000;

const bodyParser = require("body-parser");

const Redis = require("redis");

const redisClient = Redis.createClient({url:"redis://127.0.0.1:6379"});

const {v4: uuidv4} = require('uuid');//generates a universely unique identifier

app.use(bodyParser.json()); //this looks for incoming data

app.use(express.static("public")); //this is the folder for node to search through.

app.get("/", (req, res) => {
    res.send("hello bruh, this is your own pocket dimension! The Beatles...hello bruh");
});

app.post('/login', async(req, res) =>{
    const loginuser = req.body.userName;
    const password = req.body.password;//Access the password data in the body

    console.log('Login username: '+loginuser);
    
    const correctpassword = await redisClient.hGet('UserMap',loginuser)

    if (password == correctpassword){
        const loginToken = uuidv4();
        res.send(loginToken);
    } else {
        res.status(401);//unauthorized response
        res.send('Incorrect password for ' + loginuser)
    }
});

app.listen(port, () => {
    redisClient.connect();
    console.log("listening");
});

app.post('login username')