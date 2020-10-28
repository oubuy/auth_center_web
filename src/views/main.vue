<template>
    <div class="layout">
    <Layout>
        <Header>
            <div class="layout-logo">
                <img src="../assets/banner.png"></div>
                <div class="layout-nav">
                  <!-- <span style="padding-right: 20px;cursor:pointer;" @click="goToNewGuide">教程</span> -->
                  <span style="padding-right: 20px;cursor:pointer;" @click="goToGuide">新手教程</span>
                    <span>登录用户：{{loginUser}}</span>
                    <!-- <span><Button @click="logout()" style="color:rgb(255,255,255)" type="text">注销</Button></span> -->
                    <span>
                        <Dropdown style="margin-left:20px;" trigger="click"  @on-click="dropdownMenuClick">
                            <a href="javascript:void(0)" style="color:rgb(255,255,255);">
                                设置
                                <Icon type="ios-arrow-down"></Icon>
                            </a>
                            <DropdownMenu slot="list">
                                <DropdownItem name="userInfo">个人信息</DropdownItem>
                                <DropdownItem name="changePassword">修改密码</DropdownItem>
                                <Modal v-model="modalChangePassword" title="修改密码" footer-hide>
                                    <change-password @is_modal_visible="modalChangePassword = $event" ref="refChangePassword"></change-password>
                                </Modal>
                                <DropdownItem name="logout">注销</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </span>
                </div>
        </Header>
        <Layout ref="contextLayout" :style="{height: contextHeight}">
            <Sider collapsible="collapsible" :hide-trigger="true" :collapsed-width="70" v-model="isCollapsed" :style="{background: '#fff'}">
                <Menu ref="side_menu" v-show="!isCollapsed" :active-name="activeName" theme="light" width="auto" :accordion="false" :open-names="openNames" @on-select="changeMenu">
                    <template v-for="item in menus">
                        <template v-if="item.children===undefined || item.children.length===0">
                            <MenuItem :name="item.code">
                            <Icon :type="item.icon"></Icon>
                            <span>{{ item.title}}</span>
                            </MenuItem>
                        </template>
                        <Submenu v-if="item.children && item.children.length >= 1" :name="item.code">
                            <template slot="title">
                                <Icon :type="item.icon"></Icon>
                                <span>{{ item.title}}</span>
                            </template>
                            <template v-for="child in item.children">
                                <MenuItem v-if="child.openType==0 || child.openType==undefined" :name="child.code" :key="'menuitem' + child.code">
                                <Icon :type="child.icon" :key="'icon' + child.code"></Icon>
                                <span :key="'title' + child.code">{{child.title }}</span>
                                </MenuItem>
                                <MenuItem v-if="child.openType==1" :name="child.url" :key="'menuitem' + child.code">
                                <Icon :type="child.icon" :key="'icon' + child.code"></Icon>
                                <span :key="'title' + child.code">{{child.title }}</span>
                                </MenuItem>
                            </template>
                        </Submenu>
                    </template>
                </Menu>

                <div v-show="isCollapsed">
                    <template v-for="item in menus">
                        <Dropdown transfer="transfer" v-if="item.children===undefined || item.children.length===0" placement="right-start" @on-click="changeMenu">
                            <Button style="width: 70px;margin-left: -5px;padding:10px 0;" type="text" @click="changeMenu(item.code)">
                                    <Icon :size="20" :type="item.icon"></Icon>
                                </Button>
                            <DropdownMenu style="width: 200px;" slot="list">
                                <DropdownItem :name="item.code">
                                    <Icon :type="item.icon"></Icon>
                                    <span style="padding-left:10px;">{{item.title}}</span>
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                        <Dropdown transfer="transfer" v-if="item.children && item.children.length>=1" placement="right-start" @on-click="changeMenu">
                            <Button style="width: 70px;margin-left: -5px;padding:10px 0;" type="text">
                                    <Icon :size="20" :type="item.icon"></Icon>
                                </Button>
                            <DropdownMenu style="width: 200px;" slot="list">
                                <template v-for="(child, i) in item.children">
                                    <DropdownItem :name="child.code">
                                        <Icon :type="child.icon"></Icon>
                                        <span style="padding-left:10px;">{{child.title}}</span>
                                    </DropdownItem>
                                </template>
                            </DropdownMenu>
                        </Dropdown>
                    </template>
                </div>
            </Sider>
            <Layout :style="{padding: '0 10px 10px'}">
                <Row>
                    <Col span="1">
                    <Icon @click.native="collapsedSider" :class="rotateIcon" :style="{margin: '10px 20px 0 0'}" type="md-menu" size="24"></Icon>
                    </Col>
                    <Col span="23">
                    <Breadcrumb :style="{margin: '12px 0', textAlign: 'left'}">
                        <BreadcrumbItem v-for="bread in breadcrumbs" :key="bread.key">{{bread.name}}</BreadcrumbItem>
                    </Breadcrumb>
                    </Col>
                </Row>
                <!-- 请勿更改ID值：main-content -->
                <Content id="main-content" :style="{padding: '16px', background: '#fff', overflow: 'auto'}">
                    <router-view></router-view>
                </Content>
            </Layout>
        </Layout>
    </Layout>
        <Modal width="700px" v-model="announce" footer-hide scrollable>
            <div class="modal-box">
                <div style="border-radius: 33px;width: 100%;height: 130px;"><img src="@/assets/public.png" style="width: 100%;height:100%;"></div>
                <div class="announce-content">
                    <div class="announce-title">{{announceContent.name}}</div>
                    <div class="announce-details"><pre>{{announceContent.content}}</pre></div>
                    <div class="announce-date">{{announceContent.date}}</div>
                </div>
                <div class="announce-button" @click="announce=false">关闭</div>
            </div>
        </Modal>
    </div>
