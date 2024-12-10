describe('My App', () => {
  context('Login', () => {
    describe('Login Flow with Redirect Handling', () => {
      it('Valid user logs in and is redirected to /service', () => {
        cy.login('123456@gmail.com', 'q1w2e3r4!');
      });
      it('Invalid user', () => {
        cy.visit('/service/login');
        cy.get('#email').type('wrong@gmail.com');
        cy.get('#password').type('q1w2e3r4!');
        cy.get('.btn_group button').click();
        cy.contains('로그인에 실패했습니다!');
      });
    });

    context('Logout', () => {
      it('Logout from myPage', () => {
        cy.login('123456@gmail.com', 'q1w2e3r4!');
        cy.get(':nth-child(3) > :nth-child(2) > a').click();
        cy.get(':nth-child(2) > button').click();
      });
    });
  });
});
