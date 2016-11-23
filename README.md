# lb.tables.js

## 功能

- 获得json数据动态加载
- 自定义样式和宽度的表格及给tbody设置id;
- 可设置序号列的位置;
- 每列的对齐方式，宽度，是否合并，点击排序，添加样式，及自定义返回函数;
- 添加操作列在首列或尾列,操作列的意义为增加或删除每行;
- 弹出层表格;
- 可多次加载（导入功能）;
- 获得表格数据（保存功能）;

## 演示页面,[demo](http://1.lbtables.applinzi.com/demo.html)

## 使用方法
#### 1.引入lb.tables.css,jqurey.js,lb.tables.js; 
``` bash
<link type="text/css" href="css/lb.tables.css" rel="stylesheet" />
<script src="js/jquery.js"></script>
<script src="js/lb.tables.js"></script>
<script src="js/lb.tables.event.js"></script><!-- 使用保存表格时候用到 --->
<script src="js/perfect-scrollbar.with-mousewheel.min.js"></script> <!--- 引用网上美化滚动条插件 --->
```
#### 2.html
``` bash
<div class="options"><!--操作表格的按钮 --->
	<button id="reloadBtn">reolad</button>
	<button id="save">save</button>
	<button id="setHide">setHide</button>
</div>
<div id="demo1" class="lb-tables-warp"></div><!-- 绑定表格的div --->
<div class="demo2"></div><!-- 绑定表格的div --->
```
#### 3.设置列属性如下
``` bash 
var col = [
  {
    "title":"全选",//列标题
    "width":"120",//每列的宽度
    "align":"center",//对齐方式 left center right
    "rowspan":true,//这列是否存在合并
    "format":function(val,item){//供用户自定义操作，此列返回为checkbox
      return '<input type="checkbox">'
    }
  },{
    "title":"物品编号",//列标题
    "width":"120",//每列的宽度
    "align":"left",//对齐方式
    "rowspan":true, //这列是否存在合并列
    "format":function(val,item){//供用户自定义操作，此列返回为带有span的值
      return '<span>'+val+'</span>'
    }
  },{
    "title":"物料名称",//列标题
    "width":"500",//每列的宽度
    "align":"center",//对齐方式
    "class":"red",//此列上添加的样式，此列为红色
    "format":function(val,item){//供用户自定义操作，
      if(val == ''){//此列返回为如果值为空则返回一个type为text的input
        return '<input type="text" class="table-text" value="'+val+'" placeholder="请输入"/>';
      }else{//否则返回值且后面带有一个自定义的span标签
        return val+' <span class="bq">终止</span>';
      }
    }
  },{
    "title":"规格型号",//列标题
    "width":"200",//每列的宽度
    "align":"left",//对齐方式
    "rowspan":true//这列是否存在合并列
  },{
    "title":"品质描述",//列标题
    "width":"200",//每列的宽度
    "align":"left"//对齐方式
  },{
    "title":"质量标准",//列标题
    "width":"200",//每列的宽度
    "align":"left",//对齐方式
    "rowspan":true//这列是否存在合并列
  },{
    "title":"包装规格",//列标题
    "width":"200",//每列的宽度
    "align":"left",//对齐方式
    "class":"lb-sort string"//设置排序和字符串string类型
  },{
    "title":"含税单价",//列标题
    "width":"200",//每列的宽度
    "class":"lb-sort number",//设置排序和数字number类型
    "align":"right"//对齐方式
  },{
    "title":"订单数量",//列标题
    "width":"200",//每列的宽度
    "align":"right"//对齐方式
  },{
    "title":"含税金额",//列标题
    "width":"200",//每列的宽度
    "align":"right",//对齐方式
    "class":"red lb-sort number"//设置排序和字符串string类型
  },{
    "title":"日期",//列标题
    "width":"200",//每列的宽度
    "align":"right",//对齐方式
    "class":"lb-sort date"//设置排序和日期date类型
  }
];
```
#### 4.设置使用lb.tables.js插件并设置参数
``` bash
$('#demo1').lbTables({//给外容器绑定控件
  "id":'lbTables',//table下的tbody添加id 默认情况下不用设置 如果已有表格存在不需要此项
  "data":'js/data.json',//ajax地址url
  "get":{"name":"lb"},//get传递参数
  "width":"1500",//表格整体宽度
  "class":'lb-table',//table添加样式 默认情况下不用设置 如果已有表格存在不需要此项
  "th":col,//表格每列属性设置
  "sort":'1',//序号列放入到第n列这里填写n
  "editor":{//单独控制操作列 
    "value":true, //是否显示操作列 如果为false 则其他参数可不用设置
    "name":"操作",//列标题
    "width":'200',//列宽度
    "option":"last",//在列首还是列尾 参数值 first last
    "align":'center',//列对齐方式
    "btn":[{
      "class":"blue1 lb-deltr",//样式 删除的按钮标示class为 lb-deltr
      "name":"删除"
    }],
    "rowspan":false//控制操作列是否合并
  },
  afterLoad:function(){}//表格加载完毕之后的操作接口
});
```

