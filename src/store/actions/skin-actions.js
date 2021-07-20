import {
  SET_HEADER_VISIBLE,
  SET_HEADER_INVISIBLE,
  TOGGLE_HEADER_VISIBLITY,
} from '../core-action-types';

export const showHeader = () => {
  return {
    type: SET_HEADER_VISIBLE,
  };
};

export const hideHeader = () => {
  return {
    type: SET_HEADER_INVISIBLE,
  };
};

export const toggleHeader = () => {
  return {
    type: TOGGLE_HEADER_VISIBLITY,
  };
};
