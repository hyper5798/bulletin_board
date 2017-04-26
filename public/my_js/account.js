var opt={"oLanguage":{"sProcessing":"處理中...",
                     "sLengthMenu":"顯示 _MENU_ 項結果",
                     "sZeroRecords":"沒有匹配結果",
                     "sInfo":"顯示第 _START_ 至 _END_ 項結果，共 _TOTAL_ 項",
                     "sInfoEmpty":"顯示第 0 至 0 項結果，共 0 項",
                     "sInfoFiltered":"(從 _MAX_ 項結果過濾)",
                     "sSearch":"搜索:",
                     "oPaginate":{"sFirst":"首頁",
                                          "sPrevious":"上頁",
                                          "sNext":"下頁",
                                          "sLast":"尾頁"}
                     },
                     /*"order": [[ 2, "desc" ]],*/
                     "iDisplayLength": 25,
                     "bSort" : false,
                     "searching": false
               };
var opt2={
     "order": [[ 2, "desc" ]],
     "iDisplayLength": 25
 };

var table = $("#table1").dataTable(opt);
var postMode    = document.getElementById("postMode");
var postAccount = document.getElementById("postAccount");
var postName    = document.getElementById("postName");
var postLevel   = document.getElementById("postLevel");
var postEnable  = document.getElementById("postEnable");

function editCheck(index,account){

    postMode.value = 'edit';

    var arrEnable = $('[name=enable]');
    var arrName   = $('[name=name]');
    var arrLevel = $('[name=level]');
    var enable    = arrEnable[index].checked;
    var name      = arrName[index].value;
    var level      = arrLevel[index].value;
    console.log('account :'+account);
    console.log('name :'+name);
    console.log('level :'+level);
    console.log('enable :'+ enable);
    postAccount.value = account;
    postName.value = name ;
    postLevel.value = level ;
    postEnable.value = enable.toString();
    console.log('post account :'+postAccount.value);
    console.log('post name :'+postName.value);
    console.log('post level :'+postLevel.value);
    console.log('post enable :'+ postEnable.value);
    document.getElementById("accountList").submit();
}


function delCheck(index,account){
    postMode.value = 'del';
    postAccount.value = account;
    document.getElementById("del-account").innerText='確定刪除 '+account+' 帳戶嗎?';
    $('#myModal').modal('show');

}

function toSubmit(){
    $('#myModal').modal('hide');
    document.getElementById("accountList").submit();
}

$(document).ready(function(){

    setTimeout(function(){
        //do what you need here
        //alert('test');
        document.getElementById('showBlock').style.display = "none";
    }, 5000);

} );