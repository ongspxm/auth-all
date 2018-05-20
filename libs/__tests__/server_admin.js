/** libs/__tests__/server_admin.js */
const fs = require("fs");
const assert = require("assert");

const jwt = require("jwt-simple");

const DB_TMP = ".data/tmp.db";
const dbase = require("../dbase.js");
const admin = require("../server_admin.js");

tkn = jwt.encode({
    "sub": "fb_123123123"
}, process.env.APP_SC);

function getDB(){
    return (new sqlite.Database(DB_TMP));
}

describe("libs/server_admin.js", () => {
    beforeAll(() => {
        process.env.DB_DBASE = DB_TMP;
    });
    
    beforeEach((done) => {
        dbase.setup()
        .then(() => require("../../setup.js"))
        .then(() => done());
    });

    afterEach((done) => {
        fs.unlink(DB_TMP, () => done());
    });

    describe("#signin()", () => {
        it("all good.", done => {
            url = "https://"+process.env.HOST+"/admin/signin";
            admin.signin(url)
            .then(url => assert.ok(url.startsWith("https://www.facebook.com")))
            .then(done);
        });
    });

    describe("#addSite()", () => {
        it("all good.", done => {
            domain = "www.facebook.com";

            admin.addSite(tkn, domain)
            .then(site => assert.equal(site.domain, domain))
            .then(done);
        });

        it("wrong token.", done => {
            domain = "www.facebook.com";

            admin.addSite(tkn+"a", domain)
            .catch(() => done());
        });

        it("existing domain.", done => {
            domain = "www.facebook.com";

            admin.addSite(tkn, domain)
            .then(() => admin.addSite(tkn, domain))
            .catch(err => {
                assert.ok(err.indexOf("domain taken")>0);
                done();
            });
        });
    });

    describe("#getSites()", () => {
        it("all good.", done => {
            domain = "www.facebook.com";
            domain2 = "www.google.com";

            admin.addSite(tkn, domain)
            .then(() => admin.addSite(tkn, domain2))
            .then(() => admin.getSites(tkn))
            .then(sites => {
                assert.equal(sites[0].domain, domain);
                assert.equal(sites[1].domain, domain2);
            })
            .then(done);
        });

        it("empty.", done => {
            admin.getSites(tkn)
            .then(sites => assert.equal(sites.length, 0))
            .then(done);
        });
    });

    describe("#delSite()", () => {
        it("all good.", done => {
            domain = "www.google.com";

            admin.addSite(tkn, domain)
            .then(site => admin.delSite(tkn, site.id, site.secret))
            .then(() => admin.getSites(tkn))
            .then(sites => assert.equal(sites.length, 0))
            .then(done);
        });

        it("wrong token.", done => {
            domain = "www.google.com";

            admin.addSite(tkn, domain)
            .then(site => admin.delSite(tkn+"a", site.id, site.secret))
            .catch(() => done());
        });

        it("wrong domain.", done => {
            domain = "www.google.com";

            admin.addSite(tkn, domain)
            .then(site => admin.delSite(tkn, site.id+1, site.secret))
            .catch(() => done());
        });

        it("wrong secret.", done => {
            domain = "www.google.com";

            admin.addSite(tkn, domain)
            .then(site => admin.delSite(tkn, site.id+1, site.secret))
            .catch(() => done());
        });
    });
});
