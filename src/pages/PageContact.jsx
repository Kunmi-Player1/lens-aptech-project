import React, { useEffect, useState } from 'react'

export default function PageContact() {
  const [coords, setCoords] = useState(null)
  const [geoError, setGeoError] = useState('')

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setGeoError('Geolocation not supported on this device.')
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => setGeoError(err.message),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
  }, [])

  const mapSrc = coords
    ? `https://maps.google.com/maps?hl=en&q=${coords.lat},${coords.lng}&t=&z=14&ie=UTF8&iwloc=B&output=embed`
    : 'https://maps.google.com/maps?hl=en&q=Lagos%2C%20Nigeria&t=&z=12&ie=UTF8&iwloc=B&output=embed'

  return (
    <section className="contactWrapper">
      <div className="upp"></div>
      <h1 className="pageTitle1">Contact</h1>
      <p className="pageLead">Send a message and view a live map. If allowed, we’ll detect your current location.</p>

      <div className="contactGrid">
       
        <form className="contactForm">
          
          <label>
            <span className='pool'>Full Name</span>
            <input type="text" name="fullname" required />
          </label>
          <label>
            <span className='pool'>Last Name</span>
            <input type="text" name="lastName" required />
          </label>
          <label>
            <span className='pool'>Email</span>
            <input type="email" name="email" required />
          </label>
          <label>
            <span className='pool'>Phone Number</span>
            <input type="tel" name="phone" required />
          </label>
          <label>
            <span className='pool'>Message</span>
            <textarea name="message" rows={5} required />
          </label>
          <button type="submit" className="contactBtn">Send</button>
        </form>

    
        <div className="mapContainer">
          <div className="mapCard">
            <iframe
              title="Map"
              src={mapSrc}
              width="100%"
              height="100%"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <div className="mapFooter">
            {coords && (
              <a href={`https://maps.google.com/?q=${coords.lat},${coords.lng}`} target="_blank" rel="noreferrer">
                Open your location in Google Maps
              </a>
            )}
            {!coords && geoError && <div className="geoError">{geoError}</div>}
          </div>
        </div>
      </div>
    </section>
  )
}
