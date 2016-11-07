
var resultArr = [];
var clickcount = 0;
//
$(document).ready(function() {
    // Handler for .ready() called.
    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#blah').attr('src', e.target.result);
            }
            reader.readAsDataURL(input.files[0]);
        }
    }

    $("#imgInp").change(function(){
        readURL(this);
    });

    Confirm.init();
    $('#commentbtn').unbind();


});

//
$('#myModal').on('show.bs.modal', function (event) { // myModal 윈도우가 오픈할때 아래의 옵션을 적용
    var button = $(event.relatedTarget) // 모달 윈도우를 오픈하는 버튼
    var titleTxt = button.data('title') // 버튼에서 data-title 값을 titleTxt 변수에 저장
    var modal = $(this)
    modal.find('.modal-title').text('Title : ' + titleTxt) // 모달위도우에서 .modal-title을 찾아 titleTxt 값을 치환
})

//
function searchBook() {
    if (event.keyCode == 13) {
        $.ajax({
            url : "http://localhost:8080/book/bookList",
            type : "GET",
            dataType : "jsonp",
            jsonp : "callback",
            data : {
                keyword : $("#keyword_title").val()
            },
            success : function(result) {
                resultArr = result;
                showList(resultArr);
            },
            error : function () {
                alert("Error!");
            }
        });
    }
}
//
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
//
function showList(result) {
    for(var i=0;    i < result.length;  i++){
        var tr = $("<tr></tr>").attr("data-isbn", result[i].isbn);
        var img = $("<img />").attr("src",result[i].img);
        var imgTd = $("<td></td>").append(img);
        var titleTd = $("<td></td>").text(result[i].title);
        var authorTd = $("<td></td>").text(result[i].author);
        var priceTd = $("<td></td>").text(result[i].price);

        var detailbtn = $("<input />").attr("type","button").attr("value", "Detail");
        detailbtn.on("click", myDetail);
        var detailbtn = $("<td></td>").append(detailbtn);

        var updatebtn = $("<input />").attr("type","button").attr("value", "Update");
        updatebtn.on("click", myUpdate);
        var updatebtn = $("<td></td>").append(updatebtn);

        var deletebtn = $("<input />").attr("type","button").attr("value", "Delete");
        deletebtn.on("click", myDelete);
        var deletebtn = $("<td></td>").append(deletebtn);

        var commentbtn = $("<input />").attr("type","button").attr("value", "Comment").attr("id","commentbtn");
        commentbtn.on("click", myComment);
        var commentbtn = $("<td></td>").append(commentbtn);

        tr.append(imgTd);
        tr.append(titleTd);
        tr.append(authorTd);
        tr.append(priceTd);
        tr.append(detailbtn);
        tr.append(updatebtn);
        tr.append(deletebtn);
        tr.append(commentbtn);

        $("tbody").append(tr);
    }
}
//
function myUpdate() {
    alert($(this).parent().parent().find("td:nth-child(2)").text() + " 의 'Price'를 " + "Update!");
    $(this).parent().parent().find("td:nth-child(5) > input:nth-child(2)").remove();

    var title = $(this).parent().parent().find("td:nth-child(2)").text();
    var author = $(this).parent().parent().find("td:nth-child(3)").text();
    var price = $(this).parent().parent().find("td:nth-child(4)").text();

    var titlebox = $("<input />").attr("type", "text").val(title).css({width:500}).css({height:185});
    var authorbox = $("<input />").attr("type", "text").val(author);
    var pricebox = $("<input />").attr("type", "text").val(price);
    var commitbtn = $("<input />").attr("type", "button").attr("value","Commit");

    $(this).parent().parent().find("td:nth-child(2)").text("");
    $(this).parent().parent().find("td:nth-child(2)").append(titlebox);
    $(this).parent().parent().find("td:nth-child(3)").text("");
    $(this).parent().parent().find("td:nth-child(3)").append(authorbox);
    $(this).parent().parent().find("td:nth-child(4)").text("");
    $(this).parent().parent().find("td:nth-child(4)").append(pricebox);
    $(this).parent().parent().find("td:nth-child(5) > input:first").hide();
    $(this).parent().parent().find("td:nth-child(5)").append(commitbtn);

    commitbtn.on("click", function () {

        var isbn = $(this).parent().parent().attr("data-isbn");
        var title = $(this).parent().parent().find("td:nth-child(2) > input").val();
        var author = $(this).parent().parent().find("td:nth-child(3) > input").val();
        var price = $(this).parent().parent().find("td:nth-child(4) > input").val();

        var tr = $(this).parent().parent();

        $.ajax({
            url: "http://localhost:8080/book/bookUpdate",
            type: "GET",
            dataType: "jsonp",
            jsonp: "callback",
            data: {
                isbn: isbn,
                title: title,
                author: author,
                price: price
            },
            success: function () {
                alert("Updated, Success!");
                tr.find("td:nth-child(2)").empty();
                tr.find("td:nth-child(2)").text(title);
                tr.find("td:nth-child(3)").empty();
                tr.find("td:nth-child(3)").text(author);
                tr.find("td:nth-child(4)").empty();
                tr.find("td:nth-child(4)").text(price);
            },
            error: function () {
                alert("Updated, Error!");
            }
        });
        $(this).parent().parent().find("td:nth-child(5) > input:first").show();
        $(this).parent().parent().find("td:nth-child(5) > input:nth-child(2)").remove();
    });
}

