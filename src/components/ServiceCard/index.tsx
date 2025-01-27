"use client";

import { Badge, Button, Card, Group, Text } from "@mantine/core";
import Image from "next/image";
import classes from "@/components/ServiceCard/styles.module.css";
import { ICategory, IPicture } from "@/interfaces";

interface ServiceCardProps {
  description: string;
  price: number;
  image: IPicture;
  name: string;
  duration: number;
  category: ICategory;
}

export default function ServiceCard({
  name,
  description,
  price,
  image,
  duration,
}: ServiceCardProps) {
  return (
    <Card
      withBorder
      radius="md"
      className={`${classes.card} flex-grow flex-shrink basis-80 mb-4`}
    >
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
          Duração: {duration} hora
        </Text>
      </Card.Section>

      <Card.Section className={classes.section}>
        <Group gap={30}>
          <div>
            <Text fz="xl" fw={700} style={{ lineHeight: 1 }}>
              ${price}
            </Text>
            <Text fz="sm" c="dimmed" fw={500} style={{ lineHeight: 1 }} mt={3}>
              pelo serviço
            </Text>
          </div>

          <Button radius="xl" style={{ flex: 1 }}>
            Agendar agora
          </Button>
        </Group>
      </Card.Section>
    </Card>
  );
}
