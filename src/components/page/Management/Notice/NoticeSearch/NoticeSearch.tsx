import { Button } from "react-bootstrap";
import { NoticeModal } from "../NoticeModal/NoticeModal";
import { Portal } from "../../../../common/potal/Portal";
import { StyledButton } from "../../../../common/StyledButton/StyledButton";
import { StyledInput } from "../../../../common/StyledInput/StyledInput";
import { NoticeSearchStyled } from "./styled";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { modalSate } from "../../../../../stores/modalState";
import axios from "axios";
export const NoticeSearch = () => {
    //이는 돔에 직접 접근하이게 돔의 타입을 적어야한다.
    const title = useRef<HTMLInputElement>();
    const [startDate, setStartDate] = useState<string>();
    const [endDate, setEndDate] = useState<string>();
    const [modal, setModal] = useRecoilState<boolean>(modalSate);
    const [noticeId, setNoticeId] = useState<number>(0);
    const [cPage, setCPage] = useState<number>(0);
    const navigate = useNavigate();
    useEffect(() => {
        // window.location 의 객체가 가지고 있는 속성 서치와 페스네임 이 있는데
        // 새로고침이 그냥 url노출을 기본값으로 세팅하려고 하는거다.
        window.location.search && navigate(window.location.pathname, { replace: true });
    }, []);

    const handlerSearch = () => {
        //검색데이터를 url에  queryParam쿼리 파람으로 옮겨 주는 역활
        // console.log(`startDate: ${startDate}  startDate: ${endDate}   title:   ${title.current.value}`);
        const query: string[] = [];
        !title.current.value || query.push(`searchTitle=${title.current.value}`);
        !startDate || query.push(`searchStDate=${startDate}`);
        !endDate || query.push(`searchEdDate=${endDate}`);
        //join(변수) : 배열의 모든 요소를  받은 변수 를 사이에 넣어 문자열로써 결합한다.
        const queryString = query.length > 0 ? `?${query.join("&")}` : "";
        navigate(`/react/management/notice${queryString}`);
    };

    return (
        <>
            <NoticeSearchStyled>
                <StyledInput ref={title}></StyledInput>
                <StyledInput type='date' onChange={(e) => setStartDate(e.target.value)}></StyledInput>
                <StyledInput type='date' onChange={(e) => setEndDate(e.target.value)}></StyledInput>
                <StyledButton variant='secondary' onClick={handlerSearch}>
                    검색
                </StyledButton>
                <StyledButton onClick={() => setModal(!modal)}>등록</StyledButton>
            </NoticeSearchStyled>
        </>
    );
};
