/** libs/mail/__tests__/mail_users.js */
const fs = require("fs");
const assert = require("assert");

const DB_TMP = ".data/tmp.db";
const dbase = require("../../dbase.js");
const users = require("../users.js");

function getDB(){
    return (new sqlite.Database(DB_TMP));
}

describe("lib/mail/users.js", () => {
    beforeAll(() => {
        process.env.DB_DBASE = DB_TMP;
    });

    beforeEach((done) => {
        dbase.setup().then(() => done());
    });

    afterEach((done) => {
        fs.unlink(DB_TMP, () => done());
    });

    describe("#getUser()", () => {
        it("all good.", function(done){
            var email = "asdf@example.com";

            dbase.insert("mail_users", {email:email})
            .then(() => users.getUser(email))
            .then((usr) => assert.equal(usr.imgur_id, "rJd70DS"))
            .then(() => done());
        });

        it("doesnt exist.", function(done){
            users.getUser("asdf@example.com")
            .then((usr) => assert.ok(!usr))
            .then(() => done());
        });
    });

    describe("#changeName()", function(){
        it("all good.", done => {
            var email = "asdf@example.com";
            var name1 = "asdf";
            var name2 = "qwerty";

            dbase.insert("mail_users", {email:email, name:name1})
            .then(() => users.changeName(email, name2))
            .then(() => users.getUser(email))
            .then((usr) => assert.equal(usr.name, name2))
            .then(() => done());
        });

        it("user doesn't exist.", function(done){
            // nothing happens to dbase
            var email = "asdf@example.com";
            var name = "asdf";

            users.changeName(email, name)
            .then(() => dbase.select("mail_users"))
            .then((res) => assert.equal(res.length, 0))
            .then(() => done());
        });
    });

    describe("#changePass()", function(){
        it("all good.", done => {
            var email = "asdf@example.com";
            var passwd1 = "asdf";
            var passwd2 = "qwerty";

            var g_pass;
            dbase.insert("mail_users", {email:email})
            .then(() => users.changePass(email, passwd1))
            .then(() => users.getUser(email))
            .then((usr) => g_pass = usr.phash)
            .then(() => users.changePass(email, passwd2))
            .then(() => users.getUser(email))
            .then((usr) => assert.ok(usr.phash!==g_pass))
            .then(() => done());
        });

        it("user doesn't exist.", function(done){
            var email = "asdf@example.com";
            var pass = "asdf";

            users.changePass(email, name)
            .catch(() => done());
        });
    });

    describe("#verifyPass()", function(){
        it("all good.", function(done){
            var email = "asdf@example.com";
            var passwd = "asdf";

            dbase.insert("mail_users", {email:email})
            .then(() => users.changePass(email, passwd))
            .then(() => users.verifyPass(email, passwd))
            .then((res) => assert.ok(res))
            .then(() => done());
        });

        it("pass wrong.", function(done){
            var email = "asdf@example.com";
            var passwd = "asdf";

            dbase.insert("mail_users", {email:email})
            .then(() => users.changePass(email, passwd))
            .then(() => users.verifyPass(email, passwd+"a"))
            .then((res) => assert.ok(!res))
            .then(() => done());
        });

        it("user doesn't exist.", function(done){
            var email = "asdf@example.com";
            var pass = "asdf";

            users.verifyPass(email, pass)
            .catch(() => done());
        });
    });

    describe("#createAcct", function(){
        it("all good.", function(done){
            var email = "asdf@example.com";

            users.createAcct(email)
            .then(() => dbase.select("mail_users"))
            .then((res) => assert.equal(res.length, 1))
            .then(() => done());
        });

        it("invalid email.", function(done){
            var email = "asdfasdfasdf";

            users.createAcct(email)
            .catch(() => done());
        });

        it("existing email.", function(done){
            var email = "asdf@example.com";

            users.createAcct(email)
            .then(() => users.createAcct(email))
            .catch(() => done());
        });
    });
});
