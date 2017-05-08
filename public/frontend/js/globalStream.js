$(document).ready(function () {
    init();
})

function logout(e) {
    var url = "http://localhost:4000/logout";

    function fetchLogout() {
        return fetch(url).then(function (response) {
            return response.json();
        }).then(function (json) {
            return json;
        });
    }

    fetchLogout().then(function (result) {
        location.href = "http://localhost:4000/frontend/login.html";
    });
}

function clickLike(e) {

    var btnLike = event.target;
    var pic_id = $(btnLike).attr("id");
    var likeStatus = $(btnLike).attr("value");
    console.log(likeStatus);

    if (likeStatus == "0") {
        var url = "http://localhost:4000/like/" + pic_id;

        function fetchLike() {
            return fetch(url).then(function (response) {
                return response.json();
            }).then(function (json) {
                return json;
            });
        }

        fetchLike().then(function (result) {
            console.log(result);

            if (result.code == "1"){
                console.log("ERROR: like incomplete");
            }
            else{
                $(btnLike).attr("value", "1");
                $(btnLike).css('color', 'rgba(165, 28, 70, 0.57)');
            }
        });
    }
    else {
        var url = "http://localhost:4000/unlike/" + pic_id;

        function fetchUnlike() {
            return fetch(url).then(function (response) {
                return response.json();
            }).then(function (json) {
                return json;
            });
        }

        fetchUnlike().then(function (result) {
            console.log(result);

            if (result.code == "1"){
                console.log("ERROR: unlike incomplete");
            }
            else{
                $(btnLike).attr("value", "0");
                $(btnLike).css('color', 'gray');
            }
        });
    }
}

function clickBookmark(e) {
    var btnBookmark = event.target;
    var pic_id = $(btnBookmark).attr("id");
    var bookmarkStatus = $(btnBookmark).attr("value");
    console.log(bookmarkStatus);

    if (bookmarkStatus == "0") {

        var url = "http://localhost:4000/bookmark/" + pic_id;

        function fetchBookmark() {
            return fetch(url).then(function (response) {
                return response.json();
            }).then(function (json) {
                return json;
            });
        }

        fetchBookmark().then(function (result) {
            console.log(result);

            if (result.code == "1"){
                console.log("ERROR: like incomplete");
            }
            else{
                $(btnBookmark).attr("value", "1");
                $(btnBookmark).css('color', 'rgba(165, 28, 70, 0.57)');
            }
        });
    }
}

function clickGuess(e){
    var btnGuess = event.target;
    var pic_id = $(btnGuess).attr("id");

    $("#guess_madal_normal_body").removeClass();
    $("#guess_madal_normal_body").addClass("modal-body");

    $("#guess_madal_answer_body").removeClass();
    $("#guess_madal_answer_body").addClass("hide");

    var url = "http://localhost:4000/picture/" + pic_id;

    function fetchPic() {
        return fetch(url).then(function (response) {
            return response.json();
        }).then(function (json) {
            return json;
        });
    }

    fetchPic().then(function (result) {
        console.log(result);

        var img_data = result.picture;
        var tag = result.tag;
        var des = result.description;

        $("#modal_guess_tag_content").text(tag);
        $("#modal_guess_img").attr("src", img_data);
        $("#modal_guess_tip").text("Tips: " + des);
        $("#guess_modal_submit").attr("id", pic_id);

    });
}

function checkAnswer(e){
    var url = "http://localhost:4000/check_answer";
    var btnGuess = event.target;
    var pic_id = $(btnGuess).attr("id");
    var guess_ans = $("#guess_modal input").val();

    var data = {"picture_id": pic_id, "guess_word":guess_ans};

    function fetchCheckAns() {
        return fetch(url, {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data),
        }).then(function (response) {
            return response.json();
        }).then(function (json) {
            return json;
        });
    }

    fetchCheckAns().then(function (result) {
        console.log("guess submit: " + result);

        if (result.code == "1"){
            var answer = result.keyword;
            $("#modal_guess_err_msg").text("Wrong Guess. Try Again!");
        }
        else{
            $("#modal_guess_err_msg").text("Congrats! You guess it right!");
        }
    });
}

function getAnswer(e){
    var url = "http://localhost:4000/check_answer";
    var btnGuess = event.target;
    var pic_id = $(btnGuess).attr("id");
    var guess_ans = $("#guess_modal input").val();

    var data = {"picture_id": pic_id, "guess_word":guess_ans};

    function fetchCheckAns() {
        return fetch(url, {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data),
        }).then(function (response) {
            return response.json();
        }).then(function (json) {
            return json;
        });
    }

    fetchCheckAns().then(function (result) {
        console.log("guess submit: " + result);
        var answer = result.keyword;

        $("#guess_madal_normal_body").removeClass();
        $("#guess_madal_normal_body").addClass("hide");

        $("#guess_madal_answer_body").removeClass();
        $("#guess_madal_answer_body").addClass("modal-body");

        $("#guess_madal_show_answer").text(answer);
    });
}

