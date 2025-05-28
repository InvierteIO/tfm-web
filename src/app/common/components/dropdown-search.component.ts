import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgbDropdown, NgbDropdownMenu, NgbDropdownItem, NgbDropdownToggle} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-dropdown-search',
  standalone: true,
  imports: [
    NgbDropdown,
    NgbDropdownMenu,
    NgbDropdownItem,
    NgbDropdownToggle
  ],
  templateUrl: './dropdown-search.component.html',
  styleUrl: './dropdown-search.component.css'
})
export class DropdownSearchComponent {
  @Input() options: string[] = [];
  @Input() selectedFilter: string = '';
  @Input() dropdownId: string = 'mn-search-filter';

  @Output() selectedFilterChange = new EventEmitter<string>();

  setFilterDropdown(filter: string): void {
    this.selectedFilter = filter;
    this.selectedFilterChange.emit(filter);
  }
}
