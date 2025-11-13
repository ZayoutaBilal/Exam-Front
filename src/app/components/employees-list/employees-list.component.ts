import {Component, OnInit} from '@angular/core';
import {Employee} from "../../models/employee/employee.module";
import {Departement} from "../../models/departement/departement.module";
import {EmployeeService} from "../../services/employee.service";
import {DomSanitizer} from "@angular/platform-browser";
import {DepartementService} from "../../services/departement.service";
import {EmployeeFormComponent} from "../employee-form/employee-form.component";
import {ConfirmDialogComponent} from "../confirm-dialog/confirm-dialog.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";


@Component({
  selector: 'app-employees-list',
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.css']
})

export class EmployeesListComponent implements OnInit {
  employees: Employee[] = [];
  departments: Departement[] = [];
  selectedDepartment: number | undefined = undefined;
  loading = true;
  error: string | null = null;


  constructor(
    private employeeService: EmployeeService,
    private departmentService: DepartementService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.error = null;
    this.departmentService.getAllDepartments().subscribe({
      next: (response) => {
        this.departments = response.body ?? [];
        if(this.departments.length > 0) {
          this.selectedDepartment = this.departments[0].id;
          this.loadEmployees();
        }
      },
      error: (err) => {
        this.handleError('Failed to load departments', err);
      }
    });
  }

  loadEmployees(): void {
    if(this.selectedDepartment){
      this.employeeService.getAllEmployeesByDepartmentId(this.selectedDepartment).subscribe({
        next: (response) => {
          this.employees = response.body ?? [];
          console.log(response.body)
          this.loading = false;
        },
        error: (err) => {
          this.handleError('Failed to load employees', err);
        }
      });
    }
  }


  formatDate(date: string | Date): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  }

  openEmployeeForm(employee?: Employee): void {
    const modalRef = this.modalService.open(EmployeeFormComponent, { size: 'lg' });

    modalRef.componentInstance.data = employee ? { ...employee } : null;
    modalRef.componentInstance.action = employee ? 'update' : 'add';
    modalRef.componentInstance.departments = this.departments;

    modalRef.result.then((result: any) => {
      if (result === 'updated' || typeof result === 'number') {
        this.loadEmployees();
      }
    }).catch((error) => {
    });
  }

  deleteEmployee(id: number): void {
    const modalRef = this.modalService.open(ConfirmDialogComponent);
    modalRef.componentInstance.title = 'Confirm Delete';
    modalRef.componentInstance.message = 'Are you sure you want to delete this employee?';

    modalRef.result.then((result: string) => {
      if (result === 'confirm') {
        this.employeeService.deleteEmployee(id).subscribe({
          next: () => {
            this.employees = this.employees.filter(emp => emp.id !== id);
          },
          error: (err) => {
            this.handleError('Failed to delete employee', err);
          }
        });
      }
    }).catch(() => {});
  }

  deleteEmployeesOver60(): void {
    const modalRef = this.modalService.open(ConfirmDialogComponent);
    modalRef.componentInstance.title = 'Confirm Bulk Delete';
    modalRef.componentInstance.message = 'Are you sure you want to delete all employees over 60?';

    modalRef.result.then((result: string) => {
      if (result === 'confirm') {
        this.employeeService.deleteEmployeesOver60().subscribe({
          next: (response) => {
            console.log(response.body);
            this.employees = this.employees.filter(emp => emp.age < 60);
          },
          error: (err) => {
            this.handleError('Failed to delete employees', err);
          }
        });
      }
    }).catch(() => {});
  }

  private handleError(message: string, error: any): void {
    console.error(message, error);
    this.error = message;
    this.loading = false;
  }
}