function goToProfilePage(e) {
    console.log("enter click ranking_username");
    //location.href="http://localhost:4000/frontend/profile.html";
    var rank_name = event.target;
    var user_id = $(rank_name).attr("id");
    localStorage.setItem("profile_user_id", user_id);
    location.href = "http://localhost:4000/frontend/profile.html";
}

function init() {
    var ranking_item_template = $("#ranking_item_template");
    var picture_item_template = $("#picture_item_template");

    console.log("enter globalStream.init");

    $(".btn-like").click(function (e) {
        console.log("like button clicked");
        var like_btn = e.target;
        var pic_div = $(like_btn).parent().parent();
        var pic_id = pic_div.attr("id");

        var url = "http://localhost:4000/like/:" + pic_id;
        fetch(url, {
            method: "GET",
        }).then(function (response) {
            localStorage.setItem("like_res", response);
        });
    });

    $(".btn-bookmark").click(function (e) {
        console.log("bookmark button clicked");
        var bookmark_btn = e.target;
        var pic_div = $(bookmark_btn).parent().parent();
        var pic_id = pic_div.attr("id");

        var url = "http://localhost:4000/bookmark/:" + pic_id;
        fetch(url, {
            method: "GET",
        }).then(function (response) {
            localStorage.setItem("bookmark_res", response);
        });
    });

    function fetchGlobal() {
        return fetch("http://localhost:4000/global", {
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
        var my_id = data.my_id;
        var ranking = [];
        var pictures = [];
        ranking = ranking.concat(data.ranking);
        pictures = pictures.concat(data.pictures);

        var ranking_len = ranking.length;
        var pictures_len = pictures.length;

        for (var i = 0; i < ranking_len; i++) {
            var user_id = ranking[i].user_id;
            var username = ranking[i].username;

            var href = "/profile.html/user/" + user_id;

            var new_item = ranking_item_template.clone();
            new_item.attr("id", user_id);
            new_item.removeClass();
            new_item.addClass("ranking_item");

            new_item.find(".ranking_username").text(username);
            //new_item.find(".ranking_username").attr("href", href);
            new_item.find(".ranking_username").attr("id", user_id);

            var ranking_list = $("#ranking_list");
            ranking_list.append(new_item);
        }

        for (var j = 0; j < pictures_len; j++) {
            var user_id = pictures[j].user_id;
            var username = pictures[j].username;
            var pic_id = pictures[j].picture_id;
            var answer = pictures[j].answer;
            var like_num = pictures[j].like_num;
            var bookmark_num = pictures[j].bookmark_num;
            var tag = pictures[j].tag;
            var picture_src = pictures[j].picture;

            var has_like = pictures[j].has_like;
            var has_bookmark = pictures[j].has_bookmark;

            var new_item = picture_item_template.clone();

            new_item.attr("id", pic_id);

            new_item.removeClass();
            new_item.addClass("card");

            new_item.find("#img_picture").attr("src", picture_src);
            new_item.find("#img_picture").attr("id", pic_id);

            new_item.find("#guessbtn_picture").attr("id", pic_id);

            new_item.find("#like_picture").attr("id", pic_id);
            new_item.find("#like_num").text(like_num);

            new_item.find("#bookmark_picture").attr("id", pic_id);
            new_item.find("#bookmark_num").text(bookmark_num);

            new_item.find("#owner_name").text(username);
            new_item.find("#owner_name").attr("id", user_id);

            if (has_like == "0") {
                new_item.find("#like_picture").css('color', 'gray');
                new_item.find("#like_picture").attr("value", "0");
            }
            else {
                new_item.find("#like_picture").css('color', 'rgba(165, 28, 70, 0.57)');
                new_item.find("#like_picture").attr("value", "1");
            }

            if (has_bookmark == "0") {
                new_item.find("#bookmark_picture").css('color', 'gray');
                new_item.find("#bookmark_picture").attr("value", "0");
            }
            else {
                new_item.find("#bookmark_picture").css('color', 'rgba(165, 28, 70, 0.57)');
                new_item.find("#bookmark_picture").attr("value", "1");
            }

            var picture_list = $("#picture_list");
            picture_list.append(new_item);
        }

    });

}








