// Add a click handler to the button
document.addEventListener('DOMContentLoaded', function() {

  document.getElementById('printBtn').addEventListener('click', function() {

    

    // convert canvas with image to base 64
    const base64_image = imageToBase64();

    // call api
    goToTeemill(base64_image, "Black,White", 20.0);

  });
});


// image to base64

function imageToBase64() {
  const cat = document.getElementById('selectedImg');

  // create new 2d canvas
  const canvas = document.createElement("canvas");
  const context = canvas.getContext('2d');

  // set canvas to image size
  canvas.width = cat.width;
  canvas.height = cat.height;

  context.drawImage(cat, 0, 0);

  return canvas.toDataURL();
}


// api calls

// teemill
function goToTeemill(base64_image, colours, price) {

  
  
  const apiKey = '5QC77oaTjHNvevgwSHuIfvil6bQgQCbFWQyXjeyQ';

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
        name: "Custom",
        colours: colours,
        description: "Check out this awesome doodle tee, printed on an organic cotton t-shirt sustainably, using renewable energy. Created via the Teemill API and printed on demand.",
        price: price,
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
  
}

// vanceai

function getVanceAIImage(image) {

  const apiKey = "ddfa4d389fba85c522b24ebc09e1b2fd";

  const xhr = new XMLHttpRequest();

  xhr.open('GET', 'static/media/01H9K9H4692JP121ABS02JJ75V.webp', true);
  xhr.responseType = 'blob';

  xhr.onload = function () {
    if (xhr.status === 200) {
      const blob = xhr.response;
      // You can now work with the 'blob' data, for example, display it or send it to an API.

      const formData = new FormData();
      formData.append('file', blob);
      formData.append('api_token', apiKey);

      const options = {
        method: 'POST',
        body: formData,
      };

      fetch('https://api-service.vanceai.com/web_api/v1/upload', options)
        .then(response => response.json())
        .then(response => {
          console.log(response);
          processImage(response);
        })
        .catch(err => console.error(err));
    
    } else {
      console.error('Failed to fetch the file. Status code:', xhr.status);
    }
  };

  xhr.send();
  
}

function processImage(response) {

  const apiKey = "ddfa4d389fba85c522b24ebc09e1b2fd";
  const uid = response.data.uid;

  fetch('https://api-service.vanceai.com/web_api/v1/transform', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      api_token: apiKey,
      uid: uid,
      jconfig: JSON.stringify(
        {
            job: 'sketch',
            config: {
                module: 'sketch',
                module_params: {
                    model_name: 'SketchStable',
                    single_face: false,
                    composite: true,
                    sigma: 0,
                    alpha: 0
                },
            },
        }
      ),
    }),
  })
    .then(response => response.json())
    .then(response => {
      console.log(response);
      const intervalId = setInterval(() => checkStatus(response), 2000);
    })
    .catch(err => console.error(err));
  
}

function checkStatus(response) {

  const apiKey = "ddfa4d389fba85c522b24ebc09e1b2fd";
  const uid = response.data.trans_id;
  
  fetch('https://api-service.vanceai.com/web_api/v1/progress', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      api_token: apiKey,
      trans_id: uid,
    }),
  })
    .then(response => response.json())
    .then(response => {
      console.log(response);
      if (response.code === 200) {
        if (response.data.status === 'finish') {
          clearInterval(intervalId); 
          downloadImage(response);
      } else {
        console.error('Error:', response.message);
      }
    })
    .catch(err => console.error(err));
  
}

function downloadImage(response) {

  const apiKey = "ddfa4d389fba85c522b24ebc09e1b2fd";
  const uid = response.data.trans_id;

  // download the image
  
}

getVanceAIImage(imageToBase64());


// clothing colour calculator

// Predefined list of T-shirt colors with their RGB values
const tshirtColors = [
  { name: "Red", rgb: [255, 0, 0] },
  { name: "Green", rgb: [0, 255, 0] },
  { name: "Blue", rgb: [0, 0, 255] },
  { name: "Yellow", rgb: [255, 255, 0] },
  { name: "Black", rgb: [0, 0, 0] },
  { name: "White", rgb: [255, 255, 255] }
  // Add more color options as needed
];

// Usage
const avgRGB = getAverageColor(document.getElementById('selectedImg')); // Replace with your image URL
console.log(avgRGB);

function getAverageColor(imgEl) {

  var blockSize = 5, // only visit every 5 pixels
    defaultRGB = {r:0,g:0,b:0}, // for non-supporting envs
    canvas = document.createElement('canvas'),
    context = canvas.getContext && canvas.getContext('2d'),
    data, width, height,
    i = -4,
    length,
    rgb = {r:0,g:0,b:0},
    count = 0;

  if (!context) {
    return defaultRGB;
  }

  height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
  width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;

  context.drawImage(imgEl, 0, 0);

  try {
    data = context.getImageData(0, 0, width, height);
  } catch(e) {
    /* security error, img on diff domain */
    return defaultRGB;
  }

  length = data.data.length;

  while ( (i += blockSize * 4) < length ) {
    ++count;
    rgb.r += data.data[i];
    rgb.g += data.data[i+1];
    rgb.b += data.data[i+2];
  }

  // ~~ used to floor values
  rgb.r = ~~(rgb.r/count);
  rgb.g = ~~(rgb.g/count);
  rgb.b = ~~(rgb.b/count);

  return rgb;

}



// Usage
console.log(getAverageColor(document.getElementById('selectedImg')));
