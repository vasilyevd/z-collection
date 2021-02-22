import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {FilterControl} from '../../form/control';

@Component({
  selector: 'app-filter-field-text',
  templateUrl: './filter-text.component.html',
  styleUrls: ['./filter-text.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterTextComponent implements OnInit {

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
