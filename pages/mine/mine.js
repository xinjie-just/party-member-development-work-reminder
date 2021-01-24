const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userName: '',
    phone: '',
    dialogShow: false,
  },

  subscribeRemind() {
    wx.navigateTo({
      url: '/pages/mine/subscribe-remind/subscribe-remind',
    });
  },

  changePassword() {
    wx.navigateTo({
      url: '/pages/mine/change-password/change-password',
    });
  },

  logout() {
    this.setData({
      dialogShow: true,
    });
  },

  tapDialogButton(e) {
    const { index, item } = e.detail;
    this.setData({
      dialogShow: false,
    });
    if (index === 1 || item.text === '确认') {
      // 确认
      wx.request({
        url: `${app.globalData.hostname}/user/logout`,
        header: {
          accessSide: 'weixin',
          Authorization: wx.getStorageSync('token'),
        },
        success(value) {
          const info = value.data;
          if (info.code === 200) {
            wx.clearStorageSync();
            app.globalData.userInfo = null;
            wx.showToast({
              title: '退出成功',
              icon: 'success',
              duration: 2000,
            });
            wx.redirectTo({
              url: '/pages/wechat-login/wechat-login',
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
            wx.showToast({
              title: '退出失败！' + info.message,
              icon: 'none',
              duration: 2000,
            });
          }
        },
        fail(res) {
          wx.showToast({
            title: res.error,
            icon: 'none',
            duration: 2000,
          });
        },
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const storageUserInfo = wx.getStorageSync('userInfo');
    const storageUserOtherInfo = wx.getStorageSync('userOtherInfo');
    this.setData({
      userName: storageUserInfo.realName || storageUserInfo.nickName,
      phone: storageUserInfo.phoneNum || storageUserOtherInfo.phoneNum,
    });
  },
});
