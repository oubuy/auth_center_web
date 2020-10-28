<template>
<Modal v-model="model" :title="title" @on-visible-change="handleVisibleChange" footer-hide>
    <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="80">
        <FormItem label="父类" prop="parentId">
            <Cascader v-model="parentCategorySelected" :disabled="parentCategoryDisabled" @on-change="handleChangeParentCategory" :data="parentCategoryData" change-on-select></Cascader>
        </FormItem>
        <FormItem label="名称" prop="cateName">
            <Input v-model.trim="formData.cateName" placeholder="请输入类目名称" clearable></Input>
        </FormItem>
        <FormItem label="排序" prop="sortNum">
            <InputNumber v-model.trim="formData.sortNum" placeholder="请输入数字序号" :precision="0" style="width:100%;"></InputNumber>
        </FormItem>
        <FormItem label="状态" prop="status">
            <RadioGroup v-model="formData.status">
                <Radio label="0">启用</Radio>
                <Radio label="1">禁用</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="启用平台">
            <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
                <Checkbox :indeterminate="indeterminate" :value="checkAll" @click.prevent.native="handleCheckAll">全选</Checkbox>
            </div>
            <CheckboxGroup v-model="platformSelected" @on-change="checkAllGroupChange">
                <Checkbox v-for="item in moduleConfigList" :label="item.moduleCode" :key="item.moduleCode">{{item.moduleName}}</Checkbox>
            </CheckboxGroup>
        </FormItem>
        <FormItem label="分类Logo">
            <upload-img ref="logoUpload" :quantity="1" style="display: inline-block;"></upload-img>
            <div class="field-tip" style="display: inline-block; position:absolute;">请上传分辨率为480*320像素，格式为jpg、jpeg、png的图片</div>
        </FormItem>
        <FormItem label="Banner图">
            <upload-img ref="bannerUpload" :quantity="1" style="display: inline-block;"></upload-img>
            <div class="field-tip" style="display: inline-block; position:absolute;">请上传分辨率为480*320像素，格式为jpg、jpeg、png的图片</div>
        </FormItem>
        <FormItem label="备注">
            <Input v-model="formData.description" type="textarea" :autosize="{minRows: 3,maxRows: 5}"></Input>
        </FormItem>
        <FormItem>
            <Button type="primary" :loading="saveBtnLoading" @click="handleSubmit">保存</Button>
            <Button @click="model=false" style="margin-left: 8px">取消</Button>
        </FormItem>
    </Form>
</Modal>
</template>

<script>
import { saveCategory, categoryTreeAll, moduleConfig } from "@/api/category.js";
import uploadImg from "./upload-img";

