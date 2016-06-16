-- sql for collecting data

-- How many licenses were generated in the last 24 hours
SELECT lf.id, p.first_name, p.last_name
FROM license_file lf, party p
WHERE lf.party_id = p.id
AND lf.created BETWEEN DATE_SUB('2016-06-01 00:00:00', INTERVAL '00 24' DAY_HOUR) AND '2016-06-01 00:00:00';

-- How many are generated by eval user vs account users
SELECT lf.account_id, COUNT(*)
FROM license_file lf
WHERE lf.account_id IS NULL;

SELECT COUNT(lf.account_id)
FROM license_file lf
WHERE lf.account_id IS NOT NULL;

-- How many licenses for unique users in eval vs account users
SELECT COUNT(DISTINCT(lf.party_id))
FROM license_file lf
WHERE lf.account_id IS NULL;

SELECT COUNT(DISTINCT(lf.party_id))
FROM license_file lf
WHERE lf.account_id IS NOT NULL;

-- Top 3 eval users who generated most license files (needs first_name, last_name, count)
SELECT p.first_name, p.last_name, a.count
FROM party p JOIN
(SELECT party_id, COUNT(*) AS count
FROM license_file WHERE account_id IS NULL GROUP BY party_id ORDER BY count DESC LIMIT 3) a ON
p.id = a.party_id;

-- Top 3 account users (needs first_name, last_name, account_number, count)
SELECT p.first_name, p.last_name, a.account_number, b.count
FROM party p JOIN
(SELECT party_id, account_id, COUNT(*) AS count
FROM license_file WHERE account_id IS NOT NULL GROUP BY party_id ORDER BY count DESC LIMIT 3) b ON
p.id = b.party_id LEFT JOIN account a ON b.account_id = a.id;