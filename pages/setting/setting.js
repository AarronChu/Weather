let app = getApp(),
  globalData = app.globalData,
  gThemeColor = globalData.themeColor,
  setNavigation = app.setNavigation

Page({
  data: {
    themeColor: gThemeColor,
    bgImg:'',
    searchOn: true,
    updateOn: true,
    lingtness: 0
  },

  init () {
    setNavigation()
    this.getStore('searchon', 'searchOn')
    this.getStore('updateon', 'updateOn')
    this.getLightness()
  },

  getStore (key, data) {
    wx.getStorage({
      key,
      success: res => {
        this.setData({
          [data]: res.data
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },

  getLightness () {
    wx.getScreenBrightness({
      success: res => {
        this.setData({
          linghtness: Math.round(res.value * 100)
        })
      }
    })
  },

  setBg () {
    this.removeBg ()
    wx.chooseImage({
      count:1,
      success: res => {
        wx.saveFile({
          tempFilePath: res.tempFilePaths[0],
          success: () => {
            wx.navigateBack({})
          }
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },

  resetBg () {
    this.removeBg(function(){
      wx.showToast({
        title:'恢复默认背景',
        icon: 'success',
        duration: 1500
      })
    })
  },

  removeBg (cb) {
    wx.getSavedFileList({
      success: res => {
        let paths = res.fileList,
          len = paths.length
        for(let i = 0; i < len; i++){
          wx.removeSavedFile({
            filePath: paths[i].filePath
          })
        }
        cb && cb()
      }
    })
  },

  switchChange (e) {
    let val = e.detail.value,
      typeId = e.currentTarget.dataset.typeId
    wx.setStorage({
      key: typeId,
      data: val
    })
  },

  setLightness (e) {
    let val = e.detail.value
    wx.setScreenBrightness({
      value: val,
      fail: () => {
        wx.showModel({
          title: '提示',
          content: '不好意思，好像获取不到屏幕亮度信息',
          showCancel: false,
          confirmText: '再试试',
          confirmColor: this.data.themeColor
        })
      }
    })
    this.setData({
      lightness: val
    })
  },

  clearSettings () {
    wx.showModal({
      title: '提示',
      content: '确认要恢复默认设置吗？设置的背景将清除',
      cancelText: '还是不了',
      confirmText: '我要恢复',
      cancelColor: this.data.themeColor,
      confirmColor: this.data.themeColor,
      success: res => {
        if (res.confirm) {
          this.removeBg()
          wx.setStorage({
            key: 'searchOn',
            data: true
          })
          wx.setStorage({
            key: 'updateOn',
            data: true
          })
          this.setData({
            searchOn: true,
            updateOn: true
          })
          wx.showToast({
            title:'已恢复设置',
            icon: 'success',
            duration: 1500
          })
        }
      }
    })
  },

  clearStorage () {
    wx.showModal({
      title: '提示',
      content: '确认要清除本地数据吗？我的城市将清空',
      cancelText: '还是不了',
      confirmText: '清空呗',
      cancelColor: this.data.themeColor,
      confirmColor: this.data.themeColor,
      success: res => {
        if (res.confirm) {
          wx.clearStorage({
            success: () => {
              wx.showToast({
                title:'数据已清除',
                icon: 'success',
                duration: 1500
              })
            }
          })
        }
      }
    })
  },

  onShow: function () {
    this.init()
  }
})