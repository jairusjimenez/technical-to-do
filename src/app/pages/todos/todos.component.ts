import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { HttpDataService } from 'src/app/services/http-data.service';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import * as _ from 'lodash';
import { NgForm } from '@angular/forms';
import { Todo } from 'src/app/models/todo';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css']
})
export class TodosComponent implements OnInit {
  @ViewChild('todoForm', { static: false })
  todoForm: NgForm;

  todoData: Todo;

  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['id', 'description', 'actions'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  isEditMode = false;

  constructor(private httpDataService: HttpDataService) {
    this.todoData = {} as Todo;
  }

  ngOnInit(): void {
    // Initializing Datatable pagination
    this.dataSource.paginator = this.paginator;

    // Fetch All To Do's on Page load
    this.getTodos();
  }

  getTodos() {
    // Populating data source using Get List
    this.httpDataService.getList().subscribe((response: any) => {
      this.dataSource.data = response;
    });
  }

  editTodo(element) {
    this.todoData = _.cloneDeep(element);
    this.isEditMode = true;
  }

  cancelTodo() {
    this.isEditMode = false;
    this.todoForm.resetForm();
  }

  deleteTodo(id) {
    this.httpDataService.deleteItem(id).subscribe((response: any) => {

      // Approach #1 to update datatable data on local itself without fetching new data from server
      this.dataSource.data = this.dataSource.data.filter((o: Todo) => {
        return o.id !== id ? o : false;
      })

      console.log(this.dataSource.data);

      // Approach #2 to re-call getAllTodos() to fetch updated data
      // this.getAllTodos()
    });
  }

  addTodo() {
    this.httpDataService.createItem(this.todoData).subscribe((response: any) => {
      this.dataSource.data.push({ ...response })
      this.dataSource.data = this.dataSource.data.map(o => {
        return o;
      })
    });
  }

  updateTodo() {
    this.httpDataService.updateItem(this.todoData.id, this.todoData).subscribe((response: any) => {

      // Approach #1 to update datatable data on local itself without fetching new data from server
      this.dataSource.data = this.dataSource.data.map((o: Todo) => {
        if (o.id === response.id) {
          o = response;
        }
        return o;
      })

      // Approach #2 to re-call getAllToDos() to fetch updated data
      // this.getAllToDos()

      this.cancelTodo()

    });
  }

  onSubmit() {
    if (this.todoForm.form.valid) {
      if (this.isEditMode)
        this.updateTodo()
      else
        this.addTodo();
    } else {
      console.log('Enter valid data!');
    }
  }
}
