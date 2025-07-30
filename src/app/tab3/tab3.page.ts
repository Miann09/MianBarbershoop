import { Component, OnInit } from '@angular/core';
import { ToastController, IonicModule, Platform } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    ExploreContainerComponentModule,
  ],
})
export class Tab3Page implements OnInit {
  bookings: any[] = [];
  filteredBookings: any[] = [];
  searchTerm: string = '';
  isDarkMode: boolean = false;
  loading: boolean = false;

  constructor(
    private toastController: ToastController,
    private http: HttpClient,
    private platform: Platform,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadBookings();
    this.setupDarkModeAuto();
  }

  // Dark Mode Otomatis
  setupDarkModeAuto() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    this.toggleDarkTheme(prefersDark.matches);
    prefersDark.addEventListener('change', (e) => {
      this.toggleDarkTheme(e.matches);
    });
  }

  toggleDarkTheme(shouldAdd: boolean) {
    document.body.classList.toggle('dark', shouldAdd);
    this.isDarkMode = shouldAdd;
  }

  // Ambil Data Booking
  async loadBookings(event?: any) {
    this.loading = true;
    try {
      const response: any = await this.http
        .post('https://mianbarber.aplikasi.blog/action.php', { aksi: 'get_booking' })
        .toPromise();

      if (response.success) {
        this.bookings = response.result;
        this.filteredBookings = [...this.bookings];
      } else {
        this.showToast(response.msg || 'Gagal memuat data booking.', 'danger');
      }

      if (event) event.target.complete();
    } catch (error) {
      console.error('Load Error:', error);
      this.showToast('Gagal terhubung ke server.', 'danger');
      if (event) event.target.complete();
    } finally {
      this.loading = false;
    }
  }

  // Filter pencarian
  filterBookings() {
    const term = this.searchTerm.toLowerCase();
    this.filteredBookings = this.bookings.filter(b =>
      (b.nama && b.nama.toLowerCase().includes(term)) ||
      (b.paket && b.paket.toLowerCase().includes(term)) ||
      (b.telepon && b.telepon.includes(term))
    );
  }

  // ACC Booking
  async accBooking(booking: any) {
    const confirm = window.confirm('Yakin ingin ACC booking ini?');
    if (confirm) {
      await this.updateBookingStatus(booking.id_booking, 'diterima');
    }
  }

  // Tolak Booking
  async tolakBooking(booking: any) {
    const confirm = window.confirm('Yakin ingin menolak booking ini?');
    if (confirm) {
      await this.updateBookingStatus(booking.id_booking, 'ditolak');
    }
  }

  // Update Status Booking
  async updateBookingStatus(id: number, status: string) {
    if (!id || !status) {
      this.showToast('ID atau status tidak valid.', 'danger');
      return;
    }

    try {
      const response: any = await this.http.post('https://mianbarber.aplikasi.blog/action.php', {
        aksi: 'update_status',
        id,
        status
      }).toPromise();

      if (response.success) {
        this.showToast(`Status booking diubah menjadi '${status}'.`, 'success');
        this.loadBookings();
      } else {
        this.showToast(response.msg || 'Gagal mengubah status booking.', 'danger');
      }
    } catch (error) {
      console.error('Update Status Error:', error);
      this.showToast('Terjadi kesalahan saat memperbarui status.', 'danger');
    }
  }

  // Toast
  async showToast(message: string, color: string = 'dark') {
    const toast = await this.toastController.create({
      message,
      duration: 2500,
      color,
    });
    toast.present();
  }

  // Refresh manual
  doRefresh(event: any) {
    this.loadBookings(event);
  }

  // Navigasi antar halaman
  goToDashboard() {
    this.router.navigate(['/tabs/tab1']);
  }

  goToBooking() {
    this.router.navigate(['/tabs/tab2']);
  }

  // Logout
  logout() {
    localStorage.removeItem('user');
    this.router.navigateByUrl('/login', { replaceUrl: true });
    this.showToast('Berhasil logout.', 'medium');
  }

  // Export ke Excel
  exportToExcel() {
    const worksheet = XLSX.utils.json_to_sheet(this.filteredBookings);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Bookings');
    XLSX.writeFile(workbook, 'Data_Booking.xlsx');
    this.showToast('Data berhasil diekspor ke Excel.', 'success');
  }

  // Export ke PDF
  exportToPDF() {
    const doc = new jsPDF();
    const headers = [['Nama', 'Tanggal', 'Jam', 'Paket', 'Barber', 'Rating', 'Telp', 'Email', 'WA', 'Catatan', 'Status']];
    const data = this.filteredBookings.map(b => [
      b.nama,
      b.tanggal,
      b.jam,
      b.paket,
      b.barber || '-',
      b.rating || '-',
      b.telepon,
      b.email || '-',
      b.whatsapp || '-',
      b.catatan || '-',
      b.status || '-'
    ]);

    autoTable(doc, {
      head: headers,
      body: data,
      styles: { fontSize: 9 },
      margin: { top: 20 }
    });

    doc.save('Data_Booking.pdf');
    this.showToast('Data berhasil diekspor ke PDF.', 'success');
  }
}
