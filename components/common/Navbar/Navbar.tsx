import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import s from './Navbar.module.scss';

import { useSelector, useDispatch } from 'react-redux';
import { logout, selectUser } from 'lib/redux/user/userSlice';
import { setModal, setSelectBoard } from 'lib/redux/modal/modalSlice';

import ProfileImage from 'components/profile/ProfileImage';
import UserSearchList from './SearchBox';

import { getBase3UserProfile } from 'lib/redux/profile/profileApis';
import { BaseUser3 } from 'types/profile/types';
import {
  HomeIcon,
  DirectIcon,
  ExploreIcon,
  FavoriteIcon,
  NewPostIcon,
} from 'components/ui/Icon';
import SelectBox from './SelectBox';

const Navbar = () => {
  const { userInfo } = useSelector(selectUser);
  const [userList, setUserList] = useState<BaseUser3[]>([]);
  const dispatch = useDispatch();

  const [onUserList, setOnUserList] = useState<boolean>(false);
  const [onSelectBox, setOnSelectBox] = useState<boolean>(false);
  const el = useRef<HTMLDivElement>(null);
  const selectBoxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<any>();
  const spanRef = useRef<any>();

  const fetchUserList = async () => {
    setUserList((await getBase3UserProfile()) as BaseUser3[]);
  };

  useEffect(() => {
    const handleCloseSearch = (e: any) => {
      if (!inputRef.current?.contains(e.target)) {
        if (onUserList && (!el.current || !el.current.contains(e.target))) {
          setOnUserList(false);
        }
      }
    };
    window.addEventListener('click', handleCloseSearch);
    return () => {
      window.removeEventListener('click', handleCloseSearch);
    };
  }, [onUserList]);

  useEffect(() => {
    const handleCloseSelectBox = (e: any) => {
      if (!inputRef.current?.contains(e.target)) {
        if (
          onSelectBox &&
          (!selectBoxRef.current || !selectBoxRef.current.contains(e.target))
        ) {
          setOnSelectBox(false);
        }
      }
    };
    window.addEventListener('click', handleCloseSelectBox);
    return () => {
      window.removeEventListener('click', handleCloseSelectBox);
    };
  }, [onSelectBox]);

  useEffect(() => {
    fetchUserList();
  }, []);

  return (
    <>
      <div className={s.paper}>
        <div className={s.navigator}>
          <Link href="/">
            <a className={s.mainlogo}>
              <Image
                src={'/instagram.png'}
                width={'103px'}
                height={'29px'}
                alt={'mainlogo'}></Image>
            </a>
          </Link>
          <div>
            <input
              ref={inputRef}
              onClick={() => {
                setOnUserList(true);
              }}
              className={s.input}
              type="text"
              placeholder="검색"
            />
            {onUserList && (
              <div ref={el}>
                <UserSearchList
                  userList={userList}
                  closeModal={() => setOnUserList(false)}
                />
              </div>
            )}
          </div>
          <div className={s.right}>
            <div className={s.rightBanner}>
              <Link href="/">
                <a>
                  <HomeIcon />
                </a>
              </Link>
              {/* <Link href="/direct">
                <a>
                  <DirectIcon />
                </a>
              </Link> */}

              <Link href="/explore">
                <a>
                  <ExploreIcon />
                </a>
              </Link>

              {/* <div onClick={() => dispatch(logout())}>
                <FavoriteIcon />
              </div> */}

              <div onClick={() => dispatch(setModal('newPost', true))}>
                <div>
                  <NewPostIcon />
                </div>
              </div>

              {/* TODO:누르면 메뉴바 나오도록 */}
              <div>
                <span
                  ref={spanRef}
                  onClick={() => {
                    setOnSelectBox(true);
                  }}
                  style={{ display: 'flex', transform: 'translateY(-2px)' }}>
                  <ProfileImage
                    size={'nav'}
                    border={true}
                    borderColor={'black'}
                    imageUrl={userInfo.profileImageUrl}
                  />
                </span>
                {onSelectBox && (
                  <div ref={selectBoxRef}>
                    <SelectBox />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
