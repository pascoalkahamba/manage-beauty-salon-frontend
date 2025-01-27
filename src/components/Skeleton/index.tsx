import { Skeleton } from "@mantine/core";

interface SkeletonComponentProps {
  isPending: boolean;
  width: number;
  height: number;
  skeletons: number[];
}
export default function SkeletonComponent({
  isPending,
  skeletons,
  width,
  height,
}: SkeletonComponentProps) {
  return (
    <section className="flex justify-center items-center w-full flex-wrap gap-2 px-12 py-4">
      {skeletons.map((skeleton, index) => (
        <Skeleton
          visible={isPending}
          key={index}
          height={height}
          width={width}
          className="flex-auto"
          radius="sm"
        />
      ))}
    </section>
  );
}
