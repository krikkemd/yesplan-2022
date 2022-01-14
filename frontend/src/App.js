import { useEffect, useState } from 'react';
import { AllEvents } from './pages/AllEvents';
import { Poortjes } from './pages/Poortjes';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Colors from './pages/Colors';

function App() {
  // 1) GET DATA AND PROCESS
  // Data Query Urls:
  const showTimeQuery = 'http://10.0.209.29:5000/showtimedata'; // alle data omtrent tijden van voorstellingen
  const narrowcastingQuery = 'http://10.0.209.29:5000/ncdata'; // valuesOnly query, een hele bak yesplan data incl. NC

  // Local state
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();

  const urls = ['http://10.0.209.29:5000/showtimedata', 'http://10.0.209.29:5000/ncdata'];

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
        const narrowcastingColor1 = show.items.narrowcasting_kleur1;
        const narrowcastingColor2 = show.items.narrowcasting_kleur2;
        const narrowcastingTextColor1 = show.items.narrowcasting_tekstkleur1;
        const narrowcastingTextColor2 = show.items.narrowcasting_tekstkleur2;
        const narrowcastingAfbeelding = show.items.narrowcasting_afbeelding?.dataurl;
        const narrowcastingOriginalName = show.items.narrowcasting_afbeelding?.originalname;
        const genre = show.items?.voorstellingsinfo_genre;
        const genreExtra = show.items?.voorstellingsinfo_genreextra;
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
          narrowcastingColor1,
          narrowcastingColor2,
          narrowcastingTextColor1,
          narrowcastingTextColor2,
          narrowcastingOriginalName,
          extraInformatie,
          uitvoerende,
          genre,
          genreExtra,
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

      // if el.narrowcastingOriginalName is true, an img is uploaded to the event. Add the server ip adress in front of it, so it will rerender properly
      // finalArray.map(el => {
      //   if (el.narrowcastingOriginalName) {
      //     console.log(true);
      //     el.narrowcastingOriginalName =
      //       'http://10.0.209.29:5000/' +
      //       encodeURIComponent(`${el.narrowcastingTonen}-${el.narrowcastingOriginalName}`);
      //   }
      // });

      console.log(finalArray);

      setData(finalArray);
      setLoading(false);
    });
  };

  // Get all data interval
  useEffect(() => {
    getData();
    const interval = setInterval(() => {
      getData();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // PAINT THE DOM
  return (
    <Router>
      <div className='App'>
        {loading ? (
          <div>loading...</div>
        ) : (
          <Routes>
            <Route path='/' element={<Dashboard />} />
            <Route path='/allevents' element={<AllEvents data={data} />} />
            <Route path='/poortjes' element={<Poortjes data={data} />} />
            <Route path='/kleuren' element={<Colors />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
