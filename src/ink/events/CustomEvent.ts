import { FederatedEvent } from "./FederatedEvent";

export class CustomEvent extends FederatedEvent {
  constructor(eventName: string, object?: object) {
    super(null);
    this.type = eventName;
    this.detail = object;
  }
}
