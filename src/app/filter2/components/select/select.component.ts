import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {FilterControl} from '../../form/control';

@Component({
  selector: 'app-filter-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterSelectComponent implements OnInit {

  @Input() public filterControl: FilterControl;


  constructor(
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.filterControl.control.parent.valueChanges.subscribe(() => {
      this.cd.markForCheck();
    });
  }

}
