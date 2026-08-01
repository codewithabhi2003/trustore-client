import { createContext, useState } from 'react';

export const LocationContext = createContext(null);

export function LocationProvider({ children }) {
  const [coords, setCoords] = useState(null); // { lat, lng }
  const [permission, setPermission] = useState('unknown'); // 'granted' | 'denied' | 'unknown'
  const [requesting, setRequesting] = useState(false);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setPermission('denied');
      return Promise.reject(new Error('Geolocation not supported'));
    }
    setRequesting(true);
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const next = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setCoords(next);
          setPermission('granted');
          setRequesting(false);
          resolve(next);
        },
        (err) => {
          setPermission('denied');
          setRequesting(false);
          reject(err);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  };

  const setManualLocation = (lat, lng) => {
    setCoords({ lat, lng });
    setPermission('granted');
  };

  return (
    <LocationContext.Provider
      value={{ coords, permission, requesting, requestLocation, setManualLocation }}
    >
      {children}
    </LocationContext.Provider>
  );
}
