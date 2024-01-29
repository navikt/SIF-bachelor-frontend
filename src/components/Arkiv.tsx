import { useEffect, useState } from "react";
import Home from "./Button";

// TypeScript interfaces for the arkiv state
interface ArkivItem {
    brukerId: string;
    name: string;
    dato: string;
    status: boolean;
}

export const Arkiv = () => {
    // Define the state with TypeScript type
    const [arkiv, setArkiv] = useState<ArkivItem[]>([]);

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
        .then(data => setArkiv(data.data.arkiv)) // Ensure correct navigation in the response to find the data
    }, []);

    return (
        <section>
            { arkiv.map((item: ArkivItem) => (
                <div className="card" key={item.brukerId}>
                    <p className="id">{item.brukerId}</p>
                    <p className="name">Navn: {item.name}</p>
                    <p className="info">
                        <span>Dato: {item.dato}</span>
                        <span className={item.status ? "ja" : "nei"}>{item.status ? "Ferdig" : "Venter"}</span>
                    </p>
                </div>            
            )) }
            <Home></Home>
        </section>
    )
}
