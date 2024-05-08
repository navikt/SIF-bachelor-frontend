import { useState } from "react";
import { tema, brukerIdType, amType, landListe } from "../../assets/utils/FormatUtils";

// Regular expressions for validation
const idRegex = /^\d{3,11}$/; // BrukerId validation: 3 to 11 digits
const fnrRegex = /^[0-9]{11}$/; // 11-digit number (example for FNR)
const nameRegex = /^[A-Za-zæøåÆØÅ\s-]{2,30}$/; // Only letters, spaces, hyphens
const tittelRegex = /^[A-Za-zæøåÆØÅ\s-]{2,30}$/; // Only letters, spaces, hyphens

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

  const validateAvsenderMottaker = (id: string, name: string, land: string, type: string) => {
    if (!fnrRegex.test(id)) {
      setAvsenderMottakerIdError("Avsender / Mottaker ID må være 11 siffer");
    } else {
      setAvsenderMottakerIdError("");
    }

    if (!nameRegex.test(name)) {
      setAvsenderMottakerNameError("Navn må være mellom 2 og 30 tegn langt");
    } else {
      setAvsenderMottakerNameError("");
    }

    if (!amType.includes(type)) {
        setAvsenderMottakerLandError("Type er enten FNR, ORGNR, HPPNR, UTL_ORG, NULL eller UKJENT");
      } else {
        setAvsenderMottakerLandError("");
    }

    if (landListe.includes(land)) {
      setAvsenderMottakerLandError("Tilgjengelige land er Norge, Sverige, Danmark og Finland");
    } else {
      setAvsenderMottakerLandError("");
    }
  };

  const validateTittel = (tittel: string) => {
    if (!tittelRegex.test(tittel)) {
      setTittelError("Tittel må være mellom 2 og 30 tegn langt");
    } else {
      setTittelError("");
    }
  };

  const validateTema = (inputTema: string) => {
    if (!tema.includes(inputTema)) {
      setTemaError("Tema må være en av de tilgjengelige temaene");
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
    validateBrukerType,
    validateAvsenderMottaker,
    validateTittel,
    validateTema,
  };
};
