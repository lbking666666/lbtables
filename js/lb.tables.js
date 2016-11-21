;(function($, window, document, undefined){
	/*
	 * lbTables
	 * 作者：吕彬 
	 * Q Q : 286504720
	 * tables jQuery plugin
	 * 
	 */
	'use strict';//使用严格模式
	var lbTables = function(ele,opt){
		this.$element = ele,
		this.options =  $.extend(true,{},$.fn.lbTables.defaults, opt);//传入参数
		this._init(this.$element,this.options);//初始化
	}
	var events = true;
	var thSortIndex = null;
	lbTables.prototype = {
		/**
			@self:当前的容器
			@opt:传入进来的参数
		**/
		_init:function(self,opt){
			this._tablesHtml(self,opt);//构建table的html结构
		},
		_tablesHtml:function(self,opt){
			/**
				构建table框架：把width（表格宽度）和class（表格样式）放入table中创建table数组存放table的html结构
				一、判断当前容器下是否存在table
				二.构造thead：创建thead数组存放thead的html结构
					1.把传入的th的title（名称），width（宽度），class（样式），rowspan（此列是否合并行）属性放入的th
					2.判断是否存在操作列，如存在在首列还是在尾列，并放入th的数组中
					3.获得序号列数，将序号列插入到thead中
				三.获得数据插入到tbody中 _tableGetJson
			**/
			if(self.find('table').length == 0){
				//构造table的框架
				var table = new Array();//创建table数组
				table.push('<table cellpadding="0" cellspacing="0"');
				if(opt.width){
					table.push(' width="'+opt.width+'"');
				}
				if(opt.class){
					table.push(' class="'+opt.class+'"');
				}
				table.push(' >');
				var thead = new Array();//创建thead数组
				var m = opt.sort;//获得序号列的排序数
				thead.push('<thead><tr>');
				if(opt.editor.value == true && opt.editor.option == "first"){//是否存在操作列及是否为第一列
					thead.push('<th width="'+opt.editor.width+'" ');
					if(opt.editor.rowspan == true){
						thead.push('data-span="true"');
					}
					thead.push('>'+opt.editor.name+'</th>');
				}
				for(var i = 0; i<opt.th.length; i++){
					thead.push('<th ');
					if(opt.th[i].class){
						thead.push('class="'+opt.th[i].class+'" ');
					}
					if(opt.th[i].width){
						thead.push('width="'+opt.th[i].width+'" ');
					}
					if(opt.th[i].rowspan){
						thead.push('data-span="true"');
					}
					thead.push('>');
					thead.push(opt.th[i].title);
					thead.push('</th>');
				}
				if(opt.editor.value == true && opt.editor.option == "last"){//是否存在操作列及是否为最后列
					thead.push('<th width="'+opt.editor.width+'" ');
					if(opt.editor.rowspan == true){
						thead.push('data-span="true"');
					}
					thead.push('>'+opt.editor.name+'</th>');
				}
				thead.push('</tr></thead>');
				var $thead = thead.join('');
				table.push($thead);
				table.push('<tbody id="'+opt.id+'"></tbody></table>');
				var $table = $(table.join(''));
				self.append($table);//表格插入到当前容器
				//插入编号列
				m = opt.sort -1;
				var thSort = $('<th class="sort" data-span="true" width="60">序号</th>');	
				self.find('thead tr').find('th').eq(m).before(thSort);		
			}
			//获得json 填充tbody
			this._tableGetJson(self,opt);
		},
		_tableGetJson:function(self,opt){
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
			var tbody = self.find('table:first').find('tbody');//当前的tbody
			var that = this;
			//获得json 填充tbody
			$.ajax({
				url: opt.data,
				type: 'get',
				dataType: 'json',
				data: opt.get,
			})
			.done(function(json) {
				//var json = $.parseJSON(data);
				//构造tr结构
				var tr = [];
				$.each(json, function(i,k){
					tr.push('<tr data-id="'+k.id+'" data-row="'+k.rowspan+'">');
					//操作列
					var editor = [];
					function opption(){
						editor.push('<td');
						if(opt.editor.align){
							editor.push(' align="'+opt.editor.align+'"');
						}
						editor.push('>')
						for(var l = 0;l<opt.editor.btn.length;l++){//把操作列的按钮插入进来
							editor.push('<a href="javascript:;" class="'+opt.editor.btn[l].class+'">'+opt.editor.btn[l].name+'</a>');
						}
						editor.push('</td>');
						tr.push(editor.join(''));
					}
					if(opt.editor.value == true && opt.editor.option == "first"){//是否存在操作列及是否为第一列
						opption();
					}
					for(var n=0;n<k.list.length;n++){
						tr.push('<td ');
						if(opt.th[n].class){
							tr.push('class="'+opt.th[n].class+'" ');
						}
						if(opt.th[n].align){
							tr.push('align="'+opt.th[n].align+'" ');
						}
						tr.push('>');
						var item = '';
						if(opt.th[n].format){//添加自定义操作到数组中
							var val =$.trim(k.list[n]);//去除空格
							tr.push(opt.th[n].format(val,item));
						}else{
							tr.push($.trim(k.list[n]));
						}
						tr.push('</td>');
					}
					if(opt.editor.value == true && opt.editor.option == "last"){//是否存在操作列及是否为尾列
						opption();
					}
					function format(val,item){//自定义操作
						return item;
					}
					tr.push('</tr>');
				});
				var $tr = $(tr.join(''));
				//添加序号列
				if(opt.editor.value == true && opt.editor.option == "first"){
					var m = opt.sort;
				}else{
					var m = opt.sort-1;
				}
				var sortHtml = '<td class="sort sort-td" align="center" width="60"></td>';
				$.each($tr,function(i,k){
					$(k).find('td').eq(m).before(sortHtml);

				});
				//判断是否是第一次加载数据
				if(self.find('tbody tr').length == 0){
					var th = self.find('thead th');
					if(json.length == 0){//如果数据为空则显示无数据
						tr.push('<tr class="kng"><td align="center" colspan="'+th.length+'">暂无数据！</td></tr>');
						self.find('tbody').append(tr);
					}else{
						self.find('tbody').append($tr);
						that._rowspan(self,tbody,opt);//合并行
						that._sort(tbody);//序号
					}
				}else{//再次导入时
					var idIndexTr = [];
					var rowIndexTr = [];
					that._rowspanDel(tbody);
					if($tr.length != 0) self.find('tbody').find('tr.kng').remove()
					for(var i =0; i<self.find('tbody tr').length;i++){
						var rowIndex = self.find('tbody tr').eq(i).attr('data-row');
						var idIndex = self.find('tbody tr').eq(i).attr('data-id');
						idIndexTr.push(idIndex);
						rowIndexTr.push(rowIndex);
					}
					for(var i=0;i<json.length;i++){
						var idData = json[i].id;
						var rowData = json[i].rowspan;
						if($.inArray(idData, idIndexTr) == -1){//不存在重复id
							if($.inArray(rowData, rowIndexTr) == -1){
								self.find('tbody').append($tr[i]);
								rowIndexTr.push(rowData);
							}else{
								var j = $.inArray(rowData, rowIndexTr);
								self.find('tbody tr').eq(j).removeClass('lb-col-row');
								self.find('tbody tr').eq(j).before($tr[i]);
								rowIndexTr.splice(j, 0, rowData);
							}
						}
					}
					that._rowspan(self,tbody,opt);//合并行
					that._sort(tbody);//序号
				}
			})
			.fail(function() {
				console.log("error");
			})
			.always(function() {
				$.isFunction(opt.afterLoad) && opt.afterLoad.call(that);
				if(events){
					that._tableEvent(self,opt,tbody);//事件函数
				}
				if(opt.pop.bool == true){//是否存在弹出table
					that._tablePop(self,opt,tbody);
				}
			});
		},
		_rowspanDel:function(tbody){
			tbody.find('tr').each(function(){
				$(this).removeAttr('rowspan');
				$(this).find('td.lb-td-hide').removeClass('lb-td-hide');
				$(this).find('td.rowspan').removeClass('rowspan');
				$(this).find('td.sort-td').addClass('sort');
			});
		},
		_rowspan:function(self,tbody,opt){
			var rowspan = [];//创建一个数组
			var tr = tbody.find('tr');
			var len = tr.length;
			var th = self.find('thead tr').find('th');
			for(var j =0;j<len; j++) rowspan.push(tr.eq(j).attr('data-row'));//将所有的data-row放入数组中
			var keys = {};//定义一个对象, 用于保存统计数据
			for(var i=rowspan.length; i--;)keys[rowspan[i]] = (keys[rowspan[i]] || 0) + 1;//遍历数组 累计data-row的次数
			for(var i=0;i<len;i++){
				var k = keys[rowspan[i]];//获得次数
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
					if(th.eq(r).attr('data-span') == "true"){
						rowSpan();
					}
				}
			}
		},
		_sort:function(tbody){//序号数字
			var m = 0;
			tbody.find('tr').each(function() {
				if($(this).find('td.sort').length >0){
					m++;
					$(this).find('td.sort-td').text(m);//序号为有n个sort则m = n；
				}else{
					var n = $(this).prev('tr').find('td.sort-td').text();
					$(this).find('td.sort-td').text(n);
				}
			});
			this._trEo(tbody);//添加隔行变色
		},
		_trEo:function(tbody){//隔行变色
			tbody.find('tr').each(function() {
				var m = $(this).find('td.sort-td').text();//序号为有n个sort则m = n；
				if(m%2 == 0){
					$(this).addClass('odd');
				}else{
					$(this).addClass('even');
				}
			});
		},
		_tableEvent:function(self,opt,tbody){//操作设置
			this._hover(tbody);//鼠标滑过
			var that = this;
			var thead = self.find('table:first').find('thead');
			thead.on('click','th',function(){//点击列头
				var $th = $(this);
				var index = $(this).index();
				that._thSort(self,opt,tbody,$th);//排序功能
				that._rowspan(self,tbody,opt);
				that._sort(self,tbody,opt);
			});
			if(opt.editor.value == true){//如果存在操作列
				that._addtr(opt,tbody);//添加行
				that._deltr(self,opt,tbody);//删除行
			}
			events = false;
		},
		_hover:function(tbody){/* 添加hover */
			tbody.on('mouseover','tr',function(){
				if($(this).hasClass('even')){
					$(this).addClass('hover');
					$(this).nextUntil('.odd','tr').addClass('hover');
					$(this).prevUntil('.odd','tr').addClass('hover');
				}else{
					$(this).addClass('hover');
					$(this).nextUntil('.even','tr').addClass('hover');
					$(this).prevUntil('.even','tr').addClass('hover');
				}
			}).on('mouseout','tr',function(){
				tbody.find('tr.hover').removeClass('hover');
			});
		},
		_thSort:function(self,opt,tbody,$th){
			/** 排序功能
			    1.判断是否有排序的样式lb-sort，有则点击列头添加向上的样式，再次点击添加向下的样式
				2.判断是否有合并行 如果有则创建一个数组,非合并行的不排序，此列把合并行的数据放入数组当中；
				3.循环此数组拆分为多维数组，组合到一个新的数组当中
				4.在多维数组中对每个数组进行排序
				5.如果没有合并行则正常排序 
			**/
			var that = this;
			var thead = self.find('table:first').find('thead');
			var len = tbody.find('tr').length;
			var tr = tbody.find('tr');
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
				thead.find('th').not($th).each(function(){
					$(this).removeClass('lb-sort-desc');
					$(this).removeClass('lb-sort-asc');
				});
				if($th.hasClass('lb-sort-asc')){
					$th.removeClass('lb-sort-asc');
					$th.addClass('lb-sort-desc');
				}else{
					$th.removeClass('lb-sort-desc');
					$th.addClass('lb-sort-asc');
				}
			}
			function tableSort(val,type){//排序算法 无论是否有合并行
				if(type == "number"){//数字排序
					for(var i =0; i<val.length;i++){//每个tr数组的第i个元素
						for(var j=i+1;j<val.length;j++){//每个tr数组的第i+1个元素
							var tr1 = val[i]//.split(".separator")[0];//每个tr数组的第i个元素的此列数据
							var tr2 = val[j]//.split(".separator")[0];//每个tr数组的第i+1个元素的此列数据
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
					new Date(Date.parse(val));
					val.reverse()
				}
			}
			function groupSort(val,type){//排序操作
				var d = 0;
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
				while(d<len){//将row拆分成多维数组
					var k = keys[rowspan[d]];
					arr.push(row.slice(d,d+keys[rowspan[d]]));
					d = d+k;
				}
				if(thSortIndex == val){
				/*if ($th.hasClass('lb-sort-asc') || $th.hasClass('lb-sort-desc') ) {*/
	                //如果已经排序了则直接倒序
	                (arr.length == len)?(arr.reverse()):($.each(arr,function(n,k){k.reverse()}));               
                } else {
                	//判断是否存在多维数组，如果存在循环多维数组row，不存在直接排序
                	(arr.length == len)?(tableSort(arr,type)):($.each(arr,function(n,k){tableSort(k,type)}));
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
				that._rowspanDel(tbody);//删除合并列设置
			}
		},
		_addtr:function(opt,tbody){
			/**
				添加行
				1.循环整个表格找到当前行和当前的后一行
				2.判断是否有合并行如果有则添加新的tr到当前行的后一行之后，如果没则添加到当前行之后
				3.创建tr，判断操作列的位置，单独处理序号列和操作列，如果有input的则把input加入
			**/
			var that =  this;
			tbody.on('click','tr a.lb-addtr',function(e){
				var trcur = $(this).parents('tr');
				var index = trcur.index();
				var col = $(this).parents('td').attr('rowspan');
				var trnext = trcur.next('tr');
				var row = trcur.attr('data-row');
				var rowNext = trnext.attr('data-row');
				var tr =[];
				tr.push('<tr>');
				function format(val,item){
					return item;
				}
				function editor(){
					tr.push('<td align="'+opt.editor.align+'" class="rowspan option">');//创建操作列的内容
					for(var l = 0;l<opt.editor.btn.length;l++){//把操作列的按钮插入进来到列尾
						tr.push('<a href="javascript:;" class="'+opt.editor.btn[l].class+'">'+opt.editor.btn[l].name+'</a>');
					}
					tr.push('</td>');
				}
				if(opt.editor.option == "first")editor();
				for(var m = 0; m<opt.th.length; m++){
					tr.push('<td ');
					if(opt.th[m].align != undefined){
						tr.push('align="'+opt.th[m].align+'"');
					}
					tr.push('>');
					if(opt.th[m].format != undefined){
						var val = '';
						var item = '';
						tr.push(opt.th[m].format(val,item));
					}
					tr.push('</td>');
				}
				if(opt.editor.option == "last")editor();
				tr.push('</tr>');
				var $tr = tr.join('');
				var $tr = $(tr.join(''));
				//添加序号列
				if(opt.editor.value == true && opt.editor.option == "first"){
					var m = opt.sort;
				}else{
					var m = opt.sort-1;
				}
				var sortHtml = '<td class="sort sort-td" align="center" width="60"></td>';
				$($tr).find('td').eq(m).before(sortHtml);
				if(row != '' && row != undefined && row == rowNext){//两行data-row相同 则合并行
					var addIndex = parseInt(index)+parseInt(col);//找到合并行之后的一行
					tbody.find('tr').eq(addIndex-1).after($tr);
				}else{
					trcur.after($tr);
				}
				that._sort(tbody);//序号排序
				e.stopPropagation();
			});
		},
		_deltr:function(self,opt,tbody){
			/**
				删除行
				判断是否存在相同的data-row（除去空值和undefined）值
				如果存在则删除当前行和下一行，否则删除当前行
			**/
			var that =  this;
			tbody.on('click','tr a.lb-deltr',function(e){
				var len = tbody.find('tr').length;
				var trcur = $(this).parents('tr');
				var index = trcur.index();
				var col = $(this).parents('td').attr('rowspan');
				var trnext = trcur.next('tr');
				var row = trcur.attr('data-row');
				var rowNext = trnext.attr('data-row');
				if(opt.editor.rowspan==true){
					if(col>=2){
						var addIndex = parseInt(index)+parseInt(col-1);//找到合并行之后的一行
						for(var i =addIndex;i>=parseInt(index);i--){//移除rowspan的行自下而上
							$(this).parents('tbody').find('tr').eq(i).remove();
						}
					}else{
						trcur.remove();
					}
				}else {
					trcur.remove();
				}
				that._rowspanDel(tbody);
				that._rowspan(self,tbody,opt);
				that._sort(tbody);
				e.stopPropagation();
			});
		},
		_tablePopHtml:function(opt){
			//获得json 填充tbody
			$.getJSON(opt.pop.popurl,function(data){
				$.each(data, function(i,k){
					var tr = '<tr id="'+k.id+'">';
						tr += '<td align="center"></td>';
					for(var b= 0; b< k.tr.length; b++){
						tr += '<td>'+k.tr[b]+'</td>';
					}
						tr += '</tr>';
				$('#lbTablePop').find('tbody').append(tr);
				});
				_popsort();
				//给pop添加排序 有n个tr 序号为n
				function _popsort(){
					$('#lbTablePop').find('tbody tr').each(function(index){
						$(this).find('td:first').text(index+1);
					});
				}
			});
		},
		_tablePop:function(self,opt,tbody){
			var that = this;
			//构造tablePop框架
			if(opt.pop.height != ''){
				var tablePop = '<div id="lbTablePop" style="display:none; height:'+opt.pop.height+'px;width:'+opt.pop.widthAll+'px;overflow:auto; z-index:999;"><table  class="'+opt.pop.class+'" cellspacing="0" cellpadding="0" width="100%"><thead><tr>';
			}else{
				var tablePop = '<div id="lbTablePop" style="display:none; width:'+opt.pop.widthAll+'px; z-index:999;"><table  class="'+opt.pop.class+'" cellspacing="0" cellpadding="0" width="100%"><thead><tr>';
			}
			for(var a =0; a < opt.pop.title.length; a++){
				if(opt.pop.width.length>0){
					if(opt.pop.width[a] == undefined){
						tablePop += '<th>'+opt.pop.title[a]+'</th>';
					}else{
						tablePop += '<th width="'+opt.pop.width[a]+'">'+opt.pop.title[a]+'</th>';
					}
				}else{
					tablePop += '<th>'+opt.pop.title[a]+'</th>';
				}
			}
			tablePop += '</tr></thead><tbody></tbody></table></div>';
			self.append(tablePop);
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
	}
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
		class:'',//table添加样式 默认情况下不用设置
		width:'',//table宽度
		th:[],//列设置
		sort:'',//序号设置
		editor:{},//操作列设置
		pop:{},//弹出设置
		afterLoad:null//加载完成后操作接口
	}
})(jQuery, window , document);