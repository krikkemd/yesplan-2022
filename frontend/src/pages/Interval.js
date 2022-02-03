import React, { useState, useEffect } from 'react';

const Interval = ({ combinedData }) => {
  const [show, setShow] = useState([]);

  const interval = (array = [], delay = 3000, index = 0) => {
    if (index < array.length) {
      setTimeout(function () {
        console.log(array[index]);
        setShow(array[index]);
        interval(array, delay, ++index);

        // reset index to show 0
        if (index === array.length) {
          index = 0;
          setTimeout(function () {
            console.log(array[index]);

            setShow(array[index]);
            interval(array, delay, ++index);
          }, delay);
        }
      }, delay);
    }
  };

  useEffect(() => {
    interval(combinedData);
  }, [combinedData]);

  return (
    <div className='App'>
      {show.profile ? (
        <div className='shows'>
          <h3>Show Profile: {show.profile}</h3>
          <h1>Uitvoerende: {show.narrowcastingUitvoerende}</h1>
          <h2>Titel: {show.narrowcastingTitel}</h2>
          <p>Start: {show.start}</p>
          <p>Eind: {show.end}</p>
          {show.voorstellingsbegeleider && (
            <p>Voorstellingsbegeleider: {show.voorstellingsbegeleider}</p>
          )}
          <p>{show.pauze && `Pauze: ${show.pauze}`}</p>
          {/* Kleedkamers */}
          {show.extraInformatie && `Extra informatie: ${show.extraInformatie}`}
          {show.kleedkamers && Object.keys(show.kleedkamers).length > 0 && (
            <p>Kleedkamer indeling:</p>
          )}
          {show.kleedkamers &&
            Object.keys(show.kleedkamers).map(el => {
              return (
                <ul key={el}>
                  <li>
                    {el[29] + '.' + el[30]}: {show.kleedkamers[el]}
                  </li>
                </ul>
              );
            })}
          <div>
            {/* Image */}
            <img
              style={{
                width: '100%',
                maxWidth: '500px',
                maxHeight: '500px',
                objectFit: 'cover',
              }}
              src={
                'http://10.0.209.25:5000/' + encodeURIComponent(`${show.narrowcastingOriginalName}`)
              }
              alt='nc img'
            />
          </div>
        </div>
      ) : (
        <div>closed</div>
      )}
    </div>
  );
};

// function do_timeout(items = [], callback = () => {}, delay = 50, index = 0) {
//   if (index < items.length) {
//     window.setTimeout(function () {
//       callback(items[index]);

//       do_timeout(items, callback, delay, ++index);
//     }, delay);
//   }
// }

export default Interval;
