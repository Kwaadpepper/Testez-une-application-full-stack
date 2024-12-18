describe('Display user account page spec',()=>{
  before(() => {
    cy.fixture('user').then((user) => {
      cy.intercept('GET', '/api/user/1', { body: user }).as('getUser')
    })
    cy.login()
  })

  it('should show account title', () => {
    cy.fixture('user').then((user) => {
      cy.intercept('GET', '/api/user/1', { body: user }).as('getUser')
    })

    cy.get('[routerlink="me"]').click()
    cy.get('h1').should("contain", "User information")
    cy.get('.mat-card-content > div.ng-star-inserted > :nth-child(1)').should("contain", "Name: firstName LASTNAME")
  })
})
