import React from "react";
import { SelectionType } from "./ClassLookup";

type Props = {
  className: string;
  selected: SelectionType;
  selectionFunction: (a: SelectionType) => void;
}

function TypeSelection(props: Props) {
  return (
    <div className={props.className + " flex flex-row gap-2"}>
      <button style={{ backgroundColor: props.selected === SelectionType.SI ? "rgb(147, 197, 253)" : "rgb(59, 130, 246)" }} className={`text-white font-bold py-2 px-4 rounded`} onClick={() => props.selectionFunction(SelectionType.SI)}>
        SI
      </button>
      <button style={{ backgroundColor: props.selected === SelectionType.DI ? "rgb(147, 197, 253)" : "rgb(59, 130, 246)" }} className={`text-white font-bold py-2 px-4 rounded`} onClick={() => props.selectionFunction(SelectionType.DI)}>
        Drop-In
      </button>
      <button style={{ backgroundColor: props.selected === SelectionType.PT ? "rgb(147, 197, 253)" : "rgb(59, 130, 246)" }} className={`text-white font-bold py-2 px-4 rounded`} onClick={() => props.selectionFunction(SelectionType.PT)}>
        Peer Tutoring
      </button>
    </div>
  )
}

export default TypeSelection;