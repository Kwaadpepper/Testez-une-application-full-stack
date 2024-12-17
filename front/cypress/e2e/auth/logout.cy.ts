describe('Logout spec', () => {
  before(() => {
    cy.login()
    cy.intercept('GET', '/api/user/1',
      {
        body: {
          id: 1,
          email: 'toto@example.net',
          firstName: 'firstName',
          lastName: 'lastName',
          admin: true,
          createdAt: '2021/02/22',
          updatedAt: '2021/02/22'
        }
      })
  })
  it('Logout successfull', () => {
    cy.get('.mat-toolbar > .ng-star-inserted > :nth-child(3)').should("contain", "Logout")
    cy.get('[data-test-logout=""]').click()
    cy.get('[routerlink="login"]').should("exist")
  })
})
