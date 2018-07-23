let bmap = require('../../libs/bmap-wx.js')
let utils = require('../../utils/utils.js')
let singleArray = utils.singleArray
let app = getApp(),
  globalData = app.globalData,
  gThemeColor = globalData.themeColor,
  setNavigation = app.setNavigation

Page({

  data: {

    themeColor: gThemeColor,

    savedCities: [],
    savedWeather: [],

    noSavedCity: true
  },

  getMyCitiesInfo () {
    let cities = this.data.savedCities,
      len = cities.length,
      noSavedCity
    if(len < 1){
      noSavedCity = true
    } else {
      noSavedCity = false
      for (let i = 0; i < len; i++){
        getWeatherData(cities[i])
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
          savedWeather = this.data.savedWeather || []
        savedWeather.push({
            curCity,
            temperature,
            weatherDesc,
            weatherIcon
          })
          this.setData({
            savedWeather
          })
      },
      fail: err => {
        console.log(err)
      }
    })
  },

  onShow: function () {
    this.getWeatherData()
    setNavigation()
    let savedCities = this.data.saveCities || []
    wx.getStorage({
      key: 'savedCities',
      success: res => {
        savedCities = singleArray(savedCities.concat(res.data))
        this.setData({
          savedCities
        })
      }
    })
  }
})