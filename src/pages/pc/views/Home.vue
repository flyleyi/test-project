<template>
  <div class="home">
    <div class="home-top">
      <el-select
        v-model="searchData.sex"
        placeholder="请选择"
        @change="changSex"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-input
        class="home-top-search input-with-select"
        placeholder="搜索ID或者姓名"
        v-model="searchData.content"
        @change="changeContent"
      >
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </div>
    <div class="home-blank" v-show="mockData.length == 0">暂无数据</div>
    <div class="home-content">
      <div class="home-content-item" v-for="(item, i) in mockData" :key="i">
        <div class="home-content-item-name">{{ item.name }}</div>
        <div class="home-content-item-id"><span>ID：</span>{{ item.id }}</div>
        <div class="home-content-item-sex">
          <span>性别：</span>
          {{ item.sex == '0' ? '男' : item.sex == '1' ? '女' : '其他' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Button, Select, Option, Input } from 'element-ui';
export default {
  name: 'Home',
  components: {
    [Button.name]: Button,
    [Select.name]: Select,
    [Option.name]: Option,
    [Input.name]: Input
  },
  data() {
    return {
      searchData: {
        sex: '',
        content: ''
      },
      options: [
        {
          label: '全部性别',
          value: ''
        },
        {
          label: '男',
          value: 0
        },
        {
          label: '女',
          value: 1
        }
      ],
      mockData: []
    };
  },
  created() {
    this.mockData = [
      {
        id: '8b71bBeC-CAF8-0ce8-e8AB-8D6d74CCC15b',
        sex: 0,
        name: '邓超'
      },
      {
        id: '51D61b38-Bcfa-9E87-3739-f0fA1E9E2F51',
        sex: 0,
        name: '姜平'
      },
      {
        id: '3cB5FDaA-1EcC-cbdB-2EeB-1319Fdd5d5af',
        sex: 0,
        name: '韩刚'
      },
      {
        id: 'fdFD86fB-AB3f-3051-fEEB-cEef84bFe552',
        sex: 1,
        name: '雷娜'
      },
      {
        id: '52e5Ac5d-bADC-33D7-C2B7-FE1C71fDfDEF',
        sex: 0,
        name: '宋杰'
      },
      {
        id: 'a89EA983-Cb28-7f88-2880-29ad328bc7FA',
        sex: 1,
        name: '白丽'
      },
      {
        id: 'Db027828-4Ea6-e5ba-BCDd-bf6Cbe9FB4ef',
        sex: 0,
        name: '方洋'
      }
    ];
  },
  mounted() {},
  methods: {
    changSex(val) {
      //选择性别
      this.regData(val, this.searchData.content);
    },
    changeContent(val) {
      //搜索id或者姓名
      this.regData(this.searchData.sex, val);
    },
    regData(sex, content) {
      let data = [
        {
          id: '8b71bBeC-CAF8-0ce8-e8AB-8D6d74CCC15b',
          sex: 0,
          name: '邓超'
        },
        {
          id: '51D61b38-Bcfa-9E87-3739-f0fA1E9E2F51',
          sex: 0,
          name: '姜平'
        },
        {
          id: '3cB5FDaA-1EcC-cbdB-2EeB-1319Fdd5d5af',
          sex: 0,
          name: '韩刚'
        },
        {
          id: 'fdFD86fB-AB3f-3051-fEEB-cEef84bFe552',
          sex: 1,
          name: '雷娜'
        },
        {
          id: '52e5Ac5d-bADC-33D7-C2B7-FE1C71fDfDEF',
          sex: 0,
          name: '宋杰'
        },
        {
          id: 'a89EA983-Cb28-7f88-2880-29ad328bc7FA',
          sex: 1,
          name: '白丽'
        },
        {
          id: 'Db027828-4Ea6-e5ba-BCDd-bf6Cbe9FB4ef',
          sex: 0,
          name: '方洋'
        }
      ];

      let arr = data.filter((item, index, data) => {
        return (
          (sex === '' ? true : item.sex == sex) &&
          (content
            ? item.name.indexOf(content) != -1 || item.id.indexOf(content) != -1
            : true)
        );
      });
      this.mockData = arr;
    }
  }
};
</script>
<style lang="less" scoped>
.home {
  padding: 40px;
  .triangletest {
    .triangle(T);
  }
  .border {
    position: relative;
    width: 100px;
    height: 100px;
    .border(R, #0f0);
  }
  &-top {
    display: flex;
    justify-content: end;
    margin-bottom: 40px;
    &-search {
      width: 400px;
      margin: 0 10px 0 40px;
    }
  }
  &-content {
    display: flex;
    flex-wrap: wrap;
    &-item {
      width: calc((100% - 190px) / 3);
      padding: 30px 20px;
      border: 1px solid #ececec;
      margin: 10px;
      &-name {
        font-weight: bold;
      }
      span {
        color: #666666;
      }
      &-id {
        margin: 30px 0 20px;
      }
    }
  }
  &-blank {
    text-align: center;
    margin-top: 200px;
  }
}
</style>
