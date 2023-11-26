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
        className="overflow-x-clip bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        value={className}
        onChange={e => setClassName(e.target.value)}
      />
      <TypeSelection className="" selected={selectionType} selectionFunction={setSelectionType} />
      <Lookup className="" args={className} selected={selectionType} />
    </div>
  )
}

export default ClassLookup;