<template>
    <div>
       <Form ref="formData" :rules="ruleValidate" :label-width='80' :model="formData" >
                <FormItem label="标签名称" prop="tagName" >
                     <Input v-model="formData.tagName" style="width:300px" clearable placeholder="请输入名称"></Input>
                </FormItem>    
                  <FormItem label="描述" prop="remark">
                     <Input type="textarea" style="width:300px" v-model="formData.remark" clearable placeholder="请输入描述"></Input>
                </FormItem>                      
                <!-- <FormItem label="样式" prop="modityTagStyleList">
                    <upload-img :mainParamId="addModityId" @child-uploadimg="handleUploadimg"></upload-img>
                </FormItem> -->
                <div class="uploadImg_btn">
                    <div class="comonbox" >
                        <span class="conmomSpan">*</span>
                        <FormItem :label-width="60" label="样式" prop="modityTagStyleList">
                        </FormItem>
                        
                         <upload-img :mainParamId="addModityId" @child-uploadimg="handleUploadimg"></upload-img>
                         <span class="field-tip" style="vertical-align: middle;">样式图片大小不超过500kb</span>
                    </div>
                   <span class="commonImgTip" v-show="tipFlag">样式图片不能为空</span>
                </div> 
                <FormItem>
                    <Table border :columns="labelColumns" :data="labelData" width="700">
                        <template slot-scope="{ row }" slot="url">
                           <div class="img_content">
                                <img :src="row.url" alt="">
                           </div>
                        </template>
                        <template slot-scope="{ row,index }" slot="description">
                            <Input type="textarea" v-model="row.description" style="width:200px" @on-change="handleChangeInput(row,index)" clearable placeholder="请输入说明"></Input>
                        </template>
                        <template slot-scope="{ row, index }" slot="action">
                           
                            <Button type="error" size="small" @click="remove(index)">删 除</Button>
                        </template>
                    </Table>
                </FormItem>
                 <FormItem>
                    <Button type="primary" @click="handleSubmit('formData')">保 存</Button>
                    <Button @click="handleReset()" style="margin-left: 8px">取 消</Button>
                </FormItem>
        </Form>
    </div>
</template>
<script>
import uploadImg from "./uploadImg";
import { getAddModityId } from "@/api/dealerModity.js";
import { addEditeLabel, getLabelInfo } from "@/api/label.js";
export default {
  data() {
    return {
      tipFlag: false,
      formData: {
        tagName: "",
        remark: "",
        modityTagStyleList: [],
        id: "" //总id
      },

      addModityId: "", //原来的uuid
      nameText: "",
      labelColumns: [
        {
          title: "样式图片",
          slot: "url",

          align: "center"
        },
        {
          title: "说明",
          slot: "description",
          width: 300,
          align: "center"
        },

        {
          title: "操作",
          slot: "action",
          width: 150,
          align: "center"
        }
      ],
      labelData: [],
      ruleValidate: {
        tagName: [
          { required: true, message: "请输入标签名称", trigger: "blur" }
        ],

        remark: [{ required: true, message: "请输入描述", trigger: "blur" }]
      }
    };
  },
  components: {
    uploadImg
  },
  created() {
    if (this.$route.query.add) {
      this.handleGetAddId();
      this.nameText = "添加标签";
    } else if (this.$route.query.id) {
      this.nameText = "编辑标签";
      this.formData.id = this.$route.query.id;
      this.handleGetInfo();
    }
    let breadcrumbs = [
      { name: "首页" },
      { name: "标签管理" },
      { name: this.nameText }
    ];
    this.$store.dispatch("updateBreadcrumbs", breadcrumbs);
  },
  methods: {
    handleGetInfo() {
      let params = {
        tagId: this.formData.id
      };
      getLabelInfo(params).then(res => {
        if (res.data.code == 200) {
          let labelInfo = res.data.data;
          this.formData.id = labelInfo.id;
          this.formData.tagName = labelInfo.tagName;
          this.formData.remark = labelInfo.remark;
          //   this.formData.modityTagStyleList = labelInfo.modityTagStyleList;
          this.labelData = labelInfo.modityTagStyleList;
        }
      });
    },

    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (this.labelData.length != 0) {
            this.tipFlag = false;
          } else {
            this.tipFlag = true;
            this.$Message.error("保存失败!");
            return;
          }
          if (this.$route.query.id) {
            this.formData.id = this.$route.query.id;
          } else {
            this.formData.id = "";
          }
          let labelTableList = this.labelData;

          labelTableList.forEach(item => {
            this.formData.modityTagStyleList.push(item);
          });
          let params = {
            id: this.formData.id, //总id
            tagName: this.formData.tagName,
            remark: this.formData.remark,
            modityTagStyleList: this.formData.modityTagStyleList
          };

          addEditeLabel(params).then(res => {
            if (res.data.code == 200) {
              this.$Message.success(res.data.msg);
              this.$router.go(-1);
            }
          });
        }
      });
    },
    handleChangeInput(row, index) {
      this.labelData[index].description = row.description;
    },
    handleReset() {
      this.$router.go(-1);
    },
    handleGetAddId() {
      getAddModityId().then(res => {
        if (res.data.code == 200) {
          this.formData.id = res.data.data;
        }
      });
    },
    handleUploadimg(data) {
      let obj = {};
      obj.url = data;
      obj.description = "";

      if (this.$route.query.id) {
        obj.tagId = this.$route.query.id; //总id
      } else {
        obj.tagId = ""; //总id
      }
      obj.id = ""; //每一个标签id
      this.labelData.push(obj);
       this.tipFlag = false;
    },
    show(index) {
      this.$Modal.info({
        title: "User Info",
        content: `Name：${this.data6[index].name}<br>Age：${
          this.data6[index].age
        }<br>Address：${this.data6[index].address}`
      });
    },
    remove(index) {
      this.labelData.splice(index, 1);
    }
  },
  watch: {
    "formData.id": function(newVal, oldVal) {
      if (newVal) {
        this.addModityId = newVal;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.img_content {
  width: 150px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 54px;
  img {
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
  }
}

.comonbox {
  display: flex;
  .conmomSpan {
    font-family: SimSun;
    font-size: 12px;
    color: #ed4014;
    padding-left: 15px;
    padding-top: 7px;
  }
  .commonTip {
    line-height: 1;
    padding-top: 10px;
    color: #ed4014;
    padding-left: 15px;
  }
}
.uploadImg_btn {
  display: flex;
  flex-direction: column;
  position: relative;
    margin-bottom: 32px;
}
.field-tip {
  line-height: 60px;
  padding-left: 10px;
}
.commonImgTip {
  position: absolute;
  bottom: -14px;
  z-index: 1000;
  line-height: 1;
  padding-top: 10px;
  color: #ed4014;
  padding-left: 15px;
  text-align: left;
  padding-left: 81px;
}
</style>

