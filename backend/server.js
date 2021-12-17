process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION ❌ Shutting down...');
  console.log(err.name, err.message);
  console.log(err);
  process.exit(1);
});

// disable this in development
// const fs = require('fs');
// let options = {
//   key: fs.readFileSync('/etc/ssl/private/wildcard_dnk_nl_2021.key'),
//   cert: fs.readFileSync('/etc/ssl/certs/wildcard_dnk_nl_2021.crt'),
//   requestCert: false,
// };

const express = require('express');
const app = express();
// const server = require('https').createServer(options, app); // https (production)
const server = require('http').createServer(app); // http (development)
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xssClean = require('xss-clean');
const axios = require('axios');
const fs = require('fs');
const sharp = require('sharp');
require('dotenv').config();

const sharpImage = async (width, height, imagePath, outputPath) => {
  await sharp(imagePath, { failOnError: false })
    .resize(width, height)
    .toFormat('webp')
    .webp({ quality: 90 })
    .toFile(outputPath);
};

// function to empty the temp folder with original images
const emptyDir = directory => {
  console.log('deleting');
  fs.readdir(directory, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      fs.unlink(path.join(directory, file), err => {
        if (err) throw err;
      });
    }
  });
};

app.get('/', (req, res, next) => {
  res.send('Hello World');
});

// Middleware
const limiter = rateLimit({
  max: 3600,
  windowMs: 1000 * 60 * 60,
  message: 'Too many requests from this IP, please try again in an hour',
});

// Set HTTP security headers
app.use(helmet());

// Limit the use of API with 3600 requests per IP per hour (1 message per second)
app.use('/api', limiter);

// CORS
app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:3000'],
  }),
);

// Cookie Parser
app.use(cookieParser());

// Body Parser - Reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
// app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Data Sanitization against XSS attacks (removes things like html tags <script></script>)
app.use(xssClean());

app.use(express.static('images'));
// app.use(express.static('temp'));

/////////////////////////////////////////////////////////////////////////////////////////////////////////
// ROUTES
/////////////////////////////////////////////////////////////////////////////////////////////////////////

// Events today: hier ontvangen we de tijden (onderdaan meer query urls)
app.post('/showtimedata', async (req, res) => {
  let data;
  await axios
    .get(
      `https://denieuwekolk.yesplan.nl/api/events/date:${req.body.date}(status:definitief)?api_key=${process.env.API_KEY}`,
    )
    .then(async res => {
      data = await res.data;
    });
  res.json(data);
});

// Customdata: Hier ontvangen we de overige NC data (onderdaan meer query urls)
app.post('/ncdata', async (req, res) => {
  console.log(req.body);
  let data;
  await axios
    .get(
      `https://denieuwekolk.yesplan.nl/api/events/date:${req.body.date}(status:definitief) /customdata?=&valuesonly&api_key=${process.env.API_KEY}`,
    )
    .then(async res => {
      data = await res.data;
    });
  res.json(data);
});

app.post('/ncimages', async (req, res) => {
  let data;
  await axios
    .get(
      `https://denieuwekolk.yesplan.nl/api/events/date:${req.body.date}(status:definitief) /customdata?=&valuesonly&api_key=${process.env.API_KEY}`,
    )
    .then(async res => {
      data = await res.data;

      const imageUrls = [];
      // console.log(data);

      // Only keep events with narrowcasting_afbeelding !== null
      const onlyEventsWithImages = data.data.filter(
        show => show.items.narrowcasting_afbeelding !== null,
      );
      // console.log(onlyEventsWithImages);

      // Store all image urls and filenames inside its own array
      onlyEventsWithImages.map(event => {
        imageUrls.push({
          filename: event.items.narrowcasting_afbeelding.originalname,
          ncTonen: event.items.narrowcasting_tonen,
          dataurl: event.items.narrowcasting_afbeelding.dataurl + `?api_key=${process.env.API_KEY}`,
        });
      });

      return imageUrls;
    })
    .then(urls => {
      // if there are no images uploaded, return "no images uploaden"
      if (urls.length > 0) {
        // initialize an array which will hold all the image promises
        let promiseArray = [];
        urls.map(image => {
          // console.log(image);
          const temp_path = `./temp/${image.filename}`;
          const output_path = `./images/${image.filename}`;
          const imagePromise = axios
            .get(image.dataurl, { responseType: 'stream' })
            .then(async res => {
              const imageLocation = await new Promise((resolve, reject) => {
                res.data
                  .pipe(fs.createWriteStream(temp_path))
                  .on('finish', async () => {
                    if (image.ncTonen === 'Voorstelling') {
                      await sharpImage(400, 400, temp_path, output_path);
                    }
                    if (image.ncTonen === 'Evenement') {
                      await sharpImage(150, 150, temp_path, output_path);
                    }
                    if (image.ncTonen === null) {
                      console.log('ncTonen is leeg');
                      await sharpImage(150, 150, temp_path, output_path);
                    }

                    resolve(temp_path); // when the createWriteSteam is finished -> resolve the promise returning the path where the img is located
                  })
                  .on('error', e => reject(e));
              });
              // console.log(imageLocation);
              let readSavedImageLocation = fs.createReadStream(imageLocation); // create a readable stream from the just saved img
              // return readSavedImageLocation.path; // this returns the value to the .then imagePromise
              return 'http://10.0.209.29:5000/' + encodeURIComponent(`${image.filename}`); // this returns the value to the .then imagePromise
            });
          // console.log(imagePromise);
          // promiseArray.push(imagePromise);
          // console.log(promiseArray);
          promiseArray = [...promiseArray, imagePromise]; // add the imagePromise to the promiseArray
        });
        // console.log(promiseArray);

        // Return the values of the returned promises (imagePromise)
        Promise.all(promiseArray).then(values => {
          res.json(values);
        });
      } else {
        res.json({ status: 'No images uploaded' });
      }
    })
    .catch(err => {
      console.log(err);
    });
});

// App Config
const port = process.env.PORT || 5000;

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION ❌ Shutting down...');
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});

// Listen
server.listen(port, () => console.log(`hello, listening on port: ${port}`));
