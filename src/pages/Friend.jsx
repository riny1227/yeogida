import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import searchIcon from '../assets/icons/search_icon.png';
import addIcon from '../assets/icons/friend_add_icon.png';
import slashIcon from '../assets/icons/slash_icon.png';
import deleteIcon from '../assets/icons/delete_friend_icon.png';
import approveIcon from '../assets/icons/approve_request_icon.png';
import rejectIcon from '../assets/icons/reject_request_icon.png';
import useDebounce from '../assets/hooks/useDebounce';
import SortDropdown from '../components/SortDropdown';

const HeaderStyle = styled.div `
    margin-top: 100px;
    margin-bottom: 50px;
    font-weight: bold;
    font-size: 40px;
    display: flex;
    justify-content: center;
`;

const ArticleStyle = styled.div `
    margin-bottom: 100px;
    // 원래는 274px
`;

const SearchBarStyle = styled.div `
    position: relative;
    width: 360px;
    margin: auto;

    input {
        width: 100%;
        height: 51px;
        padding-left: 40px;
        padding-right: 165px;
        border: 1px solid #707070;
        border-radius: 8px;
        font-size: 16px;
        box-sizing: border-box;

        &::placeholder {
            color: #707070;
        }

        &:focus {
            outline: none;
        }

        &::-webkit-search-cancel-button {
            -webkit-appearance: none;
            appearance: none;
        }
    }
`;

const LeftContent = styled.span `
    position: absolute;
    top: 55%;
    left: 10px;
    transform: translateY(-50%);
    color: #707070;

    img {
        width: 100%;
        height: 100%;
    }
`;

const RightContent = styled.div `
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    color: #707070;
    display: flex;
    align-items: center;

    span {
        margin-right: 5px;
        margin-bottom: 3px;
        font-size: 18px;
    }

    img {
        width: 27px;
        height: 27px;
        cursor: pointer;
    }
`;

const MiniNavStyle = styled.div `
    width: 494px;
    height: 36px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 25px auto 0;
`;

const MiniMenuStyle = styled.div `
    display: flex;
    align-items: center;

    img {
        width: 15px;
        height: 25px;
        margin: 0 3px;
    }
`;

const MiniMenuBtn = styled.button `
    color: ${(props) => (props.selected ? "#F4A193" : "#000")};
    font-weight: ${(props) => (props.selected ? "bold" : "normal")};
    font-size: 20px;
    border: none;
    background: none;
    cursor: pointer;
    padding: 0;
`;

const StyledSlider = styled(Slider)`
    .slick-dots {
        
    }
`;

const SliderContainer = styled.div `
    width: 520px;
    height: 535px;
    margin: auto;
`;

const FriendListSlide = styled.div `
    width: 95% !important;
    display: flex !important;
    height: 110px;
    box-sizing: border-box;
    align-items: center;

    // 아래 요소들은 피그마랑 다름
    box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    border-left: 10px solid #508c4e;
    margin: 10px 0 10px 15px;
`;

const FriendImage = styled.div `
    width: 90px;
    height: 90px;
    border-radius: 180px;
    background-color: #e0e0e0;
    margin: 0 30px 0 20px;
`;

const FriendName = styled.span `
    font-size: 24px;
    margin-bottom: 10px;
`;

const FriendId = styled.span `
    font-size: 20px;
    color: #707070;
`;

const ListIconStyle = styled.img `
    height: 24px;
    // display: ${(props) => (props.selected ? "block" : "none")};
    cursor: pointer;
    filter: invert(99%) sepia(0%) saturate(6%) hue-rotate(146deg) brightness(92%) contrast(92%);

    &:hover {
        filter: invert(95%) sepia(7%) saturate(4256%) hue-rotate(297deg) brightness(85%) contrast(132%);
    }
`;

const RequestIconStyle = styled.img `
    height: 16px;
    // display: ${(props) => (props.selected ? "block" : "none")};
    cursor: pointer;
    filter: invert(99%) sepia(0%) saturate(6%) hue-rotate(146deg) brightness(92%) contrast(92%);

    &:hover {
        filter: invert(95%) sepia(7%) saturate(4256%) hue-rotate(297deg) brightness(85%) contrast(132%);
    }
`;

