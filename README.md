# lb.tables表格控件

## 演示页面,<a href="http://1.lbtables.applinzi.com/demo.html" target="_blank">demo</a>

## 使用方法
#### 1.引入lb.tables.css,jqurey,lb.tables.js; 
#### 2.绑定table的容器,例如$('#demo1').lbTables({});
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
    "rowspan":true, //这列是否存在合，
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
    "align":"left"//对齐方式
  },{
    "title":"品质描述",//列标题
    "width":"200",//每列的宽度
    "align":"left",//对齐方式
    "rowspan":true,
  },{
    "title":"质量标准",//列标题
    "width":"200",//每列的宽度
    "align":"left"//对齐方式
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
    "class":"red lb-sort string",//设置排序和字符串string类型
  },{
    "title":"计量单位",//列标题
    "width":"200",//每列的宽度
    "align":"right",//对齐方式
    "class":"lb-sort date",//设置排序和日期date类型
  }
];
```
#### 4.设置表格属性
``` bash
$('#demo1').lbTables({//给外容器绑定控件
  id:'lbTables',//table下的tbody添加id 默认情况下不用设置 如果已有表格存在不需要此项
  data:'js/data.json',//ajax地址url
  get:{"name":"lb"},//get传递参数
  width:"100%",//表格整体宽度
  class:'lb-table',//table添加样式 默认情况下不用设置 如果已有表格存在不需要此项
  th:col,//表格每列属性设置
  sort:'1',//序号列放入到第n列这里填写n
  editor:{//单独控制操作列 
    "value":true, //是否显示操作列 如果为false 则其他参数可不用设置
    "name":"操作",//列标题
    "width":'200',//列宽度
    "option":"last",//在列首还是列尾 参数值 first last
    "align":'center',//列对齐方式
    "btn":[{//操作列的链接名称及样式
      "class":"blue1 lb-addtr",//样式 添加的按钮标示class为 lb-addtr
      "name":"添加"//名称
    },{
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
    //id:'lbTables',//table下的tbody添加id 默认情况下不用设置 如果已有表格存在不需要此项
    data:'js/data3.json',//导入的ajax地址url
    get:{"name":"lb"},//get传递参数
    //class:'lb-table',//table添加样式 默认情况下不用设置 如果已有表格存在不需要此项
    th:col,//表格每列属性设置
    sort:'1',//序号列放入到第n列这里填写n
    editor:{//控制操作列 
      "value":true, //是否显示操作列 如果为false 则其他参数可不用设置
      "name":"操作",//列标题
      "width":'200',//列宽度
      "option":"last",//在列首还是列尾 参数值 first last
      "align":'center',//列对齐方式 left center right
      "btn":[{//操作列的链接名称及样式
        "class":"blue1 lb-addtr",//样式 添加的按钮标示class为 lb-addtr
        "name":"添加"//名称
      },{
        "class":"blue1 lb-deltr",//样式 删除的按钮标示class为 lb-deltr
        "name":"删除"
      }],
      "rowspan":false//控制操作列是否合并
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
pop:{
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
页面中绑定保存按钮
``` bash
afterLoad:function(){
  $('#save').bind('click',function(){
    $('body').find('.dataPost').remove();
    $.fn.lbTablesEvent({
      save:{
        id:"#lbTables",//保存的表格的id
        list:["wpbh","zlbz","43ew"],//键值名
        eq:[1,5,6]//取第几列的值
      }
    });
    $.fn.lbTablesEvent({
      save:{
        id:"#lbTables2",//保存的表格的id
        list:["wpbh"],//键值名
        eq:[2]//取第几列的值
      }
    });
  })
}
```

## 结尾
完整代码参考demo页面
