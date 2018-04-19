/** libs/__tests__/accts.js */
const fs = require("fs");
const assert = require("assert");

const DB_TMP = ".data/tmp.db";
const dbase = require("../dbase.js");
const accts = require("../accts.js");

function getDB(){
    return (new sqlite.Database(DB_TMP));
}

describe("libs/accts.js", () => {
    beforeAll(() => {
        process.env.DB_DBASE = DB_TMP;
    });
    
    beforeEach((done) => {
        dbase.setup().then(() => done());
    });

    afterEach((done) => {
        fs.unlink(DB_TMP, () => done());
    });

    describe("#getFbAcct()", () => {
        it("all good.", done => {
            var fb_id = "fb_12341234"; 
            
            dbase.insert("accts", {fb_id: fb_id})
            .then(() => accts.getFbAcct(fb_id))
            .then(acct => assert.equal(acct.fb_id, fb_id))
            .then(() => done());
        });

        it("acc dun exist.", done => {
            var fb_id = "fb_12341234"; 
            
            accts.getFbAcct(fb_id)
            .then(acct => assert.equal(acct.fb_id, fb_id))
            .then(() => dbase.select("accts", "fb_id=?", [fb_id]))
            .then((accts) => assert.equal(accts.length, 1))
            .then(() => done());
        });
    });

    describe("#getSites()", () => {
        it("all good.", done => {
            var fb_id="fb_12341234", acct_id;
            
            accts.getFbAcct(fb_id)
            // TODO addSite
            .then(acct => assert.equal(acct.fb_id, fb_id))
            .then(() => done());
        });

        it("acc dun exist.", done => {
            var fb_id = "fb_12341234"; 
            
            accts.getFbAcct(fb_id)
            .then(acct => assert.equal(acct.fb_id, fb_id))
            .then(() => dbase.select("accts", "fb_id=?", [fb_id]))
            .then((accts) => assert.equal(accts.length, 1))
            .then(() => done());
        });
    });
});
