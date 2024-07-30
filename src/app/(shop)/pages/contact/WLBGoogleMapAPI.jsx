import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import { useState } from 'react';

const libraries = ['places'];
const mapContainerStyle = {
  width: '100%',
  height: '250px',
};

export default function WLBGoogleMapAPI({ address }) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_PLACE_KEY,
    libraries,
  });

  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);

  const handleOnLoad = (mapInstance) => {
    setMap(mapInstance);

    // Check if address prop exists
    if (!address) {
      console.error('Missing address prop!');
      return;
    }

    // Geocode the address to get latitude and longitude
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === 'OK') {
        const location = results[0].geometry.location;
        setMarker({
          position: location,
        });
      } else {
        console.error('Geocoding error:', status);
        // Handle error gracefully, e.g., display message to user
      }
    });
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={15}
      // Use geocoded coordinates or default center if available
      center={marker?.position || { lat: 0, lng: 0 }}
      onLoad={handleOnLoad}
    >
      {marker && <Marker position={marker.position} />}
    </GoogleMap>
  );
}
