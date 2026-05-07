/* ============================================================
    1. KONFIGURASI & KONEKSI SUPABASE
   ============================================================ */

const sbUrl = "https://your-supabase-url.supabase.co"; // Ganti dengan URL Supabase Anda
const sbKey = "your-supabase-anon-key"; // Ganti dengan Anon Key Supabase Anda

    var sbClient = window.supabase.createClient(sbUrl, sbKey);
}

let allBookingAktif = [];
let allRiwayatKonsul = [];
let allJadwalAdmin = [];
let selectedSlot = null;

/* ============================================================
    2. SISTEM LOGIN & LOGOUT ADMIN
   ============================================================ */
async function executeLogin() {
    const user = document.getElementById("login-username")?.value.trim();
    const pass = document.getElementById("login-password")?.value.trim();
    const msg = document.getElementById("login-error-msg");

    if (!user || !pass) {
        if (msg) msg.innerText = "Isi semua kolom!";
        return;
    }

    try {
        const { data, error } = await sbClient
            .from('users')
            .select('*')
            .eq('username', user)
            .eq('password', pass);

        if (data && data.length > 0) {
            localStorage.setItem("admin_logged_in", "true");
            window.location.replace("admin.php");
        } else {
            if (msg) msg.innerText = "Username atau Password salah!";
        }
    } catch (err) {
        if (msg) msg.innerText = "Terjadi kesalahan sistem.";
    }
}

function logoutAdmin() {
    localStorage.removeItem("admin_logged_in");
    window.location.replace("index.php");
}

/* ============================================================
    3. MANAJEMEN JADWAL (ADMIN)
   ============================================================ */
async function loadPemanduDropdown() {
    try {
        const { data } = await sbClient.from("pemandu").select("id, nama");
        const el = document.getElementById("sel-pemandu") || document.getElementById("b-pemandu");
        if (el && data) {
            let html = '<option value="" disabled selected>-- Pilih Pemandu --</option>';
            data.forEach(p => { html += `<option value="${p.id}">${p.nama}</option>`; });
            el.innerHTML = html;
        }
    } catch (err) { console.error(err); }
}

async function createJadwalOtomatis() {
    const pemanduId = document.getElementById("sel-pemandu").value;
    const tanggal = document.getElementById("sel-tanggal").value;
    const jamMulai = document.getElementById("sel-jam-mulai").value;

    if (!pemanduId || !tanggal || !jamMulai) return alert("Lengkapi data!");

    let [h, m] = jamMulai.split(":").map(Number);
    let date = new Date();
    date.setHours(h, m + 45);
    const jamSelesai = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:00`;

    const { error } = await sbClient.from("jadwal").insert({
        pemandu_id: pemanduId, tanggal, waktu_mulai: jamMulai + ":00", waktu_selesai: jamSelesai
    });

    if (!error) {
        alert("Jadwal Berhasil Dibuat!");
        loadJadwalAdmin();
    } else { alert("Gagal: " + error.message); }
}

async function loadJadwalAdmin() {
    const { data } = await sbClient
        .from("jadwal")
        .select(`id, tanggal, waktu_mulai, pemandu(nama)`)
        .order("tanggal", { ascending: false });
    
    if (data) {
        allJadwalAdmin = data;
        renderJadwalAdminTable(data);
    }
}

function renderJadwalAdminTable(data) {
    const container = document.getElementById("admin-jadwal-list");
    if (!container) return;

    let html = `
        <input type="text" id="f-jadwal" placeholder="Cari Nama Pemandu / Tanggal..." oninput="filterJadwalAdmin()" style="margin-bottom:15px;">
        <table>
            <tr><th>Tanggal</th><th>Pemandu</th><th>Jam</th><th>Aksi</th></tr>`;
    
    data.forEach(j => {
        html += `<tr>
            <td>${j.tanggal}</td>
            <td>${j.pemandu.nama}</td>
            <td style="text-align:center">${j.waktu_mulai.substring(0,5)}</td>
            <td style="text-align:center"><button class="btn-delete-small" onclick="deleteJadwal('${j.id}')">Hapus</button></td>
        </tr>`;
    });
    container.innerHTML = html + `</table>`;
}

function filterJadwalAdmin() {
    const kw = document.getElementById("f-jadwal").value.toLowerCase();
    const filtered = allJadwalAdmin.filter(j => j.pemandu.nama.toLowerCase().includes(kw) || j.tanggal.includes(kw));
    renderJadwalAdminTable(filtered);
}

async function deleteJadwal(id) {
    if (confirm("Hapus jadwal ini?")) {
        await sbClient.from("jadwal").delete().eq("id", id);
        loadJadwalAdmin();
        loadRekap();
    }
}

/* ============================================================
    4. REKAP & RIWAYAT (ADMIN - DENGAN WHATSAPP)
   ============================================================ */
async function loadRekap() {
    const { data } = await sbClient.from("booking").select(`
        id, nama, nrp, kelompok, telepon, materi, tempat, kelompok,
        jadwal (tanggal, waktu_mulai, pemandu (nama))
    `);
    
    const sekarang = new Date();
    allBookingAktif = (data || []).filter(d => new Date(`${d.jadwal.tanggal}T${d.jadwal.waktu_mulai}`) > sekarang);
    allRiwayatKonsul = (data || []).filter(d => new Date(`${d.jadwal.tanggal}T${d.jadwal.waktu_mulai}`) <= sekarang);
    
    renderRekapTable(allBookingAktif);
    renderRiwayatTable(allRiwayatKonsul);
}

function renderRekapTable(data) {
    const container = document.getElementById("rekap-table-container");
    if (!container) return;

    let html = `<div class="table-container-neo">
                <table>
                <thead>
                    <tr>
                        <th>Mahasiswa</th>
                        <th>WA</th>
                        <th>Tempat</th>
                        <th>Materi</th>
                        <th>Klp</th>
                        <th>Pemandu</th>
                        <th>Waktu</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>`;
    
    data.forEach(d => {
        const waLink = `https://wa.me/${d.telepon?.replace(/\D/g,'')}`;
        html += `<tr>
                <td>${d.nama}<br><small>${d.nrp}</small></td>
                <td><a href="${waLink}" target="_blank" style="color:green; font-weight:800;">${d.telepon || '-'}</a></td>
                <td style="background: #fff3cd;"><b>${d.tempat || '-'}</b></td>
                <td>${d.materi}</td>
                <td>${d.kelompok || '-'}</td>
                <td>${d.jadwal?.pemandu?.nama}</td>
                <td>${d.jadwal?.tanggal}<br><b>${d.jadwal?.waktu_mulai.substring(0,5)}</b></td>
                <td><button class="btn-delete-small" onclick="deleteBooking('${d.id}')">Hapus</button></td>
            </tr>`;
    });
    
    html += `</tbody></table></div>`;
    container.innerHTML = html;
}

