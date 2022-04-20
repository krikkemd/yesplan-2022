import React, { useEffect, useRef, useState } from 'react';
import '../css/garderobe.css';
import '../index.css';
import BackupGarderobe from './BackupGarderobe';

export const Garderobe = ({ data, fallback }) => {
  const [shows, setShows] = useState([data]);
  let [showIndex, setShowIndex] = useState(0);

  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  const [layout, setLayout] = useState(width > height ? 'landscape' : 'portrait');
  const [elHeight, setElHeight] = useState();
  const [genreHeight, setGenreHeight] = useState();
  const [eventInfoRefHeight, setEventInfoRefHeight] = useState();
  const [logoWidth, setLogoWidth] = useState();

  const genreRef = useRef();
  const elRef = useRef();
  const eventInfoRef = useRef();
  const logoRef = useRef();

  const getElHeight = () => {
    setElHeight(elRef?.current?.clientHeight + 15);
    setGenreHeight(genreRef?.current?.clientHeight + 15);
    setEventInfoRefHeight(eventInfoRef?.current?.clientHeight);
    setLogoWidth(logoRef?.current?.clientWidth);
  };

  // Get the height of the ref element to determine positioning of the text boxes
  useEffect(() => {
    getElHeight();
  }, [elRef?.current?.clientHeight, showIndex]);

  useEffect(() => {
    setInterval(() => {
      console.log('reload timer');
      window.location.reload();
    }, 1000 * 60 * 90);
  }, []);

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
    let now = new Date();
    // let now = new Date('2022/03/03 15:42:00');

    // filter out shows with ncTonen === null and sort on show start
    setShows(
      data
        // .filter(show => show.narrowcastingTonen !== null && show)
        .filter(show => {
          // remove shows without nc tonen
          if (
            show.narrowcastingTonen !== null &&
            show.scheduleEnd !== null &&
            now > subtractMinutes(240, new Date(show.scheduleStart)) === true // show starts within 240 minutes (4 hours)
          ) {
            // Show eindigt binnen X min
            if (now > subtractMinutes(5, new Date(show.scheduleEnd))) {
              show.end = 'BINNEN 5 MIN';
            }

            // Only keep shows that have NOT ended, remove shows that have ended for +30 minutes
            // als het NU later is dan de eindtijd vd show, laat deze dan zien met gewijzigde afbeelding:
            if (now > new Date(show.scheduleEnd)) {
              console.log(`deze show is afgelopen: ${show.name} op tijdstip: ${show.scheduleEnd}`);
              console.log(show);

              // show.end = 'AFGELOPEN';
              show.narrowcastingOriginalName = 'garderobenummers.jpg';
              show.title = '';
              show.uitvoerende = '';
              show.location = '';
              show.start = '';
              show.end = '';
              show.pauze = '';
            }
            // als het NU later is dan de eindtijd vd show + 30 min, laat deze dan niet meer zien.
            if (now > addMinutes(30, new Date(show.scheduleEnd))) {
              console.log(`deze show is meer dan 30 minuten afgelopen: ${show.name}`);
            } else {
              // Als het NU nog NIET later is dan de eindtijd van de show, hou dan deze show in de array om te laten zien
              return show;
            }
          }
        })
        // sort on start time
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

  // TIME BASED LOGIC START
  const [hoursLeft, setHoursLeft] = useState();
  const [lastShowHasEnded, setLastShowHasEnded] = useState(false);
  const [time, setTime] = useState(24);

  function subtractMinutes(numOfMinutes, date = new Date()) {
    date.setMinutes(date.getMinutes() - numOfMinutes);

    return date;
  }

  function addMinutes(numOfMinutes, date = new Date()) {
    date.setMinutes(date.getMinutes() + numOfMinutes);

    return date;
  }

  // // 👇️ Subtract 15 minutes from current Date
  // const result = subtractMinutes(15);

  // // 👇️ Subtract 20 minutes from another date
  // const date = new Date('2022-06-24T08:35:10.820');

  // // 👇️ Fri Jun 24 2022 08:15:10
  // console.log(subtractMinutes(20, date));

  useEffect(() => {
    let endtimes = []; // array met eindtijden van alle voorstellingen
    const now = new Date();
    let timer = setTimeout(() => {
      // let now = new Date('2022/02/25 20:45:00');
      // let now = new Date();

      // tijdstip van de show die als eerste begint
      setTime(new Date(shows[0]?.scheduleStart));

      // push alle eindtijden naar endtimes array
      shows?.forEach(show => endtimes.push(new Date(show.scheduleEnd)));

      //  check hoe laat de de "laatste" eind tijd is
      if (endtimes.length > 0) {
        const maxDate = new Date(Math.max(...endtimes)); // Dit is de "laatste" eindtijd van alle voorstellingen van de dag. (als laatst afgelopen)
        const minDate = new Date(Math.min(...endtimes)); // Dit is de "vroegste" eindtijd van de dag
      }

      // console.log(hoursLeft);
      // console.log(new Date(time));
      showDiff(now, new Date(time));
    }, 1000);

    return () => clearTimeout(timer);
  }, [time]);

  function showDiff(now, showStart, lastShowEnd) {
    var now = new Date();

    // now = tijd NU
    // showStart = start tijd van voorstelling
    // lastShowEnd = eind tijd van de "laatste" voorstelling
    // Customise showStart for your required future time

    // var showStart = new Date('2022/02/25 19:02:00');
    // var lastShowEnd = new Date('2022/02/25 11:40:00');

    var diff = (showStart - now) / 1000;
    var diff = Math.abs(Math.floor(diff));

    var days = Math.floor(diff / (24 * 60 * 60));
    var leftSec = diff - days * 24 * 60 * 60;

    var hrs = Math.floor(leftSec / (60 * 60));
    var leftSec = leftSec - hrs * 60 * 60;

    setHoursLeft(hrs); // aantal uren tot dat de eerste voorstelling begint om de NC te triggeren

    var min = Math.floor(leftSec / 60);
    var leftSec = leftSec - min * 60;

    console.log(`Eerste voorstelling begonnen?: ${now > showStart}`);
    console.log(`laatste voorstelling afgelopen?: ${now > lastShowEnd}`);
    setLastShowHasEnded(now > lastShowEnd);

    // Wanneer de voorstelling is begonnen stoppen met deze log
    if (showStart > now) {
      console.log(
        `you have ${days} days + ${hrs} hours + ${min} mins and ${leftSec} seconds before show starts `,
      );
    }
  }

  // TIME BASED LOGIC END

  return shows &&
    shows.length &&
    shows[showIndex] &&
    new Date() > subtractMinutes(240, new Date(shows[showIndex]?.scheduleStart)) ? (
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
          shows[showIndex]?.narrowcastingOriginalName && fallback === false
            ? 'http://10.0.209.25:5000/' +
              encodeURIComponent(`${layout}-${shows[showIndex]?.narrowcastingOriginalName}`)
            : 'http://10.0.209.25:5001/' +
              encodeURIComponent(`${layout}-${shows[showIndex]?.narrowcastingOriginalName}`)
        }></img>
      <div
        className={'image-overlay'}
        style={{ opacity: shows[showIndex]?.narrowcastingOriginalName ? 0 : 1 }}></div>

      {/* Container */}
      {/* if narrowcastingOriginalName is equal to garderobenummer, hide all info fields */}
      {shows[showIndex]?.narrowcastingOriginalName !== 'garderobenummers.jpg' ? (
        <div className='container' style={{ paddingLeft: `${elHeight}px` }}>
          {/* Location */}
          {shows[showIndex]?.location && (
            <div
              ref={genreRef}
              className={
                shows[showIndex].narrowcastingColor1
                  ? `text-box location-box-${layout} box-${shows[showIndex].narrowcastingColor1}`
                  : `text-box location-box-${layout} box-teal`
              }
              style={{ top: `${height - elHeight * 3 - eventInfoRefHeight}px` }}>
              <div
                className={
                  shows[showIndex].narrowcastingTextColor1
                    ? `text-large text-semiBold text-color-${shows[showIndex].narrowcastingTextColor1}`
                    : 'text-large text-semiBold text-color-Wit'
                }>
                {shows[showIndex]?.location?.toUpperCase()}
              </div>
            </div>
          )}

          {/* Time */}
          <div
            ref={elRef}
            className={
              shows[showIndex].narrowcastingColor1
                ? `text-box times-box-${layout} box-${shows[showIndex].narrowcastingColor1}`
                : `text-box times-box-${layout} box-teal`
            }
            style={{ top: `${height - elHeight * 2 - eventInfoRefHeight}px` }}>
            <div
              className={
                shows[showIndex].narrowcastingTextColor1
                  ? `text-large text-semiBold text-color-${shows[showIndex].narrowcastingTextColor1}`
                  : 'text-large text-semiBold text-color-Wit'
              }>
              {shows[showIndex]?.pauze
                ? `START: ${shows[showIndex]?.start} | PAUZE: ${shows[showIndex]?.pauze} | EINDE: ${shows[showIndex]?.end}`
                : `START: ${shows[showIndex]?.start} | EINDE: ${shows[showIndex]?.end}`}
            </div>
          </div>

          {/* Event Information */}
          <div
            ref={eventInfoRef}
            className={
              shows[showIndex].narrowcastingColor2
                ? `text-box eventInfo-box-${layout} box-${shows[showIndex].narrowcastingColor2}`
                : `text-box eventInfo-box-${layout} box-purple`
            }
            style={{
              top: `${height - elHeight - eventInfoRefHeight}px`,
              marginRight:
                layout === 'landscape' ? `${logoWidth + elHeight * 2}px` : `${elHeight}px`,
              zIndex: 10,
            }}>
            <div
              className={
                shows[showIndex].narrowcastingTextColor2
                  ? `text-largest text-semiBold text-color-${shows[showIndex].narrowcastingTextColor2}`
                  : 'text-largest text-semiBold text-color-Wit'
              }>
              {shows[showIndex]?.narrowcastingTitel?.toUpperCase()}{' '}
              {layout === 'landscape' && (
                <span
                  className={
                    shows[showIndex].narrowcastingTextColor2
                      ? `text-large text-regular text-color-${shows[showIndex].narrowcastingTextColor2}`
                      : 'text-large text-regular text-color-Wit'
                  }>
                  {shows[showIndex]?.narrowcastingUitvoerende}
                </span>
              )}
              {layout === 'portrait' && (
                <div
                  className={
                    shows[showIndex].narrowcastingTextColor2
                      ? `text-large text-regular text-color-${shows[showIndex].narrowcastingTextColor2}`
                      : 'text-large text-regular text-color-Wit'
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
                ? `text-box logo-box-${layout} box-${shows[showIndex].narrowcastingColor2}`
                : `text-box logo-box-${layout} box-purple`
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
      ) : (
        ''
      )}
    </div>
  ) : shows[0] && new Date() > subtractMinutes(240, new Date(shows[showIndex]?.scheduleStart)) ? (
    // Shows[showindex] reset
    <BackupGarderobe
      shows={shows}
      layout={layout}
      elHeight={elHeight}
      elRef={elRef}
      height={height}
      genreRef={genreRef}
      eventInfoRefHeight={eventInfoRefHeight}
      logoRef={logoRef}
      logoWidth={logoWidth}
      eventInfoRef={eventInfoRef}
      fallback={fallback}
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
            ? 'http://10.0.209.25:5000/theater-gesloten.jpg'
            : 'http://10.0.209.25:5000/theater-gesloten-1080.jpg'
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
      {/* <div
        ref={elRef}
        className='text-box box-purple'
        style={{ top: `${height - elHeight * 2}px`, left: `${elHeight}px` }}>
        <div className={'text-large text-semiBold text-white'}>Geen voorstellingen vandaag</div>
      </div> */}
    </div>
  );
};
