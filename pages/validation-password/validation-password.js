// pages/validation-password/validation-password.js
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    password: '',
    valid: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const phone = options.phoneNum;
    this.setData({
      phone,
    });
  },

  onInput(evt) {
    const { value } = evt.detail;
    const { name } = evt.currentTarget.dataset;
    if (name === 'password') {
      this.setData({
        valid: !!value,
      });
      if (this.data.valid) {
        this.setData({
          password: value,
        });
      }
    }
  },

  validationPassword() {
    if (!this.data.password) {
      wx.showToast({
        title: '密码必填！',
        duration: 2000,
        icon: 'none',
      });
      return;
    }
    if (!this.data.phone) {
      wx.showToast({
        title: '手机号码必填！',
        duration: 2000,
        icon: 'none',
      });
      return;
    }
    let that = this;
    wx.request({
      url: `${app.globalData.hostname}/user/phoneLogin`,
      method: 'POST',
      data: {
        phone: this.data.phone,
        password: this.data.password,
      },
      header: {
        accessSide: 'weixin',
        Authorization: wx.getStorageSync('token'),
      },
      success(res) {
        const info = res.data;
        if (info.code === 200) {
          // 密码验证成功，绑定手机号，然后跳转首页
          wx.showToast({
            title: '密码验证成功！',
            duration: 2000,
            icon: 'none',
          });
          const realName = info.data.user.realName;
          that.bindPhone(realName);
        } else if (info.code === 401) {
          wx.showToast({
            title: '登录已过期或未登录',
            duration: 2000,
            icon: 'none',
          });
          setTimeout(() => {
            wx.redirectTo({
              url: '../wechat-login/wechat-login',
            });
          }, 2000);
        } else {
          wx.showToast({
            title: info.message || '密码验证失败，请联系管理员！',
            duration: 2000,
            icon: 'none',
          });
          wx.redirectTo({
            url: '../wechat-login/wechat-login',
          });
        }
      },
      fail(res) {
        wx.showToast({
          title: '密码验证失败，请联系管理员！' + res.error,
          icon: 'none',
          duration: 2000,
        });
      },
    });
  },

  // 绑定手机号
  bindPhone(realName) {
    const openid = wx.getStorageSync('openid');
    wx.request({
      url: `${app.globalData.hostname}/user/weiXinLoginBindPhone`,
      method: 'POST',
      data: {
        openid,
        phone: this.data.phone,
        realName,
      },
      header: {
        accessSide: 'weixin',
        Authorization: wx.getStorageSync('token'),
      },
      success(res) {
        const info = res.data;
        if (info.code === 200) {
          wx.showToast({
            title: '绑定成功',
            duration: 2000,
            icon: 'success',
          });
          if (info.data.token) {
            wx.setStorageSync('token', info.data.token);
          }
          setTimeout(() => {
            wx.switchTab({
              url: '../index/index',
            });
          }, 2000);
        } else if (info.code === 401) {
          wx.showToast({
            title: '登录已过期或未登录',
            duration: 2000,
            icon: 'none',
          });
          setTimeout(() => {
            wx.redirectTo({
              url: '../wechat-login/wechat-login',
            });
          }, 2000);
        } else {
          wx.showToast({
            title: info.message || '手机号绑定失败！',
            duration: 2000,
            icon: 'none',
          });
          wx.clearStorageSync();
          app.globalData.userInfo = null;
          setTimeout(() => {
            wx.redirectTo({
              url: '../wechat-login/wechat-login',
            });
          }, 2000);
        }
      },
      fail(res) {
        wx.showToast({
          title: '手机号绑定失败！' + res.error,
          icon: 'none',
          duration: 2000,
        });
      },
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
