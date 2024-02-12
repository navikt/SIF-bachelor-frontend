import "./FilterPopoverContent.css";
import { Search, DatePicker, useDatepicker } from "@navikt/ds-react"; 
import { ArrowRightLeftIcon } from '@navikt/aksel-icons';
import { useState } from 'react';

type FilterPopoverContentProps = {
    // Define any props needed for your search bars, date pickers, and checkboxes here.
};

const FilterPopoverContent = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    // Modify the onDateChange function to also close the date pickers
    const handleDateChangeFirstPicker = (selectedDate?: Date) => {
        if(selectedDate){
            setStartDate(selectedDate || new Date()); 
            if (selectedDate > endDate) {
                setEndDate(selectedDate);
            }
        }
    };

    // Define the props for both date pickers using useDatepicker
    /* useDatepicker is a custom hook that returns an object that configures the and interacts with the datepicker. This is called object destructuring
       where we extract only the properties we need  */
    const { datepickerProps: pickFromDateProp, inputProps: inputFromDate } = useDatepicker({
        required: true,
        onDateChange: handleDateChangeFirstPicker,
    });

    const { datepickerProps: pickToDateProp, inputProps: inputToDate } = useDatepicker({
        required: true,
        fromDate: startDate,
        onDateChange: console.log,
    });

    /* ...datepickerProps ensures that we can select a date from the calender whilst datePicker input ensures that our selected date
       shows up in the input field. */
    return (
        <div className="filter-content-container">
            <div className="search-container">
                <Search label="" variant="simple" />
            </div>
            <div className="datepicker-container">
                <DatePicker 
                    {...pickFromDateProp}>
                    <DatePicker.Input className="heihei" {...inputFromDate} label="" />
                </DatePicker>
            </div>
            <div className="icon-container">
                <ArrowRightLeftIcon fontSize="1.5rem" />
            </div>
            <div className="datepicker-container">
                <DatePicker
                    {...pickToDateProp}>
                    <DatePicker.Input {...inputToDate} label=""/>
                </DatePicker>
            </div>
        </div>
    );
};

export default FilterPopoverContent;
