import { ButtonGroup, Flex, Box } from "@chakra-ui/core";
import { RankedMode, Stage, Weapon } from "@sendou-ink/shared";
import { stages } from "@sendou-ink/shared/constants/stages";
import MyButton from "components/common/MyButton";
import PageHeader from "components/common/PageHeader";
import StageSelector from "components/plans/StageSelector";
import { NextPage } from "next";
import dynamic from "next/dynamic";
import React, { useEffect, useRef, useState } from "react";
import {
  FaBomb,
  FaFileDownload,
  FaFileImage,
  FaFileUpload,
} from "react-icons/fa";
import DraggableWeaponSelector from "components/plans/DraggableWeaponSelector";

const MapSketch = dynamic(() => import("components/plans/MapSketch"), {
  ssr: false,
});

const DraggableToolsSelector = dynamic(
  () => import("components/plans/DraggableToolsSelector"),
  {
    ssr: false,
  }
);

export interface PlannerMapBg {
  view?: "M" | "R";
  stage: Stage;
  mode?: "SZ" | "TC" | "RM" | "CB";
  tide?: "low" | "mid" | "high";
}

const REEF = {
  view: "M",
  stage: "The Reef",
  mode: "SZ",
} as const;

const reversedCodes = [
  ["Ancho-V Games", "AG"],
  ["Arowana Mall", "AM"],
  ["Blackbelly Skatepark", "BS"],
  ["Camp Triggerfish", "CT"],
  ["Goby Arena", "GA"],
  ["Humpback Pump Track", "HP"],
  ["Inkblot Art Academy", "IA"],
  ["Kelp Dome", "KD"],
  ["Musselforge Fitness", "MF"],
  ["MakoMart", "MK"],
  ["Manta Maria", "MM"],
  ["Moray Towers", "MT"],
  ["New Albacore Hotel", "NA"],
  ["Port Mackerel", "PM"],
  ["Piranha Pit", "PP"],
  ["Snapper Canal", "SC"],
  ["Shellendorf Institute", "SI"],
  ["Starfish Mainstage", "SM"],
  ["Skipper Pavilion", "SP"],
  ["Sturgeon Shipyard", "SS"],
  ["The Reef", "TR"],
  ["Wahoo World", "WH"],
  ["Walleye Warehouse", "WW"],
] as const;

const stageToCode = new Map<Stage, string>(reversedCodes);

const codes = [
  ["AG", "Ancho-V Games"],
  ["AM", "Arowana Mall"],
  ["BS", "Blackbelly Skatepark"],
  ["CT", "Camp Triggerfish"],
  ["GA", "Goby Arena"],
  ["HP", "Humpback Pump Track"],
  ["IA", "Inkblot Art Academy"],
  ["KD", "Kelp Dome"],
  ["MF", "Musselforge Fitness"],
  ["MK", "MakoMart"],
  ["MM", "Manta Maria"],
  ["MT", "Moray Towers"],
  ["NA", "New Albacore Hotel"],
  ["PM", "Port Mackerel"],
  ["PP", "Piranha Pit"],
  ["SC", "Snapper Canal"],
  ["SI", "Shellendorf Institute"],
  ["SM", "Starfish Mainstage"],
  ["SP", "Skipper Pavilion"],
  ["SS", "Sturgeon Shipyard"],
  ["TR", "The Reef"],
  ["WH", "Wahoo World"],
  ["WW", "Walleye Warehouse"],
] as const;

const codeToStage = new Map(codes);

const plannerMapBgToImage = (bg: PlannerMapBg) => {
  if (!bg.tide)
    return `images/plannerMaps/${bg.view} ${stageToCode.get(bg.stage)} ${
      bg.mode
    }.png`;

  return `images/plannerMaps/${bg.stage}-${bg.tide}.png`;
};

