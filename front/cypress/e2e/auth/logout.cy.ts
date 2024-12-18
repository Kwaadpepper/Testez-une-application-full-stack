describe('Logout spec', () => {
  before(() => {
    cy.fixture('user').then((user) => {
      cy.intercept('GET', '/api/user/1', { body: user }).as('getUser')
    })
    cy.login()
  })
  it('Logout successfull', () => {
    cy.get('.mat-toolbar > .ng-star-inserted > :nth-child(3)').should("contain", "Logout")
    cy.get('[data-test-logout=""]').click()
    cy.get('[routerlink="login"]').should("exist")
  })
})
