$(document).ready(function () {
    init();
})

function init() {
    var ranking_item_template = $("#ranking_item_template");
    var picture_item_template = $("#picture_item_template");

    console.log("enter globalStream.init");

    $("li.a.ranking_username").click(function (event) {
        console.log("enter click ranking_username");
        //location.href="http://localhost:4000/frontend/profile.html";
        var rank_name = event.target;
        var user_id = rank_name.attr("id");

        var url = "http://localhost:4000/user/:" + user_id;
        fetch(url, {
            method: "GET",
        }).then(function(response) {
            localStorage.setItem("profile_user_id",user_id);
            location.href = "http://localhost:4000/frontend/profile.html";
        });
    });

    $(".btn-like").click(function(e){
        console.log("like button clicked");
        var like_btn = e.target;
        var pic_div = $(like_btn).parent().parent();
        var pic_id = pic_div.attr("id");

        var url = "http://localhost:4000/like/:" + pic_id;
        fetch(url, {
            method: "GET",
        }).then(function(response) {
            localStorage.setItem("like_res",response);
        });
    });

    $(".btn-bookmark").click(function(e){
        console.log("bookmark button clicked");
        var bookmark_btn = e.target;
        var pic_div = $(bookmark_btn).parent().parent();
        var pic_id = pic_div.attr("id");

        var url = "http://localhost:4000/bookmark/:" + pic_id;
        fetch(url, {
            method: "GET",
        }).then(function(response) {
            localStorage.setItem("bookmark_res",response);
        });
    });

    // $('body').on('click', 'a.ranking_username', function (event) {
    //     console.log("enter click ranking_username");
    //     location.href = "http://localhost:4000/frontend/profile.html";
    //     var rank_name = event.target;
    //     var user_id = rank_name.attr("id");
    //
    //     var url = "http://localhost:4000/user/:" + user_id;
    //     fetch(url, {
    //         method: "GET",
    //     }).then(function(response) {
    //         localStorage.setItem("profile_user_id",user_id);
    //         window.location = "http://localhost:4000/frontend/profile.html";
    //     });
    // });

    fetch("http://localhost:4000/global", {
        method: "GET",
    }).then(function(response){
        console.log("get_keyword response", response);
        var data = JSON.parse(response);
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

            var href = "/profile.html?user_id=" + user_id;

            var new_item = ranking_item_template.clone();
            new_item.attr("id", user_id);
            new_item.removeClass();
            new_item.addClass("ranking_item");

            new_item.find(".ranking_username").text(username);
            new_item.find(".ranking_username").attr("href", href);
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
            var tag = pictures[j].tag;
            var picture_src = pictures[j].picture;

            var user_href = "/profile.html?user_id=" + user_id;

            var new_item = picture_item_template.clone();

            new_item.attr("id", pic_id);

            new_item.removeClass();
            new_item.addClass("card");

            new_item.find("#img_picture").attr("src", picture_src);
            new_item.find("#owner_name").text(username);
            new_item.find("#owner_name").attr("href", user_href);
            new_item.find("#like_num").text(like_num);

            //like icon change color (liked/not liked)
            //bookmark icon change color (bookmarked/not bookmarked)

            var picture_list = $("#picture_list");
            picture_list.append(new_item);
        }

    });
}








