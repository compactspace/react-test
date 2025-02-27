import { atom } from "recoil";

export const modalSate = atom<boolean>({
    key: "modalState",
    default: false,
});
