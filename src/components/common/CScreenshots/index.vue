<template>
  <!-- 截图组件 -->
  <div ref="content">
    <slot />
  </div>
</template>

<script>
import domToImages from 'dom-to-image';
import { Loading } from 'element-ui';

export default {
  name: 'CScreenshots',
  props: {
    /**
     * 宽度演示
     */
    width: {
      type: String,
      default: 'auto'
    },
    /**
     * 图片倍率
     */
    ratio: {
      type: Number
    }
  },
  data() {
    return {};
  },
  methods: {
    /**
     * 截图方法
     * @param {Boolean} distinct 清晰模式
     * @param {String} fileType 文件类型 png/jpeg
     */
    screenshots(distinct, fileType = 'png') {
      return this.$nextTick().then(() => {
        //   let content = this.$refs.content;
        //   let contentWidth = content.styles.width;
        //   let contentHeight = content.styles.height;

        //   content.styles.width = this.width;
        //   content.styles.height = this.height;

        //   // hack：解决截图后出现空白部分
        //   let pageXOffset = window.pageXOffset;
        //   let documentElementScrollTop = document.documentElement.scrollTop;
        //   let bodyScrollTop = document.body.scrollTop;
        //   window.pageYOffset = 0;
        //   document.documentElement.scrollTop = 0;
        //   document.body.scrollTop = 0;

        //   return html2canvas(this.$refs.content, {
        //     backgroundColor: 'transparent',
        //     allowTaint: true,
        //     useCORS: true
        //   }).finally(() => {
        //     window.pageXOffset = pageXOffset;
        //     document.documentElement.scrollTop = documentElementScrollTop;
        //     document.body.scrollTop = bodyScrollTop;
        //     content.styles.width = contentWidth;
        //     content.styles.height = contentHeight;
        //   });
        // })
        // .then(canvas => {
        //   let dataUrl = canvas.toDataURL();
        //   return dataUrl;
        // 拷贝元素
        let content = document.createElement('div');
        content.innerHTML = this.$refs.content.innerHTML;
        let wrap = document.createElement('div');
        wrap.className = 'screenshots-fiexd';
        wrap.appendChild(content);
        this.setStyle(content, {
          width: this.width,
          height: this.height
        });
        this.$refs.content.appendChild(wrap);
        //绘制清晰图片
        if (distinct) {
          return this.drawDistinctCanvas(content, wrap, fileType);
        }
        let convertImg;
        switch (fileType) {
          case 'jpeg':
            convertImg = domToImages.toJpeg(content);
            break;
          default:
            convertImg = domToImages.toPng(content);
            break;
        }
        return convertImg
          .then(function(dataUrl) {
            return dataUrl;
          })
          .finally(() => {
            this.$refs.content.removeChild(wrap);
          });
      });
    },
    /**
     * 设置样式
     * @param {HTMLElement} el dom元素
     * @param {Object} styles 样式
     */
    setStyle(el, styles) {
      Object.keys(styles).forEach(key => {
        el.style[key] = styles[key];
      });
    },
    /**
     * 通过绘制倍率canvans，导出清晰图片
     * @param {HTMLElement} content 渲染的dom
     * @param {HTMLElement} wrap 临时容器
     * @param {String} fileType 文件类型 jpeg png
     */
    drawDistinctCanvas(content, wrap, fileType) {
      var rect = content.getBoundingClientRect();
      let width = rect.width;
      let height = rect.height;
      if (this.width) {
        width = this.width.replace('px', '');
      }
      if (this.height) {
        height = this.heightreplace('px', '');
      }
      let canvas = document.createElement('canvas');
      let ratio = window.devicePixelRatio; //设定缩放比例
      // 默认生成二倍图
      if (ratio < 2) ratio = 2;
      if (this.ratio) ratio = this.ratio;
      canvas.width = ratio * width;
      canvas.height = ratio * height;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      let ctx = canvas.getContext('2d');
      //转svg保持清晰
      return domToImages
        .toSvg(content, {
          quality: 1.25
        })
        .then(dataUrl => {
          return this.getCanvasDataUrl({
            canvas,
            ctx,
            width,
            height,
            dataUrl,
            fileType,
            ratio
          });
        })
        .finally(() => {
          this.$refs.content.removeChild(wrap);
        });
    },
    //获取canvans输出dataurl，将大小乘以设备分辨率，保证图片清晰度
    getCanvasDataUrl({ canvas, ctx, width, height, ratio, dataUrl, fileType }) {
      return new Promise(resolve => {
        let img = new Image();
        img.src = dataUrl;
        let exportType;
        switch (fileType) {
          case 'jpeg':
            exportType = 'image/jpeg';
            break;
          default:
            exportType = 'image/png';
            break;
        }
        img.onload = function() {
          ctx.drawImage(
            img,
            0,
            0,
            width,
            height,
            0,
            0,
            ratio * width,
            ratio * height
          );
          resolve(canvas.toDataURL(exportType));
        };
      });
    }
  }
};
</script>

<style lang="less">
.screenshots-fiexd {
  top: 0;
  position: fixed;
  z-index: -1;
  height: 0;
  overflow: hidden;
}
</style>
