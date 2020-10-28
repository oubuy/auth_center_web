<template>
<div style="position:relative;">
    <!-- 功能键 -->
    <div style="text-align:left; margin-bottom:8px;">
        <Button @click="edit()">新增</Button>
    </div>
    <!-- 表格数据 -->
    <zk-table ref="table" :data="data" :columns="columns" :border="true" :expand-type="false" :selection-type="false">
         <template slot="relationModityNum" slot-scope="scope">
            <div @click="handleRelationNum(scope.row)" class="relation" style="cursor: pointer;">{{scope.row.relationModityNum}}</div>
          
        </template>

        <template slot="status" slot-scope="scope">
            <span v-if="scope.row.status==0" style="color:#2db7f5;">启用</span>
            <span v-else style="color:#c5c8ce;">禁用</span>
        </template>
        <template slot="cloud" slot-scope="scope">
            <span v-if="scope.row.platformJson.indexOf('3D_Cloud')!=-1" style="color:#2db7f5;">开启</span>
            <span v-else style="color:#c5c8ce;">关闭</span>
        </template>
        <template slot="IPAD" slot-scope="scope">
            <span v-if="scope.row.platformJson.indexOf('iPad')!=-1" style="color:#2db7f5;">开启</span>
            <span v-else style="color:#c5c8ce;">关闭</span>
        </template>
        <template slot="official" slot-scope="scope">
            <span v-if="scope.row.platformJson.indexOf('official')!=-1" style="color:#2db7f5;">开启</span>
            <span v-else style="color:#c5c8ce;">关闭</span>
        </template>
        <template slot="OSN_TV" slot-scope="scope">
            <span v-if="scope.row.platformJson.indexOf('OSN_TV')!=-1" style="color:#2db7f5;">开启</span>
            <span v-else style="color:#c5c8ce;">关闭</span>
        </template>
        <template slot="opt" slot-scope="scope">
            <Button size="small" type="primary" @click="edit(scope.row)">编辑</Button>
            <Button size="small" type="error" @click="handleDisableCategory(scope.row)" style="margin-left: 8px">禁用</Button>
        </template>
    </zk-table>
    <Spin v-if="spinShow" fix></Spin>
    <!-- 编辑 -->
    <category-edit ref="categoryEdit" @save-success="fetchData()"></category-edit>
</div>
</template>
<script>
import { categoryLeftTree, disableCategory } from "@/api/category.js";
import categoryEdit from "./category-edit";

export default {
  data() {
    return {
      spinShow: false,
      data: [],
      columns: [
        {
          label: "类目",
          prop: "cateName",
          width: "150px"
        },
        {
          label: "关联商品数量",
          prop: "relationModityNum",
          width: "50px",
         
          type: "template",
          template: "relationModityNum"
        },
        {
          label: "排序",
          prop: "sortNum",
          width: "50px"
        },
        {
          label: "状态",
          prop: "status",
          width: "50px",
          type: "template",
          template: "status"
        },
        {
          label: "3D云",
          prop: "platformJson",
          width: "50px",
          type: "template",
          template: "cloud"
        },
        {
          label: "IPAD",
          prop: "platformJson",
          width: "50px",
          type: "template",
          template: "IPAD"
        },
        {
          label: "官网",
          prop: "platformJson",
          width: "50px",
          type: "template",
          template: "official"
        },
        {
          label: "交互大屏",
          prop: "platformJson",
          width: "50px",
          type: "template",
          template: "OSN_TV"
        },
        {
          label: "创建人",
          prop: "creater",
          width: "50px"
        },
        {
          label: "创建时间",
          prop: "createDateStr",
          width: "50px"
        },
        {
          label: "操作",
          prop: "opt",
          width: "80px",
          type: "template",
          template: "opt"
        }
      ]
    };
  },
  components: {
    categoryEdit
  },
  created() {
    let breadcrumbs = [
      {
        name: "首页"
      },
      {
        name: "商品管理"
      },
      {
        name: "系列管理"
      }
    ];
    this.$store.dispatch("updateBreadcrumbs", breadcrumbs);
    this.fetchData();
  },
  methods: {
    handleRelationNum(data) {
     
      this.$router.push({
        path:'/dealer/dealerModity',
        query:{
          categoryParams:data.id
        }
      })
    },
    fetchData() {
      this.spinShow = true;
      categoryLeftTree({}).then(resp => {
        this.data = [];
        if (resp.data.code == 200) {
          resp.data.data.forEach(item => {
            this.data.push(item);
          });
        }
        this.spinShow = false;
      });
    },
    handleDisableCategory(category) {
      this.$Modal.confirm({
        title: "请确认",
        content:
          "<p>确定禁用类目【" +
          category.cateName +
          "】与其所有下级类目吗？</p>",
        onOk: () => {
          let params = {
            ids: [category.id]
          };
          disableCategory(params).then(resp => {
            if (resp.data.code == 200) {
              this.$Message.success(resp.data.msg);
            }
            this.fetchData();
          });
        }
      });
    },
    edit(category) {
      this.$refs.categoryEdit.initEdit(category);
    }
  }
};
</script>

