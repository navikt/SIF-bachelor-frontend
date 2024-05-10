// api/splitDocsAPI.ts
import { Metadata, Journalpost } from "../../assets/types/models";

export const splitDocumentsAPI = async (journalpostId: string, token: string, oldMetadata: Metadata, newMetadata: Metadata)=> {
  const requestBody = {
    journalpostID: journalpostId,
    oldMetadata: oldMetadata,
    newMetadata: newMetadata,
  };

  const response = await fetch("/createJournalpost", {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error(`Internal server error: ${response.status}`);
  }

  const data = await response.json();
  const newJournalpostIds = data.map((journalpost: Journalpost) => journalpost.journalpostId);
  return newJournalpostIds;
};
