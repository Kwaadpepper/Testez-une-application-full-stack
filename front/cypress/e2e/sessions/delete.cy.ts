import session from "../../fixtures/session.json"
import teacher from "../../fixtures/teacher.json"

describe('Delete session spec', () => {

  before(() => {
    cy.fixture('user').then((user) => {
      cy.intercept('GET', '/api/user/1', { body: user }).as('getUser')
    })
    cy.fixture('session').then((session) => {
      cy.login([session], true)
    })
  })

  it('should delete session', () => {
    cy.intercept('GET', '/api/session/1', { body: session }).as("Get session")
    cy.intercept('GET', '/api/teacher/1', { body: teacher }).as("Get teacher")
    cy.intercept('DELETE', '/api/session/1', { statusCode: 200 }).as("Delete session")

    // List session
    cy.get('.items > .mat-card').should("have.length.at.least", 1)

    // View session details
    cy.get('[data-test-details="1"]').click()

    // Try to delete session
    cy.get('[data-test-delete=""]').click().then(() => {
      cy.location().should('match', /\/sessions$/)
      cy.get('.mat-simple-snack-bar-content').contains('Session deleted !')
    })
  })

})
