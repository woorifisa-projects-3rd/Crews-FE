describe('template spec', () => {
  it('joinInAgit', () => {
    const agitId = 6;
    cy.login('123456@gmail.com', 'q1w2e3r4!');
    cy.visit('/service/search');
    cy.get('#keyword').clear('h');
    cy.get('#keyword').type('hi{enter}');
    cy.get('button').click();
    cy.get('.rt-Flex > .txt_line').click();
    cy.get('.Button_button_l__3SS4W > .deep').click();
    cy.on('window:alert', (alertText) => {
      expect(alertText).to.equal('가입 신청이 완료되었습니다.');
    });
  });
});
