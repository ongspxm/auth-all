CREATE TABLE fb_users IF NOT EXISTS(
    fb_id TEXT,
    fb_name TEXT,
    imgur_id TEXT
);
CREATE UNIQUE INDEX fb_id ON fb_users(fb_id);

CREATE TABLE imgurs IF NOT EXISTS(
    imgur_id TEXT,
    imgur_url TEXT,
    imgur_del TEXT
);
CREATE UNIQUE INDEX imgur_id ON imgurs(imgur_id);
