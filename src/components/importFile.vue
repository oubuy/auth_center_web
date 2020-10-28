<template>
    <div>
        <Form :label-width="80" id="tableForm">
            <FormItem label="上传文件：" class="fileContent">
                <div style="position: relative;display: inline-block;">
                    <Button type="info" icon="ios-cloud-upload-outline">选择文件</Button>
                    <div class="upload-box"><input type="file" @change="uploadFile" id="upload-buttons"></div>
                </div>
                <span class="tip">注意：请使用导入模板进行导入！</span>
            </FormItem>
        </Form>
        <Form :label-width="80">
            <FormItem label="" class="fileContent">
                <Button type="info" >
                <a style="color: white" :href="downloadUrl">下载导入模板文件</a>
                </Button>
            </FormItem>
        </Form>
        <div class="title">当前导入内容</div>
        <div class="table" style="position: relative;">
            <div class="title-list"><div class="title-content" :style="{width:titleWidth}" v-for="(item,index) in titleList">{{item.name}}</div></div>
            <div class="content-list">
                <div class="no-data" v-if="!importTableData.length">暂无数据</div>
                <div class="content-detail" v-for="(item,index) in importTableData" :data="index" :key="index" v-else>
                    <div :style="{width:titleWidth}" v-for="(cItem,cIndex) in item">{{cItem}}</div>
                    <!-- <div><div class="button" @click="handleDelete(index)">删除</div></div> -->
                </div>
            </div>
            <div style="position: absolute;width: 10px;height: 10px;top: 50%;left: 50%;margin-left: -5px;margin-top: -5px;" v-if="!showTable"><Spin fix size="large"></Spin></div>
        </div>
        <div class="footerButton">
            <Button type="primary" @click="handleSubmit" :loading="saveBtnLoading">保存</Button>
            <Button style="margin-left: 8px" @click="handleBack">取消</Button>
        </div>
        <alet-tip v-show="alertShow" @child-tip="handleCloseTip" :alertTipParams="alertTipParams"></alet-tip>
    </div>
