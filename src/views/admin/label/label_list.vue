<template>
    <div>
        <Card :style="{textAlign:'left',background: '#fff',height:'65px'}">
            <Form ref="formInline" :label-width='60' :model="formData" inline>
                <FormItem label="名称">
                     <Input v-model="formData.tagName" clearable placeholder="请输入名称"></Input>
                </FormItem>    
                  <FormItem label="描述">
                     <Input v-model="formData.remark" clearable placeholder="请输入描述"></Input>
                </FormItem>                      
                <FormItem>
                    <Button type="primary" @click="handleSearch">查 询</Button>             
                </FormItem>
            </Form>
         </Card>     
         <div style="text-align: left;margin-top:20px;padding-bottom:10px;"><Button @click="handleAdd">新 增</Button></div>  
        
        <Table border :columns="columns12" :data="data6" :loading="loading" height="600">
            <template slot-scope="{ row }" slot="modityTagStyleList">
            
                <div class="style_content">
                    <div v-for="(item,index) in  row.modityTagStyleList" :key="index" class="style_btn">
                      <img :src="item.url" alt="">
                     </div>
                </div>
            </template>
            <template slot-scope="{ row, index }" slot="action">
                <Button type="primary" size="small" style="margin-right: 5px" @click="handleEdit(row)">编 辑</Button>
                <Button type="error" size="small" @click="handelDelete(row)">删 除</Button>
            </template>
        </Table>
         <Page  @on-change="handelPage" class="paging" :total="total" show-total :current="formData.page" :page-size="formData.rows" />

          <alet-tip v-show="alertShow" @child-tip="handleCloseTip" :alertTipParams="alertTipParams"></alet-tip>
    </div>
</template>

<script>
import { getLabel, deleteLabel } from "@/api/label.js";
import aletTip from "@/components/alertTip.vue";

export default {
  data() {
    return {
      alertTipParams: {
        headTip: "删除标签",
        titleTip: "你确认删除标签吗？"
      },
      alertShow: false,
      deleteRowId: "",

      formData: {
        tagName: "",
        remark: "",
        rows: 10,
        page: 1
      },
      loading: true,
      total: 0,
      columns12: [
        {
          title: "名称",
          key: "tagName",
          width: 250
        },

        {
          title: "描述",
          key: "remark"
          // width: 300
        },
        {
          title: "样式",
          slot: "modityTagStyleList"
        },
        {
          title: "操作",
          slot: "action",
          width: 200,
          align: "center"
        }
      ],
      data6: []
    };
  },
  components: {
    aletTip
  },
  mounted() {
    let breadcrumbs = [{ name: "首页" }, { name: "标签管理" }];
    this.$store.dispatch("updateBreadcrumbs", breadcrumbs);
    this.handleGetLabelList();
  },
  methods: {
    handleGetLabelList() {
      this.loading = true;
      let page = this.$route.query.page;
      let rows = this.$route.query.rows;
      if (page && !isNaN(page)) {
        this.formData.page = parseInt(page);
      } else {
        this.formData.page = 1;
      }
      if (rows && !isNaN(rows)) {
        this.formData.rows = parseInt(rows);
      } else {
        this.formData.rows = 10;
      }
      let params = {
        page: this.formData.page,
        rows: this.formData.rows,
        tagName: this.formData.tagName,
        remark: this.formData.remark
      };
      this.data6 = [];
      getLabel(params).then(res => {
        if (res.data.code == 200) {
          this.total = res.data.data.total;
          this.data6 = res.data.data.list;
          this.loading = false;
        }
      });
    },
    handleCloseTip(data) {
      if (data == "true") {
        let params = {
          id: this.deleteRowId
        };
        deleteLabel(params).then(res => {
          if (res.data.code == 200) {
            this.$Message.success(res.data.msg);
            this.handleGetLabelList();
          }
        });
         this.alertShow = false;
      } else {
        this.alertShow = false;
      }
    },
    handelDelete(data) {
      this.alertShow = true;
      this.deleteRowId = data.id;
      // let params = {
      //   id: data.id
      // };
      // deleteLabel(params).then(res => {
      //   if (res.data.code == 200) {
      //     this.$Message.success(res.data.msg);
      //     this.handleGetLabelList();
      //   }
      // });
    },
    handleAdd() {
      this.$router.push({
        query: { add: "add" },
        path: "/admin/label/add"
      });
    },
    handelPage(val) {
      this.formData.page = val;
      this.updateRuter();
    },
    updateRuter() {
      this.$router.push({
        query: this.formData
      });
    },
    handleSearch() {
      this.updateRuter();
    },
    handleEdit(data) {
      // console.log(data, "data");
      this.$router.push({
        query: { id: data.id },
        path: "/admin/label/add"
      });
    }
  },
  watch: {
    $route: "handleGetLabelList"
  }
};
</script>
<style lang="less" scoped>
.paging {
  text-align: right;
  margin-top: 10px;
}
.style_content {
  display: flex;
  .style_btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 100px;
    padding: 5px;
    img {
      max-width: 100%;
      max-height: 100%;
      width: auto;
      height: auto;
    }
  }
}
</style>
