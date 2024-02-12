import React, { Dispatch, SetStateAction } from 'react';
import { Popover } from "@navikt/ds-react";
import "./FilterPopover.css";
import FilterPopoverContent from '../FilterPopoverContent/FilterPopoverContent';

type FilterPopoverProps = {
  anchorEl: React.RefObject<HTMLElement>;
  openState: boolean;
  setOpenState: Dispatch<SetStateAction<boolean>>;
};

const FilterPopover = ({ anchorEl, openState, setOpenState }: FilterPopoverProps) => {
  return (
    <Popover
      className="popover-container"
      open={openState}
      onClose={() => setOpenState(false)}
      anchorEl={anchorEl.current}
      placement='bottom-end'
    >
      <Popover.Content>
        <FilterPopoverContent /* pass any required props here */ />
      </Popover.Content>
    </Popover>
  );
}

export default FilterPopover;
