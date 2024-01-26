import { useEffect, useState } from "react"


//Dokumentasjon: https://www.npmjs.com/package/json-server"
//npm install json-server
//json-server --watch data/db.json --port 8000

export const Arkiv = () => {

    const [arkiv, setArkiv] = useState([]);
    console.log(arkiv)

    useEffect(() => {
        const query = `
            query {
                arkiv {
                    brukerId
                    name
                    dato
                    status
                }
            }
        `;

        fetch("http://localhost:8080/graphql", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        })
        .then(response => response.json())
        .then(data => setArkiv(data.data.arkiv)) // Pass på at du navigerer riktig i responsen for å finne dataene
    }, []);


  return (
    <section>
    { arkiv.map((arkiv) => (
        <div className="card" key={arkiv.brukerId}>
            <p className="id">{arkiv.brukerId}</p>
            <p className="name">Navn: {arkiv.name}</p>
            <p className="info">
                <span>Dato: {arkiv.dato}</span>
                <span className={arkiv.status ? "ja" : "nei"}>{arkiv.status ? "Ferdig" : "Venter"}</span>
            </p>
        </div>            
    )) }
</section>
  )
}
