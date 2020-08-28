import React from "react";
import { MySelect } from "./MySelect";
import { weapons, Weapon } from "@sendou-ink/shared";
import { SelectProps, Flex } from "@chakra-ui/core";
import WeaponImage from "./WeaponImage";

interface WeaponSelectorProps {
  value: Weapon;
  setValue: (weapon: Weapon) => void;
  showImage?: boolean;
}

const WeaponSelector: React.FC<WeaponSelectorProps & SelectProps> = ({
  value,
  setValue,
  showImage,
  ...props
}) => {
  const weaponSelect = (
    <MySelect
      value={value}
      onChange={(e) => setValue(e.target.value as Weapon)}
      {...props}
    >
      {weapons.map((wpn) => (
        <option key={wpn} value={wpn}>
          {wpn}
        </option>
      ))}
    </MySelect>
  );

  if (showImage) {
    return (
      <Flex alignItems="center">
        {weaponSelect}
        <WeaponImage name={value} w="2rem" h="2rem" ml="1rem" />
      </Flex>
    );
  }

  return weaponSelect;
};

export default WeaponSelector;
