import { describe, it, expect, jest, beforeAll } from '@jest/globals';
import utils from '../src/plugins/common/utils';
describe('test utils.js', () => {
  beforeAll(() => {
    //jsdom的innerText为undefined
    Object.defineProperty(HTMLElement.prototype, 'innerText', {
      get() {
        return this.textContent;
      }
    });
  });
  jest.useFakeTimers();
  //debounce防抖函数
  it('debounce', () => {
    const fn = jest.fn();
    //在达到时间间隔后触发
    const debouncedFn = utils.debounce(fn, 1000);
    debouncedFn();
    debouncedFn();
    expect(fn).toHaveBeenCalledTimes(0);
    //在调用时马上触发
    const debouncedFn2 = utils.debounce(fn, 1000, true);
    debouncedFn2();
    debouncedFn2();
    expect(fn).toHaveBeenCalledTimes(1);
  });
  //时间格式化
  it('dateConverter', () => {
    let date1 = new Date('2017/09/10 12:13:44');
    let date2 = new Date('2018/10/22 16:59:31');
    expect(utils.dateConverter('yyyy-MM-dd hh:mm:ss', date1)).toBe(
      '2017-09-10 12:13:44'
    );
    expect(utils.dateConverter('MM/dd hh:mm', date2)).toBe('10/22 16:59');
    expect(
      utils.dateConverter('yyyy年MM月dd日hh时mm分ss秒', 1621946385558)
    ).toBe('2021年05月25日20时39分45秒');
    expect(utils.dateConverter('yyyy年MM月dd日hh时mm分ss秒', null)).toBe('-');
    expect(
      utils.dateConverter('yyyy年MM月dd日hh时mm分ss秒', '2021-09-09 12:44:33')
    ).toBe('2021年09月09日12时44分33秒');
  });
  //两数相加
  it('numAdd', () => {
    expect(utils.numAdd(19.36, 601.19)).toBe(620.55);
    expect(utils.numAdd(0.1, 0.2)).toBe(0.3);
  });
  //两数相减
  it('numSub', () => {
    expect(utils.numSub(620.55, 601.19)).toBe(19.36);
    expect(utils.numSub(0.3, 0.2)).toBe(0.1);
  });
  //两数相乘
  it('numMul', () => {
    expect(utils.numMul(12.3, 22.51)).toBe(276.873);
    expect(utils.numMul(0.3, 0.2)).toBe(0.06);
  });
  //两数相除
  it('numDiv', () => {
    expect(utils.numDiv(276.873, 22.51)).toBe(12.3);
    expect(utils.numDiv(0.3, 0.2)).toBe(1.5);
  });
  //删除url参数
  it('deleteURLPar', () => {
    let url = 'http://www.baidu.com?a=1&b=2';
    let url2 = 'http://www.baidu.com';
    let url3 = 'http://www.baidu.com?a=1&b=';
    expect(utils.deleteURLPar(url, 'a')).toBe('http://www.baidu.com?b=2');
    expect(utils.deleteURLPar(url, 'c')).toBe('http://www.baidu.com?a=1&b=2');
    expect(utils.deleteURLPar(url2, 'a')).toBe('http://www.baidu.com');
    expect(utils.deleteURLPar(url3, 'a')).toBe('http://www.baidu.com');
  });
  //替换url参数
  it('changeURLPar', () => {
    let url = 'http://www.baidu.com?a=1&b=2&c';
    expect(utils.changeURLPar(url, 'a', 'www')).toBe(
      'http://www.baidu.com?a=www&b=2'
    );
    let url2 = 'http://www.baidu.com/a?a=1#hash?a=1&b=2';
    expect(utils.changeURLPar(url2, 'a', 'www', true)).toBe(
      'http://www.baidu.com/a?a=1#hash?a=www&b=2'
    );
    let url3 = 'http://www.baidu.com?a=1';
    expect(utils.changeURLPar(url3, 'a', 'www')).toBe(
      'http://www.baidu.com?a=www'
    );
    let url4 = 'http://www.baidu.com';
    expect(utils.changeURLPar(url4, 'a', 'www')).toBe(
      'http://www.baidu.com?a=www'
    );
    let url5 = 'http://www.baidu.com?a=1';
    expect(utils.changeURLPar(url5, 'b', 'www')).toBe(
      'http://www.baidu.com?a=1&b=www'
    );
    let url6 = 'http://www.baidu.com?a=1&b';
    expect(utils.changeURLPar(url6, 'b', 'www')).toBe(
      'http://www.baidu.com?a=1&b=www'
    );
    let url7 = 'http://www.baidu.com?a';
    expect(utils.changeURLPar(url7, 'a', 'www')).toBe(
      'http://www.baidu.com?a=www'
    );
  });
  //是否整数
  it('isString', () => {
    expect(utils.isString('abc')).toBe(true);
    expect(utils.isString(123)).toBe(false);
  });
  //是否数字
  it('isNumber', () => {
    expect(utils.isNumber('abc')).toBe(false);
    expect(utils.isNumber(123)).toBe(true);
  });
  //列表转树
  it('listConvertTree', () => {
    let list = [
      {
        id: 1,
        parentId: -1
      },
      {
        id: 2,
        parentId: 1
      },
      {
        id: 3,
        parentId: 1
      },
      {
        id: 4,
        parentId: 2
      }
    ];
    let tree = [
      {
        id: 1,
        parentId: -1,
        children: [
          { children: [{ id: 4, parentId: 2 }], id: 2, parentId: 1 },
          { id: 3, parentId: 1 }
        ]
      }
    ];
    expect(utils.listConvertTree(list)).toEqual(tree);
    expect(utils.listConvertTree([])).toEqual([]);
  });
  //html转文本
  it('html2text', () => {
    expect(utils.html2text('<div>abc</div>')).toBe('abc');
    expect(utils.html2text(123)).toBe('');
  });
  //字符串转数组
  it('string2array', () => {
    expect(utils.string2array('www,abc')).toEqual(['www', 'abc']);
    expect(utils.string2array()).toEqual([]);
  });
});
