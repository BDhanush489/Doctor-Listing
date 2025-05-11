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

    specialties: { [key: string]: boolean } = {
        'General Physician': false,
        'Ayurveda': false,
        'Homeopath': false,
        'Dentist': false,
        'ENT': false,
        'Psychiatrist': false
    };

    selectedSort = '';
    selectedMode = 'all'; // 'video', 'in-clinic', or 'all'
    searchQuery: string = '';
    selectedConsultation: string = '';
    filtered: any[] = [];

    constructor(private http: HttpClient) { }

    ngOnInit() {
        this.http.get<any[]>('https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json')
            .subscribe(data => {
                this.doctors = data;
            });

        this.filteredDoctors = this.doctors; // initial load
        // this.filtered = this.filteredDoctors; // initial load
    }



    toggleSpecialityFilter(event: Event, spec: string) {
        const input = event.target as HTMLInputElement;
        const isChecked = input.checked;
        if (isChecked) {
            this.selectedSpecialities.push(spec);
            console.log(this.selectedSpecialities);
        }
        else {
            this.selectedSpecialities = this.selectedSpecialities.filter(s => s !== spec);
        }


        this.filtered = this.doctors.filter(doc => {
            const speciality = doc.specialities[0]?.name;
            console.log(speciality);
            if (this.selectedSpecialities.includes(speciality)) {
                return doc;
            }
        });

        this.filteredDoctors = this.filtered; // Update filteredDoctors with the filtered results

        if (this.selectedSpecialities.length === 0) {
            this.filteredDoctors = this.doctors; // Reset to original list if no specialities are selected
        }

    }

    selectedSortOption: string = ''; // 'lowToHigh' or 'highToLow'

    applyFilters() {

        this.filtered = this.filteredDoctors.filter(doc => {
            // console.log(this.selectedConsultation);
            if (this.selectedConsultation === 'Video Consultation' && doc.video_consult === true) {
                return doc;
            }
            else if (this.selectedConsultation === 'In-clinic Consultation' && doc.in_clinic === true) {
                return doc;
            }
            else if (this.selectedConsultation === 'All') {
                return doc;
            }

        });

        this.filteredDoctors = this.filtered; // Update filteredDoctors with the filtered results

    }

    // sortByFeesLowToHigh() {
    //     this.filteredDoctors.forEach((d) => {
    //         if (typeof d.fees === 'string') {
    //             d.fees = parseInt(d.fees.replace(/[^\d]/g, '')); // removes ₹ and any non-digit
    //         }
    //     });

    //     this.filteredDoctors = [...this.doctors].sort((a, b) => a.fees - b.fees);
    //     console.log(this.filteredDoctors.map(doctor => doctor.fees));
    // }
    // sortByFeesHighToLow() {
    //     this.filteredDoctors = [...this.doctors].sort((a, b) => b.fees - a.fees);
    // }

    sortByFeesLowToHigh() {
        this.filteredDoctors = [...this.doctors]
            .map(doc => ({
                ...doc,
                numericFees: typeof doc.fees === 'string' ? parseInt(doc.fees.replace(/[^\d]/g, '')) : doc.fees
            }))
            .sort((a, b) => a.numericFees - b.numericFees)
            .map(doc => ({
                ...doc,
                fees: `₹ ${doc.numericFees}` // restore with rupee symbol
            }));
    }

    sortByFeesHighToLow() {
        this.filteredDoctors = [...this.doctors]
            .map(doc => ({
                ...doc,
                numericFees: typeof doc.fees === 'string' ? parseInt(doc.fees.replace(/[^\d]/g, '')) : doc.fees
            }))
            .sort((a, b) => b.numericFees - a.numericFees)
            .map(doc => ({
                ...doc,
                fees: `₹ ${doc.numericFees}`
            }));
    }


    searchByName(searchTerm: string) {
        const lowerSearch = searchTerm.toLowerCase();
        this.filteredDoctors = this.doctors.filter(doc =>
            doc.name.toLowerCase().includes(lowerSearch)
        );
    }



}
