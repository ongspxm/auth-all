/** libs/fb/__tests__/user.js */
const fs = require("fs");
const assert = require("assert");

const DB_TMP = ".data/tmp.db";
const dbase = require("../../dbase.js");
const users = require("../users.js");

function getDB(){
    return (new sqlite.Database(DB_TMP));
}

describe("lib/fb/users.js", () => {
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
            dbase.insert("fb_users", {id:"asdf"})
            .then(() => users.getUser("asdf"))
            .then((usr) => assert.equal(usr.id, "asdf"))
            .then(() => done());
        });

        it("doesnt exist.", done => { 
            users.getUser("asdf")
            .then((usr) => assert.equal(usr.id, "asdf"))
            .then(() => dbase.select("fb_users", "id=?", ["asdf"]))
            .then((usrs) => assert.equal(usrs.length, 1))
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
