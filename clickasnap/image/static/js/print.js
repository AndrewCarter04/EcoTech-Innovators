// Add a click handler to the button
document.addEventListener('DOMContentLoaded', function() {

  document.getElementById('printBtn').addEventListener('click', function() {

    const cat = document.getElementById('selectedImg');

    cat.crossOrigin = "anonymous";

    // create new 2d canvas
    const canvas = document.createElement("canvas");
    const context = canvas.getContext('2d');

    // set canvas to image size
    canvas.width = cat.width;
    canvas.height = cat.height;
    
    context.drawImage(cat, 0, 0);

    // convert canvas with image to base 64
    const base64_image = canvas.toDataURL();

    // call api
    goToTeemill(base64_image, "Black,White", 20.0);

  });
});


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

function getVanceAIImage(img_path) {

  const apiKey = "ddfa4d389fba85c522b24ebc09e1b2fd";

      const formData = new FormData();
      formData.append('file', blob, 'image.webp');
      formData.append('api_token', apiKey);

      const options = {
        method: 'POST',
        body: formData,
      };

      fetch('https://api-service.vanceai.com/web_api/v1/upload', options)
        .then(response => response.json())
        .then(response => {
          console.log(response);
        })
        .catch(err => console.error(err));

  // Potentially use flask to handle download integration
  
  
  
}

getVanceAIImage("https://d1unuvan7ts7ur.cloudfront.net/0x750/filters:strip_exif()/6ec81777-2fb7-4cad-9284-1dab8641c145/01H9K9H4692JP121ABS02JJ75V");


// clothing colour calculator

var possibleColours = [
  "",
  "",
  ""
];

function calculateColour(img) {

  
  
}

function colourValueToName() {

  
  
}