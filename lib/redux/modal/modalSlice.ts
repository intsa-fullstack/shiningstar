import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { Board, UserData } from 'types/profile/types';
import { getProfileData } from '../profile/profileApis';
import { RootState } from '../store';

interface ShowModal {
  followers: boolean;
  followings: boolean;
  setting: boolean;
  reply: boolean;
}

interface ModalSliceProps {
  showBoardModal: boolean;
  selectedBoard: Board | undefined;
  selectedBoardUser: UserData | undefined;

  showModal: ShowModal;
}
export const initialShowModal = {
  followers: false,
  followings: false,
  setting: false,
  reply: false,
};

const initialState: ModalSliceProps = {
  showBoardModal: false,
  selectedBoard: undefined,
  selectedBoardUser: undefined,

  showModal: initialShowModal,
};
type ModalState = {
  key: string;
  value: boolean;
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    SET_SHOW_BOARD_MODAL: (state, action: PayloadAction<boolean>) => {
      state.showBoardModal = action.payload;
    },
    SET_SELECETED_BOARD: (state, action: PayloadAction<Board>) => {
      state.selectedBoard = action.payload;
    },
    SET_SELECETED_BOARD_USER: (state, action: PayloadAction<UserData>) => {
      state.selectedBoardUser = action.payload;
    },
    SET_SHOW_MODAL: (state, action: PayloadAction<ModalState>) => {
      if (action.payload.key === 'followers') {
        state.showModal.followers = action.payload.value;
      } else if (action.payload.key === 'followings') {
        state.showModal.followings = action.payload.value;
      } else if (action.payload.key === 'setting') {
        state.showModal.setting = action.payload.value;
      } else if (action.payload.key === 'reply') {
        state.showModal.reply = action.payload.value;
      }
    },
    SET_SHOW_MODAL_INITIAL: (state, action: PayloadAction<ShowModal>) => {
      state.showModal = action.payload;
    },
  },
});

export const {
  SET_SHOW_BOARD_MODAL,
  SET_SELECETED_BOARD,
  SET_SELECETED_BOARD_USER,
  SET_SHOW_MODAL,
  SET_SHOW_MODAL_INITIAL,
} = modalSlice.actions;
export const selectModal = (state: RootState) => state.modal;

export default modalSlice.reducer;

export function setBoardModal(state: boolean) {
  return (dispatch: any) => {
    dispatch(SET_SHOW_BOARD_MODAL(state));
  };
}

export function setSelectedModal(board: Board) {
  return async (dispatch: any) => {
    dispatch(SET_SELECETED_BOARD(board));
    dispatch(
      SET_SELECETED_BOARD_USER((await getProfileData(board.name)) as UserData),
    );
  };
}

export function setModal(key: string, state: boolean) {
  return (dispatch: any) => {
    dispatch(SET_SHOW_MODAL({ key: key, value: state }));
  };
}
export function setModalInitial() {
  return (dispatch: any) => {
    dispatch(SET_SHOW_MODAL_INITIAL(initialShowModal));
    dispatch(SET_SHOW_BOARD_MODAL(false));
  };
}
