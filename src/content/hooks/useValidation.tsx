import { useState } from "react";

// Regular expressions for validation
const idRegex = /^\d{3,11}$/; // BrukerId validation: 3 to 11 digits
const fnrRegex = /^[0-9]{11}$/; // 11-digit number (example for FNR)
const nameRegex = /^[A-Za-zæøåÆØÅ\s-]{2,}$/; // Only letters, spaces, hyphens

export const useValidation = () => {
  const [brukerIdError, setBrukerIdError] = useState<string>("");
  const [avsenderMottakerIdError, setAvsenderMottakerIdError] = useState<string>("");
  const [avsenderMottakerNameError, setAvsenderMottakerNameError] = useState<string>("");
  const [avsenderMottakerLandError, setAvsenderMottakerLandError] = useState<string>("");
  const [tittelError, setTittelError] = useState<string>("");
  const [temaError, setTemaError] = useState<string>("");

  const validateBrukerId = (id: string) => {
    if (!idRegex.test(id)) {
      setBrukerIdError("BrukerId må være et tresifret tall mellom 3 og 11");
    } else {
      setBrukerIdError("");
    }
  };

  const validateAvsenderMottaker = (id: string, name: string, land: string) => {
    if (!fnrRegex.test(id)) {
      setAvsenderMottakerIdError("Invalid ID");
    } else {
      setAvsenderMottakerIdError("");
    }

    if (!nameRegex.test(name)) {
      setAvsenderMottakerNameError("Invalid Name");
    } else {
      setAvsenderMottakerNameError("");
    }

    if (land === "") {
      setAvsenderMottakerLandError("Land is required");
    } else {
      setAvsenderMottakerLandError("");
    }
  };

  const validateTittel = (tittel: string) => {
    if (tittel.length < 2) {
      setTittelError("Title too short");
    } else {
      setTittelError("");
    }
  };

  const validateTema = (tema: string) => {
    if (tema.length < 2) {
      setTemaError("Invalid Tema");
    } else {
      setTemaError("");
    }
  };

  return {
    brukerIdError,
    avsenderMottakerIdError,
    avsenderMottakerNameError,
    avsenderMottakerLandError,
    tittelError,
    temaError,
    validateBrukerId,
    validateAvsenderMottaker,
    validateTittel,
    validateTema,
  };
};
