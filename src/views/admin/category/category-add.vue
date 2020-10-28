<template>
    <div>
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
            <FormItem label="父类:" prop="parentArr" style="width:40%">
                <Cascader :data="parentCategoryData" change-on-select @on-change="handelParentCategory" v-model="formValidate.parentArr"></Cascader>
            </FormItem>
            <FormItem label="名称:" prop="cateName" style="width:40%">
                <Input clearable v-model="formValidate.cateName" placeholder="请输入名称"></Input>
            </FormItem>
             <FormItem label="是否开启:" prop="statusId">
                <RadioGroup v-model="formValidate.statusId">
                    <Radio label="0">启动</Radio>
                    <Radio label="1">关闭</Radio>
                </RadioGroup>
            </FormItem>
             <FormItem label="排序:" prop="sortNum" style="width:20%">
                     <Input v-model="formValidate.sortNum" @on-blur="handleIsNum"></Input>
            </FormItem>
            <FormItem label="启用平台:" prop="platformJson" style="width:20%">
                 <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
                    <Checkbox
                        :indeterminate="formValidate.indeterminate"
                        :value="formValidate.checkAll"
                        @click.prevent.native="handleCheckAll">全选</Checkbox>
                </div>
                <CheckboxGroup v-model="formValidate.platformJson" @on-change="checkAllGroupChange">
                      <Checkbox v-for="item in platformJsonData" :label="item.label" :value="item.value" :key="item.value"></Checkbox>
                </CheckboxGroup>
            </FormItem>
             <FormItem label="分类Logo:" prop="logo">
                <div>提示: 可上传1张, 分辨率为480*320像素, 格式为jpg,png,jpeg的图片</div> 
                <logo-url @child-logo="uploadLogo" :picCategoryUrl="formValidate.categoryWatcherLogo"></logo-url>
              
            </FormItem>
             <FormItem label="banner图:" prop="displayimgId">
                 <div>提示: 可上传1张, 分辨率为480*320像素, 格式为jpg,png,jpeg的图片</div> 
              <banner-url @child-upload="uploadFun" :picOnlyUrl="formValidate.categoryWatcherBanner"></banner-url>
            </FormItem>
      
        <FormItem label="备注:" prop="description" style="width:40%;">
            <Input v-model="formValidate.description" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
        </FormItem>
        <!-- <FormItem>
          
        </FormItem> -->
    </Form>
    <div>
      <Tabs type="card">
            <TabPane label="商品属性">
                <div class="modityAttri">
                    <Button @click="handleAddTr">添加一行</Button>
                    <Button @click="handleMoreAdd" style="margin-left:15px;">批量添加</Button>
                 </div>
                <Table border :columns="modityAttriColumns" :data="modityAttriData"></Table>
            </TabPane>
            <TabPane label="品牌">
               <div class="modityAttri">
                    <Button @click="handleMoreBrandAdd">批量添加</Button>
              </div>
              <Table border :columns="brandAttriColumns" :data="brandAttriData"></Table>
            </TabPane>
      </Tabs>
      <!-- 添加商品属性 -->
      <Modal
      width="800px"
        v-model="modityShow"
        title="添加商品属性"
       >
       <Form ref="formModityAttriData" :model="formModityAttriData" :rules="ruleModityAttreValidate" :label-width="100">
           <FormItem label="属性名:" prop="attributeName">
            <Input clearable v-model="formModityAttriData.attributeName" placeholder="请输入属性名"></Input>
          </FormItem>
           <FormItem label="排序:" prop="sortNum">
            <Input clearable v-model="formModityAttriData.sortNum" @on-blur="handleBlurNumber" placeholder="请输入数字排序"></Input>
          </FormItem>
          <FormItem label="是否开启:" prop="status">
            <RadioGroup v-model="formModityAttriData.status">
                <Radio label="0">开启</Radio>
                <Radio label="1">关闭</Radio>
            </RadioGroup>
        </FormItem>
         <FormItem label="选项规则:" prop="optionRule">
            <RadioGroup v-model="formModityAttriData.optionRule">
                <Radio label="0">输入框</Radio>
                <Radio label="1">单选框</Radio>
                <Radio label="2">复选框</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="自定义输入:" prop="customInput">
            <RadioGroup v-model="formModityAttriData.customInput">
                <Radio label="0">是</Radio>
                <Radio label="1">否</Radio>
            </RadioGroup>
        </FormItem>
         <FormItem label="是否必填:" prop="mustInput">
            <RadioGroup v-model="formModityAttriData.mustInput">
                <Radio label="0">是</Radio>
                <Radio label="1">否</Radio>
            </RadioGroup>
        </FormItem>
         <FormItem label="选项:" prop="attributeValue">
            <Input clearable v-model="formModityAttriData.attributeValue" placeholder="请输入,以逗号隔开"></Input>
          </FormItem>
           <FormItem label="子级继承:" prop="childInherit">
                <Select v-model="formModityAttriData.childInherit" style="width:200px">
                        <Option value="0">否</Option>
                        <Option value="1">是</Option>
                </Select>
          </FormItem>
            <FormItem label="同步到子级:" prop="synchronizeChildCategoryArr">
              <Cascader :data="modityAttributeData" change-on-select @on-change="handelModitySyncronzeChild" v-model="formModityAttriData.synchronizeChildCategoryArr"></Cascader>
          </FormItem>
            <!-- <FormItem class="singleChild">
               <Checkbox v-model="formModityAttriData.statusAffectChild">子级同时开启或关闭</Checkbox>
          </FormItem> -->
           <FormItem class="singleChild" prop="statusAffectChild">
            <CheckboxGroup v-model="formModityAttriData.statusAffectChild">
                 <Checkbox label="1">子级同时开启或关闭</Checkbox>
                <Checkbox v-show="false" label="4"></Checkbox>
            </CheckboxGroup>
        </FormItem>
           <!-- <FormItem>
              
          </FormItem> -->
       </Form>
       <div class="moreFooter">
          <Button type="primary" @click="handleComfirm('formModityAttriData')">确 定</Button>
          <Button @click="" style="margin-left: 8px" @click="handleTrBack">取 消</Button>
       </div>
        <div slot="footer"></div>
      </Modal>
      <!-- 属性批量添加 -->
        <Modal
      width="1000px"
        v-model="moreAddShow"
        title="批量添加"
       >
        <div>
           <Form ref="formInline" :model="formMoreAttribute" inline >
              <FormItem label="类目:" :label-width="40" style="width:310px;">
                  <Cascader :data="parentCategoryData" change-on-select @on-change="handelCategoryName" v-model="formMoreAttribute.categoryNameArr"></Cascader>
              </FormItem>
              <FormItem prop="attributeName" label="属性名:" style="width:220px" :label-width="60" >
                  <Input clearable v-model="formMoreAttribute.attributeName" >
                  </Input>
              </FormItem>
              <FormItem prop="attributeValue" label="选项:" style="width:220px" :label-width="40" >
                  <Input clearable v-model="formMoreAttribute.attributeValue" >
                  </Input>
              </FormItem>
              <FormItem :label-width="0" class="moreLastButton">
                  <Button type="primary" @click="handleMoreSearch()">搜 索</Button>
                  <Button style="margin-left:15px;" @click="handleMoreReset()">重 置</Button>
              </FormItem>
           </Form>
        </div>
             <Table @on-selection-change="handleAttributeMore" border ref="selection" height="520" style="margin-bottom:15px;" :loading="formMoreAttribute.loading" :columns="moreColumns" :data="moreData"></Table>
              <Page class="morePage" :total="formMoreAttribute.total" show-total show-sizer :page-size-opts="[10,20,50,80,100]" @on-change="changePage" @on-page-size-change="changePageSize" :current="formMoreAttribute.page" />
              <div class="moreFooter">
                 <Button type="primary" @click="handleAttributeMoreSave">确 定</Button>
                 <Button style="margin-left: 8px" @click="handleAttributeBack">返 回</Button>
              </div>
        <div slot="footer"></div>
      </Modal>

      <!-- 品牌批量添加 -->
         <Modal
      width="750px"
        v-model="moreBrandAddShow"
        title="批量添加"
       >
        <div>
           <Form ref="formMoreBrandAttribute" :model="formMoreBrandAttribute" inline >
              <FormItem label="类目:" :label-width="40" style="width:310px;">
                  <Cascader :data="parentCategoryBrandData" change-on-select @on-change="handelCategoryName" v-model="formMoreBrandAttribute.categoryBrandNameArr"></Cascader>
              </FormItem>
              <FormItem prop="brandName" label="品牌名:" style="width:200px" :label-width="60" >
                  <Input clearable v-model="formMoreBrandAttribute.brandName" >
                  </Input>
              </FormItem>
              <FormItem :label-width="0" class="moreLastButton">
                  <Button type="primary" @click="handleMoreBrnadSearch()">搜 索</Button>
                  <Button style="margin-left:15px;" @click="handleMoreBrandReset()">重 置</Button>
              </FormItem>
           </Form>
        </div>
             <Table @on-selection-change="handleBrandMore" border ref="selection" height="400" style="margin-bottom:15px;" :loading="formMoreBrandAttribute.brandLoading" :columns="moreBrandColumns" :data="moreBrandData"></Table>
              <Page class="morePage" :total="formMoreBrandAttribute.total" show-total show-sizer :page-size-opts="[10,20,50,80,100]" @on-change="changeBrandPage" @on-page-size-change="changeBrandPageSize" :current="formMoreBrandAttribute.page" />
              <div class="moreFooter">
                 <Button type="primary" @click="handleBrandMoreSave">确 定</Button>
                 <Button style="margin-left: 8px" @click="handleBrandBack">返 回</Button>
              </div>
        <div slot="footer"></div>
      </Modal>

    </div>
    <div style="margin-top:50px;">
        <Button type="primary" :loading="saveBtnLoading" @click="handleSubmit('formValidate')">保 存</Button>
        <Button @click="handleAddBack" style="margin-left: 8px">返 回</Button>
    </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex";
