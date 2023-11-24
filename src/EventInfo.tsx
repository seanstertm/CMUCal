import React from "react";
import { Event } from "./Lookup";

type Props = {
  className: string
  eventJson: Event
  key: number
}

function EventInfo(props: Props) {
  return (
    <div key={props.key} className={props.className + " my-1 bg-purple-700 text-white font-bold py-2 px-4 rounded"}>
      {props.eventJson.course_id}: {props.eventJson.course_name}
    </div>
  )
}

export default EventInfo