const defaultValue = {
  shadowWidth: 0,
  shadowOffset: 0,
  enableRemoveSelected: false,
  fillWithColor: false,
  fillWithBackgroundColor: false,
  drawings: [],
  canUndo: false,
  canRedo: false,
  controlledSize: false,
  sketchWidth: 600,
  sketchHeight: 600,
  stretched: true,
  stretchedX: false,
  stretchedY: false,
  originX: "left",
  originY: "top",
  expandTools: false,
  expandControls: false,
  expandColors: false,
  expandBack: false,
  expandImages: false,
  expandControlled: false,
  enableCopyPaste: false,
  backgroundImage: {
    type: "image",
    version: "2.4.3",
    originX: "left",
    originY: "top",
    left: 0,
    top: 0,
    width: 1127,
    height: 634,
    fill: "rgb(0,0,0)",
    stroke: null,
    strokeWidth: 0,
    strokeDashArray: null,
    strokeLineCap: "butt",
    strokeLineJoin: "miter",
    strokeMiterLimit: 4,
    scaleX: 1,
    scaleY: 1,
    angle: 0,
    flipX: false,
    flipY: false,
    opacity: 1,
    shadow: null,
    visible: true,
    clipTo: null,
    backgroundColor: "",
    fillRule: "nonzero",
    paintFirst: "fill",
    globalCompositeOperation: "source-over",
    transformMatrix: null,
    skewX: 0,
    skewY: 0,
    crossOrigin: "",
    cropX: 0,
    cropY: 0,
    src: "https://sendou.ink/plannerMaps/M%20TR%20SZ.png",
    filters: [],
  },
};

