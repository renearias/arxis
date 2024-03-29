import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImageProcessorComponent } from './image-processor.component';

describe('ImageProcessorComponent', () => {
  let component: ImageProcessorComponent;
  let fixture: ComponentFixture<ImageProcessorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageProcessorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageProcessorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
