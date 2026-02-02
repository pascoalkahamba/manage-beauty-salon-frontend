"use client";
import { Carousel } from "@mantine/carousel";
import { useMantineTheme, rem } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { getAllServices } from "@/servers";
import SkeletonComponent from "@/components/Skeleton";
import ServiceCardCarousel from "@/components/ServiceCardCarousel";
import classes from "@/components/CardsCarousel/styles.module.css";
import { ICurrentUser } from "@/interfaces";
import { useEffect, useState } from "react";

export default function CardsCarousel() {
  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const [currentUser, setCurrentUser] = useState<ICurrentUser | null>(null);

  useEffect(() => {
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

  if (!currentUser) {
    return (
      <SkeletonComponent
        isPending={true}
        skeletons={[3, 2]}
        width={200}
        height={300}
      />
    );
  }

  if (isPending)
    return (
      <SkeletonComponent
        isPending={isPending}
        skeletons={[3, 2]}
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

  const slides = allServices
    .slice(0, 4)
    .map(
      ({
        id,
        name,
        description,
        price,
        duration,
        picture,
        category,
        employees,
      }) => (
        <Carousel.Slide key={id}>
          <ServiceCardCarousel
            height={`440px`}
            name={name}
            category={category}
            employees={employees}
            serviceId={id}
            description={description}
            price={price}
            duration={duration}
            image={picture}
          />
        </Carousel.Slide>
      ),
    );

  return (
    <Carousel
      withIndicators
      classNames={{
        indicator: classes.customIndicators,
        control: classes.customIndicators,
      }}
      slideSize={{ base: "100%", sm: "50%" }}
      slideGap={{ base: rem(2), sm: "xl" }}
      align="start"
      slidesToScroll={mobile ? 1 : 2}
      style={{ height: "420px" }}
    >
      {slides}
    </Carousel>
  );
}
