import { useEffect, useState } from 'react';
import { AllEvents } from './pages/AllEvents';
import { Poortjes } from './pages/Poortjes';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  // 1) GET DATA AND PROCESS
  // Data Query Urls:
  const showTimeQuery = 'http://10.0.209.29:5000/showtimedata'; // alle data omtrent tijden van voorstellingen
  const narrowcastingQuery = 'http://10.0.209.29:5000/ncdata'; // valuesOnly query, een hele bak yesplan data incl. NC
  const narrowcastingImages = 'http://10.0.209.29:5000/ncimages'; // used serverside to save nc images to disk

  // Local state
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  // let [showIndex, setShowIndex] = useState(-1);
  const urls = [
    'http://10.0.209.29:5000/showtimedata',
    'http://10.0.209.29:5000/ncdata',
    // 'http://10.0.209.29:5000/ncimages',
  ];

  // get all data from urls above
  const getData = async () => {
    const promiseArray = urls.map(async url => {
      const data = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // date: `${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}`,
          date: '24-11-2021',
        }),
      });
      const result = data.json();
      return result;
    });

    Promise.all(promiseArray).then(values => {
      console.log(values);

      let timeObj = {};
      let ncObj = {};
      let finalArray = [];

      // Extract values from the data and create an array(times) of objects
      const times = values[0].data.map(value => {
        const name = value.name;
        const id = value.id;
        const start = value.defaultschedulestarttime;
        const end = value.defaultscheduleendtime;
        const location = value.locations[0].name;
        const profile = value.profile.name;

        timeObj = {
          id,
          name,
          start,
          end,
          location,
          profile,
        };

        return timeObj;
      });

      // Extract values from the data and create an array(nc) of objects
      const nc = values[1].data.map(show => {
        const id = show.event.id;
        const narrowcastingUitvoerende = show.items.narrowcasting_uitvoerende;
        const extraInformatie = show.items.narrowcasting_voorstelling_extrainformatie;
        const narrowcastingTitel = show.items.narrowcasting_voorstelling_titel;
        const narrowcastingTonen = show.items.narrowcasting_tonen;
        const narrowcastingAfbeelding = show.items.narrowcasting_afbeelding?.dataurl;
        const narrowcastingOriginalName = show.items.narrowcasting_afbeelding?.originalname;
        const uitvoerende = show.items.voorstellingsinfo_uitvoerende;
        const titel = show.items.voorstellingsinfo_titel;
        const pauze = show.items?.interneinformatietijden_pauzeduur;
        const voorstellingsbegeleider =
          show.items.voorstellingsbegeleider_voorstellingsbegeleider1?.contact?.name ||
          show.items.voorstellingsbegeleider_voorstellingsbegeleider1?.contact?.person?.name;

        ncObj = {
          id,
          narrowcastingUitvoerende,
          narrowcastingTitel,
          narrowcastingAfbeelding,
          narrowcastingTonen,
          narrowcastingOriginalName,
          extraInformatie,
          uitvoerende,
          pauze,
          titel,
          voorstellingsbegeleider,
          kleedkamers: [],
        };

        // add kleedkamer data to the obj at this point. Each show gets it's own kleedkamer information
        let kleedkamers = Object.keys(show.items).filter(el => {
          if (el.startsWith('kleedkamerindeling_kleedkamer')) {
            if (show.items[el] !== null) {
              ncObj.kleedkamers = {
                ...ncObj.kleedkamers,
                [el]: show.items[el],
              };
            }
          }
        });

        return ncObj;
      });

      // Combine the times array with the nc array (finalArray)
      times.map(el => {
        nc.map(val => {
          if (el.id === val.id) {
            finalArray.push({ ...el, ...val });
          }
        });
      });

      let imgArray = [];

      // values[2] is an array which containes the server image paths, which are downloaded from yesplan: http://10.0.209.29:5000/imageName
      // Push the image names without the server path to the imgArray
      // if (values[2].length > 0) {
      //   values[2].map(img => {
      //     let test = img.split('/');
      //     let oke = test[test.length - 1].split('%20').join(' ');
      //     imgArray.push(oke);
      //   });
      // }

      // console.log(imgArray);

      // // compare the imgArray values to the ncOriginalNames
      // finalArray.map(el => {
      //   imgArray.map(img => {
      //     if (el.narrowcastingOriginalName === img) {
      //       // if the values match, add the server path in front of the name so we can query it with getImageBlobs()
      //       console.log(true);
      //       el.narrowcastingOriginalName =
      //         'http://10.0.209.29:5000/' + encodeURIComponent(`${img}`);

      //       let test = localStorage.getItem(
      //         'http://10.0.209.29:5000/' + encodeURIComponent(`${img}-${el.narrowcastingTonen}`),
      //       );
      //       console.log(test);

      //       if (test === null || test !== el.narrowcastingOriginalName) {
      //         console.log('SET ITEM 🎈');
      //         localStorage.setItem(
      //           'http://10.0.209.29:5000/' + encodeURIComponent(`${img}-${el.narrowcastingTonen}`),
      //           'http://10.0.209.29:5000/' + encodeURIComponent(`${img}`),
      //         );
      //       }
      //     }
      //   });
      // });

      console.log(finalArray);

      // query the narrowcasting images and add them to promises. wait for the .map loop to complete before Promise.all()
      // (async () => {
      //   const promises = finalArray.map(async event => {
      //     if (event.narrowcastingOriginalName) {
      //       return (event.narrowcastingOriginalName = await getImageBlobs(
      //         event.narrowcastingOriginalName,
      //       ));
      //     }
      //   });

      //   await Promise.all(promises);
      //   // .then(res => {
      //   //   console.log(res);
      //   //   const lol = res.filter(res => res !== undefined && res);
      //   //   console.log(lol);
      //   //   lol.map(r => localStorage.setItem(`${r}`, r));
      //   // });

      //   console.log('all promises done, waited for loop to complete!');
      //   // console.log(
      //   //   'source: https://lavrton.com/javascript-loops-how-to-handle-async-await-6252dd3c795/',
      //   // );

      //   // 4) Sort finalarray array by event start times
      //   finalArray = finalArray.sort((a, b) => {
      //     return a.start < b.start ? -1 : a.start > b.start ? 1 : 0;
      //   });
      // })();
      setData(finalArray);
      setLoading(false);
    });
  };

  // Get all data interval
  useEffect(() => {
    // localStorage.clear();
    getData();
    const interval = setInterval(() => {
      // localStorage.clear();
      getData();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getImageBlobs = async url => {
    console.log('running getImageBlob');
    const res = await fetch(url, {
      method: 'GET',
      credentials: 'include',
    });

    const data = await res.blob();
    const blob = await URL.createObjectURL(data);
    // localStorage.setItem('blob', blob);
    // console.log(blob);
    // setBlob(blob);
    return blob;
  };

  let d = new Date();
  let days = ['ZO', 'MA', 'DI', 'WO', 'DO', 'VR', 'ZA'];
  let months = [
    'Januari',
    'Februari',
    'Maart',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Augustus',
    'September',
    'Oktober',
    'November',
    'December',
  ];

  let datum = `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`;

  // PAINT THE DOM
  return (
    <Router>
      <div className='App'>
        {/* <hr /> */}
        {/* Date */}
        {/* <p>{datum}</p> */}

        {loading ? (
          <div>loading...</div>
        ) : (
          <Routes>
            <Route path='/allevents' element={<AllEvents data={data} />} />
            <Route path='/poortjes' element={<Poortjes data={data} />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
