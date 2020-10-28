<template>
  <div>
    <Form ref="formValidate"
      :model="formValidate"
      :rules="ruleValidate"
      :label-width="80">
      <FormItem label="名称:"
        prop="name"
        style="width:300px">
        <Input v-model="formValidate.name"
          placeholder="请输入名称"
          :disabled="nameDisabled"></Input>
      </FormItem>
      <FormItem label="编码:"
        prop="code"
        style="width:300px">
        <Input v-model="formValidate.code"
          placeholder="请输入编码"
          :disabled="codeDisabled"></Input>
      </FormItem>
      <FormItem label="类型:"
        prop="type"
        style="width:300px">
        <Select v-model="formValidate.type"
          filterable>
          <Option value="PLATFORM">中台</Option>
          <Option value="O2O">O2O项目</Option>
          <Option value="3D">3D云设计</Option>
          <Option value="BUSINESS">业务协同项目</Option>
        </Select>
      </FormItem>
      <FormItem label="适用主框:"
        prop="applyFrame"
        style="width:300px">
        <Select v-model="formValidate.applyFrame"
          filterable>
          <Option value="0">旧主框</Option>
          <Option value="1">新主框</Option>
        </Select>
      </FormItem>
      <FormItem label="状态:"
        prop="disable"
        style="width:300px">
        <Select v-model="formValidate.disable"
          filterable>
          <Option value="0">可用</Option>
          <Option value="1">禁用</Option>
        </Select>
      </FormItem>
      <FormItem label="描述:"
        prop="description"
        style="width:300px">
        <Input v-model="formValidate.description"
          type="textarea"
          :autosize="{minRows: 2,maxRows: 5}"></Input>
      </FormItem>

      <FormItem>
        <Button type="primary"
          @click="handleSubmit('formValidate')">保 存
        </Button>
        <Button @click="handleBack"
          style="margin-left: 8px">返 回
        </Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
  import {
    addSystem,
    editSystem,
    getSystemInfo
  } from "@/api/system.js";
  export default {
    data() {
      return {
        nameDisabled: false,
        codeDisabled: false,
        formValidate: {
          id: undefined,
          name: "",
          code: "",
          type: 'PLATFORM',
          disable: '0',
          description: "",
          applyFrame: '1',
        },
        ruleValidate: {
          name: [
            {
              required: true,
              message: "名称不能为空",
              trigger: "blur"
            }
          ],
          code: [
            {
              required: true,
              message: "编码不能为空",
              trigger: "blur"
            }
          ],
          type: [
            {
              required: true,
              message: "类型不能为空",
              trigger: "blur"
            }
          ],
          applyFrame: [
            {
              required: true,
              message: "适用主框不能为空",
              trigger: "change"
            }
          ],
          disable: [
            {
              required: true,
              message: "状态不能为空",
              trigger: "change"
            }
          ]
        },
      };
    },
    props: ['systemId'],
    created() {
    },
    mounted() {
    },
    methods: {
      handleSubmit(name) {
        this.$refs[name].validate(valid => {
          if (valid) {
            let paramsSubmit = {};
            paramsSubmit.id = Number(this.formValidate.id);
            paramsSubmit.name = this.formValidate.name;
            paramsSubmit.code = this.formValidate.code;
            paramsSubmit.type = this.formValidate.type;
            paramsSubmit.disable = this.formValidate.disable;
            paramsSubmit.description = this.formValidate.description;
            paramsSubmit.applyFrame = Number(this.formValidate.applyFrame);

            if (this.formValidate.disable == 0) {
              paramsSubmit.disable = false;
            } else if (this.formValidate.disable == 1) {
              paramsSubmit.disable = true;
            }

            if (this.formValidate.id) {
              editSystem(paramsSubmit).then(response => {
                if (response.data.code == 200) {
                  this.$Message.success(response.data.msg);
                  this.handleReset("formValidate");
                  this.$emit("child-show");
                }
              });
            } else {
              addSystem(paramsSubmit).then(response => {
                if (response.data.code == 200) {
                  this.$Message.success(response.data.msg);
                  this.handleReset("formValidate");
                  this.$emit("child-show");
                }
              });
            }
          }
        });
      },
      handleBack() {
        this.$emit('child-back', false);
      },
      handleReset(name) {
        this.$refs[name].resetFields();
      },
      getSystemInfoFun(){
        if (this.formValidate.id) {
          getSystemInfo({ systemId: this.formValidate.id }).then(response => {
            if (response.data.code == 200) {
              let system = response.data.data.system;

              this.formValidate.id = system.id.toString();
              this.formValidate.name = system.name;
              this.formValidate.code = system.code;
              this.formValidate.type = system.type;

              this.formValidate.description = system.description;
              this.formValidate.applyFrame = system.applyFrame.toString();
              if (system.disable == false) {
                this.formValidate.disable = '0';
              } else {
                this.formValidate.disable = '1';
              }
            }
          });
        } else {
          this.formValidate.id = undefined;
          this.formValidate.name = "";
          this.formValidate.code = "";
          this.formValidate.type = 'PLATFORM';
          this.formValidate.disable = '0';
          this.formValidate.description = "";
          this.formValidate.applyFrame = '1';
        }
      }
    },
    watch: {
      systemId(val){//普通的watch监听
        console.log("a: " + val);
        this.formValidate.id = val;

        if (this.formValidate.id) {
          this.nameDisabled = true;
          this.codeDisabled = true;
        } else {
          this.nameDisabled = false;
          this.codeDisabled = false;
        }

        this.getSystemInfoFun();
      },
    }
  };
</script>

<style lang="less"
  scoped>
  .parentTree {
    overflow: auto;
    height: 500px;
  }

  .parentCard {
    width: 220px;
    height: 300px;
    overflow: auto;
    position: fixed;
    z-index: 2000;
  }

  .footerButton {
    position: absolute;
    bottom: 20px;
    left: 50%;
  }

  .ivu-select-dropdown {
    z-index: 100000 !important;
  }
</style>

