<template>
    <div>
        <Form :model="formItem" ref="formItem" :rules="ruleValidate" :label-width="120">
                <FormItem label="uuid" prop="uuid" v-if="uuidFlag">
                    <Input v-model="formItem.uuid" disabled style="width:300px"></Input>
                </FormItem>
                 <FormItem label="uuid" prop="uuid"v-else>
                    <Input v-model="formItem.uuid" style="width:300px"></Input>
                </FormItem>
                 <FormItem label="场景名称">
                    <Input v-model="formItem.title" style="width:300px"></Input>
                </FormItem>
                  <FormItem label="oss路径">
                    <Input v-model="formItem.uri" style="width:300px"></Input>
                </FormItem>
                  <FormItem label="缩略图oss路径">
                    <Input v-model="formItem.thumbUri" style="width:300px"></Input>
                </FormItem>
                <FormItem label="主区域">
                    <Input v-model="formItem.mainArea" style="width:300px"></Input>
                </FormItem>
                 <FormItem label="场景版本">
                    <Input v-model="formItem.version" style="width:300px"></Input>
                </FormItem>
                <FormItem label="md5">
                    <Input v-model="formItem.md5" style="width:300px"></Input>
                </FormItem>
                <FormItem label="UE4程序版本">
                    <Select v-model="formItem.ue4Version" style="width:200px">
                         <Option v-for="item in ue4VersionList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="是否可用">
                    <Select v-model="formItem.enabled" style="width:200px">
                        <Option value="1">是</Option>
                        <Option value="0">否</Option>
                    </Select>
                </FormItem>
                 <FormItem label="支持头盔">
                    <Select v-model="formItem.vr" style="width:200px">
                        <Option value="1">是</Option>
                        <Option value="0">否</Option>
                    </Select>
                </FormItem>

                <FormItem label="场景参数:" v-if="paramShow" >
                 <Button class="buttonCommon" style="margin-top:6px;" size="small" @click="addParam()">新增参数</Button>
                 <table ref="tableElement" class="tableStyle" border="1">
                     <thead>
                        <tr>
                            <th>类型</th>
                            <th>Pos-X</th>
                            <th>Pos-Y</th>
                            <th>Pos-Z</th>
                            <th>Rot-X</th>
                            <th>Rot-Y</th>
                            <th>Rot-Z</th>
                            <th>描述</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr v-for="(itemObj,index) in formItem.tableArr" :key="index" v-if="showTr">
                           <td>
                                <Select v-model="itemObj.typeId" placeholder="类别" style="width:100px">
                                   <Option v-for="item in styleList" :value="item.value" :key="item.value">{{item.label}}</Option>
                                </Select>
                            </td>
                             <td>
                                <Input v-model="itemObj.posX" style="width:80px"></Input>
                            </td>
                            <td>
                                <Input v-model="itemObj.posY" style="width:80px"></Input>
                            </td>
                            <td>
                                <Input v-model="itemObj.posZ" style="width:80px"></Input>
                            </td>
                            <td>
                                <Input v-model="itemObj.rotX" style="width:80px"></Input>
                            </td>
                            <td>
                                <Input v-model="itemObj.rotY" style="width:80px"></Input>
                            </td>
                            <td>
                                <Input v-model="itemObj.rotZ" style="width:80px"></Input>
                            </td>
                            <td>
                                <Button type="error" @click="handleDel(itemObj)">删除</Button>
                                <Input v-model="itemObj.description" v-if="false" style="width: 100px"></Input>
                            </td>
                        </tr>
                     </tbody>
                 </table>           
            </FormItem>
             
                <FormItem>
                    <Button type="primary" :loading="saveBtnLoading" @click="handleSave">保存</Button>
                    <Button style="margin-left: 8px" @click="handleBack">取消</Button>
                </FormItem>
        </Form>
    </div>
