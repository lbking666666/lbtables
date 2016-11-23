;(function($, window, document, undefined){
	/*
	 * lbTables
	 * 作者：吕彬 
	 * Q Q : 286504720
	 * tables jQuery plugin
	 * 
	 */
	'use strict';//使用严格模式
	var lbTables;
	var thSortIndex = null;
	lbTables = function (ele, opt) {
		this.$element = ele;
		this.options = $.extend(true, {}, $.fn.lbTables.defaults, opt);//传入参数
		this._init(this.$element, this.options);//初始化
	};
	lbTables.prototype = {
		/**
			@a:当前的容器
			@b:传入进来的参数
		**/
		_init:function(a,b){
			this._tablesHtml(a,b);//构建table的html结构
		},
		_tablesHtml:function(a,b){
			/**
				构建table框架：把width（表格宽度）和class（表格样式）放入table中创建table数组存放table的html结构
				一、判断当前容器下是否存在table
				二.构造thead：创建thead数组存放thead的html结构
					1.把传入的th的title（名称），width（宽度），class（样式），rowspan（此列是否合并行）属性放入的th
					2.判断是否存在操作列，如存在在首列还是在尾列，并放入th的数组中
					3.获得序号列数，将序号列插入到thead中
				三.获得数据插入到tbody中 _tableGetJson
			**/
			if(a.find('table:first').length == 0){
				//构造table的框架
				var c = new Array();//创建table数组
				var d = b.sort;//获得序号列的排序数
				c.push('<table cellpadding="0" cellspacing="0"');
				if(b["width"]) c.push(' width="'+b["width"]+'"'); //添加宽度
				if(b["class"]) c.push(' class="'+b["class"]+'"'); //添加样式
				c.push('><thead><tr>');
				function option (){//添加操作列
					c.push('<th width="'+b.editor["width"]+'" ');
					if(b.editor.rowspan == true) c.push('data-span="true"');
					c.push('>'+b.editor.name+'</th>');
				}
				if(b.editor.value == true && b.editor.option == "first") option();
				for(var i = 0; i<b.th.length; i++){
					c.push('<th ');
					if(b.th[i]["class"]) c.push('class="'+b.th[i]["class"]+'" ');
					if(b.th[i]["width"]) c.push('width="'+b.th[i]["width"]+'" ');
					if(b.th[i].rowspan) c.push('data-span="true"');
					c.push('>'+b.th[i].title+'</th>');
				}
				if(b.editor.value == true && b.editor.option == "last") {
					option();
					var d = b.sort-1;//获得序号列的排序数
				}
				c.push('</tr></thead><tbody id="'+b.id+'"></tbody></table>');
				a.append($(c.join('')));//表格插入到当前容器
				//插入编号列
				var thSort = $('<th class="sort" data-span="true" width="60">序号</th>');
				a.find('thead tr').find('th').eq(d).before(thSort);
			}
			//获得数据 填充tbody
			this._tableGetJson(a,b);
		},
		_tableGetJson:function(a,b){
			/**
				一、获得json数据，创建tr数组存放tbody的html结构
					1.通过ajax接受到表格的json 包含 id rowspan list 三个值
					2.把id绑定到tr的data-id上面，rowspan的值绑定到data-row
					3.判断操作列的信息把操作列放入到tr中
					4.判断序号列放入tr中
					5.添加用户自定义操作
				二.判断当前tbody是否存在tr，通过判断插入数据
					1.不存在tr
					  (1)是否传递过来的json为空，如为空则页面只添加一个tr和td内容为:暂无数据
					  (2)json不为空的情况下，将tr插入到tbody中并添加合并行和序号操作
					2.存在tr则为再次导入
					  (1)如果为一条“暂无数据”的tr,判断传过来的$tr是否为空，不为空则清除此tr添加数据
					  (2)创建数组idIndexTr存放tbody下tr的id，如果传入的数据有相同的id则不插入
					  (3)创建数组rowIndexTr存放tbody下tr的data-row，如果传入的数据有相同的rowspan则查找tbody下的tr的位置在此行前插入相同rowspan的数据
					     并更新rowIndexTr数组
					  (4)传入的数据不和tbody下的tr的id和rowspan相同则在tbody下追加数据，并更新rowIndexTr数组
					  (5)将tr插入到tbody中并添加合并行和序号操作
				三、添加表格操作，添加奇偶行变色，添加hover，添加、删除行，点击列头列排序，
			**/
			var c = a.find('table:first').find('tbody');//当前的tbody
			var d= this;
			$.ajax({
				url: b.data,
				type: 'get',
				dataType: 'json',
				data: b.get,
				success:function(json){
					//var json = $.parseJSON(data);
					//构造tr结构
					var e = new Array();
					$.each(json, function(i,k){
						//操作列
						var f = [];
						function opption(){
							f.push('<td');
							if(b.editor.align) f.push(' align="'+b.editor.align+'"');//添加对齐方式
							f.push('>')
							for(var l = 0;l<b.editor.btn.length;l++){//把操作列的按钮插入进来
								f.push('<a href="javascript:;" title="'+b.editor.btn[l].name+'" class="'+b.editor.btn[l]["class"]+'">'+b.editor.btn[l].name+'</a>');
							}
							f.push('</td>');
							e.push(f.join(''));
						}
						e.push('<tr data-id="'+k.id+'" data-row="'+k.rowspan+'">');
						if(b.editor.value == true && b.editor.option == "first") opption();//添加操作列
						for(var n=0;n<k.list.length;n++){
							e.push('<td ');
							if(b.th[n]["class"]) e.push('class="'+b.th[n]["class"]+'" ');//添加样式
							if(b.th[n].align) e.push('align="'+b.th[n].align+'" ');//添加对齐方式
							e.push('>');
							var item = '';
							(b.th[n].format)?(e.push(b.th[n].format($.trim(k.list[n]),item))):(e.push($.trim(k.list[n])));//添加自定义函数，数据去掉空格
							e.push('</td>');
						}
						if(b.editor.value == true && b.editor.option == "last") opption();//添加操作列
						function format(val,item){//自定义操作
							return item;
						}
						e.push('</tr>');
					});
					var $tr = $(e.join(''));
					//添加序号列
					var g = b.sort;
					if(b.editor.value == true && b.editor.option == "last") var g = b.sort-1;
					var sortHtml = '<td class="sort sort-td" align="center" width="60"></td>';
					$.each($tr,function(i,k){
						$(k).find('td').eq(g).before(sortHtml);
					});
					//判断是否是第一次加载数据
					if(c.find('tr').length == 0){
						var th = a.find('table:first').find('thead th');
						if(json.length == 0){//如果数据为空则显示无数据
							tr.push('<tr class="kng"><td align="center" colspan="'+th.length+'">暂无数据！</td></tr>');
							c.append(tr);
						}else{
							c.append($tr);
							d._rowspan(a,c);//合并行
							d._sort(c);//序号排序
						}
					}else{//再次导入时
						var idIndexTr = [];
						var rowIndexTr = [];
						d._rowspanDel(c);
						if($tr.length != 0) c.find('tr.kng').remove()
						for(var i =0; i<c.find('tr').length;i++){
							var rowIndex = c.find('tr').eq(i).attr('data-row');
							var idIndex = c.find('tr').eq(i).attr('data-id');
							idIndexTr.push(idIndex);
							rowIndexTr.push(rowIndex);
						}
						for(var i=0;i<json.length;i++){
							var idData = json[i].id;
							var rowData = json[i].rowspan;
							if($.inArray(idData, idIndexTr) == -1){//不存在重复id
								if($.inArray(rowData, rowIndexTr) == -1){
									c.append($tr[i]);
									rowIndexTr.push(rowData);
								}else{
									var j = $.inArray(rowData, rowIndexTr);
									c.find('tr').eq(j).removeClass('lb-col-row');
									c.find('tr').eq(j).before($tr[i]);
									rowIndexTr.splice(j, 0, rowData);
								}
							}
						}
						d._rowspan(a,c);//合并行
						d._sort(c);//序号排序
						b.events = false;//事件只加载一次
					}
				},
				complete:function(){
					$.isFunction(b.afterLoad) && b.afterLoad.call(d);
					if(b.events){//事件只加载一次
						d._tableEvent(a,b,c);//事件函数
					}
					if(b.pop.bool == true){//是否存在弹出table
						d._tablePop(a,b,c);
					}
				}
			})
		},
		_rowspanDel:function(c){
			c.find('tr').each(function(index,ele){
				$(ele).removeAttr('rowspan');
				$(ele).find('td.lb-td-hide').removeClass('lb-td-hide');
				$(ele).find('td.rowspan').removeClass('rowspan');
				$(ele).find('td.sort-td').addClass('sort');
			});
		},
		_rowspan:function(a,c){
			var b = [];//创建一个数组
			var tr = c.find('tr');
			var len = tr.length;
			var th = a.find('thead tr').find('th');
			for(var j =0;j<len; j++) b.push(tr.eq(j).attr('data-row'));//将所有的data-row放入数组中
			var keys = {};//定义一个对象, 用于保存统计数据
			for(var i=b.length; i--;)keys[b[i]] = (keys[b[i]] || 0) + 1;//遍历数组 累计data-row的次数
			for(var i=0;i<len;i++){
				var k = keys[b[i]];//获得次数
				for(var r=0;r<th.length;r++){
					function rowSpan(){//行合并函数
						//如果前后两行的data-row相同
						if( tr.eq(i).attr('data-row') != undefined){
							if(i>0 && tr.eq(i).attr('data-row') == tr.eq(i-1).attr('data-row')){
								tr.eq(i).find('td').eq(r).addClass('lb-td-hide');
								tr.eq(i).addClass('lb-col-group');
								tr.eq(i).find('td').eq(r).addClass('rowspan');
								tr.eq(i).find('td.sort').removeClass('sort')
							}else{
								tr.eq(i).attr('rowspan',k);
								tr.eq(i).find('td').eq(r).attr('rowspan',k);
								if(k>1){
									tr.eq(i).addClass('lb-col-group');
									tr.eq(i).find('td').eq(r).addClass('rowspan');
								}else{
									tr.eq(i).addClass('lb-col-row');
								}
							}
						}
					}
					//判断是否此列需要合并
					if(th.eq(r).attr('data-span') == "true") rowSpan();
				}
			}
		},
		_sort:function(c){//序号数字
			var m = 0;
			c.find('tr').each(function(index,ele) {
				if($(ele).find('td.sort').length >0){
					m++;
					$(ele).find('td.sort-td').text(m);//序号为有n个sort则m = n；
				}else{
					var n = $(ele).prev('tr').find('td.sort-td').text();
					$(ele).find('td.sort-td').text(n);
				}
			});
			this._trEo(c);//添加隔行变色
		},
		_trEo:function(c){//隔行变色
			c.find('tr').each(function(index,ele) {
				var m = $(ele).find('td.sort-td').text();//序号为有n个sort则m = n；
				(m%2 == 0)?($(ele).addClass('odd')):($(ele).addClass('even'));
			});
		},
		_tableEvent:function(a,b,c){//操作设置
			this._hover(c);//鼠标滑过
			var d = this;
			var thead = a.find('table:first').find('thead');
			thead.on('click','th',function(){//点击列头
				var $th = $(this);
				var index = $(this).index();
				d._thSort(a,b,c,$th);//排序功能
				d._rowspan(a,c);
				d._sort(c);//序号排序
			});
			if(b.editor.value == true){//如果存在操作列

			c.on('click','tr a.lb-addtr',function(e){
				d._addtr(a,b,c,e);//添加行
			});
				
				d._deltr(a,b,c);//删除行
			}
		},
		_hover:function(c){/* 添加hover */
			c.on('mouseover','tr',function(ele){
				var e = $(ele.currentTarget);
				if(e.hasClass('even')){
					e.addClass('hover');
					e.nextUntil('.odd','tr').addClass('hover');
					e.prevUntil('.odd','tr').addClass('hover');
				}else{
					e.addClass('hover');
					e.nextUntil('.even','tr').addClass('hover');
					e.prevUntil('.even','tr').addClass('hover');
				}
			}).on('mouseout','tr',function(){
				c.find('tr.hover').removeClass('hover');
			});
		},
		_thSort:function(a,b,c,$th){
			/** 排序功能
			    1.判断是否有排序的样式lb-sort，有则点击列头添加向上的样式，再次点击添加向下的样式
				2.判断是否有合并行 如果有则创建一个数组,非合并行的不排序，此列把合并行的数据放入数组当中；
				3.循环此数组拆分为多维数组，组合到一个新的数组当中
				4.在多维数组中对每个数组进行排序
				5.如果没有合并行则正常排序 
			**/
			var d = this;
			var thead = a.find('table:first').find('thead');
			var len = c.find('tr').length;
			var tr = c.find('tr');
			if($th.hasClass('lb-sort')){//判断是否存在lb-sort
				var type = '';
				var val = $th.index();
				//判断类型
				if($th.hasClass('number')){
					type = 'number';
				}else if($th.hasClass('string')){
					type = 'string';
				}else if($th.hasClass('date')){
					type = 'date';
				}
				groupSort(val,type);
				thClass($th);
			}else{
				return false;
			}
			function thClass($th){//列头添加上下箭头
				thead.find('th').not($th).each(function(index,ele){
					$(ele).removeClass('lb-sort-desc');
					$(ele).removeClass('lb-sort-asc');
				});
				if($th.hasClass('lb-sort-asc')){
					$th.removeClass('lb-sort-asc');
					$th.addClass('lb-sort-desc');
				}else{
					$th.removeClass('lb-sort-desc');
					$th.addClass('lb-sort-asc');
				}
			}
			function tableSort(val,type,isArr){//排序算法 无论是否有合并行
				if(type == "number"){//数字排序
					for(var i =0; i<val.length;i++){//每个tr数组的第i个元素
						for(var j=i+1;j<val.length;j++){//每个tr数组的第i+1个元素
							if(isArr){
								var tr1 = val[i][0].split(".separator")[0];//每个tr数组的第i个元素的此列数据
								var tr2 = val[j][0].split(".separator")[0];//每个tr数组的第i+1个元素的此列数据	
							}else{
								var tr1 = val[i].split(".separator")[0];//每个tr数组的第i个元素的此列数据
								var tr2 = val[j].split(".separator")[0];//每个tr数组的第i+1个元素的此列数据	
							}
							if(parseFloat(tr1) > parseFloat(tr2)){ //比较算法,如果第i>j，则把他俩的顺序交换
								var temp = val[j];
								    val[j] = val[i];
								    val[i] = temp;
							}
						}
					}
				}else if(type == "string" ){//字符串排序
					val.sort();
				}else if(type == "date" ){//日期排序
					var arrMS = new Array();
					var d = new Date();
					d.setHours(0,0,0,0);
					for(var i = 0; i < val.length; i ++) {
						for(var j=i+1;j<val.length;j++){//每个tr数组的第i+1个元素
							if(isArr){
								var tr1 = val[i][0].split(".separator")[0].split('-');//每个tr数组的第i个元素的此列数据
								var tr2 = val[j][0].split(".separator")[0].split('-');//每个tr数组的第i+1个元素的此列数据	
							}else{
								var tr1 = val[i].split(".separator")[0].split('-');//每个tr数组的第i个元素的此列数据
								var tr2 = val[j].split(".separator")[0].split('-');//每个tr数组的第i+1个元素的此列数据	
							}
							var date1 = d.setFullYear(tr1[0],tr1[1] - 1,tr1[2]);//日期转毫秒数
							var date2 = d.setFullYear(tr2[0],tr2[1] - 1,tr2[2]);//日期转毫秒数
							if(parseFloat(date1) > parseFloat(date2)){ //比较算法,如果第i>j，则把他俩的顺序交换
								var temp = val[j];
								    val[j] = val[i];
								    val[i] = temp;
							}
						}
					}
				}
			}
			function groupSort(val,type){//排序操作
				var e = 0;
				var arr = new Array();//如果存在合并列 此数组将把当前列的值拆分成多维数组
				var rowspan = new Array();//存放data-row数组
				//将所有的data-row放入数组中
				for(var j =0;j<len; j++) rowspan.push(tr.eq(j).attr('data-row'));
				var keys = {};//定义一个对象, 用于保存统计数据
			    //遍历数组 累计data-row的次数
				for(var i=rowspan.length; i--;)keys[rowspan[i]] = (keys[rowspan[i]] || 0) + 1;
				var row = new Array(); //存放当前列的值 和当前的id及rowspan 及html
				for(var i = 0; i<len;i++){//将所有tr的内容和id及rowspan存入row中
					row.push(tr.eq(i).find('td').eq(val).html()+ ".separator" + tr.eq(i).html() + ".separator" + tr.eq(i).attr('data-id'));
				}
				while(e<len){//将row拆分成多维数组
					var k = keys[rowspan[e]];
					arr.push(row.slice(e,e+keys[rowspan[e]]));
					e = e+k;
				}
				if(thSortIndex == val){
	                //如果已经排序了则直接倒序
	                (arr.length == len)?(arr.reverse()):($.each(arr,function(n,k){k.reverse()}));               
                } else {
                	//判断是否存在多维数组，如果存在循环多维数组row，不存在直接排序
                	var isArr = true;
                	(arr.length == len)?(tableSort(arr,type,isArr)):($.each(arr,function(n,k){tableSort(k,type)}));
				}
				
				thSortIndex = val;
				//再把多维数组合并成一个数组
				var col = new Array();
				$.each(arr,function(i,k){
					if(k.length>1){for(var j = 0; j<k.length;j++){col.push(k[j])}}else{col.push(k.join(''))};
				});
				//将数组col的内容依次插入到tr中
				for(var i =0;i<row.length; i++){
					tr.eq(i).html(col[i].split(".separator")[1]).attr({"data-id": col[i].split(".separator")[2]});
				}
				d._rowspanDel(c);//删除合并列设置
			}
		},
		_addtr:function(a,b,c,e){
			/**
				添加行
				1.循环整个表格找到当前行和当前的后一行
				2.判断是否有合并行如果有则添加新的tr到当前行的后一行之后，如果没则添加到当前行之后
				3.创建tr，判断操作列的位置，单独处理序号列和操作列，如果有input的则把input加入
			**/
			var trcur = $(e.currentTarget).parents('tr');
			var index = trcur.index();
			var col = $(e.currentTarget).parents('td').attr('rowspan');
			var f =['<tr>'];
			function format(val,item){
				return item;
			}
			function editor(){
				f.push('<td align="'+b.editor.align+'" class="rowspan option">');//创建操作列的内容
				for(var l = 0;l<b.editor.btn.length;l++){//把操作列的按钮插入进来到列尾
					f.push('<a href="javascript:;" class="'+b.editor.btn[l]["class"]+'">'+b.editor.btn[l].name+'</a>');
				}
				f.push('</td>');
			}
			if(b.editor.option == "first") editor();
			var val = '';
			var item = '';
			for(var m = 0; m<b.th.length; m++){
				f.push('<td ');
				if(b.th[m].align) f.push('align="'+b.th[m].align+'"');
				f.push('>');
				if(b.th[m].format) f.push(b.th[m].format(val,item));
				f.push('</td>');
			}
			if(b.editor.option == "last") editor();
			f.push('</tr>');
			var $tr = $(f.join(''));
			//添加序号列
			var g = b.sort;
			if(b.editor.value == true && b.editor.option == "last") var g = b.sort-1;
			var sortHtml = '<td class="sort sort-td" align="center" width="60"></td>';
			$($tr).find('td').eq(g).before(sortHtml);
			//如果存在合并行则在合并行之后添加一行
			(b.editor.rowspan==true && col>=2)?(c.find('tr').eq(parseInt(index)+parseInt(col)-1).after($tr)):(trcur.after($tr));
			this._sort(c);//序号排序
			e.stopPropagation();//阻止冒泡
		},
		_deltr:function(a,b,c){
			/*
				删除行
				判断操作列是否合并，如果合并则合并行的都移除
				否则只移除当前行
				重新合并和序号排序
			*/
			var d =  this;
			c.on('click','tr a.lb-deltr',function(e){
				var trcur = $(e.currentTarget).parents('tr');
				var index = trcur.index();
				var col = $(e.currentTarget).parents('td').attr('rowspan');
				d._rowspanDel(c);//注销合并行
				if(b.editor.rowspan==true && col>=2){
					var f = parseInt(index)+parseInt(col-1);//找到合并行之后的一行
					for(var i = f; i >= parseInt(index); i--){//移除rowspan的行自下而上
						c.find('tr').eq(i).remove();
					}	
				}else {
					trcur.remove();
				}
				d._rowspan(a,c);//合并行
				d._sort(c);//序号排序
				e.stopPropagation();//阻止冒泡
			});
		},
		_tablePopHtml:function(opt){
			//获得json 填充tbody
			$.getJSON(opt.pop.popurl,function(data){
				var tr = new Array(); 
				$.each(data, function(i,k){
					tr.push('<tr id="'+k.id+'">');
				    tr.push('<td align="center"></td>');
					for(var b= 0; b< k.tr.length; b++){
						tr.push('<td>'+k.tr[b]+'</td>');
					}
					tr.push('</tr>');
				$('#lbTablePop').find('tbody').append(tr.join(''));
				});
				//给pop添加排序 有n个tr 序号为n
				$('#lbTablePop').find('tbody tr').each(function(index){
					$(this).find('td:first').text(index+1);
				});
			});
		},
		_tablePop:function(self,opt,tbody){
			var that = this;
			//构造tablePop框架
			var tablePop = new Array();
			tablePop.push('<div id="lbTablePop" style="display:none; width:'+opt.pop.widthAll+'px; z-index:999;');
			if(opt.pop.height != ''){
				tablePop.push(' height:'+opt.pop.height+'px; overflow:auto; ');
			}
			tablePop.push('"><table  class="'+opt.pop["class"]+'" cellspacing="0" cellpadding="0" width="100%"><thead><tr>');
			for(var a =0; a < opt.pop.title.length; a++){
				tablePop.push('<th ');
				if(opt.pop["width"][a]){
					tablePop.push('width="'+opt.pop["width"][a]+'"');
				}
				tablePop.push(' >');
				tablePop.push(' '+opt.pop.title[a]+'</th>');
			}
			tablePop.push('</tr></thead><tbody></tbody></table></div>');
			self.append(tablePop.join(''));
			$(document).on('click', function() {//关闭弹出
                  $('#lbTablePop').css('display','none');
             });
			//输入文字时
			tbody.on('click keyup','tr .'+opt.pop.col+'',function(evet){
				//显示弹出table并设置弹出位置
				that._tablePopHtml(opt);
                var trTop = $(this).offset().top+30;
                var trLeft = $(this).offset().left - 50;
				$('#lbTablePop').css({"display":"block","position":"absolute","left":trLeft,"top":trTop});
				$(this).parents('tr').addClass('choose');
				event.stopPropagation(); //阻止冒泡
			});
			//选择并赋值
			self.on('click','#lbTablePop tbody tr',function(e){
				var tr = tbody.find('tr.choose');
              	var len = $(this).find('td').length;
              	for(var n=0; n<len;n++){
              		var txt =  $(this).find('td').eq(n).text();
              		if(opt.editor.value == true && opt.editor.option == "first"){
              			if(tr.find('td').eq(n+1).has('input').length>0){
							tr.find('td').eq(n+1).find('input').val(txt);
              			}else{
							tr.find('td').eq(n+1).text(txt);
              			}
              		}else{
              			if(tr.find('td').eq(n).has('input').length>0){
							tr.find('td').eq(n).find('input').val(txt);
              			}else{
							tr.find('td').eq(n).text(txt);
              			}
              		}	  
              		$('#lbTablePop').css('display','none');
              		tbody.find('tr.choose').removeClass('choose');         		
              	}
              	e.stopPropagation(); //阻止冒泡
              	that._sort(tbody);//序号排序
            });
		}
	};
	$.fn.lbTables = function(options) {
		//创建Beautifier的实体
		var lbTable = new lbTables(this, options);
		//调用其方法
		return this;
	};
	//参数设置
	$.fn.lbTables.defaults = {
		id:'',//table下的tbody添加id 默认情况下不用设置
		data:'',//json地址url 
		style:'',//table添加样式 默认情况下不用设置
		width:'',//table宽度
		th:[],//列设置
		sort:'',//序号设置
		editor:{},//操作列设置
		pop:{},//弹出设置
		afterLoad:null,//加载完成后操作接口
		events:true
	}
})(jQuery, window , document);