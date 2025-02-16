import { ICustomModalAtom, IModalAtom, IService } from "@/interfaces";
import { atom } from "jotai";

const modalAtom = atom<IModalAtom>({
  type: "none",
  status: false,
});

const customModalAtom = atom<ICustomModalAtom>({
  type: "editCategory",
  status: false,
});

const currentServiceAtom = atom<IService | null>(null);

export { modalAtom, currentServiceAtom, customModalAtom };
