// ==========================================
// 1. ฟังก์ชันสลับ Tab หน้าหลัก
// ==========================================
function switchTab(tabId, element) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-link').forEach(link => link.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    if(element) element.classList.add('active');
}

// ==========================================
// 2. ฟังก์ชันประเมินราคา (อัปเดต UI สลิปใหม่)
// ==========================================
function calculateRate() {
    const origin = document.getElementById("rateOrigin").value;
    const dest = document.getElementById("rateDest").value;
    const weight = parseFloat(document.getElementById("rateWeight").value);
    const size = document.getElementById("rateSize").value;
    const resultDiv = document.getElementById("rateResult");

    if (!origin || !dest || isNaN(weight)) {
        resultDiv.innerHTML = "<p style='color:#ef4444; text-align:center; font-weight:bold; background: #fee2e2; padding: 15px; border-radius: 10px;'>⚠️ กรุณากรอกข้อมูลต้นทาง ปลายทาง และน้ำหนักให้ครบถ้วน</p>";
        return;
    }

    let basePrice = 35;
    let weightPrice = weight * 15;
    let sizeMultiplier = size === 'large' ? 1.5 : (size === 'medium' ? 1.2 : 1.0);
    let total = (basePrice + weightPrice) * sizeMultiplier;

    resultDiv.innerHTML = `
        <div style="background: linear-gradient(135deg, #f0fdf4, #dcfce7); border: 1px solid #86efac; padding: 30px; border-radius: 15px; text-align: center; animation: slideUp 0.5s; box-shadow: 0 10px 20px rgba(22, 163, 74, 0.1);">
            <div style="width: 60px; height: 60px; background: #10b981; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; margin: 0 auto 15px auto; box-shadow: 0 5px 15px rgba(16,185,129,0.3);">
                <i class="fas fa-check"></i>
            </div>
            <h3 style="color:#047857; margin-bottom:5px; font-size: 1.2rem;">ราคาประเมินค่าจัดส่ง</h3>
            <p style="color: #475569; font-size: 1rem; margin-bottom: 15px;">เส้นทาง: <b>${origin}</b> <i class="fas fa-arrow-right" style="margin: 0 5px; color:#94a3b8;"></i> <b>${dest}</b></p>
            <div style="background: white; padding: 15px; border-radius: 10px; margin-bottom: 15px;">
                <p style="font-size: 3rem; font-weight: 800; color: #10b981; line-height: 1;">฿${total.toFixed(2)}</p>
            </div>
            <p style="color: #64748b; font-size: 0.85rem;"><i class="fas fa-info-circle"></i> ราคานี้เป็นเพียงการประเมินเบื้องต้น อาจมีการเปลี่ยนแปลง</p>
        </div>
    `;
}

