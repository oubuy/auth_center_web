import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '@/views/main'
import {
  getToken
} from '@/api/api.js'
import {
  LoadingBar
} from 'iview'

import store from '../store/index.js'//


Vue.use(VueRouter)
Vue.use(LoadingBar)

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
const appRouter = [{
  path: '/admin/outer',
  icon: 'key',
  name: 'admin-outer',
  title: '经销商组织',
  component: Main,
  children: [{
    path: 'org',
    title: '经销商组织管理',
    name: 'admin_outer_org_mgr',
    component: () =>
      import('@/views/admin/outer/outer-org.vue')
  },
  // 经销商
  {
    path: 'orgDealer',
    title: "新增经销商",
    name: '',
    component: () => {
      return import('@/views/admin/outer/out-orgDealer.vue')
    }

  },
  // 门店/部门
  {
    path: 'orgShopType',
    title: '新增门店/部门',
    name: '',
    component: () => {
      return import('@/views/admin/outer/outerO-shopType.vue')
    }
  },
  // 其他
  {
    path: 'orgOtherType',
    title: '新增其他组织',
    name: '',
    component: () => {
      return import('@/views/admin/outer/outer-otherType.vue')
    }
  },
  {
    path: 'user',
    name: 'admin_outer_user_mgr',
    meta: {
      requiresAuth: true
    },
    component: () =>
      import('@/views/admin/outer/outer-user.vue')
  },
  {
    path: 'role',
    title: '经销商角色管理',
    name: 'admin_outer_role_mgr',
    component: () =>
      import('@/views/admin/outer/outer-role.vue')
  }
  ]
},
{//权限
  path: '/admin/authod',
  icon: 'key',
  name: 'admin-authod',
  title: '权限',
  component: Main,
  children: [
    {
      path: 'list',
      title: '权限列表',
      name: 'admin_permission',
      component: () => {
        return import('@/views/admin/authod/authod-list.vue')
      }
    },

  ]
},
{//标签
  path: '/admin/label',
  icon: 'key',
  name: 'modity-tag',
  title: '标签',
  component: Main,
  children: [
    {
      path: 'list',
      title: '标签列表',
      name: 'modity-tag-list',
      component: () => {
        return import('@/views/admin/label/label_list.vue')
      }
    },
    {
      path: 'add',
      title: '添加标签',
      name: 'modity-tag-add',
      component: () => {
        return import('@/views/admin/label/label_addEdit.vue')
      }
    },

  ]
},
{//角色管理
  path: '/admin/role',
  icon: 'key',
  name: 'admin-role',
  title: '角色管理',
  component: Main,
  children: [
    {
      path: 'list',
      title: '角色管理',
      name: 'admin_role',
      component: () => {
        return import('@/views/admin/role/role-list.vue')
      }
    },
    {
      path: 'add',
      title: '新增角色',
      name: 'admin_role_add',
      component: () => {
        return import('@/views/admin/role/role-add.vue')
      }

    }
  ]
},
// 楼盘中心（内部使用）
{
  path: '/admin/build',
  name: 'admin_build',
  title: '楼盘中心',
  component: Main,
  children: [
    {
      path: 'building',
      name: 'admin_build_building_mgr',
      title: '楼盘内部管理',
      meta: {
        requiresAuth: true
      },
      component: () =>
        import('@/views/admin/build/building/building.vue')
    },
    {
        path: 'buildingmodel',
        name: 'admin_build_buildingmodel_mgr',
        title: '户型内部管理',
        meta: {
          requiresAuth: true
        },
        component: () =>
          import('@/views/admin/build/buildingmodel/buildingmodel.vue')
    },
    {
      path: 'space',
      name: 'admin_build_space_mgr',
      title: '案例内部管理',
      meta: {
        requiresAuth: true
      },
      component: () =>
        import('@/views/admin/build/space/space.vue')
  },
    {
      path: 'programme',
      name: 'admin_build_programme_mgr',
      title: '整屋方案',
      meta: {
        requiresAuth: true
      },
      component: () =>
        import('@/views/admin/build/programme/programme.vue')
    }
  ]
},
{
  path: '/report',
  name: 'report',
  title: '报表',
  component: Main,
  children: [
    {
      path: 'tv',
      name: 'report_tv',
      title: '交互大屏报表',
      meta: {
        requiresAuth: true
      },
      component: () =>
        import('@/views/report/report-tv.vue')
    }
  ]
},
{//系统==>菜单管理
  path: '/admin/menu',
  icon: 'key',
  title: '菜单管理',
  component: Main,
  children: [
    {
      path: 'list',
      title: '菜单管理',
      name: 'menu_management',
      component: () => {
        return import('@/views/admin/menu/menu-list.vue')
      }
    }
  ]
},
// 门店
{
  path: '/admin/store',
  icon: 'key',
  title: '门店管理',
  component: Main,
  children: [


    {
      path: 'list',
      title: '门店管理',
      name: 'inner_modity_mgt',
      component: () => {
        return import('@/views/admin/store/store-list.vue')
      }
    },
    {
      path: 'addModity',
      title: '添加商品',
      name: '',
      component: () => {
        return import('@/views/admin/store/add-modity.vue')
      }
    },
    {
      path: 'editModity',
      title: '编辑商品',
      name: '',
      component: () => {
        return import('@/views/admin/store/edit-modity.vue')
      }
    },
    {//导入
      path: 'importModity',
      title: '导入商品',
      name: '',
      component: () => {
        return import('@/views/admin/store/components/importModity.vue')
      }

    },
    {//获取打印价格牌list表
      path: 'printList',
      title: '获取打印列表',
      name: '',
      component: () => {
        return import('@/views/admin/store/components/printList.vue')
      }

    },
    {//打印价格牌
      path: 'printPrice',
      title: '打印价格牌',
      name: '',
      component: () => {
        return import('@/views/admin/store/components/printPrice.vue')
      }

    }

  ]

},

{//系统管理
  path: '/admin/system',
  icon: 'key',
  name: 'admin-system',
  // name:'system_management',
  title: '系统管理',
  component: Main,
  children: [
    {
      path: 'system_management',
      title: '系统管理',
      name: 'system_management',
      component: () => {
        return import('@/views/admin/system/system_list.vue')
      }
    }
  ]
},
{//商品
  path: '/admin/category',
  icon: 'key',
  // name: 'admin-category',
  title: '商品管理',
  component: Main,
  children: [
    {
      path: 'main',
      title: '系列管理',
      name: 'admin_category_mgr',
      component: () => {
        return import('@/views/admin/category/category.vue')
      }
    },

    {
      path: 'list',
      title: '类目管理',
      // inner_category_mgt
      name: 'inner_category_mgt',
      component: () => {
        return import('@/views/admin/category/category-list.vue')
      }
    },
    {
      path: 'add',
      title: '类目添加',
      name: 'category_add',
      component: () => {
        return import('@/views/admin/category/category-add.vue')
      }
    }
  ]


},

{
  path: '/admin/inner',
  icon: 'key',
  name: 'admin-inner',
  title: '内部架构',
  component: Main,
  children: [
    {
      path: 'user',
      name: 'admin_inner_user_mgr',
      title: '内部人员管理',
      meta: {
        requiresAuth: true
      },
      component: () =>
        import('@/views/admin/inner/inner-user.vue')
    }
  ]
},
{
  path: '/admin/sync',
  icon: 'key',
  name: 'data-sync',
  title: '数据同步',
  component: Main,
  children: [
    {
      path: 'qixin',
      name: 'admin_sync_qixin',
      title: '组织架构同步',
      meta: {
        requiresAuth: true
      },
      component: () =>
        import('@/views/admin/sync/sync-qixin.vue')
    },
    {
      path: 'customer',
      name: 'customer-sync',
      title: '客户信息同步',
      meta: {
        requiresAuth: true
      },
      component: () =>
        import('@/views/admin/sync/sync-customer.vue')
    }
  ]
},

{
  path:'/admin/ue4',
  icon: 'key',
  name: 'ue4',
  title: 'UE4管理',
  component: Main,
  children:[

    {//版本管理
      path: 'list',
      title: '版本管理',
      name: 'ue4_manager_edition',
      component: () => {
        return import('@/views/admin/ue4/ue4-list.vue')
      }
    },
    {
      path:'addEdit',
      title:'添加编辑',
      name:'',
      component:()=>{
        return import('@/views/admin/ue4/ue4_addEdit.vue')
      }
    },
    {//场景管理
      path:'spectacle',
      title:'场景管理',
      name:'ue4_manager_spectacle',
      component: () => {
        return import('@/views/admin/ue4/ue4_spectacle.vue')
      }
    },
    {
      path:'spectacle_addEdit',
      title:'',
      name:'',
      component: () => {
        return import('@/views/admin/ue4/ue4_spectacleAddEdit.vue')
      }
    }
  ]
},
{
  path:'/admin/version',
  icon: 'key',
  name: 'version',
  title: '版本管理',
  component: Main,
  children:[
    {//版本管理
      path: 'list',
      title: '版本管理',
      name: 'version_manager_edition',
      component: () => {
        return import('@/views/admin/version/version-list.vue')
      }
    },
    {
      path:'addEdit',
      title:'添加编辑',
      name:'',
      component:()=>{
        return import('@/views/admin/version/version_addEdit.vue')
      }
    },
  ]
},
{//轮播图管理
  path:'/admin/rotation',
  icon: 'key',
  name: 'banner_management',
  title: '轮播图管理',
  component: Main,
  children:[
    {
      path: 'list',
      title: '轮播图列表',
      name: 'banner_management',
      component: () => {
        return import('@/views/admin/rotation/rotation-list.vue')
      }
    },
    {
      path: 'edit',
      title: '轮播图编辑',
      name: '',
      component: () => {
        return import('@/views/admin/rotation/rotation-edit.vue')
      }
    },
 
 
  ]
},
{
  path:'/admin/growth',
  icon: 'key',
  name: 'growth',
  title: '人才成长管理',
  component: Main,
  children:[
    {//版本管理
      path: 'list',
      title: '课程管理',
      name: 'growth_manager_edition',
      component: () => {
        return import('@/views/admin/growth/growth-list.vue')
      }
    },
    {
      path:'addEdit',
      title:'添加编辑',
      name:'',
      component:()=>{
        return import('@/views/admin/growth/growth_addEdit.vue')
      }
    },
    {
      path: 'userList',
      title: '学员管理',
      name: 'user_manager_edition',
      component: () => {
        return import('@/views/admin/growth/user-list.vue')
      }
    },
    {
      path: 'growthMessage',
      title: '公告管理',
      name: 'message_manager_edition',
      component: () => {
        return import('@/views/admin/growth/message.vue')
      }
    },
    {
      path: 'growthUploadUserScore',
      title: '学分上传',
      name: 'upload_manager_edition',
      component: () => {
        return import('@/views/admin/growth/uploadUserScore.vue')
      }
    },
    {
      path: 'growthUploadEnrolled',
      title: '课程报名上传',
      name: 'upload_enroll_manager_edition',
      component: () => {
        return import('@/views/admin/growth/uploadEnrolled.vue')
      }
    },
    {
      path: 'growthScoreList',
      title: '学分记录',
      name: 'growth_score_manager_edition',
      component: () => {
        return import('@/views/admin/growth/score_list.vue')
      }
    },
    {
      path: 'growthSignList',
      title: '签到记录',
      name: 'growth_sign_manager_edition',
      component: () => {
        return import('@/views/admin/growth/sign_list.vue')
      }
    },
  ]
},
{
  path:'/admin/student',
  icon: 'key',
  name: 'student',
  title: '学员管理',
  component: Main,
  children:[
    {
      path: 'list',
      title: '学员管理',
      name: 'student_manager_edition',
      component: () => {
        return import('@/views/admin/student/student_list.vue')
      }
    },
    {
      path:'addEdit',
      title:'添加学员',
      name: 'student_manager_add',
      component: () => {
        return import('@/views/admin/student/student_addEdit.vue')
      }
    },


  ]
},
{
  path: '/loginUserInfo',
  // name: 'home',
  title: '个人信息',
  component: Main,
  children: [{
    path: '/',
    meta: {
      requiresAuth: true
    },
    name: 'loginUserInfo',
    component: () =>
      import('@/views/loginUserInfo.vue')
  }]
},
// 经销商首页
{
  path: '/dealerHome',
  // name: 'dealerHome',
  title: '经销商首页',
  component: Main,
  children: [{
    path: '/',
    meta: {
      requiresAuth: true
    },
    name: 'dealerHome',
    component: () =>
      import('@/views/homePage.vue')
  }]
},
{
  path: '/dealer',
  name: 'dealer',
  title: '经销商管理',
  component: Main,
  children: [
    {
    path: 'info',
    title: '经销商基础信息',
    name: 'dealer_base_info',
    meta: {
      requiresAuth: true
    },
    component: () =>
      import('@/views/dealer/info.vue'),

  },
  {
    path: 'user',
    title: '经销商人员管理',
    name: 'dealer_user_mgr',
    meta: {
      requiresAuth: true
    },

    component: () =>
      import('@/views/dealer/user/user.vue')
  },
  // 新增人员
  {
    path: 'user/edit',
    title: '',
    name: 'dealer_user_edit',
    meta: {
      requiresAuth: true
    },
    component: () =>
      import('@/views/dealer/user/user-edit.vue'),



  },

  {
    path: 'org',
    title: '经销商门店管理',
    name: 'dealer_shop_mgr',
    meta: {
      requiresAuth: true
    },
    component: () =>
      import('@/views/dealer/shop.vue'),

  },
  // 新增门店
  {
    path: 'addOrg',
    title: '经销商门店管理',
    name: '',
    meta: {
      requiresAuth: true
    },
    component: () =>
      import('@/views/dealer/addShop.vue'),

  },
  {
    path: 'role',
    title: '经销商角色管理',
    name: 'dealer_role_mgr',
    meta: {
      requiresAuth: true
    },
    component: () =>
      import('@/views/dealer/role/role-list.vue')
  },
  // 门店
  {
    path: 'list',
    title: '门店管理',
    name: 'dealer_modity_mgr',
    component: () => {
      return import('@/views/dealer/store/store-list.vue')
    }
  },
  {
    path: 'addModity',
    title: '添加商品',
    name: '',
    component: () => {
      return import('@/views/dealer/store/add-modity.vue')
    }
  },
  {
    path: 'editModity',
    title: '编辑商品',
    name: '',
    component: () => {
      return import('@/views/dealer/store/edit-modity.vue')
    }
  },
  {
    path: 'tags',
    title: '门店管理',
    name: '',
    component: () => {
      return import('@/views/dealer/store/store-tags.vue')
    }
  },
  {//导入
    path: 'importModity',
    title: '导入商品',
    name: '',
    component: () => {
      // return import('@/views/dealer/store/components/importModity.vue')
      return import('@/views/dealer/store/components/import-table.vue')
    }

  },
  {//获取打印价格牌list表
    path: 'printList',
    title: '获取打印列表',
    name: '',
    component: () => {
      return import('@/views/dealer/store/components/printList.vue')
    }

  },
  {//打印价格牌
    path: 'printPrice',
    title: '打印价格牌',
    name: '',
    component: () => {
      return import('@/views/dealer/store/components/printPrice.vue')
    }

  },
  {
    path: 'dealerModity',
    title: '商品管理',

    name: 'NEW_MODITY_MANAGER',
    component: () => {
      return import('@/views/dealer/modity/dealerModity.vue')
    }
  },
  {
    path: 'addEditeDealerModity',
    title: '添加编辑商品',
    name: '',
    component: () => {
      return import('@/views/dealer/modity/addEditeModity.vue')
    }
  },
  // 资金管理账号页面
  {
    path: 'moneyManagerInfo',
    title: '添加编辑商品',
    name: 'MONEY_Manager_INFO',
    component: () => {
      return import('@/views/dealer/moneyManager/moneyManager_list.vue')
    }
  },

  ]
},
// 楼盘中心
{
  path: '/dealer/build',
  name: 'dealer_build',
  title: '楼盘中心',
  component: Main,
  children: [
    {
      path: 'building',
      name: 'dealer_build_building_mgr',
      title: '楼盘管理',
      meta: {
        requiresAuth: true
      },
      component: () =>
        import('@/views/dealer/build/building/building.vue')
    },
    {
      path: 'space',
      name: 'dealer_build_space_mgr',
      title: '案例管理',
      meta: {
        requiresAuth: true
      },
      component: () =>
        import('@/views/dealer/build/space/space.vue')
    },
    {
      path: 'model',
      name: 'dealer_build_model_mgr',
      title: '户型管理',
      meta: {
        requiresAuth: true
      },
      component: () =>
        import('@/views/dealer/build/buildingmodel/buildingmodel.vue')
    },
    {
      path: 'programme',
      name: 'dealer_build_programme_mgr',
      title: '整屋方案',
      meta: {
        requiresAuth: true
      },
      component: () =>
        import('@/views/dealer/build/programme/programme.vue')
    },
    {
      path: 'crawlerbuilding',
      name: 'dealer_build_crawler_mgr',
      title: '互联网来源楼盘',
      meta: {
        requiresAuth: true
      },
      component: () =>
        import('@/views/dealer/build/crawlerbuilding/crawlerbuilding.vue')
    }
  ]
},
{
  path:'/admin/license',
  icon: 'key',
  name: 'license',
  title: '许可证号管理',
  component: Main,
  children:[
    {//版本管理
      path: 'list',
      title: '激活码管理',
      name: 'license_manager',
      component: () => {
        return import('@/views/admin/license/licenseQuery.vue')
      }
    }
  ]
},
{
  path:'/admin/course',
  icon: 'key',
  name: 'course',
  title: '教程管理',
  component: Main,
  children:[
    {//教程管理
      path: 'list',
      title: '教程管理',
      name: 'course_manager',
      component: () => {
        return import('@/views/admin/course/courseQuery.vue')
      }
    },
    {
      path:'addEdit',
      title:'添加编辑',
      name:'',
      component:()=>{
        return import('@/views/admin/course/course_addEdit.vue')
      }
    },
    {
      path:'courseIndex',
      title:'教程首页',
      name:'',
      component:()=>{
        return import('@/views/admin/course/guide_index.vue')
      }
    },
    {
      path: 'chapterList',
      title: '章节列表',
      name:'',
      component:()=>{
        return import('@/views/admin/course/guide_list.vue')
      }
    }
  ]
},
{
  path:'/guide',
  icon: 'key',
  name:'guide',
  title:'新手教程',
  component:Main,
  children:[{
    path:'index',
    title:'新手教程',
    component:()=>{
      return import('@/views/guide/guide_index.vue')
    }
  },{
    path:'list',
    title:'指引列表',
    component:()=>{
      return import('@/views/guide/guide_list.vue')
    }
  }]
},
{
  path:'/basic',
  icon: 'key',
  name: 'basic',
  component: Main,
  children: [{
    path: 'data',
    title: '基础数据',
    name: 'basic_data',
    component: ()=>{
      return import('@/views/basicData/basic_data/basic-data-list.vue')
    }
  }]
},
{
  path: '/announcement',
  icon: 'key',
  name: 'announcement',
  component: Main,
  children: [{
    path: 'index',
    title: '公告管理',
    name: 'announcement_manage',
    component: ()=>{
      return import('@/views/announcement/announcement.vue')
    }
  }]
},
{
  path: '/uploadImg',
  name: 'uploadImgs',
  component: Main,
  children: [{
    path: '/uploadImgIndexPc',
    title: '上传实景图',
    name: 'UploadImgIndexPc',
    component: () => {
      return import('@/views/uploadImg/uploadImgIndexPc.vue')
    }
  }, {
    path: '/uploadImgDetailPc',
    title: '详情',
    name: 'UploadImgDetailPc',
    component: () => {
      return import('@/views/uploadImg/uploadImgDetailPc.vue')
    }
  },{
    path: '/editImgPc',
    title: '编辑',
    name: 'EditImgPc',
    component: () => {
      return import('@/views/uploadImg/editImgPc.vue')
    }
  },{
    path: '/sceneImgUpload',
    title: '编辑实景图',
    name: 'SceneImgUpload',
    component: () => {
      return import('@/views/uploadImg/sceneImgNew/sceneImgUpload.vue')
    }
  },{
    path: '/sceneImgManage',
    title: '实景图管理',
    name: 'SceneImgManage',
    component: () => {
      return import('@/views/uploadImg/sceneImgNew/sceneImgManage.vue')
    }
  },{
    path: '/sceneCaseList',
    title: '实景图管理',
    name: 'SceneCaseList',
    component: () => {
      return import('@/views/uploadImg/sceneCase/sceneCaseList.vue')
    }
  },{
    path: '/sceneCaseDetail',
    title: '实景图管理',
    name: 'SceneCaseDetail',
    component: () => {
      return import('@/views/uploadImg/sceneCase/sceneCaseDetail.vue')
    }
  }]
},
{
  path: '/sceneImgReview',
  name: 'SceneImgReview',
  component: Main,
  children: [{
    path: '/sceneImgReviewList',
    title: '实景图评审列表',
    name: 'SceneImgReviewList',
    component: () => {
      return import('@/views/uploadImg/sceneImgReview/sceneImgReviewList.vue')
    },
    meta: {
      keepAlive: true
    }
  },{
    path: '/sceneImgReviewDetail',
    title: '实景图评审',
    name: 'SceneImgReviewDetail',
    component: () => {
      return import('@/views/uploadImg/sceneImgReview/sceneImgReviewdetail.vue')
    }
  }]
},
{
  path: '/order',
  name: 'Order',
  component: Main,
  children: [{
    path: '/orderList',
    title: '订单列表',
    name: 'OrderList',
    component: () => {
      return import('@/views/printOrder/orderList.vue')
    },
    meta: {
      keepAlive: true
    }
  },{
    path: '/editOrder',
    title: '编辑订单',
    name: 'EditOrder',
    component: () => {
      return import('@/views/printOrder/editOrder.vue')
    }
  }]
}
]


