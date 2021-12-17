import React, { useEffect, useState } from 'react';

export const Poortjes = ({ data }) => {
  const [shows, setShows] = useState([data]);
  let [showIndex, setShowIndex] = useState(0);

  // useEffect to determine which event to show
  useEffect(() => {
    // filter out shows with ncTonen === null
    setShows(data.filter(show => show.narrowcastingTonen !== null && show));

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
      <div>{shows[showIndex].location}</div>
      <div>{shows[showIndex].narrowcastingTitel}</div>
      <img src={shows[showIndex].narrowcastingOriginalName}></img>
    </div>
  ) : (
    <div>Poortjes: Geen voorstellingen vandaag</div>
  );
};
