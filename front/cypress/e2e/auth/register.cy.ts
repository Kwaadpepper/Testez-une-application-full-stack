
describe('Register spec', () => {
  it('Register successful', () => {
    cy.visit('/register');
    cy.intercept('POST', '/api/auth/register',
      {
        body: {
          message: "User registered successfully!"
        }
      }).as('registerRequest');

    cy.get('#mat-input-0').type('Jean');
    cy.get('#mat-input-1').type('Petit');
    cy.get('#mat-input-2').type('yoga@studio.com');
    cy.get('#mat-input-3').type('test!1234{enter}');

    cy.wait('@registerRequest').then((interception) => {
      if (interception.response) {
        expect(interception.response.statusCode).to.eq(200);
        expect(interception.response.body.message).to.eq('User registered successfully!');
      } else {
        throw new Error('La réponse de l\'interception est indéfinie');
      }
    });
  });

  it('Register failure', () => {
    cy.visit('/register');
    cy.intercept('POST', '/api/auth/register',
      {
        statusCode: 400
      }).as('registerRequest');

    cy.get('#mat-input-0').type('Jean');
    cy.get('#mat-input-1').type('Petit');
    cy.get('#mat-input-2').type('yoga@studio.com');
    cy.get('#mat-input-3').type('test!1234{enter}');

    cy.wait('@registerRequest').then((interception) => {
      if (interception.response) {
        expect(interception.response.statusCode).to.eq(400);
        cy.get('.error').should('contain', 'An error occurred')
      } else {
        throw new Error('La réponse de l\'interception est indéfinie');
      }
    });
  });
});
