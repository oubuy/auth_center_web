<template>
    <div>
        <Input v-model="searchValue" @on-enter="handleEnter" clearable placeholder="输入搜索内容，按回车键搜索" style="width: 90%;margin-bottom:15px;" />
         <Tree ref="tree" :data="categoryData" :render="renderContent" @on-toggle-expand="onToggleExpand"></Tree>
    </div>
</template>
<script>
import { categoryLeftTree } from "@/api/category.js";
export default {
  data() {
    return {
      categoryData: [],
      searchValue: "",
      currentSelected: null,

      expandNodes: new Array()
    };
  },
  props: {
    expandIds: {
      type: Array,
      required: false
    },
    selectedId: {
      // type: Number,
      required: false
    }
  },
  mounted() {
    this.handleGetCategoryTree();
  },
  methods: {
    handleEnter() {
      this.handleGetCategoryTree();
    },
    handleGetCategoryTree() {
      let params = {
        categoryName: this.searchValue.trim()
      };
      categoryLeftTree(params).then(response => {
        if (response.data.code == 200) {
          let treeArr = response.data.data;
          let resultValue = this.formatterTree(treeArr);
          this.categoryData = resultValue;

          //把参数传入的“展开节点id”拷贝到组件自身属性上
          if (this.expandIds) {
            this.expandNodes = new Array();
            for (let i = 0; i < this.expandIds.length; i++) {
              this.expandNodes.push(this.expandIds[i]);
            }
          }
        }
      });
    },
    // 处理tree数据
    formatterTree(tree) {
      let arr = [];
      if (!!tree && tree.length !== 0) {
        tree.forEach(item => {
          let expand = this.searchValue != "";
          let selected = false;
          //根据参数传入的选中节点id对节点进行选中操作
          if (item.id == this.selectedId) {//设置背景颜色
            selected = true;
          }
          //根据参数传入的展开节点id对节点进行展开操作
          if (this.expandIds) {//设置展开得
            for (let i = 0; i < this.expandIds.length; i++) {
              if (item.id === this.expandIds[i]) {
                expand = true;
              }
            }
          }

          // let expand = this.searchValue != "";
          let obj = {};
          //设置是否选择
          obj.selected = selected;
          //设置是否展开
          obj.expand = expand;
          obj.title = item.cateName;
          obj.id = item.id;
          obj.cateNamePath = item.cateNamePath;
          obj.parentId = item.parentId;
          // obj.expand = expand;
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
            width: "100%"
          }
        },
        [
          h("span", [
            h(
              "span",
              {
                style: {
                  display: "inline-block",
                  cursor: "pointer",
                  color: "#515a6e"
                },
                class: data.selected
                  ? "ivu-tree-title ivu-tree-title-selected"
                  : "ivu-tree-title",
                on: {
                  click: e => {
                    // let allTreeNode=this.$refs.tree.getCheckedAndIndeterminateNodes();
                    // console.log(allTreeNode,'allTreeNode')
                    this.cancelSelect();
                    this.currentSelected = e.path[0].style;
                    e.path[0].style.backgroundColor = "#d5e8fc";
                    e.path[0].class = "ivu-tree-title ivu-tree-title-selected";

                    //点击时选中节点
                    data.selected = true;
                    this.handelParentNode(data);
                  }
                }
              },
              data.title
            )
          ])
        ]
      );
    },
    handelParentNode(data) {
      
      this.$emit("child-selectTree", data, this.categoryData);
    },
    // 取消选中状态
    cancelSelect() {
      //取消所有选中状态
      let selectedNodes = this.$refs.tree.getSelectedNodes();
      selectedNodes.forEach(node => {
        node.selected = false;
      });
      if (this.currentSelected != null) {
        this.currentSelected.backgroundColor = "#fff";
      }
    },
    onToggleExpand(node) {
      //更新展开节点列表
      if (node.expand) {
        this.expandNodes.push(node.id);
      } else {
        this.expandNodes = this.expandNodes.filter(item => item != node.id);
      }
      this.$emit("org-toggle-expand", node, this.expandNodes);
    }
  },
  watch: {
    searchValue(val) {
      if (val == "") {
        this.handleGetCategoryTree();
      }
    }
  }
};
</script>

