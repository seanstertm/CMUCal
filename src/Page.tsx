import React from "react";
import ClassLookup from "./ClassLookup";

function Page() {
  return (
    <div className="flex flex-row gap-2 h-full justify-stretch">
      <ClassLookup className="bg-slate-700 basis-1/4" />
      <div className="basis-3/4 flex flex-col gap-2">
        <div className="text-slate-200 bg-slate-700 basis-3/4">

        </div>
        <div className="text-slate-200 basis-1/3 bg-slate-700">

        </div>
      </div>
    </div>
  )
}

export default Page