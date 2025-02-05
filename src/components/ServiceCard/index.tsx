"use client";

import { Badge, Button, Card, Group, Text } from "@mantine/core";
import Image from "next/image";
import classes from "@/components/ServiceCard/styles.module.css";
import {
  ICategory,
  ICreateAppointment,
  ICreateCart,
  ICurrentUser,
  IDataForCreateAppointment,
  IPicture,
} from "@/interfaces";
import { BookingModal } from "@/components/BookingServiceModal";
import { useSetAtom } from "jotai";
import { modalAtom } from "@/storage/atom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { creatAppointment, createCart, getServiceById } from "@/servers";
import SkeletonComponent from "@/components/Skeleton";
import { notifications } from "@mantine/notifications";
import useTimeConverter from "@/hooks/useTimeConverter";
import { useFormatCurrency } from "@/hooks/useFormatCurrency";

interface ServiceCardProps {
  description: string;
  price: number;
  image: IPicture;
  serviceId: number;
  name: string;
  duration: number;
  category: ICategory;
}

export default function ServiceCard({
  name,
  description,
  price,
  image,
  serviceId,
  duration,
}: ServiceCardProps) {
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

  const { convertMinutes } = useTimeConverter();
  const formatCurrency = useFormatCurrency(price);

  const queryClient = useQueryClient();
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
    <Card
      withBorder
      radius="md"
      className={`${classes.card} flex-grow flex-shrink basis-80 mb-4`}
    >
      <BookingModal
        service={service}
        appointmentIsPending={appointmentIsPending}
        appointmentIsError={appointmentIsError}
        onAddToCart={handleAddToCart}
        onBookNow={handleBookNow}
      />

      <Card.Section className={classes.imageSection}>
        <Image
          src="/images/haircutMan.jpg"
          alt=" {name}"
          width={770}
          height={100}
        />
      </Card.Section>

      <Group justify="space-between" mt="md">
        <div>
          <Text fw={500}> {name}</Text>
          <Text fz="xs" c="dimmed">
            {description}
          </Text>
        </div>
        <Badge variant="outline">Categoria de cortes de cabelo</Badge>
      </Group>

      <Card.Section className={classes.section} mt="md">
        <Text fz="sm" c="dimmed" className={classes.label}>
          Duração: {convertMinutes(duration)}
        </Text>
      </Card.Section>

      <Card.Section className={classes.section}>
        <Group gap={30}>
          <div>
            <Text fz="xl" fw={700} style={{ lineHeight: 1 }}>
              {formatCurrency}
            </Text>
            <Text fz="sm" c="dimmed" fw={500} style={{ lineHeight: 1 }} mt={3}>
              pelo serviço
            </Text>
          </div>

          <Button radius="xl" style={{ flex: 1 }} onClick={appointmentService}>
            Agendar agora
          </Button>
        </Group>
      </Card.Section>
    </Card>
  );
}