</template>
<script>
import { importShopModity, officialModelExisted } from "@/api/store.js";
import XLSX from '@/excel/Export2Excel.js'
import aletTip from "@/components/alertTip.vue";
export default {
    data() {
        return {
            headerToken: { Authorization: "" }, //token
            importTableData: [],
            // titleList: ["产品型号","价格（片）","活动价格（片）","价格（方）","活动价格（方）","活动开始时间(年/月/日)","活动结束时间(年/月/日)","操作"],
            editImportShow: false,
            formItem: {
                officialModel: "",
                modityName: "",
                price1: "",
                activityPrice1: "",
                price2: "",
                activityPrice2: "",
                startDate: "",
                endDate: ""
            },
            editDisabled: false,
            saveBtnLoading: false,
            modelArr:[],
            officialModelArr: [],
            canSave: true,
            showTable: true,
            excelTable: [],
            numArr: [],
            alertShow: false,
            alertTipParams: {
                headTip: "删除",
                titleTip: "是否确认删除当前行？"
            },
            deleteIndex: null,
            titleWidth: ''
        };
    },
    props: {
      titleList: {
        type: Array,
        default: ()=>[]
      },
      downloadUrl: {
        type: String,
        default: ''
      },
      start: {
        type: String,
        default: ''
      }
    },
    components: {
        aletTip
    },
    mounted() {
        this.headerToken.Authorization = localStorage.getItem("jwttoken");
        this.titleWidth = 100/this.titleList.length+'%';
    },
    methods: {
        uploadFile(event) {
            // 通过DOM取文件数据
            this.file = event.currentTarget.files[0];
            var _self = this;
            var rABS = false; //是否将文件读取为二进制字符串
            var f = this.file;
            var reader = new FileReader();
            this.showTable = false;
            this.canSave = true;
            FileReader.prototype.readAsBinaryString = function(f) {
                var binary = "";
                var rABS = false; //是否将文件读取为二进制字符串
                var pt = this;
                var wb; //读取完成的数据
                var outdata;
                var reader = new FileReader();
                reader.onload = function(e) {
                    var bytes = new Uint8Array(reader.result);
                    var length = bytes.byteLength;
                    for (var i = 0; i < length; i++) {
                        binary += String.fromCharCode(bytes[i]);
                    }
                    var XLSX = require("xlsx");
                    if (rABS) {
                        wb = XLSX.read(btoa(fixdata(binary)), {
                            //手动转化
                            type: "base64"
                        });
                    } else {
                        wb = XLSX.read(binary, {
                            type: "binary"
                        });
                    }
                    _self.excelTable = [];
                    if(_self.start) {
                      var xlsxLth = wb.Sheets[wb.SheetNames[0]]["!ref"];
                      var stopX = xlsxLth.substr(xlsxLth.indexOf(':')+1,wb.Sheets[wb.SheetNames[0]]["!ref"].length);
                      wb.Sheets[wb.SheetNames[0]]["!ref"] = _self.start+stopX;
                      outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]); //outdata就是你想要的东西
                      outdata.forEach((item,index)=>{
                          let obj = {};
                          for(let i=0;i<_self.titleList.length;i++) {
                            obj[_self.titleList[i].value] = item[_self.titleList[i].key];
                          }
                          _self.excelTable.push(obj);
                      });
                      _self.excelTable.shift();
                    }else {
                      outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]); //outdata就是你想要的东西
                      console.log(outdata)
                      outdata.forEach((item,index)=>{
                          let obj = {};
                          for(let i=0;i<_self.titleList.length;i++) {
                            obj[_self.titleList[i].value] = item[_self.titleList[i].name];
                          }
                          _self.excelTable.push(obj);
                      });
                      console.log(_self.excelTable)
                    }
                    _self.importTableData = _self.excelTable;
                    _self.showTable = true;
                    document.getElementById('tableForm').reset();
                };
                reader.readAsArrayBuffer(f);
            };
            if (rABS) {
                reader.readAsArrayBuffer(f);
            } else {
                reader.readAsBinaryString(f);
            }
        },
        handleCloseTip(data) {
            if(data=="true") {
                let index = this.deleteIndex;
                this.importTableData.splice(index,1);
                this.modelArr.splice(index,1);
                this.numArr.splice(index,1);
                this.officialModelArr.splice(index,1);
                this.alertShow = false;
                this.$Message.success("删除成功");
            }else {
                this.alertShow = false;
            }
        },
        handleDelete(index) {
            this.deleteIndex = index;
            this.alertShow = true;
        },
        handleSubmit() {
          this.$emit("handleSubmit",this.importTableData);
        },
        handleBack() {
            this.$router.go(-1);
        }
    }
};
</script>
<style lang="less" scoped>
    .content-detail input{
        width: 12.5%;
        height: 100%;
        border: none;
        text-align: center;
        border-right: 1px solid #e8eaec;
    }
    .title{
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 15px;
    }
    .table{
        border: 1px solid #e8eaec;
        max-height: 800px;
        overflow: auto;
    }
    .title-list{
        display: flex;
        height: 40px;
        background: #f8f8f9;
        border-bottom: 1px solid #e8eaec;
        text-overflow: ellipsis;
    }
    .content-list{
        height: auto;
        background: #fff;
    }
    .title-content, .content-detail>div{
        display: flex;
        // width: 12.5%;
        height: 100%;
        border-right: 1px solid #e8eaec;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: normal;
        word-break: break-all;
        box-sizing: border-box;
    }
    .content-detail{
        display: flex;
        height: 40px;
        border-bottom: 1px solid #e8eaec;
    }
    .title-content:last-child,
    .content-detail:last-child,
    .content-detail>div:last-child{
        border: none;
    }
    .upload-box{
        width: 100px;
        height: 100%;
        position: absolute;
        top: 0;
        left:-64px;
        z-index: 10;
    }
    #upload-buttons{
        height: 100%;
        opacity:0;
        cursor: pointer;
    }
    .tip {
        // color: #9ea7b4;
        color: red;
        font-size: 12px;
        margin-left: 15px;
    }
    .no-data{
        width: 100%;
        height: 50px;
        line-height: 50px;
    }
    .content-detail .button{
        width: auto;
        height: 25px;
        padding: 1px 7px 2px;
        background: #ed4014;
        border-radius: 3px;
        color: #fff;
        line-height: 25px;
        cursor: pointer;
    }
    .red {
        color: red;
        background: rgba(255,0,0,0.2);
    }
    .redBackground {
        background: rgba(255,0,0,0.2);
    }
    .actived {
        background: rgba(255,0,0,0.2);
    }
    .footerButton {
        position: absolute;
        bottom: 20px;
        left: 53%;
    }
</style>
