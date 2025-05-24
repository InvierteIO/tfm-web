import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfrastructureInstallationComponent } from './infrastructure-installation.component';

describe('InfrastructureInstallationComponent', () => {
  let component: InfrastructureInstallationComponent;
  let fixture: ComponentFixture<InfrastructureInstallationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfrastructureInstallationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfrastructureInstallationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
