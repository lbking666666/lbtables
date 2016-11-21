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
		_initEvent:function(opt){//
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
				$.each(eq,function(l,m){
					if(tr.find('td').eq(m).find('input').length>0){
						var value = tr.find('td').eq(m).find('input').val();	
					}else{
						var value = tr.find('td').eq(m).text();	
					}
					if(l==0){
						listData += '"'+listArr[l]+'":"'+value+'"'
					}else{
						listData += ','+'"'+listArr[l]+'":"'+value+'"'
					}
				});
				list.push(listData);
				if(i == 0){
					data.push('{"id":"'+id+'","rowspan":"'+rowspan+'",'+list+'}');
				}else{
					data.push(',{"id":"'+id+'","rowspan":"'+rowspan+'",'+list+'}');
				}
			});
			data.push(']');
			var $data = data.join('');
			var n = $('input.dataPost').length;
			var dataPost = '<input type="hidden" class="dataPost" id="dataPost'+n+'" value='+$data+'>';
			console.log($data);
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