function logout(e) {
    console.log("enter user logout");

    var url = "http://localhost:4000/user_logout";

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

    location.href = "http://localhost:4000/frontend/login.html";
}


function clickLike(e) {

    var btnLike = event.target;
    var pic_id = $(btnLike).attr("id");
    console.log(pic_id);
    var likeStatus = $(btnLike).attr("value");
    console.log(likeStatus);

    if (likeStatus == "0") {
        console.log("fetch for likestatus 0");

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

                var likeNum = $(btnLike).next();
                var like_num = parseInt(likeNum.text())+1;
                console.log(like_num);
                $(likeNum).text(like_num);
            }
        });
    }
    else {
        console.log("fetch for unlike with 1")

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

                var likeNum = $(btnLike).next();
                var like_num = parseInt(likeNum.text())-1;
                console.log(like_num);
                $(likeNum).text(like_num);
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

        var url = "http://localhost:4000/add_bookmarks/" + pic_id;

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
    $('#guess_modal_input').val('');
    $("#modal_guess_err_msg").text('');

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
        $(".btn-guess-submit").attr("id", pic_id);
        $(".guess-modal-check-ans").attr("id", pic_id);
    });
}

function checkAnswer(e){
    var url = "http://localhost:4000/check_answer";
    var btnGuess = event.target;
    var pic_id = $(btnGuess).attr("id");
    var guess_ans = $("#guess_modal_input").val();

    var data = {"picture_id": pic_id, "guess_word":guess_ans};
    console.log("checkAnswer: guess " + guess_ans);

    function fetchCheckAns() {
        return fetch(url, {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data),
        }).then(function (response) {
            console.log(response);
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
    var guess_ans = $("#guess_modal_input").val();

    console.log("checkAnswer: guess " + guess_ans);

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
        console.log("get keyword: " + answer);

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