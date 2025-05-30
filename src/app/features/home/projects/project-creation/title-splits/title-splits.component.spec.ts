import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TitleSplitsComponent } from './title-splits.component';

describe('TitleSplitsComponent', () => {
  let component: TitleSplitsComponent;
  let fixture: ComponentFixture<TitleSplitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TitleSplitsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TitleSplitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
