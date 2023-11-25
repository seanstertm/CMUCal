import React from "react";
import SIJSON from "./jsons/si.json";
import DIJSON from "./jsons/drop_in.json";
import PTJSON from "./jsons/peer_tutoring.json";
import { SelectionType } from "./ClassLookup";
import EventInfo from "./EventInfo";

export type Event = {
  resource_type: string
  course_id: string
  course_name: string
  professor: string
  instructor: string
  events: {
    weekday: number
    date: string
    start_time: string
    end_time: string
    location: string
  }[]
}

export type Json = {
  payload: Event[]
}

type Props = {
  className: string
  args: string
  selected: SelectionType
}

function Lookup(props: Props) {
  let json: Json = { payload: null };
  json.payload = SIJSON;
  if (props.selected === SelectionType.DI) json.payload = DIJSON;
  if (props.selected === SelectionType.PT) json.payload = PTJSON;

  return (
    <div className={props.className + " flex flex-col overflow-y-scroll"}>
      {json.payload.map((elem, i) => {
        if (!elem.course_name.includes(props.args) && !elem.course_id.includes(props.args)) return undefined
        return (<EventInfo className="" eventJson={elem} elemKey={i} key={i + elem.resource_type} />)
      })}
    </div>
  )
}

export default Lookup;