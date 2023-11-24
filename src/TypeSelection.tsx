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
      <button className={`bg-blue-${props.selected === SelectionType.SI ? "300" : "500"} hover:bg-blue-700 text-white font-bold py-2 px-4 rounded`} onClick={() => props.selectionFunction(SelectionType.SI)}>
        SI
      </button>
      <button className={`bg-blue-${props.selected === SelectionType.DI ? "300" : "500"} hover:bg-blue-700 text-white font-bold py-2 px-4 rounded`} onClick={() => props.selectionFunction(SelectionType.DI)}>
        Drop-In
      </button>
      <button className={`bg-blue-${props.selected === SelectionType.PT ? "300" : "500"} hover:bg-blue-700 text-white font-bold py-2 px-4 rounded`} onClick={() => props.selectionFunction(SelectionType.PT)}>
        Peer Tutoring
      </button>
    </div>
  )
}

export default TypeSelection;