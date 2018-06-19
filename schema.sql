CREATE TABLE IF NOT EXISTS fb_users(
    name TEXT,
    id TEXT UNIQUE,
    dpic_cache TEXT,
    imgur_id TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS fb_id ON fb_users(id);

CREATE TABLE IF NOT EXISTS mail_users(
    name TEXT,
    email TEXT UNIQUE,
    phash TEXT,
    imgur_id TEXT DEFAULT 'rJd70DS'
);
CREATE UNIQUE INDEX IF NOT EXISTS mail_id ON mail_users(email);

CREATE TABLE IF NOT EXISTS signins(
    hash TEXT,
    site_id TEXT,
    callback TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS signin_hash ON signins(hash);

CREATE TABLE IF NOT EXISTS imgurs(
    id TEXT,
    url TEXT,
    delHash TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS imgur_id ON imgurs(id);
INSERT OR IGNORE INTO imgurs(id, url) VALUES('rJd70DS', 'https://i.imgur.com/rJd70DS.jpg');

CREATE TABLE IF NOT EXISTS accts(
    id INTEGER PRIMARY KEY,
    fb_id TEXT
);

CREATE TABLE IF NOT EXISTS sites(
    domain TEXT,
    id TEXT,
    secret TEXT,
    acct_id INTEGER
);
CREATE UNIQUE INDEX IF NOT EXISTS site_id ON sites(id);
