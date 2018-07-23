let bmap = require('../../libs/bmap-wx.js')
let app = getApp(),
  globalData = app.globalData,
  gThemeColor = globalData.themeColor

Page({
  data: {
    holiday: false,
    themeColor: gThemeColor,
    imgSrc: null,

    inputVal: '',

    searchOn: true,

    updateTime: '',

    // currentWeather: '',
    // originalData: '',

    curCity: '',
    curTemperature: '',
    weatherDesc:'',
    airQuality: '',
    tips: [],
    forecast: [],
    // _testScrollX: []

    naviAnimation: [],
    naviAniFlag: true,
    naviIconLeft: '',
    naviIconTop: '',

    savedCities: []
  },

  searchCityWeather (e) {
    let val
    if (typeof e === 'string'){
      val = e
    } else {
      val = e.detail.value
    }
    let url = this.setGeocodeUrl(val)
    wx.request({
      url,
      success: res => {
        if (res.data.status === 1) {
          wx.showToast({
            title: '无相关结果',
            icon: 'none',
            duration: 1500
          })
        } else {
          this.setData({
            inputVal: ''
          })
          let data = res.data.result.location
          let location = `${data.lng},${data.lat}`
          this.getWeatherData(location)
          wx.setStorage({
            key: 'cityName',
            data: val
          })
        }
      },
      fail: err => {
        console.log(err)
      }
    })
  },

  setGeocodeUrl (address) {
    return `https://api.map.baidu.com/geocoder/v2/?address=${address}&output=json&ak=${globalData.ak}`
  },

  
  goToSearch () {
    this.hideNaviIcons()
    wx.navigateTo({url:'/pages/search/search'})
  },
  goToMyCities () {
    this.hideNaviIcons()
    wx.navigateTo({url:'/pages/saved-cities/saved-cities'})
  },
  goToSetting () {
    this.hideNaviIcons()
    wx.navigateTo({url:'/pages/setting/setting'})
  },

  hideNaviIcons (e) {
    let aniArr = []
    if (!this.data.naviAniFlag) {
      this.setData({
        naviAniFlag: true
      })
      var ani1 = this.createAni(0.5, 0, 0, -180),
        ani2 = this.createAni(0, 0, 0, -180),
        ani3 = this.createAni(0, 0, 0, -180),
        ani4 = this.createAni(0, 0, 0, -180)
      aniArr.push(ani1,ani2,ani3,ani4)
      this.setData({
        naviAnimation: aniArr
      })
    }
  },

  showNaviIcons (e) {
    let x = e.currentTarget.offsetLeft,
        y = e.currentTarget.offsetTop,
        aniArr = []
    if(this.data.naviAniFlag) {
      this.setData({
        naviAniFlag: false
      })
      var ani1 = this.createAni(1, 0, 0, 0),
        ani2 = this.createAni(1, -25, -50, 0),
        ani3 = this.createAni(1, -60, 0, 0),
        ani4 = this.createAni(1, -25, 50, 0)
      aniArr.push(ani1,ani2,ani3,ani4)
      this.setData({
        naviAnimation: aniArr
      })
    } else {
      this.hideNaviIcons()
    }
  },

  naviIconMove (e) {
    this.hideNaviIcons()
    let oX = e.touches[0].clientX,
      oY = e.touches[0].clientY
    this.setData({
      naviIconLeft: oX - 20,
      naviIconTop: oY -20
    })
  },

  stopBubble(e) {
    console.log(e)
  },

  createAni (o, tx, ty, r) {
    let ani = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease-out'
    })
    ani.opacity(o).translateX(tx).translateY(ty).rotateZ(r).step()
    return ani.export()
  },

  showStar (t) {
    let title
    if(typeof t === 'string'){
      title = t
    } else {
      title = '送你星星！'
    }
    if(!this.data.holiday){
      wx.showToast({
        icon: 'none',
        title,
        duration: 1500
      })
      this.setData({
        holiday: true
      })
      let timer = setTimeout(() => {
        this.setData({
          holiday: false
        })
        clearTimeout(timer)
      }, 5000)
    }
  },

  init () {
    wx.getStorage({
      key: 'cityName',
      success: res => {
        console.log(res)
        this.searchCityWeather(res.data)
      },
      fail: () => {
        this.getWeatherData()
      }
    })
    this.setUpdateTime()
    this.setSearchArea ()
    this.getSavedFile ()
  },

  isHoliday () {
    let holiday,
      date = new Date(),
      today = date.getMonth() + 1 + '' + date.getDate()
    if (today === '101') {
      this.showStar('节日快乐')
    }
  },
  setUpdateTime() {
    let d = new Date(),
      month = d.getMonth() + 1,
      date = d.getDate(),
      hour = d.getHours(),
      minutes = d.getMinutes()
    this.setData({
      updateTime: month + '-' + date + ' ' + hour + ':' + minutes
    })
  },
  saveCities (location) {
    if (location) {
      let savedCities = this.data.savedCities
      savedCities.push(location)
      this.setData({
        savedCities
      })
      wx.setStorage({
        key: 'savedCities',
        data: savedCities
      })
    }
  },
  getWeatherData (location) {
    let BMap = new bmap.BMapWX({
      ak: globalData.ak
    })
    let locate = location || ''
    this.saveCities(locate)
    BMap.weather({
      location: locate,
      success: res => {
        let currentWeather = res.currentWeather[0],
          originalData = res.originalData.results[0],
          curCity = currentWeather.currentCity,
          weatherDesc = currentWeather.weatherDesc,
          str = currentWeather.date,
          reg = /\d+/g,
          curTemperature = str.match(reg)[2],
          airQuality = this.setAirQuality(currentWeather.pm25),
          tips = originalData.index,
          forecast = originalData.weather_data
        originalData.weather_data[0].date = '今天'
        originalData.weather_data[1].date = '明天'
        this.setData({
          // currentWeather,
          // originalData,
          curCity,
          curTemperature,
          weatherDesc,
          airQuality,
          tips,
          forecast,
          _testScrollX: forecast.concat(forecast)
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  setAirQuality (val) {
    let value = +val,
      quality,
      desc
    if (value <= 50) {
      quality = '优'
      desc = '无空气污染'
    } else if (value > 50 && value <= 100) {
      quality = '良'
      desc = '基本无空气污染'
    } else if (value > 100 && value <= 150) {
      quality = '轻度污染'
      desc = '减少长时间户外活动'
    } else if (value > 150 && value <= 200) {
      quality = '中度污染'
      desc = '减少户外活动'
    } else if (value > 200 && value <= 300) {
      quality = '重度污染'
      desc = '停止户外活动'
    } else if (value > 300) {
      quality = '严重污染'
      desc = '出门先叫救护车'
    }
    return {
      val,
      quality,
      desc
    }
  },
  setSearchArea () {
    wx.getStorage({
      key: 'searchon',
      success: res => {
        this.setData({
          searchOn: res.data
        })
      }
    })
  },
  getSavedFile () {
    wx.getSavedFileList({
      success: res => {
        if(res.fileList[0]){
          this.setData({
            imgSrc: res.fileList[0].filePath
          })
        }else{
          this.setData({
            imgSrc: null
          })
        }
      }
    })
  },

  onLoad () {
    this.isHoliday()
  },
  onShow () {
    this.init()
  }
})


