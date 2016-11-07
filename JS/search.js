
    var resultArr = [];
    var clickcount = 0;

    function searchBook() {
        if (event.keyCode == 13) {
            $.ajax({
                    url : "http://localhost:8080/book/bookList",
                    type : "GET",
                    dataType : "jsonp",
                    jsonp : "callback",
                    data : {
                        keyword : $("#keyword").val()
                        },
                        success : function(result) {
                            alert("Success!");
                            resultArr = result;
                            showList(resultArr);
                        },
                        error : function () {
                            alert("Error!");
                        }
                   });
        }
    }
    
    function mySort() {
        clickcount++;
        if(clickcount % 2 == 0){
            resultArr.sort(function(a, b){return a.price - b.price});
            $('tbody tr').remove();
            showList(resultArr);
        } else {
            resultArr.sort(function(a, b){return b.price - a.price});
            $('tbody tr').remove();
            showList(resultArr);
        }
    }

    function myDelete(data) {
        alert( $(data).parent().parent().find("td:nth-child(2)").text() + " 을/를 " + "Delete!");
        $(data).parent().parent().empty();
    }

    function showList(result) {
        for(var i=0;    i < result.length;  i++){
            var tr = $("<tr></tr>").attr("data-isbn", result[i].isbn);
            var img = $("<img />").attr("src",result[i].img);
            var imgTd = $("<td></td>").append(img);
            var titleTd = $("<td></td>").text(result[i].title);
            var authorTd = $("<td></td>").text(result[i].author);
            var priceTd = $("<td></td>").text(result[i].price);
            var updatebtn = $("<input />").attr("type","button").attr("value", "Update");
            updatebtn.on("click",function () {
                alert( $(this).parent().parent().find("td:nth-child(2)").text() + " 의 'Price'를 " + "Update!");
                var price = $(this).parent().parent().find("td:nth-child(4)").text();
                var updatebox = $("<input />").attr("type","text").val(price);
                updatebox.on("keyup", function(){
                    if(event.keyCode ==13){
                        var isbn = $(this).parent().parent().attr("data-isbn");
                        var price = $(this).val();
                        var tr = $(this).parent().parent();
                        alert(isbn + " : " + price);
                        $.ajax({
                            url : "http://localhost:8080/book/bookUpdate",
                            type : "GET",
                            dataType : "jsonp",
                            jsonp : "callback",
                            data : {
                                isbn : isbn,
                                price : price
                            },
                            success : function () {
                                alert("Updated, Success!");
                                tr.find("td:nth-child(4)").empty();
                                tr.find("td:nth-child(4)").text(price);
                            },
                            error : function () {
                                alert("Updated, Error!");
                            }
                        });
                    }
                });
                $(this).parent().parent().find("td:nth-child(4)").text("");
                $(this).parent().parent().find("td:nth-child(4)").append(updatebox);
                $(this).parent().parent().find("[type=button]").attr("disabled","disabled");
            });
            var updatebtn = $("<td></td>").append(updatebtn);
            var deletebtn = $("<input />").attr("type","button").attr("value", "Delete");
            deletebtn.on("click",function () {
                alert( $(this).parent().parent().find("td:nth-child(2)").text() + " 을/를 " + "Delete!");
                $(this).parent().parent().empty();
            });
            var deletebtn = $("<td></td>").append(deletebtn);

            tr.append(imgTd);
            tr.append(titleTd);
            tr.append(authorTd);
            tr.append(priceTd);
            tr.append(updatebtn);
            tr.append(deletebtn);

            $("tbody").append(tr);
        }
    }