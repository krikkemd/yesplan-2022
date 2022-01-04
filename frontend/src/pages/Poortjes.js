import React, { useEffect, useState } from 'react';
import '../css/poortjes.css';
import datum from '../util/helper';

export const Poortjes = ({ data }) => {
  const [shows, setShows] = useState([data]);
  let [showIndex, setShowIndex] = useState(0);
  let [width, setWidth] = useState(0);
  let [height, setHeight] = useState(0);

  useEffect(() => {
    setWidth(window.screen.width);
    setHeight(window.screen.height);
  }, []);

  console.log(height);
  console.log(width);
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
      {/* background image + overlay */}
      <img
        style={{ position: 'absolute', top: 0, left: 0, zIndex: -1 }}
        src={shows[showIndex]?.narrowcastingOriginalName}></img>
      <div className={'image-overlay'}></div>

      {/* Genre */}
      <div className='text-container-blue' style={{ top: '841px', left: '50px' }}>
        <div className={'text-medium white'}>{shows[showIndex]?.genre}</div>
      </div>

      {/* Date */}
      <div className='text-container-blue' style={{ top: '901px', left: '50px' }}>
        <div className={'text-medium white'}> {datum}</div>
      </div>

      {/* Event Information */}
      <div className='text-container-blue' style={{ top: '966px', left: '50px' }}>
        <div className={'text-large white'}>
          {shows[showIndex]?.location} {shows[showIndex]?.narrowcastingTonen}{' '}
          {shows[showIndex]?.narrowcastingTitel}
        </div>
      </div>
    </div>
  ) : (
    <div>Poortjes: Geen voorstellingen vandaag</div>
  );
};
