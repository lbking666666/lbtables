;(function($){
	/*
	 * lbTablesEvent
	 * 作者：吕彬 
	 * Q Q : 286504720
	 * tables event jQuery plugin
	 * 
	 */
	'use strict';//使用严格模式
	var lbTablesEvent = function(ele,opt){
		this.$element = ele,
		this.options =  $.extend(true,{},$.fn.lbTablesEvent.defaults, opt);//传入参数
		this._initEvent(this.options);//初始化
	}
	lbTablesEvent.prototype = {
		_initEvent:function(opt){
			this._save(opt);
			this._setHide(opt);
		},
		_save:function(opt){
			var id = opt.save.id;
			var len = opt.save.list.length;
			var data = [];
			var listArr = opt.save.list;
			var eq = opt.save.eq;
			data.push('[');
			$(id).find('tr').each(function(i){
				var id = $(this).attr('data-id');
				var rowspan = $(this).attr('data-row');
				var list = new Array();
				var listData = '';
				var tr = $(this);
				if(id){//如果表格存在
					$.each(eq,function(l,m){
						var value = '';
						(tr.find('td').eq(m).find('input').length>0)?(value = tr.find('td').eq(m).find('input').val()):(value = tr.find('td').eq(m).text());
						(l==0)?(listData += '"'+listArr[l]+'":"'+value+'"'):(listData += ','+'"'+listArr[l]+'":"'+value+'"');//拼接字符串
					});
					list.push(listData);
					(i ==0)?(data.push('{"id":"'+id+'","rowspan":"'+rowspan+'",'+list+'}')):(data.push(',{"id":"'+id+'","rowspan":"'+rowspan+'",'+list+'}'));
				}
			});
			data.push(']');
			var $data = '';
			(data.length >2)?($data = data.join('')):( $data = '');//不为空则拼接数据，为空则传一个空的字符串
			var n = $('input.dataPost').length;
			var dataPost = '<input type="hidden" class="dataPost" id="dataPost'+n+'" value='+$data+'>';
			$('body').append(dataPost);	
			
		},
		_setHide:function(opt){
			
		}
	}
	$.fn.lbTablesEvent = function(options) {
		//创建Beautifier的实体
		var lbTablesEvents = new lbTablesEvent(this, options);
		//调用其方法
		return this;
	};
	$.fn.lbTablesEvent.defaults = {
		search:null,
		setHide:null,
		save:{}
	}

})(jQuery)