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

-- top 3 users, count for each
SELECT p.first_name, p.last_name, COUNT(*) AS count
FROM license_file lf, party p
WHERE lf.party_id = p.id
GROUP BY lf.party_id
ORDER BY count DESC LIMIT 3;