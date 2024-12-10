Cypress.Commands.add('login', (email, password) => {
  cy.intercept('GET', '/api/auth/session').as('getSession');
  cy.intercept('POST', '/service/login').as('postLogin');

  cy.visit('/service/login', { failOnStatusCode: false });

  cy.get('#email').type(email);
  cy.get('#password').type(password);
  cy.get('.btn_group button').click();

  cy.wait('@postLogin').then((interception) => {
    expect(interception.response.statusCode).to.eq(303);
  });

  cy.wait('@getSession').then((interception) => {
    expect(interception.response.statusCode).to.eq(200);
  });

  cy.url().should('eq', Cypress.config('baseUrl') + '/service');
});

Cypress.Commands.add('setValue', (selector, value) => {
  cy.get(selector).then(($input) => {
    $input[0].value = value;
    $input[0].dispatchEvent(new Event('input', { bubbles: true }));
  });
});

Cypress.Commands.add('setReadOnlyInputValue', (selector, value) => {
  cy.get(selector).then(($input) => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call($input[0], value);
    $input[0].dispatchEvent(new Event('input', { bubbles: true }));
  });
});
