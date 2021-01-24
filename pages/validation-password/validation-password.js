const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    password: '',
    phoneValid: false,
    passwordValid: false,
    passwordVisible: false, // 密码不明文显示
    hasPhone: false,
    submitLoading: false,
    timer: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const phone = options.phoneNum;
    if (!!phone) {
      this.setData({
        phone,
        hasPhone: true,
      });
    }
  },

  passwordIconVisible() {
    this.setData({
      passwordVisible: !this.data.passwordVisible,
    });
  },

  onInput(evt) {
    const { value } = evt.detail;
    const { name } = evt.currentTarget.dataset;
    const PHONE_REG_EXP = /^1\d{10}$/;
    let result = false;
    if (name === 'password') {
      this.setData({
        passwordValid: !!value,
      });
      if (this.data.passwordValid) {
        this.setData({
          password: value,
        });
      }
    } else if (name === 'phone') {
      // 避免出现手机号没有获取到，用户手动输入
      result = PHONE_REG_EXP.test(value);
      this.setData({
        phoneValid: result,
        phone: value,
      });
    }
  },

  validationPassword() {
    const phoneValid = this.data.phoneValid;
    const passwordValid = this.data.passwordValid;
    if (!this.data.phone) {
      wx.showToast({
        title: '手机号码必填！',
        duration: 2000,
        icon: 'none',
      });
      return;
    } else if (!phoneValid) {
      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none',
      });
      return;
    } else if (!passwordValid) {
      wx.showToast({
        title: '密码必填！',
        duration: 2000,
        icon: 'none',
      });
      return;
    } else {
      clearTimeout(this.data.timer);
      const timer = setTimeout(() => {
        this.setData({
          submitLoading: true,
        });
      }, 1000);
      this.setData({
        timer,
      });

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
                url: '/pages/wechat-login/wechat-login',
              });
            }, 2000);
          } else {
            wx.showToast({
              title: info.message || '密码验证失败，请联系管理员！',
              duration: 2000,
              icon: 'none',
            });
            wx.redirectTo({
              url: '/pages/wechat-login/wechat-login',
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
        complete() {
          that.setData({
            submitLoading: false,
          });
        },
      });
    }
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
              url: '/pages/index/index',
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
              url: '/pages/wechat-login/wechat-login',
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
              url: '/pages/wechat-login/wechat-login',
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
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    clearTimeout(this.data.timer);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    clearTimeout(this.data.timer);
  },
});