import {
  categoryTreeAll,
  moduleConfig,
  categoryId,
  category,
  searchCategoryAttribute,
  brandList,
  categoryAttributeList,
  searchBrand,
  editCategory,
  editAddCategory,
  categoryIdPath,
  childCategoryTreeById,
  inheritParentModity
} from "@/api/category.js";
import logoUrl from "./component/category-logo";
import bannerUrl from "./component/category-uploadBanner";

// import aletTip from "@/components/alertTip.vue";

export default {
  data() {
    return {
      saveBtnLoading: false,
      formValidate: {
        id: "",
        cateName: "",
        parentArr: ["456dfadsa"], //临时存执
        parentId: "", //
        statusId: "",
        sortNum: "",
        platformJson: [],
        logo: "", //logo图
        displayimgId: "", //banner图
        indeterminate: false,
        checkAll: false,
        description: "",
        categoryWatcherBanner: {
          watchUrl: "",
          url: ""
        }, //编辑水影图
        categoryWatcherLogo: {
          watchUrl: "",
          url: ""
        } //编辑水影图
      },
      platformJsonData: [],
      modityAttributeData: [], //同步到子级
      parentCategoryData: [], //父类
      ruleValidate: {
        cateName: [{ required: true, message: "请输入名称", trigger: "blur" }],
        parentArr: [
          {
            required: true,
            type: "array",
            message: "请选择父类",
            trigger: "change"
          }
        ],
        statusId: [
          { required: true, message: "请选择是否开启", trigger: "change" }
        ]
      },
      modityAttriColumns: [
        {
          title: "属性名",
          key: "attributeName"
        },
        {
          title: "排序",
          key: "sortNum"
        },
        {
          title: "是否启用",
          key: "status",
          render: (h, params) => {
            // console.log(params, "params");
            // return h(
            //   "span",
            //   {
            //     style: {
            //       color: params.row.status == true ? "#c5c8ce" : "#2db7f5"
            //     }
            //   },
            //   params.row.status == false ? "启用" : "关闭"
            // );
            if (params.row.status == 0) {
              return h(
                "span",
                {
                  style: {
                    color: "#2db7f5"
                  }
                },
                "启用"
              );
            } else if (params.row.status == 1) {
              return h(
                "span",
                {
                  style: {
                    color: "#c5c8ce"
                  }
                },
                "关闭"
              );
            } else {
              return h(
                "span",
                {
                  style: {
                    color: "#c5c8ce"
                  }
                },
                "关闭"
              );
            }
          }
        },
        {
          title: "选项规则",
          key: "optionRule",
          render: (h, params) => {
            if (params.row.optionRule == 0) {
              return h("span", "输入框");
            } else if (params.row.optionRule == 1) {
              return h("span", "单选");
            } else if (params.row.optionRule == 2) {
              return h("span", "复选");
            }
          }
        },
        {
          title: "自定义输入",
          key: "customInput",
          render: (h, params) => {
            return h("span", params.row.customInput == false ? "是" : "否");
          }
        },
        {
          title: "是否必填",
          key: "mustInput",
          render: (h, params) => {
            return h("span", params.row.mustInput == false ? "是" : "否");
          }
        },
        {
          title: "选项",
          key: "attributeValue"
        },
        {
          title: "子级同时开启或关闭",
          key: "statusAffectChild",
          render: (h, params) => {
            return h(
              "span",
              params.row.statusAffectChild == false ? "不关联" : "关联"
            );
          }
        },
        {
          title: "子级是否继承",
          key: "childInherit",
          render: (h, params) => {
            //1 继承;0 不继承
            return h("span", params.row.childInherit != 0 ? "继承" : "不继承");
          }
        },
        {
          title: "操作",
          key: "action",
          width: 150,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.handleEditAttributeRow(params);
                    }
                  }
                },
                "编辑"
              ),
              h(
                "Button",
                {
                  props: {
                    // type: "error",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.handleRemoveAttributeRow(params);
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],

      modityAttriData: [], //添加属性table
      // 添加一行
      modityShow: false,
      formModityAttriData: {
        attributeName: "",
        sortNum: "",
        status: "0",
        optionRule: "0",
        customInput: "0",
        mustInput: "0",
        attributeValue: "", //选项属性值
        childInherit: "", //子级继承
        synchronizeChildCategoryId: "", //同步到子级
        synchronizeChildCategoryArr: [], //临时
        statusAffectChild: [], //子级同时开启或关闭 1或者0
        single: false
      },
      chooseParentCategoryId: "",
      ruleModityAttreValidate: {
        attributeName: [
          { required: true, message: "请输入属性名", trigger: "blur" }
        ],
        status: [
          { required: true, message: "请选择是否启用", trigger: "change" }
        ],
        optionRule: [
          { required: true, message: "请选择选项规则", trigger: "change" }
        ],
        customInput: [
          { required: true, message: "请选择自定义", trigger: "change" }
        ],
        mustInput: [
          { required: true, message: "请选择是否必填", trigger: "change" }
        ]
      },
      //属性 批量添加
      innerit_data: [], //继承数据存储
      moreAddShow: false,
      formMoreAttribute: {
        categoryNameArr: [],
        categoryName: "",
        attributeName: "",
        attributeValue: "",
        page: 1,
        rows: 10,
        total: 0,
        loading: true,
        selectionArr: []
      },
      moreData: [],
      moreColumns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "属性名",
          key: "attributeName"
        },
        {
          title: "必填项",
          key: "mustInput",
          render: (h, params) => {
            return h("span", params.row.mustInput == false ? "是" : "否");
          }
        },
        {
          title: "选项规则",
          key: "optionRule",
          render: (h, params) => {
            if (params.row.optionRule == 0) {
              return h("span", "输入框");
            } else if (params.row.optionRule == 1) {
              return h("span", "单选");
            } else if (params.row.optionRule == 2) {
              return h("span", "复选");
            }
          }
        },
        {
          title: "规格",
          key: "attributeValue"
        }
      ],
      // 品牌批量添加
      brandAttriColumns: [
        {
          title: "品牌名",
          key: "brandName"
        },
        {
          title: "LOGO图片",
          key: "smallLogoUrl",
          render: (h, params) => {
            if (params.row.smallLogoUrl != null) {
              return h("img", {
                attrs: {
                  src: params.row.smallLogoUrl
                },
                style: {
                  width: "50px",
                  height: "50px",
                  padding: "5px 0"
                }
              });
            }
          }
        },
        {
          title: "状态",
          key: "state",
          render: (h, params) => {
            return h(
              "span",
              {
                style: {
                  color: params.row.state == true ? "#c5c8ce" : "#2db7f5"
                }
              },
              params.row.state == false ? "启用" : "关闭"
            );
          }
        },
        {
          title: "排序",
          key: "sortNum"
        },
        {
          title: "操作",
          key: "action",
          width: 150,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    // type: "error",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.handleRemoveBrandRow(params);
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      brandAttriData: [], //品牌批量添加
      moreBrandAddShow: false,
      moreBrandData: [],
      formMoreBrandAttribute: {
        categoryBrandNameArr: [],
        categoryName: "",
        brandName: "",
        brandLoading: true,
        page: 1,
        rows: 10,
        total: 0,
        selectionArr: []
      },
      parentCategoryBrandData: [],
      moreBrandColumns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "品牌名",
          // width: 200,
          key: "brandName"
        },
        {
          title: "LOGO图片",
          // width: 100,
          key: "smallLogoUrl",
          render: (h, params) => {
            if (params.row.smallLogoUrl != null) {
              return h("img", {
                attrs: {
                  src: params.row.smallLogoUrl
                },
                style: {
                  width: "50px",
                  height: "50px",
                  padding: "5px 0"
                }
              });
            }
          }
        }
      ]
    };
  },
  components: {
    logoUrl,
    bannerUrl
  },

  mounted() {
    let title = "";
    if (this.$route.query.addCategoryId != null) {
      title = "新增类目";
    } else if (this.$route.query.editCategoryId != null) {
      title = "编辑类目";
    }
    let breadcrumbs = [{ name: "首页" }, { name: "类目管理" }, { name: title }];
    this.$store.dispatch("updateBreadcrumbs", breadcrumbs);
    this.getCategoryTreeAll();
    this.getModuleConfig();
    if (this.$route.query.editStute) {
      //编辑
      this.handleEditCategory();
      this.getBrandList(); //先获取品牌自身原来的值
      this.getCategoryAttributeList(); //先获取属性自身原来的值
    }
    if (this.$route.query.addCategoryId) {
      this.formValidate.parentArr = this.$route.query.category_parentIds;
    }
  },
  methods: {
    handleIsNum() {
      let reg = this.formValidate.sortNum;
      if (reg.replace(/\D/g, "") == "") {
        this.$Message.warning("请输入数字！！");
      }
    },
    handelParentCategory(value, selectedData) {
      let dataCategoryIds = value;
      this.chooseParentCategoryId = dataCategoryIds[dataCategoryIds.length - 1];
      this.getChildCategoryTree(this.chooseParentCategoryId);
      this.handle_inherit(this.chooseParentCategoryId); //新增获取继承属性数据
    },
    // 新增获取继承过来数据
    handle_inherit(parentId) {
      this.innerit_data = [];
      this.modityAttriData = [];
      let params = {
        parentId: parentId,
        categoryId: this.$route.query.addCategoryId
      };
      inheritParentModity(params).then(response => {
        if (response.data.code == 200) {
          this.innerit_data = response.data.data;
          for (let i = 0; i < this.innerit_data.length; i++) {
            this.modityAttriData.push(this.innerit_data[i]);
          }
        }
      });
    },

    // 批量添加 类目
    handelCategoryName() {},
    handelModitySyncronzeChild() {},
    // 添加商品属性
    handleComfirm(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let synchronizeChildCategoryIdTest = "";
          if (this.formModityAttriData.synchronizeChildCategoryArr != null) {
            if (
              this.formModityAttriData.synchronizeChildCategoryArr.length != 0
            ) {
              synchronizeChildCategoryIdTest = this.formModityAttriData
                .synchronizeChildCategoryArr[
                this.formModityAttriData.synchronizeChildCategoryArr.length - 1
              ];
            }
          }
          this.formModityAttriData.mustsynchronizeChildCategoryIdInput = synchronizeChildCategoryIdTest;
          var test = {
            attributeName: this.formModityAttriData.attributeName,
            sortNum: this.formModityAttriData.sortNum,
            status: this.formModityAttriData.status,
            optionRule: this.formModityAttriData.optionRule,
            customInput: this.formModityAttriData.customInput,
            mustInput: this.formModityAttriData.mustInput,
            attributeValue: this.formModityAttriData.attributeValue, //选项属性值
            childInherit: this.formModityAttriData.childInherit, //子级继承
            synchronizeChildCategoryId: this.formModityAttriData
              .mustsynchronizeChildCategoryIdInput, //同步到子级
            synchronizeChildCategoryArr: this.formModityAttriData
              .synchronizeChildCategoryArr, //临时
            statusAffectChild: this.formModityAttriData.statusAffectChild, //子级同时开启或关闭 1或者0
            single: false
          };
          let temp = []; //临时存值
          temp.push(test);
          let srcTemp = [...this.modityAttriData];

          let test = this.repeat(srcTemp, temp);
          this.modityAttriData = [];
          for (var i = 0; i < test.length; i++) {
            this.modityAttriData.push(test[i]);
          }
          this.modityShow = false;
        }
      });
      console.log(this.modityAttriData, 3333);
    },
    repeat(srcTemp, temp) {
      for (var k = 0; k < srcTemp.length; k++) {
        var flag = true;
        for (var j = 0; j < temp.length; j++) {
          if (srcTemp[k].attributeName == temp[j].attributeName) {
            // 赋值
            srcTemp[k].attributeName = temp[j].attributeName;
            srcTemp[k].sortNum = temp[j].sortNum;
            srcTemp[k].status = temp[j].status;
            srcTemp[k].attributeValue = temp[j].attributeValue;
            srcTemp[k].optionRule = temp[j].optionRule;
            srcTemp[k].customInput = temp[j].customInput;
            srcTemp[k].mustInput = temp[j].mustInput;

            srcTemp[k].statusAffectChild = temp[j].statusAffectChild;
            srcTemp[k].childInherit = temp[j].childInherit;
            srcTemp[k].synchronizeChildCategoryId =
              temp[j].synchronizeChildCategoryId;
            temp.splice(j, 1);
            // break;
          }
        }
      }
      if (temp.length) {
        for (var j = 0; j < temp.length; j++) {
          srcTemp.push(temp[j]);
        }
      }

      return srcTemp;
    },
    handleBlurNumber() {
      let isNumberValue = this.formModityAttriData.sortNum.replace(
        /[^\d]/g,
        ""
      );
      if (!isNumberValue) {
        this.$Message.warning("请输入数字!!");
      }
    },
    handleTrBack() {
      this.modityShow = false;
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (this.$route.query.editStute) {
            //编辑更新
            let categoryInfo = {};
            let param = {};
            categoryInfo.id = this.$route.query.editCategoryId;
            categoryInfo.cateName = this.formValidate.cateName;
            if (this.formValidate.parentArr.length != 0) {
              categoryInfo.parentId = this.formValidate.parentArr[
                this.formValidate.parentArr.length - 1
              ];
            }
            categoryInfo.status = this.formValidate.statusId;
            categoryInfo.sortNum = this.formValidate.sortNum;
            categoryInfo.logo = this.formValidate.logo;
            categoryInfo.displayimgId = this.formValidate.displayimgId;

            categoryInfo.description = this.formValidate.description.replace(
              /[\r\n]/g,
              ""
            );

            if (this.formValidate.platformJson != 0) {
              // categoryInfo.platformJson = this.formValidate.platformJson.join(
              //   ","
              // );

              let plat_form = this.formValidate.platformJson;
              let plat_arr = [];
              for (let i = 0; i < plat_form.length; i++) {
                if (plat_form[i] == "3D云") {
                  // plat_form.splice(i, 1, "3D_Cloud");
                  plat_arr.push("3D_Cloud");
                } else if (plat_form[i] == "官网") {
                  // plat_form.splice(i, 1, "official");
                  plat_arr.push("official");
                } else if (plat_form[i] == "iPad") {
                  plat_arr.push("iPad");
                }
              }
              categoryInfo.platformJson = plat_arr.join(",");
            }

            let categoryAttributeArr = [];

            for (var i = 0; i < this.modityAttriData.length; i++) {
              let obj = {};
              obj.attributeName = this.modityAttriData[i].attributeName;
              obj.sortNum = this.modityAttriData[i].sortNum;
              obj.status = this.modityAttriData[i].status;
              obj.optionRule = this.modityAttriData[i].optionRule;
              obj.customInput = this.modityAttriData[i].customInput;
              obj.mustInput = this.modityAttriData[i].mustInput;
              obj.attributeValue = this.modityAttriData[i].attributeValue;
              obj.childInherit = this.modityAttriData[i].childInherit;
              // synchronizeChildCategoryArr  同步到子级
              if (this.modityAttriData[i].synchronizeChildCategoryId != null) {
                obj.synchronizeChildCategoryId = this.modityAttriData[
                  i
                ].synchronizeChildCategoryId;
              } else {
                let synchArr = this.modityAttriData[i]
                  .synchronizeChildCategoryArr;
                if (
                  !synchArr &&
                  typeof synchArr != "undefined" &&
                  synchArr != 0
                ) {
                } else {
                  if (typeof synchArr == "undefined") {
                    obj.synchronizeChildCategoryId = null;
                  } else {
                    if (synchArr.length != 0) {
                      obj.synchronizeChildCategoryId =
                        synchArr[synchArr.length - 1];
                    } else {
                      obj.synchronizeChildCategoryId = null;
                    }
                  }
                }
              }

              let exp = this.modityAttriData[i].statusAffectChild;
              if (!exp && typeof exp != "undefined" && exp != 0) {
              } else {
                if (typeof exp == "undefined") {
                  obj.statusAffectChild = "0";
                } else {
                  if (this.modityAttriData[i].statusAffectChild.length != 0) {
                    obj.statusAffectChild = this.modityAttriData[
                      i
                    ].statusAffectChild[
                      this.modityAttriData[i].statusAffectChild.length - 1
                    ];
                  } else {
                    obj.statusAffectChild = "0";
                  }
                }
              }
              categoryAttributeArr.push(obj);
            }
            let brandListArr = this.brandAttriData;
            if (brandListArr.length != 0) {
              let paramsBrandArr = [];
              brandListArr.forEach(item => {
                paramsBrandArr.push(item.id);
              });
              param.brandIdList = paramsBrandArr;
            }

            param.category = categoryInfo; //接本信息
            param.categoryAttributeList = categoryAttributeArr;

            this.saveBtnLoading = true;
            editAddCategory(param).then(response => {
              if (response.data.code == 200) {
                this.$Message.success(response.data.msg);
                this.$router.go(-1);
              } else {
                this.saveBtnLoading = false;
              }
            });
          } else {
            //添加
            let addCategoryInfo = {};
            let addParam = {};
            // console.log(this.formValidate, "this.formValidate");
            addCategoryInfo.id = this.$route.query.addCategoryId;
            addCategoryInfo.cateName = this.formValidate.cateName;
            if (this.formValidate.parentArr.length != 0) {
              addCategoryInfo.parentId = this.formValidate.parentArr[
                this.formValidate.parentArr.length - 1
              ];
            }
            addCategoryInfo.status = this.formValidate.statusId;
            addCategoryInfo.sortNum = this.formValidate.sortNum;
            addCategoryInfo.logo = this.formValidate.logo;
            addCategoryInfo.displayimgId = this.formValidate.displayimgId;

            addCategoryInfo.description = this.formValidate.description.replace(
              /[\r\n]/g,
              ""
            );

            // if (this.formValidate.platformJson != 0) {
            //   addCategoryInfo.platformJson = this.formValidate.platformJson.join(
            //     ","
            //   );
            // }
            if (this.formValidate.platformJson != 0) {
              let plat_form_add = this.formValidate.platformJson;
              let plat_arr_add = [];
              for (let i = 0; i < plat_form_add.length; i++) {
                if (plat_form_add[i] == "3D云") {
                  // plat_form.splice(i, 1, "3D_Cloud");
                  plat_arr_add.push("3D_Cloud");
                } else if (plat_form_add[i] == "官网") {
                  // plat_form.splice(i, 1, "official");
                  plat_arr_add.push("official");
                } else if (plat_form_add[i] == "iPad") {
                  plat_arr_add.push("iPad");
                }
              }
              addCategoryInfo.platformJson = plat_arr_add.join(",");
            }

            let addCategoryAttributeArr = [];

            for (var i = 0; i < this.modityAttriData.length; i++) {
              let addObj = {};
              addObj.attributeName = this.modityAttriData[i].attributeName;
              addObj.sortNum = this.modityAttriData[i].sortNum;
              addObj.status = this.modityAttriData[i].status;
              addObj.optionRule = this.modityAttriData[i].optionRule;
              addObj.customInput = this.modityAttriData[i].customInput;
              addObj.mustInput = this.modityAttriData[i].mustInput;
              addObj.attributeValue = this.modityAttriData[i].attributeValue;
              addObj.childInherit = this.modityAttriData[i].childInherit;

              // synchronizeChildCategoryArr  同步到子级
              if (this.modityAttriData[i].synchronizeChildCategoryId != null) {
                addObj.synchronizeChildCategoryId = this.modityAttriData[
                  i
                ].synchronizeChildCategoryId;
              } else {
                let addSynchArr = this.modityAttriData[i]
                  .synchronizeChildCategoryArr;
                if (
                  !addSynchArr &&
                  typeof addSynchArr != "undefined" &&
                  addSynchArr != 0
                ) {
                } else {
                  if (typeof addSynchArr == "undefined") {
                    addObj.synchronizeChildCategoryId = null;
                  } else {
                    if (addSynchArr.length != 0) {
                      addObj.synchronizeChildCategoryId =
                        addSynchArr[addSynchArr.length - 1];
                    } else {
                      addObj.synchronizeChildCategoryId = null;
                    }
                  }
                }
              }

              let addExp = this.modityAttriData[i].statusAffectChild;
              if (!addExp && typeof addExp != "undefined" && addExp != 0) {
              } else {
                if (typeof addExp == "undefined") {
                  addObj.statusAffectChild = "0";
                } else {
                  if (this.modityAttriData[i].statusAffectChild.length != 0) {
                    addObj.statusAffectChild = this.modityAttriData[
                      i
                    ].statusAffectChild[
                      this.modityAttriData[i].statusAffectChild.length - 1
                    ];
                  } else {
                    addObj.statusAffectChild = "0";
                  }
                }
              }
              addCategoryAttributeArr.push(addObj);
            }
            let addBrandListArr = this.brandAttriData;
            if (addBrandListArr.length != 0) {
              let addParamsBrandArr = [];
              addBrandListArr.forEach(item => {
                addParamsBrandArr.push(item.id);
              });
              addParam.brandIdList = addParamsBrandArr;
            }

            addParam.category = addCategoryInfo; //接本信息
            addParam.categoryAttributeList = addCategoryAttributeArr;

            this.saveBtnLoading = true;
            category(addParam).then(response => {
              //添加
              if (response.data.code == 200) {
                this.$Message.success(response.data.msg);
                this.$router.go(-1);
              } else {
                this.saveBtnLoading = false;
              }
            });
          }
        }
      });
    },
    handleEditCategory() {
      editCategory({ categoryId: this.$route.query.editCategoryId }).then(
        response => {
          if (response.data.code == 200) {
            let paramsObject = response.data.data;
            let paramsInfo = paramsObject.category;
            let paramsPlatform = paramsObject.moduleConfigList;
            this.formValidate.id = paramsInfo.id;

            this.formValidate.cateName = paramsInfo.cateName;
            this.formValidate.statusId = paramsInfo.status.toString();
            this.formValidate.sortNum = paramsInfo.sortNum;

            if (paramsPlatform.length != 0) {
              if (paramsPlatform.length == this.platformJsonData.length) {
                this.handleCheckAll();
              } else {
                paramsPlatform.forEach(item => {
                  // this.formValidate.platformJson.push(item.moduleName);///3333
                  this.formValidate.platformJson.push(item.moduleCode);
                });
              }
            }
            if (paramsInfo.parentIdPath.indexOf(",") != -1) {
              let parentIdPath = paramsInfo.parentIdPath.split(",");
              for (var i = 1; i < parentIdPath.length - 1; i++) {
                this.formValidate.parentArr.push(parentIdPath[i]);
              }
            }
            if (paramsInfo.parentId) {
              this.getChildCategoryTree(paramsInfo.parentId);
            }

            //  banner图
            this.formValidate.displayimgId = paramsInfo.displayimgId;
            this.formValidate.categoryWatcherBanner.watchUrl =
              paramsInfo.waterDisplayImgUrl;
            this.formValidate.categoryWatcherBanner.url =
              paramsInfo.displayImgUrl;
            //  logo图
            this.formValidate.logo = paramsInfo.logo;
            this.formValidate.categoryWatcherLogo.watchUrl = paramsInfo.logoUrl;
            this.formValidate.categoryWatcherLogo.url = paramsInfo.logoUrl;
          }
        }
      );
    },
    getBrandList() {
      //获取自身
      let params = {
        categoryId: this.$route.query.editCategoryId
      };
      brandList(params).then(response => {
        if (response.data.code == 200) {
          this.brandAttriData = response.data.data; //tab中的品牌table
        }
      });
    },
    getCategoryAttributeList() {
      //获取自身
      let params = {
        categoryId: this.$route.query.editCategoryId
      };
      categoryAttributeList(params).then(response => {
        // console.log(response,'response')
        if (response.data.code == 200) {
          this.modityAttriData = response.data.data; //tab中的属性table
        }
      });
    },
    handleAddBack() {
      this.$router.go(-1);
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    },
    // 批量添加
    handleMoreSearch() {
      this.getSearchCategoryAttribute();
    },
    handleMoreReset() {
      this.formMoreAttribute.categoryNameArr = [];
      this.formMoreAttribute.categoryName = "";
      this.formMoreAttribute.attributeName = "";
      this.formMoreAttribute.attributeValue = "";
      this.getSearchCategoryAttribute();
    },
    handleMoreBrnadSearch() {
      this.getSearchBrand();
    },
    handleMoreBrandReset() {
      this.formMoreBrandAttribute.categoryBrandNameArr = [];
      this.formMoreBrandAttribute.categoryName = "";
      this.formMoreBrandAttribute.brandName = "";
    },
    // 去掉旧数据
    removeDuplicatedItem(arr) {
      for (var i = 0; i < arr.length - 1; i++) {
        for (var j = i + 1; j < arr.length; j++) {
          if (arr[i].attributeName == arr[j].attributeName) {
            arr.splice(i, 1); //console.log(arr[j]);
            j--;
          }
        }
      }
      return arr;
    },
    getCategoryTreeAll() {
      categoryTreeAll({ parentFalg: 1 }).then(response => {
        if (response.data.code == 200) {
          let dataArraa = response.data.data;
          let dataValue = this.getTree(dataArraa);
          this.parentCategoryBrandData = dataValue;
          this.parentCategoryData = dataValue;
        }
      });
    },
    getChildCategoryTree(id) {
      let params = {};
      params.id = id;
      childCategoryTreeById(params).then(response => {
        if (response.data.code == 200) {
          let dataArr = response.data.data;
          let dataValue = this.getTree(dataArr);
          this.modityAttributeData = dataValue;
        }
      });
    },
    getModuleConfig() {
      moduleConfig().then(response => {
        if (response.data.code == 200) {
          let platformArr = response.data.data;
          platformArr.forEach(item => {
            let obj = {};
            obj.value = item.moduleCode;
            obj.label = item.moduleName;
            this.platformJsonData.push(obj);
          });
        }
      });
    },
    handleAddTr() {
      this.handleReset("formModityAttriData");
      this.modityShow = true;
    },
    handleMoreAdd() {
      this.handleReset("formInline");
      this.moreAddShow = true;
      this.getSearchCategoryAttribute();
    },
    // 品牌批量添加
    handleMoreBrandAdd() {
      this.handleReset("formMoreBrandAttribute");
      this.moreBrandAddShow = true;
      this.getSearchBrand();
    },
    // 处理tree数据
    getTree(tree) {
      let arr = [];
      if (!!tree && tree.length !== 0) {
        tree.forEach(item => {
          let obj = {};
          obj.attributes = item.attributes;
          obj.label = item.text;
          obj.checked = item.checked;
          obj.state = item.state;
          obj.value = item.id;
          obj.parentId = item.parentId; // 其他你想要添加的属性
          obj.expand = false;
          obj.children = this.getTree(item.children); // 递归调用
          arr.push(obj);
        });
      }
      return arr;
    },
    handleCheckAll() {
      if (this.formValidate.indeterminate) {
        this.formValidate.checkAll = false;
      } else {
        this.formValidate.checkAll = !this.formValidate.checkAll;
      }
      this.formValidate.indeterminate = false;

      if (this.formValidate.checkAll) {
        this.platformJsonData.forEach(item => {
          this.formValidate.platformJson.push(item.label);
        });
      } else {
        this.formValidate.platformJson = [];
      }
    },
    checkAllGroupChange(data) {
      if (data.length === 3) {
        this.formValidate.indeterminate = false;
        this.formValidate.checkAll = true;
      } else if (data.length > 0) {
        // this.formValidate.indeterminate = true;
        this.formValidate.indeterminate = false;
        this.formValidate.checkAll = false;
      } else {
        this.formValidate.indeterminate = false;
        this.formValidate.checkAll = false;
      }
    },
    // 上传图片
    uploadFun(res) {
      this.formValidate.displayimgId = res.displayimgId;
    },
    uploadLogo(res) {
      this.formValidate.logo = res.logo;
    },
    getSearchCategoryAttribute() {
      this.moreData = [];
      this.formMoreAttribute.loading = true;
      let params = {};
      let categoryMoreArr = this.formMoreAttribute.categoryNameArr;
      if (categoryMoreArr.length != 0) {
        this.formMoreAttribute.categoryName =
          categoryMoreArr[categoryMoreArr.length - 1];
      }
      params.categoryId = this.formMoreAttribute.categoryName;
      params.page = this.formMoreAttribute.page;
      params.rows = this.formMoreAttribute.rows;
      params.attributeName = this.formMoreAttribute.attributeName.trim();
      params.attributeValue = this.formMoreAttribute.attributeValue.trim();
      // params.categoryId = this.$route.query.addCategoryId;//确定是那个类目ID

      searchCategoryAttribute(params).then(response => {
        if (response.data.code == 200) {
          let listObject = response.data.data;
          this.formMoreAttribute.total = listObject.total;
          let list = listObject.rows;
          list.forEach(item => {
            this.moreData.push(item);
          });
          this.formMoreAttribute.loading = false;
        }
      });
    },
    getSearchBrand() {
      this.moreBrandData = [];
      this.formMoreBrandAttribute.brandLoading = true;
      let params = {};
      let categoryMoreArr = this.formMoreBrandAttribute.categoryBrandNameArr;
      if (categoryMoreArr.length != 0) {
        this.formMoreBrandAttribute.categoryName =
          categoryMoreArr[categoryMoreArr.length - 1];
      }
      params.category = this.formMoreBrandAttribute.categoryName;
      params.page = this.formMoreBrandAttribute.page;
      params.rows = this.formMoreBrandAttribute.rows;
      params.brandName = this.formMoreBrandAttribute.brandName.trim();
      searchBrand(params).then(response => {
        if (response.data.code == 200) {
          let listBrandObject = response.data.data;
          this.formMoreBrandAttribute.total = listBrandObject.total;
          let listBrand = listBrandObject.rows;
          listBrand.forEach(item => {
            this.moreBrandData.push(item);
          });
          this.formMoreBrandAttribute.brandLoading = false;
        }
      });
    },
    //批量修改 需改页码数
    changePage(val) {
      this.formMoreAttribute.page = val;
      this.getSearchCategoryAttribute();
    },
    changePageSize(val) {
      this.formMoreAttribute.rows = val;
      this.getSearchCategoryAttribute();
    },

    // 品牌修改页码数
    changeBrandPage(val) {
      this.formMoreBrandAttribute.page = val;
      this.getSearchBrand();
    },
    changeBrandPageSize(val) {
      this.formMoreBrandAttribute.rows = val;
      this.getSearchBrand();
    },

    handleBrandMoreSave() {
      // this.brandAttriData=this.formMoreBrandAttribute.selectionArr;
      let datagridRows = this.formMoreBrandAttribute.selectionArr;
      let rows = this.brandAttriData;
      for (var i = 0; i < datagridRows.length; i++) {
        var isHave = 0;
        for (var j = 0; j < rows.length; j++) {
          if (datagridRows[i].id == rows[j].id) {
            isHave = 1;
            break;
          }
        }
        if (isHave == 0) {
          this.brandAttriData.push(datagridRows[i]);
        }
      }
      this.moreBrandAddShow = false;
    },
    handleBrandMore(selection) {
      this.formMoreBrandAttribute.selectionArr = selection;
    },
    handleBrandBack() {
      this.moreBrandAddShow = false;
    },
    handleAttributeMore(selection) {
      this.formMoreAttribute.selectionArr = selection;
    },
    handleAttributeMoreSave() {
      let datagridRows = this.formMoreAttribute.selectionArr;
      let rows = this.modityAttriData;
      for (var i = 0; i < datagridRows.length; i++) {
        var isHave = 0;
        for (var j = 0; j < rows.length; j++) {
          if (datagridRows[i].attributeName == rows[j].attributeName) {
            isHave = 1;
            break;
          }
        }
        if (isHave == 0) {
          if (datagridRows[i].synchronizeChildCategoryId == "0") {
            //0标示同步全部数据了，如果不选或者批量添加过来得都是传null
            datagridRows[i].synchronizeChildCategoryId = null;

            this.modityAttriData.push(datagridRows[i]);
          } else {
            this.modityAttriData.push(datagridRows[i]);
          }
          // this.modityAttriData.push(datagridRows[i]);
        }
      }
      this.moreAddShow = false;
    },
    handleAttributeBack() {
      this.moreAddShow = false;
    },
    handleEditAttributeRow(data) {
      this.handleReset("formModityAttriData");
      this.modityShow = true;

      let dataInfo = data.row;
      this.formModityAttriData.attributeName = dataInfo.attributeName;
      this.formModityAttriData.sortNum = dataInfo.sortNum;
      if (dataInfo.status != null) {
        this.formModityAttriData.status = dataInfo.status.toString();
      }
      if (dataInfo.optionRule != null) {
        this.formModityAttriData.optionRule = dataInfo.optionRule.toString();
      }
      if (dataInfo.customInput != null) {
        this.formModityAttriData.customInput = dataInfo.customInput.toString();
      }
      if (dataInfo.mustInput != null) {
        this.formModityAttriData.mustInput = dataInfo.mustInput.toString();
      }

      this.formModityAttriData.attributeValue = dataInfo.attributeValue;
      if (dataInfo.childInherit != null) {
        this.formModityAttriData.childInherit = dataInfo.childInherit.toString();
      }

      if (dataInfo.statusAffectChild !== null) {
        if (Array.isArray(dataInfo.statusAffectChild)) {
          let statusAffectChild_arr = dataInfo.statusAffectChild;
          if (statusAffectChild_arr.indexOf("1") != -1) {
            let index = statusAffectChild_arr.indexOf("1");
            this.formModityAttriData.statusAffectChild.push(
              statusAffectChild_arr[index]
            );
          } else {
            this.formModityAttriData.statusAffectChild.push("0");
          }
        } else {
          this.formModityAttriData.statusAffectChild.push(
            dataInfo.statusAffectChild.toString()
          );
        }
      } else {
        this.formModityAttriData.statusAffectChild.push("0");
      }

      if (
        dataInfo.synchronizeChildCategoryArr &&
        dataInfo.synchronizeChildCategoryArr !== null
      ) {
        if (dataInfo.synchronizeChildCategoryArr.length != 0) {
          this.formModityAttriData.synchronizeChildCategoryArr =
            dataInfo.synchronizeChildCategoryArr;
          this.formModityAttriData.synchronizeChildCategoryId =
            dataInfo.synchronizeChildCategoryId;
        }
      }
      if (dataInfo.synchronizeChildCategoryId) {
        this.getCategoryIdPath(dataInfo.synchronizeChildCategoryId);
      }
    },
    handleRemoveAttributeRow(data) {
      // this.modityAttriData.splice(data.index, 1);
      if (this.$route.query.editCategoryId) {
        this.modityAttriData.splice(data.index, 1);
      } else if (this.$route.query.addCategoryId) {
        for (let i = 0; i < this.innerit_data.length; i++) {
          if (this.innerit_data[i].id == data.row.id) {
            this.$Message.warning("继承来的数据不能删除");
          } else {
            this.modityAttriData.splice(data.index, 1);
          }
        }
      }
    },

    handleRemoveBrandRow(data) {
      this.brandAttriData.splice(data.index, 1);
    },
    getCategoryIdPath(categoryId) {
      categoryIdPath({ categoryId }).then(response => {
        if (response.data.code == 200) {
          if (response.data.data.indexOf(",") != -1) {
            let path = response.data.data.split(",");
            this.formModityAttriData.synchronizeChildCategoryId =
              path[path.length - 1];
            for (var i = 1; i < path.length; i++) {
              this.formModityAttriData.synchronizeChildCategoryArr.push(
                path[i]
              );
            }
          }
        }
      });
    }
  },
  watch: {}
};
</script>
<style lang="less" scoped>
.modityAttri {
  text-align: left !important;
  margin-bottom: 15px;
}
.singleChild {
  position: absolute;
  right: 20%;
  top: 27%;
}

.moreLastButton {
  position: absolute;
  right: 20px;
}
.morePage {
  display: flex;
  justify-content: flex-end;
}
.moreFooter {
  display: flex;
  justify-content: center;
  margin-top: 50px;
}
</style>


