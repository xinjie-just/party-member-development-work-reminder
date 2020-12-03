// pages/bind-phone/bind-phone.js
// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    showClearNameBtn: false,
    isNameWaring: false,
    phone: '',
    showClearPhoneBtn: false,
    isPhoneWaring: false
  },

  onInput(evt) {
    const {value} = evt.detail;
    const {name} = evt.currentTarget.dataset;
    if (name === 'name') {
      this.setData({
        name: value,
        isNameWaring: !value.trim(),
        showClearNameBtn: !!value.length,
      })
    }
    if (name === 'phone') {
      this.setData({
        phone: value,
        isPhoneWaring: !value.trim(),
        showClearPhoneBtn: !!value.length,
      })
    }
    
  },

  onClear(evt) {
    const {name} = evt.currentTarget.dataset;
    if (name === 'name') {
      this.setData({
        name: '',
        isNameWaring: true,
        showClearNameBtn: false
      })
    }
    if (name === 'phone') {
      this.setData({
        phone: '',
        isPhoneWaring: true,
        showClearPhoneBtn: false
      })
    }
  },

  onConfirm() {
    this.setData({
      isNameWaring: !this.data.name.length,
      isPhoneWaring: !this.data.phone.length,
    });
    const valid = !(isNameWaring || isPhoneWaring);

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
