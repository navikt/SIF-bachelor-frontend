import { useState } from "react";
import { tema, brukerIdType, amType, landListe } from "../../assets/utils/FormatUtils";

// Regular expressions for validation
const idRegex = /^[0-9]{11}$/; // BrukerId validation: 3 to 11 digits
const fnrRegex = /^[0-9]{11}$/; // 11-digit number (example for FNR)
const nameRegex = /^[A-Za-zæøåÆØÅ\s-]{2,30}$/; // Only letters, spaces, hyphens
const tittelRegex = /^[A-Za-zæøåÆØÅ\s-]{2,30}$/; // Only letters, spaces, hyphens
const brevkodeRegex = /^NAV \d{2}-\d{2}\.\d{2}$/;

const useValidation = () => {

  const [brukerIdError, setBrukerIdError] = useState<string>("");
  const [brukerTypeError, setBrukerTypeError] = useState<string>("");
  const [avsenderMottakerIdError, setAvsenderMottakerIdError] = useState<string>("");
  const [avsenderMottakerTypeError, setAvsenderMottakerTypeError] = useState<string>("");
  const [avsenderMottakerNameError, setAvsenderMottakerNameError] = useState<string>("");
  const [avsenderMottakerLandError, setAvsenderMottakerLandError] = useState<string>("");
  const [tittelError, setTittelError] = useState<string>("");
  const [temaError, setTemaError] = useState<string>("");
  const [brevkodeError, setBrevkodeError] = useState<string>("");

  const validateBrukerId = (id: string) => {
    if (!idRegex.test(id)) {
      setBrukerIdError("BrukerId må være et 11 siffret tall!");
    } else {
      setBrukerIdError("");
    }
  };

  const validateBrukerType = (type: string) => {
    if (!brukerIdType.includes(type)) {
        setBrukerTypeError("Brukertype er enten FNR, ORGNR eller AKTOERID");
      } else {
        setBrukerTypeError("");
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
        setAvsenderMottakerTypeError("Type er enten FNR, ORGNR, HPPNR, UTL_ORG, NULL eller UKJENT");
      } else {
        setAvsenderMottakerTypeError("");
    }

    if (!landListe.includes(land)) {
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

  const validateBrevkode = (brevkode: string) => {
    if (!brevkodeRegex.test(brevkode)) {
      setBrevkodeError("Brevkode må være av formatet 'NAV 00-00.00'");
    } else {
      setBrevkodeError("");
    }
  };

  return {
    brukerIdError,
    brukerTypeError,
    avsenderMottakerIdError,
    avsenderMottakerTypeError,
    avsenderMottakerNameError,
    avsenderMottakerLandError,
    tittelError,
    temaError,
    brevkodeError,
    validateBrukerId,
    validateBrukerType,
    validateAvsenderMottaker,
    validateTittel,
    validateTema,
    validateBrevkode
  };
};

export default useValidation