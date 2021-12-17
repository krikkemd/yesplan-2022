import { useEffect, useState } from 'react';

function App() {
  // 1) GET DATA AND PROCESS
  // Data Query Urls:
  const showTimeQuery = 'http://10.0.209.29:5000/showtimedata'; // alle data omtrent tijden van voorstellingen
  const narrowcastingQuery = 'http://10.0.209.29:5000/ncdata'; // valuesOnly query, een hele bak yesplan data incl. NC
  const narrowcastingImages = 'http://10.0.209.29:5000/ncimages'; // used serverside to save nc images to disk

  // initialize variables
  let voorstellingstijdenArray = [];
  let narrowcastingArray = [];
  let combinedData = [];
  let obj = {};

  // Local state
  const [showTimeData, setShowTimeData] = useState([]);
  const [ncData, setNcData] = useState([]);
  const [images, setImages] = useState([]);
  const [blob, setBlob] = useState('');
  const [loading, setLoading] = useState(true);
  const [allData, setAllData] = useState();
  const urls = [
    'http://10.0.209.29:5000/showtimedata',
    'http://10.0.209.29:5000/ncdata',
    'http://10.0.209.29:5000/ncimages',
  ];

  const getAllData = async () => {
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

      const times = values[0].data.map(value => {
        const name = value.name;
        const id = value.id;
        const start = value.defaultschedulestarttime;
        const end = value.defaultscheduleendtime;
        const location = value.locations[0].name;
        const profile = value.profile.name;

        return (timeObj = {
          id,
          name,
          start,
          end,
          location,
          profile,
        });
      });

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

        // if (uitvoerende && titel && voorstellingsbegeleider)
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

      // console.log(times);
      // console.log(nc);

      let finalArray = [];
      times.map(el => {
        nc.map(val => {
          if (el.id === val.id) {
            finalArray.push({ ...el, ...val });
          }
        });
      });

      let imgArray = [];

      if (values[2].length > 0) {
        values[2].map(img => {
          let test = img.split('/');
          let oke = test[test.length - 1].split('%20').join(' ');
          imgArray.push(oke);
        });
      }

      console.log(imgArray);

      finalArray.map(el => {
        imgArray.map(img => {
          if (el.narrowcastingOriginalName === img) {
            console.log(true);
            el.narrowcastingOriginalName =
              'http://10.0.209.29:5000/' + encodeURIComponent(`${img}`);
          }
        });
      });

      console.log(finalArray);

      (async () => {
        const promises = finalArray.map(async event => {
          if (event.narrowcastingOriginalName) {
            return (event.narrowcastingOriginalName = await getImageBlobs(
              event.narrowcastingOriginalName,
            ));
          }
        });

        await Promise.all(promises);

        console.log('all promises done, waited for loop to complete!');
        // console.log(
        //   'source: https://lavrton.com/javascript-loops-how-to-handle-async-await-6252dd3c795/',
        // );

        // 4) Sort finalarray array by start times
        finalArray = finalArray.sort((a, b) => {
          return a.start < b.start ? -1 : a.start > b.start ? 1 : 0;
        });
        setAllData(finalArray);
        setLoading(false);
      })();
    });
  };

  useEffect(() => {
    getAllData();

    const interval = setInterval(() => {
      getAllData();
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
    // console.log(blob);
    // setBlob(blob);
    return blob;
  };

  // Get showtimes function
  const getShowTimes = async () => {
    const res = await fetch(showTimeQuery, {
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

    const showTimeData = await res.json();
    console.log(showTimeData);

    // Only keep shows with specific profile, and status Definief
    // let filteredTijdenData = showTimeData.data.filter(
    //   show =>
    //     show.profile.name === 'Theater - Voorstelling' ||
    //     show.profile.name === 'Evenement - Theater/Bioscoop DNK' ||
    //     show.profile.name === 'Verhuring - Commercieel' ||
    //     show.profile.name === 'Verhuring - Cultureel/Amateur' ||
    //     show.profile.name === 'Verhuring - Interne DNK gebruikers' ||
    //     show.profile.name === 'Verhuring - Commercieel' ||
    //     (show.profile.name === 'Verhuring - Scholen' && show.status.name === 'Definitief' && show),
    // );
    // console.log('Data gefilterd op "voorstelling", "Evenement" en "Vehuring:"');
    // console.log(filteredTijdenData);
    let filteredTijdenData = showTimeData.data.filter(
      show => show.status.name === 'Definitief' && show,
    );
    console.log('Data gefilterd op "Definitief"');
    console.log(filteredTijdenData);

    // Initialize obj to write data to
    let obj = {};

    // Map through shows and push data to array
    filteredTijdenData.map(show => {
      const name = show.name;
      const id = show.id;
      const start = show.defaultschedulestarttime;
      const end = show.defaultscheduleendtime;
      const location = show.locations[0].name;
      const profile = show.profile.name;

      obj = {
        id,
        name,
        start,
        end,
        location,
        profile,
      };

      voorstellingstijdenArray.push(obj);
    });

    // Add array with showtimes to state
    setShowTimeData(voorstellingstijdenArray);
  };

  // get NC Images (for console logging, only used server side to save images to disk)
  const saveImages = async () => {
    const res = await fetch(narrowcastingImages, {
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
    const imageData = await res.json();
    setImages(imageData);
    setLoading(false);
    console.log(imageData);
    return imageData;
  };

  // Get NC data function
  const getNcData = async () => {
    const res = await fetch(narrowcastingQuery, {
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
    const narrowcastingData = await res.json();

    // Only keep shows that have a narrowcasting_afbeelding and narrowcasting_tonen !== null
    const filteredNarrowcastingData = narrowcastingData.data.filter(
      show =>
        // show.items.narrowcasting_afbeelding !== null &&
        show.items.narrowcasting_tonen !== null,
    );

    console.log(filteredNarrowcastingData);

    // Initialize obj to write data to
    let obj = {};

    // map through the data and add fields to the obj
    filteredNarrowcastingData.map(show => {
      // initialize fields we want to add
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

      // if (uitvoerende && titel && voorstellingsbegeleider)
      obj = {
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
            obj.kleedkamers = {
              ...obj.kleedkamers,
              [el]: show.items[el],
            };
          }
        }
      });

      // Push the NC data to the narrowCastingArray
      narrowcastingArray.push(obj);
    });

    console.log(narrowcastingArray);

    setNcData(narrowcastingArray);
  };

  // Combine showtime data with nc data into the combinedData array based on event id (nested loop)
  ncData.map(ncShow => {
    showTimeData.map(timeShow => {
      if (ncShow.id === timeShow.id) {
        obj = {
          ...ncShow,
          ...timeShow,
        };
      }
    });
    combinedData.push(obj);
  });

  // 4) Sort combinedData array by start times
  combinedData = combinedData.sort((a, b) => {
    return a.start < b.start ? -1 : a.start > b.start ? 1 : 0;
  });

  // 2) ADD DATE / TIME LOGIC
  // TODO: IMPLEMENT SOME TIME BASED LOGIC
  // check current time vs film start time, rerender?
  const t = new Date();
  let time = t.toLocaleTimeString().slice(0, 5);
  // time = '15:30';
  // console.log(`time = ${time}`);

  let timeNum = t.getTime();
  // console.log(timeNum);

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
  // console.log(`datum = ${datum}`);

  // PAINT THE DOM
  return (
    <div className='App'>
      <hr />
      {/* Date */}
      <p>{datum}</p>

      {loading ? (
        <div>loading...</div>
      ) : (
        allData.length > 0 &&
        allData.map(event => {
          // console.log(event);
          if (event.narrowcastingTonen !== null) {
            return (
              <div key={event.id}>
                <div>{event.id}</div>
                <div>{event.profile}</div>
                <div style={{ color: 'blue' }}>{event.name}</div>
                <div
                  style={{ color: event.narrowcastingTonen === 'Voorstelling' ? 'red' : 'green' }}>
                  {event.narrowcastingTonen}
                </div>
                <div>{event.location}</div>
                <div>{event.titel}</div>
                <div style={{ fontWeight: 'bold' }}>{event.uitvoerende}</div>
                <div>{event.start}</div>
                <div>{event.end}</div>
                {event.narrowcastingOriginalName && <img src={event.narrowcastingOriginalName} />}
                <hr></hr>
              </div>
            );
          }
        })
      )}
    </div>
  );
}

export default App;
