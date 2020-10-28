<template>
    <div class="add-modity">
         <Row style="background:#fff;">
            <Col span="10">
                <Card :bordered="false">
                    <div class="headerSearch">
                        <p>请选择添加的商品</p>
                        <div>
                            <Input v-model="formData.searchValue" placeholder="请输入商品名或型号" style="width: auto">
                            </Input>
                          <Button style="margin-left:8px;" @click="handleLeftSearch" type="primary">搜索</Button>
                        </div>
                    </div>
                    <Table @on-select="handleSelect" @on-select-cancel="handleSelceCancel" @on-select-all="handleAll" @on-select-all-cancel="handleCancelAll" :loading="loading" :columns="columns1" :data="leftData"></Table>
                      <Page  @on-change="handelPage" class="paging" :total="total" show-total :current="formData.page" :page-size="formData.rows" />
                </Card>
            </Col>
          
            <Col span="2" class="centerButton">
                <div class="icon-center">
                   
                    <div @click="handlRight"><Icon type="ios-arrow-forward" /></div>
                     <div @click="handLeft"><Icon type="ios-arrow-back" /></div>
                </div>
            
          
            </Col>
          <Col span="10" style="margin-left:120px;">
              <Card :bordered="false">
                <div class="headerSearch">
                  <p>已选择添加的商品</p>
                </div>
                  
                    <Table height="630" @on-select="handleRightSelect" @on-select-all="handleRightAll" @on-select-cancel="handleRightSelceCancel" :loading="loading" :columns="columns1" :data="rightData"></Table>
                    <Page  @on-change="handelRightPage" class="paging" :total="rightTotal" show-total :current="formData.page" :page-size="formData.rows" />
                
              </Card>
          </Col>
    </Row>
    <Row style="margin-left:-60px;margin-top:20px;">
      <Button type="primary" @click="handleSubmit">确定</Button>
      <Button style="margin-left:20px" @click="handleBack">取消</Button>
    </Row>

    </div>
</template>

<script>
import { shopAddmodityPage, shopAddModity } from "@/api/store.js";

