describe('template spec', () => {
  it('generateAccount', () => {
    const agitId = 13;
    cy.intercept('GET', `/service/agits/${agitId}`).as('getAgits');

    cy.login('123456@gmail.com', 'q1w2e3r4!');
    cy.visit(`/service/agits/${agitId}`);

    cy.wait('@getAgits').then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
    });
    cy.get(':nth-child(2) > .deep', { multiple: true }).click();
    cy.get(':nth-child(1) > .rt-reset > .rt-r-pt-3 > .Button_button_l__3SS4W > .deep').click();
    cy.get(':nth-child(3) > .Button_button_l__3SS4W > .deep').click();
  });
});
