describe('Edit session spec', () => {

  before(() => {
    cy.fixture('user').then((user) => {
      cy.intercept('GET', '/api/user/1', { body: user }).as('getUser')
    })
    cy.fixture('session').then((session) => {
      cy.login([session], true)
    })
  })

  it('should edit session successfully', () => {
    cy.intercept('PUT', '/api/session/1', { statusCode:200 }).as("Update session")
    cy.fixture('teacher').then(teacher => {
      cy.intercept('GET', '/api/teacher', { body: [teacher] }).as("Get teachers")
    })
    cy.fixture('session').then(session => {
      const newDescription = "\n\n Erratum: The session will be delayed by 15 minutes.\nThank you for your understanding."

      cy.intercept('GET', '/api/session/1', { body: session }).as('Get session')

      // List session
      cy.get('.items > .mat-card').should("have.length.at.least", 1)

      // View session details
      cy.get('[data-test-edit="1"]').click()

      // Change Session information
      session.description = newDescription
      cy.intercept('GET', '/api/session', { body: [session] }).as('Get sessions list')

      cy.get('#mat-input-4').type(newDescription)
      cy.get('[data-test-submit=""]').click()

      cy.wait("@Update session").then(() => {
        cy.get('.mat-simple-snack-bar-content').contains('Session updated !')
      })
    })

  })

})