</template>

<script>
// import axios from 'axios'
// import axios from '@/api/axios'
import {
    getMenu,
    getLoginInfo,
    getJukebaoToken
} from "@/api/api.js";
import {getByChannel} from "@/api/announcement.js"
import {
    mapState,
    mapGetters,
    mapActions
} from "vuex";
import changePassword from "./changePassword";
import {
    Base64
} from 'js-base64';

export default {
    components: {
        changePassword
    },
    data() {
        return {
            modalChangePassword: false,
            isCollapsed: false,
            contextHeight: "800px",
            menus: [],
            path: "",
            announce: false,
            announceContent: {}
        };
    },
    computed: {
        ...mapGetters(['userInfo']),
        activeName() {
            return this.$route.name;
        },
        openNames() {
            let opens = [];
            let activeName = this.activeName;
            if (this.menus) {
                for (let i = 0; i < this.menus.length; i++) {
                    for (let j = 0; j < this.menus[i].children.length; j++) {
                        if (this.menus[i].children[j].code === activeName) {
                            opens.push(this.menus[i].code);
                            break;
                        }
                    }
                    if (opens.length > 0) break;
                }
            }
            return opens;
        },
        loginUser() {
            // return this.$store.state.user.loginInfo.realName;
            return this.$store.getters.loginInfo.realName;
        },
        breadcrumbs() {
            return this.$store.getters.breadcrumbs;
            // return this.$store.state.app.breadcrumbs;
        },
        rotateIcon() {
            return ["menu-icon", this.isCollapsed ? "rotate-icon" : ""];
        },
        menuitemClasses() {
            return ["menu-item", this.isCollapsed ? "collapsed-menu" : ""];
        }
    },

    methods: {
        ...mapActions(['updateParams']),

        dropdownMenuClick(name) {
            if (name === 'logout') {
                this.logout();
            } else if (name === 'userInfo') {
                this.$router.push({
                    name: "loginUserInfo"
                });
            } else if (name === 'changePassword') {
                this.$refs.refChangePassword.handleReset("formChangePassword");
                this.modalChangePassword = true;
            }
        },
        changeMenu(active) {
            console.log('active:',active)
            if(active.indexOf("JuKeBao")==0){
                console.log('新窗口打开：',active)                
                getJukebaoToken().then(res => {
                    console.log(res,'jukebaoToken')
                    let url = res.data.data;
                    window.open(url); 
                });
            }else if(active.indexOf("http")==0){
                window.open(active); 
            }else{
                this.$router.push({
                    name: active,

                });
            }
        },
        collapsedSider() {
            this.isCollapsed = !this.isCollapsed;
        },
        loadMenus() {
            getMenu({
                applyFrame: 1
            }).then(res => {
                // console.log(res,'菜单')
                this.menus = res.data.data;
                console.log('menus:',this.menus)
                //改变菜单选中状态
                this.updateMenuStatus();
            });
        },
        updateMenuStatus() {
            this.$nextTick(() => {
                this.$refs.side_menu.updateOpened()
                this.$refs.side_menu.updateActiveName()
            })
        },
        logout() {
            // console.log("logout")
            this.$store.dispatch('logout');
            localStorage.removeItem("jwttoken");
            localStorage.removeItem("loginInfo");
            this.$router.push({
                name: "login"
            });
        },
        goToGuide() {
            this.$router.push({
                path:'/guide/index'
            })
        },
        goToNewGuide() {
          this.$router.push({
              path:'/admin/course/courseIndex'
          })
        },
        getByChannel() {
            let param ={};
            param.channel = "中台";
            getByChannel(param).then(res=>{
                console.log(res);
                if(res.data.code==200) {
                    if(res.data.data) {
                        this.announce = true;
                        this.announceContent.name = res.data.data.name;
                        this.announceContent.content = res.data.data.content;
                        this.announceContent.date = res.data.data.updateTime;
                        this.announceContent.date = this.announceContent.date.substr(0,11);
        }
                }
            })
        }
    },
    mounted() {
        // 设置内容区域高度
        let ch = window.innerHeight - this.$refs.contextLayout.$el.offsetTop - 5;
        //  console.log('ch: ' + ch)
        this.contextHeight = ch + "px";
        document.getElementsByClassName("modal-box")[0].parentNode.style.padding="0 0 30px";
        document.getElementsByClassName("modal-box")[0].parentNode.parentNode.style.borderRadius="33px";
        document.getElementsByClassName("modal-box")[0].parentNode.parentNode.childNodes[0].style.display='none';
        let announceFlag = this.$route.params.announceFlag || this.$route.query.announceFlag
        // console.log('announceFlag:',announceFlag)
        if(announceFlag) {
            this.getByChannel();
            window.name = "opened";
        }
        if(!window.name) {
            this.getByChannel();
            window.name = "opened";
        }
    },
    beforeCreate() {
        let token = localStorage.getItem("jwttoken");
        let loginInfo = localStorage.getItem("loginInfo");
        //解析token载荷
        //if (token && !loginInfo) {
        if (token) {
            let payload = JSON.parse(Base64.decode(token.split(".")[1]));
            // console.log(payload,'payload');
            let loginInfo = {
                username: payload.username,
                realName: payload.realName,
                userId: payload.userId,
                comId: payload.comId,
                comName: payload.comName,
                orgId: payload.orgId,
                orgName: payload.orgName,
                reportTo: payload.reportTo
            }
            this.$store.dispatch("setLoginInfo", loginInfo);
            localStorage.setItem("loginInfo", JSON.stringify(loginInfo));
        }
    },
    created() {
        //加载菜单
        this.loadMenus();
        //设置登录信息
        // getLoginInfo().then(res => {
        //   console.log(res.data.data, "main.vue-created");
        //   if (res.data.code === 200) {
        //     this.$store.dispatch("setLoginInfo", res.data.data);
        //   }
        // });
        if(this.announce=="true") this.announce=true;
        else if(this.announce=="false")this.announce=false;
    },

};
</script>

