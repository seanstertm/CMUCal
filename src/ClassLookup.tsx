import React from "react";
import { useState } from "react";
import TypeSelection from "./TypeSelection";
import Lookup from "./Lookup";

type Props = {
  className: string
}

export enum SelectionType {
  SI,
  DI,
  PT
}

function ClassLookup(props: Props) {

  const [className, setClassName] = useState('')
  const [selectionType, setSelectionType] = useState<SelectionType>(SelectionType.SI);

  return (
    <div className={props.className + " flex flex-col gap-2"}>
      <input
        className="overflow-x-clip"
        value={className}
        onChange={e => setClassName(e.target.value)}
      />
      <TypeSelection className="" selected={selectionType} selectionFunction={setSelectionType} />
      <Lookup className="" args={className} selected={selectionType} />
    </div>
  )
}

export default ClassLookup;