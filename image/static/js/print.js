/** 

DO NOT EDIT ANYTHING BETWEEN THESE LINES - START

*/

// Add a click handler to the button
document.addEventListener('DOMContentLoaded', function() {
  
  document.getElementById('Geoff').addEventListener('click', function() {
    // convert canvas with image to base 64
    const base64_image = imageToBase64('selectedImg', 1024, 1024);
    // get AI caption using generative AI API
    const description = genAICaptionImage(base64_image, 1);
    // call api
    //goToTeemill(base64_image, "Black,White,Red,Tie Dye", description, 20.0);
    goToTeemill('', "Black,White,Red,Tie Dye", description, 20.0);
  });

  document.getElementById('Geoff2').addEventListener('click', function() {
    // convert canvas with image to base 64
    const base64_image = imageToBase64('sketch_Geoff', 512, 512);
    // get AI caption using generative AI API
    const description = genAICaptionImage(base64_image, 2);
    // call api
    goToTeemill(base64_image, "Black,White,Red,Tie Dye", description, 20.0);
  });
  
  document.getElementById('Geoff3').addEventListener('click', function() {
    // convert canvas with image to base 64
    const base64_image = imageToBase64('sketch_Geoff', 512, 512);
    // get AI caption using generative AI API
    const description = genAICaptionImage(base64_image, 2);
    // call api
    goToTeemill(base64_image, "Tie Dye,Black,White,Red", description, 20.0);
  });
  
});

/** 

DO NOT EDIT ANYTHING BETWEEN THESE LINES - END

*/


// image to base64
function imageToBase64(elementId, width, height) {
  const imgElement = document.getElementById(elementId);

  // create new 2d canvas
  const canvas = document.createElement("canvas");
  const canvasContext = canvas.getContext('2d');

  // set canvas to specified dimensions
  canvas.width = width;
  canvas.height = height;

  // draw image to canvas
  canvasContext.drawImage(imgElement, 0, 0);

  // return as base64
  return canvas.toDataURL();
}

function imageURLToBase64(img_url) {
  return new Promise((resolve, reject) => {
    // Create a new image element to load the image
    const img = new Image();

    // Set up an event handler to execute when the image is loaded
    img.onload = function() {
      // Create a new canvas element
      const canvas = document.createElement("canvas");
      const context = canvas.getContext('2d');

      // Set the canvas size to match the image size
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the image onto the canvas
      context.drawImage(img, 0, 0, img.width, img.height);

      // Get the base64 data URL of the canvas
      const base64Data = canvas.toDataURL('image/png');

      // Resolve the promise with the base64 data URL
      resolve(base64Data);
    };

    // Set the image source to load the image
    img.src = img_url;

    // Handle errors if the image fails to load
    img.onerror = function() {
      reject(new Error('Failed to load the image.'));
    };
  });
}


function uuid() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

/** 

DO NOT EDIT ANYTHING BETWEEN THESE LINES - START

*/

// ///////// //
// API Calls //
// ///////// //

/** TeeMill API call
 * @param {string} base64_image - base64 encoded image
 * @param {string} colours - the comma seperated list of colour options for the item
 * @param {number} price - the price of the item
*/
function goToTeemill(base64_image, colours, description, price) {
  // demo store key: P3sbXrqgozFxB1SwZaFbCYwiKIL7Jy6g8rDcHRUj
  // our demo store key: 5QC77oaTjHNvevgwSHuIfvil6bQgQCbFWQyXjeyQ
  const apiKey = '5QC77oaTjHNvevgwSHuIfvil6bQgQCbFWQyXjeyQ';
  
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        image_url: base64_image,
        item_code: "RNA1",
        name: "ClickASnap",
        colours: colours,
        description: description,
        price: price,
      }),
    };

    // Open a new tab, ready to receive and navigate to the product URL. 
    var newTab = window.open('about:blank', '_blank');
    newTab.document.write(
      "<body style='background-color:#faf9f9;width:100%;height:100%;margin:0;position:relative;'><img src='https://storage.googleapis.com/teemill-dev-image-bucket/doodle2tee_loader.gif' style='position:absolute;top:calc(50% - 100px);left:calc(50% - 100px);'/></body>"
    );

    // Send the API request
    fetch('https://teemill.com/omnis/v3/product/create', options)
      .then(response => response.json())
      .then(response => newTab.location.href = response.url) // redirect the new tab to the URL that is returned
      .catch(err => console.error(err));
  
}

/** 

DO NOT EDIT ANYTHING BETWEEN THESE LINES - END

*/

/** VanceAI API
 * @param {string} image_url - URL of the image
 * Starts the process of submitting, processing and downloading the Gen AI adapted image
*/

const vanceAIAPIKey = 'fb4dc054524e857de52b4f6083943727';

function getVanceAIImage(image_url) {

  const xhr = new XMLHttpRequest();

  xhr.open('GET', image_url, true);
  xhr.responseType = 'blob';

  xhr.onload = function () {
    if (xhr.status === 200) {
      const blob = xhr.response;

      const formData = new FormData();
      formData.append('file', blob);
      formData.append('api_token', vanceAIAPIKey);

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

  const uid = response.data.uid;

  const formData = new FormData();

  formData.append('api_token', vanceAIAPIKey);
  formData.append('uid', uid);
  formData.append('jconfig', JSON.stringify({
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
  }));
  
  fetch('https://api-service.vanceai.com/web_api/v1/transform', {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded',},
    body: formData,
  })
    .then(response => response.json())
    .then(response => {
      console.log(response);
      const intervalId = setInterval(() => checkStatus(response), 2000);
    })
    .catch(err => console.error(err));
  
}

function checkStatus(response) {

  const uid = response.data.trans_id;
  
  fetch('https://api-service.vanceai.com/web_api/v1/progress', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      api_token: vanceAIAPIKey,
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
        }
      } else {
        console.error('Error:', response.message);
      }
    })
    .catch(err => console.error(err));
  
}

function downloadImage(response) {

  const uid = response.data.trans_id;

  // download the image

  
  
}

//getVanceAIImage(imageToBase64());


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
//const avgRGB = getAverageColor(document.getElementById('selectedImg')); // Replace with your image URL
//console.log(avgRGB);

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
//console.log(getAverageColor(document.getElementById('selectedImg')));





















function genAICaptionImage(base64_img, style) {

  if (style==1) {
    return "Man with a blue shirt looking at the camera";
  } else {
    return "A close up of a drawing of a man";
  }
  
}

function andrewAPI(img_url) {

  // adapt this to use base64
  
  const xhr = new XMLHttpRequest();

  imageURLToBase64(img_url).then(base64Data => {
    console.log(base64Data);

    fetch('https://andrewcarter.ovh/api/generate_caption_base64', {method: 'POST',mode:'no-cors', body: {image: base64Data,},})
      .then(response => response)
      .then(response => {console.log(response);});
    
  })
  .catch(error => {
    console.error(error);
  });

  /*
  xhr.open('GET', img_url, true);
  xhr.responseType = 'blob';

  xhr.onload = function () {
    if (xhr.status === 200) {
      const blob = xhr.response;

      const formData = new FormData();
      formData.append('image', blob, 'image');

      console.log("fetching");
      
      fetch('https://andrewcarter.ovh/api/generate_caption', {method: 'GET', mode: 'no-cors', body:formData,})
      .then(response => response)
      .then(response => {
        console.log(response);
        console.log(response.description);
      })
      .catch(err => { console.error(err); });
      
    }
  }

  xhr.send();*/
  
}

//andrewAPI('https://ecotech-innovators.s5512591.repl.co/images/resized_geoff.jpg');