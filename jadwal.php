<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Jadwal Pemandu</title>
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <style>
        body { background-color: #59d5e0; margin: 0; padding: 40px; font-family: sans-serif; display: flex; flex-direction: column; align-items: center; min-height: 100vh; }
        .header-box { background: white; border: 4px solid #2d1b69; border-radius: 20px; padding: 25px; text-align: center; width: 100%; max-width: 550px; margin-bottom: 40px; box-shadow: 10px 10px 0px rgba(0,0,0,0.1); }
        .date-input { padding: 12px; border: 3px solid #2d1b69; border-radius: 12px; font-weight: 800; font-size: 18px; text-align: center; margin-top: 15px; width: 220px; outline: none; display: block; margin-left: auto; margin-right: auto; }
        .btn-home { text-decoration: none; color: white; background: #2d1b69; padding: 12px 25px; border-radius: 15px; font-weight: 800; margin-bottom: 25px; display: inline-block; box-shadow: 0px 4px 0px #000; }
        #hasil-jadwal { width: 100%; max-width: 900px; display: flex; flex-direction: column; align-items: center; }
    </style>
</head>
<body>
    <a href="index.php" class="btn-home">← BERANDA</a>
    <div class="header-box">
        <h2 style="margin:0; font-weight: 800; color: #2d1b69;">LIHAT JADWAL</h2>
        <input type="date" id="cek-tanggal" class="date-input" onchange="cekJadwalByTanggal()">
    </div>
    <div id="hasil-jadwal">
        <p style="font-weight: 800; opacity: 0.5; font-size: 18px;">Pilih tanggal untuk melihat jadwal...</p>
    </div>
    <script src="app.js"></script>
</body>
</html>