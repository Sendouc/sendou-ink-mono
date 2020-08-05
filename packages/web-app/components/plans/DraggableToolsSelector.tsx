import React, { useState } from "react";
import Draggable from "react-draggable";
import { Tools } from "@sendou/react-sketch";
import { useHotkeys } from "react-hotkeys-hook";
import {
  Box,
  Flex,
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
} from "@chakra-ui/core";
import {
  FaPencilAlt,
  FaRegSquare,
  FaRegCircle,
  FaRegObjectGroup,
  FaTrashAlt,
  FaRedo,
  FaUndo,
  FaFont,
} from "react-icons/fa";
import { AiOutlineLine } from "react-icons/ai";
import { CirclePicker, ColorResult } from "react-color";
import useBgColor from "utils/useBgColor";

interface PlannerColorPickerProps {
  color: string;
  setColor: (newColor: string) => void;
}

const PlannerColorPicker: React.FC<PlannerColorPickerProps> = ({
  color,
  setColor,
}) => {
  const bg = useBgColor();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Popover placement="bottom" isOpen={isOpen}>
      <PopoverTrigger>
        <Box
          cursor="pointer"
          height="27px"
          width="27px"
          backgroundColor={color}
          borderRadius="50%"
          display="inline-block"
          mr="11px"
          ml="10px"
          onClick={() => setIsOpen(true)}
        />
      </PopoverTrigger>
      <PopoverContent zIndex={4} width="260px" backgroundColor={bg}>
        <PopoverBody textAlign="center">
          <CirclePicker
            width="260px"
            onChangeComplete={(color: ColorResult) => {
              setColor(color.hex);
              setIsOpen(false);
            }}
          />
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

interface DraggableToolsSelectorProps {
  tool: any;
  setTool: React.Dispatch<any>;
  redo: () => void;
  redoIsDisabled: boolean;
  undo: () => void;
  undoIsDisabled: boolean;
  removeSelected: () => void;
  addText: () => void;
  color: string;
  setColor: (newColor: string) => void;
}

const DraggableToolsSelector: React.FC<DraggableToolsSelectorProps> = ({
  tool,
  setTool,
  redo,
  redoIsDisabled,
  undo,
  undoIsDisabled,
  removeSelected,
  addText,
  color,
  setColor,
}) => {
  const bg = useBgColor();
  const [activeDrags, setActiveDrags] = useState(0);
  useHotkeys("p", () => setTool(Tools.Pencil));
  useHotkeys("l", () => setTool(Tools.Line));
  useHotkeys("r", () => setTool(Tools.Rectangle));
  useHotkeys("c", () => setTool(Tools.Circle));
  useHotkeys("s", () => setTool(Tools.Select));

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
        zIndex={900}
        background={bg}
        borderRadius="7px"
        boxShadow="7px 14px 13px 2px rgba(0,0,0,0.24)"
        width="100px"
      >
        <strong style={{ cursor: "move" }}>
          <Box
            fontSize="17px"
            borderRadius="7px 7px 0 0"
            padding="0.3em"
            textAlign="center"
          >
            Tools
          </Box>
        </strong>
        <Flex flexWrap="wrap" justifyContent="center">
          <IconButton
            onClick={() => setTool(Tools.Pencil)}
            variant="ghost"
            size="lg"
            aria-label="Pencil (P)"
            icon={<FaPencilAlt />}
            border={tool === Tools.Pencil ? "2px solid" : undefined}
            borderColor={bg}
            title="Pencil (P)"
          />
          <IconButton
            onClick={() => setTool(Tools.Line)}
            variant="ghost"
            size="lg"
            aria-label="Line (L)"
            icon={<AiOutlineLine />}
            border={tool === Tools.Line ? "2px solid" : undefined}
            borderColor={bg}
            title="Line (L)"
          />
          <IconButton
            onClick={() => setTool(Tools.Rectangle)}
            variant="ghost"
            size="lg"
            aria-label="Rectangle (R)"
            icon={<FaRegSquare />}
            border={tool === Tools.Rectangle ? "2px solid" : undefined}
            borderColor={bg}
            title="Rectangle (R)"
          />
          <IconButton
            onClick={() => setTool(Tools.Circle)}
            variant="ghost"
            size="lg"
            aria-label="Circle (C)"
            icon={<FaRegCircle />}
            border={tool === Tools.Circle ? "2px solid" : undefined}
            borderColor={bg}
            title="Circle (C)"
          />
          <IconButton
            onClick={() => setTool(Tools.Select)}
            variant="ghost"
            size="lg"
            aria-label="Select (S)"
            icon={<FaRegObjectGroup />}
            border={tool === Tools.Select ? "2px solid" : undefined}
            borderColor={bg}
            title="Select (S)"
          />
          <IconButton
            onClick={() => removeSelected()}
            isDisabled={tool !== Tools.Select}
            variant="ghost"
            size="lg"
            aria-label="Delete selected"
            icon={<FaTrashAlt />}
            title="Delete selected"
          />
          <IconButton
            onClick={() => undo()}
            isDisabled={undoIsDisabled}
            variant="ghost"
            size="lg"
            aria-label="Undo"
            icon={<FaUndo />}
            title="Undo"
          />
          <IconButton
            onClick={() => redo()}
            isDisabled={redoIsDisabled}
            variant="ghost"
            size="lg"
            aria-label="Redo"
            icon={<FaRedo />}
            title="Redo"
          />
          <IconButton
            onClick={() => addText()}
            variant="ghost"
            size="lg"
            aria-label="Add text"
            icon={<FaFont />}
            title="Add text"
          />
          <Flex justify="center" align="center">
            <PlannerColorPicker color={color} setColor={setColor} />
          </Flex>
        </Flex>
      </Box>
    </Draggable>
  );
};

export default DraggableToolsSelector;
