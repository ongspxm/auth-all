/** server.js **/
const express = require("express");
const request = require("request");
const qstring = require("querystring");

const admin = require("./libs/server_admin.js");
const service = require("./libs/service.js");

var app = express();
app.use("/app", express.static("app/build"));

// fb authentication
app.get("/fb", (req, res) => {
    code = req.query["code"];
    state = req.query["state"];

    siteId = req.query["clientId"];
    callbackURL = req.query["callback"];
    
    errFn = err => { 
        res.status(400); 
        if(!process.env.DEBUG){ err=""; }
        res.send(err);
    };

    if(!code || !state){
        if(!siteId || !callbackURL){
            res.status(400);
            return res.send("woah, watch out right there.");
        }

        service.fbIntiate(siteId, callbackURL)
        .then(url => res.redirect(url))
        .catch(errFn);
    }else{
        service.fbComplete(code, state)
        .then(url => res.redirect(url))
        .catch(errFn);
    }
});

// admin endpoints
app.get("/signin", (req, res) => {
    admin.signin("https://"+process.env.HOST+"/app")
    .then(url => res.redirect(url)); 
});

var listener = app.listen(3000, function(){
    console.log("running on port "+listener.address().port);
});
