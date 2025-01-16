import { TTypeButton } from "@/@types";
import { Button, Loader, MantineRadius, MantineSize } from "@mantine/core";

interface CustomButtonProps {
  handleClick?: () => void;
  isPending: boolean;
  targetPedding: string;
  radius?: MantineRadius;
  size?: MantineSize;
  target: string;
  type: TTypeButton;
}

export default function CustomButton({
  handleClick,
  isPending,
  type,
  target,
  size,
  radius,
  targetPedding,
}: CustomButtonProps) {
  return (
    <Button
      type={type}
      variant="primary"
      radius={radius}
      size={size}
      rightSection={isPending ? <Loader size={18} /> : null}
      onClick={handleClick}
      disabled={isPending}
      className={`${isPending && "bg-blue-400 text-white"}`}
    >
      {isPending ? targetPedding : target}
    </Button>
  );
}
