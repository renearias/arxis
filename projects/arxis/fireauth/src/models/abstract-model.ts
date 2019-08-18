import { IKeyable } from '../interfaces/keyable';
export class AbstractModel implements IKeyable {
  /**
   * Document ID.
   */
  key?: string;
  constructor(fields: any) {
    // Quick and dirty extend/assign fields to this model
    for (const f in fields) {
      if (fields[f]) {
        this[f] = fields[f];
      }
    }
  }
}
