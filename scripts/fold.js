$(document).ready(function () {

/** -----------------    Events related to the canvas  ---------------------------  */

	var shapeList;
	var lineList;
	var connectorList;
	var selectedObject;
	var dragging;
	var mouseX;
	var mouseY;
	var dragIndex;
	var dragHoldX;
	var dragHoldY;
	var timer;
	var targetX;
	var targetY;
	var easeAmount;
	var canvas;
	var context;
	var newDocument;
	var mode;
	var shapeOptionList;

	init();

	function init() {
		shapeList = [];
		shapeOptionList = [];
		newDocument = true;
		lineList = [];
		connectorList = [];
		selectedObject = null;
		easeAmount = 0.45;
		mode = "draw";
		$(".draw").addClass("selected");
		$("#titleBar").html("Untitled");
		canvas = document.getElementById("canvas");
		context = canvas.getContext("2d");
		canvas.addEventListener("click", mouseClickListener, false);
		

	}

	function Square (x, y, dimx, dimy) {
		this.x = x;
		this.y = y;
		this.dimx = dimx;
		this.dimy = dimy;
		this.color = "#000000";
		this.color2 = "#4D5BFF";
		this.lineWidth = 2;
		this.line1 = true;
		this.line2 = true;
		this.line3 = true;
		this.line4 = true;
		this.squareList = {};
		this.squareList['one'] = null;
		this.squareList['two'] = null;
		this.squareList['three'] = null;
		this.squareList['four'] = null;
		//A function for drawing the square in black.
		this.draw = function (context) {
			context.beginPath();
			context.rect(this.x, this.y, 50, 50);
			context.lineWidth = this.lineWidth;
			context.strokeStyle = this.color;
			context.stroke();	

			//draw dark lines if necessary
			if(!this.line1) {
				context.beginPath();
				context.fillStyle = "black";
				context.fillRect(this.x-5, this.y-1, 5, 52);
			}
			if(!this.line2) {
				context.beginPath();
				context.fillStyle = "black";
				context.fillRect(this.x-1, this.y+50, 52, 5);
			}
			if(!this.line3) {
				context.beginPath();
				context.fillStyle = "black";
				context.fillRect(this.x+50, this.y-1, 5, 52);
			}
			if(!this.line4) {
				context.beginPath();
				context.fillStyle = "black";
				context.fillRect(this.x-1, this.y-5, 52, 5);
			}	

		}
		//A function for drawing the optional squares (light blue).
		this.draw2 = function (context) {
			context.beginPath();
			context.rect(this.x, this.y, 50, 50);
			context.lineWidth = this.lineWidth;
			context.strokeStyle = this.color2;
			context.stroke();	
		}

		//The function below returns a Boolean value representing whether the point with the coordinates supplied "hits" the particle.
		this.hitTest = function (hitX, hitY) {
			return((hitX > this.x) && 
				(hitX < this.x + this.dimx) &&
				(hitY > this.y) &&
				(hitY < this.y + this.dimy));
		}

		this.drawSquares = function (context) {
			if (this.line1) {
				var newSquare = new Square(this.x - 55, this.y, 50, 50);
				shapeOptionList.push(newSquare);
				this.squareList['one'] = newSquare;
			}
			if (this.line2) {
				var newSquare = new Square(this.x, this.y + 55, 50, 50);
				shapeOptionList.push(newSquare);
				this.squareList['two'] = newSquare;
			}
			if (this.line3) {
				var newSquare = new Square(this.x + 55, this.y, 50, 50);
				shapeOptionList.push(newSquare);
				this.squareList['three'] = newSquare;
			}
			if (this.line4) {
				var newSquare = new Square(this.x, this.y - 55, 50, 50);
				shapeOptionList.push(newSquare);
				this.squareList['four'] = newSquare;
			}
			drawShapes();
		}

	}

	function mouseClickListener(evt) {

		var rect = canvas.getBoundingClientRect();
		mouseX = (evt.clientX - rect.left)*(canvas.width/rect.width);
		mouseY = (evt.clientY - rect.top)*(canvas.height/rect.height);

		drawScreen(mouseX, mouseY);

		canvas.removeEventListener("click", mouseClickListener, false);

		//code below prevents the mouse down from having an effect on the main browser window:
		if (evt.preventDefault) {
			evt.preventDefault();
		} //standard
		else if (evt.returnValue) {
			evt.returnValue = false;
		} //older IE
		return false;

	}

	function mouseClickListener2(evt) {

		//getting mouse position correctly 
		var rect = canvas.getBoundingClientRect();
		mouseX = (evt.clientX - rect.left)*(canvas.width/rect.width);
		mouseY = (evt.clientY - rect.top)*(canvas.height/rect.height);
		

		for (var i=0; i < shapeOptionList.length; i++) {
			if (shapeOptionList[i].hitTest(mouseX, mouseY)) {	

				//once one of the square have picked clicked on...

				for (var j = 0; j < shapeList.length; j++) {
					//go through each real square and see if one of their side squares matches up
					if (shapeList[j].squareList["one"] == shapeOptionList[i]) {
						shapeList[j].line1 = false;
						shapeOptionList[i].line3 = false;
					} else if (shapeList[j].squareList["two"] == shapeOptionList[i]) {
						shapeList[j].line2 = false;
						shapeOptionList[i].line4 = false;
					} else if (shapeList[j].squareList["three"] == shapeOptionList[i]) {
						shapeList[j].line3 = false;
						shapeOptionList[i].line1 = false;
					} else if (shapeList[j].squareList["four"] == shapeOptionList[i]) {
						shapeList[j].line4 = false;
						shapeOptionList[i].line2 = false;
					}
				}

				shapeList.push(shapeOptionList[i]);

				//clear option list
				shapeOptionList = [];

				drawShapes();
			}
		}

		canvas.removeEventListener("click", mouseClickListener2, false);

		//code below prevents the mouse down from having an effect on the main browser window:
		if (evt.preventDefault) {
			evt.preventDefault();
		} //standard
		else if (evt.returnValue) {
			evt.returnValue = false;
		} //older IE
		return false;


	}

	function mouseClickListener3(evt) {

		//getting mouse position correctly 
		var rect = canvas.getBoundingClientRect();
		mouseX = (evt.clientX - rect.left)*(canvas.width/rect.width);
		mouseY = (evt.clientY - rect.top)*(canvas.height/rect.height);


		for (var i=0; i < shapeList.length; i++) {
			if (shapeList[i].hitTest(mouseX, mouseY)) {	

				if (!(shapeList[i].color == "red")) {
					shapeList[i].color = "red";
				} else {
					shapeList[i].color = "black";
				}
				
				drawShapes();
			}
		}

		//code below prevents the mouse down from having an effect on the main browser window:
		if (evt.preventDefault) {
			evt.preventDefault();
		} //standard
		else if (evt.returnValue) {
			evt.returnValue = false;
		} //older IE
		return false;


	}

	function checkEmptyCanvas() {
		if (shapeList.length == 0) {
			canvas.addEventListener('click', mouseClickListener, false);
		}
	}

	function mouseMoveListener(evt) {
		//needs to be re-written
		var posX;
		var posY;
		var shapeRad = shapeList[dragIndex].dimx;
		var minX = 0;
		var maxX = canvas.width - shapeRad;
		var minY = 0;
		var maxY = canvas.height - shapeRad;
		
		//getting mouse position correctly 
		var rect = canvas.getBoundingClientRect();
		mouseX = (evt.clientX - rect.left)*(canvas.width/rect.width);
		mouseY = (evt.clientY - rect.top)*(canvas.height/rect.height);
		
		//clamp x and y positions to prevent object from dragging outside of canvas
		posX = mouseX - dragHoldX;
		posX = (posX < minX) ? minX : ((posX > maxX) ? maxX : posX);
		posY = mouseY - dragHoldY;
		posY = (posY < minY) ? minY : ((posY > maxY) ? maxY : posY);

		shapeList[dragIndex].x = posX;
		shapeList[dragIndex].y = posY;
		shapeList[dragIndex].color = "#4D5BFF";
		shapeList[dragIndex].lineWidth = 3;

		drawShapes();
	}

	function mouseMoveListener2 (evt) {

		//getting mouse position correctly 
		var rect = canvas.getBoundingClientRect();
		mouseX = (evt.clientX - rect.left)*(canvas.width/rect.width);
		mouseY = (evt.clientY - rect.top)*(canvas.height/rect.height);

		for (var i=0; i < shapeList.length; i++) {
			if (shapeList[i].hitTest(mouseX, mouseY)) {	

				$("#canvas").css({"cursor":"pointer"});
			} else {
				$("#canvas").css({"cursor":"auto"});
			}
		}

		//code below prevents the mouse down from having an effect on the main browser window:
		if (evt.preventDefault) {
			evt.preventDefault();
		} //standard
		else if (evt.returnValue) {
			evt.returnValue = false;
		} //older IE
		return false;
	}


	function drawScreen(x, y) {
		var newSquare = new Square(x, y, 50, 50);
		shapeList.push(newSquare);
		if (newDocument) {
			newDocument = false;
			$("#titleBar").html("* " + $("#titleBar").html());
		}
		drawShapes();	
	}


	function drawShapes() {
		//Call the draw function on each shape to draw onto the canvas
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.beginPath();
		context.fillStyle ="#FFFFFF";
		context.fillRect(0, 0, canvas.width, canvas.height);
		
		for (var i = 0; i < shapeOptionList.length; i++) {
			shapeOptionList[i].draw2(context);
		}
		for (var i = 0; i < shapeList.length; i++) {
			shapeList[i].draw(context);
		}
	}

	function clearCanvas() {
		//Clear all shapes off of the canvas
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.beginPath();
		context.fillStyle ="#FFFFFF";
		context.fillRect(0, 0, canvas.width, canvas.height);
		shapeList = [];
		shapeOptionList = [];
		checkEmptyCanvas();
		canvas.removeEventListener("mousemove", mouseMoveListener2, false);
	}

/** -----------------    Events not related to the canvas  ---------------------------  */
	
	$("#file").on('click', function(evt) {
		 
		$("#menuDropdown").slideToggle();
		$("#menuDropdown").attr("tabindex", -1).focus();

		$("#menuDropdown").focusout(function() {
			$("#menuDropdown").slideUp();
		});
	});

	$("#clearCanvas").on('click', function() {
		clearCanvas(canvas);
	});

	$("#new").on('click', function () {
		if (!newDocument) {
			Alert.render("Any changes you made will be lost. Do you want to continue?");
		}
		
	});

	$(".tools").on('click', function () {
		mode = $(this).attr('class').replace("tools button ", "");
		if (mode == "delete" && $(".draw").hasClass("selected")) {
			$(".delete").addClass("selected");
			$(".draw").removeClass("selected");
			shapeOptionList = [];
			drawShapes();
			canvas.addEventListener("click", mouseClickListener3, false);
			canvas.addEventListener("mousemove", mouseMoveListener2, false);
		} else if (mode == "draw" && $(".delete").hasClass("selected")) {
			$(".draw").addClass("selected");
			$(".delete").removeClass("selected");
			canvas.removeEventListener("click", mouseClickListener3, false);
			canvas.removeEventListener("mousemove", mouseMoveListener2, false);
			for (var i=0; i < shapeList.length; i++) {
				shapeList[i].color = "#000000";	
			}
			
		}
		drawShapes();
	});

	$("#deleteObject").on('click', function () {
		for(var i = 0; i < shapeList.length; i++) {
			if (shapeList[i].color == "red") {
				for (var j = 0; j < shapeList.length; j++) {
					if (shapeList[i] == shapeList[j].squareList["one"]) {
						shapeList[j].line1 = true;
					} else if (shapeList[i] == shapeList[j].squareList["two"]) {
						shapeList[j].line2 = true;
					} else if (shapeList[i] == shapeList[j].squareList["three"]) {
						shapeList[j].line3 = true;
					} else if (shapeList[i] == shapeList[j].squareList["four"]) {
						shapeList[j].line4 = true;
					}
				}
				shapeList.splice(i, 1);
				i--;
			}
		}

		drawShapes();
		checkEmptyCanvas();

	});

	$("#addSquare").on('click', function () {
		if (shapeList.length > 0) {
			for (var i = 0; i < shapeList.length; i++) {
				shapeList[i].drawSquares(context);
			}
			canvas.addEventListener('click', mouseClickListener2, false);
		}

		if ($(".delete").hasClass("selected")) {
			$(".draw").addClass("selected");
			$(".delete").removeClass("selected");
			for (var i=0; i < shapeList.length; i++) {
				shapeList[i].color = "#000000";	
			}
			drawShapes();
		}

	});

	function CustomAlert() { 

		this.render = function(dialog) { 

			var winW = window.innerWidth; 
			var winH = window.innerHeight; 
			var dialogoverlay = document.getElementById('dialogoverlay'); 
			var dialogbox = document.getElementById('dialogbox'); 
			dialogoverlay.style.display = "block"; 
			dialogoverlay.style.height = winH+"px"; 
			dialogbox.style.left = (winW/2) - (550 * .5)+"px"; 
			dialogbox.style.top = "100px"; 
			dialogbox.style.display = "block"; 
			document.getElementById('dialogboxhead').innerHTML = "Acknowledge This Message"; 
			document.getElementById('dialogboxbody').innerHTML = dialog; 
			document.getElementById('dialogboxfoot').innerHTML = '<button id="yes">Yes</button>        <button id="cancel">Cancel</button>'; 
			$("#yes").on('click', function () {
				newResponse("yes");
			});
			$("#cancel").on('click', function () {
				newResponse("cancel");
			});
		} 
	} 

	function newResponse (response) {
		document.getElementById('dialogbox').style.display = "none"; 
		document.getElementById('dialogoverlay').style.display = "none";
		if (response == "yes") {
			clearCanvas();
			$("#titleBar").html("Untitled");
			newDocument = true;
		}
	}

	var Alert = new CustomAlert();
	
});
