const express = require("express");

const app = express();

const port = 3000;

const bodyParser = require("body-parser");

const Redis = require("redis");



const redisClient = Redis.createClient({url:"redis://127.0.0.1:6379"});

const {v4: uuidv4} = require('uuid');//generates a universely unique identifier
const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use(bodyParser.json()); //this looks for incoming data

app.use(express.static("public")); //this is the folder for node to search through.

app.get("/", (req, res) => {
    res.send("hello bruh, this is your own pocket dimension!");
});

app.get("/validate", async(req, res) =>{
    const loginToken = req.cookies.stedicookie;
    console.log("loginToken", loginToken);
    const loginUser = await redisClient.hGet('TokenMap', loginToken);
    res.send(loginUser);
});

app.post('/login', async(req, res) =>{
    const loginUser = req.body.userName;
    const password = req.body.password;//Access the password data in the body

    console.log('Login username: '+loginUser);
    
    const correctpassword = await redisClient.hGet('UserMap',loginUser)

    if (password == correctpassword){
        const loginToken = uuidv4();
        await redisClient.hSet("TokenMap",loginToken, loginUser); //addtoken to map, the 1st is the id tag, the 2nd is the info stored
        res.cookie('stedicookie', loginToken);
        res.send(loginToken);
    }
     else {
        res.status(401);//unauthorized response
        res.send('Incorrect password for ' + loginUser)
    }
});

app.listen(port, () => {
    redisClient.connect();
    console.log("listening");
});

app.post('login username')