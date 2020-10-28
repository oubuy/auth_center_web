<template>
   <div>
      <div class="demo-spin-article">
         <div>
            <Input v-model="orgName" placeholder="请输入组织名称，按回车键搜索" @on-enter="getOrgTree" clearable ></Input>
        </div>
        <Tree :data="treeData" multiple check-strictly show-checkbox @on-check-change="handleCheck"></Tree>
        <Spin size="large" fix v-if="spinShow"></Spin>
       </div>  
   </div>
</template>
<script>
import { orgTree } from "@/api/roleList.js";

export default {
  data() {
    return {
      orgName: "",
      treeData: [],
      spinShow: true
    };
  },
  props: ["parentTree"],
  mounted() {
    this.getOrgTree();
  },
  methods: {
    handleCheck(dataArr) {
      this.$emit("child-tree", dataArr);
    },
    getOrgTree() {
      this.orgName = this.orgName.trim();
      let params = {
        orgName: this.orgName,
        disabled: false,
        type: "DEALER"
      };
      this.spinShow = true;
      orgTree(params).then(response => {
        if (response.data.code == 200) {
          let dataArr = response.data.data;
          let dataValue = this.formarTree(dataArr);
          this.treeData = dataValue;
          setTimeout(() => {
            this.spinShow = false;
          }, 600);
        }
      });
    },
    //   处理数据
    formarTree(tree) {
      let arr = [];
      let expand = this.orgName != "";
      if (!!tree && tree.length !== 0) {
        tree.forEach(item => {
          let obj = {};
          obj.title = item.orgName;
          obj.id = item.id;
          obj.type = item.type;
          obj.expand = expand;
          obj.longId = item.longId;
          obj.isDisabled = item.disabled;
          obj.comId = item.comId;
          obj.parentId = item.parentId;
          obj.children = this.formarTree(item.children); // 递归调用
          arr.push(obj);
        });
      }
      return arr;
    },
    fetchData() {}
  },
  watch: {
    parentTree(val) {
      // console.log(val, "chilrent222");
    },
    orgName(val) {
      if (!val) {
        this.getOrgTree();
      }
    }
  }
};
</script>


