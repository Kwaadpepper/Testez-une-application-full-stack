# Back part - Yoga App

## Versions

Java: 11
Maven: 3.9.9
Mysql: 8

## Start the project

Git clone:

```sh
git clone https://github.com/Kwaadpepper/Testez-une-application-full-stack
```

Go to back part:

```sh
cd back
```

Install dependencies:

```sh
mvn clean install
```

Run the app

```sh
mvn spring-boot:run
```

## Testing

All integration tests are run using h2 database so no need for any external container.

To launch and generate the jacoco code coverage (**unit + integration tests**) :

```sh
mvn clean verify
```

### Test results

There are separated testing results generated using Jacoco for **Unit** and **Integration** tests.

***Integration tests*** :

- Reports can be found under [target/coverage-jacoco/integration-tests/index.html](target/coverage-jacoco/integration-tests/index.html)

***Unit tests*** :

- Reports can be found under [target/coverage-jacoco/unit-tests/index.html](target/coverage-jacoco/unit-tests/index.html)

***Global results*** :

- Global coverage can be found under [target/coverage-jacoco/all-combined-tests/index.html](target/coverage-jacoco/all-combined-tests/index.html)
