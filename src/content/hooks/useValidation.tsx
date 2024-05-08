import { useState } from "react";
import { tema, brukerIdType, amType } from "../../assets/utils/FormatUtils";

// Regular expressions for validation
const idRegex = /^\d{3,11}$/; // BrukerId validation: 3 to 11 digits
const fnrRegex = /^[0-9]{11}$/; // 11-digit number (example for FNR)
const nameRegex = /^[A-Za-zæøåÆØÅ\s-]{2,30}$/; // Only letters, spaces, hyphens
const AMRegex = /^[0-9]{11}$/;

export const useValidation = () => {
  const [brukerIdError, setBrukerIdError] = useState<string>("");
  const [brukerIdTypeError, setBrukerIdTypeError] = useState<string>("");
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
  const validateBrukerType = (type: string) => {
    if (!brukerIdType.includes(type)) {
      setBrukerIdTypeError("Brukertype er enten FNR, ORGNR eller AKTOERID");
    } else {
      setBrukerIdTypeError("");
    }
  }

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

  const validateTema = (inputTema: string) => {
    if (!tema.includes(inputTema)) {
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
