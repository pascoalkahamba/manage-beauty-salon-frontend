import { IModalAtom } from "@/interfaces";
import { atom } from "jotai";

const modalAtom = atom<IModalAtom>({
  type: "none",
  status: false,
});

export { modalAtom };
