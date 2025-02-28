import { ChangeEvent, FC, useEffect, useState } from "react"; // FC를 import 해야 합니다
import { StyledButton } from "../../../../common/StyledButton/StyledButton";
import { StyledInput } from "../../../../common/StyledInput/StyledInput";
import { NoticeModalStyled } from "./styled";
import { useRecoilState } from "recoil";
import { modalSate } from "../../../../../stores/modalState";
import axios, { AxiosResponse } from "axios";
import { useRef } from "react";
import { INotice } from "../NoticeMain/NoticeMain";

interface INoticeModalProps {
    noticeId: number;
    setNoticeId: React.Dispatch<React.SetStateAction<number>>;
    postSuccess: () => void;
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
interface IPostResponse {
    result: "success" | "fail";
}

// NoticeModal 컴포넌트에서 props의 타입을 FC로 지정하고, props 안에 있는 setFlag의 타입을 정의
export const NoticeModal: FC<INoticeModalProps> = ({ noticeId, setNoticeId, postSuccess }) => {
    const [modal, setModal] = useRecoilState<boolean>(modalSate);

    const [detail, setDetail] = useState<INoticeDetail>();

    const formRef = useRef<HTMLFormElement>();

    const [imageUrl, setImageUrl] = useState<string>("");
    const [fileName, setFileName] = useState<string>(null);
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
                if (res.data.detailValue) {
                    setDetail(res.data.detailValue);
                    //set 은 비동기라 옳바르게 못가져오 언디파인을 가져올수있어 악시오스로 받은 것으로 한다.
                    const { fileExt, logicalPath } = res.data.detailValue;

                    if (fileExt === "jpg" || fileExt === "gif" || fileExt === "png") {
                        setImageUrl(logicalPath);
                    } else {
                        setImageUrl("");
                    }
                }
            });
    };

    const saveNotice = () => {
        console.log(formRef.current);
        //폼태그가 출력이 된다잉 여기서 name 값으로 빼온다.
        axios.post("/management/noticeSave.do", formRef.current).then((res: AxiosResponse<IPostResponse>) => {
            if (res.data.result === "success") {
                alert("저장되었습니다.");
                postSuccess();
            }
        });
    };

    const saveNoticeFile = () => {
        const formData = new FormData(formRef.current);

        console.log(formRef.current);
        //폼태그가 출력이 된다잉 여기서 name 값으로 빼온다.
        axios.post("/management/noticeFileSave.do", formRef.current).then((res: AxiosResponse<IPostResponse>) => {
            if (res.data.result === "success") {
                alert("저장되었습니다.");
                postSuccess();
            }
        });
    };

    const updateNotice = () => {
        const formData = new FormData(formRef.current);
        formData.append("noticeId", noticeId.toString());
        ///noticeSave.do
        axios.post("/management/noticeUpdate.do", formData).then((res: AxiosResponse<IPostResponse>) => {
            if (res.data.result === "success") {
                alert("수정되었습니다.");
                postSuccess();
            }
        });
    };

    const updateNoticeFile = () => {
        const formData = new FormData(formRef.current);
        formData.append("noticeId", noticeId.toString());
        ///noticeSave.do
        axios.post("/management/noticeFileUpdate.do", formData).then((res: AxiosResponse<IPostResponse>) => {
            if (res.data.result === "success") {
                alert("수정되었습니다.");
                postSuccess();
            }
        });
    };

    const deleteNotice = () => {
        axios.post("/management/noticeDeleteJson.do", { noticeId }).then((res: AxiosResponse<IPostResponse>) => {
            if (res.data.result === "success") {
                alert("삭제되었습니다..");
                postSuccess();
            }
        });
    };

    const deleteNoticeFile = () => {
        axios.post("/management/noticeFileDeleteJson.do", { noticeId }).then((res: AxiosResponse<IPostResponse>) => {
            if (res.data.result === "success") {
                alert("삭제되었습니다..");
                postSuccess();
            }
        });
    };

    const handlerFile = (e: ChangeEvent<HTMLInputElement>) => {
        //console.log(e);
        //console.log(e.target.files);
        const fileInfo = e.target.files;
        if (fileInfo?.length > 0) {
            const fileSplit = fileInfo[0].name.split(".");
            const fileExt = fileSplit[1].toLocaleLowerCase();

            if (fileExt === "jpg" || fileExt === "gif" || fileExt === "png") {
                // console.log(URL.createObjectURL(fileInfo[0]));
                setImageUrl(URL.createObjectURL(fileInfo[0]));
            }
            setFileName(fileInfo[0].name);
        }
    };

    const fileDownload = () => {
        const param = new URLSearchParams();
        param.append("noticeId", noticeId.toString());
        axios
            .post("/management/noticeDownload.do", param, { responseType: "blob" })
            .then((res: AxiosResponse<Blob>) => {
                const url = window.URL.createObjectURL(res.data);
                //  console.log(url);
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", detail?.fileName as string);
                document.body.appendChild(link);
                link.click();
                //이는 돔 에서 보이는것을 이주는것 이다.
                // document.body.removeChild(link);
                // //브라우져의 메모리 까지 지우자.
                // window.URL.revokeObjectURL(url);
            });
    };

    return (
        <NoticeModalStyled>
            <div className='container'>
                <form ref={formRef}>
                    <label>
                        제목 :<StyledInput type='text' name='fileTitle' defaultValue={detail?.title}></StyledInput>
                    </label>
                    <label>
                        내용 : <StyledInput type='text' name='fileContent' defaultValue={detail?.content}></StyledInput>
                    </label>
                    파일 :
                    <StyledInput
                        type='file'
                        id='fileInput'
                        style={{ display: "none" }}
                        name='file'
                        onChange={handlerFile}
                    ></StyledInput>
                    <label className='img-label' htmlFor='fileInput'>
                        파일 첨부하기
                    </label>
                    <div onClick={fileDownload}>
                        {imageUrl ? (
                            <div>
                                <label>미리보기</label>
                                <img src={imageUrl} />
                                {fileName || detail.fileName}
                            </div>
                        ) : (
                            <div>{fileName}</div>
                        )}
                    </div>
                    <div className={"button-container"}>
                        <StyledButton type='button' onClick={noticeId ? updateNoticeFile : saveNoticeFile}>
                            {noticeId ? "수정" : "저장"}
                        </StyledButton>
                        {/* !noticeId 는 폴스인데 한번더 ! 하면 투루로 */}
                        {!!noticeId && (
                            <StyledButton type='button' onClick={deleteNoticeFile}>
                                삭제
                            </StyledButton>
                        )}

                        <StyledButton type='button' onClick={() => setModal(!modal)}>
                            나가기
                        </StyledButton>
                    </div>
                </form>
            </div>
        </NoticeModalStyled>
    );
};