// ==========================================
// 3. ฟังก์ชันค้นหาพัสดุ (อัปเดต UI Timeline ใหม่)
// ==========================================
function searchParcel() {
    const id = document.getElementById("searchID").value.trim();
    const parcels = JSON.parse(localStorage.getItem("parcels")) || [];
    const p = parcels.find(x => x.id === id);
    const res = document.getElementById("result");

    if (p) {
        const getIcon = (status) => {
            if(status.includes('เข้ารับ')) return '<i class="fas fa-store"></i>';
            if(status.includes('คัดแยก')) return '<i class="fas fa-boxes"></i>';
            if(status.includes('จัดส่ง')) return '<i class="fas fa-truck"></i>';
            if(status.includes('ปลายทางแล้ว')) return '<i class="fas fa-check"></i>';
            if(status.includes('ปัญหา') || status.includes('ตีกลับ')) return '<i class="fas fa-times"></i>';
            return '<i class="fas fa-map-marker-alt"></i>';
        };

        let historyHTML = [...p.history].reverse().map((h, index) => `
            <div class="timeline-item ${index === 0 ? 'active' : ''}">
                <div class="timeline-icon">${getIcon(h.status)}</div>
                <div class="timeline-content">
                    <h4>${h.status}</h4>
                    <p>${h.time}</p>
                </div>
            </div>
        `).join('');

        let isDelivered = p.status.includes('ปลายทางแล้ว');
        let statusColor = isDelivered ? '#10b981' : 'var(--primary)';
        let badgeBg = isDelivered ? '#dcfce7' : '#e0f2fe';
        let badgeText = isDelivered ? '#047857' : '#0369a1';

        res.innerHTML = `
            <div class="tracking-result-box animate-slide-up" style="border-top: 5px solid ${statusColor};">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 15px; margin-bottom: 25px; padding-bottom: 20px; border-bottom: 1px dashed #e2e8f0;">
                    <div>
                        <span style="color: #64748b; font-size: 0.9rem;">หมายเลขพัสดุ (Tracking No.)</span>
                        <h3 style="font-size: 1.8rem; color: var(--text-main); letter-spacing: 1px;">${p.id}</h3>
                    </div>
                    <div style="background: ${badgeBg}; color: ${badgeText}; padding: 8px 20px; border-radius: 100px; font-weight: bold; font-size: 1rem; display: flex; align-items: center; gap: 8px;">
                        <span class="online-dot" style="background: ${statusColor}; box-shadow: none;"></span> ${p.status}
                    </div>
                </div>
                
                <div style="display: flex; justify-content: space-between; align-items: center; background: #f8fafc; padding: 20px; border-radius: 15px; margin-bottom: 30px;">
                    <div style="text-align: left;">
                        <span style="font-size: 0.85rem; color: #64748b; display: block; margin-bottom: 5px;"><i class="fas fa-box"></i> ผู้ส่ง (Sender)</span>
                        <strong style="color: var(--text-main); font-size: 1.1rem;">${p.sender}</strong>
                    </div>
                    <div style="color: #cbd5e1; font-size: 1.5rem;"><i class="fas fa-long-arrow-alt-right"></i></div>
                    <div style="text-align: right;">
                        <span style="font-size: 0.85rem; color: #64748b; display: block; margin-bottom: 5px;">ผู้รับ (Receiver) <i class="fas fa-house-user"></i></span>
                        <strong style="color: var(--text-main); font-size: 1.1rem;">${p.customer}</strong>
                    </div>
                </div>

                <h4 style="color: var(--text-main); margin-bottom: 20px; font-size: 1.2rem; display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-history" style="color: var(--primary);"></i> ประวัติการเดินทาง
                </h4>
                <div class="timeline">${historyHTML}</div>
            </div>`;
    } else {
        res.innerHTML = `
            <div class="animate-slide-up" style="text-align:center; padding: 40px 20px; background:#fff1f2; border: 1px solid #fecdd3; border-radius:15px; margin-top:30px;">
                <div style="font-size:4rem; color: #fda4af; margin-bottom:15px;"><i class="fas fa-box-open"></i></div>
                <h3 style="color: #be123c; margin-bottom: 10px;">ไม่พบข้อมูลพัสดุในระบบ</h3>
                <p style="color: #881337;">กรุณาตรวจสอบหมายเลข <b>${id ? id : 'ที่กรอก'}</b> อีกครั้ง หรือติดต่อฝ่ายบริการลูกค้า</p>
            </div>`;
    }
}

// ==========================================
// 4. ระบบจัดการของ Staff
// ==========================================
function createParcel() {
    const sName = document.getElementById("senderName").value;
    const sPhone = document.getElementById("senderPhone").value;
    const sAddr = document.getElementById("senderAddr").value;
    const rName = document.getElementById("receiverName").value;
    const rPhone = document.getElementById("receiverPhone").value;
    const rAddr = document.getElementById("receiverAddr").value;

    if (!sName || !rName) return alert("กรุณากรอกข้อมูลให้ครบถ้วน");

    const randomID = "T" + Math.floor(100000 + Math.random() * 900000);
    const now = new Date().toLocaleString('th-TH');

    let parcels = JSON.parse(localStorage.getItem("parcels")) || [];
    const newParcel = {
        id: randomID, sender: sName, customer: rName, 
        sAddr, rAddr, sPhone, rPhone,
        status: "เข้ารับพัสดุแล้ว 🏭",
        history: [{ status: "เข้ารับพัสดุแล้ว 🏭", time: now }]
    };

    parcels.push(newParcel);
    localStorage.setItem("parcels", JSON.stringify(parcels));

    if(document.getElementById("newIDDisplay")){
        document.getElementById("newIDDisplay").innerHTML = `
            <div style="border: 2px dashed var(--primary); padding: 20px; background: #fafafa; border-radius: 10px; text-align:left;">
                <h4 style="text-align:center; color:var(--primary); margin-bottom:15px;">ใบเสร็จรับเงิน / พัสดุ</h4>
                <p><b>เลขพัสดุ:</b> <span style="font-size:1.2rem; color:var(--accent); font-weight:bold;">${randomID}</span></p>
                <p><b>จาก:</b> ${sName} (${sPhone})</p>
                <p><b>ถึง:</b> ${rName} (${rPhone})</p>
                <button onclick="window.print()" class="btn-primary" style="margin-top:15px; width:100%;">🖨️ พิมพ์ใบเสร็จ</button>
            </div>
        `;
    }
    alert("สร้างรายการสำเร็จ เลขพัสดุ: " + randomID);
}

