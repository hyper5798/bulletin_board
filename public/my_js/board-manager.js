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
                     "iDisplayLength": 5,
                     "lengthChange": false,//Hide the Show Entries dropdown
                     "bSort" : false,
                     "searching": false
               };
var opt2={
     "order": [[ 2, "desc" ]],
     "iDisplayLength": 25
 };

var table = $("#table1").dataTable(opt);
var dataStr = document.getElementById("datas").value;
var datas = JSON.parse(dataStr);
var data;

$(function(){
    setTimeout(function(){
        //do what you need here
        //document.getElementById('mTitle').style.display = "none";
        if(document.getElementById('showBlock')){
            document.getElementById('showBlock').style.display = "none";
        }

    }, 5000);

    $('.rows').click(function(){
        var index = $(this).index();
        data = datas[index];
        //alert('data:'+JSON.stringify(data))
        //alert('row index = '+  index);
        $('#title').val(data.title);
        $('#content').val(data.content);
    });
});

function uploadCheck(){

    if(data){
      postMode.value = 'upload';
      postId.value = data._id;
      postData.value = JSON.stringify(data);

      document.getElementById("editBoard").submit();
      document.getElementById("send").disabled = true;
    }
}


function rejectCheck(){

    if(data){
      postMode.value = 'reject';
      postData.value = JSON.stringify(data);
      postId.value = data._id;

      document.getElementById("editBoard").submit();
      document.getElementById("reject").disabled = true;
    }
}