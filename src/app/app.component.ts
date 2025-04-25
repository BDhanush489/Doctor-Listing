import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  doctors: any[] = [];
  specialities = ['Neurologist', 'Oncologist', 'Ayurveda', 'Homeopath'];
  selectedSort = '';
  selectedMode = 'in-clinic';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any[]>('https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json')
      .subscribe(data => this.doctors = data);
  }
}