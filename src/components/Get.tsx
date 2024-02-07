import React, { useState, useEffect } from 'react';

function Get() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Gjør en GET-forespørsel til WireMock-serveren
    fetch('http://localhost:8080/getjp', { // Flyttet parentes for å inkludere konfigurasjonsobjektet i fetch-kallet
      method: 'GET',
    })
    .then(response => response.text()) // Anta at responsen er ren tekst
    .then(data => {
      setMessage(data); // Oppdaterer tilstanden med dataen mottatt fra serveren
    })
    .catch(error => console.error('Feil ved henting av data:', error));
  }, []); // Tom dependency array betyr at effekten kjører ved mount

  if (!message) return <p>Laster inn GET kall..</p>;

  return (
    <div>
      <p>{message}</p> {/* Viser meldingen mottatt fra WireMock-serveren */}
    </div>
  );
}

export default Get;
