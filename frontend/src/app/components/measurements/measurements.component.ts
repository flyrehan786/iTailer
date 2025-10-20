import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-measurements',
  templateUrl: './measurements.component.html',
  styleUrls: ['./measurements.component.css']
})
export class MeasurementsComponent implements OnInit {
  customerId!: number;
  customer: any = null;
  measurements: any[] = [];
  showModal = false;
  isEditMode = false;
  loading = true;
  error = '';
  successMessage = '';

  measurementForm: any = {
    id: null,
    customer_id: null,
    measurement_type: 'shirt',
    chest: null,
    waist: null,
    shoulder: null,
    sleeve_length: null,
    shirt_length: null,
    neck: null,
    pant_length: null,
    pant_waist: null,
    hip: null,
    thigh: null,
    knee: null,
    bottom: null,
    notes: ''
  };

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.customerId = Number(this.route.snapshot.paramMap.get('customerId'));
    this.loadCustomer();
    this.loadMeasurements();
  }

  loadCustomer(): void {
    this.apiService.getCustomerById(this.customerId).subscribe({
      next: (response) => {
        if (response.success) {
          this.customer = response.data;
        }
      },
      error: (err) => {
        this.error = 'Failed to load customer details';
      }
    });
  }

  loadMeasurements(): void {
    this.loading = true;
    this.apiService.getMeasurementsByCustomer(this.customerId).subscribe({
      next: (response) => {
        if (response.success) {
          this.measurements = response.data;
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load measurements';
        this.loading = false;
      }
    });
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.resetForm();
    this.measurementForm.customer_id = this.customerId;
    this.showModal = true;
  }

  openEditModal(measurement: any): void {
    this.isEditMode = true;
    this.measurementForm = { ...measurement };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.resetForm();
  }

  resetForm(): void {
    this.measurementForm = {
      id: null,
      customer_id: this.customerId,
      measurement_type: 'shirt',
      chest: null,
      waist: null,
      shoulder: null,
      sleeve_length: null,
      shirt_length: null,
      neck: null,
      pant_length: null,
      pant_waist: null,
      hip: null,
      thigh: null,
      knee: null,
      bottom: null,
      notes: ''
    };
  }

  saveMeasurement(): void {
    // Clean the form data - only send relevant fields based on measurement type
    const cleanedData: any = {
      customer_id: this.measurementForm.customer_id,
      measurement_type: this.measurementForm.measurement_type,
      notes: this.measurementForm.notes || ''
    };

    // Add shirt/kurta/suit measurements
    if (this.isShirtType()) {
      cleanedData.chest = this.measurementForm.chest || null;
      cleanedData.waist = this.measurementForm.waist || null;
      cleanedData.shoulder = this.measurementForm.shoulder || null;
      cleanedData.sleeve_length = this.measurementForm.sleeve_length || null;
      cleanedData.shirt_length = this.measurementForm.shirt_length || null;
      cleanedData.neck = this.measurementForm.neck || null;
    }

    // Add pant/suit measurements
    if (this.isPantType()) {
      cleanedData.pant_length = this.measurementForm.pant_length || null;
      cleanedData.pant_waist = this.measurementForm.pant_waist || null;
      cleanedData.hip = this.measurementForm.hip || null;
      cleanedData.thigh = this.measurementForm.thigh || null;
      cleanedData.knee = this.measurementForm.knee || null;
      cleanedData.bottom = this.measurementForm.bottom || null;
    }

    if (this.isEditMode) {
      cleanedData.id = this.measurementForm.id;
      this.apiService.updateMeasurement(this.measurementForm.id!, cleanedData).subscribe({
        next: (response) => {
          if (response.success) {
            this.successMessage = 'Measurement updated successfully';
            this.loadMeasurements();
            this.closeModal();
            setTimeout(() => this.successMessage = '', 3000);
          }
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to update measurement';
          console.error('Update error:', err);
        }
      });
    } else {
      this.apiService.createMeasurement(cleanedData).subscribe({
        next: (response) => {
          if (response.success) {
            this.successMessage = 'Measurement created successfully';
            this.loadMeasurements();
            this.closeModal();
            setTimeout(() => this.successMessage = '', 3000);
          }
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to create measurement';
          console.error('Create error:', err);
        }
      });
    }
  }

  deleteMeasurement(id: number): void {
    if (confirm('Are you sure you want to delete this measurement?')) {
      this.apiService.deleteMeasurement(id).subscribe({
        next: (response) => {
          if (response.success) {
            this.successMessage = 'Measurement deleted successfully';
            this.loadMeasurements();
            setTimeout(() => this.successMessage = '', 3000);
          }
        },
        error: (err) => {
          this.error = 'Failed to delete measurement';
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/customers']);
  }

  isShirtType(): boolean {
    return this.measurementForm.measurement_type === 'shirt' || 
           this.measurementForm.measurement_type === 'kurta' ||
           this.measurementForm.measurement_type === 'suit';
  }

  isPantType(): boolean {
    return this.measurementForm.measurement_type === 'pant' ||
           this.measurementForm.measurement_type === 'suit';
  }
}
