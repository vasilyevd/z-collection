import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {FilterControl} from '../../form/control';

@Component({
  selector: 'app-filter-date-range',
  templateUrl: './range-date.component.html',
  styleUrls: ['./range-date.component.css']
})
export class FilterRangeDateComponent implements OnInit {

  @Input() public filterControl: FilterControl;

  constructor(
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.filterControl.control.parent.valueChanges.subscribe(() => {
      this.cd.markForCheck();
    });

    console.log(this.filterControl.control);
  }

}
