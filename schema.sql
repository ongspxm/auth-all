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
