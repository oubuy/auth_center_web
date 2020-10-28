<template>
    <div>
        <div class="modity_layout">
        <Layout>
            <Content :style="{textAlign:'left',background: '#fff'}">
                  <div>
                    <Card>
                        <Form ref="formInline" :label-width='60' :model="formData" inline>
                            <FormItem label="商品">
                                  <Input v-model="formData.modityName" clearable placeholder="请输入型号/名称"></Input>
                            </FormItem>
                            <FormItem label="类目" prop="categoryIds">
                                 <Cascader :data="categoryList" change-on-select style="width:300px"  @on-change="handleCategoryCascader"></Cascader>
                            </FormItem>
                            <FormItem label="规格">

                                <InputNumber v-model="formData.modityLength" style="width:70px"></InputNumber >&nbsp;X&nbsp;
                                <InputNumber v-model="formData.modityWidth" style="width:70px"></InputNumber >

                            </FormItem>
                              <FormItem label="审核状态" prop="audit" style="width:200px">

                                  <Select v-model="formData.audit">
                                        <Option value="null">全部</Option>
                                        <Option value="1">审核通过</Option>
                                        <Option value="0">待审核</Option>
                                         <Option value="2">审核不通过</Option>
                                </Select>
                            </FormItem>
                              <FormItem label="上架状态" prop="status" style="width:150px">
                                  <Select v-model="formData.status">
                                        <Option value="null">全部</Option>
                                        <Option value="0">是</Option>
                                        <Option value="1">否</Option>
                                </Select>
                            </FormItem>
                              <FormItem label="创建人" >
                                  <Input v-model="formData.creater" clearable placeholder="请输入姓名"></Input>
                            </FormItem>
                            <FormItem label="创建时间" style="width:445px">
                                <date-picker type="date" style="width: 150px" v-model="formData.createDateStart" @on-change="handleStartCreateDateChange" clearable placeholder="开始时间"></date-picker>&nbsp;&nbsp;至&nbsp;&nbsp;
                                <date-picker type="date" style="width: 150px" v-model="formData.createDateEnd" clearable placeholder="开始时间" @on-change="handleEndCreateDateChange"></date-picker>
                            </FormItem>
                            <FormItem label="修改时间" style="width:415px">
                                <date-picker type="date" style="width: 150px" v-model="formData.modifyDateStart" clearable placeholder="开始时间" @on-change="handleStartModifyDateChange"></date-picker>&nbsp;&nbsp;至&nbsp;&nbsp;
                                <date-picker type="date" style="width: 150px" v-model="formData.modifyDateEnd" clearable placeholder="开始时间" @on-change="handleEndModifyDateChange"></date-picker>
                            </FormItem>

                            <FormItem>
                                <Button type="primary" @click="handleSearch()">查 询</Button>

                            </FormItem>
                        </Form>
                    </Card>
                     <div style="padding:15px 0 15px 0" class="buttonList">

                        <Button size="small" style="margin-left: 8px;" @click="handleAddModity">新增</Button>
                        <Button size="small" style="margin-left: 8px" @click="handleEdit">编辑</Button>
                        <Button size="small" style="margin-left: 8px" @click="handleUpdateOn">上架</Button>
                        <Button size="small" style="margin-left: 8px" @click="handleUpdateDown">下架</Button>
                    </div>
                    <modity-table @child-multipSelection="handleSelection" ref="tableFetch"></modity-table>
                </div>
            </Content>

        </Layout>
    </div>
    </div>
