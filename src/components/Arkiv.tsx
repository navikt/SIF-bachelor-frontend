import { useEffect, useState } from "react"


//Dokumentasjon: https://www.npmjs.com/package/json-server" 
//npm install json-server
//json-server --watch data/db.json --port 8000

export const Arkiv = () => {

    const [journalposter, setJournalposter] = useState([]);
    console.log(journalposter)

    useEffect(() => {
        const query = `
            query {
                journalpost(journalpostId: "453857319") {
                    journalposttype
                    journalstatus
                    tema
                    tittel
                    dokumenter {
                        dokumentInfoId
                        tittel
                    }
                    avsenderMottaker {
                        navn
                    }
                }
            }
        `;

        fetch("http://localhost:8081/journalpost-post", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
           
        })
        .then(response => response.json())
        .then(data => {
            // Logg hele responsobjektet for inspeksjon
            console.log(data);
        });
    }, []);


    return (
        <section>
            <p>Sjekk konsollen for responsdata fra WireMock.</p>
        </section>
    );
}
