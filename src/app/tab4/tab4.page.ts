import { Component, inject } from '@angular/core';
import { IonicModule, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-tab4',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HttpClientModule],
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page {
  jamBuka = '';
  jamTutup = '';
  hariLibur = '';

  private http = inject(HttpClient);
  private baseUrl = 'https://mianbarber.aplikasi.blog/action.php'; // Ganti sesuai alamat server kamu

  constructor() {
    this.getPengaturan();
  }

  getPengaturan() {
    this.http.post<any>(this.baseUrl, { aksi: 'get_settings' }).subscribe(
      res => {
        if (res.success && res.result) {
          this.jamBuka = res.result.jam_buka;
          this.jamTutup = res.result.jam_tutup;
          this.hariLibur = res.result.hari_libur;
        }
      },
      err => {
        console.error('Gagal ambil pengaturan:', err);
      }
    );
  }

  simpanPengaturan() {
    const body = {
      aksi: 'save_settings',
      jam_buka: this.jamBuka,
      jam_tutup: this.jamTutup,
      hari_libur: this.hariLibur,
    };

    this.http.post<any>(this.baseUrl, body).subscribe(
      res => {
        if (res.success) {
          alert('Pengaturan berhasil disimpan.');
        } else {
          alert('Gagal menyimpan: ' + res.msg);
        }
      },
      err => {
        console.error('Gagal simpan pengaturan:', err);
        alert('Terjadi kesalahan saat menyimpan.');
      }
    );
  }
}
