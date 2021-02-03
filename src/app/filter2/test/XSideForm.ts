import {XFilterForm} from './XFilterForm';
import {Injectable} from '@angular/core';
import {XFilter} from './XFilter';

/**
 * - ui configuration for side form
 * - THIS is manage state of side form
 * - config behaviour of update Filter
 */
@Injectable()
export class XSideFilterForm extends XFilterForm {
  constructor(
    public filter: XFilter
  ) {
    super(filter);
    console.log(`Created Side Filter`);
  }

}
