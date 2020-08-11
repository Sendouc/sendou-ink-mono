import { SelectProps, Select } from "@chakra-ui/core";
import useBgColor from "utils/useBgColor";

export const MySelect: React.FC<SelectProps> = (props) => {
  const bg = useBgColor();
  return <Select bg={bg} {...props} />;
};
