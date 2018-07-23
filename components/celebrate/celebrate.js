Component({

  data: {
    windowWidth: 0,
    windowHeight: 0,
    arr: [],
    animations: [],
    duration: 5000,
    lefts: [],
    tops: 0,
    widths: [],
    src: '../../img/star.png'
  },

  ready () {
    wx.getSystemInfo({
      success: res => {
        this.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight
        })
      }
    })
    let arr = Array.apply(null, {length: parseInt(Math.random() * 30) + 30}).map((item, index) => {
      return index + 1
    })
    this.setData({
      arr
    })
    this.star()
  },

  methods: {
    star () {
      let w = this.data.windowWidth,
        h = this.data.windowHeight,
        duration = this.data.duration,
        animations = [],
        lefts = [],
        tops = -140,
        widths = [],
        len = this.data.arr.length

      for(let i = 0; i < len; i++){
        lefts.push(Math.random() * w)
        widths.push(Math.random() * 50 + 40)
        let animation = wx.createAnimation({
          duration: Math.random() * (duration - 1000) + 1000
        })
        animation.left(Math.random() * w).top(h).rotate(Math.random() * 960).step()
        animations.push(animation.export())
      }
      
      this.setData({
        lefts,
        tops,
        widths
      })

      let timer = setTimeout(() => {
        this.setData({
          animations
        })
        clearTimeout(timer)
      },200)
    }
  }
})