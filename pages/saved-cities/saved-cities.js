let bmap = require('../../libs/bmap-wx.js')
let utils = require('../../utils/utils.js')
let singleArray = utils.singleArray
let app = getApp(),
  globalData = app.globalData,
  gThemeColor = globalData.themeColor,
  setNavigation = app.setNavigation,
  chooseCity = app.chooseCity

Page({

  data: {
    themeColor: gThemeColor,
    savedCities: [],
    savedWeather: [],
    noSavedCity: true
  },

  chooseCity,
  
  getMyCitiesInfo () {
    let cities = this.data.savedCities,
      len = cities.length,
      noSavedCity,
      savedWeather = []
    if(len < 1){
      noSavedCity = true
    } else {
      noSavedCity = false
      for (let i = 0; i < len; i++){
        this.getWeatherData(cities[i])
      }
    }
    this.setData({
      noSavedCity
    })
  },

  getWeatherData (location) {
    let BMap = new bmap.BMapWX({
      ak: globalData.ak
    })
    let locate = location || ''
    BMap.weather({
      location: locate,
      success: res => {
        let currentWeather = res.currentWeather[0],
          weatherData = res.originalData.results[0].weather_data[0],
          curCity = currentWeather.currentCity,
          temperature = currentWeather.temperature,
          weatherDesc = currentWeather.weatherDesc,
          weatherIcon = {
            day: weatherData.dayPictureUrl,
            night: weatherData.nightPictureUrl
          },
          wd = {
            curCity,
            temperature,
            weatherDesc,
            weatherIcon
          }
        let savedWeather = this.data.savedWeather || []
        savedWeather.push(wd)
        this.setData({
          savedWeather
        })
        console.log(this.data.savedWeather)
      },
      fail: err => {
        console.log(err)
      }
    })
  },

  onShow: function () {
    wx.stopPullDownRefresh()
    this.getWeatherData()
    setNavigation()
    wx.getStorage({
      key: 'savedCities',
      success: res => {
        // console.log(res)
        if (res.data.length > 0) {
          let sc = singleArray(res.data)
          this.setData({
            savedCities: sc
          })
          // console.log(sc, this.data.savedCities)
          this.getMyCitiesInfo ()
        }
      }
    })
  }
})