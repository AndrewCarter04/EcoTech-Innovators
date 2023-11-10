function goToTeemill(base64_image, colours, description, price) {
  const apiKey = '<Our API Key>';
  const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}`,},
      body: JSON.stringify({
          image_url: base64_image, item_code: "RNA1",
          name: "ClickASnap", colours: colours,
          description: description, price: price,
      }),};

  var newTab = window.open('about:blank', '_blank'); // open a new blank tab
  // display teemill loading image
    newTab.document.write(
      "<body style='background-color:#faf9f9;width:100%;height:100%;margin:0;position:relative;'><img src='https://storage.googleapis.com/teemill-dev-image-bucket/doodle2tee_loader.gif' style='position:absolute;top:calc(50% - 100px);left:calc(50% - 100px);'/></body>"
    );

    // Send the API request
    fetch('https://teemill.com/omnis/v3/product/create', options)
      .then(response => response.json())
      .then(response => newTab.location.href = response.url) // redirect the new tab to the URL that is returned
      .catch(err => console.error(err)); // catch any errors
  
}






























document.getElementById('carouselImg1').addEventListener('click', function() {
  // convert image to base 64
  const base64_image = imageToBase64('selectedImg', 1024, 1024);
  // get AI caption using generative AI API
  const description = genAICaptionImage(base64_image);
  // sends the user to the Teemill website
  // params:  image         colours                    description  price    
  goToTeemill(base64_image, "Black,White,Red,Tie Dye", description, 20.0);
});







