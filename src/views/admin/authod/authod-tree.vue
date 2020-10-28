<template>
    <div>
         <Tree :data="treeData" ref="treeParent" :render="renderContent"></Tree>
    </div>
</template>
<script>
import { permissionTree, deletePermission } from "@/api/authod.js";
export default {
  data() {
    return {
      treeData: [],
      buttonProps: {
        type: "default",
        size: "small"
      },
      currentSelected: null,
      parentList: {}
    };
  },
  props: ["parentFresh"],
  created() {
    this.getLeftTree();
  },
  mounted() {},
  methods: {
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
                    this.currentSelected = e.path[0].style;
                    e.path[0].style.backgroundColor = "#d5e8fc";
                    this.handelParentNode(data);
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
                  marginRight: "8px"
                },
                on: {
                  click: () => {
                    this.addAuthod(root, node, data);
                  }
                }
              }),
              h("Button", {
                props: Object.assign({}, this.buttonProps, {
                  icon: "ios-create-outline"
                }),
                style: {
                  marginRight: "8px"
                },
                on: {
                  click: () => {
                    this.editAuthod(data);
                  }
                }
              }),
              h("Button", {
                props: Object.assign({}, this.buttonProps, {
                  icon: "ios-remove"
                }),
                on: {
                  click: () => {
                    // this.remove(root, node, data);
                    this.deleteAuthod(data);
                  }
                }
              })
            ]
          )
        ]
      );
    },
    addAuthod(root, node, data) {
      let ret = this.getParent(this.treeData, [], data.id);
      let netA = this.getPP(ret, [], data.parentId);
      let sortNumber = netA.sort();
      sortNumber.push(data.id);
      let addParams = {};
      addParams.name = data.name;
      addParams.addId = data.id;
      addParams.systemId = data.systemId;
      addParams.heigthIds = netA.sort();
     
      addParams.disabled = true;
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
    editAuthod(data) {
      let addParams = {};
      addParams.id = data.id;
      addParams.disabled = true;
      this.$emit("child-editmodal", addParams);
    },
    // 勾选获取id
    handelParentNode(data) {
      this.$emit("child-list", data);
    },

    // 取消选中状态
    cancelSelect() {
      if (this.currentSelected != null) {
        this.currentSelected.backgroundColor = "#fff";
      }
    },
    deleteAuthod(data) {
      let deletId = [];
      deletId.push(data.id.toString());
      deletePermission({ permissionIdList: deletId }).then(response => {
        if (response.data.code == 200) {
          this.$Message.success(response.data.msg);
          this.$emit("child-fresh", true);
          this.getLeftTree();
        }
      });
    },
    // 获取列表数据
    getLeftTree() {
      permissionTree().then(response => {
        if (response.data.code == 200) {
          let dataArr = response.data.data;
          let dataValue = this.getTree(dataArr);
          this.treeData = dataValue;
          if (!localStorage.getItem("defualtId")) {
            this.$emit("child-tree", this.treeData[0]);
          }
        }
      });
    },
    // 处理tree数据
    getTree(tree) {
      let arr = [];
      if (!!tree && tree.length !== 0) {
        tree.forEach(item => {
          let obj = {};
          obj.title = item.name;
          obj.id = item.id;
          obj.parentId = item.parentId;
          obj.expand = false;
          obj.systemId = item.systemId;
          obj.name = item.name;
          obj.children = this.getTree(item.children); // 递归调用
          arr.push(obj);
        });
      }
      return arr;
    }
  },
  watch: {}
};
</script>
