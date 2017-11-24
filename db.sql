DROP TABLE IF EXISTS pending_user CASCADE;
CREATE TABLE pending_user (
	id SERIAL PRIMARY KEY,
	email TEXT NOT NULL UNIQUE,
	first_name TEXT,
	last_name TEXT,
	verify_key TEXT
);

DROP TABLE IF EXISTS "user" CASCADE;
CREATE TABLE "user" (
	id SERIAL PRIMARY KEY,
	password TEXT,
	first_name TEXT,
	last_name TEXT
);

DROP TABLE IF EXISTS user_email;
CREATE TABLE user_email (
	id SERIAL PRIMARY KEY,
	user_id BIGINT,
	"primary" BOOLEAN NOT NULL DEFAULT false,
	address TEXT UNIQUE NOT NULL,
	FOREIGN KEY(user_id) REFERENCES "user"(id)
);

DROP TABLE IF EXISTS phone;
CREATE TABLE phone (
	id SERIAL PRIMARY KEY,
	user_id BIGINT,
	"primary" BOOLEAN NOT NULL DEFAULT false,
	number TEXT UNIQUE NOT NULL,
	FOREIGN KEY(user_id) REFERENCES pending_user(id)
);

DROP FUNCTION new_user(TEXT, TEXT, TEXT, TEXT);
CREATE FUNCTION new_user (firstname TEXT, lastname TEXT, pemail TEXT, password TEXT) RETURNS TABLE(fn TEXT, ln TEXT) AS
$BODY$
DECLARE
	u_id integer;
BEGIN
	INSERT INTO "user" (last_name, first_name, password)
	VALUES (firstname, lastname, password)
	RETURNING id INTO u_id;

	DELETE FROM "pending_user" WHERE "email" = pemail;
	INSERT INTO user_email (user_id, address) VALUES (u_id, pemail);
	RETURN QUERY 
		SELECT first_name, last_name
		FROM "user"
		WHERE id = u_id;
END;
$BODY$
LANGUAGE plpgsql VOLATILE;

SELECT * FROM new_user('pun', 'punlast', 'punmailz', 'abcabc');