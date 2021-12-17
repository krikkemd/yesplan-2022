import React from 'react';

export const AllEvents = ({ data }) => {
  return (
    data &&
    data.length > 0 &&
    data.map(event => {
      // console.log(event);
      // if (event.narrowcastingTonen !== null) {
      return (
        <div key={event.id}>
          <div>{event.id}</div>
          <div>{event.profile}</div>
          <div style={{ color: 'blue' }}>{event.name}</div>
          <div style={{ color: event.narrowcastingTonen === 'Voorstelling' ? 'red' : 'green' }}>
            {event.narrowcastingTonen}
          </div>
          <div>{event.location}</div>
          <div>{event.narrowcastingTitel}</div>
          <div style={{ fontWeight: 'bold' }}>{event.uitvoerende}</div>
          <div>{event.start}</div>
          <div>{event.pauze}</div>
          <div>{event.end}</div>
          {event.narrowcastingOriginalName && <img src={event.narrowcastingOriginalName} />}
          <hr></hr>
        </div>
      );
      // }
    })
  );
};
