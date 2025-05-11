import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    doctors: any[] = [];
    filteredDoctors: any[] = [];
    selectedSpecialities: string[] = [];

    specialities = ['Neurologist', 'Oncologist', 'Ayurveda', 'Homeopath', 'Dentist']; // include Dentist
    selectedSort = '';
    selectedMode = 'all'; // 'video', 'in-clinic', or 'all'
    searchQuery: string = '';
    selectedConsultation: string = '';

    constructor(private http: HttpClient) { }

    ngOnInit() {
        this.http.get<any[]>('https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json')
            .subscribe(data => {
                this.doctors = data;

            });

        this.filteredDoctors = this.doctors; // initial load
    }



    toggleSpecialityFilter(spec: string) {
        this.filteredDoctors = this.doctors.filter(doc => {
            console.log(doc.specialities[0]?.name);
            return doc.specialities[0]?.name === spec;
        });

        console.log(spec);

    }

    selectedSortOption: string = ''; // 'lowToHigh' or 'highToLow'

    applyFilters(spec: string) {

        console.log(spec);

    }

    sortByFeesLowToHigh() {
        this.filteredDoctors.forEach((d) => {
            if (typeof d.fees === 'string') {
                d.fees = parseInt(d.fees.replace(/[^\d]/g, '')); // removes ₹ and any non-digit
            }
        });

        this.filteredDoctors = [...this.doctors].sort((a, b) => a.fees - b.fees);
        console.log(this.filteredDoctors.map(doctor => doctor.fees));
    }
    sortByFeesHighToLow() {
        this.filteredDoctors = [...this.doctors].sort((a, b) => b.fees - a.fees);
    }


    searchByName(searchTerm: string) {
        const lowerSearch = searchTerm.toLowerCase();
        this.filteredDoctors = this.doctors.filter(doc =>
            doc.name.toLowerCase().includes(lowerSearch)
        );
    }



}
