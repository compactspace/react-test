import { Suspense, useEffect } from 'react';
import { LeftMenuBar } from '../LeftMenuBar/LeftMenuBar';
import { DashBoardStyled } from './styled';
import { Outlet, useNavigate } from 'react-router-dom';
import { ILoginInfo } from '../../../models/interface/store/userInfo';
import { useUserInfo } from '../../../hook/useUserInfo';
export const DashBoard = () => {
    const userInfo = sessionStorage.getItem('userInfo');
    const navigate = useNavigate();
    useUserInfo();
    
    useEffect(() => {
        if (userInfo) {
            const userInfoObj: ILoginInfo = JSON.parse(userInfo);
            if (userInfoObj.result !== 'SUCCESS') {
                alert('로그인을 실패했습니다');
                navigate('/');
            }
        } else {
            alert('로그인부터 해주세요');
            navigate('/');
        }
    }, [userInfo]);
    return (
        <DashBoardStyled>
            <ul className="dashboard-ul">
                <li className="menu-bar">{<LeftMenuBar />}</li>
                <li className="content">
                    {/*  Routers.tsx 파일에 있는라우터 상위 패스의 childeren path의 element=컴포넌트를  열릴 공간으로  Outlet  으로 끼워 넣는거다 걍암기 */}
                    <Suspense fallback={<h2>Loading....</h2>}>{<Outlet />}</Suspense>
                </li>
            </ul>
        </DashBoardStyled>
    );
};