// ---------------친구 검색바 Component---------------
function FriendSearchBar({ inputValue, handleChange, onEnterPress }) {
    // const [isAddClicked, setIsAddClicked] = useState(0);
    const handleEnterDown = (event) => {
        if (event.key === 'Enter') {
            onEnterPress();
        }
    }

    return (
        <SearchBarStyle>
            <LeftContent>
                <img src={ searchIcon } alt='검색 돋보기 아이콘' />
            </LeftContent>
            <input 
                type='search' 
                placeholder='친구 아이디' 
                value={ inputValue }
                onChange={ handleChange }
                onKeyDown={ handleEnterDown }
            />
            {inputValue && (
                <RightContent>
                    <span>를(을) 친구 추가</span>
                    <img 
                        src={ addIcon } 
                        alt='친구 추가 아이콘' 
                        onClick={ () => console.log('친구추가 버튼 click') }
                    />
                </RightContent>
            )}
        </SearchBarStyle>
    );
}

// ---------------친구 목록 Component---------------
function ListAndRequest({ selected, inputValue, sortOption }) {
    const sliderRef = useRef(null);
    const debouncedInputValue = useDebounce(inputValue, 1000); // 1초의 지연 시간 설정

    // 임시 데이터
    const friendListData = [
        { id: 1, name: 'mijin', friendId: 'kimmj5678', dateAdded: '2024-01-15' },
        { id: 2, name: 'sieun', friendId: 'kose0987', dateAdded: '2024-02-23' },
        { id: 3, name: 'seorin', friendId: 'chesr6543', dateAdded: '2024-03-05' },
        { id: 4, name: 'seyeon', friendId: 'imsy2109', dateAdded: '2024-04-18' },
        { id: 5, name: 'john', friendId: 'john1234', dateAdded: '2024-05-22' },
        { id: 6, name: 'alice', friendId: 'alice5678', dateAdded: '2024-06-11' },
        { id: 7, name: 'bob', friendId: 'bob2468', dateAdded: '2024-07-09' },
        { id: 8, name: 'charlie', friendId: 'charlie8765', dateAdded: '2024-08-14' },
        { id: 9, name: 'david', friendId: 'david0987', dateAdded: '2024-09-28' },
        { id: 10, name: 'eve', friendId: 'eve5432', dateAdded: '2024-10-03' },
    ];

    const friendRequestData = [
        { id: 1, name: 'hyeri', friendId: 'janghr8765', dateRequested: '2024-08-21' },
        { id: 2, name: 'eunsu', friendId: 'koes4321', dateRequested: '2024-09-14' },
    ];

    let dataToShow = []

    if (selected) {
        dataToShow = [...friendListData];
        if (sortOption === 1) {
            // 최신순 정렬
            dataToShow = [...dataToShow].sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
        } else if (sortOption === 2) {
            // 이름순 정렬
            dataToShow = [...dataToShow].sort((a, b) => a.name.localeCompare(b.name));
        }
    } else {
        // 오래된 순 정렬
        dataToShow = [...friendRequestData].sort((a, b) => new Date(a.dateRequested) - new Date(b.dateRequested));
    }
    
    // inputValue로 친구 목록을 필터링
    // const filteredData = dataToShow.filter(friend => 
    //     friend.friendId.includes(inputValue)
    // );

    // Debounce된 입력값으로 친구 목록을 필터링
    const filteredData = dataToShow.filter(friend =>
        friend.friendId.toLowerCase().includes(debouncedInputValue.toLowerCase())
    );

    const settings = {
        arrows: false,
        dots: true,
        infinite: filteredData.length > 4,  // 현재 선택된 데이터의 길이에 따라 설정
        speed: 500,
        slidesToShow: 1,  
        slidesToScroll: 1,
        rows: 4,
        slidesPerRow: 1,
    };

    useEffect(() => {
        if (sliderRef.current) {
            sliderRef.current.slickGoTo(0);
        }
    }, [selected, sortOption]);

    useEffect(() => {
        if (debouncedInputValue === '' && sliderRef.current) {
            sliderRef.current.slickGoTo(0);
        }
    }, [debouncedInputValue]);
    

    return (
        <SliderContainer>
            <StyledSlider ref={sliderRef} {...settings} key={filteredData.length}>
            {filteredData.map((friend) => (
                <FriendListSlide key={friend.id}>
                    <FriendImage />
                    <div 
                        style={{ 
                            display: 'flex',
                            flexDirection: 'column'
                    }}>
                        <FriendName>{friend.name}</FriendName>
                        <FriendId>{friend.friendId}</FriendId>
                    </div>
                    {/* 친구 삭제 아이콘 */}
                    {selected && (
                        <ListIconStyle 
                            src={deleteIcon} 
                            alt='친구 삭제 아이콘' 
                            style={{ margin: '0 20px 0 auto' }}
                            onClick={() => console.log(`${friend.name} 삭제 버튼 click`)}
                        />
                    )}
                    {/* 친구 요청 거절 아이콘 */}
                    {!selected && (
                        <RequestIconStyle 
                            src={rejectIcon} 
                            alt='친구요청 거절 아이콘' 
                            style={{ marginLeft: 'auto' }}
                            onClick={() => console.log(`${friend.name} 요청 거절 버튼 click`)}
                        />
                    )}
                    {/* 친구 요청 승인 아이콘 */}
                    {!selected && (
                        <RequestIconStyle 
                            src={approveIcon} 
                            alt='친구요청 승인 아이콘' 
                            style={{ margin: '0 20px 0 30px' }}
                            onClick={() => console.log(`${friend.name} 요청 승인 버튼 click`)}
                        />
                    )}
                </FriendListSlide>
            ))}
            </StyledSlider>
        </SliderContainer>
    )
}

