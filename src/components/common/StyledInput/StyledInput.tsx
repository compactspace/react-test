import React, { forwardRef } from "react";
import { StyledInputStyled } from "./styled";
//Omit 의 두번째 인자는 왼쪽의 인자중 그것만 빼오겠다 정도로 암기/
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
    variant?: "default" | "outline" | "filled";
    size?: "small" | "medium" | "large"; // ✅ 우리가 원하는 `size` 타입
    fullWidth?: boolean;
    error?: boolean;
}

export const StyledInput = forwardRef<HTMLInputElement, InputProps>(({ ...props }, ref) => {
    return <StyledInputStyled ref={ref} {...props} />;
});
