"use client";
import ServiceCard from "@/components/ServiceCard";
import { ICurrentUser } from "@/interfaces";
import { getAllServices } from "@/servers";
import { useQuery } from "@tanstack/react-query";
import SkeletonComponent from "@/components/Skeleton";
import {
  BookingModal,
  CartItem,
  Service,
} from "@/components/BookingServiceModal";
import { useState } from "react";
import { getServiceById } from "@/mocks";

export default function DashboardChild() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);

  const handleAddToCart = (item: CartItem) => {
    setCart([...cart, item]);
  };

  const handleBookNow = (item: CartItem) => {
    // Implement direct booking logic
    console.log("Booking now:", item);
  };

  const currentUser = JSON.parse(
    localStorage.getItem("userInfo") as string
  ) as ICurrentUser;

  const {
    data: allServices,
    isPending,
    error,
  } = useQuery({
    queryKey: [`${currentUser.id}-${currentUser.role}-allServices`],
    queryFn: getAllServices,
  });

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

  return (
    <div className="flex items-center gap-3 w-full mt-10 flex-wrap justify-center">
      {allServices.map((service) => (
        <ServiceCard
          key={service.id}
          name={service.name}
          description={service.description}
          price={service.price}
          image={service.image}
          duration={service.duration}
          category={service.category}
        />
      ))}
      {!selectedService && (
        <BookingModal
          opened={!selectedService}
          onClose={() => setSelectedService(null)}
          service={getServiceById("srv1") as unknown as Service}
          onAddToCart={handleAddToCart}
          onBookNow={handleBookNow}
        />
      )}
    </div>
  );
}
