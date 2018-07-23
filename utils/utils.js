module.exports = {
    singleArray,
    filterArray
}

function singleArray (arr) {
    let temp = {},
        res = [],
        len = arr.length
    for(let i = 0; i < len; i++){
        if(!temp[arr[i]]){
            temp[arr[i]] = true
            res.push(arr[i])
        }
    }
    return res
}

function filterArray (text, arr) {
    let filtered = arr.filter(function (ele, index) {
      if(ele.name.indexOf(text) !== -1){
        return true
      }
    })
    return filtered
  }