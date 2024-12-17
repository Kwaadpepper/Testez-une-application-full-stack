describe('List Sessions spec',()=>{

  before(() => {
    // TODO: create fixtures
    cy.login([{
      id: 1,
      name: "New session",
      description: "New session description",
      date: new Date(),
      teacher_id: 1,
      users: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },{
      id: 2,
      name: "New session 2",
      description: "New session description 2",
      date: new Date(),
      teacher_id: 1,
      users: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }])
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

  it('should list sessions',() => {
    cy.get('.items > .mat-card').should("have.length.at.least", 2)
  });

})
