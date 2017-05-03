START TRANSACTION;
CREATE TABLE customer (
  id TEXT PRIMARY KEY,
  title TEXT,
  first_name TEXT,
  last_name TEXT,
  date_of_birth DATE,
  created TIMESTAMP,
  updated TIMESTAMP
);
CREATE INDEX customer_first_name ON customer (
    first_name
);
CREATE INDEX customer_last_name ON customer (
    last_name
);
CREATE INDEX customer_date_of_birth ON customer (
    date_of_birth
);
CREATE INDEX customer_created ON customer (
    created
);
CREATE INDEX customer_updated ON customer (
    updated
);
COMMIT;
