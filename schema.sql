CREATE TABLE IF NOT EXISTS fb_users(
    fb_id TEXT,
    fb_name TEXT,
    imgur_id TEXT
);
CREATE UNIQUE INDEX fb_id ON fb_users(fb_id);

CREATE TABLE IF NOT EXISTS imgurs(
    id TEXT,
    url TEXT,
    delHash TEXT
);
CREATE UNIQUE INDEX imgur_id ON imgurs(imgur_id);
