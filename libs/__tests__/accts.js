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

    describe("#getAcct()", () => {
        it("all good.", done => {
            var fb_id="fb_12341234"; 
            
            accts.getFbAcct(fb_id)
            .then(acct => accts.getAcct(acct.id))
            .then(acct => assert.equal(acct.fb_id, fb_id))
            .then(() => done());
        });

        it("acc dun exist.", done => {
            accts.getAcct(100)
            .then(console.log)
            .catch(() => done());
        });
    });

    describe("#addSite()", () => {
        it("all good.", done => {
            var fb_id="fb_12341234", g_acct; 
            var domain="asdf";
            
            accts.getFbAcct(fb_id)
            .then(acct => g_acct=acct)
            .then(() => accts.addSite(g_acct.id, domain))
            .then(site => { 
                assert.equal(site.domain, domain); 
                assert.ok(site.id);
                assert.ok(site.secret);
            })
            .then(() => done());
        });

        it("site already exist.", done => { 
            var fb_id="fb_12341234", g_acct; 
            var domain="asdf";

            accts.getFbAcct(fb_id)
            .then(acct => g_acct=acct)
            .then(() => accts.addSite(g_acct.id, domain))
            .then(() => accts.addSite(g_acct.id, domain))
            .catch(() => done());
        });

        it("acc dun exist.", done => {
            accts.addSite(100, "asdf")
            .catch(() => done());
        });
    });

    describe("#getSite()", () => {
        it("all good.", done => {
            var fb_id="fb_12341234", domain="asdf";
            var g_acct, g_site;
            
            accts.getFbAcct(fb_id)
            .then(acct => g_acct=acct)
            .then(() => accts.addSite(g_acct.id, domain))
            .then(site => g_site=site)
            .then(() => accts.getSite(g_site.id))
            .then(site => {
                assert.equal(site.acct_id, g_acct.id);
                assert.equal(site.id, g_site.id);
                assert.equal(site.secret, g_site.secret);
            })
            .then(() => done());
        });

        it("site dun exist.", done => {
            accts.getSite("asdf")
            .catch(() => done());
        });
    }); 

    describe("#getSites()", () => {
        it("all good.", done => {
            var fb_id="fb_12341234", domain="asdf";
            var g_acct;
            
            accts.getFbAcct(fb_id)
            .then(acct => g_acct=acct)
            .then(() => accts.addSite(g_acct.id, domain))
            .then(() => accts.getSites(g_acct.id))
            .then(sites => assert.equal(sites.length, 1))
            .then(() => done());
        });

        it("no sites.", done => {
            var fb_id="fb_12341234", g_acct;
            
            accts.getFbAcct(fb_id)
            .then(acct => g_acct=acct)
            .then(() => accts.getSites(g_acct.id))
            .then(sites => assert.equal(sites.length, 0))
            .then(() => done());
        });

        it("acc doesnt exist.", done => {
            accts.getSites(100)
            .then(() => done());
        });
    }); 

    describe("#validDomain()", () => {
        it("all good.", done => {
            var fb_id="fb_12341234", domain="asdf";
            
            accts.getFbAcct(fb_id)
            .then(acct => accts.addSite(acct.id, domain))
            .then(() => accts.validDomain(domain))
            .then(valid => assert.ok(!valid))
            .then(() => done());
        });

        it("site doesnt exist.", done => {
            var domain="asdf";
            
            accts.validDomain(domain)
            .then(valid => assert.ok(valid))
            .then(() => done());
        });

        it("empty site.", done => { 
            accts.validDomain()
            .then(valid => assert.ok(!valid))
            .then(() => done());
        });
    }); 


});
