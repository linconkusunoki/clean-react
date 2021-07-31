describe('Login', () => {
  beforeEach(() => {
    cy.visit('login')
  })

  it('should load with correct initial state', () => {
    cy.get('[data-testid="error-email"]').should('be.visible')
    cy.get('[data-testid="error-password"]').should('be.visible')
    cy.get('button[type="submit"]').should('be.visible')
  })
})
