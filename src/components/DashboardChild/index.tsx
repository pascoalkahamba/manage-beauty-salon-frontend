"use client";
import ServiceCard from "@/components/ServiceCard";
import { ICurrentUser } from "@/interfaces";
import { getAllServices } from "@/servers";
import { useQuery } from "@tanstack/react-query";
import SkeletonComponent from "@/components/Skeleton";
import { useEffect, useState } from "react";

export default function DashboardChild() {
  const [currentUser, setCurrentUser] = useState<ICurrentUser | null>(null);

  useEffect(() => {
    // Only access localStorage on the client side
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      setCurrentUser(JSON.parse(userInfo) as ICurrentUser);
    }
  }, []);

  const {
    data: allServices,
    isPending,
    error,
  } = useQuery({
    queryKey: currentUser
      ? [`${currentUser.id}-${currentUser.role}-allServices`]
      : ["guest-allServices"],
    queryFn: getAllServices,
    enabled: !!currentUser,
  });

  // Show loading while checking localStorage
  if (!currentUser) {
    return (
      <SkeletonComponent
        isPending={true}
        skeletons={[3, 2, 5]}
        width={200}
        height={300}
      />
    );
  }

  if (isPending)
    return (
      <SkeletonComponent
        isPending={isPending}
        skeletons={[3, 2, 5]}
        width={200}
        height={300}
      />
    );

  if (error)
    return (
      (
        <p className="p-3 font-bold text-center">
          Algo deu errado tente novamente:
        </p>
      ) + error.message
    );

  if (allServices.length <= 0)
    return (
      <p className="p-3 font-bold text-center">
        Nenhum serviço encontrado por favor crie um serviço.
      </p>
    );

  console.log("allServices", allServices);

  return (
    <div className="flex items-center gap-3 w-full mt-10 flex-wrap justify-center">
      {allServices.map((service) => (
        <ServiceCard
          key={service.id}
          name={service.name}
          serviceId={service.id}
          description={service.description}
          price={service.price}
          employees={service.employees}
          image={service.picture}
          duration={service.duration}
          category={service.category}
        />
      ))}
    </div>
  );
}
