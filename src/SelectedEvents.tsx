import { Event } from "./Lookup";

export const usedEvents: Event[] = [];
export const confirmedEvents: Event[] = [];

export function addEvent(event: Event): void {
  usedEvents.push(event);
}

export function removeEvent(event: Event): void {
  let index: number = usedEvents.indexOf(event);
  usedEvents.splice(index, 1);
}

export function confirmEvent(event: Event): void {
  confirmedEvents.push(event);
}

export function unconfirmEvent(event: Event): void {
  let index: number = confirmedEvents.indexOf(event);
  confirmedEvents.splice(index, 1);
}