import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { EmployeeService } from "../../services/employee.service";

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent implements OnInit {
  form: FormGroup;
  photo: File | null = null;
  data: any;
  action: 'add' | 'update' = 'add';
  departments: any[] = [];
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    public activeModal: NgbActiveModal
  ) {
    this.form = this.fb.group({
      id: [''],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      age: ['', [Validators.required, Validators.min(18)]],
      department: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    if (this.action === 'update' && this.data) {
      this.form.patchValue(this.data);
    }
  }

  actionMade() {
    if (this.form.invalid) {
      return;
    }

    if (this.action === 'add') {
      this.add();
    } else {
      this.update();
    }
  }

  add() {
    this.isLoading = true;
    const employeeData = {
      firstName: this.form.value.firstName,
      lastName: this.form.value.lastName,
      email: this.form.value.email,
      age: this.form.value.age,
      department: this.form.value.department
    };

    this.employeeService.addEmployee(employeeData, this.photo).subscribe({
      next: (id) => {
        this.isLoading = false;
        this.activeModal.close(id);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error adding employee:', err);
      }
    });
  }

  update() {
    this.isLoading = true;
    const employeeData = {
      firstName: this.form.value.firstName,
      lastName: this.form.value.lastName,
      email: this.form.value.email,
      age: this.form.value.age,
      department: this.form.value.department
    };

    this.employeeService.updateEmployee(this.form.value.id,employeeData, this.photo).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log(response.body);
        this.activeModal.close('updated');
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error updating employee:', err);
      }
    });
  }

  closeModal() {
    this.activeModal.dismiss();
  }

  fileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.photo = file;
    }
  }
}
