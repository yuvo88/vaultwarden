CREATE TABLE twofactor_admin (
  uuid      TEXT     NOT NULL PRIMARY KEY,
  type      INTEGER  NOT NULL,
  enabled   BOOLEAN  NOT NULL,
  data      TEXT     NOT NULL
);