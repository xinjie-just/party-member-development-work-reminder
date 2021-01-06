// pages/index/process/process.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    stages: [],
    selectedIdStage: null,
    idUser: null,
    phoneNum: null,
    allNodeStateInfo: [],
    currentStageInfo: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const userOtherInfo = wx.getStorageSync("userOtherInfo");
    this.setData({
      idUser: userOtherInfo.idUser,
      phoneNum: userOtherInfo.phoneNum
    })
    console.log("通过openid获取到的用户信息", userOtherInfo);
    this.queryAllStage();
    this.queryPersonAllNodeState();
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
          wx.redirectTo({
            url: '../../wechat-login/wechat-login',
          })
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
          wx.redirectTo({
            url: '../../wechat-login/wechat-login',
          })
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
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})