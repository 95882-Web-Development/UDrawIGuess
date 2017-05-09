$(document).ready(function () {
    init();
})

function init() {
    var picture_item_template = $("#picture_item_template");

    console.log("enter bookmarklist.init");

    var url = "http://localhost:4000/show_bookmarks";

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

        var pictures = [];
        pictures = pictures.concat(data.pictures);
        var pictures_len = pictures.length;

        for (var j = 0; j < pictures_len; j++) {

            var pic_id = pictures[j].picture_id;
            var like_num = pictures[j].like_num;
            var bookmark_num = pictures[j].bookmark_num;
            var tag = pictures[j].tag;
            var des = pictures[j].description;
            var picture_src = pictures[j].picture;

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

    });
}