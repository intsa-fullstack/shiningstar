import React from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';

import { useDispatch, useSelector } from 'react-redux';
import { getProfileData, getUserBoard } from 'lib/redux/profile/profileApis';
import {
  initialBanner,
  setBoardData,
  setIsFollow,
  setUserData,
} from 'lib/redux/profile/profileSlice';
import {
  selectModal,
  setBoardModal,
  setModal,
  setModalInitial,
} from 'lib/redux/modal/modalSlice';
import { accountMenuBar } from 'lib/redux/accounts/accountsApis';

import { Modal, BoardModal } from 'components/modal';
import { BoardBanner, BoardContainer, UserInfo } from 'components/profile';
import { Container } from 'components/ui/Container';

import { Profile, UserBoards } from 'types/profile/types';
import { ModalDataType } from 'types/modal/types';
import { followChecker } from 'lib/apis/user';
import { selectUser } from 'lib/redux/user/userSlice';
import { fetchDeleteComment } from 'lib/apis/board';
import { useRouter } from 'next/router';

const UserProfile = ({
  bannerList,
  userData,
  profile,
  boardData,
}: {
  bannerList: string[];
  userData: Profile;
  profile: string;
  boardData: UserBoards;
}) => {
  const { selectedBoard, showBoardModal, showModal, selectedReplyId } =
    useSelector(selectModal);
  const { userInfo } = useSelector(selectUser);
  const dispatch = useDispatch();
  const router = useRouter();

  // FIXME:이 부분 좀 어떻게하면 자연스럽게할지 고민해보자
  const modalOnChecker = () => {
    var check: boolean;
    check = Object.values(showModal).includes(true);
    return check || showBoardModal;
  };
  const fetchIsFollow = React.useCallback(async () => {
    const checker = await followChecker(
      userData.username,
      userInfo.accessToken,
    );

    dispatch(setIsFollow(checker.check));
  }, [dispatch, userData.username, userInfo.accessToken]);
  React.useEffect(() => {
    dispatch(initialBanner());
    dispatch(setBoardModal(false));
    dispatch(setUserData(userData));
    dispatch(setModalInitial());
    dispatch(setBoardData(boardData));
    fetchIsFollow();
  }, [boardData, dispatch, fetchIsFollow, profile, userData]);

  const followerModal: ModalDataType[] = [{ name: '팔로워', link: undefined }];
  const follwingModal: ModalDataType[] = [{ name: '팔로우', link: undefined }];
  const settingModal: ModalDataType[] = accountMenuBar;
  const replyModal: ModalDataType[] = [
    {
      name: '삭제',
      link: undefined,
      color: 'red',
      onClick: () => {
        var board = selectedBoard;
        // TODO: restapi 연결시 api로 삭제할 인덱스 보내는 함수 작성
        if (board !== undefined) {
          // FIXME: 댓글연결 다시
          if (selectedReplyId) {
            fetchDeleteComment(selectedReplyId, userInfo.accessToken);
          }
          // dispatch(
          //   setSelectBoard({
          //     ...board,
          //     reply: board.reply.filter((arr, idx) => {
          //       console.log(selectedReplyId, idx);
          //       if (idx !== selectedReplyId) {
          //         return arr;
          //       }
          //     }),
          //   }),
          // );
        }
        dispatch(setModalInitial());
      },
    },
    {
      name: '취소',
      link: undefined,
      onClick: () => dispatch(setModal('reply', false)),
    },
  ];

  const favoriteModal: ModalDataType[] = [{ name: '좋아요', link: undefined }];

  return (
    <>
      <Head>
        <title>
          {userData.name}(@{userData.username}) instagram 사진 및 동영상
        </title>
        <meta
          name={`${userData.username}`}
          content={`${userData.username}`}></meta>
      </Head>
      <Container modalOn={modalOnChecker()}>
        <UserInfo />
        <BoardBanner bannerList={bannerList} />
        <BoardContainer />
      </Container>
      {showBoardModal && <BoardModal />}
      {showModal.setting && <Modal modalData={settingModal} />}
      {showModal.followers && <Modal modalData={followerModal} />}
      {showModal.followings && <Modal modalData={follwingModal} />}
      {showModal.reply && <Modal modalData={replyModal} />}
      {showModal.favorite && <Modal modalData={favoriteModal} />}
    </>
  );
};

export default UserProfile;

export const getServerSideProps: GetServerSideProps = async ({
  query: { profile },
}) => {
  const bannerList: object = {
    main: '게시물',
    channel: '동영상',
    saved: '저장됨',
    tagged: '태그됨',
  };

  return {
    props: {
      userData: (await getProfileData(profile)) as Profile,
      bannerList,
      profile,
      boardData: (await getUserBoard(profile)) as UserBoards,
    },
  };
};
