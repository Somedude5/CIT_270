const express = require("express");

const app = express();

const port = 3000;

const bodyParser = require("body-parser");

const {v4: uuidv4} = require('uuid');//generates a universely unique identifier

app.use(bodyParser.json()); //this looks for incoming data


app.get("/", (req, res) => {
    res.send("hello bruh, this is your own pocket dimension! The Beatles...hello bruh");
});

app.post('/login', (req, res) =>{
    const loginuser = req.body.userName;
    const password = req.body.password;//Access the password data in the body

    console.log('Login username: '+loginuser);
    

    if (loginuser == "heyo@gmail.com" && password == "Br&65!gh"){
        const loginToken = uuidv4();
        res.send(loginToken);
    } else {
        res.status(401);//unauthorized response
        res.send('Incorrect password for '+loginuser)
    }
});

app.listen(port, () => {
    console.log("listening");
});

app.post('login username')