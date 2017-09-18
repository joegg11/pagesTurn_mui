(function(win, $) {
	mui.init();
	var domain = win.config.domain;
	var pt = new win.pagesTurn();
	var vm = new win.Vue({
		el: '#app',
		data: {
			listdata:[
				{
					name:'item1',
					id:"1"
				},
				{
					name:'item2',
					id:"2"
				},
				{
					name:'item3',
					id:"3"
				},
			]
		},
		methods: {
			toPage:function(e){
				var id = e.currentTarget.dataset.id;
				pt.open('../demolist/demolist.html','item'+id,{
					id:id
				})
			}
		}
	})
	$.plusReady(function() {
		pt.create();
	})
	pt.showAgain(function(){
		console.log('home.html is show Again');
	})
	
	
})(window, mui)