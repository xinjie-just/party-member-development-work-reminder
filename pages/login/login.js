// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    account: '',
    showClearAccountBtn: false,
    isAccountWaring: false,
    password: '',
    showClearPasswordBtn: false,
    isPasswordWaring: false
  },

  onInput(evt) {
    const {value} = evt.detail;
    const {name} = evt.currentTarget.dataset;
    if (name === 'account') {
      this.setData({
        account: value,
        isAccountWaring: !value.trim(),
        showClearAccountBtn: !!value.length,
      })
    }
    if (name === 'password') {
      this.setData({
        password: value,
        isPasswordWaring: !value.trim(),
        showClearPasswordBtn: !!value.length,
      })
    }
    
  },

  onClear(evt) {
    const {name} = evt.currentTarget.dataset;
    if (name === 'account') {
      this.setData({
        account: '',
        isAccountWaring: true,
        showClearAccountBtn: false
      })
    }
    if (name === 'password') {
      this.setData({
        password: '',
        isPasswordWaring: true,
        showClearPasswordBtn: false
      })
    }
  },

  onConfirm() {
    this.setData({
      isAccountWaring: !this.data.account.length,
      isPasswordWaring: !this.data.password.length,
    });
    const valid = !(isAccountWaring || isPasswordWaring);

    // 客户不希望外网访问，所以不想申请 https 证书，该项目暂停。转为H5页面。
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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