<style scoped>
    .layout {
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
    }

    .layout-logo {
    width: 106px;
    height: 50px;
    border-radius: 3px;
    float: left;
    position: relative;
    top: 10px;
    left: 20px;
    }

    .layout-nav {
        /* width: 300px; */
        display: flex;
        justify-content: flex-end;
    margin: 0 auto;
    margin-right: 20px;
    color: rgb(255, 255, 255);
    }

    .menu-icon {
    transition: all 0.3s;
    }

    .rotate-icon {
    transform: rotate(-90deg);
    }

    .menu-item span {
    display: inline-block;
    overflow: hidden;
    width: 69px;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: bottom;
    transition: width 0.2s ease 0.2s;
    }

    .menu-item i {
    transform: translateX(0px);
    transition: font-size 0.2s ease, transform 0.2s ease;
    vertical-align: middle;
    font-size: 16px;
    }

    .collapsed-menu span {
    width: 0px;
    transition: width 0.2s ease;
    }

    .collapsed-menu i {
    transform: translateX(5px);
    transition: font-size 0.2s ease 0.2s, transform 0.2s ease 0.2s;
    vertical-align: middle;
    font-size: 22px;
    }

    .announce-content{
        font-size: 16px;
        /* font-family: "SimHei"; */
        color: #4f546c;
    }

    .announce-title{
        text-align: center;
        font-size: 24px;
        margin-top: 30px;
    }

    .announce-details{
        height: 360px;
        word-wrap: break-word;
        overflow-y: auto;
        padding: 20px;
        line-height: 30px;
    }

    .announce-details::-webkit-scrollbar {
        display:none;
      }

    .announce-date{
        text-align: right;
        padding: 0 20px 20px;
        margin-top: 20px;
    }

    .announce-button{
        width: 90px;
        height: 32px;
        border-radius: 10px;
        color: #fff;
        text-align: center;
        line-height: 32px;
        background: #516091;
        font-size: 14px;
        margin: 0 auto;
        cursor: pointer;
    }
</style>
