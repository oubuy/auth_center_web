<template>
  <div>
    <Card style="margin-bottom:16px; text-align:left;" dis-hover>
      <Form :label-width='80' inline>
        <FormItem label="小区">
          <Input type="text" v-model.trim="searchParam.keyword" placeholder="请输入小区名称" @on-enter="handleSearch"
            clearable></Input>
        </FormItem>
        <FormItem label="地区">
          <address-select ref="addressSelectRef" :address="searchParam"></address-select>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSearch">搜 索</Button>
          <Button @click="handleResetForm" style="margin-left: 8px">重 置</Button>
        </FormItem>
      </Form>
    </Card>
    <div style="margin-bottom: 16px;text-align: left;">
      <Button type="primary" style="margin-right: 8px;">新增方案</Button>
      <Button style="margin-right: 8px;">审核通过</Button>
      <Button style="margin-right: 8px;">审核不通过</Button>
      <Button style="margin-right: 8px;">删除</Button>
    </div>
    <div>
      <Table border :loading="loading" :data="formData" :columns="columns" @on-selection-change="handleSelectionChange"></Table>
    </div>
  </div>
</template>

<script>
  import addressSelect from "@/components/build/address";
  export default {
    data() {
      return {
        searchParam: {
          page: 1, // 当前页
          rows: 10, // 每页显示多少条
          keyword: '',
          provinceId: '',
          cityId: '',
          areaId: ''
        },
        loading: false,
        columns: [{
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '方案主图',
            key: 'imageUrl',
            slot: 'imageUrl',
            align: 'center',
            width: 120
          },
          {
            title: '小区',
            key: 'buildingName',
            minWidth: 150,
            render: (h, params) => {
              return h('a', {
                on: {
                  click: () => {
                    this.handleGotoEdit(params.row.programmeId);
                  }
                }
              }, params.row.buildingName);
            }
          },
          {
            title: '户型',
            key: 'modelName',
            minWidth: 150
          },
          {
            title: '风格',
            key: 'styleName',
            minWidth: 150
          },
          {
            title: '审核状态',
            key: 'auditStatus',
            width: 100,
            render: (h, params) => {
              let val = params.row.auditStatus;
              let color = "#515a6e";
              if (params.row.auditStatus == 0) {
                val = '待审核';
              } else if (params.row.auditStatus == 1) {
                val = '审核通过';
              } else if (params.row.auditStatus == 2) {
                val = '审核不通过';
              }
              return h("span", {
                style: {
                  color: color
                }
              }, val);
            }
          },
          {
            title: '创建人',
            key: 'creater',
            width: 100
          },
          {
            title: '创建日期',
            key: 'createTime',
            align: 'center',
            width: 100,
            render: (h, params) => {
              return h("span", params.row.createTime == null ? "" : params.row.createTime.substr(0, 10));
            }
          }
        ],
        formData: []
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
    },
    methods: {
      handleSearch() {

      },
      handleResetForm() {
        this.searchParam.page = 1;
        this.searchParam.rows = 10;
        this.searchParam.keyword = "";
        this.searchParam.provinceId = "";
        this.searchParam.cityId = "";
        this.searchParam.areaId = "";
      },
      handleSelectionChange() {

      },
      handleGotoEdit(id) {

      }
    }
  }
</script>

<style>
</style>
