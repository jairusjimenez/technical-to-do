import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { HttpDataService } from './http-data.service';
import { Todo } from "../models/todo";

describe('HttpDataService', () => {
  let service: HttpDataService;
  let httpTestingController: HttpTestingController;

  const mockData = [
    {
      "id": 1,
      "description": "Buy groceries"
    },
    {
      "id": 2,
      "description": "Walk dog"
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    httpTestingController = TestBed.inject(HttpTestingController);

    service = TestBed.inject(HttpDataService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });
});
