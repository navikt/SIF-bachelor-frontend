import { Popover } from "@navikt/ds-react";
import "./FilterPopover.css";
import FilterPopoverContent from '../FilterPopoverContent/FilterPopoverContent';
import { FilterPopoverProps } from "../../../../../assets/types/export";

/* When we are passing props from the LandingPage down to this component, we need to have them explicitly defined here
   and they have to match the name exactly and the type. This could be a variable, list, object, element reference or stateAction */
   
const FilterPopover = (props : FilterPopoverProps) => {

  return (
    <Popover
      className="popover-container"
      open={props.openState}
      onClose={() => props.setOpenState(false)}
      anchorEl={props.anchorEl.current}
      placement='bottom-end'
    >
      <Popover.Content>
        <FilterPopoverContent 
          onFilterSubmit={props.onFilterSubmit} 
          onClose={props.onClose}
          showSuccessAlert={props.showSuccessAlert}
          />
      </Popover.Content>
    </Popover>
  );
}

export default FilterPopover;
