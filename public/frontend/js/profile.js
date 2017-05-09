$(document).ready(function () {
    init();
})

function logout(e){

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

function startFollow(e){

    var btnFollow = event.target;
    var user_id = localStorage.getItem("profile_user_id");

    var followStatus = $(btnFollow).attr("value");
    console.log(followStatus);

    if (followStatus=="0"){
        var url = "http://localhost:4000/follow/" + user_id;

        function fetchFollow() {
            return fetch(url).then(function (response) {
                return response.json();
            }).then(function (json) {
                return json;
            });
        }

        fetchFollow().then(function (result) {
            console.log(result);

            if (result.code == "1"){
                console.log("ERROR: follow incomplete");
            }
            else{
                $(btnFollow).text("Unfollow");
                $(btnFollow).attr("value", "1");
                $(btnFollow).css('background-color','#005c99');
                $(btnFollow).css('border-color','#004d80');
            }
        });
    }
    else{
        console.log("enter unfollow");

        var url = "http://localhost:4000/unfollow/" + user_id;

        function fetchUnfollow() {
            return fetch(url).then(function (response) {
                return response.json();
            }).then(function (json) {
                return json;
            });
        }

        fetchUnfollow().then(function (result) {
            console.log(result);

            if (result.code == "1"){
                console.log("ERROR: unfollow incomplete");
            }
            else{
                console.log("unfollow success");

                $(btnFollow).text("Follow");
                $(btnFollow).attr("value", "0");
                $(btnFollow).css('background-color','#B13B3B');
                $(btnFollow).css('border-color','#880909');
            }
        });
    }
}

function init() {
    console.log("enter profile page init");

    var user_id = localStorage.getItem("profile_user_id");
    var my_id = localStorage.getItem("my_id");

    console.log("profile page: " + user_id);
    console.log("my id: " + my_id);

    if (user_id == my_id){
        console.log("redirect to my page");
        location.href = "http://localhost:4000/frontend/myPage.html";
    }

    var picture_item_template = $("#picture_item_template");

    var url = "http://localhost:4000/user/" + user_id;

    console.log(url);

    function fetchProfile() {
        return fetch(url).then(function (response) {
            console.log(response);
            return response.json();
        }).then(function (json) {
            return json;
        });
    }

    fetchProfile().then(function (result) {
        console.log(result);
        var data = result;

        var user_id = data.user_id;
        var username = data.username;
        var check_follow = data.check_follow;
        var following_num = data.following_num;
        var follower_num = data.follower_num;

        var liked_by_num = 0;
        var bookmarked_by_num = 0;

        var pictures = [];
        pictures = pictures.concat(data.pictures);
        var pictures_len = pictures.length;

        $("#label_username").text(username);
        $("#num-following").text(following_num);
        $("#num-follower").text(follower_num);

        //check if has followed
        if (check_follow == "0"){
            $("#btn_follow").text("Follow");
            $("#btn_follow").attr("value", "0");
            $("#btn_follow").css('background-color','#B13B3B');
            $("#btn_follow").css('border-color','#880909');
        }
        else{
            $("#btn_follow").text("Unfollow");
            $("#btn_follow").attr("value", "1");
            $("#btn_follow").css('background-color','#005c99');
            $("#btn_follow").css('border-color','#004d80');
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

            liked_by_num = liked_by_num + parseInt(like_num);
            bookmarked_by_num = bookmarked_by_num + parseInt(bookmark_num);

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
                new_item.find(".btn-like").css("color", "gray");
                new_item.find(".btn-like").attr("value", "0");
            }
            else {
                new_item.find(".btn-like").css("color", "rgba(165, 28, 70, 0.57)");
                new_item.find(".btn-like").attr("value", "1");
            }

            if (has_bookmark == "0") {
                new_item.find(".btn-bookmark").css("color", 'gray');
                new_item.find(".btn-bookmark").attr("value", "0");
            }
            else {
                new_item.find(".btn-bookmark").css('color', 'rgba(165, 28, 70, 0.57)');
                new_item.find(".btn-bookmark").attr("value", "1");
            }

            var picture_list = $("#picture_list");
            picture_list.append(new_item);
        }

        console.log(liked_by_num)
        console.log(bookmarked_by_num)

        $("#num-like").text(liked_by_num);
        $("#num-bookmark").text(bookmarked_by_num);

    });
}