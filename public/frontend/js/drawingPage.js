var drawingApp = (function(){

	var clickX = new Array();
	var clickY = new Array();
	var clickDrag = new Array();
	var context;
	var canvasElement;
	var mousePressed = false;
	var lastX, lastY;

	var drawColor = "black";

	var redColor = "#ac3939";
	var blueColor = "#0059b3";
	var blackColor = "black";

	var drawSize = 2;

	var smallSize = 2;
	var midSize = 5;
	var bigSize = 9;

	var setColor = function selectColor(){
		var srcid = $(this).attr('id');
		console.log("selectColor: " + srcid);

		if (srcid == "red-picker"){
			drawColor = redColor;
		}
		else if (srcid == "blue-picker"){
			drawColor = blueColor;
		}
		else{
			drawColor = blackColor;
		}
	}

	var setSize = function selectSize(){
		var srcid = $(this).attr('id');
		console.log("selectSize: " + srcid);

		if (srcid == "small-size"){
			drawSize = smallSize;
		}
		else if (srcid == "mid-size"){
			drawSize = midSize;
		}
		else{
			drawSize = bigSize;
		}
	}

	function addClick(x, y, dragging)
	{
	  clickX.push(x);
	  clickY.push(y);
	  clickDrag.push(dragging);
	}

	function Draw(x, y, isDown) {
	    if (isDown) {
	        context.beginPath();
	        context.strokeStyle = drawColor;
	        context.lineWidth = drawSize;
	        context.lineJoin = "round";
	        context.moveTo(lastX, lastY);
	        context.lineTo(x, y);
	        context.closePath();
	        context.stroke();
	    }
	    lastX = x; 
	    lastY = y;
	}	

	init = function (width, height) {
		canvasElement = document.getElementById("canvas");
		context = canvasElement.getContext("2d");

		canvasElement.width = $(".mid-lane").width();   // Add this to your code
		canvasElement.height = ($(".mid-lane").height())*0.8;

	    $('#canvas').mousedown(function (e) {
	        mousePressed = true;
	        Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, false);
	    });

	    $('#canvas').mousemove(function (e) {
	        if (mousePressed) {
	            Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, true);
	        }
	    });

	    $('#canvas').mouseup(function (e) {
	        mousePressed = false;
	    });

		$('#canvas').mouseleave(function (e) {
	        mousePressed = false;
	    });

	    $(".btn-color").click(setColor);
	    $(".btn-size").click(setSize);

		document.getElementById("btn-clear").addEventListener("click", function(e){
			context.clearRect(0, 0, canvasElement.width, canvasElement.height);
			clickX = new Array();
			clickY = new Array();
			clickDrag = new Array();
		}, false);

        $("#search_input").keypress(function(event){
            if(event.keyCode == 13){
                search();
            }
        });

		$("#btn-submit").click(function(e){
		    var keyword = $("#text-keyword").text();
            var tag = $("#tag_input").val();
            var des = $("#description_input").val();

			var canvasTemp = document.getElementById("canvas");
			var img_data = canvasTemp.toDataURL("image/png");

			var data = {"picture": img_data, "tag":tag, "description":des, "keyword":keyword};

			fetch("http://localhost:4000/picture_submit", {
				method: "POST",
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify(data),
			}).then(function(response){
			    console.log("drawing submit: " + response);

                if (response.code == "1"){
                    var errorElement = document.getElementById("submit-error-msg");
                    errorElement.text("Submission Error, please submit again");
                    errorElement.style.color = "#bf4040";
                }
                else{
                    location.href = "globalStream.html";
                }
			});

		});

        $("#btn-keyword").click(function(e){

            var url = "http://localhost:4000/get_keyword";

            function fetchKeyword() {
                return fetch(url).then(function (response) {
                    return response.json();
                }).then(function (json) {
                    return json;
                });
            }

            fetchKeyword().then(function (result) {
                console.log(result);

                $("#text-keyword").text(result.keyword);
            });

        });

	};
	return {
		init: init
	};
}());









