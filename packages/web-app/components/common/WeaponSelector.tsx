import React from "react";
import { MySelect } from "./MySelect";
import { weapons, Weapon } from "@sendou-ink/shared";

interface WeaponSelectorProps {
  value: Weapon;
  setValue: (weapon: Weapon) => void;
}

const WeaponSelector: React.FC<WeaponSelectorProps> = ({ value, setValue }) => {
  return (
    <MySelect
      value={value}
      onChange={(e) => setValue(e.target.value as Weapon)}
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
