<template>
<div style="text-align:left">
    <div>
        <Input v-model="orgName" placeholder="请输入组织名称，按回车键搜索" @on-enter="fetchData" clearable ></Input>
    </div>
    <div style="padding:5px 0; margin-bottom:10px;">
        <Checkbox v-model="showDisabled">显示禁用</Checkbox>
    </div>
    <Spin v-if="spinShow" fix></Spin>
    <Tree :data="treeData" ref="tree" :render="renderContent" :style="{paddingTop:'10px'}"  @on-toggle-expand="onToggleExpand"></Tree>
</div>
</template>

<script>
import { getOrgTree } from "@/api/org.js";

import { mapGetters } from "vuex";

export default {
  props: {
    type: {
      type: String,
      required: true,
      validator: function(value) {
        // 这个值必须匹配下列字符串中的一个
        return ["outer", "inner", "userOuter"].indexOf(value) !== -1;
      }
    },
    selectedId: {
      // type: Number,
      required: false
    },
    expandIds: {
      type: Array,
      required: false
    },

    org: String,
    otherArrTop: {
      type: Array
    }
  },
  data() {
    return {
      orgName: "",
      showDisabled: false, // 是否显示禁用
      spinShow: false,

      treeData: [],
      treeDataCache: [],
      currentSelected: null,

      // treeFreshLongIdArr: [] ,//返回设置状态值
      expandNodes: new Array()
    };
  },
  computed: {
    // outerOrgTreeLongId() {
    //     // console.log(this.$store.getters.treeLongId, "vuex");
    //   if (this.$store.getters.treeLongId) {
    //     this.treeFreshLongIdArr = this.$store.getters.treeLongId.split(",");
    //     return this.$store.getters.treeLongId;
    //   }else{
    //       this.treeFreshLongIdArr=[];
    //   }
    // },
    //      ...mapGetters(['refElement'])
  },
  created() {
    this.fetchData();
  },
  watch: {
    orgName: function(val) {
      if (val == "") {
        this.fetchData();
        this.handleTreeSelect({});
      }
    },
    showDisabled: function(val) {
      this.treeDataCache = []; // 清空缓存
      this.fetchData();
      this.handleTreeSelect({});
      this.$emit("child-disabled", val);
    }
  },
  methods: {
    // 加载数据
    fetchData() {
      this.orgName = this.orgName.trim();
      if (this.orgName == "" && this.treeDataCache.length > 0) {
        // 读取缓存
        this.treeData = [];
        this.treeDataCache.forEach(item => {
          this.treeData.push(item);
        });
        return;
      }
      let param = {
        orgName: this.orgName
      };
      if (!this.showDisabled) {
        // 不显示禁用
        param.disabled = false;
      }

      this.spinShow = true;
      getOrgTree(param, this.type).then(resp => {
        if (resp.data.code == 200) {
          this.treeData = [];

          this.cancelSelect();
          let treeList = this.handleQueryResult(resp.data.data);

          if (this.$route.query.orgTherType) {
            treeList.forEach(item => {
              this.otherArrTop.push(item);
            });
            this.treeData = this.otherArrTop;
          } else {
            treeList.forEach(item => {
              this.treeData.push(item);
            });
          }

          this.spinShow = false;
          if (this.orgName == "") {
            // 设置缓存
            this.treeDataCache = treeList;
          }

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
    handleSearch() {
      this.fetchData();
      this.handleTreeSelect({});
    },
    // 处理查询结果数据
    handleQueryResult(treeList) {
      let _this = this;

      let ret = [];
      if (treeList && treeList != null) {
        treeList.forEach(item => {
          let expand = this.orgName != "";
          let selected = false;
          //根据参数传入的选中节点id对节点进行选中操作
          if (item.id == this.selectedId) {
            // debugger;
            selected = true;
          }
          //根据参数传入的展开节点id对节点进行展开操作
          if (this.expandIds) {
            for (let i = 0; i < this.expandIds.length; i++) {
              if (item.id === this.expandIds[i]) {
                expand = true;
              }
            }
          }

          let obj = {};
          obj.title = (item.disabled ? "【已禁用】" : "") + item.orgName;
          //设置是否选择
          obj.selected = selected;
          //设置是否展开
          obj.expand = expand;
          obj.id = item.id;
          obj.longId = item.longId;
          obj.isDisabled = item.disabled;
          obj.orgName = item.orgName;
          obj.comId = item.comId;
          obj.parentId = item.parentId;
          obj.children = this.handleQueryResult(item.children);
          ret.push(obj);
        });

        // treeList.forEach(item=> {
        //   let obj = {};
        //    obj.expand = expand;
        //   this.treeFreshLongIdArr.forEach((itemLongId,index) => {
        //       if (item.id == itemLongId) {
        //       obj.expand = true;
        //     //   if(index==this.treeFreshLongIdArr.length-1){
        //     //       console.log(this.refElement,'元素444444444444')
        //     //         this.refElement.style.backgroundColor = "red";
        //     //   }

        //     }
        //   });

        //   obj.title = (item.disabled ? "【已禁用】" : "") + item.orgName;
        //   obj.id = item.id;
        //   obj.longId = item.longId;
        //   obj.isDisabled = item.disabled;
        //   obj.orgName = item.orgName;
        //   obj.comId = item.comId;
        //   obj.parentId = item.parentId;
        //   obj.children = this.handleQueryResult(item.children);
        //   ret.push(obj);
        // });
      }
      return ret;
    },
    renderContent(h, { root, node, data }) {
      let style = {};
      if (data.isDisabled) {
        style.color = "#999";
      }

      return h(
        "span",
        {
          style: style,
          class: data.selected
            ? "ivu-tree-title ivu-tree-title-selected"
            : "ivu-tree-title",
          on: {
            click: e => {
              this.cancelSelect();
              this.currentSelected = e.path[0].style;
              e.path[0].style.backgroundColor = "#d5e8fc";
              e.path[0].class = "ivu-tree-title ivu-tree-title-selected";

              //点击时选中节点
              data.selected = true;
              this.handleTreeSelect(data, root);
            }
          }
        },
        data.title
      );
    },
    handleTreeSelect(node, root) {
      this.$emit("org-select", node, root);
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
    // 重置
    handleReset() {
      this.cancelSelect();
      this.orgName = "";
      this.showDisabled = false;
      this.treeDataCache = []; // 清空缓存
      this.fetchData();
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
  }
};
</script>
