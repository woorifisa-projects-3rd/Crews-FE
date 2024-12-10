describe('template spec', () => {
  it('transferDues', () => {
    const agitId = 5;
    cy.intercept('GET', `/service/agits/${agitId}/accounts/dues/`).as('getTransfer');

    cy.login('123456@gmail.com', 'q1w2e3r4!');
    cy.visit(`/service/agits/${agitId}/accounts/dues/`);

    cy.wait('@getTransfer').then((interception) => {
      expect(interception.response.statusCode).to.eq(308);
    });

    cy.get('.deep').click();
    cy.get('.PinNumber_keyboard__j5Maj > .rt-Flex').contains('button', '1').click();
    cy.get('.PinNumber_keyboard__j5Maj > .rt-Flex').contains('button', '1').click();
    cy.get('.PinNumber_keyboard__j5Maj > .rt-Flex').contains('button', '1').click();
    cy.get('.PinNumber_keyboard__j5Maj > .rt-Flex').contains('button', '1').click();
    cy.get('.PinNumber_keyboard__j5Maj > .rt-Flex').contains('button', '1').click();
    cy.get('.PinNumber_keyboard__j5Maj > .rt-Flex').contains('button', '1').click();
    cy.get(':nth-child(2) > .deep').click();
  });
});
