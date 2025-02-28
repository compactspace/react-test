import { useContext, useEffect, useState } from "react";
import { CommonCodeMainStyled } from "./styled";
import { CommonCodeContext } from "../../../../../api/Provider/CommonCodeProvier";
import axios, { AxiosResponse } from "axios";
import { StyledButton } from "../../../../common/StyledButton/StyledButton";

interface ICommonCode {
    groupIdx: number;
    groupCode: string;
    groupName: string;
    useYn: string;
    createdDate: string; // 오타 수정
    author: string;
    note: string;
}

interface ICommonCodeResponse {
    commonCode: ICommonCode[];
    commonCodeCnt: number;
}

export const CommonCodeMain = () => {
    const { searchKeyword } = useContext(CommonCodeContext);
    const [commonCodeList, setCommonCodeList] = useState<ICommonCode[]>([]); // 초기값을 빈 배열로 설정

    useEffect(() => {
        searchCommonCode();
    }, [searchKeyword]);

    const searchCommonCode = (currentPage: number = 1) => {
        axios
            .post("/management/commonCodeListBody.do", {
                ...searchKeyword,
                pageSize: 5,
                currentPage,
            })
            .then((res: AxiosResponse<ICommonCodeResponse>) => {
                setCommonCodeList(res.data.commonCode); // 데이터 배열을 업데이트
            });
    };

    return (
        <CommonCodeMainStyled>
            <table>
                <colgroup>
                    <col style={{ width: "5%" }} />
                    <col style={{ width: "20%" }} />
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "8%" }} />
                    <col style={{ width: "5%" }} />
                </colgroup>
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>그룹코드</th>
                        <th>그룹코드명</th>
                        <th>그룹코드설명</th>
                        <th>등록일</th>
                        <th>사용여부</th>
                        <th>비고</th>
                    </tr>
                </thead>
                <tbody>
                    {commonCodeList.length > 0 ? (
                        commonCodeList.map((commonCode) => {
                            return (
                                <tr key={commonCode.groupIdx}>
                                    <td>{commonCode.groupIdx}</td>
                                    <td>{commonCode.groupCode}</td>
                                    <td>{commonCode.groupName}</td>
                                    <td>{commonCode.note}</td>
                                    <td>{commonCode.createdDate}</td> {/* 오타 수정 */}
                                    <td>{commonCode.useYn}</td>
                                    <td>
                                        <StyledButton>수정</StyledButton>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={7}>조회 내역이 없습니다.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </CommonCodeMainStyled>
    );
};
