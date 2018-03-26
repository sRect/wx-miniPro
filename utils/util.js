const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//fn 要执行的函数
//delay 延迟
//mustDelay  在mustDelay时间内必须执行一次
const debounce2 = function (method, delay) { 
  var timer = null;
  return function () {
    var context = this, args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      method.apply(context, args);
    }, delay);
  }
}

module.exports = {
  formatTime: formatTime,
  debounce2: debounce2
}
