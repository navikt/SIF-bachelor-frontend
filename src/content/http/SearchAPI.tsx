
export const searchAPI = async (brukerId: string, fraDato: Date | undefined, tilDato: Date | undefined, type: string[], status: string[], tema: string[], token: string) => {

    const requestBody = {
        brukerId: {
          id: brukerId,
          type: "FNR"
        },
        fraDato: fraDato,
        tilDato: tilDato,
        journalposttyper: type,
        journalstatuser: status,
        tema: tema,
    };

    const response = await fetch("/hentJournalpostListe", {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
    
      if (!response.ok) {
        const body = await response.json();
        throw { status: response.status, errorMessage: body.errorMessage };
      }
    
      return await response.json();
}

export default searchAPI;