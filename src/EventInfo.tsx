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

  let innerHtml = <>
    {props.eventJson.course_id}: {props.eventJson.course_name}
    <div className="font-normal">{props.eventJson.events[0].date}: {props.eventJson.events[0].start_time} - {props.eventJson.events[0].end_time}</div>
  </>

  if (props.eventJson.events.length > 1) innerHtml = <>{innerHtml}<div className="font-normal">+ {props.eventJson.events.length - 1} more</div></>

  return (
    <div key={props.elemKey + props.eventJson.resource_type} style={{ backgroundColor: inArray ? "rgb(126, 34, 206)" : "rgb(55, 65, 81)" }} className={props.className + ` my-1 text-white font-bold py-2 px-4 rounded`} onClick={() => { inArray ? removeEvent(props.eventJson) : addEvent(props.eventJson); setInArray(!inArray); }}>
      {innerHtml}
    </div>
  )
}

export default EventInfo