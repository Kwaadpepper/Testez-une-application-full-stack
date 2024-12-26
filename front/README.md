# Front part - Yoga App

## Versions

Node: 16/gallium
Npm: 8.19.4
Yarn: 1.22.22

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.1.0.

## Start the project

Git clone:

```sh
git clone https://github.com/Kwaadpepper/Testez-une-application-full-stack
```

Go to front part:

```sh
cd front
```

Install dependencies:

```sh
npm install
```

Launch Front-end:

```sh
npm run start
```

## Ressources

### Postman collection

Import the Postman collection

> [../ressources/postman/yoga.postman_collection.json](./../ressources/postman/yoga.postman_collection.json)

by following the documentation:

[importing-data-into-postman](https://learning.postman.com/docs/getting-started/importing-and-exporting-data/#importing-data-into-postman)

### MySQL

SQL script for creating the schema is available [./../ressources/sql/script.sql](./../ressources/sql/script.sql)

By default the admin account is:

- login: `yoga@studio.com`
- password: `test!1234`

## Testing

### E2E

Launching e2e test:

```sh
npm run e2e
```

or

```sh
npm run e2e:ci
```

Generate coverage report (you should launch e2e test before):

```sh
npm run e2e:coverage
```

Report for **end 2 end tests** will be available here:

> [coverage/e2e/lcov-report/index.html](coverage/e2e/lcov-report/index.html)

### Unitary tests

Launching test with coverage:

```sh
npm run test:coverage
```

Report for **unit tests** will be available here:

> [coverage/unit/lcov-report/index.html](coverage/unit/lcov-report/index.html)

To run while following changes:

```sh
npm run test:watch
```
