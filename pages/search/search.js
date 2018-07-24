let utils = require('../../utils/utils.js')
let filterArray = utils.filterArray
let oCities = require('../../data/staticData.js')
let allCities = oCities.cities

let app = getApp(),
  globalData = app.globalData,
  gThemeColor = globalData.themeColor,
  setNavigation = app.setNavigation,
  chooseCity = app.chooseCity

Page({
  data: {
    themeColor:gThemeColor,
    enArr: [],
    cities: {},
    filteredCities: [],
    targetId: '',
    searching: false,
    noResult: false,
    inputValue: ''
  },

  chooseCity,

  searchCity (e) {
    let val = e.detail.value,
      searching = false,
      filteredCities = [],
      noResult = false
    if (val !== '') {
      searching = true
      filteredCities = filterArray(val, allCities)
      if (filteredCities.length === 0) {
          noResult = true
      }
    }
    this.setData({
      searching,
      filteredCities,
      noResult
    })
  },

  cancelInput () {
    this.setData({
      inputValue: ''
    })
  },

  scrollToTarget (e) {
    let id = e.target.dataset.targetId
    this.setData({
      targetId: id
    })
  },

  setEnArr () {
    let enArr = [],
      i = 65
    for(; i < 91; i++){
      enArr.push(String.fromCharCode(i))
    }
    this.setData({
      enArr
    })
  },

  setCities (cities) {
    let temp = {}
    let enArr = this.data.enArr,
      len1 = enArr.length
    for (let i = 0; i < len1; i++){
      temp[enArr[i]] = []
    }
    let citiesArr = cities.cities,
      len2 = citiesArr.length
    for(let i = 0; i < len2; i++) {
      let letter = citiesArr[i].letter,
        city = citiesArr[i].name
      temp[letter].push(city)
    }
    this.setData({
      cities: temp
    })
  },

  onLoad: function (options) {
    this.setEnArr()
    this.setCities(oCities)
  },
  onShow: function () {
    setNavigation()
    wx.stopPullDownRefresh()
  }
})