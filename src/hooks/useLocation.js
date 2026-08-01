import { useContext } from 'react';
import { LocationContext } from '../context/LocationContext';

export const useUserLocation = () => useContext(LocationContext);
