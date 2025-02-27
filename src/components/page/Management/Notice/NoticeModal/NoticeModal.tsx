import { FC, useEffect, useState } from "react"; // FC를 import 해야 합니다
import { StyledButton } from "../../../../common/StyledButton/StyledButton";
import { StyledInput } from "../../../../common/StyledInput/StyledInput";
import { NoticeModalStyled } from "./styled";
import { useRecoilState } from "recoil";
import { modalSate } from "../../../../../stores/modalState";
import axios, { AxiosResponse } from "axios";

import { INotice } from "../NoticeMain/NoticeMain";

interface INoticeModalProps {
    noticeId: number;
    setNoticeId: React.Dispatch<React.SetStateAction<number>>;
}

interface INoticeDetail extends INotice {
    fileName: string | null;
    fileExt: string | null;
    fileSize: number;
    physicalPath: string | null;
    logicalPath: string | null;
}
interface INoticeDetailResponse {
    detailValue: INoticeDetail;
}
// NoticeModal 컴포넌트에서 props의 타입을 FC로 지정하고, props 안에 있는 setFlag의 타입을 정의
export const NoticeModal: FC<INoticeModalProps> = ({ noticeId, setNoticeId }) => {
    const [modal, setModal] = useRecoilState<boolean>(modalSate);

    const [detail, setDetail] = useState<INoticeDetail>();

    // 조심해야한다.
    // 현재 상위 컴포넌트에서, 모달을 여닫는거기 때문에
    // 상위에서 읽기 보모달을 클릭하면 state는 모달이 꺼져도 살아있고
    // 등록시 모달에서도 state가 살아있기에 setNoticeId 자체를 받아 뒷정리함수 return 부에서 0으로 재 초기화 하는 것이다.
    useEffect(() => {
        console.log(`모달이 전달받은 id ${noticeId}`);
        noticeId && searchDetail();
        //이전에 남아있던 껍데기를 다시 0으로 초기화
        // 프롭스는 리드온리가 기본적으 x=0 이런식으론 바꿀 수 없다.
        return () => {
            setNoticeId(0);
        };
    }, []);
    //리퀘스트파람 어노는 : 쿼리파람이나, form데이터 로 보낼시이다.
    // => 키와 벨류로 포장됨
    // 이렇게 오브젝트로 통으로 보낼시는 바디에 json형식으로 가기에..
    // 그냥 제이슨 으로 가진다.
    //즉 백단에서 리퀘스트바디 어노테이션을 이용하도록한다.
    const searchDetail = () => {
        axios
            .post("/management/noticeFileDetailJson.do", { noticeId })
            .then((res: AxiosResponse<INoticeDetailResponse>) => {
                setDetail(res.data.detailValue);
            });
    };

    return (
        <NoticeModalStyled>
            <div className='container'>
                <form>
                    <label>
                        제목 :<StyledInput type='text' name='fileTitle' defaultValue={detail?.title}></StyledInput>
                    </label>
                    <label>
                        내용 : <StyledInput type='text' name='fileContent' defaultValue={detail?.content}></StyledInput>
                    </label>
                    파일 :<StyledInput type='file' id='fileInput' style={{ display: "none" }}></StyledInput>
                    <label className='img-label' htmlFor='fileInput'>
                        파일 첨부하기
                    </label>
                    <div></div>
                    <div className={"button-container"}>
                        <StyledButton type='button'>저장</StyledButton>
                        <StyledButton type='button' onClick={() => setModal(!modal)}>
                            나가기
                        </StyledButton>
                    </div>
                </form>
            </div>
        </NoticeModalStyled>
    );
};
