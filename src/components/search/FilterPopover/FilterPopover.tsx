import React, { Dispatch, SetStateAction } from 'react';
import { Popover } from "@navikt/ds-react";
import "./FilterPopover.css";
import FilterPopoverContent from '../FilterPopoverContent/FilterPopoverContent';

/* When we are passing props from the LandingPage down to this component, we need to have them explicitly defined here
   and they have to match the name exactly and the type. This could be a variable, list, object, element reference or stateAction */
type FilterPopoverProps = {
  anchorEl: React.RefObject<HTMLElement>;
  openState: boolean;
  setOpenState: Dispatch<SetStateAction<boolean>>;
  startDate: Date;
  setStartDate: Dispatch<SetStateAction<Date>>;
  endDate: Date;
  setEndDate: Dispatch<SetStateAction<Date>>;
  filter: string[];
  setFilter: Dispatch<SetStateAction<string[]>>;
  selectedStatus: string[];
  setSelectedStatus: Dispatch<SetStateAction<string[]>>;
  selectedType: string[];
  setSelectedType: Dispatch<SetStateAction<string[]>>;
};

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
          startDate={props.startDate}
          setStartDate={props.setStartDate}
          endDate={props.endDate}
          setEndDate={props.setEndDate}
          filter={props.filter}
          setFilter={props.setFilter}
          selectedStatus={props.selectedStatus}
          setSelectedStatus={props.setSelectedStatus}
          selectedType={props.selectedType}
          setSelectedType={props.setSelectedType}/>
      </Popover.Content>
    </Popover>
  );
}

export default FilterPopover;
