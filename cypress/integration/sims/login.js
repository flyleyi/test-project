describe('login-case', function() {
  //所有用例开始前，只执行一次
  before(function() {
    Cypress.on('uncaught:exception', (err, runnable) => {
      // returning false here prevents Cypress from
      // failing the test
      return false
    })
    cy.clearCookies(); //清空cookies
  });
  it('测试登录',()=>{
    // cy.clearCookies(); //清理全部cookies
    cy.visit('http://localhost:8989/wap/sims');
    cy.log('重定向到登录页');
    //重定向到登录页，切换为账号输入
    cy.get('.login-icon').click();
    //输入账号密码
    cy.get('input[placeholder="输入用户名"]').type('admin');
    cy.get('input[placeholder="输入密码"]').type('222222');
    cy.log('输入账号密码');
    cy.intercept('**/zuul/login/toLogin').as('doLogin'); //监听登录请求发送，设置别名@doLogin
    //点击登录
    cy.get('.login-btn').click();
    cy.log('点击登录');
    //等待@doLogin完成，监听页面是否跳转到/wap/sims/sso/auth
    cy.wait('@doLogin').then(res => {
      cy.url().should('include', '/wap/sims');
      cy.log('跳转到首页');
    })
  });
});
