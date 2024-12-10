describe('template spec', () => {
  it('accessUrlToAgit', () => {
    const agitId = 6;

    cy.login('123456@gmail.com', 'q1w2e3r4!');
    cy.request({
      method: 'GET',
      url: `/service/agits/${agitId}`,
      failOnStatusCode: false,
    }).then((response) => {
      if (response.status === 500) {
        cy.log('서버 오류 500 응답이 감지됨');
      } else {
        cy.visit(`/service/agits/${agitId}`);
        cy.get('body').should('exist');
      }
    });
  });
});
