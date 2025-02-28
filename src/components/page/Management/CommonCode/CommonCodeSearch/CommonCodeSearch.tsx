import { useContext, useEffect, useState } from "react";
import { StyledButton } from "../../../../common/StyledButton/StyledButton";
import { StyledSelectBox } from "../../../../common/StyledSelectBox/StyledSelectBox";
import { StyledInput } from "../../../../common/StyledInput/StyledInput";
import { CommonCodeSearchStyled } from "./styled";
import { useRef } from "react";
import { CommonCodeContext } from "../../../../../api/Provider/CommonCodeProvier";
export const CommonCodeSearch = () => {
    const options = [
        { label: "그룹코드명", value: "groupName" },

        { label: "그룹코드", value: "groupCode" },
    ];

    const [selectValue, setSelectValue] = useState<string>("groupName");
    const inputValue = useRef<HTMLInputElement>();

    const { setSearchKeyword } = useContext(CommonCodeContext);

    const hendlerSearch = () => {
        // console.log(options, selectValue, inputValue.current.value);
        setSearchKeyword({
            groupCodeSelect: selectValue,
            searchTitle: inputValue.current.value,
        });
    };

    return (
        <CommonCodeSearchStyled>
            {/* <select>
                            <option value={"groupName"}>그룹코드명</option>
                            <option value={"groupCode"}>그룹코드</option>
                        </select> */}
            <StyledSelectBox options={options} value={selectValue} onChange={setSelectValue} />
            <StyledInput ref={inputValue} />
            <StyledButton onClick={hendlerSearch}>검색</StyledButton>
            <StyledButton>등록</StyledButton>
        </CommonCodeSearchStyled>
    );
};
