"use client";
import { Button, Paper, rem, Text, Title } from "@mantine/core";
import Link from "next/link";
import classes from "@/components/ServiceCardCarousel/styles.module.css";
import { ICategory, IPicture } from "@/interfaces";
import useTimeConverter from "@/hooks/useTimeConverter";

interface ServiceCardProps {
  height: string;
  description: string;
  price: number;
  image: IPicture;
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
  image,
  height,
}: ServiceCardProps) {
  const { convertMinutes } = useTimeConverter();
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
          duração: {convertMinutes(duration)}
        </Text>
      </div>
      <Text className={classes.category} size="xs">
        preço {price} mil kwanzas
      </Text>

      <Button variant="white" color="dark">
        Agendar agora
      </Button>
    </Paper>
  );
}
