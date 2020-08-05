import { Weapon } from "@sendou-ink/shared";
import { ImageProps, Image } from "@chakra-ui/core";

interface WeaponImageProps {
  name: Weapon;
}

const WeaponImage: React.FC<ImageProps & WeaponImageProps> = ({
  name,
  ...props
}) => {
  return (
    <Image src={`/images/weapons/${name.replace(".", "")}.png`} {...props} />
  );
};

export default WeaponImage;
