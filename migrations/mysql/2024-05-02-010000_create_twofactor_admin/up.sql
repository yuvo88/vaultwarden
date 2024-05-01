CREATE TABLE twofactor_admin (
  uuid      CHAR(36) NOT NULL PRIMARY KEY,
  type      INTEGER  NOT NULL,
  enabled   BOOLEAN  NOT NULL,
  data      TEXT     NOT NULL
);