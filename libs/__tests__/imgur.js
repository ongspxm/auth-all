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
        // fs.unlink(DB_TMP, () => done());
    });

    describe("#uploadImage()", () => {
        it("all good.", done => {
            imgur("http://i1.ytimg.com/vi/tQ-F8g11_LA/maxresdefault.jpg")
            .then((img) => dbase.select("imgurs"))
            .then((imgs) => console.log(imgs))
            .then(() => done());
        });
    });
});
