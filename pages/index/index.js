//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    loading: true,
    isPersonal: true,
    roleName: '',
    userName: '',
    roleId: null,
    roles: [],
    roleTotal: 0,
    stages: [],
    selectedIdStage: null,
    idUser: null,
    phoneNum: null,
    allNodeStateInfo: [],
    currentStageInfo: []
  },
  
  onLoad: function () {
    this.setData({
      loading: true
    });
    const storageUserInfo = wx.getStorageSync('userInfo');
    const storageUserOtherInfo = wx.getStorageSync('userOtherInfo');
    console.log("通过openid获取到的用户信息", storageUserOtherInfo);

    let roleId = null;
    let userName = '';
    let idUser = null;
    let phoneNum = '';
    if (storageUserInfo) {
      roleId = storageUserInfo.roleId;
      userName = storageUserInfo.realName || storageUserInfo.nickName;
      idUser = storageUserInfo.idUser;
      phoneNum = storageUserInfo.phoneNum;
    } else if (storageUserOtherInfo) {
      roleId = storageUserOtherInfo.roleId;
      userName = storageUserOtherInfo.realName || storageUserOtherInfo.nickName;
      idUser = storageUserOtherInfo.idUser;
      phoneNum = storageUserOtherInfo.phoneNum;
    }
    this.setData({
      roleId,
      userName,
      idUser,
      phoneNum
    });

    const openid = wx.getStorageSync('openid');
    if (openid) {
      if (!this.data.roleId) { // 没有角色的不算个人
        this.setData({
          isPersonal: false,
          loading: false
        });
        this.getTodoList();
      } else {
        this.getAllRole();
      }
    } else {
      wx.showToast({
        title: '登录已过期或未登录',
        duration: 2000,
        icon: "none"
      });
      setTimeout(() => {
        wx.redirectTo({
          url: '../wechat-login/wechat-login',
        })
      }, 2000);
    }
  },

  getAllRole() {
    let that = this;
    wx.request({
      url: `${app.globalData.hostname}/role/getPage`,
      data: {
        pageNo: 1,
        pageSize: 99
      },
      header: {
        accessSide: "weixin",
        Authorization: wx.getStorageSync("token")
      },
      success(res) {
        const info = res.data;
        if (info.code === 200) {
          that.setData({
            roles: info.data.page.records,
            roleTotal: info.data.page.total
          });
          that.data.roles.map(item => {
            if (item.idRole === that.data.roleId) {
              if (item.roleName === '个人') {
                that.setData({
                  isPersonal: true
                });
                that.queryAllStage();
                that.queryPersonAllNodeState();
                return;
              } else {
                that.setData({
                  isPersonal: false
                });
              }
            }
          });
        } else if (info.code === 401) {
          wx.showToast({
            title: '登录已过期或未登录',
            duration: 2000,
            icon: "none"
          });
          setTimeout(() => {
            wx.redirectTo({
              url: '../wechat-login/wechat-login',
            })
          }, 2000);
        } else {
          that.setData({
            roles: [],
            roleTotal: 0
          });
          wx.showToast({
            title: info.message || '角色信息列表失败',
            icon: "none",
            duration: 3000
          });
        }
      },
      fail(res) {
        wx.showToast({
          title: '待办事项获取失败！'+ res.error,
          icon: "none",
          duration: 2000
        })
      },
      complete() {
        that.setData({
          loading: false
        })
      }
    })
  },

  getTodoList() {
    let that = this;
    wx.request({
      url: `${app.globalData.hostname}/miniProgram/queryUserToDoBusiness`,
      data: {
        pageNo: 1,
        pageSize: 10
      },
      header: {
        accessSide: "weixin",
        Authorization: wx.getStorageSync("token")
      },
      success(res) {
        const info = res.data;
        console.log("待办事项", info.data);
        if (info.code === 200) {
          that.setData({
            todoList: info.data.page.records,
            total: info.data.page.total
          });
        } else if (info.code === 401) {
          wx.showToast({
            title: '登录已过期或未登录',
            duration: 2000,
            icon: "none"
          });
          setTimeout(() => {
            wx.redirectTo({
              url: '../wechat-login/wechat-login',
            })
          }, 2000);
        } else {
          that.setData({
            todoList: [],
            total: 0
          });
          wx.showToast({
            title: info.message || '待办事项获取失败',
            icon: "none",
            duration: 3000
          });
        }
      },
      fail(res) {
        wx.showToast({
          title: '待办事项获取失败！'+ res.error,
          icon: "none",
          duration: 2000
        })
      }
    })
  },
  selectTodoItem(e) {
    console.log("evt111", e);
    this.setData({
      selectedId: e.currentTarget.dataset.id
    });
  },
  handleItem() {
    if(!this.data.selectedId) return;
    console.log("selectedId",this.data.selectedId);
    const selectedId = this.data.selectedId;
    let realName = '';
    let nodeName = '';
    if (this.data.todoList) {
      this.data.todoList.forEach(item => {
        if(item.id === selectedId) {
          realName = item.realName;
          nodeName = item.nodeName;
        }
      })
    }
    wx.navigateTo({
      url: `./detail/detail?id=${selectedId}&realName=${realName}&nodeName=${nodeName}`,
    })
  },

  //查询所有阶段
  queryAllStage() {
    let that = this;
    wx.request({
      url: `${app.globalData.hostname}/stageNode/queryAllStage`,
      header: {
        accessSide: "weixin",
        Authorization: wx.getStorageSync("token")
      },
      success(res) {
        const info = res.data;
        console.log("所有阶段", info.data);
        if (info.code === 200) {
          const stages = info.data.map(item => {
            let formatStageName = '';
            if (item.stageName.includes("：")) {
              const index = item.stageName.indexOf("：");
              formatStageName = item.stageName.substring(index + 1);
            }
            return {
              ...item,
              formatStageName
            }
          })
          that.setData({
            stages,
            selectedIdStage: stages.length ? stages[0].idStage : null //默认第一个阶段被选择
          });
          if (that.data.selectedIdStage) {
            that.getStepStateInfo(); // 设置默认的阶段后，去获取下面的步骤和状态信息
          }
        } else if (info.code === 401) {
          wx.showToast({
            title: '登录已过期或未登录',
            duration: 2000,
            icon: "none"
          });
          setTimeout(() => {
            wx.redirectTo({
              url: '../../wechat-login/wechat-login',
            })
          }, 2000);
        } else {
          that.setData({
            stages: [],
          });
          wx.showToast({
            title: info.message || '查询所有阶段失败',
            icon: "none",
            duration: 3000
          });
        }
      },
      fail(res) {
        wx.showToast({
          title: '查询所有阶段失败！'+ res.error,
          icon: "none",
          duration: 2000
        })
      }
    })
  },

  // 选择某一个阶段
  selectProcessItem(e) {
    console.log("选择的对象", e.currentTarget.dataset);
    const selectedIdStage = e.currentTarget.dataset.id
    this.setData({
      selectedIdStage
    });
    this.getStepStateInfo();
  },

  //查询个人用户所有节点状态
  queryPersonAllNodeState() {
    let that = this;
    wx.request({
      url: `${app.globalData.hostname}/miniProgram/queryPersonAllNodeState`,
      data: {
        idUser: this.data.idUser
      },
      header: {
        accessSide: "weixin",
        Authorization: wx.getStorageSync("token")
      },
      success(res) {
        const info = res.data;
        console.log("所有节点状态", info.data);
        if (info.code === 200) {
          that.setData({
            allNodeStateInfo: info.data,
          });
        } else if (info.code === 401) {
          wx.showToast({
            title: '登录已过期或未登录',
            duration: 2000,
            icon: "none"
          });
          setTimeout(() => {
            wx.redirectTo({
              url: '../../wechat-login/wechat-login',
            })
          }, 2000);
        } else {
          that.setData({
            allNodeStateInfo: [],
          });
          wx.showToast({
            title: info.message || '查询个人用户所有节点状态失败',
            icon: "none",
            duration: 3000
          });
        }
      },
      fail(res) {
        wx.showToast({
          title: '查询个人用户所有节点状态失败！'+ res.error,
          icon: "none",
          duration: 2000
        })
      }
    })
  },

  // 个人用户所有节点状态去匹配当前的步骤
  getStepStateInfo() {
    let currentStageInfo = [];
    this.data.allNodeStateInfo.map(item => {
      if (this.data.selectedIdStage === item.idStage) {
        currentStageInfo.push(item);
      }
    });
    this.setData({
      currentStageInfo
    })
  }
})
