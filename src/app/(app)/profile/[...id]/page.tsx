import { TRole } from "@/@types";
import UserProfilePage from "@/components/UserProfilePage";
import { Metadata } from "next";

interface ProfileProps {
  params: {
    id: number[];
  };
}

export const metadata: Metadata = {
  title: "Salão de Beleza | Perfil",
  description: "Page to user creates your account on the website.",
};

export default function Profile({ params }: ProfileProps) {
  return (
    <section className="w-full h-svh flex p-2 justify-center">
      <div className="w-[50%] mt-0">
        <UserProfilePage
          id={params.id[0]}
          role={params.id[1] as unknown as TRole}
        />
      </div>
    </section>
  );
}