export default {
  data() {
    return {
      title: null,
      model: false,
      saveBtnLoading: false,
      parentCategoryDisabled: false,
      parentCategoryData: [],
      parentCategorySelected: [],
      moduleConfigList: [],
      platformSelected: [], // 已选平台
      indeterminate: false,
      checkAll: false,
      formData: {
        id: null,
        parentId: null,
        cateName: null,
        sortNum: null,
        status: null,
        description: null
      },
      ruleValidate: {
        parentId: [
          {
            required: true,
            message: "请选择父级类目"
          }
        ],
        cateName: [
          {
            required: true,
            message: "请输入类目名称",
            trigger: "blur"
          }
        ],
        sortNum: [
          {
            required: true,
            message: "请输入数字序号"
          }
        ],
        status: [
          {
            required: true,
            message: "请选择状态"
          }
        ]
      }
    };
  },
  components: {
    uploadImg
  },
  created() {
    this.getModuleConfig();
  },
  methods: {
    initEdit(category) {
    
      this.getCategoryTree();
      if (category) {
        this.title = "编辑";
        this.parentCategoryDisabled = true;
        this.formData.id = category.id;
        this.formData.cateName = category.cateName;
        this.formData.parentId = category.parentId;
        this.formData.sortNum = category.sortNum;
        this.formData.status = String(category.status);
        this.formData.description = category.description;
        let parentIdPathArr = category.parentIdPath.split(",");
        if (parentIdPathArr.length > 2) {
          this.parentCategorySelected = parentIdPathArr.slice(1);
        } else {
          this.parentCategorySelected = ["0"];
        }
        this.platformSelected = category.platformJson
          ? category.platformJson.split(",")
          : [];
        if (category.logoUrl) {
          let img = {
            imageId: category.logo,
            imageUrl: category.logoUrl,
            url: category.logoUrl
          };
          this.$refs.logoUpload.initUploadList(img);
        }
        if (category.displayImgUrl) {
          let img = {
            imageId: category.displayimgId,
            imageUrl: category.displayImgUrl,
            waterImageUrl: category.waterDisplayImgUrl,
            url: category.displayImgUrl
          };
          this.$refs.bannerUpload.initUploadList(img);
        }
        this.checkAllGroupChange(this.platformSelected);
      } else {
        this.title = "新增";
        this.parentCategoryDisabled = false;
      }
      this.model = true;
    },
    handleSubmit() {
      this.$refs["formData"].validate(valid => {
        if (!valid) {
          return;
        }
        this.formData.platformJson = this.platformSelected.join(",");
        let logoUploadList = this.$refs.logoUpload.getUploadList();
        if (logoUploadList.length > 0) {
          this.formData.logoUrl = logoUploadList[0].url;
          this.formData.logo = logoUploadList[0].imageId;
        } else {
          this.formData.logoUrl = null;
          this.formData.logo = null;
        }
        let bannerUploadList = this.$refs.bannerUpload.getUploadList();
        if (bannerUploadList.length > 0) {
          this.formData.displayImgUrl = bannerUploadList[0].url;
          this.formData.displayimgId = bannerUploadList[0].imageId;
          this.formData.waterDisplayImgUrl = bannerUploadList[0].waterImageUrl;
        } else {
          this.formData.displayImgUrl = null;
          this.formData.displayimgId = null;
          this.formData.waterDisplayImgUrl = null;
        }
        this.saveBtnLoading = true;
        saveCategory(this.formData).then(resp => {
          this.saveBtnLoading = false;
          if (resp.data.code == 200) {
            this.$Message.success(resp.data.msg);
            this.$emit("save-success");
            this.model = false;
          }
        });
      });
    },
    handleVisibleChange(val) {
      if (!val) {
        this.resetData();
      }
    },
    resetData() {
      this.$refs["formData"].resetFields();
      this.saveBtnLoading = false;
      this.parentCategorySelected = [];
      this.platformSelected = [];
      this.indeterminate = false;
      this.checkAll = false;
      this.formData.id = null;
      this.formData.parentId = null;
      this.formData.cateName = null;
      this.formData.sortNum = null;
      this.formData.status = null;
      this.formData.description = null;
      this.$refs.logoUpload.initUploadList();
      this.$refs.bannerUpload.initUploadList();
    },
    getModuleConfig() {
      moduleConfig().then(response => {
        // if (response.data.code == 200) {
        //     console.log(response.data.data,444)
        //     this.moduleConfigList = response.data.data;
        // }
        if (response.status == 200) {
          let platformArr = response.data;
          platformArr.forEach(item => {
            let obj = {};
            obj.moduleCode = item.id;
            obj.moduleName = item.name;
            this.moduleConfigList.push(obj);
          });
        }
      });
    },
    handleChangeParentCategory(value, selectedData) {
      this.formData.parentId = value[value.length - 1];
    },
    getCategoryTree() {
      categoryTreeAll({
        parentFalg: 1,
        showDisabled: true
      }).then(response => {
        if (response.data.code == 200) {
          this.parentCategoryData = this.getTree(response.data.data);
        }
      });
    },
    getTree(tree) {
      let arr = [];
      if (tree) {
        tree.forEach(item => {
          let obj = {};
          obj.attributes = item.attributes;
          obj.label = item.text;
          obj.checked = item.checked;
          obj.state = item.state;
          obj.value = item.id;
          obj.parentId = item.parentId;
          obj.expand = false;
          obj.children = this.getTree(item.children);
          arr.push(obj);
        });
      }
      return arr;
    },
    handleCheckAll() {
      if (this.indeterminate) {
        this.checkAll = false;
      } else {
        this.checkAll = !this.checkAll;
      }
      this.indeterminate = false;
      this.platformSelected = [];
      if (this.checkAll) {
        this.moduleConfigList.forEach(item => {
          this.platformSelected.push(item.moduleCode);
        });
      }
    },
    checkAllGroupChange(data) {
      if (data.length === this.moduleConfigList.length) {
        this.indeterminate = false;
        this.checkAll = true;
      } else if (data.length > 0) {
        this.indeterminate = true;
        this.checkAll = false;
      } else {
        this.indeterminate = false;
        this.checkAll = false;
      }
    }
  }
};
</script>

<style scoped>
.field-tip {
  color: #9ea7b4;
  font-size: 12px;
  margin-left: 16px;
}
</style>
