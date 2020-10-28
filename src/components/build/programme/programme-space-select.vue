<template>
<Modal :value="modal" title="选择空间" @on-visible-change="handleVisibleChange" class-name="vertical-center-modal" :width="1000">
    <Form :label-width='80' inline>
        <FormItem label="案例编号">
            <Input type="text" v-model.trim="formData.spaceId" placeholder="请输入案例编号" @on-enter="handleSearch" clearable style="width:120px;"></Input>
        </FormItem>
        <FormItem label="楼盘">
            <Select v-model.trim="buildingSearch" filterable remote :remote-method="handleSearchBuilding" @on-change="handleSelectBuilding" placeholder="请输入楼盘名称搜索" style="width:200px;" clearable>
                <Option v-for="building in buildingData" :value="building.buildingId" :label="building.buildingName" :key="building.buildingId">
                    <span>{{ building.buildingName }}</span>
                    <!-- <span style="float:right;color:#9ea7b4">{{building.cityName}}</span> -->
                </Option>
            </Select>
        </FormItem>
        <FormItem label="户型">
            <Select v-model="formData.modelId" style="width:200px;" clearable>
                <Option v-for="model in buildingModelData" :value="model.modelId" :label="model.modelName" :key="model.modelId">
                    <span>{{ model.modelName }}</span>
                    <span style="float:right; color:#9ea7b4; margin-left:8px;">{{model.modelType}}</span>
                </Option>
            </Select>
        </FormItem>
        <FormItem label="风格">
            <space-style-select :styleId="formData.styleId" @on-change="handleChangeStyle" style="width:120px;"></space-style-select>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSearch">搜 索</Button>
            <Button @click="handleResetForm" style="margin-left: 8px">重 置</Button>
        </FormItem>
    </Form>
    <Table :data="spaceList" :columns="spaceColumns" ref="selection" @on-row-click="handleRowClick" :loading="loading" @on-selection-change="handleSelectionChange" :height="400">
        <template slot-scope="{ row, index }" slot="imageUrl">
            <table-img v-if="row.imageUrl" :data="[row.imageUrl]" @child-img="handleFliter"></table-img>
        </template>
    </Table>
    <div style="padding-top:8px; text-align:right;">
        <Page :total="total" :page-size="formData.rows" :current="formData.page" show-total show-sizer @on-change="changePage" @on-page-size-change="changePageSize" :page-size-opts="[10,20,50,80,100]"></Page>
    </div>
    <div slot="footer">
        <Button type="text" size="large" @click="handleVisibleChange(false)">取消</Button>
        <Button type="primary" size="large" @click="handleOk">确定</Button>
    </div>
</Modal>
</template>

<script>
import { findBuilding, findSpace, findBuildingModel } from "@/api/building.js";
import spaceStyleSelect from "@/components/build/space/space-style-select";
import tableImg from "@/components/build/table-img";

