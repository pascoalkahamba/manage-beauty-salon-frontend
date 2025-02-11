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
  IEmployee,
  IPicture,
  IService,
} from "@/interfaces";
import { BookingModal } from "@/components/BookingServiceModal";
import { useAtom, useSetAtom } from "jotai";
import { currentServiceAtom, modalAtom } from "@/storage/atom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { creatAppointment, createCart } from "@/servers";
import { notifications } from "@mantine/notifications";
import useTimeConverter from "@/hooks/useTimeConverter";
import { useFormatCurrency } from "@/hooks/useFormatCurrency";

interface ServiceCardProps {
  description: string;
  price: number;
  image: IPicture;
  serviceId: number;
  employees: IEmployee[];
  name: string;
  duration: number;
  category: ICategory;
}

export default function ServiceCard({
  name,
  description,
  price,
  image,
  employees,
  category,
  serviceId,
  duration,
}: ServiceCardProps) {
  const currentUser = JSON.parse(
    localStorage.getItem("userInfo") as string
  ) as ICurrentUser;
  const service: IService = {
    name,
    description,
    price,
    picture: image,
    id: serviceId,
    duration,
    categoryId: category.id,
    employees,
    category,
  };
  const { convertMinutes } = useTimeConverter();
  const formatCurrency = useFormatCurrency(price);
  const [currentService, setCurrentService] = useAtom(currentServiceAtom);

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

  const setOpened = useSetAtom(modalAtom);

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
    setOpened({
      type: "appointmentService",
      status: true,
    });

    setCurrentService(service);
  }

  return (
    <Card
      withBorder
      radius="md"
      className={`${classes.card} flex-grow flex-shrink basis-80 mb-4`}
    >
      {currentService && (
        <BookingModal
          appointmentIsPending={appointmentIsPending}
          appointmentIsError={appointmentIsError}
          onAddToCart={handleAddToCart}
          onBookNow={handleBookNow}
        />
      )}
      <Card.Section className={classes.imageSection}>
        <Image
          src={
            !service.picture.url
              ? "/images/haircutMan.jpg"
              : service.picture.url
          }
          alt={!service.picture.name ? "Haircut Man" : service.picture.name}
          width={770}
          height={100}
        />
      </Card.Section>

      <Group justify="space-between" mt="md">
        <div>
          <Text fw={500}>{name}</Text>
          <Text fz="xs" c="dimmed">
            {description}
          </Text>
        </div>
        <Badge variant="outline">{category.description}</Badge>
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
