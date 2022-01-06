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
  const [eventInfoRefHeight, setEventInfoRefHeight] = useState();
  const [logoWidth, setLogoWidth] = useState();

  const elRef = useRef();
  const eventInfoRef = useRef();
  const logoRef = useRef();
  console.log(elRef);
  console.log(elHeight);
  console.log(eventInfoRefHeight);

  const getElHeight = () => {
    setElHeight(elRef.current.clientHeight + 15);
    setEventInfoRefHeight(eventInfoRef.current.clientHeight);
    setLogoWidth(logoRef.current.clientWidth);
  };

  // Get the height of the ref element to determine positioning of the text boxes
  useEffect(() => {
    getElHeight();
  }, [elRef?.current?.clientHeight, showIndex]);

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

      {/* Container */}
      <div className='container' style={{ paddingLeft: `${elHeight}px` }}>
        {/* Genre */}
        {shows[showIndex]?.genre && (
          <div
            className='text-box box-teal'
            style={{ top: `${height - elHeight * 3 - eventInfoRefHeight}px` }}>
            <div className={'text-small text-semiBold text-black'}>
              {shows[showIndex]?.genreExtra
                ? `${shows[showIndex]?.genre} | ${shows[showIndex]?.genreExtra}`
                : shows[showIndex]?.genre}
            </div>
          </div>
        )}

        {/* Date + time */}
        <div
          ref={elRef}
          className='text-box box-teal'
          style={{ top: `${height - elHeight * 2 - eventInfoRefHeight}px` }}>
          <div className={'text-small text-semiBold text-black'}>
            {datum} | {`${shows[showIndex]?.start} - ${shows[showIndex]?.end}`} |{' '}
            {shows[showIndex]?.location?.toUpperCase()}
          </div>
        </div>

        {/* Event Information */}
        <div
          ref={eventInfoRef}
          className='text-box box-purple'
          style={{
            top: `${height - elHeight - eventInfoRefHeight}px`,
            marginRight: layout === 'landscape' ? `${logoWidth + elHeight * 2}px` : `${elHeight}px`,
            zIndex: 10,
          }}>
          <div className={'text-large text-semiBold text-white'}>
            {shows[showIndex]?.narrowcastingTitel?.toUpperCase()}{' '}
            {layout === 'landscape' && (
              <span className='text-medium text-regular text-white'>
                {shows[showIndex]?.narrowcastingUitvoerende}
              </span>
            )}
            {layout === 'portrait' && (
              <div className='text-medium text-regular text-white'>
                {shows[showIndex]?.narrowcastingUitvoerende}
              </div>
            )}
          </div>
        </div>

        {/* DNK Logo */}
        <div
          ref={logoRef}
          className='text-box box-purple'
          style={
            layout === 'landscape'
              ? {
                  top: `${height - elHeight * 2.5}px`,
                  right: `${elHeight}px`,
                  paddingBottom: `${elHeight * 2.5}px`,
                  zIndex: 1,
                }
              : {
                  bottom: `${height - elHeight * 2.5}px`,
                  right: `${elHeight}px`,
                  paddingTop: `${elHeight * 2.5}px`,
                  zIndex: 1,
                }
          }>
          <div className={'text-largest text-regular text-white'}>DNK</div>
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
        <div className={'text-large text-semiBold text-white'}>Geen voorstellingen vandaag</div>
      </div>
    </div>
  );
};
