(function($, win) {
	mui.init({
		statusBarBackground: '#fa6b11',
	});

	/**
	 * tab切换等内容↓
	 */
	//设置默认打开首页显示的子页序号；
	var Index = 0;
	//把子页的路径写在数组里面
	var subpages = ['pages/home/home.html', 'pages/message/message.html', 'pages/found/found.html', 'pages/mine/mine.html'];

	var hadShowTabs = {}; //判断也是是否显示过的tabs

	//所有的plus-*方法写在mui.plusReady中或者后面。
	mui.plusReady(function() {
		//获取当前页面所属的Webview窗口对象
		var self = plus.webview.currentWebview();
		for(var i = 0; i < subpages.length; i++) {
			var top = '44px';
			if(i == 0) {
				top = "0px";
			}
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
					bottom: '50px' //设置距离底部的距离
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
		//获取目标子页的id
		var targetTab = this.getAttribute('href');
		//		    console.log(targetTab);
		if(targetTab == activeTab) {
			return;
		}
		//更换标题
		var tabTitle = this.querySelector('.mui-tab-label').innerHTML;
		if(tabTitle == '首页') {
			tabTitle = '千语街'
		}
		title.innerHTML = tabTitle;
		if(mui.os.plus) {
			plus.nativeUI.closeWaiting();
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
		} else {
			// 创建iframe代替子页面
			//		        createIframe('.mui-content',{
			//		            url: targetTab,
			//		            style: {
			//		                top: '45px',//设置距离顶部的距离
			//		                bottom: '50px'//设置距离底部的距离
			//		            }
			//		        });
		}

	});
	window.addEventListener('switchTab', function(e) {
		var index = e.detail.index;
		changeTab(index);
	})

	function changeTab(id) {
		var id = id;
		var targetEle = mui('.mui-tab-item')[0];
		mui('.mui-tab-item').each(function(index, ele) {
			ele.className = 'mui-tab-item';
			if(index == id) {
				ele.className = 'mui-tab-item mui-active';
				targetEle = ele;
			}
		})
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
		} else {
			// 创建iframe代替子页面
			//		        createIframe('.mui-content',{
			//		            url: targetTab,
			//		            style: {
			//		                top: '45px',//设置距离顶部的距离
			//		                bottom: '50px'//设置距离底部的距离
			//		            }
			//		        });
		}
	}

	/**
	 * 验证登录过期
	 */
	var op = new openPage();
	mui.plusReady(function() {
		op.create();
		//		var login_time = plus.storage.getItem('login_time') || 0;
		//		login_time = login_time - 0;
		console.log(plus.storage.getItem('login_time'));
		//		if(login_time > 0) { //第一次打开没有没有设置过登录时间就不会触发
		//			win.checkLoginInfo(op, function(res) {
		//				console.log('success', res)
		//			}, function(res) {
		//				//console.log('fail',res)
		//			})
		//		}
		
		var fistOpen = plus.storage.getItem('fist_open') || true;
		console.log(fistOpen);
		if(fistOpen === true || fistOpen!=plus.runtime.version){
			//第一次打开app展示引导页
			showGuide();
		}
		//检查版本号
		getLowestVersion();
	})
	//第一次打开app展示引导页
	function showGuide(){
		plus.storage.setItem('fist_open',plus.runtime.version);
		var guidePage = plus.webview.create('_www/pages/components/guidance.html','shareView',{
			width:'100%',
			height:'100%',
			backButtonAutoControl:'none',
			zindex:1000,
			popGesture:'none'
		});
		plus.navigator.setFullscreen(true);//全屏显示
		guidePage.show();
	}
	//获取最低版本号
	function getLowestVersion() {
		mui.ajax(window.config.domain + '/config/getLowestVersion', {
			data: {},
			dataType: 'json', //服务器返回json格式数据
			type: 'get', //HTTP请求类型
			timeout: 30000, //超时时间设置为30秒；
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			success: function(res) {
				console.log(JSON.stringify(res));
				if(res.status.succeed == 1) {
					var data = res.data;
					lowestVersion = parseInt(data.lowestVersion.replace(/\./g, ''));
					//当前版本号
					var app_version = parseInt((plus.runtime.version || 1.0).replace(/\./g, ''));
					if(app_version && app_version < lowestVersion) {
						//若当前版本低于服务器最低版本
						if(mui.os.android) {
							//android
							plus.nativeUI.alert('当前版本过低，必须更新版本后才能使用，请前往千余接官网 http://www.clarc.cn/ 或应用市场下载最新版本', function() {
								plus.runtime.openURL('http://www.clarc.cn/');
								setTimeout(function() {
									plus.runtime.quit();
								}, 600);
							}, '当前版本过低');
						} else {
							//ios
							showalert();
							//							plus.nativeUI.alert('当前版本过低，必须更新版本后才能使用，请前往 App Store 下载最新版本', function() {
							//								var options = {
							//									width: '100%',
							//									height: '100%',
							//									loading: {
							//										icon: '_www/images/warn.png',
							//										height: "0px"
							//									}
							//								};
							//								setTimeout(function() { 
							//										plus.nativeUI.showWaiting("当前版本过低，必须更新版本后才能使用...", options);
							//								}, 600);
							//								//添加监听事件，防止切换到后台后取消提示 
							//								document.addEventListener("resume", function(event) {
							//									setTimeout(function() {
							//										plus.nativeUI.showWaiting("当前版本过低，必须更新版本后才能使用...", options);
							//									}, 600);
							//								}, false);
							//							});
						}
					} else {
						//若当前版本可用则检验用户登录信息
						var login_time = plus.storage.getItem('login_time') || 0;
						login_time = login_time - 0;
						if(login_time > 0) { //第一次打开没有没有设置过登录时间就不会触发
							win.checkLoginInfo(op, function(res) {
								//console.log('success', res)
							}, function(res) {
								//console.log('fail',res)
							})
						}
					}
				} else {
					plus.nativeUI.closeWaiting();
					plus.nativeUI.toast(res.status.description);
				}
			},
			error: function(xhr, type, errorThrown) {
				//异常处理；
				plus.nativeUI.closeWaiting();
				console.log(type);
				console.log(errorThrown);
				plus.nativeUI.toast('连接服务器失败，请稍候再试');
			}
		});
	}

	function showalert() {
		plus.nativeUI.alert('当前版本过低，必须更新版本后才能使用，请前往 App Store 下载最新版本', function() {
			showalert();
		});
	}
})(mui, window)