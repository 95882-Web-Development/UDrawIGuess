$(document).ready(function () {
    init();
})

function init() {
    var picture_item_template = $("#picture_item_template");

    console.log("enter mypage.init");

    $("#search_input").keypress(function(event){
        if(event.keyCode == 13){
            search();
        }
    });

    var url = "http://localhost:4000/me";

    function fetchMe() {
        return fetch(url).then(function (response) {
            return response.json();
        }).then(function (json) {
            return json;
        });
    }

    fetchMe().then(function (result) {
        console.log(result);
        var data = result;

        var user_id = data.user_id;
        var username = data.username;
        var following_num = data.following_num;
        var follower_num = data.follower_num;
        var guess_num = data.guess_num;
        var guess_correct_num = data.guess_correct_num;

        var liked_by_num = 0;
        var bookmarked_by_num = 0;

        var pictures = [];
        pictures = pictures.concat(data.pictures);
        var pictures_len = pictures.length;

        $("#label_username").text(username);
        $("#num-following").text(following_num);
        $("#num-follower").text(follower_num);
        $("#num-guess").text(guess_num);
        $("#num-guess-correct").text(guess_correct_num);

        for (var j = 0; j < pictures_len; j++) {

            var user_id = pictures[j].user_id;
            var username = pictures[j].username;
            var pic_id = pictures[j].picture_id;
            var like_num = pictures[j].like_num;
            var bookmark_num = pictures[j].bookmark_num;
            var tag = pictures[j].tag;
            var des = pictures[j].description;
            var picture_src = pictures[j].picture;

            liked_by_num = liked_by_num + parseInt(like_num);
            bookmarked_by_num = bookmarked_by_num + parseInt(bookmark_num);

            var new_item = picture_item_template.clone();

            new_item.attr("id", pic_id);

            new_item.removeClass();
            new_item.addClass("card");

            new_item.find("#img_picture").attr("src", picture_src);
            new_item.find("#img_picture").attr("id", pic_id);

            var new_des = "Description: " + des;
            new_item.find("#description").text(new_des);
            var new_tag = "Tag: " + tag;
            new_item.find("#tag").text(new_tag);

            //new_item.find("#like_picture").attr("id", pic_id);
            new_item.find("#like_num").text(like_num);

            //new_item.find("#bookmark_picture").attr("id", pic_id);
            new_item.find("#bookmark_num").text(bookmark_num);

            new_item.find("#like_picture").css('color', 'rgba(165, 28, 70, 0.57)');
            new_item.find("#like_picture").attr("value", "1");

            new_item.find("#bookmark_picture").css('color', 'rgba(165, 28, 70, 0.57)');
            new_item.find("#bookmark_picture").attr("value", "1");

            var picture_list = $("#picture_list");
            picture_list.append(new_item);
        }

        $("#num-like").text(liked_by_num);
        $("#num-bookmark").text(bookmarked_by_num);

    });
}