export default {
  props: {
    modal: {
      type: Boolean,
      default: false,
      required: true
    },
    selection: {
      type: Array,
      default: [],
      required: true
    },
    isAdminPage: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      fiterFlag: false,
      formData: {
        page: 1, // 当前页
        rows: 10, // 每页显示多少条
        spaceId: "",
        styleId: "",
        buildingId: "",
        modelId: ""
      },
      buildingSearch: "",
      buildingData: [],
      buildingModelData: [],
      loading: false,
      total: 0,
      spaceList: [],
      spaceSelected: [],
      spaceColumns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "编号",
          key: "spaceId",
          align: "center",
          width: 100
        },
        {
          title: "案例名称",
          key: "spaceName",
          align: "center",
          minWidth: 120
        },
        {
          title: "效果图",
          key: "imageUrl",
          slot: "imageUrl",
          align: "center",
          width: 120
        },
        {
          title: "空间类型",
          key: "spaceTypeName",
          align: "center",
          width: 100
        },
        {
          title: "风格",
          key: "styleName",
          align: "center",
          width: 100
        },
        {
          title: "是否上架",
          key: "onShelf",
          align: "center",
          width: 100,
          render: (h, params) => {
            return h(
              "span",
              {
                style: {
                  color: params.row.onShelf == 0 ? "#c5c8ce" : "#2db7f5"
                }
              },
              params.row.onShelf == 0 ? "否" : "是"
            );
          }
        },
        {
          title: "创建人",
          key: "creater",
          align: "center",
          width: 100
        },
        {
          title: "创建日期",
          key: "createTime",
          align: "center",
          width: 100,
          render: (h, params) => {
            return h(
              "span",
              params.row.createTime == null
                ? ""
                : params.row.createTime.substr(0, 10)
            );
          }
        }
      ]
    };
  },
  components: {
    spaceStyleSelect,
    tableImg
  },
  created() {
    // this.fetchData();
  },
  methods: {
    handleChangeStyle(item) {
      this.formData.styleId = item ? item.value : "";
    },
    handleFliter(data) {
      this.fiterFlag = data;
    },
    handleRowClick(value, index) {
       
      if (this.fiterFlag == true) {
        this.fiterFlag = false;
        return;
      } else {
     
        this.$refs.selection.toggleSelect(index);
      }
    },
    handleSelectionChange(selection) {
      this.spaceList.forEach(item => {
        for (let i = 0; i < this.spaceSelected.length; i++) {
          if (this.spaceSelected[i].spaceId == item.spaceId) {
            this.spaceSelected.splice(i, 1);
            break;
          }
        }
      });
      selection.forEach(item => {
        this.spaceSelected.push(item);
      });
    },
    handleChecked() {
      for (let i = 0; i < this.spaceList.length; i++) {
        for (let j = 0; j < this.spaceSelected.length; j++) {
          if (this.spaceList[i].spaceId == this.spaceSelected[j].spaceId) {
            this.$set(this.spaceList[i], "_checked", true);
            break;
          }
        }
      }
    },
    handleVisibleChange(val) {
      this.$emit("update:modal", val);
      if (val) {
        let arr = this.selection.slice(0); //深拷贝，（等价一个新的数组）
        this.spaceSelected.splice(0, this.spaceSelected.length);
        arr.forEach(item => {
          this.spaceSelected.push(item);
        });
        this.fetchData();
      }
    },
    handleOk() {
      this.selection.splice(0, this.selection.length);
      this.spaceSelected.forEach(item => {
        this.selection.push(item);
      });
      this.$emit("update:modal", false);
    },
    fetchData() {
      this.loading = true;
      this.formData.isAdminPage = this.isAdminPage;
      findSpace(this.formData).then(resp => {
        this.spaceList = [];
        if (resp.data.code == 200) {
          this.total = resp.data.data.total;
          resp.data.data.list.forEach(item => {
            this.spaceList.push(item);
          });
        }
        this.handleChecked();
        this.loading = false;
      });
    },
    handleSearch() {
      this.formData.page = 1;
      this.fetchData();
    },
    handleResetForm() {
      this.formData.page = 1;
      this.formData.spaceId = "";
      this.formData.styleId = "";
      this.formData.buildingId = "";
      this.formData.modelId = "";
      this.buildingSearch = "";
      this.buildingData = [];
      this.buildingModelData = [];
      this.fetchData();
    },
    changePage(val) {
      this.formData.page = val;
      this.fetchData();
    },
    changePageSize(val) {
      this.formData.rows = val;
      this.formData.page = 1;
      this.fetchData();
    },
    handleSearchBuilding(val) {
      val = val.trim();
      if (val) {
        let param = {
          buildingName: val,
          isAdminPage: this.isAdminPage
        };
        findBuilding(param).then(resp => {
          this.buildingData = [];
          if (resp.data.code == 200) {
            resp.data.data.list.forEach(item => {
              this.buildingData.push(item);
            });
          }
        });
      } else {
        this.buildingData = [];
        this.buildingModelData = [];
        this.formData.buildingId = "";
        this.formData.modelId = "";
      }
    },
    handleSearchBuildingModel(buildingId) {
      let param = {
        buildingId,
        isAdminPage: this.isAdminPage,
        rows: 10000
      };
      findBuildingModel(param).then(resp => {
        this.buildingModelData = [];
        if (resp.data.code == 200) {
          resp.data.data.list.forEach(item => {
            this.buildingModelData.push(item);
          });
        }
      });
    },
    handleSelectBuilding(val) {
      this.formData.buildingId = val || "";
      if (val) {
        this.handleSearchBuildingModel(val);
      }
    }
  }
};
</script>

<style lang="less">
.vertical-center-modal {
  display: flex;
  align-items: center;
  justify-content: center;

  .ivu-modal {
    top: 0;
  }
}
</style>
