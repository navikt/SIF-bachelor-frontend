export const registrerMottattDatoAPI = async (journalpostId: string, token: string | undefined) => {

    const currentDate = new Date();
    const requestBody = {
      journalpostId: journalpostId,
      mottattDato: currentDate,
    };
  
    try {
      const response = await fetch(`/oppdaterJournalpost`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        throw new Error("Kunne ikke oppdatere journalposten. Prøv igjen senere.");
      }
  
      const data = await response.json();
      return data === true;
    } 
    catch (error: any) {
      throw new Error(error.message || "Unknown error");
    }
  };
  
  export default registrerMottattDatoAPI;
  