export default function Friend() {
    const [isMiniMenuClicked, setIsMiniMenuClicked] = useState(0);
    const [inputValue, setInputValue] = useState('');
    const [sortOption, setSortOption] = useState(1);

    const handleClick = (index) => {
        setIsMiniMenuClicked(index);
    }
    const handleChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleSortOptionChange = (option) => {
        setSortOption(option);
    }

    // isMiniMenuClicked 변경 시 inputValue 초기화
    useEffect(() => {
        setInputValue('');
    }, [isMiniMenuClicked]);

    return (
        <div>
            <section>
                {/* 헤더 */}
                <header>
                    <HeaderStyle>친구 목록</HeaderStyle>
                </header>

                {/* 친구 목록 / 친구 요청 */}
                <article>
                    {/* 친구 검색바 */}
                    <FriendSearchBar 
                        inputValue={inputValue}
                        handleChange={handleChange}
                    />
                    
                    <ArticleStyle>
                        {/* 버튼 & 드롭다운 */}
                        <MiniNavStyle>
                            {/* 미니 메뉴 버튼 */}
                            <MiniMenuStyle>
                                <MiniMenuBtn
                                    selected={ isMiniMenuClicked === 0 }
                                    onClick={ () => handleClick(0) }
                                >
                                    친구 목록
                                </MiniMenuBtn>
                                <img src={ slashIcon } alt='슬래시 아이콘' />
                                <MiniMenuBtn
                                    selected={ isMiniMenuClicked === 1 }
                                    onClick={ () => handleClick(1) }
                                >
                                    친구 요청
                                </MiniMenuBtn>
                            </MiniMenuStyle>
                            {/* 드롭다운 - 최신순 / 이름순 */}
                            {isMiniMenuClicked === 0 && (
                                <SortDropdown
                                    firstMenu="최신순"
                                    secondMenu="이름순"
                                    handleMenuClick={handleSortOptionChange}
                                />
                            )}
                        </MiniNavStyle>
                        {/* 목록 */}
                        <ListAndRequest 
                            selected={ isMiniMenuClicked === 0 }
                            inputValue={inputValue}
                            sortOption={sortOption}
                        />
                    </ArticleStyle>
                </article>
            </section>
        </div>
    )
}