var drawingApp = (function(){

	var clickX = new Array();
	var clickY = new Array();
	var clickDrag = new Array();
	var paint;
	var context;
	var canvasElement;
	var offsetLeft;
	var offsetTop;
	var mousePressed = false;
	var lastX, lastY;

	function addClick(x, y, dragging)
	{
	  clickX.push(x);
	  clickY.push(y);
	  clickDrag.push(dragging);
	}

	function redraw(){
	  //context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
	  
	  context.strokeStyle = "#df4b26";
	  context.lineJoin = "round";
	  context.lineWidth = 3;
				
	  for(var i=0; i < clickX.length; i++) {		
	    context.beginPath();
	    if(clickDrag[i] && i){
	      context.moveTo(clickX[i-1], clickY[i-1]);
	     }else{
	       context.moveTo(clickX[i]-1, clickY[i]);
	     }
	     context.lineTo(clickX[i], clickY[i]);
	     context.closePath();
	     context.stroke();
	  }
	}

	function Draw(x, y, isDown) {
	    if (isDown) {
	        context.beginPath();
	        context.strokeStyle = $('#selColor').val();
	        context.lineWidth = $('#selWidth').val();
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

		// canvasElement = document.getElementById("canvas");
		// context = canvasElement.getContext("2d");

		// console.log("offsetLeft: " + canvasElement.offsetLeft);
		// console.log("offsetTop: " + canvasElement.offsetTop);

		// offsetLeft = canvasElement.offsetLeft;
		// offsetTop = canvasElement.offsetTop;

		// context.canvas.addEventListener("mousedown", function(e){
		// 	// var rect = canvasElement.getBoundingClientRect();
		// 	// var mouseX = (e.clientX - rect.left) / (rect.right - rect.left) * canvasElement.width;
		// 	// var mouseY = (e.clientY - rect.top) / (rect.bottom - rect.top) * canvasElement.height;
    
		//   	var mouseX = e.clientX - offsetLeft;
		//   	var mouseY = e.clientY - offsetTop;
		//   	console.log("pageX: " + e.clientX);
		//   	console.log("pageY: " + e.clientY);
		//   	console.log("mouseX: " + mouseX);
		//   	console.log("mouseY: " + mouseY);
				
		//   	paint = true;
		//   	addClick(mouseX, mouseY);
		//   	redraw();
		// }, false); 


		// context.canvas.addEventListener("mousemove", function(e){
		//   if(paint){
		//  //  	var mouseX = (e.clientX - rect.left) / (rect.right - rect.left) * canvasElement.width;
		// 	// var mouseY = (e.clientY - rect.top) / (rect.bottom - rect.top) * canvasElement.height;
		// 	var mouseX = e.clientX - offsetLeft;
		//   	var mouseY = e.clientY - offsetTop;
		//     addClick(mouseX, mouseY, true);
		//     redraw();
		//   }
		// }, true); 

		// context.canvas.addEventListener("mouseup", function(e){
		//   paint = false;
		// }, false);

		// context.canvas.addEventListener("mouseleave", function(e){
		//   paint = false;
		// }, false);

		document.getElementById("btn-download").addEventListener("click", function(e){
			var canvasTemp = document.getElementById("canvas");
			var dt = canvasTemp.toDataURL("image/png");
		  	var image = document.getElementById("img-download");
		  	image.src = dt;
		}, false);

		document.getElementById("btn-clear").addEventListener("click", function(e){
			context.clearRect(0, 0, canvasElement.width, canvasElement.height);
			clickX = new Array();
			clickY = new Array();
			clickDrag = new Array();
		}, false);
	};
	return {
		init: init
	};
}());