function renderRiwayatTable(data) {
    const container = document.getElementById("riwayat-table-container");
    if (!container) return;

    let html = `
        <table style="width:100%; border-collapse: collapse; border: 3px solid black; background: white;">
            <thead>
                <tr>
                    <th style="border: 3px solid black; padding: 12px; background: #f0f0f0;">Mahasiswa</th>
                    <th style="border: 3px solid black; padding: 12px; background: #f0f0f0;">WA</th>
                    <th style="border: 3px solid black; padding: 12px; background: #f0f0f0;">Klp</th>
                    <th style="border: 3px solid black; padding: 12px; background: #f0f0f0;">Materi</th>
                    <th style="border: 3px solid black; padding: 12px; background: #f0f0f0;">Pemandu</th>
                    <th style="border: 3px solid black; padding: 12px; background: #f0f0f0;">Waktu</th>
                    <th style="border: 3px solid black; padding: 12px; background: #f0f0f0;">Status</th>
                </tr>
            </thead>
            <tbody>`;

    data.forEach(d => {
        // Membersihkan nomor untuk link WhatsApp
        const waNumber = d.telepon ? d.telepon.replace(/\D/g, '') : '';
        const waLink = waNumber ? `https://wa.me/${waNumber}` : '#';

        html += `
            <tr>
                <td style="border: 3px solid black; padding: 12px;">
                    ${d.nama}<br><small style="color: #666;">${d.nrp}</small>
                </td>
                <td style="border: 3px solid black; padding: 12px;">
                    <a href="${waLink}" target="_blank" style="color: green; text-decoration: none; font-weight: 800;">
                        ${d.telepon || '-'}
                    </a>
                </td>
                <td style="border: 3px solid black; padding: 12px;">${d.kelompok || '-'}</td>
                <td style="border: 3px solid black; padding: 12px;">${d.materi || '-'}</td>
                <td style="border: 3px solid black; padding: 12px;">${d.jadwal?.pemandu?.nama || '-'}</td>
                <td style="border: 3px solid black; padding: 12px; text-align: center;">
                    ${d.jadwal?.tanggal}<br><b>${d.jadwal?.waktu_mulai?.substring(0, 5)}</b>
                </td>
                <td style="border: 3px solid black; padding: 12px; text-align: center;">
                    <span style="color: green; font-weight: 800;">SELESAI</span>
                </td>
            </tr>`;
    });

    html += `</tbody></table>`;
    container.innerHTML = html;
}

