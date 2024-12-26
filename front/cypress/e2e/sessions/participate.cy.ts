
describe('Participate to a session spec', () => {

  before(() => {
    cy.fixture('user').then((user) => {
      cy.intercept('GET', '/api/user/1', { body: user })
    })
    cy.fixture('session').then((session) => {
      cy.login([session], false)
    })
  })

  it('should participate to a session', () => {
    cy.fixture('user').then((user) => {
      user.admin = false
      cy.fixture('teacher').then((teacher) => {
        cy.fixture('session').then((session) => {
          let requestNo = 0
          const sessionResponses = [ Object.assign({}, session), Object.assign({}, {...session, ...{ users: [user.id] }}) ]

          cy.intercept('POST', '/api/session/1/participate/1', { statusCode: 200 }).as("Participate")
          cy.intercept('GET', '/api/session/1', (req) => {
            req.reply({ body: sessionResponses[requestNo++] })
          }).as("GetSession")
          cy.intercept('GET', '/api/teacher/1', { body: teacher }).as("GetTeacher")

          // List sessions
          cy.get('.items > .mat-card').should("have.length.at.least", 1)

          // View session details 1
          cy.get('[data-test-details="1"]').click()

          cy.wait('@GetTeacher')
          cy.wait('@GetSession')
          .its('response.body.users')
          .should('have.length', 0)

          // Participate to a session
          cy.get('[data-test-participate=""]').click()
          cy.wait('@Participate')
          cy.wait('@GetSession')
            .its('response.body.users')
            .should('have.length', 1)

          cy.get('[data-test-unparticipate=""]').should('exist')
          cy.get('[data-test-attendees=""]').should('contain.text', '1 attendees')
        })

      })
    })
  })

})
