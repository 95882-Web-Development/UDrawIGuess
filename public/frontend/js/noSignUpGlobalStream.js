$(document).ready(function () {
    init();
})

function clickNoSignUpGuess(e){
    var btnGuess = event.target;
    var pic_id = $(btnGuess).attr("id");

    $("#guess_madal_normal_body").removeClass();
    $("#guess_madal_normal_body").addClass("modal-body");

    $("#guess_madal_answer_body").removeClass();
    $("#guess_madal_answer_body").addClass("hide");

    $('#guess_modal_input').val('');
    $("#modal_guess_err_msg").text('');

    $(".btn-guess-submit").attr("id", pic_id);
    $(".guess-modal-check-ans").attr("id", pic_id);

    var img = $(btnGuess).prev().prev();
    var img_data = img.attr("src");
    $("#modal_guess_img").attr("src", img_data);

    $(".btn-guess-submit").attr("id", pic_id);
    $(".guess-modal-check-ans").attr("id", pic_id);
}

function checkNoSignUpAnswer(e){

    var btnGuess = event.target;
    var pic_id = $(btnGuess).attr("id");
    var keyword = localStorage.getItem(pic_id);

    var guess_ans = $("#guess_modal_input").val();
    console.log("checkAnswer: guess " + guess_ans);

    if (guess_ans != keyword){
        $("#modal_guess_err_msg").text("Wrong Guess. Try Again!");
    }
    else{
        $("#modal_guess_err_msg").text("Congrats! You guess it right!");
    }
}

function getNoSignUpAnswer(e){

    var btnGuess = event.target;
    var pic_id = $(btnGuess).attr("id");
    var keyword = localStorage.getItem(pic_id);

    console.log("guess submit: " + keyword);

    $("#guess_madal_normal_body").removeClass();
    $("#guess_madal_normal_body").addClass("hide");

    $("#guess_madal_answer_body").removeClass();
    $("#guess_madal_answer_body").addClass("modal-body");

    $("#guess_madal_show_answer").text(keyword);
}



function init() {
    var picture_item_template = $("#picture_item_template");

    console.log("enter globalStream.init");

    function fetchGlobal() {
        return fetch("http://localhost:4000/nosignup_global", {
            credentials: "same-origin"
        }).then(function (response) {
            return response.json();
        }).then(function (json) {
            return json;
        });
    }

    fetchGlobal().then(function (result) {
        console.log(result);
        var data = result;

        ranking = data.ranking;
        pictures = data.pictures;

        console.log(ranking)
        console.log(pictures)

        var pictures_len = pictures.length;
        console.log(pictures_len)

        for (var j = 0; j < pictures_len; j++) {
            var user_id = pictures[j].user_id;
            var username = pictures[j].username;
            var pic_id = pictures[j].picture_id;

            var answer = pictures[j].keyword;
            localStorage.setItem(pic_id, answer);

            var tag = pictures[j].tag;
            var picture_src = pictures[j].picture;

            var new_item = picture_item_template.clone();

            new_item.attr("id", pic_id);

            new_item.removeClass();
            new_item.addClass("card");

            new_item.find("#img_picture").attr("src", picture_src);
            new_item.find("#img_picture").attr("id", pic_id);

            new_item.find("#guessbtn_picture").attr("id", pic_id);

            new_item.find("#owner_name").text(username);
            new_item.find("#owner_name").attr("id", user_id);

            var picture_list = $("#picture_list");
            picture_list.append(new_item);
        }

    });


}








