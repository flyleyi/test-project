function treeDataChangeField(arrData, settings) {
  //对象数组或对象字段key修改
  settings = settings || {};
  settings.refer = settings.refer === undefined ? 1 : settings.refer;
  var data;
  if (Object.prototype.toString.call(arrData) === '[object Array]') {
    //数组
    data = [];
    for (var i in arrData) {
      data.push(treeDataChangeField(arrData[i], settings));
    }
  } else if (arrData && typeof arrData === 'object') {
    //对象
    var opt = settings.data;
    data = {};
    for (let i in settings.refer ? arrData : opt) {
      if (arrData[i] !== undefined) {
        settings.contain && (data[i] = arrData[i]); //包含原数据所有字段，可能会被覆盖
        if (typeof opt[i] == 'function') {
          var obj = opt[i](i, arrData[i], arrData);
          if (Object.prototype.toString.call(obj) === '[object Array]') {
            data[obj[0]] = obj[1];
          } else if (obj && typeof obj === 'object') {
            for (var j in obj) {
              data[j] = obj[j];
            }
          }
        } else {
          var isArr =
            Object.prototype.toString.call(settings.treeNodes) ===
            '[object Array]';
          let key = opt[i] ? opt[i] : i;
          if (isArr) {
            data[key] = settings.treeNodes.indexOf(i) >= 0;
          } else {
            data[key] =
              !settings.treeNodes || settings.treeNodes === i
                ? treeDataChangeField(arrData[i], settings)
                : arrData[i];
          }
        }
      }
    }
  } else {
    data = arrData;
  }
  return data;
}

function deleteEmpty(tree, treeNode) {
  //删除tree里空数组
  treeNode = treeNode || 'children';
  for (var i in tree) {
    var item = tree[i];
    if (item[treeNode] && item[treeNode].length < 1) {
      delete item[treeNode];
    } else if (item[treeNode] && item[treeNode].length > 0) {
      deleteEmpty(item[treeNode], treeNode);
    }
  }
  return tree;
}

export default {
  treeDataChangeField,
  deleteEmpty
};
