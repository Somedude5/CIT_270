const express = require("express");

const app = express();

const port = 443;

const bodyParser = require("body-parser");

const Redis = require("redis");

const https = require('https');

const fs = require('fs');

const redisClient = Redis.createClient({url:"redis://127.0.0.1:6379"});

const {v4: uuidv4} = require('uuid');//generates a universely unique identifier

const cookieParser = require("cookie-parser");

app.use(cookieParser());

app.use(bodyParser.json()); //this looks for incoming data

app.use(express.static("public")); //this is the folder for node to search through.

app.use(async function (req, res, next){
    var cookie = req.cookies.stedicookie;
    if(cookie=== undefined && !req.url.includes("login") && !req.url.includes("html")&& req.url !== '/'){
        //no: set a new cookie
        res.status(401);
        res.send("no cookie");
    }
    else {
        //yes, cookie is already present
        res.status(200);
        next();
    }
});

app.post('/rapidsteptest', async (req, res)=>{
    const steps = req.body;
    await redisClient.zAdd('Steps',[{score:0,value:JSON.stringify(steps)}]); //the score is the index
    console.log('Steps', steps);
    res.send('saved');
})


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

// app.listen(port, () => {
//     redisClient.connect();
//     console.log("listening");
// });

// app.post('login username');

https.createServer(
    {key: fs.readFileSync('/etc/letsencrypt/live/parkerhatch.cit270.com/server.key'),
    cert: fs.readFileSync('/etc/letsencrypt/live/parkerhatch.cit270.com/cert.pem'),
    ca: fs.readFileSync('/etc/letsencrypt/live/parkerhatch.cit270.com/fullchain.pem')

},
app
).listen(port, ()=>{
    redisClient.connect();
    console.log('listening on port: ' + port);
});