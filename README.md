# ☁️ Weather Dashboard

Aplikasi dashboard cuaca modern berbasis web yang menampilkan informasi cuaca real-time dan ramalan cuaca 5 hari ke depan. Aplikasi ini dibangun menggunakan **Vanilla JavaScript (Fetch API)** dan desain antarmuka **Glassmorphism** yang responsif.

Proyek ini dibuat untuk memenuhi Tugas Akhir Mata Kuliah Pemrograman Web.

<img width="1400" height="550" alt="image" src="https://github.com/user-attachments/assets/5287d064-2c34-4bdc-837c-2621663122ab" />


<img width="1400" height="550" alt="image" src="https://github.com/user-attachments/assets/d464fb08-bc7b-4db2-8b3e-5a3c43be3e9f" />


---

## ✨ Fitur Utama

* **Real-time Weather Data**: Menampilkan suhu, kelembaban, kecepatan angin, jarak pandang, dan kondisi cuaca terkini.
* **5-Day Forecast**: Ramalan cuaca harian untuk 5 hari ke depan.
* **Glassmorphism UI**: Desain antarmuka modern dengan efek kaca (blur) dan transparan.
* **Dark & Light Mode**: Tema tampilan yang dapat disesuaikan (Otomatis menyesuaikan kontras teks).
* **City Search & Auto-complete**: Pencarian kota di seluruh dunia dengan saran otomatis.
* **Favorites System**: Simpan kota favorit ke Sidebar untuk akses cepat (menggunakan LocalStorage).
* **Unit Conversion**: Konversi satuan suhu (Celsius/Fahrenheit) dan kecepatan angin (km/h / mph).
* **Full Localization**: Seluruh data dan antarmuka menggunakan Bahasa Indonesia.

## 🛠️ Teknologi yang Digunakan

* **HTML5**: Struktur semantik.
* **CSS3**: Styling utama, CSS Variables, dan efek Glassmorphism.
* **Bootstrap 5**: Grid system dan komponen responsif (Switch, Icons).
* **JavaScript (ES6+)**: Logika aplikasi, DOM Manipulation, Async/Await.
* **Fetch API**: Mengambil data dari OpenWeatherMap.
* **Local Storage**: Menyimpan data kota favorit di browser pengguna.

## 📂 Struktur Folder

```text
/weather-dashboard
├── index.html      # Struktur utama halaman
├── style.css       # Styling custom & tema (Dark/Light)
├── script.js       # Logika Fetch API & DOM
└── README.md       # Dokumentasi proyek
