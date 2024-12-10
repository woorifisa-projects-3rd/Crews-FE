describe('template spec', () => {
  it('duesCall', () => {
    const agitId = 5;
    cy.intercept('GET', `/service/agits/${agitId}/accounts/dues/manage`).as('getDues');

    cy.login('123456@gmail.com', 'q1w2e3r4!');
    cy.visit(`/service/agits/${agitId}/accounts/dues/manage`);

    cy.wait('@getDues').then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
    });
    cy.wait(5000);
    cy.get('.deep').click();
    cy.wait(5000);
    cy.on('window:alert', (alertText) => {
      expect(alertText).to.equal('문자가 발송되었습니다.');
    });
  });
});