function filterRekap() {
    const kw = document.getElementById("filter-nama").value.toLowerCase();
    const filtered = allBookingAktif.filter(d => d.nama.toLowerCase().includes(kw) || d.nrp.includes(kw));
    renderRekapTable(filtered);
}

function filterRiwayat() {
    const kw = document.getElementById("filter-riwayat").value.toLowerCase();
    const filtered = allRiwayatKonsul.filter(d => d.nama.toLowerCase().includes(kw) || d.nrp.includes(kw));
    renderRiwayatTable(filtered);
}

async function deleteBooking(id) {
    if (confirm("Hapus booking?")) {
        await sbClient.from("booking").delete().eq("id", id);
        loadRekap();
    }
}

/* ============================================================
    5. USER LOGIC (BOOKING & CEK JADWAL - SINGLE BORDER)
   ============================================================ */
async function loadSlotForBooking() {
    const pemanduId = document.getElementById("b-pemandu")?.value;
    const tanggalInput = document.getElementById("b-tanggal")?.value;
    const container = document.getElementById("slot-picker");
    
    if (!pemanduId || !tanggalInput || !container) return;

    // Tanggal yang dipilih mahasiswa
    const dipilih = new Date(tanggalInput);
    dipilih.setHours(0, 0, 0, 0);

    // Tanggal hari ini
    const sekarang = new Date();
    const hariIni = new Date(sekarang);
    hariIni.setHours(0, 0, 0, 0);

    // Tanggal besok
    const besok = new Date(hariIni);
    besok.setDate(besok.getDate() + 1);

    // --- VALIDASI JAM (CUT-OFF 21.30) ---
    const jamSekarang = sekarang.getHours();
    const menitSekarang = sekarang.getMinutes();
    const sudahLewatBatas = (jamSekarang > 21 || (jamSekarang === 21 && menitSekarang >= 30));

    // Jika pilih besok dan sudah lewat jam 21.30
    if (dipilih.getTime() === besok.getTime() && sudahLewatBatas) {
        container.innerHTML = "<p style='color:red; font-weight:800; font-size:14px; text-align:left;'>⚠️ Booking untuk besok telah melewati batas waktu yang ditentukan (Max 21.00)</p>";
        return;
    }

    // --- VALIDASI HARI H (H-1 POLICY) ---
    if (dipilih.getTime() === hariIni.getTime()) {
        container.innerHTML = "<p style='color:red; font-weight:800; font-size:14px; text-align:left;'>⚠️ Tidak dapat booking konsul pada hari H</p>";
        return;
    }

    // --- VALIDASI SENIN (UKM DAY) ---
    if (dipilih.getDay() === 1) {
        container.innerHTML = "<p style='color:red; font-weight:800; font-size:14px; text-align:left;'>⚠️ Tidak boleh konsultasi pada UKM Day</p>";
        return;
    }

    // --- VALIDASI SABTU (WEEKEND) ---
    if (dipilih.getDay() === 6) {
        container.innerHTML = "<p style='color:red; font-weight:800; font-size:14px; text-align:left;'>Konsultasi Hari Sabtu (weekend) langsung hubungi Pemandu Altaira HMCE</p>";
        return;
    }

    // --- VALIDASI MINGGU (WEEKEND) ---
    if (dipilih.getDay() === 0) {
        container.innerHTML = "<p style='color:red; font-weight:800; font-size:14px; text-align:left;'>Konsultasi Hari Minggu (weekend) langsung hubungi Pemandu Altaira HMCE</p>";
        return;
    }

    // Jika lolos semua validasi, ambil data jadwal
    const { data, error } = await sbClient
        .from("jadwal")
        .select(`id, tanggal, waktu_mulai, booking(id)`)
        .eq("pemandu_id", pemanduId)
        .eq("tanggal", tanggalInput);
    
    let slotHtml = "";
    let tersedia = 0;

    if (data) {
        data.forEach(slot => {
            tersedia++;
            const count = slot.booking ? slot.booking.length : 0;
            if (count >= 2) {
                slotHtml += `<div class="slot" style="background:#e5e7eb; opacity:0.6; cursor:not-allowed; border: 3px solid #ccc;">${slot.waktu_mulai.substring(0,5)}<br>FULL</div>`;
            } else {
                slotHtml += `<div class="slot" style="cursor:pointer; border:3px solid #2d1b69" onclick="selectSlot('${slot.id}', '${slot.waktu_mulai.substring(0,5)}')">${slot.waktu_mulai.substring(0,5)}<br>${count}/2</div>`;
            }
        });
    }

    if (tersedia > 0) {
        container.innerHTML = slotHtml;
    } else {
        container.innerHTML = "<small style='color:red; font-weight:800;'>Jadwal belum tersedia untuk tanggal ini.<br>Silahkan hubungi Pemandu Altaira HMCE</small>";
    }
}

