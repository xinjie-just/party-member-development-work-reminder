// pages/index/process/process.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    stages: [],
    selectedIdStage: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.queryAllStage();
  },

  // /miniProgram/queryPersonAllNodeState 查询个人用户所有节点状态

  //查询所有阶段/stageNode/queryAllStage
  queryAllStage() {
    let that = this;
    wx.request({
      url: `${app.globalData.hostname}/stageNode/queryAllStage`,
      header: {
        accessSide: "weixin"
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
            stages
          });
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
    // idStage e.currentTarget.dataset.id
    console.log("选择的对象", e.currentTarget.dataset);
    const selectedIdStage = e.currentTarget.dataset.id
    this.setData({
      selectedIdStage
    });
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