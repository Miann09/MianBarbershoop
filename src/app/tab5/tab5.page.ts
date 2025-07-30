import { Component, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tab5',
  standalone: true,
  imports: [IonicModule, CommonModule, HttpClientModule],
  templateUrl: './tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
})
export class Tab5Page {
  fotoGaleri = [
    { url: 'assets/gaya1.jpg', caption: 'Fade Style by Andi' },
    { url: 'assets/gaya2.jpg', caption: 'Pompadour Premium' },
    { url: 'assets/gaya3.jpg', caption: 'Clean Undercut by Ucok' },
    { url: 'assets/gaya5.jpg', caption: 'Classic Gentle Cut' },
    { url: 'assets/gaya6.jpg', caption: 'Classic Gentle Cut' },
  ];

  ulasanList: any[] = [];
  private http = inject(HttpClient);
  private baseUrl = 'https://mianbarber.aplikasi.blog/action.php'; // ganti sesuai server

  constructor() {
    this.getUlasan();
  }

  getUlasan() {
    this.http.post<any>(this.baseUrl, { aksi: 'get_ulasan' }).subscribe(res => {
      if (res.success) {
        this.ulasanList = res.result;
      } else {
        console.error('Gagal mengambil ulasan:', res.msg);
      }
    });
  }
}
