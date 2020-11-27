import electronAPI from "./electronAPI";

export const api = new electronAPI();
export const blocksDir = api.getFileDataPath("blocks");
export const getBlockDir = (id: string): string => api.getFileDataPath(`blocks/${id}.json`);

