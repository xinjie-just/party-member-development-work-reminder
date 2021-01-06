// pages/mine/mine.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName: '',
    phone: ''
  },

  subscribeRemind() {
    wx.redirectTo({
      url: './subscribe-remind/subscribe-remind',
    });
  },

  changePassword() {
    wx.redirectTo({
      url: './change-password/change-password',
    });
  },

  logout() {
    wx.request({
      url: `${app.globalData.hostname}/user/logout`,
      header: {
        accessSide: "weixin",
        Authorization: wx.getStorageSync("token")
      },
      success(value) {
        const info = value.data;
        if (info.code === 200) {
          wx.clearStorageSync()
          wx.showToast({
            title: '账户退出成功！',
            icon: "none",
            duration: 2000
          });
          wx.redirectTo({
            url: '../wechat-login/wechat-login',
          });
        } else if (info.code === 401) {
          wx.showToast({
            title: '登录已过期或未登录',
            duration: 2000,
            icon: "none"
          });
          wx.redirectTo({
            url: '../wechat-login/wechat-login',
          })
        } else {
          wx.showToast({
            title: '退出失败！' + info.message,
            icon: "none",
            duration: 2000
          });
        }
      },
      fail(res) {
        wx.showToast({
          title: res.error,
          icon: "none",
          duration: 2000
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const storageUserInfo = wx.getStorageSync('userInfo');
    this.setData({
      userName: storageUserInfo.realName || storageUserInfo.nickName,
      phone: storageUserInfo.phoneNum
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