import React from 'react';
import datum from '../util/helper';

// Backup renders when shows[showIndex] hasnt properly reset, fixes crash or undefined values
const BackupPoortjes = ({ shows, layout, elHeight, elRef, height }) => {
  console.log('BACKUP');
  return (
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
          shows[0]?.narrowcastingOriginalName &&
          'http://10.0.209.29:5000/' +
            encodeURIComponent(`${layout}-${shows[0]?.narrowcastingOriginalName}`)
        }></img>
      <div
        className={'image-overlay'}
        style={{ opacity: shows[0]?.narrowcastingOriginalName ? 0.6 : 1 }}></div>

      {/* Genre */}
      {shows[0]?.genre && (
        <div
          className='text-box box-teal'
          style={{ top: `${height - elHeight * 4}px`, left: `${elHeight}px` }}>
          <div className={'text-medium text-white'}>
            {shows[0]?.genreExtra
              ? `${shows[0]?.genre} | ${shows[0]?.genreExtra}`
              : shows[0]?.genre}
          </div>
        </div>
      )}

      {/* Date + time */}
      <div
        className='text-box box-teal'
        style={{ top: `${height - elHeight * 3}px`, left: `${elHeight}px` }}>
        <div className={'text-medium text-white'}>
          {datum} | {`${shows[0]?.start} - ${shows[0]?.end}`} | {shows[0]?.location?.toUpperCase()}
        </div>
      </div>

      {/* Event Information */}
      <div
        ref={elRef}
        className='text-box box-purple'
        style={{ top: `${height - elHeight * 2}px`, left: `${elHeight}px` }}>
        <div className={'text-large text-white'}>
          {shows[0]?.narrowcastingTitel?.toUpperCase()}{' '}
          <span className='text-medium text-white'>{shows[0]?.narrowcastingUitvoerende}</span>
        </div>
      </div>
    </div>
  );
};

export default BackupPoortjes;
