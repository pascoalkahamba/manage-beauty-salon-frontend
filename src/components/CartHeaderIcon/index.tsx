import { IconShoppingCart } from "@tabler/icons-react";
import { Group, Box, Text } from "@mantine/core";
import { useSetAtom } from "jotai";
import { modalAtom } from "@/storage/atom";

interface CartHeaderIconProps {
  itemCount: number | undefined;
}

const CartHeaderIcon = ({ itemCount = 0 }: CartHeaderIconProps) => {
  const setModal = useSetAtom(modalAtom);
  return (
    <Group
      gap={2}
      style={{ position: "relative", cursor: "pointer" }}
      onClick={() => setModal({ type: "openCart", status: true })}
    >
      <Box
        style={{
          position: "absolute",
          top: -5,
          right: -8,
          minWidth: "20px",
          height: "20px",
          borderRadius: "10px",
          background: "#f08804",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 4px",
          fontSize: "14px",
          fontWeight: 700,
        }}
      >
        {itemCount}
      </Box>
      <IconShoppingCart size={28} color="white" />
      <Text c="white" fw={500} fz="sm" className=" mt-3">
        Cart
      </Text>
    </Group>
  );
};

export default CartHeaderIcon;
