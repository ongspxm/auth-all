/** libs/__tests__/imgur.js */
const fs = require("fs");
const assert = require("assert");

const DB_TMP = ".data/tmp.db";
const dbase = require("../dbase.js");
const imgur = require("../imgur.js");

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

            imgur.upload("http://i1.ytimg.com/vi/tQ-F8g11_LA/maxresdefault.jpg")
            .then((img) => g_img=img)
            .then(() => dbase.select("imgurs"))
            .then((imgs) => g_imgs=imgs)
            .then(() => assert.equal(g_imgs.length, 1))
            .then(() => assert.deepEqual(g_imgs[0], g_img))
            .then(() => done());
        });

        it("wrong link.", done => {
            imgur.upload("http://www.example.com/doesnt_exist.jpg")
            .catch(() => done());
        });
    });
});
