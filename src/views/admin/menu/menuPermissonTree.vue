<template>
    <div>
         <Tree :data="treeData" :render="renderContent"></Tree>
    </div>
</template>
<script>
import { menuTree } from "@/api/menu";

export default {
  data() {
    return {
      treeData: []
    };
  },
  props:['heightMenuRelativeSystem'],
  mounted() {
    this.getMenuTree(this.heightMenuRelativeSystem);
  },
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
                  color: "#515a6e",
                  width: "100%"
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
          ])
        ]
      );
    },
    handelParentNode(data) {
      let params = {};
      params.name = data.name;
      params.id = data.id;
      params.disabled = true;
      this.$emit("child-permission", params);
    },
    // 取消选中状态
    cancelSelect() {
      if (this.currentSelected != null) {
        this.currentSelected.backgroundColor = "#fff";
      }
    },
    // 获取列表数据
   getMenuTree(systemId) {
    //  console.log(systemId,'系统id')
      menuTree({systemId:systemId}).then(response => {
        if (response.data.code == 200) {
          let dataArr = response.data.data;
          let dataValue = this.formatterTree(dataArr);
          this.treeData = dataValue;
          
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
          obj.expand = false;
          obj.systemId = item.systemId;
          obj.children = this.formatterTree(item.children);
          arr.push(obj);
        });
      }
      return arr;
    },
  },
 
};
</script>
