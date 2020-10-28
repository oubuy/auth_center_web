<template>
    <div>
         <Card>
          <Form ref="formValidate" :model="formValidate"  :label-width="80" style="display:flex">
            <!-- <FormItem label="商品类目" prop="categoryName" style="width:300px">
                 <Input v-model="formValidate.categoryName" class="authodHeightSelect" @on-change="handleChangeInput" @on-focus="handlePerimission"></Input>
                <div v-if="showParantModel">
                    <Card class="parentCard">
                          <div>
                                <Tree :data="treeData" :render="renderContent"></Tree>
                          </div>
                    </Card>
                </div>
            </FormItem> -->
             <FormItem label="商品类目" prop="categoryCascaderId" style="width:310px">
                <Cascader :render-format="format" filterable v-model="formValidate.categoryCascaderId" :data="categoryCascaderData" change-on-select></Cascader>
            </FormItem>
             
            <FormItem label="商品名称" prop="modityName" style="width:200px">
                <Input v-model="formValidate.modityName" placeholder="请输入商品名称"/>
            </FormItem>
            <FormItem label="型号" prop="officialModel" style="width:200px">
                <Input v-model="formValidate.officialModel" placeholder="请输入型号"/>
            </FormItem>
              <FormItem label="规格" prop="modityModel" style="width:200px">
                <Input v-model="formValidate.modityModel" placeholder="请输入规格"/>
            </FormItem>
            <FormItem label="实物展示" prop="physicalDisplay" style='width:150px'>
                <Select v-model="formValidate.physicalDisplay">
                    <Option value="null">全部</Option>
                    <Option value="0">是</Option>
                    <Option value="1">否</Option>
                </Select>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="handleSubmit()">搜 索</Button>
                <Button @click="handleReset()" style="margin-left: 8px">重 置</Button>
            </FormItem>
    </Form>
       </Card>
     
    </div>
</template>

<script>
import { categoryTree } from "@/api/store.js";

export default {
  data() {
    return {
      formValidate: {
        categoryCascaderId:[],
        categoryName: "",
        categoryId: "",
        modityName: "",
        officicalModel: "", //规格
        modityModel: "", //型号
        page: 1,
        rows: 10,
        physicalDisplay: ""
      },
      categoryList: [],
      treeData: [],
      showParantModel: false,
      categoryCascaderData:[],
    };
  },
  mounted() {
    this.getCategoryTree();
  },
  methods: {
     format (labels, selectedData) {
                const index = labels.length - 1;
                 const data = selectedData[index];
                if (data) {
                  this.formValidate.categoryId=data.id;
                    return labels[index];
                    
                }
                return labels[index];
            },
    // 类目
    getCategoryTree() {
      categoryTree().then(responese => {
        if (responese.data.code == 200) {
          let categoryArr = responese.data.data;
          let dataValue = this.getTree(categoryArr);
          this.treeData = dataValue;
          this.categoryCascaderData=dataValue;
        }
      });
    },
    // 处理tree数据
    getTree(tree) {
      let arr = [];
      if (!!tree && tree.length !== 0) {
        tree.forEach(item => {
          let obj = {};
          obj.checked = item.checked;
          obj.state = item.state;
          obj.id = item.id;
          obj.title = item.text;
          obj.attributes = item.attributes;
          obj.parentId = item.parentId; // 其他你想要添加的属性
          obj.expand = false;

          // 关联
          obj.value=item.id;
           obj.label=item.text;

          obj.children = this.getTree(item.children); // 递归调用
          arr.push(obj);
        });
      }
      return arr;
    },
    handleChangeInput() {},
    handlePerimission() {
      this.showParantModel = true;
    },
    renderContent(h, { root, node, data }) {
      return h(
        "span",
        {
          style: {
            display: "inline-block",
            color: "#999",
            width: "100%"
          },
          class: "ivu-tree-title",
          on: {
            click: e => {
              this.handleTreeSelect(data);
              e.path[0].style.backgroundColor = "#d5e8fc";
            }
          }
        },
        data.title
      );
    },
    handleTreeSelect(node) {
      this.formValidate.categoryId = node.id;
      this.formValidate.categoryName = node.title;
      this.showParantModel = false;
    },

    handleSubmit() {
      this.handleUpdateRuter();
    },
    handleReset() {
      this.formValidate.categoryId = "";
      this.formValidate.categoryName = "";
      this.formValidate.modityName = "";
      this.formValidate.officicalModel = "";
      this.formValidate.modityModel = "";
      this.formValidate.physicalDisplay = "";
      this.formValidate.page = 1;
      this.formValidate.rows = 10;

      this.handleUpdateRuter();
    },
    handleUpdateRuter() {
      let params = {};
      params.categoryId = this.formValidate.categoryId;
      params.categoryName = this.formValidate.categoryName;
      params.officicalModel = this.formValidate.officicalModel;
      params.page = this.formValidate.page;
      params.rows = this.formValidate.rows;
      params.physicalDisplay = this.formValidate.physicalDisplay;

      if (this.$route.query.storeId) {
        params.storeId = this.$route.query.storeId;
      }

      if (this.formValidate.modityName) {
        params.modityName = this.formValidate.modityName;
      } else {
        params.modityName = null;
      }

      if (this.formValidate.modityModel) {
        params.modityModel = this.formValidate.modityModel;
      } else {
        params.modityModel = null;
      }
      // if (this.formValidate.modityName && this.formValidate.modityModel) {
      //   params.modityName = this.formValidate.modityName;
      //   params.modityModel = null;
      // }

      this.$router.push({
        query: params
      });
    }
  }
};
</script>
<style lang="less" scoped>
.parentCard {
  width: 220px;
  height: 300px;
  overflow: auto;
  position: fixed;
  z-index: 2000;
}
</style>


