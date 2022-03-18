## 集成方法说明

### mixins目录
1、绘制三角箭头 .triangle
2、绘制1px边框（移动端） .border

### 绘制三角箭头 .triangle
```javascript
//箭头方向  L👈  R👉 T👆 B👇
//示例，把.test绘制为向上的三角箭头
//<div class="test"></div>
.test {
  .triangle(T,10px,red);
}
```

### 绘制1px边框（移动端） .border
```javascript
//边框位置  L👈  R👉 T👆 B👇
//示例，为.test添加上边框(注：需要为元素补充position定位)
//<div class="test"></div>
.test {
  position: relative;
  .border(T);
}
```

### 设置多行文本隐藏
```javascript
//边框位置  L👈  R👉 T👆 B👇
//<div class="test"></div>
.test {
  .ellipsis-lines(2); //设置超出两行隐藏
}
```
