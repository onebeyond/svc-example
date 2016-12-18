SELECT id, title, first_name, last_name, date_of_birth, created, updated
FROM customer
WHERE id = $1;
