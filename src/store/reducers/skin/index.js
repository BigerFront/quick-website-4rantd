import {
  SET_HEADER_VISIBLE,
  SET_HEADER_INVISIBLE,
  TOGGLE_HEADER_VISIBLITY,
} from '../../core-action-types';

export default function reduceSkin(state = {}, { type, val }) {
  const skinState = {
    header: {
      visible: true,
    },

    ...state,
  };

  switch (type) {
    case SET_HEADER_VISIBLE: {
      return {
        ...skinState,
        header: {
          visible: true,
        },
      };
    }
    case SET_HEADER_INVISIBLE: {
      return {
        ...skinState,
        header: {
          visible: true,
        },
      };
    }
    case TOGGLE_HEADER_VISIBLITY: {
      const curVisiblity = skinState.header.visible;
      return {
        ...skinState,
        header: {
          visible: !curVisiblity,
        },
      };
    }
    default:
      return skinState;
  }
}
