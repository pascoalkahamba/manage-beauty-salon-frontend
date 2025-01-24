"use client";

import {
  IconGasStation,
  IconGauge,
  IconManualGearbox,
  IconUsers,
} from "@tabler/icons-react";
import { Badge, Button, Card, Center, Group, Text } from "@mantine/core";
import Image from "next/image";
import classes from "@/components/ServiceCard/styles.module.css";

const mockdata = [
  { label: "4 passengers", icon: IconUsers },
  { label: "100 km/h in 4 seconds", icon: IconGauge },
  { label: "Automatic gearbox", icon: IconManualGearbox },
  { label: "Electric", icon: IconGasStation },
];

interface ServiceCardProps {
  height: string;
}

export default function ServiceCard() {
  const features = mockdata.map((feature) => (
    <Center key={feature.label}>
      <feature.icon size={16} className={classes.icon} stroke={1.5} />
      <Text size="xs">{feature.label}</Text>
    </Center>
  ));

  return (
    <Card
      withBorder
      radius="md"
      className={`${classes.card} w-[25%] bg-white rounded-lg shadow-md p-4"`}
    >
      <Card.Section className={classes.imageSection}>
        <Image
          src="/images/haircutMan.jpg"
          alt="Corte Americano"
          width={770}
          height={100}
        />
      </Card.Section>

      <Group justify="space-between" mt="md">
        <div>
          <Text fw={500}>Corte Americano</Text>
          <Text fz="xs" c="dimmed">
            Corte de cabelo moderno e personalizado.
          </Text>
        </div>
        <Badge variant="outline">Categoria de cortes de cabelo</Badge>
      </Group>

      <Card.Section className={classes.section} mt="md">
        <Text fz="sm" c="dimmed" className={classes.label}>
          Duração: 1 hora
        </Text>
      </Card.Section>

      <Card.Section className={classes.section}>
        <Group gap={30}>
          <div>
            <Text fz="xl" fw={700} style={{ lineHeight: 1 }}>
              $168.00
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
