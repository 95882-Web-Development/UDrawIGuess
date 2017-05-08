$(document).ready(function () {
    init();
})

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
    console.log("profile page: " + user_id);

    var picture_item_template = $("#picture_item_template");

    var url = "http://localhost:4000/user/" + user_id;

    function fetchProfile() {
        return fetch(url).then(function (response) {
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
        var liked_by_num = data.liked_by_num;
        var bookmark_by_num = data.bookmarked_by_num;

        var pictures = [];
        pictures = pictures.concat(data.pictures);
        var pictures_len = pictures.length;

        $("#label_username").text(username);
        $("#num-following").text(following_num);
        $("#num-follower").text(follower_num);
        $("#num-like").text(liked_by_num);
        $("#num-bookmark").text(bookmark_by_num);

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