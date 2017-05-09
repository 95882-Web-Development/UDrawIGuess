$(document).ready(function () {
    init();
})

function init() {

    console.log("enter history.init");

    var history_template = $("#history_template");

    var url = "http://localhost:4000/show_history";

    function fetchHistory() {
        return fetch(url).then(function (response) {
            return response.json();
        }).then(function (json) {
            return json;
        });
    }

    fetchHistory().then(function (result) {
        console.log(result);
        var data = result;

        var history_len = data.length;

        console.log(history_len);

        for (var i = 0; i < history_len; i++){
            var content = data[i].record;
            var new_item = history_template.clone();

            new_item.find("#history-content").text(content);
            new_item.removeClass();

            var historyList = $(".history-list");
            historyList.append(new_item);
        }

    });
}

