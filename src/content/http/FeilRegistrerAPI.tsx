
export const feilRegistrerAPI = async (journalpostId: string, journalposttype: string, token: string) => {
    try {
        const response = await fetch(`/feilregistrer?journalpostId=${journalpostId}&type=${journalposttype}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

        if (!response.ok) {
        throw new Error("Kunne ikke feilregistrere. Prøv igjen senere.");
        }

        const data = await response.json();
        return data === true;
    }
    catch (error: any) {
        throw new Error(error.message || "Unknown Error");
    }
}

export default feilRegistrerAPI;