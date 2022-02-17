import React from 'react';
import datum from '../util/helper';

// Backup renders when shows[showIndex] hasnt properly reset, fixes crash or undefined values
const BackupPoortjes = ({
  shows,
  layout,
  elHeight,
  elRef,
  height,
  genreRef,
  eventInfoRefHeight,
  logoRef,
  logoWidth,
  eventInfoRef,
  genreHeight,
  fallback,
}) => {
  console.log('BACKUP POORTJES');
  return (
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
          shows[0]?.narrowcastingOriginalName && fallback === false
            ? 'http://10.0.209.25:5000/' +
              encodeURIComponent(`${layout}-${shows[0]?.narrowcastingOriginalName}`)
            : 'http://10.0.209.25:5001/' +
              encodeURIComponent(`${layout}-${shows[0]?.narrowcastingOriginalName}`)
        }></img>
      <div
        className={'image-overlay'}
        style={{ opacity: shows[0]?.narrowcastingOriginalName ? 0 : 1 }}></div>

      {/* Container */}
      <div className='container' style={{ paddingLeft: `${elHeight}px` }}>
        {/* Location */}
        {shows[0]?.genre && (
          <div
            ref={genreRef}
            className={
              shows[0].narrowcastingColor1
                ? `text-box box-${shows[0].narrowcastingColor1}`
                : 'text-box box-teal'
            }
            style={{ top: `${height - elHeight * 3 - eventInfoRefHeight}px` }}>
            <div
              className={
                shows[0].narrowcastingTextColor1
                  ? `text-large text-semiBold text-color-${shows[0].narrowcastingTextColor1}`
                  : 'text-large text-semiBold text-color-Wit'
              }>
              {shows[0]?.location?.toUpperCase()}
            </div>
          </div>
        )}

        {/* Time */}
        <div
          ref={elRef}
          className={
            shows[0].narrowcastingColor1
              ? `text-box box-${shows[0].narrowcastingColor1}`
              : 'text-box box-teal'
          }
          style={{ top: `${height - elHeight * 2 - eventInfoRefHeight}px` }}>
          <div
            className={
              shows[0].narrowcastingTextColor1
                ? `text-large text-semiBold text-color-${shows[0].narrowcastingTextColor1}`
                : 'text-large text-semiBold text-color-Wit'
            }>
            {shows[0]?.pauze
              ? `START: ${shows[0]?.start} | PAUZE: ${shows[0]?.pauze} | EINDE: ${shows[0]?.end}`
              : `START: ${shows[0]?.start} | EINDE: ${shows[0]?.end}`}
          </div>
        </div>

        {/* Event Information */}
        <div
          ref={eventInfoRef}
          className={
            shows[0].narrowcastingColor2
              ? `text-box box-${shows[0].narrowcastingColor2}`
              : 'text-box box-purple'
          }
          style={{
            top: `${height - elHeight - eventInfoRefHeight}px`,
            marginRight: layout === 'landscape' ? `${logoWidth + elHeight * 2}px` : `${elHeight}px`,
            zIndex: 10,
          }}>
          <div
            className={
              shows[0].narrowcastingTextColor2
                ? `text-largest text-semiBold text-color-${shows[0].narrowcastingTextColor2}`
                : 'text-largest text-semiBold text-color-Wit'
            }>
            {shows[0]?.narrowcastingTitel?.toUpperCase()}{' '}
            {layout === 'landscape' && (
              <span
                className={
                  shows[0].narrowcastingTextColor2
                    ? `text-large text-regular text-color-${shows[0].narrowcastingTextColor2}`
                    : 'text-large text-regular text-color-Wit'
                }>
                {shows[0]?.narrowcastingUitvoerende}
              </span>
            )}
            {layout === 'portrait' && (
              <div
                className={
                  shows[0].narrowcastingTextColor2
                    ? `text-large text-regular text-color-${shows[0].narrowcastingTextColor2}`
                    : 'text-large text-regular text-color-Wit'
                }>
                {shows[0]?.narrowcastingUitvoerende}
              </div>
            )}
          </div>
        </div>

        {/* DNK Logo */}
        <div
          ref={logoRef}
          className={
            shows[0].narrowcastingColor2
              ? `text-box box-${shows[0].narrowcastingColor2}`
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
              shows[0].narrowcastingTextColor2
                ? `text-largest text-regular text-color-${shows[0].narrowcastingTextColor2}`
                : 'text-largest text-regular text-color-Wit'
            }>
            DNK
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackupPoortjes;
