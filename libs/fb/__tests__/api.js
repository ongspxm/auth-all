/** libs/fb/__tests__/api.js */
const fs = require("fs");
const assert = require("assert");

const DB_TMP = ".data/tmp.db";
const dbase = require("../../dbase.js");
const fbapi = require("../api.js");

function getDB(){
    return (new sqlite.Database(DB_TMP));
}

describe("lib/fb/api.js", () => {
    beforeAll(() => {
        process.env.DB_DBASE = DB_TMP;
    });
    
    beforeEach((done) => {
        dbase.setup().then(() => done());
    });

    afterEach((done) => {
        fs.unlink(DB_TMP, () => done());
    });

    describe("#getAuthURL()", () => {
        it("all good.", done => {
            fbapi.getAuthURL("https://www.google.com")
            .then(url => assert.ok(url))
            .then(() => done());
        });

        it("invalid callback url.", done => {
            fbapi.getAuthURL()
            .catch(() => done());
        });

        it("non https callback.", done => {
            fbapi.getAuthURL("http://www.google.com")
            .catch(() => done());
        });
    });

    describe("#getAccessToken()", () => {
        it("err in request code.", done => {
            var reqCode = "asdf";

            fbapi.getAccessToken(reqCode)
            .catch(() => done());
        });
    }); 

    describe("#getUserInfo()", () => {
        it("err in accessTkn.", done => {
            fbapi.getUserInfo("asdf")
            .catch(() => done());
        });
    });

    describe("#getUserPic()", () => {
        it("err in accessTkn.", done => {
            fbapi.getUserPic("asdf")
            .catch(() => done());
        });
    });
});
