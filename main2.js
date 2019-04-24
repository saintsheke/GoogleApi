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
        URL = 'https://www.googleapis.com/books/v1/volumes?q='+ obj[key].ISBN

        clearPrevious();
        $.ajax({
          url: URL.toString(),
          dataType: 'json',
          success: function(data){
          console.log(data);

            for(i=0; i<10; i++){

                var booki = 'book'+(i+1)

                //create rows
                //images row
                var imgRow = document.createElement('div')
                imgRow.className = "row imgRow"
                document.getElementById(booki).appendChild(imgRow)

                //title and price row
                var titlePriceRow = document.createElement('div')
                titlePriceRow.className = "row titlePriceRow"
                    //title column
                    var titleDiv = document.createElement('div')
                    titleDiv.className = "col-md-8 title"
                    titlePriceRow.appendChild(titleDiv)
                    //price column
                    var priceDiv = document.createElement('div')
                    priceDiv.className = "col-md-2 col-md-offset-1 price"
                    titlePriceRow.appendChild(priceDiv)

                    document.getElementById(booki).appendChild(titlePriceRow)

                //author row
                var authorRow = document.createElement('div')
                authorRow.className = "row authorRow"
                   //author column
                    var authorDiv = document.createElement('div')
                    authorDiv.className = "col-md-12 author"
                    authorRow.appendChild(authorDiv)

                    document.getElementById(booki).appendChild(authorRow)

                //description row
                var descriptionRow = document.createElement('div')
                descriptionRow.className = "row descriptionRow"
                   //description column
                    var descriptionDiv = document.createElement('div')
                    descriptionDiv.className = "col-md-12 description"
                    descriptionRow.appendChild(descriptionDiv)

                    document.getElementById(booki).appendChild(descriptionRow)

                //populate the rows with the data
                //image data
                var img = document.createElement('img')
                img.src = data.items[i].volumeInfo.imageLinks.smallThumbnail
                document.getElementsByClassName('imgRow')[i].appendChild(img)

                //title data
                var title = document.createElement('h1')
                title.innerHTML =  data.items[i].volumeInfo.title
                document.getElementsByClassName('title')[i].appendChild(title)

                //price data
                var price = document.createElement('h1')
                if(data.items[i].saleInfo.listPrice!=undefined){
                    price.innerHTML = '$' + data.items[i].saleInfo.listPrice.amount
                }else{
                    price.innerHTML = "N/A"
                }
                document.getElementsByClassName('price')[i].appendChild(price)

                //author data
                var author = document.createElement('p')
                author.innerHTML = 'By: ' +  data.items[i].volumeInfo.authors[0]
                document.getElementsByClassName('author')[i].appendChild(author)

                //description data
                var description = document.createElement('p')
                description.innerHTML =  data.items[i].volumeInfo.description
                document.getElementsByClassName('description')[i].appendChild(description)

            }//end for loop
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
