SET client_min_messages = 'WARNING';
START TRANSACTION;
  TRUNCATE customer cascade;
COMMIT;
