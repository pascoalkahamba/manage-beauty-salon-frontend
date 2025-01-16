import SignUp from "@/components/SignUp";
import { Metadata } from "next";
import { cookies } from "next/headers";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Salão de Beleza | Criar Conta",
  description: "Page to user creates your account on the website.",
};

export default function CreatedAccount() {
  const cookiesStore = cookies();

  return (
    <section className="w-full h-svh flex p-5 justify-center">
      <div
        className="flex justify-center gap-2 w-full rounded-2xl"
        data-aos="fade-right"
        data-aos-duration="1400"
      >
        <div className="w-[70%] rounded-2xl">
          <Image
            src="/img/beauty-salon-createAccount.jpg"
            width={300}
            height={300}
            alt="create account picture"
            className="w-full h-full rounded-tl-2xl rounded-bl-2xl"
          />
        </div>
        <SignUp />
      </div>
    </section>
  );
}