### 额外设置
#### 1.表格导入功能
``` bash 
$('#reloadBtn').bind('click',function(){//页面添加导入按钮
  $('#demo1').lbTables({//对已经加载过数据的表格进行追加
    //"id":'lbTables',//table下的tbody添加id 默认情况下不用设置 如果已有表格存在不需要此项
    "data":'js/data3.json',//导入的ajax地址url
    "get":{"name":"lb"},//get传递参数
    //"class":'lb-table',//table添加样式 默认情况下不用设置 如果已有表格存在不需要此项
    "th":col,//表格每列属性设置
    "sort":'1',//序号列放入到第n列这里填写n
    "editor":{//控制操作列 
      "value":true, //是否显示操作列 如果为false 则其他参数可不用设置
      "name":"操作",//列标题
      "width":'200',//列宽度
      "option":"last",//在列首还是列尾 参数值 first last
      "align":'center',//列对齐方式 left center right
      "btn":[{
        "class":"blue1 lb-deltr",//样式 删除的按钮标示class为 lb-deltr
        "name":"删除"
      }],
      "rowspan":false//控制操作列是否合并
    },
    afterLoad:function(){//表格加载完毕之后的操作接口
        //初始时设置了隐藏列
        if($('#setHide').hasClass('seted')){
          $.each(arr,function(i,k){
          $('#demo1 .lb-table:first').find('tr').each(function(){
            $(this).find('th').eq(k).addClass('col-hide');
            $(this).find('td').eq(k).addClass('col-hide');
          });
        });
        }
    }
  });
});
```
#### 2.设置隐藏列
``` bash
afterLoad:function(){//表格加载完毕之后的操作接口
  //隐藏列设置
  var arr = [2,4,5,6];
  $.each(arr,function(i,k){
    $('.lb-table').find('tr').each(function(){
      $(this).find('th').eq(k).addClass('col-hide');
      $(this).find('td').eq(k).addClass('col-hide');
    });
  });
}
 ```
#### 3.设置输入弹出
在afterLoad前加入
``` bash
"pop":{
  "bool":true,//input点击或输入弹出层
  "title":["序号","物品编号","物品名称","规格型号","匹配平台类别"],//弹出的表头
  "class":"lb-table",//弹出的table的样式
  "height":"100",//高度
  "widthAll":"500",//宽度
  "width":["50","40"],//单元格的宽度
  "popurl":"js/table.json",//输入弹出的ajax url
  "col":"table-text"//关联的input找到带有table-text的input
},
```
#### 4.保存数据
引入lb.tables.event.js
页面中绑定保存按钮,成功之后会在body结尾处添加隐藏域
``` bash
afterLoad:function(){
  $('#save').bind('click',function(){
    $('body').find('.dataPost').remove();
    $.fn.lbTablesEvent({
      "save":{
        "id":"#lbTables",//保存的表格的id
        "list":["wpbh","zlbz","43ew"],//键值名
        "eq":[1,5,6]//取第几列的值
      }
    });
  })	
}
```

