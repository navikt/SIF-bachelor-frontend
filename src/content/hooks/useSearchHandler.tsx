import { Dispatch, SetStateAction, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchAPI } from "../http/SearchAPI";
import { FilterOptions, IDocument, Journalpost, SearchHandlerProps } from '../../assets/types/export';
import useNotification from './useNotification';

const useSearchHandler = ({isAuthenticated, getToken}:{isAuthenticated: boolean, getToken: () => Promise<string | undefined>}) => {

    const [ serverExceptionError ] = useState('');
    const { setNotificationMessage } = useNotification()
    const navigate = useNavigate();
    
    //searchresult props in use
    const [userkey, setUserkey] = useState<string>("")
    const [journalpostList, setJournalpostList] = useState<Journalpost[]>([])
    const [filterOptions, setFilterOptions] = useState<FilterOptions>();
    const [selectedRows, selectRow] = useState<string[]>([]);

    

    const handleSearch = async ({ brukerId, brukerIdError, filterData}: SearchHandlerProps) => {
        if (brukerIdError || !brukerId) {
            setNotificationMessage({message: "Du må skrive inn et gyldig 3 til 11 sifret tall før du kan søke!", variant: "warning"});
            return;
        }


        if (!isAuthenticated) {
            setNotificationMessage({message: "Du må logge inn for å søke!", variant: "warning"});
            return;
        }

        try {
            sessionStorage.setItem("filterData", JSON.stringify(filterData))
            sessionStorage.setItem("userkey", brukerId)
            //const data = await searchAPI(brukerId, filterData.startDate, filterData.endDate, filterData.selectedType, filterData.selectedStatus, filterData.filter, token);
            //data.filterOptions = filterData;
            //data.userkey = brukerId;
            setNotificationMessage(null);

            if (window.location.pathname !== "/SearchResults") {
              navigate("/SearchResults");
            } else {
                window.location.reload();
            }
          } catch (error: any) {
            setNotificationMessage(error.errorMessage);
            navigate("/error", {
              state: {
                errorCode: error.status || "Unknown Error",
                errorMessage: error.errorMessage || "An unexpected error occurred. Please try again later.",
              },
            });
          }
    };
    const fetchData = async({setDocuments, setIsLoading}:{setDocuments: Dispatch<SetStateAction<IDocument[]>>, setIsLoading: Dispatch<SetStateAction<boolean>>}) => {
      
      if (!isAuthenticated) {
          console.log(isAuthenticated)
          setNotificationMessage({message: "Du må logge inn for å søkkjhygue!", variant: "warning"});
          return;
      } 
      
      if(!sessionStorage.getItem("filterData") || !sessionStorage.getItem("userkey")){
          setNotificationMessage({message: "Søkedata er ikke tilgjengelig.", variant: "error"})
          return;
      }
      
      try{
        const userkey = sessionStorage.getItem("userkey")
        const filterData_unparsed = sessionStorage.getItem("filterData")
        if(userkey && filterData_unparsed){
          const filterData = JSON.parse(filterData_unparsed)
          const token = await getToken()
          console.log(token)
          setIsLoading(true)
          const data = await searchAPI(userkey, filterData.startDate, filterData.endDate, filterData.selectedType, filterData.selectedStatus, filterData.filter, token);
          setIsLoading(false)
          setJournalpostList(data.dokumentoversikt.journalposter as Journalpost[])
          setFilterOptions(filterData)
          setUserkey(userkey)
          setDocuments(data.dokumentoversikt.journalposter[0].dokumenter as IDocument[])
          selectRow([data.dokumentoversikt.journalposter[0].journalpostId])
        }else{
          setNotificationMessage({message:"Kunne ikke hente søkedata.", variant:"error"})
          return;
        }
        
        
        
      }catch(error: any){
        setNotificationMessage(error.errorMessage);
        navigate("/error", {
          state: {
            errorCode: error.status || "Unknown Error",
            errorMessage: error.errorMessage || "An unexpected error occurred. Please try again later.",
          },
        });
  
      }



    }

    return {
        handleSearch,
        fetchData,
        userkey,
        setUserkey,
        journalpostList,
        setJournalpostList,
        selectRow,
        selectedRows,
        serverExceptionError,
    };
};

export default useSearchHandler;
