import session from "./../../fixtures/session.json"
import teacher from "./../../fixtures/teacher.json"
import user from "./../../fixtures/user.json"

describe('View Session Detail spec', () => {

  before(() => {
    cy.login([session])
    cy.intercept('GET', '/api/user/1', { body: user })
  })

  it('should view session details', () => {
    cy.intercept('GET', '/api/session/1', { body: session }).as("Get session")
    cy.intercept('GET', '/api/teacher/1', { body: teacher }).as("Get teacher")

    cy.get('.items > .mat-card').should("have.length.at.least", 1)
    cy.get('.mat-card-actions > :nth-child(1)').click()
  });

})
