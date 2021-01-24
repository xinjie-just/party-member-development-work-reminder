const app = getApp();

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },

  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
      });
      this.storageUserInfo();
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
        });
        this.storageUserInfo();
      };
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: (res) => {
          app.globalData.userInfo = res.userInfo;
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true,
          });
          this.storageUserInfo();
        },
      });
    }
  },

  // 存储用户信息并跳转
  storageUserInfo() {
    wx.setStorageSync('userInfo', {
      ...app.globalData.userInfo,
    });
    wx.redirectTo({
      url: '/pages/bind-phone/bind-phone',
    });
  },

  getUserInfo: function (e) {
    wx.clearStorageSync();
    app.globalData.userInfo = e.detail.userInfo;
    wx.setStorageSync('userInfo', {
      ...app.globalData.userInfo,
    });
    this.setData({
      userInfo: e.detail.userInfo,
      // hasUserInfo: true
    });
    let that = this;
    wx.login({
      success(data) {
        // console.log('code', data.code);
        if (data.code) {
          // 发起网络请求
          wx.request({
            url: `${app.globalData.hostname}/user/weiXinLogin`,
            data: {
              code: data.code,
            },
            header: {
              accessSide: 'weixin',
            },
            success(value) {
              const info = value.data;
              if (info.code === 200) {
                wx.setStorageSync('openid', info.data.openid);
                wx.setStorageSync('sessionKey', info.data.sessionKey);
                if (info.data.token) {
                  wx.setStorageSync('token', info.data.token);
                }
                wx.showToast({
                  title: '身份信息获取成功',
                  icon: 'none',
                  duration: 2000,
                });
                if (info.data.user) {
                  // 绑定过了
                  wx.setStorageSync('userOtherInfo', info.data.user);
                  setTimeout(() => {
                    wx.switchTab({
                      url: '/pages/index/index',
                    });
                  }, 2000);
                } else {
                  // 没绑定过，去绑定页面
                  wx.redirectTo({
                    url: '/pages/bind-phone/bind-phone',
                  });
                }
              } else {
                wx.showToast({
                  title: `${value.data.message}`,
                  icon: 'none',
                  duration: 2000,
                });
              }
            },
            fail() {
              wx.showToast({
                title: '微信登录失败！',
                icon: 'none',
                duration: 2000,
              });
            },
          });
        } else {
          wx.showToast({
            title: '登录失败！' + res.errMsg,
            icon: 'none',
            duration: 3000,
          });
        }
      },
    });
  },

  // 手机号密码登录
  phonePasswordLogin() {
    wx.navigateTo({
      url: '/pages/password-login/password-login',
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
