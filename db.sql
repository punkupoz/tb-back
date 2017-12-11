DROP TABLE IF EXISTS pending_user CASCADE;
DROP TABLE IF EXISTS "user" CASCADE;
DROP TABLE IF EXISTS user_email;
DROP TABLE IF EXISTS phone;
DROP TABLE IF EXISTS branch;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS frequent_transaction;
DROP FUNCTION IF EXISTS new_user(TEXT, TEXT, TEXT, TEXT);

CREATE TABLE IF NOT EXISTS pending_user (
	id SERIAL PRIMARY KEY,
	email TEXT NOT NULL UNIQUE,
	first_name TEXT,
	last_name TEXT,
	verify_key TEXT
);

CREATE TABLE IF NOT EXISTS "user" (
	id SERIAL PRIMARY KEY,
	password TEXT,
	first_name TEXT,
	last_name TEXT
);

CREATE TABLE IF NOT EXISTS user_email (
	id SERIAL PRIMARY KEY,
	user_id BIGINT,
	"primary" BOOLEAN NOT NULL DEFAULT false,
	address TEXT UNIQUE NOT NULL,
	FOREIGN KEY(user_id) REFERENCES "user"(id)
);

CREATE TABLE IF NOT EXISTS phone (
	id SERIAL PRIMARY KEY,
	user_id BIGINT,
	"primary" BOOLEAN NOT NULL DEFAULT false,
	number TEXT UNIQUE NOT NULL,
	FOREIGN KEY(user_id) REFERENCES pending_user(id)
);

CREATE TABLE IF NOT EXISTS branch (
	bsb INT PRIMARY KEY,
	name INT NOT NULL,
	postcode INT NOT NULL,
	city INT NOT NULL,
	street_number INT NOT NULL,
	street TEXT NOT NULL,
	state VARCHAR(3) NOT NULL
)

CREATE TABLE IF NOT EXISTS "account" (
	id SERIAL PRIMARY KEY,
	available_fund REAL,
	branch_bsb BIGINT,
	user_id BIGINT,
	balance REAL
	FOREIGN KEY(branch_bsb) REFERENCES branch(bsb),
	FOREIGN KEY(user_id) REFERENCES "user"(id),
);

CREATE UNIQUE INDEX account_userbranch ON "account"(branch_bsb, user_id);

CREATE TYPE transactions_type AS ENUM ('frequent', 'oneoff');

CREATE TABLE IF NOT EXISTS transactions (
	id SERIAL PRIMARY KEY,
	"date" DATE,
	description TEXT,
	name TEXT,
	amount REAL,
	from_or_to TEXT,
	type transactions_type
);


CREATE TABLE IF NOT EXISTS frequent_transaction (
	id SERIAL PRIMARY KEY,
	account_id BIGINT,
	active BOOLEAN,
	frequency TEXT,
	next_due_day DATE,
	FOREIGN KEY(account_id) REFERENCES account(id);
);

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