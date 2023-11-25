import React from "react";
import { useState } from "react";
import { Event } from "./Lookup";
import { removeEvent, usedEvents, addEvent } from "./SelectedEvents";

type Props = {
  className: string
  eventJson: Event
  elemKey: number
}

function EventInfo(props: Props) {

  const [inArray, setInArray] = useState(usedEvents.includes(props.eventJson))

  return (
    <div key={props.elemKey + props.eventJson.resource_type} style={{ backgroundColor: inArray ? "rgb(126, 34, 206)" : "rgb(55, 65, 81)" }} className={props.className + ` my-1 text-white font-bold py-2 px-4 rounded`} onClick={() => { inArray ? removeEvent(props.eventJson) : addEvent(props.eventJson); setInArray(!inArray); }}>
      {props.eventJson.course_id}: {props.eventJson.course_name}
    </div>
  )
}

export default EventInfo