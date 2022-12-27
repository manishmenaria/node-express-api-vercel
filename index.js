const express = require('express')

const app = express()
const PORT = 4000


////////////////

const bodyParser = require("body-parser");
// const keys = require("./keys");


app.use(bodyParser.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

const pinataSDK = require("@pinata/sdk");

const multer = require("multer");

const axios = require("axios");

//  ApiKey: "c960a22e122337147fc7",
//   SecretKey: "c92f5c4517005d9d9b3e41f0f2a4e5ca3c9eae3304a2c086465b6804d60d04ba",

const pinata = new pinataSDK("c960a22e122337147fc7", "c92f5c4517005d9d9b3e41f0f2a4e5ca3c9eae3304a2c086465b6804d60d04ba");

// const pinata = new pinataSDK(keys.ApiKey, keys.SecretKey);

const fs = require("fs");

const instance = axios.create({
  maxContentLength: 100 * 1024 * 1024,
});

// const upload = multer({
//   limits: {
//     fileSize: 100 * 1024 * 1024,
//   },
//   dest: "uploads/",
// });


app.post("/upload", upload.single("image"), (request, response) => {
  console.log(request.file.filename);

  let imageName = request.file.filename;

  const readableStreamForFile = fs.createReadStream("./uploads/" + imageName);

  const options = {
    pinataMetadata: {
      name: "BlockchainNFT_5",
      keyvalues: {
        customKey: "Blue",
        customKey2: "World",
      },
    },
    pinataOptions: {
      cidVersion: 0,
    },
  };
  pinata
    .pinFileToIPFS(readableStreamForFile, options)
    .then((result) => {
      //handle results here

      console.log(result);
      deleteFile("./uploads/" + imageName);
      response.json(result);
    })
    .catch((err) => {
      //handle error here
      console.log(err);
    });

  // pinata
  //   .testAuthentication()
  //   .then((result) => {
  //     //handle successful authentication here
  //     console.log(result);
  //   })
  //   .catch((err) => {
  //     //handle error here
  //     console.log(err);
  //   });
});

async function deleteFile(filePath) {
  try {
    await fs.promises.unlink(filePath);
    console.log("File deleted successfully!");
  } catch (err) {
    console.error(err);
  }
}

app.post('/submit', function(req, res) {
  // Get the data from the request body
  var data = req.body;

  // Do something with the data, such as save it to a database
  saveToDatabase(data);

  // Send a response back to the client
  res.send('Thank you for your submission!');
});


//////////////

app.listen(PORT, () => {
  console.log(`API listening on PORT ${PORT} `)
})

app.get('/', (req, res) => {
  res.send('Hey this is my API running 🥳')
})

app.get('/about', (req, res) => {
  res.send('This is my about route..... ')
})






// Export the Express API
module.exports = app
