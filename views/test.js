
var xhr = new XMLHttpRequest();
xhr.open("POST", "http://localhost:4000/picture_submit", true);
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
xhr.send({a:"aa"});