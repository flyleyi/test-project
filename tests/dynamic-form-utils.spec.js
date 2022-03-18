import { describe, it, expect } from '@jest/globals';
import { formItemsMergeOptions } from '../src/plugins/common/dynamic-form-utils';

describe('test dynamic-form-utils.js', () => {
  it('formItemsMergeOptions', () => {
    let arr = [];
    arr.push({
      targetOptions: [],
      originOptions: [],
      newOptions: []
    });
    // 测试合并多项
    arr.push({
      targetOptions: [{ prop: 'name' }],
      originOptions: [{ prop: 'age' }],
      newOptions: [
        {
          prop: 'name'
        }
      ]
    });

    // 测试属性合并
    arr.push({
      targetOptions: [{ prop: 'name', attrs: { disabled: true } }],
      originOptions: [
        {
          prop: 'name',
          type: 'input',
          attrs: { disabled: false, readonly: true }
        }
      ],
      newOptions: [
        {
          prop: 'name',
          type: 'input',
          attrs: {
            disabled: false,
            readonly: true
          }
        }
      ]
    });

    // 测试数组覆盖
    arr.push({
      targetOptions: [
        {
          prop: 'age',
          type: 'select',
          options: [
            {
              label: 'label1',
              value: 'value1'
            }
          ]
        }
      ],
      originOptions: [
        {
          prop: 'age',
          type: 'select',
          options: [
            {
              label: 'label2',
              value: 'value2'
            }
          ]
        }
      ],
      newOptions: [
        {
          prop: 'age',
          type: 'select',
          options: [
            {
              label: 'label2',
              value: 'value2'
            }
          ]
        }
      ]
    });

    arr.forEach(item => {
      expect(
        formItemsMergeOptions(item.targetOptions, item.originOptions)
      ).toEqual(item.newOptions);
    });

    expect(() => {
      formItemsMergeOptions([{}], [{}]);
    }).toThrow();
  });
});
