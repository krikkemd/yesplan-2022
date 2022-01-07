import React, { useEffect, useRef, useState } from 'react';
import '../css/poortjes.css';
import '../index.css';
import datum from '../util/helper';
import BackupPoortjes from './BackupPoortjes';

export const Poortjes = ({ data }) => {
  const [shows, setShows] = useState([data]);
  let [showIndex, setShowIndex] = useState(0);

  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  const [layout, setLayout] = useState(width > height ? 'landscape' : 'portrait');
  const [elHeight, setElHeight] = useState();
  const [genreHeight, setGenreHeight] = useState();
  const [eventInfoRefHeight, setEventInfoRefHeight] = useState();
  const [logoWidth, setLogoWidth] = useState();

  const testRef = useRef();
  const elRef = useRef();
  const eventInfoRef = useRef();
  const logoRef = useRef();

  const getElHeight = () => {
    setElHeight(elRef.current.clientHeight + 15);
    setGenreHeight(testRef?.current?.clientHeight + 15);
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
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);

    // window.innerWidth > window.screen.height ? setLayout('landscape') : setLayout('portrait');
    window.innerWidth > window.innerHeight ? setLayout('landscape') : setLayout('portrait');
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
          // maxWidth: '100%',
          // height: 'auto',
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
            ref={testRef}
            className={
              shows[showIndex].narrowcastingColor1
                ? `text-box box-${shows[showIndex].narrowcastingColor1}`
                : 'text-box box-teal'
            }
            style={{ top: `${height - elHeight * 3 - eventInfoRefHeight}px` }}>
            <div
              className={
                shows[showIndex].narrowcastingTextColor1
                  ? `text-small text-semiBold text-color-${shows[showIndex].narrowcastingTextColor1}`
                  : 'text-small text-semiBold text-color-Wit'
              }>
              {shows[showIndex]?.genreExtra
                ? `${shows[showIndex]?.genre} | ${shows[showIndex]?.genreExtra}`
                : shows[showIndex]?.genre}
            </div>
          </div>
        )}

        {/* Date + time */}
        <div
          ref={elRef}
          className={
            shows[showIndex].narrowcastingColor1
              ? `text-box box-${shows[showIndex].narrowcastingColor1}`
              : 'text-box box-teal'
          }
          style={{ top: `${height - elHeight * 2 - eventInfoRefHeight}px` }}>
          <div
            className={
              shows[showIndex].narrowcastingTextColor1
                ? `text-small text-semiBold text-color-${shows[showIndex].narrowcastingTextColor1}`
                : 'text-small text-semiBold text-color-Wit'
            }>
            {datum} | {`${shows[showIndex]?.start} - ${shows[showIndex]?.end}`} |{' '}
            {shows[showIndex]?.location?.toUpperCase()}
          </div>
        </div>

        {/* Event Information */}
        <div
          ref={eventInfoRef}
          className={
            shows[showIndex].narrowcastingColor2
              ? `text-box box-${shows[showIndex].narrowcastingColor2}`
              : 'text-box box-purple'
          }
          style={{
            top: `${height - elHeight - eventInfoRefHeight}px`,
            marginRight: layout === 'landscape' ? `${logoWidth + elHeight * 2}px` : `${elHeight}px`,
            zIndex: 10,
          }}>
          <div
            className={
              shows[showIndex].narrowcastingTextColor2
                ? `text-large text-semiBold text-color-${shows[showIndex].narrowcastingTextColor2}`
                : 'text-large text-semiBold text-color-Wit'
            }>
            {shows[showIndex]?.narrowcastingTitel?.toUpperCase()}{' '}
            {layout === 'landscape' && (
              <span
                className={
                  shows[showIndex].narrowcastingTextColor2
                    ? `text-medium text-regular text-color-${shows[showIndex].narrowcastingTextColor2}`
                    : 'text-medium text-regular text-color-Wit'
                }>
                {shows[showIndex]?.narrowcastingUitvoerende}
              </span>
            )}
            {layout === 'portrait' && (
              <div
                className={
                  shows[showIndex].narrowcastingTextColor2
                    ? `text-medium text-regular text-color-${shows[showIndex].narrowcastingTextColor2}`
                    : 'text-medium text-regular text-color-Wit'
                }>
                {shows[showIndex]?.narrowcastingUitvoerende}
              </div>
            )}
          </div>
        </div>

        {/* DNK Logo */}
        <div
          ref={logoRef}
          className={
            shows[showIndex].narrowcastingColor2
              ? `text-box box-${shows[showIndex].narrowcastingColor2}`
              : 'text-box box-purple'
          }
          style={
            layout === 'landscape'
              ? {
                  top: `${height - elHeight * 2.5}px`,
                  right: `${elHeight}px`,
                  paddingBottom: `${elHeight * 2.5}px`,
                  zIndex: 1,
                }
              : {
                  bottom: `${height - genreHeight * 2.5}px`,
                  right: `${elHeight}px`,
                  paddingTop: `${genreHeight * 2.5}px`,
                  zIndex: 1,
                }
          }>
          <div
            className={
              shows[showIndex].narrowcastingTextColor2
                ? `text-largest text-regular text-color-${shows[showIndex].narrowcastingTextColor2}`
                : 'text-largest text-regular text-color-Wit'
            }>
            DNK
          </div>
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
        className={`text-box box-${shows[showIndex].narrowcastingColor1}`}
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
