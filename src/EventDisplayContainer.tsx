import React from "react";
import { Event } from "./Lookup";
import { usedEvents, confirmedEvents, confirmEvent, unconfirmEvent } from "./SelectedEvents";
import EventOnCalendar from "./EventOnCalendar";

type Props = {
  className: string
  day: number
}

export default class EventDisplayContainer extends React.Component<Props> {

  constructor(props: Props) {
    super(props)
  }

  render() {
    this.forceUpdate()

    let innerHtml = <></>

    usedEvents.forEach((elem) => {
      elem.events.forEach((innerElem, i) => {
        if (this.props.day === innerElem.weekday) {
          innerHtml = <>{innerHtml}<EventOnCalendar className="" bigEvent={elem} specificEvent={innerElem} /></>
        }
      })
    })

    return <div className={this.props.className + " "}>
      {innerHtml}
    </div>
  }
}