import "./FilterPopoverContent.css";
import { Search, DatePicker, useDatepicker, Chips, Checkbox, CheckboxGroup, Button } from "@navikt/ds-react"; 
import { ArrowRightLeftIcon } from '@navikt/aksel-icons';
import { useState } from 'react';

type FilterPopoverContentProps = {
    // Define any props needed for your search bars, date pickers, and checkboxes here.
};

const FilterPopoverContent = () => {

    const tema = ["AAP", "AAR", "AGR", "ARP", "ARS", "BAR", "BID", "BIL", "DAG", "ENF", "ERS",
        "EYB", "EYO", "FAR", "FEI", "FIP", "FOR", "FOS", "FRI", "FUL", "GEN", "GRA", "GRU", "HEL", "HJE",
        "IAR", "IND", "KON", "KLL", "KTA", "KTR", "MED", "MOB", "OMS", "OPA", "OPP", "PEN", "PER", "REH",
        "REK", "RPO", "RVE", "SAA", "SAK", "SAP", "SER", "STO", "SUP", "SYK", "SYM", "TIL", "TRK", "TRY",
        "TSO", "TSR", "UFM", "UFO", "UKJ", "VEN", "YRA", "YRK"];

    // State management for the useDates    
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    // State management for the chips
    const [filter, setFilter] = useState<string[]>([]);

    // State management for the search input
    const [searchValue, setSearchValue] = useState('');

    // Change the state of the input once we type in it
    const handleInputChange = (value : string) => {
        setSearchValue(value);
    };

    // Modify applyTemaFilter to add searched tema to filter if it exists in tema array
    const applyTemaFilter = () => {
        if (tema.includes(searchValue) && !filter.includes(searchValue)) {
            setFilter([...filter, searchValue]);
            setSearchValue(''); // Reset search input after adding
        }
    };

    // Modify the onDateChange function to also close the date pickers
    const handleFirstDatePicker = (selectedDate?: Date) => {
        console.log("Date picked: " + selectedDate);
        if(selectedDate){
            setStartDate(selectedDate || new Date()); 
            console.log("We have set the start date useState hook!")
            if (selectedDate > endDate) {
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

    const handleChange = (val: any[]) => console.log(val);

    /* ...datepickerProps ensures that we can select a date from the calender whilst datePicker input ensures that our selected date
       shows up in the input field. */
    return (
        <form>
            <div className="filter-content-container">
                <div className="search-container">
                    <Search 
                        label="heihei"
                        hideLabel 
                        variant="secondary" 
                        placeholder="Søk etter tema"
                        value={searchValue}
                        onChange={handleInputChange}
                        onSearchClick={applyTemaFilter} />
                </div>
                <div className="datepicker-container">
                    <DatePicker 
                        {...pickFromDateProp}>
                        <DatePicker.Input className="heihei" {...inputFromDate} label="" hideLabel value={formatDate(startDate)} />
                    </DatePicker>
                </div>
                <div className="icon-container">
                    <ArrowRightLeftIcon fontSize="1.5rem" />
                </div>
                <div className="datepicker-container">
                    <DatePicker
                        {...pickToDateProp}>
                        <DatePicker.Input {...inputToDate} label="" hideLabel value={formatDate(endDate)}/>
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
                                setFilter((x) =>
                                    x.length === 1 ? tema : x.filter((y) => y !== c),
                                )
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
                    onChange={(val: any[]) => handleChange(val)}
                    className="checkboxParent"    
                >
                    <div className="left-column">
                        <Checkbox value="Ferdigstilt">Ferdigstilt</Checkbox>
                        <Checkbox value="Journalført">Journalført</Checkbox>
                    </div>
                    <div className="right-column">
                        <Checkbox value="Ekspedert">Ekspedert</Checkbox> 
                    </div>
                </CheckboxGroup>
                <CheckboxGroup
                    legend="Status"
                    onChange={(val: any[]) => handleChange(val)}
                    className="checkboxParent"    
                >
                    <div className="left-column">
                        <Checkbox value="Ferdigstilt">Ferdigstilt</Checkbox>
                        <Checkbox value="Journalført">Journalført</Checkbox>
                    </div>
                    <div className="right-column">
                        <Checkbox value="Ekspedert">Ekspedert</Checkbox> 
                    </div>
                </CheckboxGroup>
                <div className="saveButton">
                    <Button>Lagre</Button>
                </div>
            </div>
        </form>
    );
};

export default FilterPopoverContent;
