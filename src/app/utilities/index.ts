import {PointType} from "../../shared/types";
import * as d3 from "d3";
import store from '../store'

/* Utility function to convert on screen mouse coordinates to canvas coordinates*/
export function ScreenToWorld(point: PointType, translation: PointType, zoom: number): PointType {
    const gX1 = (point.x - translation.x) / zoom;
    const gY1 = (point.y - translation.y) / zoom;
    return {x: gX1, y: gY1}
}

export function SetOpacity(hex: string, alpha: number): string {
    return `${hex}${Math.floor(alpha * 255).toString(16).padStart(2, "0")}`;
}

export function dataToLine(position: PointType, dimensions: PointType, steps: number, data: number[]): string|undefined {
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

    return line(data.map((data, ind) => [ind, data]))??undefined;
}

export function PortToPoint(blockId: string, portId: string): PointType|undefined {
    const block = store.getState().graph.blocks.find(b => b.id === blockId);

    if (block !== undefined) {
        let portIndex = block.blockStorage.inputPorts.findIndex(p => p.id === portId);
        let xPos: number;
        let yPos: number;
        if (portIndex !== -1) {
            xPos = block.position.x + (!block.mirrored ? 0 : block.size.x);
            yPos = block.position.y + (portIndex + 1) * (block.size.y / (block.blockStorage.inputPorts.length + 1));
        } else {
            portIndex = block.blockStorage.outputPorts.findIndex(p => p.id === portId);
            xPos = block.position.x + (!block.mirrored ? block.size.x : 0);
            yPos = block.position.y + (portIndex + 1) * (block.size.y / (block.blockStorage.outputPorts.length + 1));
        }

        return {x: xPos, y: yPos};
    }

    return undefined;
}

export function getPortLineCommand(outputPoint: PointType, inputPoint: PointType,
                                   outputPointMirrored: boolean, inputPointMirrored: boolean): string
{
    let halfXOut: number; let halfXIn: number;
    if (inputPoint.x > outputPoint.x) {
        halfXOut = outputPoint.x + (Math.abs(inputPoint.x - outputPoint.x) / 2.0);
        halfXIn = halfXOut;
    } else {
        halfXOut = outputPoint.x + (Math.abs(inputPoint.x - outputPoint.x) / 2.0);
        halfXIn = inputPoint.x - (Math.abs(inputPoint.x - outputPoint.x) / 2.0);
    }

    if (outputPointMirrored === inputPointMirrored) {
        return `M ${outputPoint.x}, ${outputPoint.y} 
                             C ${halfXOut}, ${outputPoint.y} 
                             ${halfXIn}, ${inputPoint.y} 
                             ${inputPoint.x}, ${inputPoint.y}`;
    } else {
        return `M ${outputPoint.x}, ${outputPoint.y} 
                             Q ${-(halfXIn + halfXOut)/ 2.0}, ${inputPoint.y} 
                             ${inputPoint.x}, ${inputPoint.y}`;
    }

}
