import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
  ],
})
export class Tab2Page {

  // Form Fields
  nama: string = '';
  telepon: string = '';
  email: string = '';
  barber: string = '';
  paket: string = '';
  tanggal: string = '';
  jam: string = '';
  catatan: string = '';
  ingatkanWA: boolean = false;
  rating: number = 3;

  // State
  loading: boolean = false;

  constructor(
    private router: Router,
    private toastController: ToastController
  ) {}

  /**
   * Menyimpan booking ke server
   */
  async addBooking() {
    if (!this.nama || !this.telepon || !this.tanggal || !this.jam || !this.paket || !this.barber) {
      this.showToast('Lengkapi semua data wajib.');
      return;
    }

    const body = {
      aksi: 'add_booking',
      nama: this.nama,
      telepon: this.telepon,
      email: this.email,
      barber: this.barber,
      paket: this.paket,
      tanggal: this.tanggal,
      jam: this.jam,
      catatan: this.catatan,
      ingatkanWA: this.ingatkanWA,
      rating: this.rating,
    };

    this.loading = true;

    try {
      const response: any = await fetch('https://mianbarber.aplikasi.blog/action.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }).then(res => res.json());

      if (response.success) {
        this.showToast('Booking berhasil disimpan!', 'success');
        this.clearForm();
        this.router.navigate(['/tabs/tab1']);
      } else {
        this.showToast(response.msg || 'Gagal menyimpan booking.');
      }
    } catch (error) {
      console.error('Error saat booking:', error);
      this.showToast('Gagal terhubung ke server.');
    } finally {
      this.loading = false;
    }
  }

  /**
   * Membersihkan form setelah submit
   */
  clearForm() {
    this.nama = '';
    this.telepon = '';
    this.email = '';
    this.barber = '';
    this.paket = '';
    this.tanggal = '';
    this.jam = '';
    this.catatan = '';
    this.ingatkanWA = false;
    this.rating = 3;
  }

  /**
   * Menampilkan toast pesan
   */
  async showToast(message: string, color: string = 'danger') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
    });
    toast.present();
  }

  /**
   * Navigasi manual ke dashboard tab1
   */
  goToDashboard() {
    this.router.navigate(['/tabs/tab1']);
  }
}