const demoRouter = [{
  path: '/demo',
  // name: 'home',
  title: 'demo例子',
  component: Main,
  children: [
    {
    path: 'userURLQuery',
    title: '例子',
    meta: {
      requiresAuth: true
    },
    name: 'userURLQuery',
    component: () =>
      import('@/views/demo/userURLQuery.vue')
  }
]
}]

const uploadImgPcRouter = [{
  path: '/uploadImgEntrancePc',
  title: '封面页',
  name: 'UploadImgEntrancePc',
  component: () => {
    return import('@/views/uploadImg/uploadImgEntrancePc.vue')
  }
}]

const uploadImgRouter = [{
  path: '/uploadImgEntrance',
  title: '封面页',
  name: 'UploadImgEntrance',
  component: () => {
    return import('@/views/uploadImg/uploadImgEntrance.vue')
  }
}, {
  path: '/uploadImgIndex',
  title: '上传实景图',
  name: 'UploadImg',
  component: () => {
    return import('@/views/uploadImg/uploadImgIndex.vue')
  }
},  {
  path: '/uploadImgDetail',
  title: '详情',
  name: 'UploadImgDetail',
  component: () => {
    return import('@/views/uploadImg/uploadImgDetail.vue')
  }
},{
  path: '/editImg',
  title: '编辑',
  name: 'EditImg',
  component: () => {
    return import('@/views/uploadImg/editImg.vue')
  }
},{
    path: '/sceneImgManageMobile',
    title: '实景图管理',
    name: 'SceneImgManageMobile',
    component: () => {
      return import('@/views/uploadImg/sceneImgNew/sceneImgManageMobile.vue')
    }
},{
    path: '/sceneImgDetailMobile',
    title: '实景图管理',
    name: 'SceneImgDetailMobile',
    component: () => {
      return import('@/views/uploadImg/sceneImgNew/sceneImgDetailMobile.vue')
  }
},{
    path: '/sceneImgUploadMobile',
    title: '实景图管理',
    name: 'SceneImgUploadMobile',
    component: () => {
      return import('@/views/uploadImg/sceneImgNew/sceneImgUploadMobile.vue')
  }
}]
const guideRouter = [{
  path: '/steps',
  title: '步骤',
  name: 'Steps',
  component: ()=>{
    return import('@/views/guide_steps.vue')
  }

}]
const courseStepRouter = [{
  path: '/courseSteps',
  title: '步骤',
  name: 'courseSteps',
  component: ()=>{
    return import('@/views/course_steps.vue')
  }

}]
const tvDownload = [{
  path: '/tvDownload',
  title: '步骤',
  name: 'tvDownload',
  component: ()=>{
    return import('@/views/tvDownload.vue')
  },
  meta: {
    requiresAuth: false
  }
}]
const router = new VueRouter({
  routes: [{
    path: '/login',
    name: 'login',
    title: '用户登录',
    component: () =>
      import('@/views/login.vue'),
    meta: {
      requiresAuth: false
    }
  }, {
    path: '/autoLogin',
    name: 'autoLogin',
    title: '用户登录',
    component: () =>
      import('@/views/autoLogin.vue'),
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/',
    icon: 'key',
    name: 'main',
    title: '个人信息',
    redirect: 'loginUserInfo'
  },
  ...appRouter,
  ...demoRouter,
  ...guideRouter,
  ...courseStepRouter,
  ...tvDownload,
  ...uploadImgRouter,
  ...uploadImgPcRouter
  ]
})

// 注册全局钩子用来拦截导航
router.beforeEach((to, from, next) => {
  LoadingBar.start();

  //获取store里面的token
  let token = localStorage.getItem("jwttoken");
  //判断要去的路由有没有requiresAuth
  if (to.meta.requiresAuth) {
    // console.log("需要登录")
    if (token) {
      next();
    } else {
      next({
        path: '/login',
        query: {
          redirect: to.fullPath
        } // 将刚刚要去的路由path（却无权限）作为参数，方便登录成功后直接跳转到该路由
      });
    }
  } else {
    // console.log("不需要登录")
    next(); //如果无需token,那么随它去吧
  }
});


router.afterEach((to, from) => {
  // console.log('LoadingBar finish')
  LoadingBar.finish();
})


export default router;
