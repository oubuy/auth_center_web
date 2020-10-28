//获得url请求参数
export function getQueryString(name) {
  var reg = new RegExp("(\\?|&)" + name + "=([^&]*)(&|$)"); // 构造一个含有目标参数的正则表达式对象
  var r = window.location.href.substr(1).match(reg);  // 匹配目标参数
  if (r != null) return unescape(r[2]); return null; // 返回参数值
}


 // 解决乱码问题
 export function sovleQueryString() {
  //首先获取到当前页面的地址栏信息
  var url = window.location.href;
  // console.log(url);

  var obj = {};
  var reg = /\?/;
  if (url.match(reg)) {
    //判断传入参数，以问号截取，问号后是参数
    var chars = url.split("?")[1];

    //再截&号
    var arr = chars.split("&");

    //获得截取后的数组为键值对字符串
    for (var i = 0; i < arr.length; i++) {
      //保守一点确定看是否为 name=value形式
      var num = arr[i].indexOf("=");

      if (num > 0) {
        //拼接字符串
        var name = arr[i].substring(0, num);
        var value = arr[i].substr(num + 1);

        //拼接对象，并转码
        obj[decodeURIComponent(name)] = decodeURIComponent(value);
      }
    }
  }
  return obj;
}

export function isNumber(val) {
  var regPos = /^\d+(\.\d+)?$/; //非负浮点数
  var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
  if (regPos.test(val) || regNeg.test(val)) {
    return true;
  } else {
    return false;
  }
}