describe('prelist-case', function() {
  //所有用例开始前，只执行一次
  before(function() {
    Cypress.on('uncaught:exception', (err, runnable) => {
      // returning false here prevents Cypress from
      // failing the test
      return false
    })
  });
  //所有用例开始前，每个用例都执行
  beforeEach(()=>{
    // Cypress.Cookies.preserveOnce('Authorization'); //测试用例共享cookie
  });
  it('测试预报名列表',()=>{
    //监听四个页面加载完成
    cy.intercept('**/login/getUserInfo').as('getUserInfo');
    cy.intercept('**/dictionaryApi/select/dic/children').as('getDict');
    cy.intercept('**/auth/getInterfaceById').as('getA');
    cy.intercept('**/auth/findAuthByUserId').as('getB');
    cy.visit('http://localhost:8989/wap/sims');
    cy.log('访问首页');
    cy.wait(['@getUserInfo', '@getDict', '@getA', '@getB'])
    cy.log('等待必要接口请求完成');
    //点击一级菜单
    cy.contains('.el-submenu__title', '学生管理').click();
    cy.log('点击一级菜单 学生管理');
    //点击二级菜单
    cy.contains('.el-menu-item', '预报名学生列表').click();
    cy.log('点击二级菜单 预报名学生列表');
    // cy.wait(1000);
    cy.get(':nth-child(1) > .el-form-item__content > .el-input > .el-input__inner').type('测试');
    cy.log('姓名栏输入');
    cy.contains('查询').click();
    cy.log('查询按钮点击');
    cy.contains('.toolbars-left', '新增学生').click();
    cy.log('新增学生按钮点击');
  });
});
