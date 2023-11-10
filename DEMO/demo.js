// Define the button and canvas variables
const button = document.getElementById('buy_button');
const canvas = document.getElementById('drawing_canvas');

// Add a click handler to the button
button.addEventListener('click', (e) => {
  e.preventDefault();

  // Export the base64 image from the canvas
  const base64_image = canvas.toDataURL();

  // You’ll need to replace the API key below with your one, so the checkout has your branding and you get paid. Get your key inside your free teemill.com account. It's ok if the key is in the code as in this context it's a bearer token, and all the endpoint does is use it to return your checkout. If someone scrapes it and uses it in their code, you will just get more money.
  const apiKey = 'P3sbXrqgozFxB1SwZaFbCYwiKIL7Jy6g8rDcHRUj'; 

  // Set the fields to submit. image_url is the only required field for the API request. If you want, you can set the product name, description and price. You can also change the product type and colours using item_code and colours. To find an up-to-date list of available options for these fields, visit this endpoint: https://teemill.com/omnis/v3/product/options/
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      image_url: base64_image,
      item_code: "RNA1",
      name: "Hello World",
      colours: "White,Black",
      description: "Check out this awesome doodle tee, printed on an organic cotton t-shirt sustainably, using renewable energy. Created via the Teemill API and printed on demand.",
      price: 20.00,
    }),
  };

  // Open a new tab, ready to receive the product URL. 
  var newTab = window.open('about:blank', '_blank');
  newTab.document.write(
    "<body style='background-color:#faf9f9;width:100%;height:100%;margin:0;position:relative;'><img src='https://storage.googleapis.com/teemill-dev-image-bucket/doodle2tee_loader.gif' style='position:absolute;top:calc(50% - 100px);left:calc(50% - 100px);'/></body>"
  );

  // Send the API request, and redirect the new tab to the URL that is returned
  fetch('https://teemill.com/omnis/v3/product/create', options)
    .then(response => response.json())
    .then(response => newTab.location.href = response.url)
    .catch(err => console.error(err));

});



// Canvas. We're now into drawing, which you may find useful. Either way, you can see that whatever we put on the canvas will go on to the tee. You could use this, extend it or swap it out for your app content, text, images or whatever //

const context = canvas.getContext('2d');

let color = '#df1aae';

const colorPicker = document.getElementById('color_picker');
colorPicker.addEventListener('input', () => {
  color = colorPicker.value;
})

canvas.width = 1000;
canvas.height = 1300;

var drawingMode = false;
var lastEvent = null;
var lastSize = 0;
var maxSize = 15;
var minSize = 2;

function drawCircle(x, y, radius, color) {
  context.fillStyle = color;
  context.beginPath();
  const canvasRect = canvas.getBoundingClientRect();
  const canvasScale = canvas.width / canvasRect.width;
  context.save();
  context.scale(canvasScale, canvasScale);
  context.arc(
    x - canvasRect.x,
    y - canvasRect.y,
    radius, 0,
    Math.PI * 2,
  );
  context.fill();
  context.closePath();
  context.restore();
}

function onMouseDown(e) {
  if (e.touches) {
    e = e.touches[0];
  }

  lastEvent = e;
  drawingMode = true;
  document.getElementById('initial_message').classList.add('hidden');
}

function onMouseUp() {
  drawingMode = false;
}

function onMouseMove(e) {
  if (!drawingMode) {
    return;
  }
  if (e.touches) {
    e.preventDefault();
    e = e.touches[0];
  }
  let size = 1;

  // calculate the distance between the points and scale the size of the new circle based on that distance
  const deltaX = e.pageX - lastEvent.pageX;
  const deltaY = e.pageY - lastEvent.pageY;
  const distanceToLastMousePosition = Math.sqrt(
    (deltaX ** 2) +
    (deltaY ** 2)
  );

  size = Math.max(minSize, Math.min(maxSize, distanceToLastMousePosition / 3));

  if (drawingMode) {
    drawCircle(e.pageX, e.pageY, size, color);
  }

  if (lastSize) {
    const deltaSize = size - lastSize;

    for (let i = 0; i < distanceToLastMousePosition; i += 1) {
      const shift = (i / distanceToLastMousePosition);
      // draw circles between our new mouse position and our previous one, to smooth the line out
      drawCircle(
        e.pageX - (deltaX * shift),
        e.pageY - (deltaY * shift),
        size - (deltaSize * shift),
        color
      );
    }
  }

  lastEvent = e;
  lastSize = size;
}

canvas.addEventListener('mousedown', onMouseDown);
canvas.addEventListener('touchstart', onMouseDown);

canvas.addEventListener('mousemove', onMouseMove);
canvas.addEventListener('touchmove', onMouseMove);

window.addEventListener('mouseup', onMouseUp);
window.addEventListener('touchend', onMouseUp);