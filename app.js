var express = require('express');
var request = require('request');
var app = express();

var config = {
  clientId: "50f483cc-c699-4df5-a383-ee19f6342da2",
  psk: "0d9b5bb9-c43f-4e49-921c-7e7d9c3c07a3",
  workflowId: "ef231d6b-b85b-4762-903e-b92548fde37b"
}

// homepage
app.get('/', function (req, res) {

  // setup process starting url
  var url = "https://app.keyp.io/api/authorize?token="+config.clientId+";"+config.workflowId;

  // show initial page
  res.send(`
    <html><head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <link href="https://fonts.googleapis.com/css?family=Poppins:300,400,600,700&amp;display=swap" rel="stylesheet">
      <link rel="stylesheet" href="https://try.keyp.io/css/sample.css">
    </head>
    <body class="startpage">
      <div class="startpage__top"><img src="https://try.keyp.io/img/keyp.svg" height="44" /></div>
      <div class="startpage__content">
        <h1>Welcome to the sample application</h1>

        <!-- integration with link in button -->

        <a class="start-now-button" href="`+url+`">Start signup process</a>

        <!-- integration with link in button -->

      </div>
      <div class="startpage__bottom"><div><a target="blank" class="small-link" href="https://keyp.io/legal-information/">Legal Notice</a> • <a target="blank" class="small-link" href="https://keyp.io/privacy-policy/">Privacy Policy</a> • <a target="blank" class="small-link" href="https://keyp.io/terms-of-use/">Terms and Conditions</a></div></div>
    </body></html>
  `);
})

// callback
app.get('/callback', function (req, res) {
  var url = "https://app.keyp.io/api/token";

  // fetch the data from the keyp service
  request.post({
    method: 'POST',
    uri: url,
    json: true,
    auth: {
      user: config.clientId,
      pass: config.psk
    },
    body: {
      code: req.query.code
    }
  }, (err, response, body) => {
    if (err) {
      res.send('An error happend. See logfiles for more details.');
      return console.error(err);
    }

    var token = JSON.stringify(body, null, 2);

    // show fetched data
    res.send(`
      <html><head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <link href="https://fonts.googleapis.com/css?family=Poppins:300,400,600,700&amp;display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://try.keyp.io/css/sample.css">
      </head>
      <body class="startpage">
        <div class="startpage__top navbar"><img src="https://try.keyp.io/img/keyp.svg" height="44" /><a href="/" class="start-now-button">Restart</a></div>
        <div class="signedup__content"><h1>Signup has been completed</h1><p class="paragraph">The following response object has been fetched from <span class="red">/api/token</span>:</p>
          <div class="token">

            <!-- show the data from the process -->

            <pre>`+token+`</pre>

            <!-- show the data from the process -->

          </div>
          <p class="paragraph">Check our <a href="https://keyp.io/documentation/" target="blank">documentation</a> for more information</p>
        </div>
        <div class="startpage__bottom"><div><a target="blank" class="small-link" href="https://keyp.io/legal-information/">Legal Notice</a> • <a target="blank" class="small-link" href="https://keyp.io/privacy-policy/">Privacy Policy</a> • <a target="blank" class="small-link" href="https://keyp.io/terms-of-use/">Terms and Conditions</a></div></div>
      </body></html>
    `);
  });
})

// start application
var server = app.listen(8081, 'localhost', function () {
   var host = server.address().address
   var port = server.address().port

   console.log("Keyp sample app is available at http://%s:%s/", host, port)
})