## 参数列表
<table>
  <thead>
     <tr>
       <th>参数名称</th>
       <th>参数值（举例）</th>
       <th>参数说明</th>
    </tr>
  </thead>
  <tbody>
  <tr>
    <th>id</th>
    <td>"lbTables"</td>
    <td>table下的tbody添加id   如果已有表格存在不需要此项</td>
  </tr>
  <tr>
    <th>data</th>
    <td>"js/data.json"</td>
    <td>ajax的url</td>
  </tr>
  <tr>
    <th>get</th>
    <td>{"name":"lb"}</td>
    <td>get传递的参数</td>
  </tr>
  <tr>
    <th>width</th>
    <td>"100%","1500"</td>
    <td>表格整体宽度</td>
  </tr>
  <tr>
    <th>class</th>
    <td>"lb-table"</td>
    <td>table添加样式 如果已有表格存在不需要此项，ie下class必须加上引号</td>
  </tr>
  <tr>
    <th>sort</th>
    <td>"2"</td>
    <td>设置序号列的位置</td>
  </tr>
  <tr>
    <th>th</th>
    <td colspan="2">
      <table>
        <tr>
          <th colspan="3">以数组形式设置列属性</th>
        </tr>
        <tr>
          <th>title</th>
          <td>"全选"</td>
          <td>设置此列列标题</td>
        </tr>
         <tr>
          <th>width</th>
          <td>"120"</td>
          <td>设置此列宽度</td>
        </tr>
         <tr>
          <th>align</th>
          <td>"left","center","right"</td>
          <td>设置此列对齐方式</td>
        </tr>
         <tr>
          <th>rowspan</th>
          <td>true，false"</td>
          <td>设置此列是存在合并</td>
        </tr>
         <tr>
          <th>class</th>
          <td>"red lb-sort string"</td>
          <td>设置此列的样式<span style="color:#f00">如需排序功能需添加样式名“lb-sort”及此列的属性“string”,“number”,“date”</span></td>
        </tr>
         <tr>
          <th>format</th>
          <td>
          function(val,item){
						if(val == ''){//此列返回为如果值为空则返回一个type为text的input
							return '<input type="text" class="table-text" value="'+val+'" placeholder="请输入"/>';
						}else{//否则返回值且后面带有一个自定义的span标签
							return val+' <span class="bq">终止</span>';
						}
          </td>
          <td>设置此列的回调操作</td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <th>editor</th>
    <td colspan="2">
      <table>
        <tr>
          <th colspan="3">设置操作列</th>
        </tr>
        <tr>
          <th>value</th>
          <td>true,false</td>
          <td>是否显示操作列 如果为false 则其他参数可不用设置</td>
        </tr>
         <tr>
          <th>name</th>
          <td>"操作"</td>
          <td>设置操作列标题</td>
        </tr>
         <tr>
          <th>option</th>
          <td>"first","last"</td>
          <td>在列首还是列尾</td>
        </tr>
         <tr>
          <th>align</th>
          <td>"left","center","right"</td>
          <td>列对齐方式</td>
        </tr>
         <tr>
          <th>width</th>
          <td>"200"</td>
          <td>操作列的宽度</td>
        </tr>
         <tr>
          <th>rowspan</th>
          <td>true，false</td>
          <td>设置操作列是否合并</td>
        </tr>
         <tr>
          <th>btn</th>
          <td>[{"class":"blue1 lb-addtr", "name":"添加"},{"class":"blue1 lb-deltr", "name":"删除"},]</td>
          <td>设置操作列的操作按钮的名称及样式,<span style="color:#f00">添加行操作添加样式名“lb-addtr”，删除行操作添加样式名“lb-deltr”</span></td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <th>pop</th>
    <td colspan="2">
    	<table>
	  <tr>
	    <th colspan="3">设置输入弹出表格</th>
	  </tr>
	  <tr>
	    <th>bool</th>
	    <td>true,false</td>
	    <td>是否创建弹出层</td>
	  </tr>
	  <tr>
	    <th>title</th>
	    <td>["序号","物品编号","物品名称","规格型号","匹配平台类别"]</td>
	    <td>设置弹出层表格的列标题</td>
	  </tr>
	  <tr>
	    <th>class</th>
	    <td>“lb-table”</td>
	    <td>设置弹出的table的样式， ie下class必须加上引号</td>
	  </tr>
	  <tr>
	    <th>height</th>
	    <td>“200”</td>
	    <td>设置弹出层的高度，超过此高度出现滚动条</td>
	  </tr>
	  <tr>
	    <th>widthAll</th>
	    <td>“400”</td>
	     <td>设置弹出层表格的宽度</td>
	  </tr>
	  <tr>
	    <th>width</th>
	    <td>["50","40"]</td>
	     <td>设置弹出层表格的每列的宽度</td>
	  </tr>
	  <tr>
	    <th>popurl</th>
	    <td>"js/table.json"</td>
	     <td>弹出层表格ajax的url</td>
	  </tr>
	  <tr>
	    <th>col</th>
	    <td>"table-text"</td>
	     <td>关联到主表格的input，找到含有此样式（“table-text”）的input添加弹出层设置</td>
	  </tr>
	</table>
    </td>
  <tr>
  <tr>
      <th>afterLoad</th>
      <td>function(){}</td>
      <td>表格加载完毕之后的回调函数</td>
  </tr>
  </tbody>
</table>
