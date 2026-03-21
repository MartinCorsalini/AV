import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvDetail } from './av-detail';

describe('AvDetail', () => {
  let component: AvDetail;
  let fixture: ComponentFixture<AvDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
