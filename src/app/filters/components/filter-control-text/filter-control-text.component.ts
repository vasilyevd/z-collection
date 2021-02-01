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
    // this.formControl = new FormControl()
  }

  id(){
    return this.filter.name;
  }

  ngOnInit(): void {
    // define used FormControl
    if(!this.form.contains(this.filter.name)) {
      this.formControl = new FormControl();
      this.formControl.setValue(this.filter.getValue());
      this.form.registerControl(this.filter.name, this.formControl);
    } else {
      console.log('use already form control');
      this.formControl = this.form.get(this.id()) as FormControl;
    }


    // update AttributeFilter model on change
    this.formControl.valueChanges.subscribe(value => {
      console.log('set filter value from text');
        this.filter.setValue(value);
    })

    // subscribe to outer changes of filter
    // - change control value without emit events
    this.filter.changes.subscribe(value => {
      console.log('text got change from filter', value);
      // this.formControl.setValue(value, {emitEvent: false});
      this.formControl.setValue(value);
    })
  }

}
