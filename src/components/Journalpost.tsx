import React, { useState, useEffect } from 'react';

// Define TypeScript interfaces for the expected shape of the journalpost data
interface Dokument {
  dokumentInfoId: string;
  tittel: string;
}

interface AvsenderMottaker {
  navn: string;
}

interface Journalpost {
  journalposttype: string;
  journalstatus: string;
  tema: string;
  tittel: string;
  dokumenter: Dokument[];
  avsenderMottaker: AvsenderMottaker;
}

function Journalpost() {
  // Set the initial state to null, but specify the type it will eventually hold
  const [journalpost, setJournalpost] = useState<Journalpost | null>(null);

  useEffect(() => {
    const body = JSON.stringify({
      journalpostId: "453857319"
    });

    fetch('http://localhost:8080/journalpost', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: body,
    })
    .then(response => response.json())
    .then(data => setJournalpost(data.data.journalpost))
    .catch(error => console.error('Error fetching data:', error));
  }, []);

  if (!journalpost) return <p>Laster...</p>;

  return (
    <div>
      <h2>Journalpost Detaljer</h2>
      <p><strong>Type:</strong> {journalpost.journalposttype}</p>
      <p><strong>Status:</strong> {journalpost.journalstatus}</p>
      <p><strong>Tema:</strong> {journalpost.tema}</p>
      <p><strong>Tittel:</strong> {journalpost.tittel}</p>
      <div>
        <h3>Dokumenter</h3>
        {journalpost.dokumenter.map((doc, index) => (
          <div key={index}>
            <p><strong>Dokument ID:</strong> {doc.dokumentInfoId}</p>
            <p><strong>Tittel:</strong> {doc.tittel}</p>
          </div>
        ))}
      </div>
      <p><strong>Avsender/Mottaker:</strong> {journalpost.avsenderMottaker.navn}</p>
    </div>
  );
}

export default Journalpost;