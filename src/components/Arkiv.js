import { useEffect, useState } from "react"


//Dokumentasjon: https://www.npmjs.com/package/json-server"
//npm install json-server
//json-server --watch data/db.json --port 8000

export const Arkiv = () => {

    const [arkiv, setArkiv] = useState([]);
    console.log(arkiv)

    useEffect(() =>{
        fetch("http://localhost:8000/arkiv")
        .then(response => response.json())
        .then(data => setArkiv(data))
    },[]);


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