function selectSlot(id, label) {
    selectedSlot = id;
    document.getElementById("slot-label").innerText = label;
    document.getElementById("selected-slot-info").style.display = "block";
}

function toggleSawNotes() {
    const tempat = document.getElementById("b-tempat").value;
    const notes = document.getElementById("saw-notes");
    
    if (tempat === "SAW") {
        notes.style.display = "block";
    } else {
        notes.style.display = "none";
    }
}

async function submitBooking() {
    const n = document.getElementById("b-nama").value;
    const nr = document.getElementById("b-nrp").value;
    const k = document.getElementById("b-kelompok").value;
    const m = document.getElementById("b-materi").value;
    const tempat = document.getElementById("b-tempat").value;
    
    let t = document.getElementById("b-telepon").value.trim();
    t = t.replace(/\D/g, ''); 
    
    if (t.startsWith('0')) {
        t = '62' + t.substring(1);
    }

    if (!selectedSlot || !n || !nr || !t || !tempat) {
        return alert("Lengkapi data Nama, NRP, WA, Lokasi & Pilih Slot!");
    }

    const { error } = await sbClient.from("booking").insert({ 
        nama: n, 
        nrp: nr, 
        kelompok: k, 
        telepon: t,
        materi: m, 
        tempat: tempat, 
        jadwal_id: selectedSlot 
    });

    if (!error) { 
        alert("Berhasil booking!\nSilahkan bisa reminder\nPemandu Altaira HMCE\nPada hari H konsultasi"); 
        location.reload(); 
    } else { 
        alert("Gagal booking: " + error.message); 
    }
}

async function cekJadwalByTanggal() {
    const tgl = document.getElementById("cek-tanggal").value;
    const res = document.getElementById("hasil-jadwal");
    if (!tgl) return;

    res.innerHTML = "Memuat...";
    
    // Ambil data jadwal berdasarkan tanggal yang dipilih
    const { data, error } = await sbClient
        .from("jadwal")
        .select(`
            tanggal, 
            waktu_mulai, 
            pemandu (nama), 
            booking (kelompok)
        `)
        .eq("tanggal", tgl)
        .order("waktu_mulai", { ascending: true });
    
    if (error) {
        res.innerHTML = "Terjadi kesalahan saat memuat data.";
        return;
    }

    // --- PERUBAHAN DI SINI ---
    // Kita langsung menggunakan 'data' tanpa filter 'new Date() > sekarang'
    const dataTampil = data || [];

    if (dataTampil.length === 0) { 
        res.innerHTML = "Tidak ada jadwal tersedia untuk tanggal ini.<br>Silahkan hubungi Pemandu Altaira HMCE"; 
        return; 
    }

    // Grouping data berdasarkan nama pemandu
    const grouped = dataTampil.reduce((acc, curr) => {
        const name = curr.pemandu?.nama || "Tanpa Nama";
        if (!acc[name]) acc[name] = [];
        acc[name].push(curr); 
        return acc;
    }, {});

    let html = "";
    for (const name in grouped) {
        html += `<div style="margin-bottom:30px; width:100%;">
            <h3 style="font-weight:800; margin-bottom:10px;">${name}</h3>
            <div style="overflow-x:auto;" class="table-container-neo">
                <table style="width:100%; border-collapse: collapse; border: 3px solid black; background: white;">
                    <tr>
                        ${grouped[name].map(j => `
                            <th style="border: 3px solid black; padding: 10px; background: #59d5e0; min-width:100px;">
                                ${j.waktu_mulai.substring(0,5)}
                            </th>
                        `).join('')}
                    </tr>
                    <tr>
                        ${grouped[name].map(j => {
                            const k1 = j.booking[0] ? j.booking[0].kelompok : "-";
                            const k2 = j.booking[1] ? j.booking[1].kelompok : "-";
                            return `<td style="border: 3px solid black; padding: 0;">
                                <div style="display: flex; height: 45px;">
                                    <div style="flex: 1; border-right: 3px solid black; display: flex; align-items: center; justify-content: center; font-weight: 800;">${k1}</div>
                                    <div style="flex: 1; display: flex; align-items: center; justify-content: center; font-weight: 800;">${k2}</div>
                                </div>
                            </td>`;
                        }).join('')}
                    </tr>
                </table>
            </div>
        </div>`;
    }
    res.innerHTML = html;
}