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
    origin: ['http://localhost:3000', 'http://10.0.209.25:3000'],
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
// FALLBACK ROUTES
/////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get('/showtimedataFallback', async (req, res) => {
  console.log('get fallback showtime data');
  let rawData = fs.readFileSync('./data/showtimedata.json');
  let fallbackdata = JSON.parse(rawData);
  res.json(fallbackdata);
});

app.get('/ncdataFallback', async (req, res) => {
  console.log('get fallback NC data');
  let rawData = fs.readFileSync('./data/ncdata.json');
  let fallbackdata = JSON.parse(rawData);
  res.json(fallbackdata);
});

// Functions to save data to server:
const saveNcFallbackData = async () => {
  let data;
  await axios
    .get(
      `https://denieuwekolk.yesplan.nl/api/events/date:24-11-2021(status:definitief) /customdata?=&valuesonly&api_key=${process.env.API_KEY}`,
    )
    .then(async res => {
      data = await res.data;
    });

  // save data to local file
  let jsonContent = JSON.stringify(data);

  fs.writeFile('./data/ncdata.json', jsonContent, 'utf8', function (err) {
    if (err) {
      console.log('an error occured while writing JSON object to file');
      return console.log(err);
    }

    console.log('nc.json fallback file has been saved');
  });
};

const saveShowTimeFallbackData = async () => {
  let data;
  await axios
    .get(
      `https://denieuwekolk.yesplan.nl/api/events/date:24-11-2021(status:definitief)?api_key=${process.env.API_KEY}`,
    )
    .then(async res => {
      data = await res.data;
    });

  // save data to local file
  let jsonContent = JSON.stringify(data);

  fs.writeFile('./data/showtimedata.json', jsonContent, 'utf8', function (err) {
    if (err) {
      console.log('an error occured while writing JSON object to file');
      return console.log(err);
    }

    console.log('showtimedata.json fallback file has been saved');
  });
};

const saveImagesToServer = async () => {
  console.log('running saveImagesToServer');
  let data;
  await axios
    .get(
      `https://denieuwekolk.yesplan.nl/api/events/date:${`${new Date().getDate()}-${
        new Date().getMonth() + 1
      }-${new Date().getFullYear()}`}(status:definitief) /customdata?=&valuesonly&api_key=${
        process.env.API_KEY
      }`,
    )
    .then(async res => {
      data = await res.data;

      const imageUrls = [];

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
        urls.map(image => {
          const temp_path = `./temp/${image.ncTonen}-${image.filename}`;
          const folder_path = `./images/`;
          const file_name = `${image.ncTonen}-${image.filename}`;
          const output_path = `${folder_path}${file_name}`;

          axios.get(image.dataurl, { responseType: 'stream' }).then(async res => {
            await new Promise((resolve, reject) => {
              res.data
                .pipe(fs.createWriteStream(temp_path))
                .on('finish', async () => {
                  if (
                    !fs.existsSync(`./images/landscape-${image.filename}`) ||
                    !fs.existsSync(`./images/portrait-${image.filename}`)
                  ) {
                    console.log('sharp');
                    await sharpImage(1920, 1080, temp_path, `./images/landscape-${image.filename}`);
                    await sharpImage(1080, 1920, temp_path, `./images/portrait-${image.filename}`);
                  }

                  resolve(temp_path); // when the createWriteSteam is finished -> resolve the promise returning the path where the img is located
                })
                .on('error', e => reject(e));
            });
          });
        });
      } else {
        console.log('No images uploaded');
      }
    })
    .catch(err => {
      console.log(err);
    });
};

setInterval(() => {
  saveImagesToServer();
}, 10000);

setInterval(() => {
  saveShowTimeFallbackData();
  saveNcFallbackData();
  saveImagesToServer();
}, 300000);

// App Config
const port = process.env.PORT || 5001;

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION ❌ Shutting down...');
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});

// Listen
server.listen(port, () => console.log(`HELLO, FALLBACK SERVER listening on port: ${port}`));
