/** server.js **/
const express = require("express");
const request = require("request");
const qstring = require("querystring");

const jwt = require("jwt-simple");
const admin = require("./libs/server_admin.js");
const service = require("./libs/service.js");

var app = express();
app.use("/app", express.static("app/build"));
app.use("/login", express.static("login/build"));

function errFn(res, err){
    if(!process.env.DEBUG || !err){
        err = "woah, watch out there";
    }

    res.status(400);
    res.send(err);
}

/** fb authentication **/
app.get("/fb", (req, res) => {
    code = req.query["code"];
    state = req.query["state"];

    siteId = req.query["clientId"];
    callbackURL = req.query["callback"];

    if(!code || !state){
        if(!siteId || !callbackURL){
            res.status(400);
            return res.send("woah, watch out right there.");
        }

        service.fbIntiate(siteId, callbackURL)
        .then(url => res.redirect(url))
        .catch(err => errFn(err, res));
    }else{
        service.fbComplete(code, state)
        .then(url => res.redirect(url))
        .catch(err => errFn(res, err));
    }
});

/** admin endpoints **/
function extractJwt(req){
    return req.get("Authorization").split("Bearer ")[1];
}

app.get("/signin", (req, res) => {
    admin.signin("https://"+process.env.HOST+"/app")
    .then(url => res.redirect(url));
});

app.get("/getSites", (req, res) => {
    admin.getSites(extractJwt(req))
    .then(sites => res.send(JSON.stringify(sites)))
    .catch(err => errFn(res, err));
});

app.get("/addSite", (req, res) => {
    var domain = req.query.domain;
    if(!domain){ return errFn(res); }

    admin.addSite(extractJwt(req), domain)
    .then(site => res.send(JSON.stringify(site)))
    .catch(err => errFn(res, err));
});

app.get("/delSite", (req, res) => {
    var siteid = req.query.site;
    var secret = req.query.secret;
    if(!siteid || !secret){ return errFn(res); }

    admin.delSite(extractJwt(req), siteid, secret)
    .then(() => res.send(JSON.stringify({})))
    .catch(err => errFn(res, err));
});

app.get("/genSecret", (req, res) => {
    var siteid = req.query.site;
    var secret = req.query.secret;
    if(!siteid || !secret){ return errFn(res); }

    admin.genSecret(extractJwt(req), siteid, secret)
    .then(() => res.send(JSON.stringify({})))
    .catch(err => errFn(res, err));
});

var listener = app.listen(3000, function(){
    console.log("running on port "+listener.address().port);
});
