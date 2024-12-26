
describe('List Sessions spec', () => {

  before(() => {
    cy.fixture('user').then((user) => {
      cy.intercept('GET', '/api/user/1', { body: user }).as('getUser')
    })
    cy.fixture('session').then((session) => {
      cy.login([session, {...session, ...{ id: 2 }}])
    })
  })

  it('should list sessions',() => {
    cy.get('.items > .mat-card').should("have.length.at.least", 2)
  })

})
