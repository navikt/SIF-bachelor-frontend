import format from "date-fns/format";
import nbLocale from "date-fns/locale/nb";
import "./FilterPopoverContent.css";
import { Search, DatePicker, useDatepicker } from "@navikt/ds-react"; 
import { ArrowRightLeftIcon } from '@navikt/aksel-icons';

type FilterPopoverContentProps = {
    // Define any props needed for your search bars, date pickers, and checkboxes here.
  };
  
  const lagreFilterResultater = () => {

  }

  const FilterPopoverContent = ({ /* destructure props here */ }: FilterPopoverContentProps) => {
    // State and logic for the mini search bar, date pickers, and checkboxes
  
    const { datepickerProps, inputProps, selectedDay } = useDatepicker({
            fromDate: new Date("Aug 23 2019"),    onDateChange: console.log,  
        });

        return (
            <div className="filter-content-container">
              <div className="search-container">
                <Search label="" variant="simple" />
              </div>
              <div className="datepicker-container">
                <DatePicker {...datepickerProps}>
                  <DatePicker.Input {...inputProps} label="" />
                </DatePicker>
              </div>
              <div className="icon-container">
                <ArrowRightLeftIcon fontSize="1.75rem" />
              </div>
              <div className="datepicker-container">
                <DatePicker {...datepickerProps}>
                  <DatePicker.Input {...inputProps} label="" />
                </DatePicker>
              </div>
              {/* Your checkboxes */}
              {/* Other content */}
            </div>
          );
  }
  
  export default FilterPopoverContent;