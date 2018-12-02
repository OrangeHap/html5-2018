// pages/new_pw/new_pw.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    closeTime: null,
    tipStatus: false,
    tip: "",
    impTip: ""
  },
  //处理表单发送的数据
  formSubmit: function (res) {
    // 加密函数 
    function compile(code) {
      let c = String.fromCharCode(code.charCodeAt(0) + code.length);
      for (let i = 1; i < code.length; i++) {
        c += String.fromCharCode(code.charCodeAt(i) + code.charCodeAt(i - 1));
      }
      return escape(c);
    }
    // 解密函数
    function uncompile(code) {
      code = unescape(code);
      let c = String.fromCharCode(code.charCodeAt(0) - code.length);
      for (let i = 1; i < code.length; i++) {
        c += String.fromCharCode(code.charCodeAt(i) - c.charCodeAt(i - 1));
      }
      return c;
    }
    let val = res.detail.value
    clearTimeout(this.closeTime)
    //判断数据的合法性
    if (!val.title) {
      this.setData({
        tip: "标题不能为空",
        tipStatus: false
      })
    } else if (!val.username) {
      this.setData({
        tip: "用户名不能为空",
        tipStatus: false
      })
    } else if (!val.password) {
      this.setData({
        tip: "密码不能为空",
        tipStatus: false
      })
    } else {

      //新增的内容
      // const fileSys = wx.getFileSystemManager()
      let json = {
        username: val.username,
        password: val.password,
        tip: val.tip
      }
      let rJson = null
      let wJson = null

      //json本地化
      function saveJson(transJson) {
        wJson = JSON.stringify(transJson)
        wJson = compile(wJson)//加密
        wx.setStorageSync('importance', wJson)
        // fileSys.writeFileSync(`${wx.env.USER_DATA_PATH}/importance.importance`, wJson, "utf8")
      }

      //成功提示
      function successTip(strTip) {
        wx.showToast({
          title: strTip,
          icon: 'success',
          duration: 2000
        });
      }

      //数据本地化
      try {
        rJson = wx.getStorageSync('importance')
        rJson = uncompile(rJson)//解密
        console.log(rJson)
        // rJson = fileSys.readFileSync(`${wx.env.USER_DATA_PATH}/importance.importance`, "utf8")
        rJson = JSON.parse(rJson)
        //如果rJson[val.title]已经存在，提示是否覆盖
        if (rJson[val.title]) {
          wx.showModal({
            title: '覆盖信息',
            content: '<' + val.title + '>已经备忘，是否覆盖',
            confirmText: "是",
            cancelText: "否",
            success: function (res) {
              if (res.confirm) {
                rJson[val.title] = json
                saveJson(rJson)
                successTip("覆盖成功")
              } else {
              }
            }
          });
        } else {
          rJson[val.title] = json
          saveJson(rJson)
          successTip("新建成功")
        }
        //捕获readFileSync异常，说明没有创建importance.importance
      } catch (e) {
        let tJson = {}
        tJson[val.title] = json
        saveJson(tJson)
        successTip("新建成功")
      }

      //成功，保存状态
      this.setData({
        tip: "",
        tipStatus: true
      })
    }

    //提示定时消失
    this.closeTime = setTimeout(() => {
      this.setData({
        tip: "",
        tipStatus: false
      })
    }, 2000)
  },
  tipShow() {
    //用有无tip文件判断配置信息
    // const fileSys = wx.getFileSystemManager()
    try {
      let tip = wx.getStorageSync('tip')
      // fileSys.readFileSync(`${wx.env.USER_DATA_PATH}/tip`, "utf8")
      //有，执行这里
      if (tip) {
        this.setData({
          impTip: ""
        })
      } else {
        this.setData({
          impTip: '*强烈建议先看下方导航“我”>“帮助文档”中的重要声明'
        })
      }
    } catch (e) {
      //无，提示
      this.setData({
        impTip: '*强烈建议先看下方导航“我”>“帮助文档”中的重要声明'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.tipShow()
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
    this.tipShow()
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