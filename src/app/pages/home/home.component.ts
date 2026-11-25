import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Units } from '../../models/weather.model';
import { SearchHistoryService } from '../../services/search-history.service';

function notBlank(control: AbstractControl<string>): ValidationErrors | null {
  return control.value.trim().length > 0 ? null : { blank: true };
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);
  readonly history = inject(SearchHistoryService);

  readonly popular = ['Mumbai', 'Pune', 'Delhi', 'Bengaluru', 'London', 'New York'];

  readonly form = this.fb.group({
    city: [
      '',
      [
        Validators.required,
        notBlank,
        Validators.minLength(2),
        Validators.pattern(/^[\p{L}\s.'-]+$/u),
      ],
    ],
    units: this.fb.control<Units>('metric'),
  });

  get city() {
    return this.form.controls.city;
  }

  get units(): Units {
    return this.form.controls.units.value;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { city, units } = this.form.getRawValue();
    this.router.navigate(['/weather', city.trim()], { queryParams: { units } });
  }
}
