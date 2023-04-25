$(function() {
  // Get the canvas element
  var canvas = document.getElementById("canvas");

  // Set the canvas size to the window size
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Get the canvas context
  var ctx = canvas.getContext("2d");

  // Connect to the server using WebSockets
  var ws = new WebSocket("ws://localhost:8080");

  // Handle incoming messages
  ws.onmessage = function(event) {
    // Parse the JSON message
    var message = JSON.parse(event.data);

    // Draw the frame
    drawFrame(message);
  };

  // Draw a frame of the animation
  function drawFrame(frame) {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the background
    ctx.fillStyle = "rgb(" + frame.background.join(",") + ")";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the circles
    for (var i = 0; i < frame.circles.length; i++) {
      var circle = frame.circles[i];
      ctx.beginPath();
      ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI, false);
      ctx.fillStyle = "rgb(" + circle.color.join(",") + ")";
      ctx.fill();
    }

    // Draw the squares
    for (var i = 0; i < frame.squares.length; i++) {
      var square = frame.squares[i];
      ctx.fillStyle = "rgb(" + square.color.join(",") + ")";
      ctx.fillRect(square.x - square.size / 2, square.y - square.size / 2, square.size, square.size);
    }
  }
});
