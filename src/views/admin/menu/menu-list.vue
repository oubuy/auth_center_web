<template>
     <div>
        <Layout>
            
            <Layout>
                <Sider hide-trigger class="leftContent">
                     <Card :style="{height: '760px', overflow: 'auto'}">
                         <menu-tree ref="menuTreeElement" @child-editmodal="eidtHandle" @child-fresh="handleFreshTable" @child-modal="handlModal" @child-list="handleIdRightList" @child-defult="handelDefultId"></menu-tree>
                     </Card>
                </Sider>
                <Content style="padding:10px 0 0 10px;background:#fff;">
                  <menu-table @child-edit="handleEdit" :parentTableId="tableId" ref="menuTableElement" :parentDefultTable="defaultId"></menu-table>
                 <Modal
                    v-model="showModal"
                     width="760"
                    :title='showText'>
                    <menu-add ref="menuAddElement" @child-show="handleShow" :editMenuId="paramsId" :defaultHeightMenuId="defaultHeightMenuId" @child-back="handleClose"></menu-add>
                    <div slot="footer"></div>
                </Modal>
                </Content>
            </Layout>
            
        </Layout>
     </div>
</template>
<script>
import menuTree from "./menu-tree";
import menuTable from "./menu-table";
import menuAdd from "./menu-add";

export default {
  data() {
    return {
      tableId: "",
      defaultId: "",
      showModal: false,
      showText: "",
      paramsId: "",
      defaultHeightMenuId: {
        id: "",
        title: ""
      }
    };
  },
  components: {
    menuTree,
    menuTable,
    menuAdd
  },
  created() {
    let breadcrumbs = [
      {
        name: "首页"
      },
      {
        name: "系统设置"
      },
      {
        name: "菜单管理"
      }
    ];
    this.$store.dispatch("updateBreadcrumbs", breadcrumbs);
  },
  methods: {
    handleIdRightList(data) {
      this.tableId = data.id;
    },
    handelDefultId(data) {
      localStorage.setItem("menuDefultId", data.id);
      this.$refs.menuTableElement.getMenuPageTable();
    },
    handlModal(data) {
      this.$refs.menuAddElement.handleReset("formValidate");
      this.showModal = data.disabled;
      this.defaultHeightMenuId.id = data.heightMenuId;
      this.defaultHeightMenuId.title = data.title;
      this.showText = "添加";

      this.$refs.menuAddElement.handleSetHeigthMenu(data);
    },
    handleShow(data) {
      this.showModal = false;
      if (data.finish) {
        this.$refs.menuTreeElement.getMenuTree();
        this.$refs.menuTableElement.getMenuPageTable();
      }
    },
    eidtHandle(data) {
      this.showModal = data.disabled;
      this.showText = "编辑";
      this.$refs.menuAddElement.handleEdit(data.id);
    },
    handleFreshTable(data) {
      if (data) {
        this.$refs.menuTableElement.getMenuPageTable();
      }
    },
    handleClose(data) {
       this.$refs.menuTableElement.getMenuPageTable();
      this.showModal = data;
    },
    handleEdit(data) {
      if (data.id) {
        this.showModal = true;
        this.showText = "编辑";
        this.$refs.menuAddElement.handleEdit(data.id);
      }
    }
  }
};
</script>
<style lang="less" scoped>
.leftContent {
  min-width: 300px !important;
  background: rgb(255, 255, 255);
}
</style>


