import React, { useEffect, useRef, useState } from 'react';
import '../css/poortjes.css';
import datum from '../util/helper';
import BackupPoortjes from './BackupPoortjes';

export const Poortjes = ({ data }) => {
  const [shows, setShows] = useState([data]);
  let [showIndex, setShowIndex] = useState(0);

  let [width, setWidth] = useState(window.screen.width);
  let [height, setHeight] = useState(window.screen.height);
  const [layout, setLayout] = useState(width > height ? 'landscape' : 'portrait');
  const [elHeight, setElHeight] = useState();

  const elRef = useRef();
  console.log(elRef);

  const getElHeight = () => {
    setElHeight(elRef.current.clientHeight);
  };

  // Get the height of the ref element to determine positioning of the text boxes
  useEffect(() => {
    getElHeight();
  }, [elRef?.current?.clientHeight]);

  // Get the screen resolution
  const getScreenSize = () => {
    console.log('resize');
    setWidth(window.screen.width);
    setHeight(window.screen.height);
    console.log(window);

    // window.screen.width > window.screen.height ? setLayout('landscape') : setLayout('portrait');
    window.innerWidth > window.innerHeight ? setLayout('landscape') : setLayout('portrait');

    console.log(window.screen.width);
    console.log(window.screen.height);
  };

  // Update 'width' and 'height' when the window resizes
  // https://www.kindacode.com/article/react-get-the-width-height-of-a-dynamic-element/
  useEffect(() => {
    window.addEventListener('resize', getScreenSize);
  }, []);

  // useEffect to determine which event to show
  useEffect(() => {
    // filter out shows with ncTonen === null and sort on show start
    setShows(
      data
        .filter(show => show.narrowcastingTonen !== null && show)
        .sort((a, b) => {
          return a.start < b.start ? -1 : a.start > b.start ? 1 : 0;
        }),
    );

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

  return shows && shows.length && shows[showIndex] ? (
    <div>
      {/* background image + overlay */}
      <img
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: -1,
        }}
        src={
          shows[showIndex]?.narrowcastingOriginalName &&
          'http://10.0.209.29:5000/' +
            encodeURIComponent(`${layout}-${shows[showIndex]?.narrowcastingOriginalName}`)
        }></img>
      <div
        className={'image-overlay'}
        style={{ opacity: shows[showIndex]?.narrowcastingOriginalName ? 0.6 : 1 }}></div>

      {/* Genre */}
      {shows[showIndex]?.genre && (
        <div
          className='text-box box-teal'
          style={{ top: `${height - elHeight * 4}px`, left: `${elHeight}px` }}>
          <div className={'text-medium text-white'}>
            {shows[showIndex]?.genreExtra
              ? `${shows[showIndex]?.genre} | ${shows[showIndex]?.genreExtra}`
              : shows[showIndex]?.genre}
          </div>
        </div>
      )}

      {/* Date + time */}
      <div
        className='text-box box-teal'
        style={{ top: `${height - elHeight * 3}px`, left: `${elHeight}px` }}>
        <div className={'text-medium text-white'}>
          {datum} | {`${shows[showIndex]?.start} - ${shows[showIndex]?.end}`} |{' '}
          {shows[showIndex]?.location?.toUpperCase()}
        </div>
      </div>

      {/* Event Information */}
      <div
        ref={elRef}
        className='text-box box-purple'
        style={{ top: `${height - elHeight * 2}px`, left: `${elHeight}px` }}>
        <div className={'text-large text-white'}>
          {shows[showIndex]?.narrowcastingTitel?.toUpperCase()}{' '}
          <span className='text-medium text-white'>
            {shows[showIndex]?.narrowcastingUitvoerende}
          </span>
        </div>
      </div>
    </div>
  ) : shows[0] ? (
    // Shows[showindex] reset
    <BackupPoortjes
      shows={shows}
      layout={layout}
      elHeight={elHeight}
      elRef={elRef}
      height={height}
    />
  ) : (
    // Gesloten
    <div>
      {/* Image overlay */}
      <img
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 10,
        }}
        src={
          layout === 'landscape'
            ? 'http://10.0.209.29:5000/theater-gesloten.jpg'
            : 'http://10.0.209.29:5000/theater-gesloten-1080.jpg'
        }></img>
      {/* <div
        className={'image-overlay'}
        style={{ opacity: shows[showIndex]?.narrowcastingOriginalName ? 0.6 : 0.9 }}></div> */}

      {/* Datum */}
      {/* <div
        className='text-box box-teal'
        style={{ top: `${height - elHeight * 3}px`, left: `${elHeight}px` }}>
        <div className={'text-medium text-black'}>{datum} | DNK</div>
      </div> */}

      {/* Geen voorstellingen vandaag */}
      <div
        ref={elRef}
        className='text-box box-purple'
        style={{ top: `${height - elHeight * 2}px`, left: `${elHeight}px` }}>
        <div className={'text-large text-white'}>Geen voorstellingen vandaag</div>
      </div>
    </div>
  );
};
