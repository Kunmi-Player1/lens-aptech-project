import React, { useEffect, useState } from "react";

export default function PageContact() {
  const [coords, setCoords] = useState(null);
  const [geoError, setGeoError] = useState("");

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setGeoError("Geolocation not supported on this device.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => setGeoError(err.message),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  const mapSrc = coords
    ? `https://maps.google.com/maps?hl=en&q=${coords.lat},${coords.lng}&t=&z=14&ie=UTF8&iwloc=B&output=embed`
    : "https://maps.google.com/maps?hl=en&q=Lagos%2C%20Nigeria&t=&z=12&ie=UTF8&iwloc=B&output=embed";

  return (
    <section>
      <h1 className="pageTitle">Contact</h1>
      <p className="pageLead">
        Send a message and view a live map. If allowed, we’ll detect your
        current location.
      </p>

      <div
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "1fr 1fr",
          alignItems: "start",
        }}
      >
        <form style={{ display: "grid", gap: "0.75rem" }}>
          <label>
            <span className="pool">Last Name</span>
            <input type="text" name="lastName" required />
          </label>
          <label>
            <span className="pool">Email</span>
            <input type="email" name="email" required />
          </label>
          <label>
            <span className="pool">Phone Number</span>
            <input type="tel" name="phone" required />
          </label>
          <label>
            <span className="pool">Message</span>
            <textarea name="message" rows={5} required />
          </label>
          <button type="submit" className="contactBtn">
            Send
          </button>
        </form>

        <div>
          <div
            style={{
              height: 320,
              borderRadius: 12,
              overflow: "hidden",
              border: "1px solid var(--border-color)",
            }}
          >
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
          <div style={{ marginTop: "0.5rem" }}>
            {coords && (
              <a
                href={`https://maps.google.com/?q=${coords.lat},${coords.lng}`}
                target="_blank"
                rel="noreferrer"
              >
                Open your location in Google Maps
              </a>
            )}
            {!coords && geoError && <div className="geoError">{geoError}</div>}
          </div>
        </div>
      </div>
    </section>
  );
}
