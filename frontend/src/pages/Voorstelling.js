import React from 'react';

const Voorstelling = ({ show, i }) => {
  console.log(show);
  console.log('http://10.0.209.25:5000/' + encodeURIComponent(`${show.narrowcastingOriginalName}`));

  return (
    <div
      key={show.id}
      className={i}
      style={{
        display: 'flex',
        background: i % 2 ? '#fff' : '#eee',
        alignItems: 'top',
        justifyContent: 'space-between',
      }}>
      <div>
        <h3>Show Profile: {show.profile}</h3>
        <h1>Uitvoerende: {show.narrowcastingUitvoerende}</h1>
        <h2>Titel: {show.narrowcastingTitel}</h2>
        <p>Start: {show.start}</p>
        <p>Eind: {show.end}</p>
        <p>Voorstellingsbegeleider: {show.voorstellingsbegeleider}</p>
        {/* <p>{show.pauze && `Pauze: ${show.pauze}`}</p> */}
        {show.extraInformatie && `Extra informatie: ${show.extraInformatie}`}
        {/* kleedkamers */}
        {Object.keys(show.kleedkamers).length > 0 && <p>Kleedkamer indeling:</p>}
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
      </div>
      <div>
        {/* Image */}
        {show.narrowcastingOriginalName && (
          <img
            style={{
              width: '100%',
              // maxWidth: '500px',
              // maxHeight: '500px',
              objectFit: 'cover',
            }}
            src={
              'http://10.0.209.25:5000/' + encodeURIComponent(`${show.narrowcastingOriginalName}`)
            }
            alt='nc img'
          />
        )}
      </div>
    </div>
  );
};

export default Voorstelling;
