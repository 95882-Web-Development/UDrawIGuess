$(document).ready(function () {
    init();
})

function goToProfilePage(e){
    console.log("enter click follow list name");
    var person = event.target;
    var user_id = $(person).attr("id");
    localStorage.setItem("profile_user_id",user_id);
    location.href = "http://localhost:4000/frontend/profile.html";
}

function init() {

    console.log("enter friendList.init");

    var following_template = $("#following_template");
    var follower_template = $("#follower_template");

    var url = "http://localhost:4000/followlist";

    function fetchFriendList() {
        return fetch(url).then(function (response) {
            return response.json();
        }).then(function (json) {
            return json;
        });
    }

    fetchFriendList().then(function (result) {
        console.log(result);
        var data = result;

        var followerArr = [];
        var followingArr = [];

        followerArr = followerArr.concat(data.follower);
        followingArr = followingArr.concat(data.following);
        var followerNum = followerArr.length;
        var followingNum = followingArr.length;

        console.log(followerNum);
        console.log(followingNum);

        for (var i = 0; i < followingNum; i++){
            var user_id = followingArr[i].user_id;
            var username = followingArr[i].username;

            var new_item = following_template.clone();
            new_item.attr("id", user_id);
            new_item.removeClass();

            new_item.find(".name-follow-entry").text(username);
            new_item.find(".name-follow-entry").attr("id", user_id);

            var followList = $(".follow-list");
            followList.append(new_item);
        }

        for (var j = 0; j < followerNum; j++) {
            var user_id = followerArr[j].user_id;
            var username = followerArr[j].username;

            var new_item = follower_template.clone();
            new_item.attr("id", user_id);
            new_item.removeClass();

            new_item.find(".name-follower-entry").text(username);
            new_item.find(".name-follower-entry").attr("id", user_id);

            var followerList = $(".follower-list");
            followerList.append(new_item);
        }

    });
}





