describe('Login spec', () => {
  it('Login successfull', () => {
    cy.login();

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
