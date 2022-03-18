<template>
  <div class="ctree" @click.stop>
    <!-- <template v-if="!attrs.cascader">
      <el-input
        v-model.trim="innerValue"
        @click.native="isTreeOpen = true"
        class="ctree-input"
        type="input"
        suffix-icon="el-icon-arrow-down"
        readonly
      >
      </el-input>
      <div
        class="ctree-pos el-popper"
        x-placement="bottom-start"
        v-if="isTreeOpen"
      >
        <div class="popper__arrow" style="left:35px"></div>
        <el-tree
          :props="defaultProps"
          @node-click="handleNodeClick"
          @check="handleCheck"
          v-bind="attrs"
          v-on="events"
          :data="tree"
        ></el-tree>
      </div>
    </template> -->
    <template>
      <el-cascader
        v-on="events"
        v-bind="attrs"
        :props="attrs.props"
        v-model="val"
        :options="
          treeDataChangeField(
            tree,
            attrs.settings || {
              data: { id: 'value', name: 'label' },
              treeNodes: 'children'
            }
          )
        "
        @change="handleChange"
        style="width:100%"
      ></el-cascader>
    </template>
  </div>
</template>
<script>
import { Tree, Input, Cascader } from 'element-ui';
import Utils from './utils';
import dfMixin from '../mixins/df-mixin';
export default {
  name: 'DfCascader',
  mixins: [dfMixin],
  components: {
    [Tree.name]: Tree,
    [Input.name]: Input,
    [Cascader.name]: Cascader
  },
  created() {
    //console.log('ctree Created...');

    //多tags模式下不建议使用getData方式获取数据,会导致多次重复创建重复请求
    this.attrs.getData &&
      this.attrs.getData().then(res => {
        this.tree = Utils.deleteEmpty(res.data || res || []);
        console.log(this.tree);
      });
  },
  props: {
    value: [String, Number, Array]
  },
  data() {
    return {
      // data: [{
      //   label: '一级 1',
      //   id: 1
      // }],
      // defaultProps: {
      //   children: 'children',
      //   label: 'label'
      // },
      // isTreeOpen: false,
      tree: []
    };
  },
  watch: {
    val() {
      //解决v-model绑定
      this.$emit('input', this.val);
    },
    'attrs.tree': {
      handler(now) {
        //console.log('attrs.tree', now , this);
        if (this.attrs.getData) {
          return;
        }
        this.tree = now || [];
      },
      immediate: true
    }
  },
  methods: {
    treeDataChangeField: Utils.treeDataChangeField,
    // handleNodeClick(data, node, ref) {
    //   //树被点击事件
    //   console.log(data, node, ref);
    //   this.emit(node.data.id);
    //   this.closeTree();
    // },
    // handleCheck() {
    //   //当树复选框被点击的时候触发
    //   console.log(arguments);
    // },
    // closeTree() {
    //   //关闭树弹窗
    //   this.isTreeOpen = false;
    // },
    handleChange(value) {
      //当级联选中节点变化时触发
      console.log(value);
    }
  }
};
</script>
<style lang="less" scoped>
.ctree {
  &-input /deep/ input {
    cursor: pointer;
  }

  &-pos {
    position: absolute;
    left: 0;
    top: 100%;
    z-index: 1111;
    right: 0;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    background-color: #fff;
    padding: 6px 20px;
    box-sizing: border-box;
    margin-bottom: 40px;
  }
}
</style>
