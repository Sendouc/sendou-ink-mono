import React from "react";
import { MySelect } from "./MySelect";
import { weapons, Weapon } from "@sendou-ink/shared";
import { SelectProps } from "@chakra-ui/core";

interface WeaponSelectorProps {
  value: Weapon;
  setValue: (weapon: Weapon) => void;
}

const WeaponSelector: React.FC<WeaponSelectorProps & SelectProps> = ({
  value,
  setValue,
  ...props
}) => {
  return (
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
};

export default WeaponSelector;