//
function myDelete() {
    alert( $(this).parent().parent().find("td:nth-child(2)").text() + " 을/를 " + "Delete!");
    $(this).parent().parent().empty();
}

function myDetail(){
    var search_isbn = $(this).parent().parent().attr("data-isbn");
    var ttt = $(this).parent().parent().find("td:nth-child(2)");
    ttt.empty();
    $.ajax({
        url : "http://localhost:8080/book/bookDetail",
        type : "GET",
        dataType : "jsonp",
        jsonp : "callback",
        data : {
            keyword : search_isbn
        },
        success : function(result){
            var title = $("<div></div>").text   (result.title);
            var isbn = $("<div></div>").text    ("◎ ISBN No.#     : " + result.isbn);
            var date = $("<div></div>").text    ("◎ 출간일        : " + result.date);
            var page = $("<div></div>").text    ("◎ 페이지수      : " + result.page);
            var trans= $("<div></div>").text    ("◎ 번역자        : " + result.translator);
            var supp = $("<div></div>").text    ("◎ 구성품        : " + result.supplement);
            var publ = $("<div></div>").text    ("◎ 출판사        : " + result.publisher);

            ttt.append(title);
            ttt.append(isbn);
            ttt.append(date);
            ttt.append(page);
            ttt.append(trans);
            ttt.append(supp);
            ttt.append(publ);
        },
        error : function(){
            alert("Error Code : select")
        }
    });
}

function myInsert() {
    var isbn = $('#isbn').val();
    var title = $('#title').val();
    var date = $('#date').val();
    var page = $('#page').val();
    var price = $('#price').val();
    var author = $('#author').val();
    var translator = $('#translator').val();
    var supplement = $('#supplement').val();
    var publisher = $('#publisher').val();
    var imgbase64 = $('#blah').attr("src");

    if (isbn == "" || price == "" || page == ""){
        alert("필수입력값(*)를 입력하십시오.");
        $('#isbn').val('');
        $('#title').val('');
        $('#date').val('');
        $('#page').val('');
        $('#price').val('');
        $('#author').val('');
        $('#translator').val('');
        $('#supplement').val('');
        $('#publisher').val('');
        $('#blah').val('');
    } else {
        $.ajax({
            url: "http://localhost:8080/book/bookInsert",
            type: "GET",
            dataType: "jsonp",
            jsonp: "callback",
            data: {
                isbn: isbn,
                title: title,
                date : date,
                page : page,
                price: price,
                author: author,
                translator : translator,
                supplement : supplement,
                publisher : publisher,
                imgbase64 : imgbase64
            },
            success: function () {
                alert("Success : INSERT");
                $('#isbn').val('');
                $('#title').val('');
                $('#date').val('');
                $('#page').val('');
                $('#price').val('');
                $('#author').val('');
                $('#translator').val('');
                $('#supplement').val('');
                $('#publisher').val('');
                $('#blah').val('');
            },
            error: function () {
                alert("Error : INSERT");
            }
        });
    }
}

