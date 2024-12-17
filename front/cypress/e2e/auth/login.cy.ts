describe('Login spec', () => {
  it('Login successfull', () => {
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

    cy.url().should('include', '/sessions')
    cy.get('.mat-card-title').should("contain", "Rentals available")
    cy.get('.mat-toolbar > .ng-star-inserted > :nth-child(3)').should("contain", "Logout")
  })

  it('Login Failure', () => {
    cy.visit('/login')

    cy.intercept('POST', '/api/auth/login', {
      statusCode: 400,
    })

    cy.get('input[formControlName=email]').type("yoga@studio.com")
    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)

    cy.get('.error').should('contain', 'An error occurred')
  })
});
