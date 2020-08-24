export const headOnlyAbilities = ["OG", "LDE", "T", "CB"] as const;
export const clothingOnlyAbilities = ["NS", "H", "TI", "RP", "AD"] as const;
export const shoesOnlyAbilities = ["SJ", "OS", "DR"] as const;
export const mainOnlyAbilities = [
  ...headOnlyAbilities,
  ...clothingOnlyAbilities,
  ...shoesOnlyAbilities,
];

export const stackableAbilities = [
  "ISM",
  "ISS",
  "REC",
  "RSU",
  "SSU",
  "SCU",
  "SS",
  "SPU",
  "QR",
  "QSJ",
  "BRU",
  "RES",
  "BDU",
  "MPU",
] as const;
