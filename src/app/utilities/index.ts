import {PointType} from "../../shared/types";
import * as d3 from "d3";

/* Utility function to convert on screen mouse coordinates to canvas coordinates*/
export function ScreenToWorld(point: PointType, translation: PointType, zoom: number): PointType {
    const gX1 = (point.x - translation.x) / zoom;
    const gY1 = (point.y - translation.y) / zoom;
    return {x: gX1, y: gY1}
}

export function dataToLine(position: PointType, dimensions: PointType, steps: number, data: number[]): string {
    const xScale = d3.scaleLinear()
        .domain([0, steps])
        .range([position.x, dimensions.x]);
    const yScale = d3.scaleLinear()
        .domain([Math.max(...data), 0])
        .range([position.y, dimensions.y]);

    const line = d3.line()
        .x(b => xScale(b[0]) ) // set the x values for the line generator
        .y( b => yScale(b[1])) // set the y values for the line generator
        .curve(d3.curveMonotoneX) // apply smoothing to the line
    return line(data.map((data, ind) => [ind, data]));
}
