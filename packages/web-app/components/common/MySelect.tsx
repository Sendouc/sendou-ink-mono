import { SelectProps, Select } from "@chakra-ui/core";
import useColors from "utils/useColors";

export const MySelect: React.FC<SelectProps> = (props) => {
  const { bg } = useColors();
  return <Select bg={bg} {...props} />;
};