function updateStatus() {
    const id = document.getElementById("updateID").value.trim();
    const status = document.getElementById("newStatus").value;
    let parcels = JSON.parse(localStorage.getItem("parcels")) || [];
    const idx = parcels.findIndex(x => x.id === id);

    if (idx !== -1) {
        parcels[idx].status = status;
        parcels[idx].history.push({ status, time: new Date().toLocaleString('th-TH') });
        localStorage.setItem("parcels", JSON.stringify(parcels));
        alert("อัปเดตสถานะสำเร็จ!");
    } else {
        alert("ไม่พบรหัสพัสดุ");
    }
}

// ==========================================
// 5. ระบบ Authentication (Login/Logout)
// ==========================================
function handleLogin() {
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;

    if (user === "admin" && pass === "1234") {
        localStorage.setItem("isLoggedIn", "true");
        window.location.href = "staff.html";
    } else {
        alert("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง!");
    }
}

function handleLogout() {
    localStorage.removeItem("isLoggedIn");
    window.location.href = "login.html";
}

// ==========================================
// 6. ระบบ Chatbot แจ้งปัญหา (V2)
// ==========================================
function sendMessage() {
    const input = document.getElementById('chatInput');
    const msg = input.value.trim();
    if (!msg) return;

    const chatBox = document.getElementById('chatBox');
    const timeNow = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
    
    // ข้อความจาก User
    chatBox.innerHTML += `
        <div class="chat-msg user-msg">
            <div class="msg-content">${msg}</div>
            <div class="msg-time">${timeNow}</div>
        </div>`;
    input.value = '';
    chatBox.scrollTop = chatBox.scrollHeight;

    // จำลองการตอบกลับของ Bot
    setTimeout(() => {
        let botReply = "ขออภัยครับ น้องสมาร์ทยังไม่เข้าใจคำถาม กรุณาพิมพ์รายละเอียดเพิ่มเติม หรือติดต่อ Call Center 1234 ครับ";
        
        if (msg.toLowerCase().includes("ปัญหา") || msg.toLowerCase().includes("ช้า") || msg.toLowerCase().includes("ไม่ได้รับ") || msg.includes("พัง")) {
            botReply = "ต้องขออภัยในความไม่สะดวกอย่างยิ่งครับ 🥺 รบกวนคุณลูกค้าพิมพ์ <b>เลขพัสดุ (Tracking No.)</b> เพื่อให้น้องสมาร์ทตรวจสอบข้อมูลให้ครับ";
        } else if (msg.startsWith("T") || msg.match(/^[0-9]+$/)) {
            const parcels = JSON.parse(localStorage.getItem("parcels")) || [];
            const p = parcels.find(x => x.id === msg);
            
            if(p) {
                botReply = `พัสดุหมายเลข <b>${p.id}</b><br>สถานะล่าสุดคือ: <b>${p.status}</b><br><br>หากพัสดุมีปัญหา ระบบได้ส่งเรื่องให้เจ้าหน้าที่ตรวจสอบแล้ว จะมีผู้ติดต่อกลับภายใน 24 ชม. ครับ`;
            } else {
                botReply = `ระบบได้ทำการบันทึกปัญหาของหมายเลขพัสดุ <b>${msg}</b> เข้าสู่ฝ่าย Customer Care แล้วครับ ทางเราจะเร่งติดตามพัสดุให้เร็วที่สุดครับ! 🚀`;
            }
        } else if (msg.includes("สวัสดี") || msg.includes("ดีครับ") || msg.includes("ดีค่ะ")) {
            botReply = "สวัสดีครับ! วันนี้มีอะไรให้น้องสมาร์ทช่วยเหลือไหมครับ สามารถพิมพ์แจ้งได้เลยครับ";
        } else if (msg.includes("ขอบคุณ")) {
            botReply = "ด้วยความยินดีครับ หากมีอะไรให้ช่วยเรียกน้องสมาร์ทได้เสมอนะครับ 🙏";
        }

        chatBox.innerHTML += `
            <div class="chat-msg bot-msg">
                <div class="msg-content">${botReply}</div>
                <div class="msg-time">${timeNow}</div>
            </div>`;
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 800);
}

function handleChatKeyPress(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}

function sendQuickReply(text) {
    const input = document.getElementById('chatInput');
    input.value = text;
    sendMessage();
}

// ==========================================
// 7. ระบบกราฟ และ ตาราง Staff (กลับมาแล้ว!)
// ==========================================
window.addEventListener('DOMContentLoaded', (event) => {
    // เช็คว่าอยู่ในหน้า staff.html หรือไม่ (หน้า staff จะมี id="parcelChart")
    if(document.getElementById('parcelChart')) {
        renderCharts();
        loadRecentParcels();
    }
});

function loadRecentParcels() {
    const tableBody = document.getElementById('recentTableBody');
    if(!tableBody) return;

    const parcels = JSON.parse(localStorage.getItem("parcels")) || [];
    
    if(parcels.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: 20px; color: #94a3b8;">ยังไม่มีข้อมูลพัสดุในระบบ</td></tr>`;
        return;
    }

    // เรียงพัสดุล่าสุดขึ้นก่อน (Reverse)
    let rowsHTML = '';
    [...parcels].reverse().slice(0, 5).forEach(p => {
        let statusBadge = '#e2e8f0';
        let statusColor = '#475569';
        
        if(p.status.includes('ปลายทางแล้ว')) { statusBadge = '#d1fae5'; statusColor = '#047857'; }
        else if(p.status.includes('ปัญหา')) { statusBadge = '#fee2e2'; statusColor = '#b91c1c'; }
        else if(p.status.includes('จัดส่ง')) { statusBadge = '#fef08a'; statusColor = '#854d0e'; }
        else { statusBadge = '#e0f2fe'; statusColor = '#0369a1'; }

        rowsHTML += `
            <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 15px; font-weight: bold; color: var(--primary);">${p.id}</td>
                <td style="padding: 15px;">${p.sender}</td>
                <td style="padding: 15px;">${p.customer}</td>
                <td style="padding: 15px;">
                    <span style="background: ${statusBadge}; color: ${statusColor}; padding: 5px 10px; border-radius: 20px; font-size: 0.85rem; font-weight: 600;">
                        ${p.status}
                    </span>
                </td>
            </tr>
        `;
    });
    tableBody.innerHTML = rowsHTML;
}

function renderCharts() {
    const parcelCtx = document.getElementById('parcelChart').getContext('2d');
    const revenueCtx = document.getElementById('revenueChart').getContext('2d');
    const statusCtx = document.getElementById('statusChart').getContext('2d');

    // ข้อมูลจำลองรายวัน
    const labels = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสฯ', 'ศุกร์', 'เสาร์', 'อาทิตย์'];
    const parcelData = [120, 150, 180, 130, 210, 250, 190]; 
    const revenueData = [12500, 15800, 18500, 13200, 21500, 25600, 19800];

    new Chart(parcelCtx, {
        type: 'bar',
        data: { labels: labels, datasets: [{ label: 'จำนวนพัสดุ (ชิ้น)', data: parcelData, backgroundColor: '#2563eb', borderRadius: 5 }] }
    });

    new Chart(revenueCtx, {
        type: 'line',
        data: { labels: labels, datasets: [{ label: 'รายได้ (บาท)', data: revenueData, borderColor: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.2)', fill: true, tension: 0.3 }] }
    });

    // ดึงข้อมูลจริงจาก LocalStorage สำหรับกราฟโดนัท
    const parcels = JSON.parse(localStorage.getItem("parcels")) || [];
    let statusCounts = { 'เข้ารับ': 0, 'คัดแยก': 0, 'จัดส่ง': 0, 'สำเร็จ': 0, 'มีปัญหา': 0 };
    
    parcels.forEach(p => {
        if(p.status.includes('เข้ารับ')) statusCounts['เข้ารับ']++;
        else if(p.status.includes('คัดแยก')) statusCounts['คัดแยก']++;
        else if(p.status.includes('จัดส่ง')) statusCounts['จัดส่ง']++;
        else if(p.status.includes('ปลายทางแล้ว')) statusCounts['สำเร็จ']++;
        else statusCounts['มีปัญหา']++;
    });

    // ถ้ายังไม่มีข้อมูลเลย ให้ใส่ค่า Default เพื่อให้กราฟไม่ว่างเปล่า
    if(parcels.length === 0) statusCounts = { 'เข้ารับ': 5, 'คัดแยก': 12, 'จัดส่ง': 8, 'สำเร็จ': 25, 'มีปัญหา': 2 };

    new Chart(statusCtx, {
        type: 'doughnut',
        data: {
            labels: ['เข้ารับพัสดุ', 'ศูนย์คัดแยก', 'กำลังจัดส่ง', 'ส่งสำเร็จ', 'มีปัญหา'],
            datasets: [{
                data: [statusCounts['เข้ารับ'], statusCounts['คัดแยก'], statusCounts['จัดส่ง'], statusCounts['สำเร็จ'], statusCounts['มีปัญหา']],
                backgroundColor: ['#0284c7', '#f59e0b', '#8b5cf6', '#10b981', '#ef4444'],
                borderWidth: 0
            }]
        },
        options: {
            cutout: '70%',
            plugins: { legend: { position: 'bottom' } }
        }
    });
}