describe('request-case', function() {
  //所有用例开始前，只执行一次
  before(function() {
    Cypress.on('uncaught:exception', (err, runnable) => {
      // returning false here prevents Cypress from
      // failing the test
      return false
    })
  });
  it('get请求', function () {
    const url = 'http://10.30.5.34/sims/login/getUserInfo'
    cy.request({
        url: url,
        method: "GET",
        body: ""
    }).then(function (resp) {
        cy.log(resp.allRequestResponses)
        expect(resp.status).to.eq(200)
    })
  });
});
