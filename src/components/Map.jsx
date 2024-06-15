import React, { useState, useEffect, memo } from 'react'
import GoogleMapReact from 'google-map-react';
import { FaMapMarkerAlt } from 'react-icons/fa';

const Position = ({ icon }) => {
  return (
    <div>
      {icon}
    </div>
  )
}

const Map = ({ address, coords }) => {

  return (
    <div className='h-[400px] w-full relative'>
      <div className='absolute top-2 left-2 z-10 max-w-[260px] bg-white shadow-md p-4 text-sm'>
        {address}
      </div>
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.REACT_APP_MAP_API }}
        defaultCenter={coords}
        center={coords}
        defaultZoom={17}
        yesIWantToUseGoogleMapApiInternals={true}
      >
        <Position 
          lat={coords?.lat}
          lng={coords?.lng}
          icon={<FaMapMarkerAlt color='red' size={24} />}
        />
      </GoogleMapReact>
    </div>
  )
}

export default Map