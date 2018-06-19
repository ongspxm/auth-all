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
        it("all good.", done => {
            var email = "asdf@example.com";

            dbase.insert("mail_users", {email:email})
            .then(() => users.getUser(email))
            .then((usr) => assert.equal(usr.imgur_id, "rJd70DS"))
            .then(() => done());
        });

        it("doesnt exist.", done => {
            users.getUser("asdf@example.com")
            .then((usr) => assert.ok(!usr))
            .then(() => done());
        });
    });

    describe("#updateUser()", () => {
        it("all good.", done => {
            var id="asdf", name="asdf qwerty";

            dbase.insert("fb_users", {id:id, name:"qwerty"})
            .then(() => users.updateUser({id:id, name:name}))
            .then(() => users.getUser(id))
            .then((usr) => assert.equal(usr.name, name))
            .then(() => done());
        });

        it("user doesnt exist.", done => {
            var id = "asdf";

            users.updateUser({id:id, name:"asdf"})
            .then(() => dbase.select("fb_users", "id=?", [id]))
            .then(usrs => assert.equal(usrs.length, 1))
            .then(() => done());
        });

        it("error in format, missing id.", done => {
            users.updateUser({name:"asdf"})
            .catch(() => done());
        });
    });
});
