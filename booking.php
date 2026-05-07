<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Konsultasi</title>
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <style>
        body { background-color: #59d5e0; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; font-family: sans-serif; padding: 20px; }
        .card { background: white; border: 4px solid #2d1b69; border-radius: 25px; padding: 30px; width: 100%; max-width: 420px; box-shadow: 12px 12px 0px rgba(0,0,0,0.1); }
        .btn-back { display: inline-block; margin-bottom: 15px; text-decoration: none; color: #2d1b69; font-weight: 800; border-bottom: 2px solid #2d1b69; }
        input, select { width: 100%; padding: 12px; margin-bottom: 15px; border: 3px solid #2d1b69; border-radius: 12px; font-weight: 700; box-sizing: border-box; outline: none; }
        .slot-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px; }
        .slot { padding: 10px; text-align: center; border-radius: 12px; font-weight: 800; border: 3px solid #2d1b69; background: #fff; }
        .btn-submit { background-color: #f400ff; color: white; border: 3px solid #2d1b69; border-radius: 15px; padding: 15px; width: 100%; font-size: 22px; font-weight: 800; cursor: pointer; box-shadow: 0px 6px 0px #2d1b69; transition: 0.1s; }
        .btn-submit:active { transform: translateY(3px); box-shadow: 0px 2px 0px #2d1b69; }
        .selected-box { display:none; text-align: center; margin-bottom: 15px; font-weight: 800; background: #fdf2ff; border: 2px dashed #f400ff; border-radius: 10px; padding: 10px; }
    </style>
</head>
<body>
    <div class="card">
        <a href="index.php" class="btn-back">← KEMBALI</a>
        <h2 style="margin-top:0; font-weight: 800; color: #2d1b69;">Booking Konsul</h2>
        <input type="text" id="b-nama" placeholder="Nama Lengkap">
        <input type="text" id="b-nrp" placeholder="NRP">
        <input type="number" id="b-kelompok" placeholder="Nomor Kelompok">
        <input type="text" id="b-telepon" placeholder="No. WhatsApp (Contoh: 08123xxx)" autocomplete="off">
        <select id="b-materi">
            <option value="" disabled selected>Pilih Materi</option>
            <option>AKL(1)</option>
            <option>AKL(2)</option>
            <option>PGA</option>
            <option>TUK</option>
            <option>PJK</option>
            <option>Kepanitiaan</option>
            <option>BAAUK</option>
            <option>Proposal</option>
            <option>Finalisasi</option>
        </select>
        <select id="b-pemandu" onchange="loadSlotForBooking()">
            <option value="" disabled selected>-- Pilih Pemandu --</option>
        </select>
        <select id="b-tempat" onchange="toggleSawNotes()">
            <option value="" disabled selected>-- Pilih Lokasi --</option>
            <option value="SAW">SAW</option>
            <option value="Taman Amphi">Taman Amphi</option>
            <option value="Depan Perpus D3">Depan Perpus D3</option>
        </select>
        <p id="saw-notes" style="display: none; color: #ff0000; font-weight: 800; font-size: 13px; text-align: left; margin-top: -10px; margin-bottom: 15px;">
        * Untuk Lokasi SAW, setelah submit, silahkan hubungi Pemandu Altaira HMCE untuk memilih lantai
        </p>
        <input type="date" id="b-tanggal" onchange="loadSlotForBooking()">
        <div id="slot-picker" class="slot-grid"></div>
        <div id="selected-slot-info" class="selected-box">
            Terpilih: <span id="slot-label"></span>
        </div>
        <button class="btn-submit" onclick="submitBooking()">KIRIM BOOKING</button>
    </div>

    <script src="app.js"></script>
    <script>window.onload = loadPemanduDropdown;</script>

    <script>
    // Mengatur batas minimum tanggal adalah Besok (H+1)
    const tglInput = document.getElementById('b-tanggal');
    const besok = new Date();
    besok.setDate(besok.getDate() + 1);
    
    // Format YYYY-MM-DD untuk atribut 'min' pada input date
    const yyyy = besok.getFullYear();
    const mm = String(besok.getMonth() + 1).padStart(2, '0');
    const dd = String(besok.getDate()).padStart(2, '0');
    
    tglInput.min = `${yyyy}-${mm}-${dd}`;
    </script>

</body>
</html>