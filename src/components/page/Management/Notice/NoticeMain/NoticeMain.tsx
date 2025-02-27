import { StyledTable, StyledTd, StyledTh } from "../../../../common/styled/StyledTable";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { NoticeModal } from "../NoticeModal/NoticeModal";
import { Portal } from "../../../../common/potal/Portal";
import { useRecoilState } from "recoil";
import { modalSate } from "../../../../../stores/modalState";
//현재 url정보를 가져오 는 훅
import { useLocation } from "react-router-dom";
import { PageNavigate } from "../../../../common/pageNavigation/PageNavigate";
export interface INotice {
    noticeId: number;
    title: string;
    content: string;
    author: string;
    createdDate: string;
}

export interface INoticeListBodyResponse {
    noticeList: INotice[];
    noticeCnt: number;
}

export const NoticeMain = () => {
    const { search } = useLocation();
    //console.log(search);
    const [noticeList, setNoticeList] = useState<INotice[]>([]);
    const [noticecCount, setNoticecCount] = useState<number>(0);
    const [cPage, setCPage] = useState<number>(0);
    const [flag, setFlag] = useState<boolean>(false);
    const [modal, setModal] = useRecoilState<boolean>(modalSate);

    const [noticeId, setNoticeId] = useState<number>(0);
    useEffect(() => {
        searchNoticeList();
    }, [search]);

    const searchNoticeList = (currentPage?: number) => {
        currentPage = currentPage || 1;
        //URLSearchParams 가 키와 밸류로 알아서 나눠준다.
        const searchParam = new URLSearchParams(search);
        searchParam.append("currentPage", currentPage.toString());
        searchParam.append("pageSize", "5");

        axios.post("/management/noticeListBody.do", searchParam).then((res: AxiosResponse<INoticeListBodyResponse>) => {
            console.log(res);
            setNoticeList(res.data.noticeList);
            setNoticecCount(res.data.noticeCnt);
            setCPage(currentPage);
        });
    };

    const handlerModal = (id: number) => {
        setModal(!modal);
        setNoticeId(id);
    };

    return (
        <>
            총 갯수 {noticecCount}: 현재 페이지 : 0
            <StyledTable>
                <thead>
                    <tr>
                        <StyledTh size={5}>번호</StyledTh>
                        <StyledTh size={50}>제목</StyledTh>
                        <StyledTh size={10}>작성자</StyledTh>
                        <StyledTh size={20}>등록일</StyledTh>
                    </tr>
                </thead>
                <tbody>
                    {/* noticeList?. 는 먼저 언디파이이니 물어보는 약속이다. */}
                    {noticeList?.length > 0 ? (
                        noticeList.map((notice) => (
                            <tr key={notice.noticeId}>
                                <StyledTd>{notice.noticeId}</StyledTd>
                                {/* 온크릭속에 함수 명을 넣거나, 에로우 펑션을 넣거나 차이점을 찾아보자 */}
                                <StyledTd onClick={() => handlerModal(notice.noticeId)}>{notice.title}</StyledTd>
                                <StyledTd>{notice.author}</StyledTd>
                                <StyledTd>{notice.createdDate}</StyledTd>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <StyledTd colSpan={4}>데이터가 없습니다.</StyledTd>
                        </tr>
                    )}
                </tbody>
            </StyledTable>
            <PageNavigate
                totalItemsCount={noticecCount}
                onChange={searchNoticeList}
                itemsCountPerPage={5}
                activePage={cPage}
            />
            {/* 포팔 폴더의 폴더를 써서 모양만  잡아준다. 그냥 만든거로 쓴다  */}
            {modal && (
                <Portal>
                    <NoticeModal noticeId={noticeId} setNoticeId={setNoticeId} />
                </Portal>
            )}
        </>
    );
};
