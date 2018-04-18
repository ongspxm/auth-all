/** libs/__tests__/imgur.js */
const fs = require("fs");
const assert = require("assert");

const DB_TMP = ".data/tmp.db";
const dbase = require("../dbase.js");
const imgur = require("../imgur.js");

var imgUrl = "http://i1.ytimg.com/vi/tQ-F8g11_LA/maxresdefault.jpg";
var errUrl = "http://www.google.com/doesnt_exist.jpg";

function getDB(){
    return (new sqlite.Database(DB_TMP));
}

describe("lib/imgur.js", () => {
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
        it("all good.", done => {
            var g_img, g_imgs;

            imgur.upload(imgUrl)
            .then((img) => g_img=img)
            .then(() => dbase.select("imgurs"))
            .then((imgs) => g_imgs=imgs)
            .then(() => assert.equal(g_imgs.length, 1))
            .then(() => assert.deepEqual(g_imgs[0], g_img))
            .then(() => done());
        });

        it("wrong link.", done => {
            imgur.upload(errUrl)
            .catch(() => done());
        });
    });

    describe("#delete()", () => {
        it("all good.", done => {
            imgur.upload(imgUrl)
            .then((img) => imgur.delete(img.id))
            .then(() => dbase.select("imgurs"))
            .then((imgs) => assert.equal(imgs.length, 0))
            .then(() => done());
        });

        it("empty id.", done => {
            // wont affect others
            imgur.upload(imgUrl)
            .then(() => imgur.delete())
            .then(() => dbase.select("imgurs"))
            .then((imgs) => assert.equal(imgs.length, 1))
            .then(() => done());
        });

        it("id doesnt exist.", done => {
            imgur.upload(imgUrl)
            .then(() => imgur.delete())
            .then(() => dbase.select("imgurs"))
            .then((imgs) => assert.equal(imgs.length, 1))
            .then(() => done());
        });
    });
});
