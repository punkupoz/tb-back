DROP TABLE IF EXISTS user_email;

CRATE TABLE user_email (
	id SERIAL PRIMARY KEY,
	"primary" BOOLEAN NOT NULL DEFAULT false, 
)

DROP TABLE IF EXISTS pending_user;
CREATE TABLE pending_user (
	id SERIAL PRIMARY KEY,
	email VARCHAR(32) UNIQUE NOT NULL,
	first_name VARCHAR(32),
	last_name VARCHAR(32),
	verify_key VARCHAR(32)
);

DROP TABLE IF EXISTS "user";
CREATE TABLE "user" (
	id SERIAL PRIMARY KEY,
	email VARCHAR(32) UNIQUE NOT NULL,
	password VARCHAR(64),
	first_name VARCHAR(32),
	last_name VARCHAR(32)
);