<template>
    <div>
       <Layout>
        <Sider hide-trigger class="leftContent">
          <Card style="width:300px;textAlign:left">
              <category-tree
              :expandIds="expandIds"
              :selectedId="selectedId"
               @child-selectTree="handleSeceltTree"
                @org-toggle-expand="handleOrgToggleExpand"></category-tree>
          </Card>
        </Sider>
        
        <Layout>
            <Content style="background:#fff;textAlign:left;paddingLeft:15px" >
                    <Card>
                    <div>
                            <Form  :model="formInline" inline :label-width="40">
                                <FormItem prop="statusSearch" label="状态" style="width:200px">
                                <Select v-model="formInline.statusSearch">
                                        <Option value="ALL">全部</Option>
                                            <Option value="0">上架</Option>
                                            <Option value="1">下架</Option>
                                    </Select>
                                </FormItem>
                                <FormItem prop="platformJsonSearch" label="平台" style="width:200px" >
                                   <Select v-model="formInline.platformJsonSearch">
                                         <Option v-for="item in platformList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                    </Select>
                                </FormItem>
                                
                                <FormItem>
                                    <Button type="primary" @click="handleSearch()">搜 索</Button>
                                     <Button style="margin-left:15px" @click="handleRest()">重 置</Button>
                                </FormItem>
                            </Form>
                    </div>
                    
                    </Card>
                    <div style="padding:15px 0;">
                        <Button @click="handleAddCategory">添加类目</Button>
                           <Button style="margin-left:8px;" @click="handleEditCategory">编辑类目</Button>
                        <Button style="margin-left:8px;" @click="handleMoreSort">批量排序</Button>
                      
                    </div>
                    <cate-table ref="categoryTable" @child-selection="handleSelectionArr"></cate-table>
            </Content>
        </Layout>
    </Layout>
    </div>
</template>
<script>
import categoryTree from "./component/category-tree";
import cateTable from "./category-table";
import { moduleConfig, categoryId } from "@/api/category.js";
export default {
  data() {
    return {
      formInline: {
        statusSearch: "",
        platformJsonSearch: "",
        categoryTableIdSearch: "",
        category_parentIds: []
      },
      multipleSelection: [],
      addCategoryId: "", //类目id
      platformList: [
        {
          value: "ALL",
          label: "全部"
        }
      ]
    };
  },
  computed: {
    selectedId() {
      return this.$store.getters.treeSelectedId;
    },
    expandIds() {
      return this.$store.getters.treeExpandIds;
    }
  },
  components: {
    categoryTree,
    cateTable
  },
  mounted() {
    let breadcrumbs = [{ name: "首页" }, { name: "类目管理" }];
    this.$store.dispatch("updateBreadcrumbs", breadcrumbs);
    this.getModuleConfig();
    this.getCategoryId();
  },
  methods: {
    handleOrgToggleExpand(org, expandNodes) {
      if (expandNodes && expandNodes.length > 0) {
        let expandIds = new Array();
        for (let i = 0; i < expandNodes.length; i++) {
          expandIds.push(expandNodes[i]);
        }
        this.$store.dispatch("setTreeExpandIds", expandIds);
      }
    },

    handleSearch() {
      // let params = {};
      // params.platformJson = this.formInline.platformJson;
      // if (this.formInline.status == "ALL") {
      //   params.status = "";
      // } else {
      //   params.status = this.formInline.status;
      // }
      this.updateRouter();
    },
    getCategoryId() {
      categoryId().then(response => {
        if (response.data.code == 200) {
          this.addCategoryId = response.data.data;
        }
      });
    },
    updateRouter() {
      this.$router.push({
        query: this.formInline
      });
    },
    handleRest() {
      this.formInline.platformJsonSearch = "";
      this.formInline.statusSearch = "";
      this.updateRouter();
    },
    getModuleConfig() {
      moduleConfig().then(response => {
        if (response.data.code == 200) {
          let platformArr = response.data.data;
          platformArr.forEach(item => {
            let obj = {};
            obj.value = item.moduleCode;
            obj.label = item.moduleName;
            //  obj.value = item.id;
            // obj.label = item.name;
            this.platformList.push(obj);
          });
        }
      });
    },
    handleSeceltTree(data, root) {
      let res = this.getParentId(root, data.id);

      this.$store.dispatch("setTreeSelectedId", data.id);

      this.formInline.categoryTableIdSearch = data.id;
      this.formInline.category_parentIds = res;
      this.updateRouter();
    },
    handleAddCategory() {
      let route_parentIds = this.$route.query.category_parentIds;
      if (typeof route_parentIds == "string") {//数组拿下来有可能是字符串
        this.formInline.category_parentIds = route_parentIds.split(",");
      }else{
        this.formInline.category_parentIds =route_parentIds;
      }

      this.$router.push({
        path: "/admin/category/add",
        query: {
          addCategoryId: this.addCategoryId,
          category_parentIds: this.formInline.category_parentIds
        }
      });
    },
    handleSelectionArr(data) {
      this.multipleSelection = data;
    },
    handleEditCategory() {
      if (this.multipleSelection.length == 0) {
        this.$Message.warning("请勾选启用选项！");
      } else if (this.multipleSelection.length > 1) {
        this.$Message.warning("只能一条一条编辑！");
      } else {
        let selectionRow = this.multipleSelection[0];
        this.$router.push({
          path: "/admin/category/add",
          query: {
            editCategoryId: selectionRow.id,
            editStute: true
          }
        });
      }
    },
    handleMoreSort() {
      this.$refs.categoryTable.handleEditSort();
    },
    // 递归查找父类，找到对应得id
    getParentId(data2, nodeId2) {
      var arrRes = [];
      if (data2.length == 0) {
        if (!!nodeId2) {
          arrRes.unshift(nodeId2);
        }
        return arrRes;
      }
      let rev = function(data, nodeId) {
        for (var i = 0; i < data.length; i++) {
          let node = data[i];
          if (node.id == nodeId) {
            //为了找到对应id位置
            arrRes.unshift(nodeId);
            rev(data2, node.parentId);
          } else {
            if (!!node.children) {
              rev(node.children, nodeId);
            }
          }
        }
        return arrRes;
      };
      arrRes = rev(data2, nodeId2);
      return arrRes;
    }
  }
};
</script>

<style lang="less" scoped>
.leftContent {
  min-width: 300px !important;
  background: rgb(255, 255, 255);
  // overflow-y: scroll;
  // height: 800px;
}
</style>