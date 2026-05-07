<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard</title>
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <link rel="stylesheet" href="style.css">
</head>
<body style="display: block; padding-top: 50px;">

    <div class="container-admin" style="max-width: 1000px; margin: auto;">
        <!-- Header Dashboard sesuai Gambar 1 -->
        <div class="admin-header-white">
            <h1 style="margin:0; font-weight: 800; font-size: 24px;">Admin Dashboard</h1>
            <button class="btn-logout-red" onclick="logoutAdmin()">LOGOUT</button>
        </div>

        <!-- Menu Tab (Atur, Rekap Booking, Riwayat Selesai) -->
        <div class="tab-menu" style="display:flex; gap: 15px; margin-bottom: 25px;">
            <button class="btn-tab btn-atur" onclick="showSection('section-atur')">📅 ATUR JADWAL</button>
            <button class="btn-tab btn-rekap" onclick="showSection('section-rekap')">📊 REKAP BOOKING</button>
            <button class="btn-tab btn-riwayat" onclick="showSection('section-riwayat')">📜 RIWAYAT KONSUL</button>
        </div>

        <!-- Section 1: Atur Jadwal -->
        <div id="section-atur" class="card-panel-neo">
            <h3 style="margin-bottom: 20px;">Input Jadwal Baru</h3>
            <div class="form-grid-neo">
                <div class="form-group">
                    <label style="font-weight:800; display:block; margin-bottom:5px;">Nama Pemandu</label>
                    <select id="sel-pemandu"><option>Memuat...</option></select>
                </div>
                <div class="form-group">
                    <label style="font-weight:800; display:block; margin-bottom:5px;">Tanggal</label>
                    <input type="date" id="sel-tanggal">
                </div>
                <div class="form-group">
                    <label style="font-weight:800; display:block; margin-bottom:5px;">Jam Mulai</label>
                    <input type="time" id="sel-jam-mulai">
                </div>
            </div>
            <button class="btn-publish-pink" onclick="createJadwalOtomatis()">PUBLISH JADWAL (45 MENIT)</button>

            <h3 style="margin-top: 40px; margin-bottom: 20px;">Daftar Slot Terpublikasi</h3>
            <div id="admin-jadwal-list" class="table-container-neo">
                <!-- Data Jadwal Otomatis Muncul di Sini -->
            </div>
        </div>

        <!-- Section 2: Rekap Booking (Data Mendatang) -->
        <div id="section-rekap" class="card-panel-neo" style="display: none;">
            <h3 style="margin-bottom: 20px;">📊 Rekap Booking Mendatang</h3>
            <input type="text" id="filter-nama" placeholder="Cari Nama / NRP / Kelompok..." oninput="filterRekap()" style="margin-bottom: 20px;">
            <div id="rekap-table-container" class="table-container-neo">
                <!-- Data Booking Aktif Muncul di Sini -->
            </div>
        </div>

        <!-- Section 3: Riwayat Konsul (Data Masa Lalu) -->
        <div id="section-riwayat" class="card-panel-neo" style="display: none;">
            <h3 style="margin-bottom: 20px;">📜 Riwayat Konsultasi (Selesai)</h3>
            <input type="text" id="filter-riwayat" placeholder="Cari Nama / NRP / Pemandu..." oninput="filterRiwayat()" style="margin-bottom: 20px;">
            <div id="riwayat-table-container" class="table-container-neo">
                <!-- Data Riwayat Muncul di Sini -->
            </div>
        </div>
    </div>

    <script src="app.js"></script>
    <script>
        // Inisialisasi saat halaman dibuka
        window.onload = () => {
            if (localStorage.getItem("admin_logged_in") !== "true") {
                window.location.replace("index.php");
            }
            loadPemanduDropdown(); 
            loadRekap(); 
            loadJadwalAdmin();
        };

        // Fungsi berpindah antar menu
        function showSection(id) {
            document.getElementById('section-atur').style.display = 'none';
            document.getElementById('section-rekap').style.display = 'none';
            document.getElementById('section-riwayat').style.display = 'none';
            document.getElementById(id).style.display = 'block';
        }
    </script>
</body>
</html>