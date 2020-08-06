import React, { useState } from "react";
import Draggable from "react-draggable";
import WeaponImage from "components/common/WeaponImage";
import { Box, Flex, Image } from "@chakra-ui/core";
import { weapons, Weapon } from "@sendou-ink/shared";
import useBgColor from "utils/useBgColor";

interface DraggableImageAdderProps {
  addImageToSketch: (imgSrc: string) => void;
}

const DraggableImageAdder: React.FC<DraggableImageAdderProps> = ({
  addImageToSketch,
}) => {
  const bg = useBgColor();
  const [activeDrags, setActiveDrags] = useState(0);

  const onStart = () => {
    setActiveDrags(activeDrags + 1);
  };

  const onStop = () => {
    setActiveDrags(activeDrags - 1);
  };

  return (
    <Draggable handle="strong" onStart={onStart} onStop={onStop}>
      <Box
        position="fixed"
        zIndex={999}
        borderRadius="7px"
        boxShadow="7px 14px 13px 2px rgba(0,0,0,0.24)"
        background={bg}
        textAlign="center"
        width="119px"
        ml="950px"
      >
        <strong style={{ cursor: "move" }}>
          <div
            style={{
              fontSize: "17px",
              borderRadius: "7px 7px 0 0",
              padding: "0.3em",
            }}
          >
            Add image
          </div>
        </strong>
        <Box overflowY="scroll" height="50vh">
          <Flex flexWrap="wrap">
            {weapons.map((wpn) => (
              <WeaponImage
                key={wpn}
                onClick={() =>
                  addImageToSketch(
                    `/images/weapons/${wpn.replace(".", "")}.png`
                  )
                }
                name={wpn}
                w={8}
                h={8}
                m="3px"
                ignoreFallback
              />
            ))}
            {["Blaster", "Brella", "Charger", "Slosher"].map(
              (grizzcoWeaponClass) => {
                const imgSrc = `/images/weapons/Grizzco ${grizzcoWeaponClass}.png`;
                return (
                  <Image
                    key={grizzcoWeaponClass}
                    onClick={() => addImageToSketch(imgSrc)}
                    src={imgSrc}
                    w={8}
                    h={8}
                    m="3px"
                    ignoreFallback
                  />
                );
              }
            )}
            {["TC", "RM", "CB"].map((mode) => {
              const imgSrc = `/images/modeIcons/${mode}.png`;
              return (
                <Image
                  key={mode}
                  onClick={() => addImageToSketch(imgSrc)}
                  src={imgSrc}
                  w={8}
                  h={8}
                  m="3px"
                  ignoreFallback
                />
              );
            })}
            {[
              "Drizzler",
              "Flyfish",
              "Goldie",
              "Griller",
              "Maws",
              "Scrapper",
              "Steel Eal",
              "Steelhead",
              "Stinger",
            ].map((boss) => {
              const imgSrc = `/images/salmonRunIcons/${boss}.png`;
              return (
                <Image
                  key={boss}
                  onClick={() => addImageToSketch(imgSrc)}
                  src={imgSrc}
                  w={8}
                  h={8}
                  m="3px"
                  ignoreFallback
                />
              );
            })}
          </Flex>
        </Box>
      </Box>
    </Draggable>
  );
};

export default DraggableImageAdder;
