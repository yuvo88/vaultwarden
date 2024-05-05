CREATE TABLE twofactor_admin (
  uuid      TEXT     NOT NULL PRIMARY KEY,
  atype     INTEGER  NOT NULL,
  enabled   BOOLEAN  NOT NULL,
  data      TEXT     NOT NULL,
  last_used INTEGER  NOT NULL DEFAULT 0
);