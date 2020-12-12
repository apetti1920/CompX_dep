import {ActionType, defaultState} from "../types";
import {UpdatedBlockLibraryActionType} from "../types/actionTypes";
import {BlockStorageType} from "../../../shared/lib/GraphLibrary/types/BlockStorage";

export default function (blockLibrary: BlockStorageType[] = defaultState.blockLibrary, action: ActionType): BlockStorageType[] {
    switch (action.type) {
        case (UpdatedBlockLibraryActionType): {
            return action.payload;
        } default: {
            return blockLibrary;
        }
    }
}
