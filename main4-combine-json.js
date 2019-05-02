function ExportToTable() {  
     var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xlsx|.xls)$/;  
     /*Checks whether the file is a valid excel file*/  
     if (regex.test($("#excelfile").val().toLowerCase())) {  
         var xlsxflag = false; /*Flag for checking whether excel is .xls format or .xlsx format*/  
         if ($("#excelfile").val().toLowerCase().indexOf(".xlsx") > 0) {  
             xlsxflag = true;  
         }  
         /*Checks whether the browser supports HTML5*/  
         if (typeof (FileReader) != "undefined") {  
             var reader = new FileReader();  
             reader.onload = function (e) {  
                 var data = e.target.result;  
                 /*Converts the excel data in to object*/  
                 if (xlsxflag) {  
                     var workbook = XLSX.read(data, { type: 'binary' });  
                 }  
                 else {  
                     var workbook = XLS.read(data, { type: 'binary' });  
                 }  
                 /*Gets all the sheetnames of excel in to a variable*/  
                 var sheet_name_list = workbook.SheetNames;  
  
                 var cnt = 0; /*This is used for restricting the script to consider only first sheet of excel*/  
                 sheet_name_list.forEach(function (y) { /*Iterate through all sheets*/  
                     /*Convert the cell value to Json*/  
                     if (xlsxflag) {  
                         var exceljson = XLSX.utils.sheet_to_json(workbook.Sheets[y]);  
                     }  
                     else {  
                         var exceljson = XLS.utils.sheet_to_row_object_array(workbook.Sheets[y]);  
                     }  
                     if (exceljson.length > 0 && cnt == 0) {  
                         BindTable(exceljson, '#exceltable');  
                         cnt++;  
                     }  
                 });  
                 $('#exceltable').show();  
             }  
             if (xlsxflag) {/*If excel file is .xlsx extension than creates a Array Buffer from excel*/  
                 reader.readAsArrayBuffer($("#excelfile")[0].files[0]);  
             }  
             else {  
                 reader.readAsBinaryString($("#excelfile")[0].files[0]);  
             }  
         }  
         else {  
             alert("Sorry! Your browser does not support HTML5!");  
         }  
     }  
     else {  
         alert("Please upload a valid Excel file!");  
     }  
 } 

 function BindTable(jsondata, tableid) {/*Function used to convert the JSON array to Html Table*/  
    var query = ''
    var URL = ''
    var obj = jsondata;
    console.log(obj[0].ISBN)
    Object.keys(obj).forEach(function(key) {
        URL = 'https://www.googleapis.com/books/v1/volumes?key=AIzaSyAZjePxWng8xga04XqkCUvr2MuUafc_8_g&q=+isbn:'+obj[key].ISBN + '&fields=items(volumeInfo(title,authors,description,imageLinks(thumbnail)))'
        clearPrevious();
        $.ajax({
          url: URL.toString(),
          dataType: 'json',
          success: function(data){
          console.log(typeof data);
            var JSONString = JSON.stringify(data.items[0].volumeInfo);
            //console.log(JSONString);
            //alert(JSONString);
            console.log(data.items[0].volumeInfo);
            //console.log(Object.assign([], JSONString));
            var combine=[];
            var combine2=[];
            combine1=combine.push(data.items[0].volumeInfo);
            combine2=combine.push(JSONString);
            console.log("Combine1" +combine1);
            console.log("Combine2" +combine2); 

             
            for(i=0; i<10; i++){

              title=$('<h5>'+data.items[i].volumeInfo.title + '</h5>');
              author=$('<h5>'+data.items[i].volumeInfo.authors + '</h5>');
              img=$('<img><a href=' + data.items[i].volumeInfo.infoLink + '><button>Read More</button></a>');
              url=data.items[i].volumeInfo.imageLinks.thumbnail;

              img.attr('src',url);

              title.appendTo("#result");
              author.appendTo("#result");
              img.appendTo("#result");

              //newJson= $.extend(data[i]);
              //var newJson=data[i].records.concat(data[i + 1].records;
              //console.log("New Json " + newJson);
            }//end for loop

            //var myTestXML = new myExcelXML(newJson);
            //myTestXML.downLoad();
          }//end ajax success function

        })//end ajax call


    });
      
 }  
 function clearPrevious(){
    for(i=0; i<10; i++){
        var booki = 'book'+(i+1)
        
        //delete rows
        //images row
        removeElementsByClass('imgRow')

        //title and price row
        removeElementsByClass('titlePriceRow')   

        //author row
        removeElementsByClass('authorRow')   

        //description row
        removeElementsByClass('descriptionRow')
  
    }//end for loop
}//end clearPrevious function

function removeElementsByClass(className){
    var elements = document.getElementsByClassName(className);
    for(j=0; j<elements.length; j++){
        elements[0].parentNode.removeChild(elements[0]);
    }
}
