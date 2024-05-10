export const sessionAPI = async () => {
    try {
      const response = await fetch("/login");
      if (!response.ok) {
        throw new Error("Kunne ikke hente sesjonstoken. Vennligst prøv igjen senere");
      }
  
      const data = await response.json();
      return data;
    } catch (error: any) {
      throw new Error(error.message || "Kunne ikke logge deg inn. Vennligst prøv igjen senere");
    }
  };
  
  export default sessionAPI;
  