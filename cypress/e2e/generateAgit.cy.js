describe('template spec', () => {
  it('generateAgit', () => {
    cy.login('123456@gmail.com', 'q1w2e3r4!');
    cy.get('.Navigation_btn_payment__eM1_S > a').click();
    cy.get('#name').clear('c');

    const faker = Math.ceil(Math.random(10) * 100) / 100;
    cy.get('#name').type(`CypressTest${faker}`);
    cy.get('.content > :nth-child(1) > :nth-child(1) > .rt-Box > button').click();
    cy.get(':nth-child(2) > .rt-Flex > .row > div.input > button').click();

    cy.get('iframe[title="우편번호서비스 레이어 프레임"]')
      .should('be.visible')
      .its('0.contentDocument.body')
      .should('not.be.empty')
      .then((layerFrameBody) => {
        cy.wrap(layerFrameBody)
          .find('iframe[title="우편번호 검색 프레임"]')
          .should('be.visible')
          .its('0.contentDocument.contents')
          .should('not.be.empty')
          .then((searchFrameBody) => {
            cy.wrap(searchFrameBody).find('input').type('상암동');
          });
      });

    cy.get('#introduction').type('Cypress테스트 용도 입니다.');
    cy.get('.rt-Flex > :nth-child(4) > label').click();
    cy.get('.deep').click();
    cy.get('.content > :nth-child(1) > :nth-child(1) > .rt-Box > button').click();
    cy.get('.deep').click();
  });
});
