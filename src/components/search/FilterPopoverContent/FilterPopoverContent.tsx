import "./FilterPopoverContent.css";
import { Search, DatePicker, useDatepicker } from "@navikt/ds-react"; 
import { ArrowRightLeftIcon } from '@navikt/aksel-icons';
import { useState, useEffect } from 'react';

type FilterPopoverContentProps = {
    // Define any props needed for your search bars, date pickers, and checkboxes here.
};

const FilterPopoverContent = () => {

    const tema = ["AAP", "AAR", "AGR", "ARP", "ARS", "BAR", "BID", "BIL", "DAG", "ENF", "ERS",
        "EYB", "EYO", "FAR", "FEI", "FIP", "FOR", "FOS", "FRI", "FUL", "GEN", "GRA", "GRU", "HEL", "HJE",
        "IAR", "IND", "KON", "KLL", "KTA", "KTR", "MED", "MOB", "OMS", "OPA", "OPP", "PEN", "PER", "REH",
        "REK", "RPO", "RVE", "SAA", "SAK", "SAP", "SER", "STO", "SUP", "SYK", "SYM", "TIL", "TRK", "TRY",
        "TSO", "TSR", "UFM", "UFO", "UKJ", "VEN", "YRA", "YRK"];

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

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

    const formatDate = (date: Date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString();
        return `${day}.${month}.${year}`;
    };
    

    // Define the props for both date pickers using useDatepicker
    /* useDatepicker is a custom hook that returns an object that configures the and interacts with the datepicker. This is called object destructuring
       where we extract only the properties we need  */
    const { datepickerProps: pickFromDateProp, inputProps: inputFromDate } = useDatepicker({
        required: true,
        onDateChange: handleFirstDatePicker,
    });

    const { datepickerProps: pickToDateProp, inputProps: inputToDate } = useDatepicker({
        required: true,
        fromDate: startDate,
        onDateChange: handleSecondDatePicker,
    });

    /* ...datepickerProps ensures that we can select a date from the calender whilst datePicker input ensures that our selected date
       shows up in the input field. */
    return (
        <div>
            <div className="filter-content-container">
                <div className="search-container">
                    <Search label="" variant="simple" placeholder="Søk etter tema" />
                </div>
                <div className="datepicker-container">
                    <DatePicker 
                        {...pickFromDateProp}>
                        <DatePicker.Input className="heihei" {...inputFromDate} label="" value={formatDate(startDate)} />
                    </DatePicker>
                </div>
                <div className="icon-container">
                    <ArrowRightLeftIcon fontSize="1.5rem" />
                </div>
                <div className="datepicker-container">
                    <DatePicker
                        {...pickToDateProp}>
                        <DatePicker.Input {...inputToDate} label="" value={formatDate(endDate)}/>
                    </DatePicker>
                </div>
            </div>
            <div>
                Heihei
            </div>
        </div>
    );
};

export default FilterPopoverContent;
