// ***********************************************
// This example namespace declaration will help
// with Intellisense and code completion in your
// IDE or Text Editor.
// ***********************************************
import session from "./../fixtures/session.json";
declare namespace Cypress {
  interface Chainable<Subject = any> {
    login(sessions: typeof session[], isAdmin: boolean): typeof loginCommand;
  }
}

function loginCommand(sessions = [], isAdmin = true) {
  cy.visit('/login')
  cy.fixture('user').then((user) => {
    user.admin = isAdmin
    cy.intercept('POST', '/api/auth/login', { body: user }).as('getUser')
  })

  cy.intercept(
    {
      method: 'GET',
      url: '/api/session',
    },
    sessions).as('session')

  cy.get('input[formControlName=email]').type("yoga@studio.com")
  cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)
}

//
// function customCommand(param: any): void {
//   console.warn(param);
// }
//
// NOTE: You can use it like so:
// Cypress.Commands.add('customCommand', customCommand);
Cypress.Commands.add('login', loginCommand);

//
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
