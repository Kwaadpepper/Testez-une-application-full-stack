describe('Create Session spec',() => {
  before(() => {
    cy.fixture('user').then((user) => {
      cy.intercept('GET', '/api/user/1', { body: user }).as('getUser')
    })
    cy.fixture('session').then((session) => {
      cy.login([session, {...session, ...{ id: 2 }}])
    })
  })

  it('should show interface to create and persist a session', () => {
    cy.fixture('teacher').then((teacher) => {
      teacher.firstName = "Teacher 1"
      teacher.lastName = "lastName"
      cy.intercept('GET', '/api/teacher', { body: [teacher] }).as('getTeachers')
    })
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
