/**
 * 页面跳转方法，使用前先要初始化 new openPage();
 * open('url',[title,param]) 打开页面
 * redirectTo('url',[title,param]) 从定向页面
 * @param {String} url 跳转地址
 * @param {String} title 跳转页标题
 * @param {Object} param 传参
 */
function openPage() {
	this.init();
}
openPage.prototype = {
	constructor: openPage,
	init: function() {
		var self = this;
		this.name = 'index'
		this.title = "千语街";
		this.param = {};
		this.style = {};
		this.option = {};
		this.lastParam = {};//上一次页面跳转传的参数

		function _opPlusReady() {
			self.mine = plus.webview.currentWebview();
			self.opener = self.mine.opener();
			self.parent = self.mine.parent() || null;
			var pageTitle = document.title;
			if(self.parent && pageTitle && self.parent.id.indexOf('tem_') >= 0) {
				mui.fire(self.parent, 'updateTitle', {
					title: pageTitle
				});
			}
		}
		if(window.plus) {
			_opPlusReady();
		} else {
			document.addEventListener("plusready", _opPlusReady, false);
		}
		this.hadShowOne = null; //是否已经显示过一次了
		//页面再次显示
		window.addEventListener("showAgain", function(e) {
			if(self.hadShowOne) {
//				console.log("showAgain");
				if(self.shallCreate&&(!plus.webview.getWebviewById('tem_'+self.name)||!plus.webview.getWebviewById('sub_'+self.name))){
					self.hadCreate = true;
					self.create(self.name);
				}
			}
		})
		//监听上一页的传参事件!!!!
		window.addEventListener("pageShow", function(e) {
			if(e.detail.secondTopViewId){
				self.secondTopViewId = e.detail.secondTopViewId;
			}
			if(!self.hadShowOne) {
				self.hadShowOne = true;
				self.option = e.detail;
//				console.log(JSON.stringify(e.detail));
			}
		})
	},
	create: function(name) {
		var self = this;
		var id = this.name;
		if(this.hadCreate) return true
		this.shallCreate = true;
		this.hadCreate = true;
		//如带了id就是新起的页面
		if(name) {
			id = name;
			this.name = id;
			if(id !== 'index') {
				//把要打开的页面告诉loading页，
				//等本页面关闭时把上一级预加载的页面关闭掉
				mui.fire(self.parent, 'closeLastView', {
					id: name
				});
			}
		}
		if(!plus.webview.getWebviewById('tem_' + id)) {
			var temUrl = '_www/pages/template.html';
			// 预加载模板父页面
			this.template = mui.preload({
				url: temUrl,
				id: 'tem_' + id,
				styles: {
					popGesture: "hide"
				}
			});
			createSubWebview();
			// 将子页面填充到父页面
			this.template.append(self.subWebview);
		} else {
			this.template = plus.webview.getWebviewById('tem_' + id);
			createSubWebview();
			// 将子页面填充到父页面
			this.template.append(self.subWebview);
		}

		function createSubWebview() {
			if(!plus.webview.getWebviewById('sub' + id)) {
				// 预加载公用子页面
				self.subWebview = mui.preload({
					url: '',
					id: 'sub_' + id,
					styles: {
						top: '44px',
						bottom: '0px'
					}
				});
			} else {
				self.subWebview = plus.webview.getWebviewById('sub' + id);
			}
		}
		//给所有a标签添加监听事件
		if(!self.hadAListener && self.mine.id != plus.webview.getLaunchWebview().id) {
			self.hadAListener = true;
			console.log('.................a.addEventListener');
			self.addAListener();
		}
	},
	addAListener: function() {
		if(!mui.os.plus)return;
		var self = this;
		mui('a').each(function(index, el) {
			//阻止a标签的跳转操作
			el.onclick = function(e) {
				if(e && e.preventDefault) e.preventDefault();
				else window.event.returnValue = false; //IE
			}
			if(!el.hadListener) {
				//给标签对象设置一个自定义属性用来标记是否已经挂载监听
				el.hadListener = true;
				el.addEventListener('tap', function(e) {
					e.preventDefault();
					var a = this; //a标签
					var href = a.href;
					var title = '';
					var request = {};
					if(href.indexOf('?') != -1) {
						var str = href.split('?')[1];
						var strs = str.split('&');
						for(var i = 0; i < strs.length; i++) {
							request[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1])
						}
					}
					if(href && href != plus.webview.currentWebview().getURL() 
					&&href !='' && href.split('?')[0].endsWith('.html')) {
						if(a.target == '_self') {
							self.redirectTo(href.split('?')[0], title,request);
						} else {
							self.open(href.split('?')[0], title,request,{});
						}
					}
				});
			}
		})
	},
	/**
	 * @param {String} url 跳转地址，相对地址
	 * @param {String} title 跳转页标题,null默认'千语街'，''空字符串为页面title
	 * @param {Object} param 传参
	 */
	open: function(_url, _title, _param, _style,_waitingData) {
		var self = this;
		var url = _url;
		var title = this.title;
		var param = this.param;
		var style = this.style;
		var waitingData = false;
		if((_title && _title.constructor == String) || _title === '') title = _title;
		if(_param && _param.constructor == Object) param = _param;
		if(_style && _style.constructor == Object) style = _style;
		if(_waitingData && _waitingData.constructor == Boolean) waitingData = _waitingData;
		this.render(url, title, param, style,waitingData);
	},
	/**
	 * @param {String} url 跳转地址，相对地址
	 * @param {String} title 跳转页标题,null默认'千语街'，''空字符串为页面title
	 * @param {Object} param 传参
	 */
	redirectTo: function(_url, _title, _param, _style,_waitingData) {
		var self = this;
		var url = _url;
		var title = this.title;
		var param = this.param;
		var style = this.style;
		var waitingData = false;
		if((_title && _title.constructor == String) || _title === '') title = _title;
		if(_param && _param.constructor == Object) param = _param;
		if(_style && _style.constructor == Object) style = _style;
		if(_waitingData && _waitingData.constructor == Boolean) waitingData = _waitingData;
		this.render(url, title, param, style, waitingData,true);
	},
	render: function(url, title, param, style, waitingData,is_redirect) {
		if(this.judgeDevice() != 1){
			this.noPlusNavigate(url,param);
			return
		}
		var self = this;
		var param = param;
		var template = this.template;
		var subWebview = this.subWebview;
		var secondTopViewId = self.mine.id;//第二栈顶webview
		if(!plus.webview.getWebviewById('tem_'+self.name)||!plus.webview.getWebviewById('sub_'+self.name)){
			//如果还没有创建就再创建窗口
			this.hadCreate = false;
			this.create(self.name);
			this.render(url, title, param, style, is_redirect);
			return
		}
		if(is_redirect&&this.secondTopViewId){
			secondTopViewId = this.secondTopViewId;
		}
		param.secondTopViewId = secondTopViewId;
		mui.fire(template, 'updateHeader', {
			title: title,
			href: url,
			param: param,
			style: style,
			openerId: self.mine.id,
			secondTopViewId: secondTopViewId,
		});
		// 加载子页面地址
		var localUrl = url
		if(url.indexOf('..')==0){
			localUrl = url.substr(2);
		}else if(url.indexOf('.')==0){
			localUrl = url.substr(1);
		}
		var sameParam = true;
		for(var key in param){
			if(param[key]!==self.lastParam[key]){
				sameParam = false;
				break
			}
		}
		if(subWebview.getURL()&&subWebview.getURL().indexOf(localUrl)>=0 && sameParam) {
			self.lastParam = param;
			param.from = plus.webview.currentWebview().getURL();
			mui.fire(subWebview, 'showAgain', param);
			subWebview.show();
			//传参操作
		} else {
			self.lastParam = param;
			subWebview.clear();
			subWebview.loadURL(url);
			// 子页面加载完成显示
			clearTimeout(self.subListener);
			//避免重复挂载监听
			//subWebview.removeEventListener('loaded');
			var hadloaded = false;
			subWebview.onloaded = function() {
				if(!hadloaded) {
					//重定向的话打开新一页后关闭上一页
					if(is_redirect && self.parent && self.parent.id.indexOf('tem_')>=0) {
						mui.fire(template,"withRedirect",{is_redirect:true})
						self.parent.hide();
						self.mine.hide();
					}
					hadloaded = true;
					clearTimeout(self.sub_time);
					mui.fire(subWebview, 'pageShow', param);
					if(waitingData){
						subWebview.hide();
						//重定向时
						if(is_redirect && self.parent && self.parent.id.indexOf('tem_')>=0) {
							if(self.secondTopViewId && self.secondTopViewId.indexOf('sub_')>=0 
							&& (!self.opener||self.secondTopViewId != self.opener.id)){
								self.parent.close();
								self.mine.close();
							}else{
								self.mine.clear();
							}
						}
					}else{
						self.sub_time = setTimeout(function(){
							subWebview.show();
							//重定向时
							if(is_redirect && self.parent && self.parent.id.indexOf('tem_')>=0) {
								if(self.secondTopViewId && self.secondTopViewId.indexOf('sub_')>=0 
								&& (!self.opener||self.secondTopViewId != self.opener.id)){
									self.parent.close();
									self.mine.close();
								}else{
									self.mine.clear();
								}
							}
						}, 300);
					}
				}
			}
		}

		// 显示模板父页面
//		if(is_redirect && this.parent && this.parent.id.startsWith('tem_')){
//			template.show();
//		}else{
			template.show('slide-in-right', 150);
//		}
	},
	noPlusNavigate: function(url,param){
		var url = url;
		var param = param;
		var str = '';
		var keys = Object.keys(param);
		if(keys.length>0){
			str += '?';
			for(var i in keys){
				var key = keys[i];
				str += key + '='+ param[key];
			}
		}
		window.location = url+str; 
	},
	judgeDevice: function(_app,_mobile,_pc){
		//判断访问终端
		var browser = {
			versions: function() {
				var u = navigator.userAgent,
					app = navigator.appVersion;
				return {
					trident: u.indexOf('Trident') > -1, //IE内核
					presto: u.indexOf('Presto') > -1, //opera内核
					webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
					gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
					mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
					ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
					android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, //android终端
					iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
					iPad: u.indexOf('iPad') > -1, //是否iPad
					webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
					weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
					qq: u.match(/\sQQ/i) == " qq" //是否QQ
				};
			}(),
			language: (navigator.browserLanguage || navigator.language).toLowerCase()
		}

		//判断是否移动端
		if(mui.os.plus){
			typeof _app == "function" && _app()
			return 1
		}else if(browser.versions.mobile) {
			if(browser.versions.weixin) {
				//判断是否微信
				typeof _mobile == "function" && _mobile()
				return 2
			}
			if(browser.versions.webApp && (browser.versions.trident || browser.versions.presto ||
				browser.versions.gecko)) {
				//判断是否手机浏览器
				typeof _mobile == "function" && _mobile()
				return 2
			}
			return 2
		} else {
//			window.location = 'http://www.clarc.cn/'; 
			typeof _pc == "function" && _pc()
			return 3
		}

	},
	/**
	 * 关闭页面
	 * @param {String} num
	 */
	close: function(num) {
		var self = this;
		var closeNum = 1;
		if(num && typeof num == 'number') var closeNum = parseInt(num);
		mui.fire(self.parent, 'closeView', {
			num: closeNum
		});
	},
	setParam: function(param) {
		return this.option = param
	},
	getParam: function() {
		return this.option
	},
	/**
	 * 页面第一次显示
	 * @param {Callback} cb
	 */
	showPage: function(cb) {
		//监听上一页的传参事件
		if(this.judgeDevice() != 1){//不是app端时
			var href = window.location.href;
			var obj = {};
			if(href.indexOf('?') != -1) {
				var str = href.split('?')[1];
				var strs = str.split('&');
				for(var i = 0; i < strs.length; i++) {
					obj[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1])
				}
			}
			typeof cb == "function" && cb(obj)
			return
		}
		window.addEventListener("pageShow", function(e) {
			var option = e.detail;
			mui.plusReady(function(){
				typeof cb == "function" && cb(option)
			})
		})
	},
	/**
	 * 页面再次显示
	 * @param {Callback} cb
	 */
	showAgain: function(cb) {
		var self = this;
		window.addEventListener("showAgain", function(e) {
			if(self.hadShowOne) {
				var obj = e.detail;//from:url从那个页面返回的，页面的地址
				typeof cb == "function" && cb(obj)
			}
		})
	},
	beforeClose: function(cb) {
		window.addEventListener("beforeClose", function(e) {
			var option = e.detail;
			typeof cb == "function" && cb(option)
		})
	},
	switchTab: function(index) {
		var indexId = plus.webview.getLaunchWebview().id;
		if(this.mine.parent().id != indexId && this.mine.parent().id.indexOf('tem_') >=0) {
			mui.fire(plus.webview.getLaunchWebview(), 'switchTab', {
				index: index
			})
			var wvs=plus.webview.all();
			for(var i=0;i<wvs.length;i++){
				var wv = wvs[i];
				if(wv.id.indexOf('tem_') >=0 && wv.id != 'tem_index'){
					wv.close();
				}else if(wv.id == 'tem_index' || wv.id == 'sub_index'){
					if(wv.id == 'sub_index'){
						wv.clear();
					}
					wv.hide();
				}
			}
			
		};
		if(this.mine.parent().id == indexId) mui.fire(plus.webview.getLaunchWebview(), 'switchTab', {
			index: index
		})
	},
	dataLoaded:function(){
		var self = this;
		plus.webview.currentWebview().show();
	},
	share: function(param){
		var self = this;
		if(typeof param == "object"){
			//发送分享
			var msg = param;
			mui.plusReady(function(){
				self.createShare(msg);
				mui.fire(self.parent,'canShare',{
					canShare:true
				});
			})
		}
	},
	createShare: function(msg){
		var self = this;
		if(Object.keys(msg).length>0){
			var opner = plus.webview.currentWebview().id;
			if(plus.webview.getWebviewById('shareView')){
				self.shareView = plus.webview.getWebviewById('shareView');
				mui.fire(self.shareView,'getMessage',{
					msg:msg,
					opner: opner
				});
			}else{
				self.shareView = plus.webview.create('_www/pages/components/shareView.html','shareView',{
					height:'210px',
					bottom:'0px',
					backButtonAutoControl:'hide',
					zindex:1000,
					popGesture:'none',
					background:'transparent'
				});
				var sharViewLoaded = false;
				self.shareView.onloaded=function(){
					if(!sharViewLoaded){
						sharViewLoaded = true;
						mui.fire(self.shareView,'getMessage',{
							msg:msg,
							opner: opner
						});
					}
				}
			}
		}
	}
}