function myStatus(){
    var status = $('#button_login').text();
    alert(status);
    if(status !=  null){
        alert("로그아웃!");
    }
}

function myLogin() {
    var uid = $("#username").val();
    var upw = $("#password").val();
    if (uid == "" || upw == ""){
        alert("아이디와 비밀번호를 입력하십시오.");
    } else {
        $.ajax({
            url: "http://localhost:8080/book/bookLogin",
            type: "GET",
            dataType: "jsonp",
            jsonp: "callback",
            data : {
                uid : uid,
                upw : upw
            },
            success: function (result) {
                if(result == true){
                    alert("Success : Login");
                    $('.modal-content').hide();
                    $('#button_login').text("Logout");
                    $('#logging').text(uid + " 님이 접속하셨습니다.");
                }else if(result == false){
                    alert("Error : 입력 정보를 확인하십시오.")
                }
                $('#username').val('');
                $('#password').val('');
            },
            error: function () {
                if(result == true){
                    alert("Error : Login");
                }
            }
        });
    }
}

function myUser() {
    var uid = $("#uid").val();
    var uname = $("#uname").val();
    var upw = $("#upw").val();
    var upwc = $("#upwc").val();
    var ucount = $("#ucount").val();
    alert(uid+";"+uname+";"+upw+";"+ucount);
    if (uid == "" || uname == "" || upw == "" || upwc == "") {
        alert("필수입력값(*)를 입력하십시오.")
    }else {
        if (upw == upwc) {
            $.ajax({
                url: "http://localhost:8080/book/bookuser",
                type: "GET",
                dataType: "jsonp",
                jsonp: "callback",
                data: {
                    uid: uid,
                    uname: uname,
                    upw: upw,
                    ucount: ucount
                },
                success: function (result) {
                    if(result == true){
                        alert("Success!");
                    }else if(result == false){
                        alert("Error!");
                    }
                },
                error: function () {
                    alert("Error!");
                }
            });
        }
        if (upw =! upwc) {
            alert("비밀번호를 확인하세요!");
        }
    }
}

//
function myComment(e) {
    e.preventDefault();
    var isbn = $(this).parent().parent().attr("data-isbn");
    var ctitle = null;
    var cauthor = null;
    var cdate = null;
    var ctext = $('#ctext').val();

    $.ajax({
        url : "http://localhost:8080/book/bookclist",
        type : "GET",
        dataType : "jsonp",
        jsonp : "callback",
        data : {
            bisbn : isbn
        },
        success : function(result){
            var txt = "<table><thead><th>No.#&nbsp;&nbsp;</th><th>Comment&nbsp;&nbsp;</th><th>Date&nbsp;&nbsp;</th></thead><tbody>";
            for(var i=0; i<result.length; i++) {
                txt += "<tr><td>" + result[i].id + "</td><td>" + result[i].text + "</td><td>" + result[i].date + "</td></tr>"
            }
            txt += "</tbody></table>";
            txt += "<br><br><input type='text' id='ctext' placeholder='서평을 입력하세요'/>";

            Confirm.show('Insert Comment', txt, {
                'Commit' : {
                    'primary' : true,
                    'callback' : function()
                    {
                        alert("in ajax");
                        $.ajax({
                            url: "http://localhost:8080/book/bookcinsert",
                            type: "GET",
                            dataType: "jsonp",
                            jsonp: "callback",
                            data: {
                                bisbn : isbn,
                                ctitle : ctitle,
                                cauthor : cauthor,
                                ctext : $('#ctext').val()
                            },
                            success: function (result) {
                                if( result == true ){
                                }
                            },
                            error: function () {
                                alert("error");
                            }
                        });
                        Confirm.show('Message', '입력되었습니다.');
                    }
                }
            });
        },
        error : function(){
            alert("Error Code : select")
        }
    });
}

