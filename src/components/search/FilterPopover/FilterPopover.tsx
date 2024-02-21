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
  onClose: () => void;
  onFilterSubmit: (filterData: {
    startDate?: Date,
    endDate?: Date,
    filter: string[],
    selectedStatus: string[],
    selectedType: string[],
}) => void;
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
        <FilterPopoverContent onFilterSubmit={props.onFilterSubmit} onClose={props.onClose} />
      </Popover.Content>
    </Popover>
  );
}

export default FilterPopover;
