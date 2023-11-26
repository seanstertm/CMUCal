import React from "react";
import { useState } from "react";
import ClassLookup from "./ClassLookup";
import CalendarParent from "./CalendarParent";

function Page() {
  return (
    <div className="flex flex-row gap-2 h-full justify-stretch">
      <ClassLookup className="bg-slate-700 basis-1/4" />
      <div className="basis-3/4 flex flex-col gap-2">
        <div className="text-slate-200 bg-slate-700 basis-11/12">
          <CalendarParent className="" />
        </div>
        <div className="text-slate-200 basis-1/12 bg-slate-700">

        </div>
      </div>
    </div>
  )
}

export default Page