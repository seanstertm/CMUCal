import React from "react";
import EventDisplayContainer from "./EventDisplayContainer";

type Props = {
  className: string
}

function CalendarParent(props: Props) {
  return (
    <div className={props.className + " flex flex-row justif-stretch h-full"}>
      {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day, i) => {
        return (<div key={i} className="text-black font-bold py-2 px-4 rounded m-1 bg-gray-500 basis-full text-center">
          {day}
          <EventDisplayContainer className="" day={i === 0 ? 7 : i} />
        </div>)
      })}
    </div>
  )
}

export default CalendarParent;