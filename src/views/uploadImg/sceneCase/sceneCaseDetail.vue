<template>
  <div style="text-align: left;">
    <Form :label-width='80'>
      <FormItem label="小区" style="width:300px;">
        <Input v-model.trim="formData.buildingName" placeholder="请输入小区名称" clearable></Input>
      </FormItem>
      <FormItem label="户型" style="width:300px;">
        <Input v-model.trim="formData.modelName" placeholder="请输入户型" clearable></Input>
      </FormItem>
      <FormItem label="省/市/区">
        <address-select ref="addressSelectRef" :address="formData"></address-select>
      </FormItem>
      <FormItem label="风格" style="width:300px;" prop="styleId">
        <Select v-model="formData.styleId" placeholder="请选择风格" clearable>
          <Option v-for="(item,index) in styleColumns" :value="item.styleId" :key="index">{{ item.styleName }}</Option>
        </Select>
      </FormItem>
      <FormItem label="面积" style="width:300px;">
        <Input type="number" v-model.trim="formData.area" placeholder="请输入面积"></Input>
      </FormItem>
      <FormItem label="客户评价">
        <textarea v-model="formData.common" style="width: 500px;height: 150px;border: 1px solid #dcdee2;border-radius: 4px;padding: 7px;resize:none"></textarea>
      </FormItem>
      <FormItem label="实景图类型" style="width:300px;" prop="sceneType">
        <Select v-model="formData.sceneType" placeholder="请选择类型" clearable>
          <Option v-for="(item,index) in sceneTypeColumns" :value="index" :key="index">{{ item }}</Option>
        </Select>
      </FormItem>
      <FormItem label="方案主图">
        <Upload :show-upload-list="false" :on-success="handleSceneSuccess" accept=".jpeg,.bmp,.jpg,.png,.tif,.gif,.pcx,.tga,.exif,.fpx,.svg,.psd,.cdr,.pcd,.dxf,.ufo,.eps,.ai,.raw,.WMF,.webp"
          :on-format-error="handleSceneError" action="/build-rest/file/uploadImage" :headers="uploadHeaders" :format="uploadImgFormat"
          style="display: inline-block;cursor: pointer;">
          <div style="display: flex;align-items: center;">
            <div style="width: 80px;height:80px;line-height: 80px;display: flex;justify-content: center;align-items: center;border: 1px dashed #ccc;">
              <Icon type="ios-camera" size="24" color="rgb(105, 104, 104)"></Icon>
            </div>
          </div>
        </Upload>
      </FormItem>
      <FormItem label="实景视频">
        <div style="max-width: 400px;">
          <div v-if="formData.videoUrl" style="position: relative;">
            <video :src="formData.videoUrl" style="width: 100%;object-fit: fill;" controls></video>
            <div style="position: absolute;width: 24px;height: 24px;top: -12px;right: -12px;cursor: pointer;"
              @click.stop="deleteVideo">
              <van-icon name="clear" size="24" />
            </div>
          </div>
          <div style="position: relative;display: flex;align-items: center;" v-else>
            <van-uploader :before-read="beforeRead" :after-read="afterRead" accept="video/ogm,video/mpeg,video/asx,video/mpg,video/ogv,video/webm,video/mov,video/mp4,video/m4v;">
              <div style="width: 80px;height:80px;line-height: 80px;display: flex;justify-content: center;align-items: center;border: 1px dashed #ccc;">
                <van-icon name="video" size="24" color="rgb(105, 104, 104)" />
              </div>
            </van-uploader>
            <div style="position: absolute;top: 0;left: 0;width: 100%;height: 100%;background: #000;display: flex;align-items: center;justify-content: center;flex-wrap: wrap;"
              v-if="uploadVideoFlag">
              <van-loading color="#fff" vertical size=".8rem" style="padding-top: .5rem;" />
              <div style="font-size: .3rem;padding: .2rem 0 .5rem 0;color: #fff;width: 100%;">上传中</div>
              </van-loading>
            </div>
          </div>
        </div>
      </FormItem>
      <FormItem label="审核通过:" prop="auditStatus">
        <RadioGroup v-model="formData.auditStatus" @on-change="changeAuditStatus">
          <Radio v-for="(item,index) in auditStatusColumns" :label="index" :key="index"><span>{{item}}</span></Radio>
        </RadioGroup>
      </FormItem>
    </Form>
    <Card dis-hover>
      <p slot="title">空间</p>
      <div style="margin-bottom:8px;">
        <Button type="primary" @click="modal=true">添加</Button>
      </div>
      <Table :data="spaceList" :columns="columns">
        <template slot-scope="{ row, index }" slot="imageUrl">
          <table-img v-if="row.imageUrl" :data="[row.imageUrl]"></table-img>
        </template>
        <template slot-scope="{ row, index }" slot="action">
          <Button type="warning" size="small" @click="">移除</Button>
        </template>
      </Table>
    </Card>
    <div style="margin-top: 20px;">
      <Button type="primary" style="margin-right: 10px;">保存</Button>
      <Button>返回</Button>
    </div>
    <Modal :value="modal" title="空间" :width="1000" footer-hide @on-cancel="modal=false">
      <Form :label-width='80'>
        <FormItem label="空间" style="width:300px;" prop="spaceId">
          <Select v-model="modalData.spaceId" placeholder="请选择风格" clearable>
            <Option v-for="(item,index) in spaceColumns" :value="item.spaceTypeId" :key="index">{{ item.spaceTypeName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="主图">
          <Upload :show-upload-list="false" :on-success="handleSpaceSuccess" accept=".jpeg,.bmp,.jpg,.png,.tif,.gif,.pcx,.tga,.exif,.fpx,.svg,.psd,.cdr,.pcd,.dxf,.ufo,.eps,.ai,.raw,.WMF,.webp"
            :on-format-error="handleSpaceError" action="/build-rest/file/uploadImage" :headers="uploadHeaders" :format="uploadImgFormat"
            style="display: inline-block;cursor: pointer;">
            <div style="display: flex;align-items: center;">
              <div style="width: 80px;height:80px;line-height: 80px;display: flex;justify-content: center;align-items: center;border: 1px dashed #ccc;">
                <Icon type="ios-camera" size="24" color="rgb(105, 104, 104)"></Icon>
              </div>
            </div>
          </Upload>
        </FormItem>
        <FormItem label="产品" style="width:300px;">
          <Input v-model.trim="modalData.productVal" placeholder="请输入产品名称或产品编码查询" @input="onSearch" clearable></Input>
          <div class="drop-box" v-show="showDropBox">
            <div style="display: flex;align-items: center;padding: 20px;border-bottom: 1px solid #f5f5f5;cursor: pointer;"
              v-for="(imgItem,imgIndex) in productResult" @click="chooseProduct(index,imgItem)">
              <div style="margin-right: 50px;"><img :src="imgItem.imageUrl" style="display: block;width: 60px;"></div>
              <div>
                <div style="margin-bottom: 10px;">{{imgItem.modityName}}</div>
                <div style="margin-top: 10px;">{{imgItem.officialModel}}</div>
              </div>
            </div>
          </div>
        </FormItem>
        <FormItem label="">
          <Table :data="spaceList" :columns="columns">
            <template slot-scope="{ row, index }" slot="imageUrl">
              <table-img v-if="row.imageUrl" :data="[row.imageUrl]"></table-img>
            </template>
            <template slot-scope="{ row, index }" slot="action">
              <Button type="warning" size="small" @click="">移除</Button>
            </template>
          </Table>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
  import addressSelect from "@/components/build/address";
  import {
    getListStyle,
    getUploadPolicy,
    getListSpaceTyle,
    findProducts
  } from "@/api/uploadImg.js";
  export default {
    data() {
      return {
        formData: {
          buildingName: '',
          modelName: '',
          provinceId: '',
          cityId: '',
          areaId: '',
          styleId: '',
          area: '',
          common: '',
          sceneType: '',
          videoUrl: '',
          auditStatus: ''
        },
        modalData: {
          spaceId: '',
          productVal: ''
        },
        loading: false,
        uploadVideoFlag: false,
        modal: false,
        showDropBox: false,
        columns: [{
            title: '编号',
            key: 'spaceId',
            align: 'center',
            width: 100
          },
          {
            title: '效果图',
            key: 'imageUrl',
            slot: 'imageUrl',
            align: 'center',
            width: 120
          },
          {
            title: '空间类型',
            key: 'spaceTypeName',
            align: 'center',
          },
          {
            title: '创建人',
            key: 'creater',
            align: 'center'
          },
          {
            title: '创建日期',
            key: 'createTime',
            align: 'center',
            render: (h, params) => {
              return h("span", params.row.createTime == null ? "" : params.row.createTime.substr(0, 10));
            }
          },
          {
            title: '操作',
            slot: 'action',
            align: 'center',
            width: 100
          }
        ],
        spaceList: [],
        styleColumns: [],
        spaceColumns: [],
        sceneTypeColumns: ['家装', '工程'],
        auditStatusColumns: ['是', '否'],
        productResult: [],
        uploadHeaders: {},
        uploadImgFormat: ['jpg', 'jpeg', 'png', 'bmp', 'tif', 'gif', 'pcx', 'tga', 'exif', 'fpx', 'svg', 'psd', 'cdr',
          'pcd', 'dxf', 'ufo', 'eps', 'ai', 'raw', 'WMF', 'webp'
        ],
      }
    },
    components: {
      addressSelect
    },
    created() {
      let breadcrumbs = [{
          name: "首页"
        },
        {
          name: "实景案例"
        }
      ];
      this.$store.dispatch("updateBreadcrumbs", breadcrumbs);
      this.uploadHeaders.Authorization = localStorage.getItem("jwttoken");
      this.getListStyle();
      this.getListSpace();
      this.getUploadPolicy();
    },
    mounted() {

    },
    methods: {
      getListStyle() {
        getListStyle().then(res => {
          if (res.data.code == 200) {
            this.styleColumns = res.data.data;
          }
        });
      },
      getListSpace() {
        getListSpaceTyle().then(res => {
          if (res.data.code == 200 && res.data.msg == "Success") {
            this.spaceColumns = res.data.data;
          }
        });
      },
      getUploadPolicy(fn, file) {
        let _self = this;
        getUploadPolicy().then(res => {
          if (res.status == 200) {
            this.uploadPolicy = res.data;
            if (fn) fn(file);
          }
        })
      },
      beforeRead(file) {
        let maxSize = 100 * 1024;
        let fileSize = file.size / 1024;
        if (!/\.(ogm|mpeg|asx|mpg|ogv|webm|mov|mp4|m4v)$/.test(file.name)) {
          this.$Message.warning('只能上传视频');
          return false;
        }
        if (file.name.indexOf("wmv") != -1 || file.name.indexOf("avi") != -1) {
          this.$Message.warning('暂不支持该视频格式，请重新上传');
          return false;
        }
        if (maxSize < fileSize) {
          this.$Message.warning('视频大小不能超过100M');
          return false;
        }
        let uploadUrl = window.URL.createObjectURL(file); // 将选中的上传文件转化为二进制文件，显示在页面上
        // this.formData.videoUrl = uploadUrl;
        return true;
      },
      afterRead(file) {
        let timestamp = Date.parse(new Date()) / 1000;
        if (this.uploadPolicy.expire < timestamp + 3) {
          this.getUploadPolicy(this.uploadToAliyun, file);
          return;
        }
        this.uploadToAliyun(file);
      },
      uploadToAliyun(file) {
        this.uploadVideoFlag = true;
        let _self = this;
        var getSuffix = function(fileName) {
          var pos = fileName.lastIndexOf(".");
          var suffix = '';
          if (pos != -1) {
            suffix = fileName.substring(pos);
          }
          return suffix;
        }
        var filename = new Date().getTime() + getSuffix(file.file.name);
        var formData = new FormData();
        formData.append('key', _self.uploadPolicy.dir + filename); //存储在oss的文件路径
        formData.append('OSSAccessKeyId', _self.uploadPolicy.accessid); //accessKeyId
        formData.append('policy', _self.uploadPolicy.policy); //policy
        formData.append('Signature', _self.uploadPolicy.signature); //签名
        formData.append('success_action_status', 200); //成功后返回的操作码
        formData.append('file', file.file);
        var url = _self.uploadPolicy.host;
        var fileUrl = _self.uploadPolicy.host + '/' + _self.uploadPolicy.dir + filename;
        axios({
          method: 'POST',
          url: url,
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then((response) => {
          if (response.status == 200) {
            this.uploadVideoFlag = false;
            _self.formData.videoUrl = _self.uploadPolicy.oceanoDomain + '/' + _self.uploadPolicy.dir + filename;
          } else {
            this.uploadVideoFlag = false;
            this.$Message.warning("上传失败");
          }
        }).catch(error => {
          this.uploadVideoFlag = false;
          this.$Message.warning("上传失败");
        })
      },
      onSearch(val) {
        if (!val) {
          this.showDropBox = false;
          return;
        }
        let obj = {
          productName: val
        }
        findProducts(obj).then(res => {
          if (res.data.code == 200) {
            this.productResult = res.data.data;
            if (this.productResult.length) this.showDropBox = true;
          }
        })
      },
      chooseProduct(index, item) {

      },
      handleSceneSuccess() {

      },
      handleSceneError() {

      },
      handleSpaceSuccess() {

      },
      handleSpaceError() {

      },
      deleteVideo() {

      },
      changeAuditStatus() {

      }
    }
  }
</script>

<style scoped>
  .drop-box {
    position: relative;
    width: 280px;
    max-height: 250px;
    top: 0;
    left: 0;
    overflow: auto;
    box-shadow: 1px 1px 5px rgba(0, 0, 0, .4);
    background: #fff;
    z-index: 1;
  }
</style>
