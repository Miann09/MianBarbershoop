import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ToastController, IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule, HttpClientModule],
})
export class LoginPage {
  email = '';
  password = '';
  role = 'user'; // Default: user

  constructor(
    private router: Router,
    private http: HttpClient,
    private toastController: ToastController
  ) {}

  async login() {
  const data = {
    aksi: 'login',
    emailOrPhone: this.email,
    password: this.password,
    role: this.role === 'admin' ? 'admin' : 'pengguna'
  };

  this.http.post('https://mianbarber.aplikasi.blog/action.php', data).subscribe(
    async (res: any) => {
      if (res.success) {
        // Simpan data user ke localStorage
        localStorage.setItem('user', JSON.stringify(res.data));

        const isAdmin = this.role === 'admin';
        const message = isAdmin ? 'Login Admin Berhasil' : 'Login Pengguna Berhasil';
        await this.presentToast(message);

        // Arahkan ke tab sesuai role
        const route = isAdmin ? '/tabs/tab3' : '/tabs/tab1';
        this.router.navigateByUrl(route, { replaceUrl: true });
      } else {
        await this.presentToast(res.msg || 'Login gagal. Cek kembali data Anda.');
      }
    },
    async () => {
      await this.presentToast('Terjadi kesalahan koneksi!');
    }
  );
}

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      color: 'dark',
    });
    await toast.present();
  }
}
