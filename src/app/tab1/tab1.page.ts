import { Component, OnInit } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule, HttpClientModule, ExploreContainerComponentModule],
})
export class Tab1Page implements OnInit {
  jumlahBookingHariIni = 0;
  jumlahAntrian = 0;
  jumlahPelanggan = 0;

  constructor(
    private router: Router,
    private toastController: ToastController,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.checkLogin();
    this.loadDashboardData();
  }

  ionViewWillEnter() {
    this.loadDashboardData();
  }

  // Cek apakah user sudah login
  checkLogin() {
    const user = localStorage.getItem('user');
    if (!user) {
      this.router.navigateByUrl('/login', { replaceUrl: true });
    }
  }

  // Tampilkan notifikasi
  async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
    });
    await toast.present();
  }

  // Navigasi
  goToAddBooking() {
    this.router.navigate(['/tabs/tab2']);
  }

  goToBookingData() {
    this.router.navigate(['/tabs/tab3']);
  }

  // Logout manual
  logout() {
    localStorage.removeItem('user');
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  // Ambil data dashboard
  async loadDashboardData() {
    try {
      const response: any = await this.http.post('https://mianbarber.aplikasi.blog/action.php', {
        aksi: 'get_booking',
      }).toPromise();

      if (response.success && Array.isArray(response.result)) {
        const today = new Date().toISOString().split('T')[0];
        const semuaBooking = response.result;

        this.jumlahBookingHariIni = semuaBooking.filter((b: any) => b.tanggal === today).length;
        this.jumlahAntrian = semuaBooking.filter((b: any) =>
          ['antri', 'pending', 'menunggu'].includes(b.status)
        ).length;
        this.jumlahPelanggan = new Set(semuaBooking.map((b: any) => b.nama)).size;
      } else {
        this.showToast('Gagal memuat data booking.', 'danger');
      }
    } catch (error) {
      console.error('Dashboard Load Error:', error);
      this.showToast('Terjadi kesalahan saat memuat dashboard.', 'danger');
    }
  }
}
