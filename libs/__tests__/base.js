/** libs/__tests__/base.js */
const fs = require("fs");
const assert = require("assert");

const DB_TMP = ".data/tmp.db";
const dbase = require("../dbase.js");
// const users = require("../users.js");

function getDB(){
    return (new sqlite.Database(DB_TMP));
}

describe("", () => {
    beforeAll(() => {
        process.env.DB_DBASE = DB_TMP;
    });
    
    beforeEach((done) => {
        dbase.setup().then(() => done());
    });

    afterEach((done) => {
        fs.unlink(DB_TMP, () => done());
    });

    describe("#upload()", () => {
        it("all good.", done => done());
    });
});
