export type PointType = {
    x: number,
    y: number
}

export interface IpcRequest {
    responseChannel?: string;
    params?: any;
}

export type ScopeDataType = {
    Step: number,
    Value: number,
}