</template>
<script>
import {
  getCategoryAll,
  dealerModityUpdateStatus
} from "@/api/dealerModity.js";
import modityTable from "./dealerTable";
export default {
  data() {
    return {
      formData: {
        categoryParams: "",
        modityName: "",
        modityLength: null,
        modityWidth: null,
        audit: null,
        status: null,
        creater: "",
        createDateStart: "",
        createDateEnd: "",
        modifyDateStart: "",
        modifyDateEnd: ""
      },
      categoryList: [],
      multipleSelection: [] //选择
    };
  },
  components: {
    modityTable
  },
  created() {
    let breadcrumbs = [{ name: "首页" }, { name: "商品管理" }];
    this.$store.dispatch("updateBreadcrumbs", breadcrumbs);
    this.handleGetCategoryAll();
  },
  methods: {
    handleGetCategoryAll() {
      getCategoryAll({ status: 0 }).then(res => {
        if (res.data.code == 200) {
          let dataArr = res.data.data;
          let treeData = this.getTree(dataArr);

          this.categoryList = treeData;
        }
      });
    },
    getTree(tree) {
      let arr = [];
      if (!!tree && tree.length !== 0) {
        tree.forEach(item => {
          let obj = {};
          obj.label = item.cateName;
          obj.value = item.id;
          obj.status = item.status;

          obj.children = this.getTree(item.children); // 递归调用
          arr.push(obj);
        });
      }
      return arr;
    },
    handleStartCreateDateChange(changeTime, type) {
      this.formData.createDateStart = changeTime;

      if (
        this.formData.endModifyDate != "" &&
        this.formData.endModifyDate != null
      ) {
        if (
          this.formData.startModifyDate != "" &&
          this.formData.startModifyDate != null
        ) {
          let dateValue = new Date(this.formData.startModifyDate);
          let dateValue2 = new Date(this.formData.endModifyDate);

          if (dateValue > dateValue2) {
            this.formData.startModifyDate = "";
            this.$Message.warning("开始时间不能大于结束时间");
          }
        }
      }
    },
    handleEndCreateDateChange(changeTime, type) {
      this.formData.createDateEnd = changeTime;

      if (
        this.formData.endCreateDate != "" &&
        this.formData.endCreateDate != null
      ) {
        if (
          this.formData.startCreateDate != "" &&
          this.formData.startCreateDate != null
        ) {
          let dateValue = new Date(this.formData.startCreateDate);
          let dateValue2 = new Date(this.formData.endCreateDate);

          if (dateValue > dateValue2) {
            this.formData.endCreateDate = "";
            this.$Message.warning("开始时间不能大于结束时间");
          }
        }
      }
    },
    handleStartModifyDateChange(changeTime, type) {
      this.formData.modifyDateStart = changeTime;

      if (
        this.formData.endModifyDate != "" &&
        this.formData.endModifyDate != null
      ) {
        if (
          this.formData.startModifyDate != "" &&
          this.formData.startModifyDate != null
        ) {
          let dateValue = new Date(this.formData.startModifyDate);
          let dateValue2 = new Date(this.formData.endModifyDate);

          if (dateValue > dateValue2) {
            this.formData.startModifyDate = "";
            this.$Message.warning("开始时间不能大于结束时间");
          }
        }
      }
    },
    handleEndModifyDateChange(changeTime, type) {
      this.formData.modifyDateEnd = changeTime;

      if (
        this.formData.endModifyDate != "" &&
        this.formData.endModifyDate != null
      ) {
        if (
          this.formData.startModifyDate != "" &&
          this.formData.startModifyDate != null
        ) {
          let dateValue = new Date(this.formData.startModifyDate);
          let dateValue2 = new Date(this.formData.endModifyDate);

          if (dateValue > dateValue2) {
            this.formData.endModifyDate = "";
            this.$Message.warning("开始时间不能大于结束时间");
          }
        }
      }
    },
    handleSearch() {
      this.updateRuter();
    },
    handleCategoryCascader(value, selectedData) {
      let sectionArr = selectedData;

      //   sectionArr.forEach(item => {
      //     let obj = {};
      //     obj.cateName = item.label;
      //     obj.status = item.status;
      //     this.formData.categoryIds.push(obj);
      //   });
      if (sectionArr.length == 3) {
        let lastCategory = sectionArr[2];
        //   let obj={
        //       categoryId:lastCategory.value,
        //       status:lastCategory.status,
        //   }
        this.formData.categoryParams = lastCategory.value;
      } else {
        let noLastCategory = sectionArr[sectionArr.length - 1];
        if(noLastCategory) this.formData.categoryParams = noLastCategory.label;
        else this.formData.categoryParams = "";
      }
    },
    updateRuter() {
      this.$router.push({
        query: this.formData
      });
    },
    handleAddModity() {
      this.$router.push({
        path: "/dealer/addEditeDealerModity",
        query: { add: "add" }
      });
    },
    handleSelection(data) {
      this.multipleSelection = data;
    },
    handleUpdateOn() {
      //上架
      if (this.multipleSelection.length == 0) {
        this.$Message.warning("请勾选启用选项！");
      } else {
        let paramsEndisable = this.multipleSelection;
        let endisableId = [];
        for (let i = 0; i < paramsEndisable.length; i++) {
          endisableId.push(paramsEndisable[i].id.toString());
        }
        let params = {
          ids: endisableId,
          status: 0
        };
        dealerModityUpdateStatus(params).then(response => {
          if (response.data.code == 200) {
            this.$Message.success(response.data.msg);
            this.multipleSelection = [];
            this.$refs.tableFetch.getModityList();
          }
        });
      }
    },
    handleUpdateDown() {
      //下架
      if (this.multipleSelection.length == 0) {
        this.$Message.warning("请勾选启用选项！");
      } else {
        let paramsEndisable = this.multipleSelection;
        let endisableId = [];
        for (let i = 0; i < paramsEndisable.length; i++) {
          endisableId.push(paramsEndisable[i].id.toString());
        }
        let params = {
          ids: endisableId,
          status: 1
        };
        dealerModityUpdateStatus(params).then(response => {
          if (response.data.code == 200) {
            this.$Message.success(response.data.msg);
            this.multipleSelection = [];
            this.$refs.tableFetch.getModityList();
          }
        });
      }
    },
    handleEdit() {
      if (this.multipleSelection.length == 0) {
        this.$Message.warning("请勾选选项！");
      } else if (this.multipleSelection.length > 1) {
        this.$Message.warning("只能一条一条编辑！");
      } else {

       let data="";
       this.multipleSelection.forEach(item=>{
         data=item.id;
       })

         this.multipleSelection = [];
        this.$router.push({
          path: "/dealer/addEditeDealerModity",
          query: { id: data }
        });
      }
    }
  }
};
</script>
