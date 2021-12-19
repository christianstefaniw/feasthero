import { GET_ALL_CLASSES, GET_CLASS, SET_CURRENT_CLASS } from "./types";

export default function chefReducer(state = [], action) {
    switch (action.type) {
        case GET_ALL_CLASSES:
            return {
                ...state,
                allClasses: action.value,
            }
        case SET_CURRENT_CLASS:
            return {
                ...state,
                currentClass: action.value
            }
        case GET_CLASS:
            return {
                ...state,
                currentClass: action.value
            }
        default:
            return state;
    }
}