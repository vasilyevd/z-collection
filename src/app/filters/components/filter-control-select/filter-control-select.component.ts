import {Component, Input, OnInit, SkipSelf} from '@angular/core';
import {IAttributeFilter} from '../../interface';
import {ControlContainer, FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'filter-form-control-select',
  templateUrl: './filter-control-select.component.html',
  styleUrls: ['./filter-control-select.component.css'],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: (container: ControlContainer) => container,
      deps: [[new SkipSelf(), ControlContainer]]
    }
  ]
})
export class FilterControlSelectComponent implements OnInit {

  @Input() filter: IAttributeFilter

  private form: FormGroup;

  public formControl: FormControl;

  constructor(
    public controlContainer: ControlContainer
  ) {
    this.form = <FormGroup>this.controlContainer.control;
    this.formControl = new FormControl()
  }

  ngOnInit(): void {
    this.form.addControl(this.filter.name, this.formControl);
    this.formControl.setValue(this.filter.getValue())
  }

  getOptions() {
    return this.filter.getEnum();
  }

  changeSelected(e) {
    console.log('FilterControlSelectComponent:changeSelected', e);
    console.log(e.target.value);
    console.log(this.formControl.value);
  }

}
