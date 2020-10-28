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
                <a style="color: white" href="https://oceano-center.oss-cn-hangzhou.aliyuncs.com/Auth-web/orgImportTemplate/import_20191017.xlsx">下载导入模板文件</a>
                </Button>
            </FormItem>
        </Form>
        <div class="title">当前导入内容</div>
        <div class="table" style="position: relative;">
            <div class="title-list"><div class="title-content" v-for="(item,index) in titleList">{{item}}</div></div>
            <div class="content-list">
                <div class="no-data" v-if="!importTableData.length">暂无数据</div>
                <div class="content-detail"  v-for="(item,index) in importTableData" :data="index" :key="index" v-else>
                    <input type="text" v-model="importTableData[index].officialModel" @focus="changeStyle" @blur="modelBlur" @keyup="handleModel">
                    <input type="text" @keyup="handleNum($event,index)" @focus="changeStyle" @blur="importTableData[index].price2=handleBlur($event,index,'price2')" :class="{red:isNaN(item.price2)||!(/^\d+(?=\.{0,1}\d+$|$)/).test(item.price2)}" v-model="importTableData[index].price2">
                    <input type="text" @keyup="handleNum($event,index)" @focus="changeStyle" @blur="importTableData[index].activityPrice2=handleBlur($event,index,'activityPrice2')" :class="{red:isNaN(item.activityPrice2)||!(/^\d+(?=\.{0,1}\d+$|$)/).test(item.activityPrice2)}" v-model="importTableData[index].activityPrice2">
                    <input type="text" @keyup="handleNum($event,index,'price1')" @focus="changeStyle" @blur="importTableData[index].price1=handleBlur($event,index)" :class="{red:isNaN(item.price1)||!(/^\d+(?=\.{0,1}\d+$|$)/).test(item.price1)}" v-model="importTableData[index].price1">
                    <input type="text" @keyup="handleNum($event,index,'activityPrice1')" @focus="changeStyle" @blur="importTableData[index].activityPrice1=handleBlur($event,index)" :class="{red:isNaN(item.activityPrice1)||!(/^\d+(?=\.{0,1}\d+$|$)/).test(item.activityPrice1)}" v-model="importTableData[index].activityPrice1">
                    <div style="width: 12.5%;" :class="{actived:item.endDate&&item.endDate!='NaN-NaN-NaN'&&(!item.startDate||item.startDate=='NaN-NaN-NaN')||!timeCompare(item.startDate,item.endDate)}">
                        <Date-picker type="date" placeholder="选择日期" style="width: 90%" v-model="importTableData[index].startDate" :editable="false" :disabled="editDisabled"></Date-picker>
                    </div>
                    <div style="width: 12.5%;" :class="{actived:(!item.endDate||item.endDate=='NaN-NaN-NaN')&&item.startDate&&item.startDate!='NaN-NaN-NaN'||!timeCompare(item.startDate,item.endDate)}">
                        <Date-picker type="date" placeholder="选择日期" style="width: 90%" v-model="importTableData[index].endDate" :editable="false" :disabled="editDisabled"></Date-picker>
                    </div>
                    <div><div class="button" @click="handleDelete(index)">删除</div></div>
                </div>
            </div>
            <div style="position: absolute;width: 10px;height: 10px;top: 50%;left: 50%;margin-left: -5px;margin-top: -5px;" v-if="!showTable"><Spin fix size="large"></Spin></div>
        </div>
        <div class="footerButton">
            <Button type="primary" @click="handleSubmit" :loading="saveBtnLoading" :disabled="canSave">保存</Button>
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
            titleList: ["产品型号","价格（片）","活动价格（片）","价格（方）","活动价格（方）","活动开始时间(年/月/日)","活动结束时间(年/月/日)","操作"],
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
            deleteIndex: null
        };
    },
    components: {
        aletTip
    },
    mounted() {
        let breadcrumbs = [{ name: "首页" },  { name: "经销商管理" },
        { name: "门店管理" },{name:'导入商品'}];
        this.$store.dispatch("updateBreadcrumbs", breadcrumbs);
        this.headerToken.Authorization = localStorage.getItem("jwttoken");
    },
    methods: {
        officialModelExisted(param,flag,index) {
            this.importTableData = this.excelTable;
            officialModelExisted(param).then(res=>{
                console.log(res)
                if(res.data.code==200) {
                    if(flag) {
                        this.modelArr = [];
                        this.numArr = [];
                    }
                    if(!this.modelArr.length) this.modelArr = res.data.data;
                    else this.modelArr[index] = res.data.data[0];
                    for(let i=0;i<this.modelArr.length;i++) {
                        if(flag) {
                            this.numArr.push(this.modelArr[i].num);
                            let data = this.importTableData[i];
                            if(this.modelArr[i].existed) {
                                document.getElementsByClassName("content-detail")[i].childNodes[0].classList.remove("red");
                                if(data.price2>=0&&!isNaN(data.price2)&&!isNaN(data.price1)&&(data.price1<0||data.price1=="")) {
                                    data.price1 = this.modelArr[i].num*data.price2;
                                    data.price1 = this.toFixed(data.price1,2);
                                }
                                if(data.activityPrice2>=0&&!isNaN(data.activityPrice2)&&!isNaN(data.activityPrice1)&&(data.activityPrice1<0||data.activityPrice1=="")) {
                                    data.activityPrice1 = this.modelArr[i].num*data.activityPrice2;
                                    data.activityPrice1 = this.toFixed(data.activityPrice1,2);
                                }
                            }else {
                                document.getElementsByClassName("content-detail")[i].childNodes[0].classList.add("red");
                            }
                        }else {
                            this.numArr[index] = this.modelArr[index].num;
                            let data = this.importTableData[index];
                            if(!this.modelArr[index].existed) {
                                document.getElementsByClassName("content-detail")[index].childNodes[0].classList.add("red");
                            }else {
                                document.getElementsByClassName("content-detail")[index].childNodes[0].classList.remove("red");
                                if(data.price2>=0&&!isNaN(data.price2)&&!isNaN(data.price1)&&(data.price1<0||data.price1=="")) {
                                    data.price1 = this.numArr[index]*data.price2;
                                    data.price1 = this.toFixed(data.price1,2);
                                }
                                if(data.activityPrice2>=0&&!isNaN(data.activityPrice2)&&!isNaN(data.activityPrice1)&&(data.activityPrice1<0||data.activityPrice1=="")) {
                                    data.activityPrice1 = this.numArr[index]*data.activityPrice2;
                                    data.activityPrice1 = this.toFixed(data.activityPrice1,2);
                                }
                            }
                        }
                    }
                    this.canSave = false;
                    this.showTable = true;
                }
            }).catch(err=>{
                this.canSave = false;
                this.showTable = true;
            })
        },
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
                    _self.officialModelArr = []
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
                    outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]); //outdata就是你想要的东西
                    _self.excelTable = [];
                    outdata.forEach((item,index)=>{
                        let obj = {};
                        obj.officialModel = item["产品型号"];
                        obj.price2 = item["价格（片）"];
                        obj.activityPrice2 = item["活动价格（片）"];
                        obj.price1 = item["价格（方）"];
                        obj.activityPrice1 = item["活动价格（方）"];
                        obj.startDate = item["活动开始时间(年/月/日)"];
                        obj.endDate = item["活动结束时间(年/月/日)"];
                        obj.startDate = _self.handleTime(obj.startDate);
                        obj.endDate = _self.handleTime(obj.endDate);
                        if(!obj.officialModel) obj.officialModel = "";
                        if(!obj.startDate||obj.startDate=="NaN-NaN-NaN"||obj.startDate=="NaN-0NaN-0NaN") obj.startDate="";
                        if(!obj.endDate||obj.endDate=="NaN-NaN-NaN"||obj.endDate=="NaN-0NaN-0NaN") obj.endDate="";
                        if(!obj.price2) obj.price2 = 0;
                        if(!obj.activityPrice2) obj.activityPrice2 = 0;
                        if(!obj.price1) obj.price1 = "";
                        if(!obj.activityPrice1) obj.activityPrice1 = "";
                        if(typeof(obj.price2)=='number') obj.price2 = _self.toFixed(obj.price2,2);
                        if(typeof(obj.activityPrice2)=='number') obj.activityPrice2 = _self.toFixed(obj.activityPrice2,2);
                        if(typeof(obj.price1)=='number') obj.price1 = _self.toFixed(obj.price1,2);
                        if(typeof(obj.activityPrice1)=='number') obj.activityPrice1 = _self.toFixed(obj.activityPrice1,2);
                        if(obj.officialModel) {
                            _self.excelTable.push(obj);
                            _self.officialModelArr.push(obj.officialModel);
                        }
                    });
                    _self.officialModelExisted(_self.officialModelArr,true);
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
        handleNum(e,index,name) {
            let val = e.target.value;
            e.target.value = val.trim();
            if(name&&this.modelArr[index].existed&&val<0) {
                if(name=="price1"&&!isNaN(this.importTableData[index].price2)&&this.importTableData[index].price2>=0) {
                    val = this.numArr[index]*this.importTableData[index].price2;
                    val = this.toFixed(val,2);
                    this.importTableData[index].price1 = val;
                }
                else if(name=="activityPrice1"&&!isNaN(this.importTableData[index].activityPrice2)&&this.importTableData[index].activityPrice2>=0) {
                    val = this.numArr[index]*this.importTableData[index].activityPrice2;
                    val = this.toFixed(val,2);
                    this.importTableData[index].activityPrice1 = val;
                }
                e.target.value = val;
            }
        },
        handleBlur(e,index,name) {
            let data = this.importTableData[index]
            let price1 = data.price1;
            let activityPrice1 = data.activityPrice1;
            e.target.style.border = 'none';
            e.target.style.borderRight = '1px solid #e8eaec';
            if(e.target.value=="") e.target.value = 0;
            if(name&&this.modelArr[index].existed) {
                if(name=="price2"&&!isNaN(price1)&&(price1<0||price1=="")){
                    if(e.target.value||!isNaN(e.target.value)||e.target.value>0) {
                        data.price1 = this.numArr[index]*e.target.value;
                        data.price1 = this.toFixed(data.price1,2);
                    }
                }
                else if(name=="activityPrice2"&&!isNaN(activityPrice1)&&(activityPrice1<0||activityPrice1=="")) {
                    if(e.target.value||!isNaN(e.target.value)||e.target.value>0) {
                        data.activityPrice1 = this.numArr[index]*e.target.value;
                        data.activityPrice1 = this.toFixed(data.activityPrice1,2);
                    }
                }
            }
            if(isNaN(e.target.value)) return e.target.value;
            return this.toFixed(e.target.value,2);

        },
        changeStyle(e) {
            e.target.style.border = '2px solid #000';
        },
        modelBlur(e) {
            e.target.style.border = 'none';
            e.target.style.borderRight = '1px solid #e8eaec';
        },
        handleModel(e) {
            if(e.keyCode==9) return;
            e.target.value = e.target.value.trim();
            let val = e.target.value;
            let arr = [];
            arr.push(val);
            let index = e.target.parentNode.attributes.data.value;
            this.officialModelArr[index] = val;
            this.officialModelExisted(arr,false,index);
        },
        handleTime(time) {
            let date = new Date((time-1)*1000*24*60*60+1);
            let year = date.getFullYear()-70;
            let month = date.getMonth()+1;
            let day = date.getDate();
            month = month>9?month:"0"+month;
            day = day>9?day:"0"+day;
            return year+"-"+month+"-"+day;
        },
        handleEdit(index) {
            let childList = document.getElementsByClassName("content-detail")[index].childNodes;
            let flag = true;
            for(var i=0;i<childList.length;i++) {
                childList[i].readOnly = false;
                if(childList[i].className=="red"&&flag) {
                    childList[i].focus();
                    flag = false;
                }
            }
            if(flag) childList[0].focus();
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
                // if(this.officialModelArr.length) this.officialModelExisted(this.officialModelArr,true);
            }else {
                this.alertShow = false;
            }
        },
        handleDelete(index) {
            this.deleteIndex = index;
            this.alertShow = true;
        },
        handleSubmit() {
            var flag = true;
            let parantList = document.getElementsByClassName("content-detail");
            let redList = document.getElementsByClassName("red");
            for(var i=0;i<this.importTableData.length;i++) {
                let item = this.importTableData[i];
                item.startDate = this.switchTimeFormat(item.startDate);
                item.endDate = this.switchTimeFormat(item.endDate);
                if(!item.officialModel) {
                    this.$Message.warning("产品型号不能为空");
                    parantList[i].children[0].focus();
                    flag = false;
                    break;
                }
                if(item.endDate&&item.endDate!="NaN-NaN-NaN"&&(!item.startDate||item.startDate=="NaN-NaN-NaN")) {
                    this.$Message.warning("请填写活动开始时间");
                    flag = false;
                    break;
                }
                if(item.startDate&&item.startDate!="NaN-NaN-NaN"&&(!item.endDate||item.endDate=="NaN-NaN-NaN")){
                    this.$Message.warning("请填写活动结束时间");
                    flag = false;
                    break;
                }
                flag = this.timeCompare(item.startDate,item.endDate);
                if(!flag) {
                    this.$Message.warning("开始时间不能大于结束时间");
                    break;
                }
            }
            if(!flag) return;
            if(redList.length&&flag) {
                this.$Message.warning("商品不在产品库中或价格格式错误");
                redList[0].focus();
                return;
            }
            let params = {};
            params.storeId = this.$route.query.storeId;
            params.importModityInfoList = this.importTableData;
            this.saveBtnLoading = true;
            importShopModity(params).then(response => {
                if (response.data.code == 200) {
                    this.$Message.success("导入成功");
                    this.$router.go(-1);
                }
                this.saveBtnLoading = false;
            }).catch(err=>{
                this.saveBtnLoading = false;
            })
        },
        handleBack() {
            this.$router.go(-1);
        },
        timeCompare(startTime,endTime) {
            var date1 = new Date(startTime);
            var date2 = new Date(endTime);
            if(date1.getTime()>date2.getTime()) {
                return false;
            }else {
                return true;
            }
        },
        switchTimeFormat (time) {
            const dateTime = new Date(time);
            const year = dateTime.getFullYear();
            const month = dateTime.getMonth() + 1;
            const date = dateTime.getDate();
            return year+"-"+this.addZero(month)+"-"+this.addZero(date);
        },
        addZero (v) {
            return v < 10 ? '0' + v : v;
        },
        toFixed(num,len){
            if(len>20 || len<0){
                throw new RangeError('toFixed() digits argument must be between 0 and 20');
            }
            // .123转为0.123
            var number = Number(num);
            if (isNaN(number) || number >= Math.pow(10, 21)) {
                return number.toString();
            }
            if (typeof (len) == 'undefined' || len == 0) {
                return (Math.round(number)).toString();
            }
            var result = number.toString(),
                numberArr = result.split('.');

            if(numberArr.length<2){
                //整数的情况
                return padNum(result);
            }
            var intNum = numberArr[0], //整数部分
                deciNum = numberArr[1],//小数部分
                lastNum = deciNum.substr(len, 1);//最后一个数字

            if(deciNum.length == len){
                //需要截取的长度等于当前长度
                return result;
            }
            if(deciNum.length < len){
                //需要截取的长度大于当前长度 1.3.toFixed(2)
                return padNum(result)
            }
            //需要截取的长度小于当前长度，需要判断最后一位数字
            result = intNum + '.' + deciNum.substr(0, len);
            if(parseInt(lastNum, 10)>=5){
                //最后一位数字大于5，要进位
                var times = Math.pow(10, len); //需要放大的倍数
                var changedInt = Number(result.replace('.',''));//截取后转为整数
                changedInt++;//整数进位
                changedInt /= times;//整数转为小数，注：有可能还是整数
                result = padNum(changedInt+'');
            }
            return result;
            //对数字末尾加0
            function padNum(num){
                var dotPos = num.indexOf('.');
                if(dotPos === -1){
                    //整数的情况
                    num += '.';
                    for(var i = 0;i<len;i++){
                        num += '0';
                    }
                    return num;
                } else {
                    //小数的情况
                    var need = len - (num.length - dotPos - 1);
                    for(var j = 0;j<need;j++){
                        num += '0';
                    }
                    return num;
                }
            }
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
        width: 12.5%;
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