const MapPlannerPage: NextPage = () => {
  const fileInput = useRef<HTMLInputElement | null>(null);
  const sketch = useRef<any>(null);
  const [tool, setTool] = useState<any>("");
  const [color, setColor] = useState("#f44336");
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [bg, setBg] = useState<PlannerMapBg>(REEF);
  const [controlledValue, setControlledValue] = useState(defaultValue);

  const addImageToSketch = (weapon: Weapon) => {
    sketch.current.addImg(
      "https://peda.net/loimaa/peruskoulut/alastaron-yl%C3%A4aste/tapahtumia/2016-2017/mlv/mlv-k3/01-hevonen-jpg:file/download/b88e39ae2fc0ed0d9a44b543be23d4e5a67c0b91/01%20Hevonen.JPG"
    );
    //setTool(Tools.Select);
  };

  const addTextToSketch = () => {
    sketch.current.addText("Double-click to edit", {
      fill: color,
      fontFamily: "lato",
      stroke: "#000000",
      strokeWidth: 3,
      paintFirst: "stroke",
    });
    //setTool(Tools.Select);
  };

  const undo = () => {
    sketch.current.undo();
    setCanUndo(sketch.current.canUndo());
    setCanRedo(sketch.current.canRedo());
  };

  const redo = () => {
    sketch.current.redo();
    setCanUndo(sketch.current.canUndo());
    setCanRedo(sketch.current.canRedo());
  };

  const removeSelected = () => {
    sketch.current.removeSelected();
  };

  const onSketchChange = () => {
    if (!sketch.current) return;
    let prev = canUndo;
    let now = sketch.current.canUndo();
    if (prev !== now) {
      setCanUndo(now);
    }
  };

  const getDateFormatted = () => {
    const today = new Date();
    const date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    const time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return date + " " + time;
  };

  const download = (dataUrl: string, extension: string) => {
    if (!bg) return;
    let a = document.createElement("a");
    document.body.appendChild(a);
    a.style.display = "none";
    a.href = dataUrl;
    a.download = `${bg.view}-${stageToCode.get(bg.stage)}-${
      bg.mode
    } plans ${getDateFormatted()}.${extension}`;
    a.click();
    window.URL.revokeObjectURL(dataUrl);
  };

  const handleUpload = () => {
    if (!fileInput.current) {
      return;
    }
    fileInput.current.click();
  };

  const parseAndSetForms = (name: string) => {
    const firstPart = name.split(" ")[0];
    if (!(firstPart.length === 7 || !firstPart.includes("-"))) return;

    const split = firstPart.split("-");
    if (split.length !== 3) return;

    const [view, stage, mode] = split;

    if (!["M", "R"].includes(view)) return;
    if (
      !Array.from(reversedCodes.values())
        .map((tuple) => tuple[1])
        .includes(stage as any)
    )
      return;
    if (!["SZ", "TC", "RM", "CB"].includes(mode)) return;

    setBg({
      view: view as any,
      stage: codeToStage.get(stage as any)!,
      mode: mode as any,
    });
  };

  const files = fileInput.current?.files;

  useEffect(() => {
    if (!fileInput.current?.files?.length) return;

    const fileObj = fileInput.current.files[0];
    const reader = new FileReader();
    reader.onload = function (event) {
      const jsonObj = JSON.parse(event.target!.result as any);
      setControlledValue(jsonObj);
    };

    reader.readAsText(fileObj);

    parseAndSetForms(fileObj.name);
  }, [files]);

  useEffect(() => {
    if (!sketch.current) return;
    setCanUndo(false);
    sketch.current.setBackgroundFromDataUrl(plannerMapBgToImage(bg));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bg]);

  return (
    <>
      <PageHeader title="Map Planner" />
      <DraggableToolsSelector
        tool={tool}
        setTool={setTool}
        redo={redo}
        redoIsDisabled={!canRedo}
        undo={undo}
        undoIsDisabled={!canUndo}
        removeSelected={removeSelected}
        addText={addTextToSketch}
        color={color}
        setColor={(newColor) => setColor(newColor)}
      />
      <DraggableWeaponSelector
        addWeaponImage={(weapon) => addImageToSketch(weapon)}
      />
      <MapSketch
        sketch={sketch}
        controlledValue={controlledValue}
        color={color}
        onSketchChange={onSketchChange}
        tool={tool}
      />
      <Flex my={2} justifyContent="space-between">
        <MyButton
          onClick={() => {
            sketch.current.clear();
            setBg({ ...bg });
          }}
          leftIcon={<FaBomb />}
          colorScheme="red"
          size="sm"
          variant="outline"
        >
          Clear drawings
        </MyButton>
        <ButtonGroup variant="outline" size="sm" isAttached>
          <MyButton
            onClick={() => download(sketch.current.toDataURL(), "png")}
            leftIcon={<FaFileImage />}
          >
            Download as .png
          </MyButton>
          <MyButton
            onClick={() =>
              download(
                "data:text/json;charset=utf-8," +
                  encodeURIComponent(JSON.stringify(sketch.current.toJSON())),
                "json"
              )
            }
            leftIcon={<FaFileDownload />}
          >
            Download as .json
          </MyButton>
          <MyButton onClick={() => handleUpload()} leftIcon={<FaFileUpload />}>
            Load from .json
          </MyButton>
        </ButtonGroup>
      </Flex>
      <StageSelector
        handleChange={(e) => {
          const newStage = e.target.value;
          const newIsSalmonRunStage = !stages.includes(newStage as Stage);
          const oldIsSalmonRunStage = !stages.includes(bg.stage);

          if (newIsSalmonRunStage === oldIsSalmonRunStage) {
            setBg({ ...bg, stage: e.target.value as Stage });
            return;
          }

          if (newIsSalmonRunStage) {
            setBg({ stage: e.target.value as Stage, tide: "mid" });
            return;
          }

          setBg({ stage: e.target.value as Stage, mode: "SZ", view: "M" });
        }}
        currentBackground={bg}
        changeMode={(mode: RankedMode) => setBg({ ...bg, mode })}
        changeTide={(tide: "low" | "mid" | "high") => setBg({ ...bg, tide })}
      />
      <input
        type="file"
        accept=".json"
        ref={fileInput}
        style={{ display: "none" }}
        onChange={() => setBg({ ...bg })}
      />
    </>
  );
};

export default MapPlannerPage;
