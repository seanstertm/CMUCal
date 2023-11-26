import React from "react";
import { Event } from "./Lookup";
import { classicNameResolver } from "typescript";

type Props = {
  className: string
  bigEvent: Event
  specificEvent:
  {
    weekday: number;
    date: string;
    start_time: string;
    end_time: string;
    location: string;
  }
}

function EventOnCalendar(props: Props) {
  return (
    <div className={props.className + " text-xs bg-purple-700/[.5] text-white font-bold py-2 px-4 rounded"}>
      {props.bigEvent.course_id}: {props.bigEvent.course_name}
      <div className="font-normal">{props.specificEvent.start_time} - {props.specificEvent.end_time}</div>
    </div>
  )
}

export default EventOnCalendar;