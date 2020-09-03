import { StateType } from "./stateTypes";

export * from "./sidebarTypes";
export * from "./otherTypes";

export type ActionType = {
    type: string,
    payload: any
}

export default StateType;
