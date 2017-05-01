INSERT INTO customer
    (id, title, first_name, last_name, date_of_birth, created, updated)
    VALUES ($1, $2, $3, $4, $5, $6, null)
ON CONFLICT ON CONSTRAINT customer_pkey DO
UPDATE SET
    title = $2,
    first_name = $3,
    last_name = $4,
    date_of_birth = $5,
    updated = $6

