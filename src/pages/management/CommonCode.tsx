import { ContentBox } from "../../components/common/ContentBox/ContentBox";
import { CommonCodeMain } from "../../components/page/Management/CommonCode/CommonCodeMain/CommonCodeMain";
import { CommonCodeSearch } from "../../components/page/Management/CommonCode/CommonCodeSearch/CommonCodeSearch";
import { createContext, useState, FC } from "react";
import { CommonCodeProvider } from "../../api/Provider/CommonCodeProvier";
import { useEffect } from "react";
interface iSearchKeyword {
    searchKeyword: object;
    setSearchKeyword: (keyword: object) => void;
}

const defaultValue: iSearchKeyword = {
    searchKeyword: {},
    setSearchKeyword: () => {},
};

export const CommonCode = () => {
    return (
        <>
            <CommonCodeProvider>
                <ContentBox variant='primary' fontSize='large'>
                    공통코드관리
                </ContentBox>
                <CommonCodeSearch />
                <CommonCodeMain />
            </CommonCodeProvider>
        </>
    );
};
