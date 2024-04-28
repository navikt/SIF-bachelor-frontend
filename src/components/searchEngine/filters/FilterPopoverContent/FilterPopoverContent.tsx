import "./FilterPopoverContent.css";
import { Search, DatePicker, useDatepicker, Chips, Checkbox, CheckboxGroup, Button } from "@navikt/ds-react"; 
import { ArrowRightLeftIcon } from '@navikt/aksel-icons';
import { useState, useEffect } from 'react';
import { FilterPopoverContentProps } from "../../../types";

const FilterPopoverContent = ( props : FilterPopoverContentProps) => {

    const tema = ["AAP", "AAR", "AGR", "ARP", "ARS", "BAR", "BID", "BIL", "DAG", "ENF", "ERS",
        "EYB", "EYO", "FAR", "FEI", "FIP", "FOR", "FOS", "FRI", "FUL", "GEN", "GRA", "GRU", "HEL", "HJE",
        "IAR", "IND", "KON", "KLL", "KTA", "KTR", "MED", "MOB", "OMS", "OPA", "OPP", "PEN", "PER", "REH",
        "REK", "RPO", "RVE", "SAA", "SAK", "SAP", "SER", "STO", "SUP", "SYK", "SYM", "TIL", "TRK", "TRY",
        "TSO", "TSR", "UFM", "UFO", "UKJ", "VEN", "YRA", "YRK"];

    // Local State management for the search input
    const [searchValue, setSearchValue] = useState('');

    // State management for the suggestions in the search input
    const [suggestions, setSuggestions] = useState<string[]>([]);

    // State management for highlighting and selecting suggestion in search input
    const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);

    // State management for the useDates    
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);

    // State management for the chips
    const [filter, setFilter] = useState<string[]>([]);

    // State management for the the Status and Type checkboxes
    const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
    const [selectedType, setSelectedType] = useState<string[]>([]);

    // New state for error message visibility
    const [showError, setShowError] = useState("");
    
    // Change the state of the input once we type in it
    const handleInputChange = (value : string) => {
        setSearchValue(value);
    };

    /*  Update the suggestions every time the search value changes. Had to change the useEffect code because when
    we started typing for example "C" it would briefly flash the list starting with AAP AAR AGR before it figured
    out the list didn't have "C" and would THEN display nothing. This was because suggestions were updated async
    in useEffect and so when I typed "C", the suggestions are updated, but before they are rendered, useEffect runs
    again and updates the suggestions to an empty array  */
    useEffect(() => {
        if (searchValue !== '') {
            const newSuggestions = tema
                .filter(t => t.toUpperCase().startsWith(searchValue.toUpperCase()) && !filter.includes(t))
                .slice(0, 3);
            setSuggestions(newSuggestions);
        } else {
            setSuggestions([]);
        }
    }, [searchValue, filter]);

    // Added this so that if we want to press enter and use arrow keys to trigger the applyTemaFilter, then it should be possible
    const handleKeyDown = (event : React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            setSelectedSuggestionIndex(prev => (prev + 1) % suggestions.length);
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            setSelectedSuggestionIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
        } else if (event.key === 'Enter') {          
            applyTemaFilter(suggestions[selectedSuggestionIndex]);
        }
    };
      

    // Modify applyTemaFilter to add searched tema to filter if it exists in tema array
    const applyTemaFilter = (value: string) => {
        if (tema.includes(value) && !filter.includes(searchValue)) {
            setFilter([...filter, value]);
            setSearchValue(''); // Reset search input after adding
        }
    };

    // Modify the onDateChange function to also close the date pickers
    const handleFirstDatePicker = (selectedDate?: Date) => {
        console.log("Date picked: " + selectedDate);
        if(selectedDate){
            setStartDate(selectedDate || new Date()); 
            console.log("We have set the start date useState hook!")
            if (endDate && selectedDate > endDate) {
                console.log("SelectedDate is greater than the endDate so we update the state");
                setEndDate(selectedDate);
            }
        }
    };

    const handleSecondDatePicker = (selectedDate?: Date) => {
        if(selectedDate){
            setEndDate(selectedDate);
        }
    }

    /* formatDate to get DD.MM.YYYY */
    const formatDate = (date: Date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString();
        return `${day}.${month}.${year}`;
    };
    

    // Define the props for both date pickers using useDatepicker
    /* useDatepicker is a custom hook that returns an object that configures the and interacts with the datepicker. This is called object destructuring
       where we extract only the properties we need. datepickerProps is the variable we get once we have chosen a date in the calender. inputProps
       is the prop responsible for displaying the date in the input box itself. required means that we MUST fill it out and onDateChange is a prop
       in the useDatePicker hook, which will trigger handleFirstDatePicker everytime the date changes. */
    const { datepickerProps: pickFromDateProp, inputProps: inputFromDate } = useDatepicker({
        required: true,
        onDateChange: handleFirstDatePicker,
    });

    const { datepickerProps: pickToDateProp, inputProps: inputToDate } = useDatepicker({
        required: true,
        fromDate: startDate,
        onDateChange: handleSecondDatePicker,
    });

    // For the status checkboxes
    const handleStatus = (val: any[]) => {
        setSelectedStatus(val);
    }

    // For the type checkboxes
    const handleType = (val: any[]) => {
        setSelectedType(val);
    }

    const nullStill = () => {
        setSearchValue('');
        setSuggestions([]);
        setSelectedSuggestionIndex(0);
        setStartDate(undefined);
        setEndDate(undefined);
        setFilter([]);
        setSelectedStatus([]);
        setSelectedType([]);
        setShowError("");
    }

    const handleStatusChange = (value: string) => {
        setSelectedStatus((currentSelectedStatus) =>
          currentSelectedStatus.includes(value)
            ? currentSelectedStatus.filter((status) => status !== value)
            : [...currentSelectedStatus, value]
        );
      };
      

    const submitFilter = () => {
        console.log("Form submitted");
        console.log("StartDate is: " + startDate + " and the endDate is: " + endDate);
        /*console.log("The chosen temaer are: " + filter);
        console.log("The chosen Status checkboxes are: " + selectedStatus);
        console.log("The chosen Type checkboxes are: " + selectedType);*/

        // Check if either startDate or endDate is not selected
        if ((!startDate && endDate) || (!endDate && startDate)) {
            // Prevent form submission and show error message
            console.log("Error: Please select both a start date and an end date.");
            setShowError("Du må ha velge både startDato og endDato!"); // Show error message
            return; // Exit the function to prevent further execution
        }

        const filterData = {
            startDate,
            endDate,
            filter,
            selectedStatus,
            selectedType
        };
        props.onFilterSubmit(filterData);
        props.onClose();
        console.log("Lagret");
        console.log(filterData)
        setShowError(""); // Reset error message
    }

    /* ...datepickerProps ensures that we can select a date from the calender whilst datePicker input ensures that our selected date
       shows up in the input field. */
    return (
        <div>
            <div className="filter-content-container">
                <div className="search-container">
                    <Search 
                        label="Search engine for tema"
                        hideLabel 
                        variant="secondary" 
                        placeholder="Søk etter tema"
                        value={searchValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        onSearchClick={applyTemaFilter} />
                    <div className="suggestions">
                        {searchValue.length > 0 && suggestions.map((suggestion, index) => (
                            <div 
                                key={suggestion} 
                                onClick={() => applyTemaFilter(suggestion)}
                                style={{backgroundColor: index === selectedSuggestionIndex ? '#eee' : '#fff'}} 
                            >
                                {suggestion}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="datepicker-container">
                    <DatePicker 
                        {...pickFromDateProp}>
                        <DatePicker.Input className="heihei" {...inputFromDate} label="" value={startDate ? formatDate(startDate) : ""}  hideLabel  />
                    </DatePicker>
                </div>
                <div className="icon-container">
                    <ArrowRightLeftIcon fontSize="1.5rem" />
                </div>
                <div className="datepicker-container">
                    <DatePicker
                        {...pickToDateProp}>
                        <DatePicker.Input {...inputToDate} label="" value={endDate ? formatDate(endDate) : ""} hideLabel />
                    </DatePicker>
                </div>
            </div>
            <div className="chips-container">
                <Chips>
                    {filter.map((c) => (
                        <Chips.Removable
                            key={c}
                            variant="action"
                            onClick={() => 
                                setFilter(currentFilter => currentFilter.filter((chip) => chip !== c))
                            }
                        >
                            {c}
                        </Chips.Removable>
                    ))}
                </Chips>
            </div>
            <div className="checkboxesAndButton">
                <CheckboxGroup
                    legend="Status"
                    onChange={(val: any[]) => handleStatus(val)}
                    className="checkboxParent"
                    value={selectedStatus}    
                >
                    <div className="top-row">
                        <Checkbox value="FERDIGSTILT" checked={selectedStatus.includes("FERDIGSTILT")}>Ferdigstilt</Checkbox>
                        <Checkbox value="JOURNALFOERT" checked={selectedStatus.includes("JOURNALFOERT")}>Journalført</Checkbox>
                    </div>
                    <div className="bottom-row">
                        <Checkbox value="EKSPEDERT" checked={selectedStatus.includes("EKSPEDERT")}>Ekspedert</Checkbox> 
                    </div>
                </CheckboxGroup>
                <CheckboxGroup
                    legend="Type"
                    onChange={(val: any[]) => handleType(val)}
                    className="checkboxParent"
                    value={selectedType}    
                >
                    <div className="top-row">
                        <Checkbox value="I" checked={selectedType.includes("I")}>Inngående</Checkbox>
                        <Checkbox value="N" checked={selectedType.includes("N")}>Notat</Checkbox>
                    </div>
                    <div className="bottom-row">
                        <Checkbox value="U" checked={selectedType.includes("U")}>Utgående</Checkbox> 
                    </div>
                </CheckboxGroup>
                <div className="Buttons">
                    <Button variant="secondary" onClick={nullStill}>Nullstill</Button>
                    <Button onClick={submitFilter}>Lagre</Button>
                </div>
            </div>
            {showError && (
                    <div style={{ color: 'red', marginTop: '10px' }}>
                        {showError}
                    </div>
                )}
        </div>
    );
};

export default FilterPopoverContent;