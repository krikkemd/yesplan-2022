import React, { useEffect, useState } from 'react';
import '../css/poortjes.css';

export const Poortjes = ({ data }) => {
  const [shows, setShows] = useState([data]);
  let [showIndex, setShowIndex] = useState(0);

  // useEffect to determine which event to show
  useEffect(() => {
    // filter out shows with ncTonen === null
    setShows(data.filter(show => show.narrowcastingTonen !== null && show));

    // determines which event[x] is shown everytime data is renewed (renews every x seconds in App.js getAllData)
    if (shows && shows.length) {
      if (showIndex < shows.length) {
        setShowIndex(++showIndex);
        console.log(`showIndex: ${showIndex}`);
      }

      if (showIndex === shows.length) {
        console.log('reset showIndex');
        setShowIndex(0);
      }
    }
  }, [data]);

  return shows && shows.length ? (
    <div>
      {/* <img
        style={{ position: 'absolute', top: 0, left: 0, zIndex: -1 }}
        src={localStorage.getItem(
          `${shows[showIndex]?.narrowcastingOriginalName}-${shows[showIndex]?.narrowcastingTonen}`,
        )}></img> */}
      {/* <img
        style={{ position: 'absolute', top: 0, left: 0, zIndex: -1 }}
        src={localStorage.getItem(
          `${shows[showIndex]?.narrowcastingOriginalName}-${shows[showIndex]?.narrowcastingTonen}`,
        )}></img> */}
      <img
        style={{ position: 'absolute', top: 0, left: 0, zIndex: -1 }}
        src={`http://10.0.209.29:5000/${encodeURIComponent(
          shows[showIndex]?.narrowcastingTonen + '-' + shows[showIndex]?.narrowcastingOriginalName,
        )}`}></img>
      <div className={'image-overlay'}></div>
      <div className='text-container-blue'>
        <div className={'text'}>{shows[showIndex]?.location}</div>
        <div className={'text'}>{shows[showIndex]?.narrowcastingTonen}</div>
        <div className={'text'}>{shows[showIndex]?.narrowcastingTitel}</div>
      </div>
    </div>
  ) : (
    <div>Poortjes: Geen voorstellingen vandaag</div>
  );
};
