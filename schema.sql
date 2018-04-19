CREATE TABLE IF NOT EXISTS fb_users(
    id TEXT,
    name TEXT,
    dpic_cache TEXT,
    imgur_id TEXT
);
CREATE UNIQUE INDEX fb_id ON fb_users(id);

CREATE TABLE IF NOT EXISTS imgurs(
    id TEXT,
    url TEXT,
    delHash TEXT
);
CREATE UNIQUE INDEX imgur_id ON imgurs(id);

CREATE TABLE IF NOT EXISTS accts(
    id INTEGER PRIMARY KEY,
    fb_id TEXT
);

CREATE TABLE IF NOT EXISTS sites(
    name TEXT,
    hash TEXT,
    acct_id INTEGER
);
CREATE UNIQUE INDEX site_name ON sites(name);
