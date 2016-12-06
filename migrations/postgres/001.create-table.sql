START TRANSACTION;
CREATE TABLE example (
  uuid TEXT PRIMARY KEY,
  name TEXT,
  updated TIMESTAMP WITH TIME ZONE
);
CREATE INDEX example_name ON example (
    name
);
CREATE INDEX example_updated ON example (
    updated
);
COMMIT;