</template>
<script>
import {
  addSecence,
  versionList,
  getScenceInfo,
  secenceParamDelete
} from "@/api/ue4.js";
import { listSpaceType } from "@/api/building.js";
export default {
  data() {
    return {
      formItem: {
        uuid: "",
        title: "",
        uri: "",
        thumbUri: "",
        ue4Version: "",
        version: "",
        md5: "",
        mainArea: "",
        enabled: "1",
        vr: "1",
        tableArr: [] //table数组
      },
      paramShow: false,
      showTr: false,
      uuidFlag: false,
      ue4VersionList: [],
      headTitle: "",
      saveBtnLoading: false,
      ruleValidate: {
        uuid: [{ required: true, message: "请输入uuid", trigger: "blur" }]
      },
      styleList: []
    };
  },
  created() {
    if (this.$route.query.ueId) {
      this.headTitle = "编辑";
    } else {
      this.headTitle = "新增";
    }
    let breadcrumbs = [
      { name: "VR场景管理" },
      { name: "场景管理" },
      { name: this.headTitle }
    ];
    this.$store.dispatch("updateBreadcrumbs", breadcrumbs);

    this.handleGetVersionList();
    // this.handleGetTypeList();
    if (this.$route.query.id) {
      this.uuidFlag = true;
      this.handleScensenInfo();
    }

    if (this.$route.query.copyFlag == true) {
      this.handleSetCopyInfo();
    }
  },
  methods: {
    handleSave() {
      this.saveBtnLoading = true;
      let params = {};
      let ue4Scene = {};
      let ue4SceneParamList = []; //提交数组队列
      ue4Scene.uuid = this.formItem.uuid;
      ue4Scene.title = this.formItem.title;
      ue4Scene.uri = this.formItem.uri;
      ue4Scene.thumbUri = this.formItem.thumbUri;
      ue4Scene.version = this.formItem.version;
      ue4Scene.md5 = this.formItem.md5;
      ue4Scene.ue4Version = this.formItem.ue4Version;
      ue4Scene.mainArea = this.formItem.mainArea;
      if (this.formItem.enabled == "1") {
        ue4Scene.enabled = true;
      } else if (this.formItem.enabled == "0") {
        ue4Scene.enabled = false;
      }
      if (this.formItem.vr == "1") {
        ue4Scene.vr = true;
      } else if (this.formItem.vr == "0") {
        ue4Scene.vr = false;
      }

      let paramList = this.formItem.tableArr;
      for (let i = 0; i < paramList.length; i++) {
        if (paramList[i].posX) {
          ue4SceneParamList.push(paramList[i]);
        }
        // else {
        //   this.$Message.warning("请上传图片!");
        //   return;
        // }
      }
      params.ue4Scene = ue4Scene;
      params.ue4SceneParamList = ue4SceneParamList;
      if (!this.formItem.uuid) {
        this.$Message.error('请输入uuid');
        this.saveBtnLoading = false;
      } else {
        addSecence(params).then(res => {
          if (res.data.code == 200) {
            this.$Message.success(res.data.msg);
            this.saveBtnLoading = false;
            this.$router.go(-1);
          } else {
            this.saveBtnLoading = false;
          }
        });
      }
    },
    // 添加参数
    addParam() {
      let obj = {};
      obj.paramId = null;
      obj.sceneId = "";
      obj.typeId = "";
      obj.posX = "";
      obj.posY = "";
      obj.posZ = "";
      obj.rotX = "";
      obj.rotY = "";
      obj.rotZ = "";
      obj.description = "";
      this.showTr = true;
      this.formItem.tableArr.push(obj);
    },
    handleGetVersionList() {
      versionList().then(res => {
        if (res.data.code == 200) {
          let ue4Version_data = res.data.data;
          ue4Version_data.forEach(item => {
            let obj = {};
            obj.value = item;
            obj.label = item;

            this.ue4VersionList.push(obj);
          });
        }
      });
    },
    handleGetTypeList() {
      listSpaceType().then(res => {
        if (res.data.code == 200) {
          let tyleData = res.data.data;
          tyleData.forEach(item => {
            let obj = {};
            obj.value = item.spaceTypeId;
            obj.label = item.spaceTypeName;
            this.styleList.push(obj);
          });
        }
      });
    },
    handleBack() {
      this.$router.go(-1);
    },
    handleScensenInfo() {
      getScenceInfo(this.$route.query.id).then(res => {
        if (res.data.code == 200) {
          let scence_info = res.data.data.Ue4Scene;
          let scenceParamList = res.data.data.Ue4SceneParamList;
          this.formItem.uuid = scence_info.uuid;
          this.formItem.title = scence_info.title;
          this.formItem.uri = scence_info.uri;
          this.formItem.thumbUri = scence_info.thumbUri;
          this.formItem.ue4Version = scence_info.ue4Version;
          this.formItem.md5 = scence_info.md5;
          this.formItem.version = scence_info.version;
          this.formItem.mainArea = scence_info.mainArea;
          if (scence_info.enabled == true) {
            this.formItem.enabled = "1";
          } else if (scence_info.enabled == false) {
            this.formItem.enabled = "0";
          }
          if (scence_info.vr == true) {
            this.formItem.vr = "1";
          } else if (scence_info.vr == false) {
            this.formItem.vr = "0";
          }

          //   参数子表
          if (scenceParamList.length > 0) {
            this.showTr = true;
            let arr = [];
            for (let i = 0; i < scenceParamList.length; i++) {
              let obj = {};
              obj.typeId = scenceParamList[i].typeId;
              obj.paramId = scenceParamList[i].paramId;
              obj.sceneId = scenceParamList[i].sceneId;
              obj.posX = scenceParamList[i].posX;
              obj.posY = scenceParamList[i].posY;
              obj.posZ = scenceParamList[i].posZ;
              obj.rotX = scenceParamList[i].rotX;
              obj.rotY = scenceParamList[i].rotY;
              obj.rotZ = scenceParamList[i].rotZ;
              obj.description = scenceParamList[i].description;
              arr.push(obj);
            }
            this.formItem.tableArr = arr;
          }
        }
      });
    },
    handleSetCopyInfo() {
      let copy_data = this.$route.query.params_data;
      this.formItem.title = copy_data.title;
      this.formItem.uri = copy_data.uri;
      this.formItem.thumbUri = copy_data.thumbUri;
      this.formItem.ue4Version = copy_data.ue4Version;
      this.formItem.version = copy_data.version;
      this.formItem.md5 = copy_data.md5;
      this.formItem.mainArea = copy_data.mainArea;
      this.formItem.enabled = copy_data.enabled;
      this.formItem.vr = copy_data.vr;
    },
    handleDel(obj) {
      var index = this.formItem.tableArr.indexOf(obj);
      if (index > -1) {
        if (obj.paramId != null && obj.paramId != 0) {
          secenceParamDelete(obj.paramId).then(res => {
            if (res.data.code == 200) {
              this.formItem.tableArr.splice(index, 1);
              this.$Message.success(res.data.msg);
            }
          });
        } else {
          this.formItem.tableArr.splice(index, 1);
        }
      }

      // this.formItem.tableArr.remove(obj);
    }
  }
};
</script>

<style lang="less" scoped>
.tableStyle {
  width: 70%;
  margin-top: 10px;
}
.tableStyle {
  border-collapse: collapse;
  border: 0px solid #dddee1;
  text-align: center;
  tbody {
    tr {
      height: 50px;
    }
  }
}
</style>

