# Welcome To My News App Api Repository.

## Link to hosted API

https://news-app-anthony-mcgreal.herokuapp.com/api

---

## Summary

This api is designed to show the implementation of an API to access data using node-postgres to interact with a PSQL database.

---

## Cloning this repository

To clone this repository to your machine please follow the following instuctions provided by GitHub Docs

https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository-from-github/cloning-a-repository

---

## Set-Up

Once you have cloned the repository to your machine you will need to perform the following actions;

- To install the necessary dependencies run the following command in your terminal;

         npm i

- You will next need to create two `.env` files: `.env.test` and `.env.development`. Into each, add `PGDATABASE=<database_name_here>`, with the correct database name for that environment (see `/db/setup.sql` for the database names).

- Next you will need to set-up the database and seed it. Run the following commands in your terminal;

       npm run setup-dbs

       npm run seed

---

## Testing

Tests have been written in the **tests** folder and have been segregated to test the app and utility functions separately.

To run the app tests use the command line;

    npm test app

To run the util tests use the command line;

    npm test util

---

## Minimum Versions

Node 14.17.4

PostgreSQL 9.6
