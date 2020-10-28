<template>
  <div>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
      <FormItem label="个数:" prop="num" style="width:300px">
        <InputNumber v-model="formValidate.num" :precision='0' :min="1" style="width:100%"
          placeholder="请输入个数"/>
      </FormItem>
      <FormItem label="类型" prop="activatedType" style="width:300px">
          <Select v-model="formValidate.activatedType" placeholder="请选择" clearable>
              <Option value="交互大屏">交互大屏</Option>
              <Option value="电脑">电脑</Option>
              <Option value="内部使用">内部使用</Option>
          </Select>
      </FormItem>
      <!-- <FormItem label="开始时间" style="width:300px">
          <DatePicker type="datetime" v-model="formValidate.beginTime" @on-change="formValidate.beginTime=$event"  :editable="false" style="width:100%"></DatePicker>
      </FormItem>
      <FormItem label="结束时间" style="width:300px">
          <DatePicker type="datetime" v-model="formValidate.endTime" @on-change="formValidate.endTime=$event"  :editable="false" style="width:100%"></DatePicker>
      </FormItem> -->
      <FormItem label="备注" prop="remark" style="width:300px">
          <Input v-model="formValidate.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注"/>
      </FormItem>

      <FormItem>
        <Button type="primary" :loading="creating"
          @click="handleSubmit('formValidate')">
          <span v-if="!creating">生成</span>
          <span v-else>生成中...</span>
          
        </Button>

        <Button @click="handleBack"
          style="margin-left: 8px">取 消
        </Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
  import {
    addLicense,
    getSystemInfo
  } from "@/api/license.js";
  export default {
    data() {
      return {
        creating:false,
        formValidate: {
          num: 1,
          remark:'',
          activatedType:'',
          beginTime:'',
          endTime:''
        },
        ruleValidate: {
          num: [
            {
              type:'integer',
              required: true,
              message: "个数不能为空",
              trigger: "blur"
            }
          ],
          activatedType: [
            {
              type:'string',
              required: true,
              message: "类型不能为空",
              trigger: "blur"
            }
          ],
          remark:[
            { type: 'string', max: 100, message: '不能超过100个字符', trigger: 'blur' }
          ]
        },
      };
    },
    props: ['licenseCode'],
    created() {
    },
    mounted() {
    },
    methods: {
      handleSubmit(name) {
        this.$refs[name].validate(valid => {
          if (valid) {
            // let paramsSubmit = {
            //   num: '',
            //   remark:''
            // };
            // paramsSubmit.num = this.formValidate.num;
            this.creating = true
            addLicense(this.formValidate).then(response => {
                if (response.data.code == 200) {
                  this.$Message.success(response.data.msg);
                  this.handleReset("formValidate");
                  this.$emit("child-show");
                  this.creating = false
                }
              });
            
          }
        });
      },
      handleBack() {
        this.$emit('child-back', false);
      },
      handleReset(name) {
        this.$refs[name].resetFields();
      },
     
    },
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

