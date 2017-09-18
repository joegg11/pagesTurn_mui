# pagesTurn_mui
基于mui和H5+的页面跳转框架，有类似小程序页面跳转的功能。(A page Jump framework based on MUI and h5+)

---
## 特点
1. 	把mui的webview预加载功能进行封装，实现有等待页的页面跳转，避免切页白屏
2.	用父子关系的webview作为框架可以对导航条进行统一定制，也可单独设置颜色和标题
3.	对分享按钮进行了统一封装。
4.	实现了类似小程序的导航能力，页面从定向方法、页面显示触发事件、tab切换方法等等。
5.	按照webview间的层级关系将无用的webview 进行清理
6.	经过一个项目的迭代和完善，绝大部分的功能基本完善可用
7.	
## 缺点
1. 	webview的嵌套使用和webview的预加载会带来一定量的内存损耗
2.	不仅依赖mui和plus，而且依赖预设好的html模板，如果要对模板进行修改定制，可能需要理解框架内部部分的代码。
3.	个人能力有限部分功能可能存在bug，有待修复。
4.	对多端发布没有做过多的兼容，所以代码基本只能在plus端运行

（可能您有更好的实现方法，大家一起多多交流）

## Starts

在需要页面跳转的页面引入本框架js 文件和mui.js依赖
```
<script src="../../js/mui.min.js"></script>
<script src="../../js/app.js"></script>//本框架

```
因为本框架基于mui和H5+，而且大部分功能要在plus端运行所以要在plusReady事件（H5+运行时准备就绪）后运行，相关知识请详细阅读mui( http://dev.dcloud.net.cn/mui/ui/ )和H5+（ http://www.html5plus.org/doc/h5p.html ）文档
```
var pt = new win.pageTurn();//初始化对象
mui.plusReady(function() {//因为要在plus就绪才能创建webview
	pt.create();//创建预加载页面,
})
document.getElementById('id').onclick = function(e){
    e.preventDefault()
    pt.open('url','title',{id:13})//地址，标题，传参
}
```