<template>
    <div>
         <Tree :data="menuTreeData" :render="renderContent"></Tree>
    </div>
</template>
<script>
import { menuTree, deleteMenu } from "@/api/menu";
export default {
  data() {
    return {
      menuTreeData: [],
      currentSelected: null //判断是否选中
    };
  },
  mounted() {
    this.getMenuTree();
  },

  methods: {
    getMenuTree() {
      menuTree().then(response => {
        if (response.data.code == 200) {
          let dataArr = response.data.data;
          let dataValue = this.formatterTree(dataArr);
          this.menuTreeData = dataValue;
          if (!localStorage.getItem("menuDefultId")) {
            this.$emit("child-defult", this.menuTreeData[0]);
          }
        }
      });
    },
    // 处理tree数据
    formatterTree(tree) {
      let arr = [];
      if (!!tree && tree.length !== 0) {
        tree.forEach(item => {
          let obj = {};
          obj.title = item.name;
          obj.name = item.name;
          obj.id = item.id;
          obj.seq = item.seq;
          obj.parentId=item.parentId;
          obj.icon=item.icon;

          obj.expand = false;
          obj.systemId = item.systemId;
          obj.children = this.formatterTree(item.children);
          arr.push(obj);
        });
      }
      return arr;
    },
    renderContent(h, { root, node, data }) {
      return h(
        "span",
        {
          style: {
            display: "inline-block",
            textAlign: "left",
            width: "100%"
          }
        },
        [
          h("span", [
            h(
              "a",
              {
                style: {
                  display: "inline-block",
                  cursor: "pointer",
                  color: "#515a6e"
                },
                on: {
                  click: e => {
                    this.cancelSelect();
                    this.currentSelected = e.path[0].style; //获取到元素
                    e.path[0].style.backgroundColor = "#d5e8fc";
                    this.$emit("child-list", data);
                  }
                }
              },
              data.title
            )
          ]),

          h(
            "span",
            {
              style: {
                display: "inline-block",
                float: "right",
                marginRight: "32px"
              }
            },
            [
              h("Button", {
                props: Object.assign({}, this.buttonProps, {
                  icon: "ios-add"
                }),
                style: {
                  marginRight: "8px",
                  padding: "1px 7px 2px",
                  fontSize: "12px",
                  borderRadius: "3px"
                },
                on: {
                  click: () => {
                    // this.append(data);
                    this.handleAdd(root, node, data);
                  }
                }
              }),
              h("Button", {
                props: Object.assign({}, this.buttonProps, {
                  icon: "ios-create-outline"
                }),
                style: {
                  marginRight: "8px",
                  padding: "1px 7px 2px",
                  fontSize: "12px",
                  borderRadius: "3px"
                },
                on: {
                  click: () => {
                    this.handleEdit(data);
                  }
                }
              }),
              h("Button", {
                props: Object.assign({}, this.buttonProps, {
                  icon: "ios-remove"
                }),
                style: {
                  padding: "1px 7px 2px",
                  fontSize: "12px",
                  borderRadius: "3px"
                },
                on: {
                  click: () => {
                    this.handleDeleteMenu(data);
                  }
                }
              })
            ]
          )
        ]
      );
    },
    // 取消选择
    cancelSelect() {
      if (this.currentSelected != null) {
        this.currentSelected.backgroundColor = "#fff";
      }
    },
    // 新增
    handleAdd(root, node, data) {
    
        let ret = this.getParent(this.menuTreeData, [], data.id);
       
      let netA = this.getPP(ret, [], data.parentId);
      let sortNumber = netA.sort();
        sortNumber.push(data.id);
      let addParams = {};
      addParams.disabled = true;
      addParams.heightMenuId = netA.sort();
      addParams.title = data.title;

      this.$emit("child-modal", addParams);
    },
     getPP(array, childs, pid) {
      for (let i = 0; i < array.length; i++) {
        if (array[i].id == pid) {
          childs.push(array[i].id);
          this.getPP(array, childs, array[i].parentId);
        }
        if (i == array.length - 1) {
          return childs;
        }
      }
    },

    getParent(array, childs, ids) {
      for (let i = 0; i < array.length; i++) {
        let item = array[i];
        if (Number(item.id) === Number(ids)) {
          childs.push(item);
          return childs;
        }
        if (item.children && item.children.length > 0) {
          childs.push(item);
          let rs = this.getParent(item.children, childs, ids);
          if (rs) {
            return rs;
          }
        }
      }
    },
    handleEdit(data) {
      let addParams = {};
      addParams.id = data.id;
      addParams.disabled = true;
      this.$emit("child-editmodal", addParams);
    },
    handleDeleteMenu(data) {
      let deletId = [];
      deletId.push(data.id.toString());
      deleteMenu({ menuIdList: deletId }).then(response => {
        if (response.data.code == 200) {
          this.$Message.success(response.data.msg);
          this.$emit("child-fresh", true);
          this.getMenuTree();
        }
      });
    }
  },
  watch: {}
};
</script>

