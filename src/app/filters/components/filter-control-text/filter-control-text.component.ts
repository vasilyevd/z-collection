import {Component, Input, OnInit, SkipSelf} from '@angular/core';
import {IAttributeFilter} from '../../interface';
import {ControlContainer, FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'filter-form-control-text',
  templateUrl: './filter-control-text.component.html',
  styleUrls: ['./filter-control-text.component.css'],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: (container: ControlContainer) => container,
      deps: [[new SkipSelf(), ControlContainer]]
    }
  ]
})
export class FilterControlTextComponent implements OnInit {

  @Input() filter: IAttributeFilter

  private form: FormGroup;

  public formControl: FormControl;

  constructor(
    public controlContainer: ControlContainer
  ) {
    console.log('FILTER-CONTROL-TEXT-COMPONENT-CONSTRUCTOR');
    this.form = <FormGroup>this.controlContainer.control;
    console.log('this.controlContainer');
    console.log(this.controlContainer);
    this.formControl = new FormControl()
  }

  ngOnInit(): void {
    this.form.addControl(this.filter.name, this.formControl);
    this.formControl.setValue(this.filter.getValue())
  }

}