var Confirm = {
    modalContainerId : '#modal-container',
    modalBackgroundId : '#modal-background',
    modalMainId : '#confirm-modal',
    customButton : {
        'Okay' :
        {
            'primary' : true,
            'callback' : function()
            {
                Confirm.hide();
            }
        }
    },
    customEvent : null,

    init : function()
    {
        var self = this;
        var ElemHtml = '';

        $(self.modalMainId).remove();

        ElemHtml = '<div id="confirm-modal" class="modal fade role="dialog" tabindex="-1">'
            +     '<div class="modal-dialog modal-sm">'
            +   '<div class="modal-content">'
            +    '<div class="modal-header">'
            +     '<button id="modal-upper-close" class="close modal-close" aria-label="Close" type="button">'
            +      '<span aria-hidden="true">×</span>'
            +     '</button>'
            +     '<h4 id="modal-title" class="modal-title">Modal</h4>'
            +    '</div>'
            +    '<div id="modal-body" class="modal-body"> E-mail <input type="email" size="30"> </div>'
            +          '<div id="modal-footer" class="modal-footer">'
            +          '</div>'
            +   '</div>'
            +  '</div>'
            + '</div>'
            +  '<div id="modal-background" class=""></div>';

        $('body').append(ElemHtml);
    },

    addCustomButtons : function()
    {
        var self = this;
        var condition = true;

        $('.modal-custom-button').remove();

        closeButton =  '';

        if(self.customButton)
            closeButton =  '<button id="modal-close" type="button" class="btn btn-default modal-custom-button">Close</button>';
        else
        {
            self.customButton = {
                'Okay' :
                {
                    'primary' : true,
                    'callback' : function()
                    {
                        Confirm.hide();
                    }
                }
            };
        }

        $.each(self.customButton, function(key, val)
        {
            buttonName = key.replace(/ /g, '');

            var ElemHtml = '';
            var ButtonState = 'btn-default';

            if(val['primary'])
                ButtonState = 'btn-primary';
            if(buttonName.toLowerCase() == 'okay' || buttonName.toLowerCase() == 'ok')
                closeButton = '';

            if(buttonName.toLowerCase() == 'delete' || buttonName.toLowerCase() == 'remove')
                ButtonState = 'btn-danger';

            ElemHtml = closeButton
                + '<button id="button-'+ buttonName.toLowerCase() +'" type="button" class="btn modal-custom-button '+ ButtonState +'">'+ buttonName +'</button>';

            $('#modal-footer').append(ElemHtml);

            if($('#modal-close'))
                closeButton = '';

            self.addCustomButtonEvents(buttonName.toLowerCase(), val['callback']);
        });

        $('#modal-upper-close').unbind();
        $('#modal-upper-close').bind('click', function(e)
        {
            e.preventDefault();
            self.hide();
        });

        $('#modal-close').unbind();
        $('#modal-close').bind('click', function(e)
        {
            e.preventDefault();
            self.hide();
        });
    },

    addCustomButtonEvents : function(customButtonId, callback)
    {
        var self = this;

        $('#button-'+customButtonId).unbind();
        $('#button-'+customButtonId).bind('click', function(e)
        {
            e.preventDefault();
            callback();
        });
    },

    show : function(title, message, customEvent)
    {
        var self = this;

        if(title)
            $('#modal-title').html(title);
        if(message)
            $('#modal-body').html(message);

        self.customButton = customEvent;

        $(self.modalMainId).addClass('in');
        $(self.modalBackgroundId).addClass('modal-backdrop fade in');
        $(self.modalMainId).css({
            'display' : 'block',
            'padding-right' : '17px'
        });
        self.addCustomButtons();
    },
    hide : function()
    {
        var self = this;
        $(self.modalMainId).removeClass('in');
        $(self.modalBackgroundId).removeClass('modal-backdrop fade in');
        $(self.modalMainId).css('display', 'none');
    }
};

