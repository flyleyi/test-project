import { mount, shallowMount } from '@vue/test-utils';
import {
  describe,
  it,
  expect,
  jest,
  beforeEach,
  afterEach
} from '@jest/globals';
import CTable from '@/components/common/CTable';
describe('CTable', () => {
  let wrapper;
  // beforeEach(() => {
  // });
  afterEach(() => {
    wrapper.destroy();
  }, 1000);
  it('初始值渲染测试', async () => {
    wrapper = mount(CTable, {
      propsData: {
        headers: [
          {
            label: '序列1',
            prop: 'name'
          },
          {
            label: '操作',
            colType: 'btns',
            btns: [
              {
                label: '按钮1'
              },
              {
                label: '按钮2',
                hidden: () => {
                  return Math.random() < 0.5;
                }
              }
            ]
          }
        ],
        data: [
          {
            name: 'a1'
          },
          {
            name: 'a2'
          }
        ]
      }
    });
    const elTableEl = wrapper.findComponent({ name: 'ElTable' });
    //eltable正确渲染
    expect(elTableEl.exists()).toBeTruthy();
    let spy = jest.spyOn(elTableEl.vm, 'doLayout');
    //触发ctable的doLayout方法
    wrapper.vm.doLayout();
    //等待nexttikck
    await wrapper.vm.$nextTick();
    //验证eltable的doLayout触发
    expect(spy).toBeCalled();
    spy.mockClear();
  });
  it('无数据渲染测试', () => {
    wrapper = mount(CTable);
    const noDataEl = wrapper.find('.el-table__empty-text');
    expect(noDataEl.text()).toBe('暂无数据');
  });
});
