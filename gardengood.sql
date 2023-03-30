\echo 'Delete and recreate gardengood db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE IF EXISTS gardengood;
CREATE DATABASE gardengood;
\connect gardengood

\i gardengood-schema.sql
\i gardengood-initialdata.sql
\i gardengood-seed.sql

\echo 'Delete and recreate gardengood_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE IF EXISTS gardengood_test;
CREATE DATABASE gardengood_test;
\connect gardengood_test

\i gardengood-schema.sql
\i gardengood-initialdata.sql
