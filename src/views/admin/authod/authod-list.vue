<template>
    <div id="wrap-div">
    <Layout>
        <Layout>
            <Sider hide-trigger class="leftContent">
              <Card :style="{height: maxHeight+'px', overflow: 'auto'}">
                <authod-tree ref="testClick"  @child-list="handleChildId" @child-fresh="handleFreshTable" @child-editmodal="eidtHandle"  @child-modal="handlModal" :parentFresh="freshData" @child-tree="handleLeftTree"></authod-tree>
              </Card>
            </Sider>
            <Content style="background:#fff">
                <div style="padding:10px 0 0 10px;">
                    <authod-table ref="authodTableElement" :parentTableId="tableId" @child-edit="handleEdit" :parentFreshTable="freshTable" :parentDefultTable="leftTreeData"></authod-table>
                </div>
                <Modal
                v-model="showModal"
                width="760"
                :title='showText'>
               <authod-add ref="authodAdd" :athoudParmas="parmasObject" :athodId="paramsId" :athoudEditTable="paramTableId" @child-show="handleShow" @child-back="handleClose"></authod-add>
              <div slot="footer"></div>
            </Modal>
            </Content>
            
        </Layout>
       
    </Layout>
      
    </div>
</template>
<script>
import authodTree from "./authod-tree";
import authodTable from "./authod-table";
import authodAdd from "./authod-add";

export default {
  data() {
    return {
      tableId: "",
      showModal: false,
      maxHeight: 600, // 页面最大高度
      parmasObject: {
        name: "",
        addId: "",
        systemId: ""
      },
      paramTableId: "", //table编辑
      paramsId: "",
      showText: "",
      freshData: "",
      freshTable: "",
      leftTreeData: "" //默认值
    };
  },
  components: {
    authodTree,
    authodTable,
    authodAdd
  },
  created() {
    let breadcrumbs = [
      {
        name: "首页"
      },
      {
        name: "权限/角色"
      },
      {
        name: "权限管理"
      }
    ];
    this.$store.dispatch("updateBreadcrumbs", breadcrumbs);
  },
  mounted() {
    this.$nextTick(() => {
      this.maxHeight = $("#wrap-div")
        .parent()
        .height();
    });
  },
  methods: {
    handleChildId(data) {
      //获取勾选tree 的id
      this.tableId = data.id;
    },
    handlModal(data) {
      this.$refs.authodAdd.handleReset("formValidate");
      this.showModal = data.disabled;
      this.parmasObject.name = data.name;
      this.parmasObject.addId = data.addId;
      this.parmasObject.systemId = data.systemId;
      this.showText = "添加";
       
      this.$refs.authodAdd.handleAddSystem(data)
    },
    eidtHandle(data) {
      this.showModal = data.disabled;
      this.showText = "编辑";
      this.paramsId = data.id;

      this.$refs.authodAdd.handleEdit(this.paramsId)
    },
    handleShow(data) {
      this.showModal = data.disabled;
      if (data.finish) {
        
        this.$refs.testClick.getLeftTree();
         this.$refs.authodTableElement.getTableList();
      }
    },
    handleEdit(data) {
      if (data.id) {
        this.showModal = true;
        this.showText = "编辑";
        this.paramTableId = data.id;
      }
    },
    handleLeftTree(data) {
      this.leftTreeData = data.id;
      localStorage.setItem("defualtId", data.id);
      // this.tableId= data.id;
      this.$refs.authodTableElement.getTableList();
    },
    handleClose(data) {
      this.showModal = data;
    },
    handleFreshTable(data) {
      if (data) {
        this.$refs.authodTableElement.getTableList();
      }
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

