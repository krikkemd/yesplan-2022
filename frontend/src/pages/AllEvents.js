import React from 'react';

export const AllEvents = ({ event }) => {
  return (
    <div>
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
      <div>{event.end}</div>
      {event.narrowcastingOriginalName && <img src={event.narrowcastingOriginalName} />}
      <hr></hr>
    </div>
  );
};
