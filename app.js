App({
  onLaunch: function () {
    this.globalData.themeColor = this.setTheme()
    this.setNavigation()
  },
  globalData: {
    themeColor: '',
    ak: 'dldNsvg8vEXc0O2Q6qVw7VvGl90dda3i'
  },
  setTheme: function () {
    let hour = new Date().getHours(),
      color = null
    if (hour >= 6 && hour < 18) {
      color = '#40a7e7'
    } else {
      color = '#384148'
    }
    return color
  },
  setNavigation: function () {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: this.setTheme(),
    })
  }
})