export default {
  data() {
    return {
      multation: [], //左侧仓库
      rightMultation: [], //右边
      formData: {
        page: 1,
        rows: 10,
        storeId: "",
        searchValue: "",
        type:''
      },
      loading: true,
      total: 0,
      rightTotal: 0,
      columns1: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "图片",
          key: "imageUrl",
            width: 100,
          render: (h, params) => {
            return h("img", {
              attrs: {
                src: params.row.imageUrl
              },
              style: {
                width: "50px",
                height: "50px",
                padding: "5px 0"
              }
            });
          }
        },
        {
          title: "类目/型号/名称",
          key: "",
          width: 200,
          render: (h, params) => {
            let obj = {};
            obj.modityName = params.row.modityName;
            obj.officicalModel = params.row.officicalModel;
            obj.categoryName = params.row.categoryName;

            return h("div", [
              h("storeName", {
                props: {
                  addModity: obj
                }
              })
            ]);
          }
        },
        {
          title: "规格",
          key: "modityModel",
          width: 100,
        },

        {
          title: "指导价（片）",
          width: 100,
          key: "numPrice"
        },
        {
          title: "指导价（方）",
          key: "squarePrice",
          width: 100,
        }
      ],
      leftData: [], //左边存储数据
      rightData: [] //右边
    };
  },
  mounted() {
     let breadcrumbs = [{ name: "首页" }, { name: "内部商品管理" }, { name: '添加商品' }];
    this.$store.dispatch("updateBreadcrumbs", breadcrumbs);
    this.getShopAddmodityPage();
    this.formData.type=this.$route.query.type;
  },
  methods: {
    // 选中
    handleSelect(selection, row) {
      this.multation.push(row);
    },
    handleAll(arr) {
    
      this.multation = arr;
    },
    handleCancelAll(arr){
 
    this.multation = arr;
    },
    //左边 取消
    handleSelceCancel(select, cancelRow) {
      this.multation.forEach((item, index) => {
        if (item.modityId == cancelRow.modityId) {
          this.multation.splice(index, 1);
        }
      });
    },
    handlRight() {
      //   this.rightData=[];
      // this.multation.forEach(item => {
      //   this.rightData.push(item);
      // });

        if (this.rightData.length != 0) {
        let temp = this.rightData;
        this.multation.forEach(item => {
          temp.push(item);
        });
        let dataArr = this.removeDuplicatedItem(temp);
        this.rightData = temp;
        this.rightTotal = this.rightData.length;
      } else {
        this.multation.forEach(item => {
          this.rightData.push(item);
        });
        this.rightTotal = this.rightData.length;
      }

      this.multation = [];
      this.isActive = false;
      this.getShopAddmodityPage();
    },
      // 去重
    removeDuplicatedItem(arr) {
      for (var i = 0; i < arr.length - 1; i++) {
        for (var j = i + 1; j < arr.length; j++) {
          if (arr[i].modityPriceId == arr[j].modityPriceId) {
            arr.splice(j, 1); //console.log(arr[j]);
            j--;
          }
        }
      }
      return arr;
    },
    //右边table
    handleRightSelceCancel(select, cancelRow) {
      this.rightMultation.forEach((item, index) => {
        if (item.modityId == cancelRow.modityId) {
          this.rightMultation.splice(index, 1);
        }
      });
    },
    handleRightSelect(selection, row) {
      this.rightMultation.push(row);
    },
    handleRightAll(arr) {
      this.rightMultation = arr;
    },
    handleBack(){
        // this.$router.push({
        //   path:'/admin/store/list'
        // })
          this.$router.go(-1)
    },
    handLeft() {
      for (var i = 0; i < this.rightData.length; i++) {
        for (var j = 0; j < this.rightMultation.length; j++) {
          if (
            this.rightData[i].modityPriceId ==
            this.rightMultation[j].modityPriceId
          ) {
            this.rightData.splice(i, 1);
          }
        }
      }
      this.rightMultation = [];
    },
    getShopAddmodityPage() {
      this.leftData = [];
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
      this.formData.storeId = this.$route.query.storeId;
      this.formData.searchValue = this.$route.query.searchValue;

      shopAddmodityPage(this.formData).then(responese => {
        if (responese.data.code == 200) {
          this.total = responese.data.data.total;
          this.leftData = responese.data.data.list;
          this.loading = false;
        }
      });
    },
    handelPage(val) {
      this.formData.page = val;
      this.multation=[];
      this.updateRouter();
    },
    handelRightPage(val) {},
    updateRouter() {
      this.$router.push({
        query: this.formData
      });
    },
    handleLeftSearch() {
      this.updateRouter();
    },
    handleSubmit() {
      let storeIdData = this.$route.query.storeId;
      let arrSubmit = [];

      this.rightData.forEach(item => {
        let obj = {};
        obj.modityId = item.modityId;
        obj.modityPriceId = item.modityPriceId;
        obj.storeId = storeIdData;
        arrSubmit.push(obj);
      });

      shopAddModity({ storeModityList: arrSubmit }).then(
        responese => {
          if(responese.data.code==200){
          this.$Message.success(responese.data.msg);
          this.rightData=[];
        this.formData.searchValue='';
          // this.$router.go(-1)
          this.$router.push({path:'/admin/store/list',query:{storeId:this.$route.query.storeId,type:this.$route.query.type}})
          }
        }
      );
    }
  },
  watch: {
    $route: "getShopAddmodityPage"
  }
};
</script>


<style lang="less" scoped>

.container_cneter{
  display: flex;
  justify-content: center;
  align-items: center;
}
.headerSearch {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}
.centerButton {
  position: absolute;
  top: 50%;
  left: 45%;
  transform: translate(-50%, -50%);
}
.icon-center {
  flex-direction: column;

  div {
    background: #eee;
    width: 30px;
    height: 30px;
    line-height: 30px;
    margin: 0 auto;
    cursor: pointer;
    &:nth-child(1) {
      margin-bottom: 15px;
    }
  }
}

.paging {
  text-align: right;
  margin-top: 10px;
}
</style>

