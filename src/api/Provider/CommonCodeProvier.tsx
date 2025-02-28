import { createContext, useState, FC } from "react";
import { useEffect } from "react";

// 초기값의 타입 이다.
interface ISearchKeyword {
    searchKeyword?: object;
    setSearchKeyword?: React.Dispatch<React.SetStateAction<Object>>;
    //setSearchKeyword 의 타입을 (keyword:object)=>void 으로 바꾸어도 된다. 단 이는 모든 변수를 받는 리턴타입이 void인 성격이라 비추.
}

// 다른 컴포넌트에서 사용 가능한 값을 만든다
export const CommonCodeContext = createContext<ISearchKeyword>({});

// 만들어진 값에 searchKeyword, setSearchKeyword 을 넣어서 자식 노드에서 자유롭게 호출하게 한다.
// 그게 children()= 프로바이더가 감쌀 컴포넌트)으로 표시 한다 암묵적으로 몰러 ㅎㅎ
export const CommonCodeProvider: FC<{
    children: React.ReactNode | React.ReactNode[];
}> = ({ children }) => {
    const [searchKeyword, setSearchKeyword] = useState<object>({});

    return (
        <CommonCodeContext.Provider value={{ searchKeyword, setSearchKeyword }}>{children}</CommonCodeContext.Provider>
    );
};
