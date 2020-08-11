import { Button, ButtonProps } from "@chakra-ui/core";

const MyButton: React.FC<ButtonProps> = (props) => (
  <Button colorScheme="blue" {...props} />
);

export default MyButton;
