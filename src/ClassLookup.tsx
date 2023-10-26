import React from "react";
import { useState } from "react";

type Props = {
  className: string
}

function ClassLookup(props: Props) {

  const[className, setClassName] = useState('')

  return(
    <div className={props.className + " flex flex-col gap-2"}>
      <input
        className=""
        value={className}
        onChange={e => setClassName(e.target.value)}
      />
      <h1 className="text-slate-200">
        {className !== "" && "Daniel scape course catalog for: " + className}
      </h1>
    </div>
  )
}

export default ClassLookup;