import {ActionType} from "../types";
import {BlockStorageType} from "../../../shared/lib/GraphLibrary/types/BlockStorage";
import {defaultState} from "../types/stateTypes";
import {UpdatedBlockLibraryActionType} from "../actions/actionTypes";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function (blockLibrary: BlockStorageType[] = defaultState.blockLibrary, action: ActionType): BlockStorageType[] {
    switch (action.type) {
        case (UpdatedBlockLibraryActionType): {
            return action.payload;
        } default: {
            return blockLibrary;
        }
    }
}
