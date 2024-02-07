import React, { useState, useEffect } from 'react';

function Greeting() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Gjør en GET-forespørsel til WireMock-serveren
    fetch('http://localhost:8081/greeting')
    
      .then(response => response.text()) // Anta at responsen er ren tekst
      .then(data => {
        setMessage(data); // Oppdaterer tilstanden med dataen mottatt fra serveren
      })
      .catch(error => console.error('Feil ved henting av data:', error));
  }, []); // Tom dependency array betyr at effekten kjører ved mount

  return (
    <div>
      <p>{message}</p> {/* Viser meldingen mottatt fra WireMock-serveren */}
    </div>
  );
}

export default Greeting;
