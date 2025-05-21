#!/bin/bash

# Execute the SQL script
psql -h localhost -p 5432 -U postgres -d postgres -f init.sql 