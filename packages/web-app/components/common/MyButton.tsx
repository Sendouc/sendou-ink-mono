import { Button, ButtonProps } from "@chakra-ui/core";
import useColors from "utils/useColors";

const MyButton: React.FC<ButtonProps> = (props) => {
  const { colorScheme } = useColors();
  return <Button colorScheme={colorScheme} {...props} />;
};

export default MyButton;
