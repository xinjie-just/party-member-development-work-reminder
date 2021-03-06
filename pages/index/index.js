//获取应用实例
const app = getApp();

Page({
  data: {
    loading: true,
    isPersonal: true,
    roleName: '',
    userName: '',
    idRole: null,
    roles: [],
    roleTotal: 0,
    todoList: [],
    todoTotal: 0,
    selectedId: null,
    stages: [],
    selectedIdStage: null,
    idUser: null,
    phoneNum: null,
    allNodeStateInfo: [],
    currentStageInfo: [],
    activeSteps: [], // 处于进行中的步骤的idNode的集合
  },

  onLoad: function () {
    this.setData({
      loading: true,
    });
    const userOtherInfo = wx.getStorageSync('userOtherInfo');
    // console.log('用户信息', userOtherInfo);

    if (userOtherInfo) {
      const idRole = userOtherInfo.idRole;
      const userName = userOtherInfo.realName || userOtherInfo.nickName;
      const idUser = userOtherInfo.idUser;
      const phoneNum = userOtherInfo.phoneNum;

      this.setData({
        idRole,
        userName,
        idUser,
        phoneNum,
      });
    }

    const token = wx.getStorageSync('token');
    if (token) {
      if (!this.data.idRole) {
        // 没有角色的不算个人
        this.setData({
          isPersonal: false,
          loading: false,
        });
        this.getTodoList();
      } else {
        this.getAllRole();
      }
    } else {
      // wx.showToast({
      //   title: '登录已过期或未登录',
      //   duration: 2000,
      //   icon: 'none',
      // });
      // setTimeout(() => {
      wx.redirectTo({
        url: '/pages/wechat-login/wechat-login',
      });
      // }, 2000);
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const token = wx.getStorageSync('token');
    if (token) {
      if (this.data.isPersonal) {
        this.queryPersonAllNodeState();
      } else {
        this.getTodoList();
      }
    }
    if (this.data.selectedId) {
      this.setData({
        selectedId: null,
      });
    }
  },

  // 获取所有角色
  getAllRole() {
    let that = this;
    wx.request({
      url: `${app.globalData.hostname}/role/getPage`,
      data: {
        pageNo: 1,
        pageSize: 999,
      },
      header: {
        accessSide: 'weixin',
        Authorization: wx.getStorageSync('token'),
      },
      success(res) {
        const info = res.data;
        if (info.code === 200) {
          that.setData({
            roles: info.data.page.records,
            roleTotal: info.data.page.total,
          });
          const roleTotal = that.data.roleTotal;
          if (!!roleTotal) {
            for (let i = 0; i < roleTotal; i++) {
              const item = that.data.roles[i];
              if (item.idRole === that.data.idRole) {
                if (item.roleName === '个人') {
                  that.setData({
                    isPersonal: true,
                  });
                  that.queryPersonAllNodeState();
                } else {
                  that.setData({
                    isPersonal: false,
                  });
                  that.getTodoList();
                }
                break; // 登录进来的用户的角色在全部角色中已经匹配到了自己的身份
              } else {
                continue;
              }
            }
          }
        } else if (info.code === 401) {
          wx.showToast({
            title: '登录已过期或未登录',
            duration: 2000,
            icon: 'none',
          });
          setTimeout(() => {
            wx.redirectTo({
              url: '/pages/wechat-login/wechat-login',
            });
          }, 2000);
        } else {
          that.setData({
            roles: [],
            roleTotal: 0,
          });
          wx.showToast({
            title: info.message || '角色信息列表失败',
            icon: 'none',
            duration: 3000,
          });
        }
      },
      fail(res) {
        wx.showToast({
          title: '待办事项获取失败！' + res.error,
          icon: 'none',
          duration: 2000,
        });
      },
      complete() {
        that.setData({
          loading: false,
        });
      },
    });
  },

  // 获取待办事项
  getTodoList() {
    let that = this;
    wx.request({
      url: `${app.globalData.hostname}/miniProgram/queryUserToDoBusiness`,
      data: {
        pageNo: 1,
        pageSize: 10,
      },
      header: {
        accessSide: 'weixin',
        Authorization: wx.getStorageSync('token'),
      },
      success(res) {
        const info = res.data;
        // console.log('待办事项', info.data);
        if (info.code === 200) {
          that.setData({
            todoList: info.data.page.records,
            todoTotal: info.data.page.total,
          });
          const activeSteps = that.data.activeSteps;
          const activeStepsLen = activeSteps.length;
          const todoList = that.data.todoList;
          const todoListLen = todoList.length;
          let allNodeStateInfo = that.data.allNodeStateInfo;
          // allNodeStateInfo
          for (let i = 0; i < activeStepsLen; i++) {
            for (let j = 0; j < todoListLen; j++) {
              if (activeSteps[i].idNode === todoList[j].idNode) {
                const index = activeSteps[i]['stepIndex'];
                allNodeStateInfo[index - 1]['hasTodoItem'] = true;
                allNodeStateInfo[index - 1]['todoItem'] = todoList[j];
                break;
              }
            }
          }
          that.setData({
            allNodeStateInfo,
          });
        } else if (info.code === 401) {
          wx.showToast({
            title: '登录已过期或未登录',
            duration: 2000,
            icon: 'none',
          });
          setTimeout(() => {
            wx.redirectTo({
              url: '/pages/wechat-login/wechat-login',
            });
          }, 2000);
        } else {
          that.setData({
            todoList: [],
            todoTotal: 0,
          });
          wx.showToast({
            title: info.message || '待办事项获取失败',
            icon: 'none',
            duration: 3000,
          });
        }
      },
      fail(res) {
        wx.showToast({
          title: '待办事项获取失败！' + res.error,
          icon: 'none',
          duration: 2000,
        });
      },
    });
  },
  selectTodoItem(e) {
    // console.log('evt111', e);
    this.setData({
      selectedId: e.currentTarget.dataset.id,
    });
  },

  // 处理代办事项
  handleItem() {
    if (!this.data.selectedId) {
      wx.showToast({
        title: '请先选择一项代办事项',
        duration: 2000,
        icon: 'none',
      });
      return;
    }
    // console.log('selectedId', this.data.selectedId);
    const selectedId = this.data.selectedId;

    wx.navigateTo({
      url: `/pages/index/detail/detail?id=${selectedId}`,
    });
  },

  // 个人页面处理代办事项
  personalHandleItem(evt) {
    // console.log('个人页面evt', evt);
    const { handleItem } = evt.currentTarget.dataset;
    if (handleItem) {
      const id = handleItem.id;
      wx.navigateTo({
        url: `/pages/index/detail/detail?id=${id}`,
      });
    } else {
      wx.showToast({
        title: `数据有误！${evt.currentTarget.dataset}`,
        duration: 3000,
        icon: 'none',
      });
    }
  },

  //查询所有阶段
  queryAllStage() {
    let that = this;
    wx.request({
      url: `${app.globalData.hostname}/stageNode/queryAllStage`,
      header: {
        accessSide: 'weixin',
        Authorization: wx.getStorageSync('token'),
      },
      success(res) {
        const info = res.data;
        // console.log('所有阶段', info.data);
        if (info.code === 200) {
          const stages = info.data.map((item) => {
            let formatStageName = '';
            if (item.stageName.includes('：')) {
              const index = item.stageName.indexOf('：');
              formatStageName = item.stageName.substring(index + 1);
            } else {
              formatStageName = item.stageName;
            }
            return {
              ...item,
              formatStageName,
            };
          });
          that.setData({
            stages,
            selectedIdStage: stages.length ? stages[0].idStage : null, //默认第一个阶段被选择
          });
          if (that.data.selectedIdStage) {
            that.getStepStateInfo(); // 设置默认的阶段后，去获取下面的步骤和状态信息
          }
        } else if (info.code === 401) {
          wx.showToast({
            title: '登录已过期或未登录',
            duration: 2000,
            icon: 'none',
          });
          setTimeout(() => {
            wx.redirectTo({
              url: '/pages/wechat-login/wechat-login',
            });
          }, 2000);
        } else {
          that.setData({
            stages: [],
          });
          wx.showToast({
            title: info.message || '查询所有阶段失败',
            icon: 'none',
            duration: 3000,
          });
        }
      },
      fail(res) {
        wx.showToast({
          title: '查询所有阶段失败！' + res.error,
          icon: 'none',
          duration: 2000,
        });
      },
    });
  },

  //查询个人用户所有节点状态
  queryPersonAllNodeState() {
    let that = this;
    wx.request({
      url: `${app.globalData.hostname}/miniProgram/queryPersonAllNodeState`,
      data: {
        idUser: this.data.idUser,
      },
      header: {
        accessSide: 'weixin',
        Authorization: wx.getStorageSync('token'),
      },
      success(res) {
        const info = res.data;
        // console.log('所有节点状态', info.data);
        if (info.code === 200) {
          const activeSteps = [];
          const allNodeStateInfo = info.data.map((item, index) => {
            return {
              ...item,
              stepIndex: index + 1,
              hasTodoItem: false,
              todoItem: null,
            };
          });
          allNodeStateInfo.forEach((value) => {
            if (value.nodeState === 0) {
              // 该节点状态为进行中
              activeSteps.push({
                stepIndex: value.stepIndex,
                idNode: value.idNode,
              });
            }
          });
          that.setData({
            allNodeStateInfo,
            activeSteps,
          });
          that.queryAllStage();
          if (that.data.activeSteps.length) {
            //假如有处于进行中的步骤，则去获取待办事项，如果待办事项的 idNode 和 activeSteps 中的 idNode 相等，则显示办理
            that.getTodoList();
          }
        } else if (info.code === 401) {
          wx.showToast({
            title: '登录已过期或未登录',
            duration: 2000,
            icon: 'none',
          });
          setTimeout(() => {
            wx.redirectTo({
              url: '/pages/wechat-login/wechat-login',
            });
          }, 2000);
        } else {
          that.setData({
            allNodeStateInfo: [],
          });
          wx.showToast({
            title: info.message || '查询个人用户所有节点状态失败',
            icon: 'none',
            duration: 3000,
          });
        }
      },
      fail(res) {
        wx.showToast({
          title: '查询个人用户所有节点状态失败！' + res.error,
          icon: 'none',
          duration: 2000,
        });
      },
    });
  },

  // 选择某一个阶段
  selectProcessItem(e) {
    // console.log('选择的对象', e.currentTarget.dataset);
    const selectedIdStage = e.currentTarget.dataset.id;
    this.setData({
      selectedIdStage,
    });
    this.getStepStateInfo();
  },

  // 个人用户所有节点状态去匹配当前的步骤
  getStepStateInfo() {
    let currentStageInfo = [];
    this.data.allNodeStateInfo.map((item) => {
      if (this.data.selectedIdStage === item.idStage) {
        currentStageInfo.push(item);
      }
    });
    this.setData({
      currentStageInfo,
    });
  },
});
