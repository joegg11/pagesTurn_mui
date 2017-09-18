(function($, win) {
		mui.init({
		statusBarBackground: '#fa6b11',
	});

	//设置默认打开首页显示的子页序号；
	var Index = 0;
	//把子页的路径写在数组里面
	var subpages = ['pages/home/home.html', 'pages/message/message.html', 'pages/found/found.html', 'pages/mine/mine.html'];

	var hadShowTabs = {}; //判断是否显示过的某tab页
	
	
	//所有的plus-*方法写在mui.plusReady中或者后面。
	mui.plusReady(function() {
		var top = '44px',bottom = '50px';
		//获取当前页面所属的Webview窗口对象
		var self = plus.webview.currentWebview();
		for(var i = 0; i < subpages.length; i++) {
			if(i == 0 && plus.webview.getSecondWebview()){
				//home页为第二主屏，
				var sub = plus.webview.getSecondWebview();
				if(i != Index) {
					sub.hide();
				}
				self.append(sub);
				continue
			}
			//创建webview子页
			var sub = plus.webview.create(
				subpages[i], //子页url
				subpages[i], //子页id
				{
					top: top, //设置距离顶部的距离
					bottom: bottom //设置距离底部的距离
				}
			);
			//如不是我们设置的默认的子页则隐藏，否则添加到窗口中
			if(i != Index) {
				sub.hide();
			}
			//将webview对象填充到窗口
			self.append(sub);
		}
		var activeView = plus.webview.getWebviewById(subpages[Index]);
		var hadloaded = false;
		activeView.onloaded = function() {
			if(!hadloaded) {
				hadShowTabs[subpages[Index]] = true;
				hadloaded = true;
				mui.fire(activeView, 'pageShow', {
					id: subpages[Index]
				});
			}
		}
	});
	//当前激活选项
	var activeTab = subpages[Index],
		title = document.querySelector(".mui-title");
	//选项卡点击事件
	mui('.mui-bar-tab').on('tap', 'a', function(e) {
		var targetEle = this;
		changeTab(targetEle);
	});
	
	//监听tab页切换事件
	window.addEventListener('switchTab', function(e) {
		var idx = e.detail.index;
		var targetEle = mui('.mui-tab-item')[0];
		mui('.mui-tab-item').each(function(index, ele) {
			ele.className = 'mui-tab-item';
			if(index == idx) {
				ele.className = 'mui-tab-item mui-active';
				targetEle = ele;
			}
		})
		changeTab(targetEle);
	})

	function changeTab(targetEle) {
		//获取目标子页的id
		var targetTab = targetEle.getAttribute('href');
		//		    console.log(targetTab);
		if(targetTab == activeTab) {
			return;
		}
		//更换标题
		var tabTitle = targetEle.querySelector('.mui-tab-label').innerHTML;
		if(tabTitle == '首页') {
			tabTitle = '千语街'
		}
		title.innerHTML = tabTitle;
		if(mui.os.plus) {
			//激活页面显示事件
			if(hadShowTabs[targetTab]) { //本tab页显示过才showAgain
				mui.fire(plus.webview.getWebviewById(targetTab), 'showAgain', {
					id: targetTab
				});
			} else { //本tab页没有显示过触发一次pageShow
				hadShowTabs[targetTab] = true;
				mui.fire(plus.webview.getWebviewById(targetTab), 'pageShow', {
					id: targetTab
				});
			}
			//显示目标选项卡
			plus.webview.show(targetTab);
			//隐藏当前选项卡
			plus.webview.hide(activeTab);
			//更改当前活跃的选项卡
			activeTab = targetTab;
		}
	}
})(mui, window)