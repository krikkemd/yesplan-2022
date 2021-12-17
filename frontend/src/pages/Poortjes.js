import React from 'react';

export const Poortjes = ({ data, showIndex }) => {
  return (
    data &&
    data.length >= 0 && (
      <div>
        <div>{data[showIndex].location}</div>
        <div>{data[showIndex].name}</div>
      </div>
    )
  );
};
