CREATE TABLE IF NOT EXISTS fb_users(
    id TEXT,
    name TEXT,
    dpic_cache TEXT,
    imgur_id TEXT
);
CREATE UNIQUE INDEX fb_id ON fb_users(id);

CREATE TABLE IF NOT EXISTS fb_signins(
    id INTEGER PRIMARY KEY,
    site_id TEXT,
    callback_url TEXT
);


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
    domain TEXT,
    id TEXT,
    secret TEXT,
    acct_id INTEGER
);
CREATE UNIQUE INDEX site_domain ON sites(domain);
CREATE UNIQUE INDEX site_id ON sites(id);
