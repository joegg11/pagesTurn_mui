//设置rem比例
var windowSize ={
	width:window.screen.width,
	height:window.screen.height
}
document.getElementsByTagName('html')[0].style.fontSize = (screen.width/750*100).toFixed(2)+'px'
//应用信息
var config = {
	check_sign:'vga6wu1pw4wfhl4b5nv7l66b7w28og33'
}

function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//返回年月日 格式：2017-02-16
function formatDayTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  return [year, month, day].map(formatNumber).join('-') 
}

//时间转换
function formatSeconds(a) {
    var mm = parseInt(a / 60);
    if (mm < 10) mm = "0" + mm;
    var ss = parseInt((a - mm * 60) % 60);
    if (ss < 10) ss = "0" + ss;
    var length = mm + ":" + ss;
    if (a > 0) {
        return length;
    } else {
        return "NaN";
    }
}
/*入参大于9999则返回万为单位的字符串
 *@param num 需要处理的数字
 *@param float 需要保留小数点后几位 默认保留1为
*/
function formatNUm(num,floats) {
	var floats = floats || 1;
  	var formatNUm = num>9999? (num/10000).toFixed(floats)+ '万':
  	num;
  	return formatNUm;
}