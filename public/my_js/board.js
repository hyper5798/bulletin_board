var areaListStr = document.getElementById("areaList").value;
var areaList = JSON.parse(areaListStr);
//Select object
var mCity = document.getElementById("mCity");
var mArea = document.getElementById("mArea");
var mTown = document.getElementById("mTown");
console.log('mTown.options.length:'+mTown.options.length);
//Current area
var city = document.getElementById("city").value;
var area = document.getElementById("area").value;
var town = document.getElementById("town").value;
var selectedCity,selectedArea;
console.log("city :"+city);
console.log("area :"+JSON.stringify(area));
console.log("town :"+JSON.stringify(town));
var keys = Object.keys(areaList);

console.log('keys[0]:'+ keys[0]);
console.log("areaList keys:"+JSON.stringify(keys));

function cityChange(){

    selectedCity = mCity.value;
    console.log('selected city:'+ selectedCity);
    var index = keys.indexOf(selectedCity);
    console.log('selected index:'+ index);
    //mCity.selectedIndex = 2;
    if(index < 0){
        selectedCity = keys[0];

        for(var i = 0, j = mCity.options.length; i < j; ++i) {
            //console.log('i:'+ i + ' >> '+mCity.options[i].value);
            if(mCity.options[i].value === selectedCity) {
               mCity.selectedIndex = i;
               //console.log('mCity.selectedIndex:'+ i);
               break;
            }
        }
        alert('你選擇的城市目前無資料,目前有資料的城市如下:\n'+JSON.stringify(keys));
        console.log('mCity.options.length'+mCity.options.length);
    }
    console.log('mArea.options[0].innerHTML:'+mArea.options[0].innerHTML);
    //If change city then change area list
    if(city !== selectedCity){
        console.log('**********************************');
        //Get area and town list in selected city
        list = areaList[selectedCity];
        console.log('list :n'+JSON.stringify(list));
        area = [];
        for(i=0;i<list.length;i++){
            //console.log('town:'+Object.keys(list[i])[0]);
            area.push(Object.keys(list[i])[0]);
            if(i===0){
                //town list of first town
                town = list[i][Object.keys(list[i])[0]];
            }
        }
        changeSelect(mArea,area);
        changeSelect(mTown,town);

        city = selectedCity;
        $('.selectpicker').selectpicker('refresh');
    }
}

function areaChange(){

    //alert('townChange()');

    selectedArea = mArea.value;
    
    console.log('area:'+ area );
    console.log('selectedArea:'+ selectedArea);
    var index =  mArea.selectedIndex;

    //If change city then change area list
    if(area !== selectedArea){
        console.log('**********************************');
        //Get area and town list in selected city
        list = areaList[city];
        console.log('list :'+JSON.stringify(list));
        town = list[index][Object.keys(list[index])[0]];
        console.log('town :'+JSON.stringify(town));
        changeSelect(mTown,town);

        $('.selectpicker').selectpicker('refresh');
    }
}

function changeSelect(object,list){
    console.log('object list:'+JSON.stringify(list));
    var length = object.options.length;
    //Remove options of area select
    console.log('object.options.length:'+object.options.length);
    /*for ( i = 0; i < length; i++) {
        console.log('i:'+i);
        object.remove(i);
    }*/
    removeOptions(object);

    console.log('object.options.length:'+object.options.length);
    console.log('list.length:'+list.length);
    for (i = 0; i < list.length; i++) {
        if(object.options[i] === undefined){
            var option = document.createElement("option");
            option.value = list[i];
            option.text = list[i];
            object.add(option);
        }else{
            object.options[i].value = list[i];
            object.options[i].text = list[i];
        }

    }
}



function removeOptions(selectbox)
{
    var i;
    for(i = selectbox.options.length - 1 ; i >= 0 ; i--)
    {
        selectbox.remove(i);
    }
}

$(document).ready(function(){

});