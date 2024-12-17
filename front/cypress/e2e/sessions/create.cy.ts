describe('Create Session spec',()=>{
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
    });
  it('should show interface to create and persist a session', () => {
    cy.intercept('GET', '/api/teacher',
      {
        statusCode: 200,
        body: [
          {
            id: 1,
            firstName: 'Teacher 1',
            lastName: 'lastName',
            createdAt: '2021/02/22',
            updatedAt: '2021/02/22'
          }
        ]
      }).as('getTeachers')

      cy.intercept('POST', '/api/session', { statusCode: 200 }).as('sessionCreate')

    cy.get('[routerlink="sessions"]').click()
    cy.get('.mat-card-header > .mat-focus-indicator').click()

    cy.wait('@getTeachers').then(() => {
      cy.get('#mat-input-2').type('New session');
      cy.get('#mat-input-3').type('2020-01-01').trigger('keydown', { key: 'Enter' });
      cy.get('mat-select[formControlName=teacher_id]').click().get('mat-option').contains('Teacher 1 lastName').click();
      cy.get('#mat-input-4').type('New session complete description{enter}');
      cy.get('button[type="submit"]').click();
    })

    cy.wait('@sessionCreate').then(() => {
      cy.get('.mat-simple-snack-bar-content').contains('Session created !')
    })

  })
})
