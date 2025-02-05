"use client";
import { Button, Paper, rem, Text, Title } from "@mantine/core";
import classes from "@/components/ServiceCardCarousel/styles.module.css";
import {
  ICategory,
  ICreateAppointment,
  ICreateCart,
  ICurrentUser,
  IDataForCreateAppointment,
  IPicture,
} from "@/interfaces";
import useTimeConverter from "@/hooks/useTimeConverter";
import { modalAtom } from "@/storage/atom";
import { useSetAtom } from "jotai";
import { BookingModal } from "@/components/BookingServiceModal";
import SkeletonComponent from "@/components/Skeleton";
import { notifications } from "@mantine/notifications";
import { creatAppointment, createCart, getServiceById } from "@/servers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFormatCurrency } from "@/hooks/useFormatCurrency";

interface ServiceCardProps {
  height: string;
  description: string;
  price: number;
  image: IPicture;
  serviceId: number;
  name: string;
  duration: number;
  category: ICategory;
}

export default function ServiceCardCarouusel({
  category,
  description,
  name,
  duration,
  price,
  serviceId,
  image,
  height,
}: ServiceCardProps) {
  const { convertMinutes } = useTimeConverter();
  const formatCurrency = useFormatCurrency(price);
  const queryClient = useQueryClient();
  const currentUser = JSON.parse(
    localStorage.getItem("userInfo") as string
  ) as ICurrentUser;
  const {
    data: service,
    isPending,
    error,
  } = useQuery({
    queryKey: [`${currentUser.role}-${currentUser.id}-getOneService`],
    queryFn: () => getServiceById(serviceId),
  });

  const { mutate: mutateCreateCart } = useMutation({
    mutationFn: (cart: ICreateCart) => createCart(cart),
    onSuccess: () => {
      notifications.show({
        title: "Serviço adicionado ao carrinho!",
        message: "Serviço adicionado ao carrinho com sucesso!",
        color: "green",
        position: "top-right",
      });
      queryClient.invalidateQueries({
        queryKey: [`${currentUser.id}-${currentUser.role}-getOneUser`],
      });
    },
    onError: () => {
      notifications.show({
        title: "Erro ao adicionar ao carrinho",
        message:
          "Ocorreu um erro ao adicionar o serviço ao carrinho. Tente novamente mais tarde.",
        color: "red",
        position: "top-right",
      });
    },
  });
  const {
    mutate,
    isPending: appointmentIsPending,
    data: appointmentData,
    isError: appointmentIsError,
  } = useMutation({
    mutationFn: (item: ICreateAppointment) => creatAppointment(item),
    onSuccess: () => {
      notifications.show({
        title: "Agendamento realizado com sucesso!",
        message: "Seu agendamento foi realizado com sucesso!",
        color: "green",
        position: "top-right",
      });
    },
    onError: () => {
      notifications.show({
        title: "Erro ao agendar",
        message:
          "Ocorreu um erro ao agendar o serviço. Tente novamente mais tarde.",
        color: "red",
        position: "top-right",
      });
    },
  });
  const handleAddToCart = async (item: IDataForCreateAppointment) => {
    await handleBookNow(item);

    mutateCreateCart({
      clientId: currentUser.id,
      appointmentId: appointmentData?.id as number,
    });
  };

  const setModal = useSetAtom(modalAtom);

  const handleBookNow = async (item: IDataForCreateAppointment) => {
    // Implement direct booking logic
    mutate({
      clientId: currentUser.id,
      serviceId: serviceId,
      date: item.date,
      hour: item.hour,
      employeeId: +item.employeeId,
      status: "PENDING",
    });
    console.log("Booking now:", item);
  };

  function appointmentService() {
    if (currentUser.role !== "CLIENT") {
      notifications.show({
        title: "Acesso negado",
        message:
          "Você não tem permissão para agendar serviços. Por enquanto apenas clientes podem agendar serviços.",
        color: "yellow",
        position: "top-right",
      });
      return;
    }

    setModal({
      type: "appointmentService",
      status: true,
    });
  }

  if (isPending)
    return (
      <SkeletonComponent
        isPending={isPending}
        skeletons={[3]}
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

  return (
    <Paper
      shadow="md"
      p="xl"
      radius="md"
      style={{
        backgroundImage: `url(/images/haircutMan.jpg)`,
        height: rem(height),
      }}
      className={`${classes.card} flex-grow flex-shrink w-full basis-80 mb-4`}
    >
      <BookingModal
        service={service}
        appointmentIsPending={appointmentIsPending}
        appointmentIsError={appointmentIsError}
        onAddToCart={handleAddToCart}
        onBookNow={handleBookNow}
      />

      <div className="flex items-center justify-between w-full">
        <Title order={3} className={classes.title}>
          {name}
        </Title>
        <Text className={classes.category} size="xs">
          Categoria {category.name}
        </Text>
      </div>
      <div className="flex items-center justify-between w-full">
        <Text className={classes.category} size="xs">
          {description}
        </Text>

        <Text className={classes.category} size="xs">
          Duração: {convertMinutes(duration)}
        </Text>
      </div>
      <Text
        fz="xl"
        fw={700}
        style={{ lineHeight: 1 }}
        className="text-slate-200"
      >
        {formatCurrency}
      </Text>

      <Button variant="white" color="dark" onClick={appointmentService}>
        Agendar agora
      </Button>
    </Paper>
  );
}
