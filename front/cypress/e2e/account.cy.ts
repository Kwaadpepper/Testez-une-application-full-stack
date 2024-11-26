describe('account',()=>{
  before(() => {
      cy.login(); // Appelle la commande login
    });
  it('should show account title', () => {

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

    cy.get('[routerlink="me"]').click()
    cy.get('h1').should("contain", "User information")
  })
})
