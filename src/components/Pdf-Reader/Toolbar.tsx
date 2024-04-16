import { ToolbarInterface } from "../types";
import "./Toolbar.css";

const Toolbar = ({ onRotate, onZoomIn, onZoomOut, currentPage, numPages }: ToolbarInterface) => {
    return (
        <div className="toolbar">
            <button onClick={() => onRotate('clockwise')}>Rotate Clockwise</button>
            <button onClick={() => onRotate('anticlockwise')}>Rotate Anticlockwise</button>
            <button onClick={onZoomIn}>Zoom In</button>
            <button onClick={onZoomOut}>Zoom Out</button>
            {currentPage && numPages && (
                <span>{`Page ${currentPage} of ${numPages}`}</span>
            )}
        </div>
    );
};

export default Toolbar;