import { useEffect, useState } from 'react';

function App() {
  // 1) GET DATA AND PROCESS
  // Data Query Urls:
  const showTimeQuery = 'http://10.0.209.29:5000/showtimedata'; // alle data omtrent tijden van voorstellingen
  const narrowcastingQuery = 'http://10.0.209.29:5000/ncdata'; // valuesOnly query, een hele bak yesplan data incl. NC
  const narrowcastingImages = 'http://10.0.209.29:5000/ncimages'; // used serverside to save nc images to disk

  // Local state
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  const urls = [
    'http://10.0.209.29:5000/showtimedata',
    'http://10.0.209.29:5000/ncdata',
    'http://10.0.209.29:5000/ncimages',
  ];

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
        setData(finalArray);
        setLoading(false);
      })();
    });
  };

  useEffect(() => {
    getData();

    const interval = setInterval(() => {
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
    <div className='App'>
      <hr />
      {/* Date */}
      <p>{datum}</p>

      {loading ? (
        <div>loading...</div>
      ) : (
        data.length > 0 &&
        data.map(event => {
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
