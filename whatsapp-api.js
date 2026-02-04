// WhatsApp API Simulation
class WhatsAppAPI {
    constructor() {
        this.connected = false;
        this.session = null;
        this.qrCode = null;
        this.pairingCode = null;
        this.messageQueue = [];
        this.attackHistory = [];
    }

    // Generate pairing session
    async generatePairing() {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Generate random pairing code
                this.pairingCode = this.generateRandomCode(8);
                this.qrCode = `WHATSAPP-PAIR-${this.pairingCode}`;
                
                // Create session
                this.session = {
                    id: Date.now().toString(36),
                    code: this.pairingCode,
                    qr: this.qrCode,
                    createdAt: new Date(),
                    status: 'pending'
                };
                
                resolve({
                    success: true,
                    code: this.pairingCode,
                    qr: this.qrCode,
                    sessionId: this.session.id
                });
            }, 1000);
        });
    }

    // Connect with pairing code
    async connectWithCode(code) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (code === this.pairingCode) {
                    this.connected = true;
                    this.session.status = 'connected';
                    this.session.connectedAt = new Date();
                    
                    resolve({
                        success: true,
                        message: 'Connected successfully',
                        session: this.session
                    });
                } else {
                    reject(new Error('Invalid pairing code'));
                }
            }, 2000);
        });
    }

    // Send message with delay
    async sendDelayedMessage(target, message, delay) {
        return new Promise((resolve, reject) => {
            if (!this.connected) {
                reject(new Error('WhatsApp not connected'));
                return;
            }

            if (!target || target.length < 10) {
                reject(new Error('Invalid target number'));
                return;
            }

            // Add to queue
            const attackId = Date.now();
            const attack = {
                id: attackId,
                target: target,
                message: message,
                delay: delay,
                status: 'scheduled',
                scheduledAt: new Date(),
                estimatedCompletion: new Date(Date.now() + delay + 2000) // Add 2 seconds for processing
            };

            this.messageQueue.push(attack);
            this.attackHistory.push(attack);

            // Simulate sending process
            setTimeout(async () => {
                try {
                    attack.status = 'sending_initial';
                    
                    // Send initial notification
                    await this.simulateSendMessage(target, 
                        `⏳ CIKAA V1.0: Delay attack initiated\nDelay: ${this.formatDelay(delay)}`);
                    
                    // Apply delay
                    attack.status = 'delaying';
                    await this.wait(delay);
                    
                    // Send main message
                    attack.status = 'sending_main';
                    await this.simulateSendMessage(target, message);
                    
                    // Complete
                    attack.status = 'completed';
                    attack.completedAt = new Date();
                    
                    resolve({
                        success: true,
                        attackId: attackId,
                        message: 'Attack completed successfully'
                    });
                    
                } catch (error) {
                    attack.status = 'failed';
                    attack.error = error.message;
                    reject(error);
                }
            }, 1000);
        });
    }

    // Simulate sending message
    async simulateSendMessage(target, message) {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Log the message
                console.log(`[WhatsApp API] Sending to ${target}: ${message.substring(0, 50)}...`);
                
                // Also open WhatsApp web as fallback
                const encodedMessage = encodeURIComponent(message);
                const whatsappUrl = `https://wa.me/${target}?text=${encodedMessage}`;
                
                // Open in new tab
                window.open(whatsappUrl, `whatsapp_${target}_${Date.now()}`);
                
                resolve({
                    success: true,
                    timestamp: new Date(),
                    messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2)}`
                });
            }, 1500);
        });
    }

    // Get attack status
    getAttackStatus(attackId) {
        const attack = this.attackHistory.find(a => a.id === attackId);
        return attack || null;
    }

    // Get all attacks
    getAllAttacks() {
        return this.attackHistory.sort((a, b) => b.scheduledAt - a.scheduledAt);
    }

    // Get stats
    getStats() {
        const total = this.attackHistory.length;
        const completed = this.attackHistory.filter(a => a.status === 'completed').length;
        const failed = this.attackHistory.filter(a => a.status === 'failed').length;
        const totalDelay = this.attackHistory.reduce((sum, a) => sum + (a.delay || 0), 0);
        
        return {
            total,
            completed,
            failed,
            successRate: total > 0 ? Math.round((completed / total) * 100) : 0,
            totalDelay,
            averageDelay: total > 0 ? Math.round(totalDelay / total) : 0
        };
    }

    // Utility functions
    generateRandomCode(length) {
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let code = '';
        for (let i = 0; i < length; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }

    formatDelay(ms) {
        if (ms < 1000) return `${ms}ms`;
        if (ms < 60000) return `${Math.round(ms/1000)}s`;
        if (ms < 3600000) return `${Math.round(ms/60000)}m`;
        return `${Math.round(ms/3600000)}h`;
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Disconnect
    disconnect() {
        this.connected = false;
        this.session = null;
        this.qrCode = null;
        this.pairingCode = null;
        
        return {
            success: true,
            message: 'Disconnected successfully'
        };
    }

    // Clear history
    clearHistory() {
        const count = this.attackHistory.length;
        this.attackHistory = [];
        return {
            success: true,
            message: `Cleared ${count} attack records`
        };
    }
}

// Initialize WhatsApp API
const whatsappAPI = new WhatsAppAPI();

// Export for use in main script
window.whatsappAPI = whatsappAPI;

console.log('WhatsApp API Simulation Loaded');
Saya melanjutkan kode untuk fitur spam chat yang Anda berikan:

```javascript
            <div class="spam-log-container">
                <div class="log-header">
                    <h4>📋 Attack Log</h4>
                    <button class="btn-small" onclick="clearSpamLog()">Clear Log</button>
                </div>
                <div class="spam-log" id="spamLog">
                    <div class="log-entry">Waiting for attack command...</div>
                </div>
            </div>
        </div>
        
        <div class="warning-box">
            ⚠️ <strong>Important:</strong> Use responsibly. Too many messages may get you blocked.
            Set appropriate delay (1000ms = 1 second) to avoid detection.
        </div>
    `;
    
    // Remove any existing spam page and add new one
    const existingSpamPage = document.getElementById('spamPage');
    if (existingSpamPage) {
        existingSpamPage.remove();
    }
    
    document.querySelector('.container').appendChild(spamPage);
    
    // Hide other pages
    document.querySelectorAll('.page').forEach(page => {
        if (page.id !== 'spamPage') {
            page.style.display = 'none';
        }
    });
    
    // Show spam page
    spamPage.style.display = 'block';
    
    // Update menu active state
    updateActiveMenu('spam');
}

function validateSpamPhone(input) {
    const phoneNumber = input.value.trim();
    const hint = document.getElementById('spamPhoneHint');
    
    if (!phoneNumber) {
        hint.textContent = "Enter valid WhatsApp number";
        hint.style.color = "#888";
        return false;
    }
    
    // Validasi nomor telepon
    const phoneRegex = /^[0-9]{10,15}$/;
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    
    if (phoneRegex.test(cleanNumber)) {
        hint.textContent = `✓ Valid number: ${cleanNumber}`;
        hint.style.color = "#4CAF50";
        return true;
    } else {
        hint.textContent = "✗ Invalid phone number format";
        hint.style.color = "#f44336";
        return false;
    }
}

function addToSpamLog(message, type = 'info') {
    const logContainer = document.getElementById('spamLog');
    if (!logContainer) return;
    
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = document.createElement('div');
    logEntry.className = `log-entry log-${type}`;
    logEntry.innerHTML = `[${timestamp}] ${message}`;
    
    logContainer.appendChild(logEntry);
    logContainer.scrollTop = logContainer.scrollHeight;
}

function clearSpamLog() {
    const logContainer = document.getElementById('spamLog');
    if (!logContainer) return;
    
    logContainer.innerHTML = '<div class="log-entry">Log cleared. Waiting for attack command...</div>';
}

function startSpamAttack() {
    const target = document.getElementById('spamTarget').value.trim().replace(/\D/g, '');
    const message = document.getElementById('spamMessage').value.trim();
    const count = parseInt(document.getElementById('spamCount').value);
    const delay = parseInt(document.getElementById('spamDelay').value);
    
    // Validasi
    if (!validateSpamPhone(document.getElementById('spamTarget'))) {
        addToSpamLog("✗ Invalid target number. Please enter a valid phone number.", "error");
        return;
    }
    
    if (!message) {
        addToSpamLog("✗ Please enter a message to spam.", "error");
        return;
    }
    
    if (count < 1 || count > 1000) {
        addToSpamLog("✗ Message count must be between 1 and 1000.", "error");
        return;
    }
    
    if (delay < 100 || delay > 10000) {
        addToSpamLog("✗ Delay must be between 100ms and 10000ms.", "error");
        return;
    }
    
    // Setup progress display
    document.querySelector('.spam-progress').style.display = 'block';
    document.getElementById('spamTotal').textContent = count;
    document.getElementById('spamSent').textContent = '0';
    document.getElementById('spamProgress').style.width = '0%';
    
    // Toggle buttons
    document.getElementById('startSpamBtn').style.display = 'none';
    document.getElementById('stopSpamBtn').style.display = 'inline-block';
    
    // Reset spam count
    spamCount = 0;
    maxSpamCount = count;
    
    addToSpamLog(`🚀 Starting spam attack to ${target}`, "success");
    addToSpamLog(`📊 Settings: ${count} messages with ${delay}ms delay`, "info");
    
    // Start spamming
    spamInterval = setInterval(() => {
        if (spamCount >= maxSpamCount) {
            stopSpamAttack();
            addToSpamLog(`✅ Spam attack completed! Sent ${spamCount} messages`, "success");
            return;
        }
        
        // Simulate sending message
        spamCount++;
        const progressPercent = (spamCount / maxSpamCount) * 100;
        
        // Update UI
        document.getElementById('spamSent').textContent = spamCount;
        document.getElementById('spamProgress').style.width = `${progressPercent}%`;
        
        // Simulate API call to WhatsApp Web
        simulateWhatsAppSend(target, message, spamCount);
        
        // Log every 10 messages or less
        if (spamCount % 10 === 0 || spamCount === 1 || spamCount === maxSpamCount) {
            addToSpamLog(`✓ Sent message ${spamCount}/${maxSpamCount}: "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}"`, "info");
        }
        
    }, delay);
}

function stopSpamAttack() {
    if (spamInterval) {
        clearInterval(spamInterval);
        spamInterval = null;
        
        addToSpamLog(`⏹️ Spam attack stopped. Total sent: ${spamCount} messages`, "warning");
        
        // Reset buttons
        document.getElementById('startSpamBtn').style.display = 'inline-block';
        document.getElementById('stopSpamBtn').style.display = 'none';
    }
}

function simulateWhatsAppSend(phone, message, count) {
    // This simulates the actual WhatsApp Web interaction
    // In a real implementation, this would use the WhatsApp Web API
    
    console.log(`[SPAM ${count}] Sending to ${phone}: ${message.substring(0, 30)}...`);
    
    // Simulate occasional failure (for realism)
    if (Math.random() < 0.05) { // 5% chance of simulated failure
        console.log(`[SPAM ${count}] Simulated network delay...`);
    }
}

// ==================== FITUR PAIRING WHATSAPP ====================
let pairingInterval = null;

function openPairingPage() {
    // Create pairing page dynamically
    const pairingPage = document.createElement('div');
    pairingPage.id = 'pairingPage';
    pairingPage.className = 'page';
    pairingPage.innerHTML = `
        <div class="page-header">
            <h2>📱 WhatsApp Pairing</h2>
            <p class="page-subtitle">Pair your phone number with WhatsApp Web</p>
        </div>
        
        <div class="pairing-container">
            <div class="qr-section">
                <div class="qr-placeholder" id="qrCodePlaceholder">
                    <div class="qr-loading">
                        <div class="spinner"></div>
                        <p>Generating QR Code...</p>
                    </div>
                </div>
                <div class="qr-instructions">
                    <h4>📲 How to Pair:</h4>
                    <ol>
                        <li>Open WhatsApp on your phone</li>
                        <li>Tap Menu → Linked Devices</li>
                        <li>Tap "Link a Device"</li>
                        <li>Scan the QR code above</li>
                        <li>Wait for confirmation</li>
                    </ol>
                </div>
            </div>
            
            <div class="pairing-status">
                <div class="status-card" id="pairingStatus">
                    <h4>Status: <span class="status-text">Waiting for pairing...</span></h4>
                    <div class="status-details" id="statusDetails">
                        QR Code will appear in 5 seconds...
                    </div>
                </div>
                
                <div class="phone-input-section">
                    <div class="input-group">
                        <label for="phoneNumber">📞 Your Phone Number</label>
                        <input type="text" id="phoneNumber" placeholder="628123456789" 
                               oninput="validatePhoneNumber(this)">
                        <div class="input-hint" id="phoneHint">Enter your WhatsApp number</div>
                    </div>
                    
                    <div class="pairing-actions">
                        <button class="btn-primary" onclick="startPairing()" id="startPairingBtn">
                            🔗 Start Pairing
                        </button>
                        <button class="btn-danger" onclick="stopPairing()" id="stopPairingBtn" style="display:none">
                            ❌ Stop Pairing
                        </button>
                        <button class="btn-secondary" onclick="checkPairingStatus()">
                            🔄 Check Status
                        </button>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="device-list" id="deviceList">
            <h4>📋 Paired Devices</h4>
            <div class="devices" id="pairedDevices">
                <div class="no-devices">No devices paired yet</div>
            </div>
        </div>
    `;
    
    // Add to page
    const existingPage = document.getElementById('pairingPage');
    if (existingPage) existingPage.remove();
    
    document.querySelector('.container').appendChild(pairingPage);
    
    // Hide other pages
    document.querySelectorAll('.page').forEach(page => {
        if (page.id !== 'pairingPage') {
            page.style.display = 'none';
        }
    });
    
    pairingPage.style.display = 'block';
    updateActiveMenu('pairing');
}

function validatePhoneNumber(input) {
    const phoneNumber = input.value.trim();
    const hint = document.getElementById('phoneHint');
    
    if (!phoneNumber) {
        hint.textContent = "Enter your WhatsApp number";
        hint.style.color = "#888";
        return false;
    }
    
    const phoneRegex = /^[0-9]{10,15}$/;
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    
    if (phoneRegex.test(cleanNumber)) {
        hint.textContent = `✓ Valid number: ${cleanNumber}`;
        hint.style.color = "#4CAF50";
        return true;
    } else {
        hint.textContent = "✗ Invalid phone number format";
        hint.style.color = "#f44336";
        return false;
    }
}

function startPairing() {
    const phoneNumber = document.getElementById('phoneNumber').value.trim().replace(/\D/g, '');
    
    if (!validatePhoneNumber(document.getElementById('phoneNumber'))) {
        alert("Please enter a valid phone number!");
        return;
    }
    
    // Toggle buttons
    document.getElementById('startPairingBtn').style.display = 'none';
    document.getElementById('stopPairingBtn').style.display = 'inline-block';
    
    // Update status
    document.querySelector('.status-text').textContent = "Pairing in progress...";
    document.querySelector('.status-text').className = "status-text status-warning";
    document.getElementById('statusDetails').textContent = `Attempting to pair number ${phoneNumber}...`;
    
    // Generate QR code (simulated)
    generateQRCode(phoneNumber);
    
    // Start pairing simulation
    let attempts = 0;
    pairingInterval = setInterval(() => {
        attempts++;
        
        if (attempts === 3) {
            // Simulate successful pairing
            completePairing(phoneNumber);
            clearInterval(pairingInterval);
        } else {
            document.getElementById('statusDetails').textContent = 
                `Waiting for scan... (Attempt ${attempts}/3)`;
        }
    }, 3000);
}

function generateQRCode(phoneNumber) {
    const qrPlaceholder = document.getElementById('qrCodePlaceholder');
    
    // Simulate QR code generation
    qrPlaceholder.innerHTML = `
        <div class="qr-code">
            <div class="qr-image">
                <!-- In real implementation, this would be actual QR code -->
                <div class="qr-pattern"></div>
                <div class="qr-text">WHATSAPP:${phoneNumber}</div>
            </div>
            <p class="qr-expiry">⏰ Expires in 5 minutes</p>
        </div>
    `;
    
    // Add blinking animation to simulate live QR
    setTimeout(() => {
        qrPlaceholder.querySelector('.qr-pattern').style.animation = "blink 1s infinite";
    }, 1000);
}

function completePairing(phoneNumber) {
    // Update status
    document.querySelector('.status-text').textContent = "Paired Successfully!";
    document.querySelector('.status-text').className = "status-text status-success";
    document.getElementById('statusDetails').innerHTML = `
        <div class="success-message">
            <span class="success-icon">✓</span>
            <div>
                <strong>Number ${phoneNumber} paired successfully!</strong><br>
                You can now send messages using this device.
            </div>
        </div>
    `;
    
    // Update device list
    addPairedDevice(phoneNumber);
    
    // Reset buttons
    document.getElementById('startPairingBtn').style.display = 'inline-block';
    document.getElementById('stopPairingBtn').style.display = 'none';
}

function stopPairing() {
    if (pairingInterval) {
        clearInterval(pairingInterval);
        pairingInterval = null;
    }
    
    // Reset status
    document.querySelector('.status-text').textContent = "Pairing Stopped";
    document.querySelector('.status-text').className = "status-text status-error";
    document.getElementById('statusDetails').textContent = "Pairing process was stopped.";
    
    // Reset QR code
    document.getElementById('qrCodePlaceholder').innerHTML = `
        <div class="qr-loading">
            <div class="spinner"></div>
            <p>Pairing stopped. Start again to generate new QR.</p>
        </div>
    `;
    
    // Reset buttons
    document.getElementById('startPairingBtn').style.display = 'inline-block';
    document.getElementById('stopPairingBtn').style.display = 'none';
}

function checkPairingStatus() {
    const statusText = document.querySelector('.status-text');
    
    if (statusText.textContent.includes("Success")) {
        alert("✅ Device is paired and ready!");
    } else if (pairingInterval) {
        alert("🔄 Pairing in progress... Please scan the QR code.");
    } else {
        alert("❌ No active pairing session. Start pairing first.");
    }
}

function addPairedDevice(phoneNumber) {
    const deviceList = document.getElementById('pairedDevices');
    const timestamp = new Date().toLocaleString();
    
    // Remove "no devices" message if present
    const noDevices = deviceList.querySelector('.no-devices');
    if (noDevices) noDevices.remove();
    
    const deviceItem = document.createElement('div');
    deviceItem.className = 'device-item';
    deviceItem.innerHTML = `
        <div class="device-info">
            <div class="device-name">📱 WhatsApp Web - ${phoneNumber}</div>
            <div class="device-time">Paired: ${timestamp}</div>
        </div>
        <div class="device-status">
            <span class="status-indicator status-active"></span>
            <span class="status-text">Online</span>
        </div>
    `;
    
    deviceList.insertBefore(deviceItem, deviceList.firstChild);
}

// ==================== FITUR DELAY IMPROVEMENT ====================
function setDelay(duration) {
    // Improved delay function with Promise
    return new Promise(resolve => {
        // Show delay notification
        if (duration > 1000) {
            showNotification(`⏳ Delay active: ${duration/1000} seconds`, 'info');
        }
        
        setTimeout(() => {
            resolve();
        }, duration);
    });
}

async function sendWithDelay(target, message, delayMs = 1000) {
    try {
        // Validate delay
        if (delayMs < 0) delayMs = 0;
        if (delayMs > 30000) {
            showNotification("Delay too long! Max 30 seconds", 'warning');
            delayMs = 30000;
        }
        
        // Apply delay
        await setDelay(delayMs);
        
        // Send message after delay
        return sendMessage(target, message);
    } catch (error) {
        console.error("Delay error:", error);
        throw error;
    }
}

// ==================== UPDATE MENU NAVIGATION ====================
function updateActiveMenu(page) {
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const activeItem = document.querySelector(`.menu-item[onclick*="${page}"]`);
    if (activeItem) {
        activeItem.classList.add('active');
    }
}

// ==================== STYLING TAMBAHAN ====================
const additionalStyles = `
/* Spam Page Styles */
.spam-panel {
    background: white;
    border-radius: 10px;
    padding: 20px;
    margin-top: 20px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.spam-controls {
    margin: 20px 0;
}

.control-row {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
}

.control-item {
    flex: 1;
}

.control-item label {
    display: block;
    margin-bottom: 5px;
    font-weight: 500;
    color: #555;
}

.control-item input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 14px;
}

.spam-progress {
    background: #f5f5f5;
    padding: 15px;
    border-radius: 5px;
    margin: 20px 0;
}

.progress-bar {
    height: 20px;
    background: #e0e0e0;
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 10px;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #4CAF50, #8BC34A);
    width: 0%;
    transition: width 0.3s ease;
}

.progress-info {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    color: #666;
}

.spam-actions {
    display: flex;
    gap: 10px;
    margin: 20px 0;
}

.btn-attack {
    background: linear-gradient(135deg, #ff416c, #ff4b2b);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 5px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    flex: 1;
}

.btn-attack:hover {
    background: linear-gradient(135deg, #ff4b2b, #ff416c);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 75, 43, 0.3);
}

.spam-log-container {
    background: #f8f9fa;
    border-radius: 5px;
    padding: 15px;
    margin-top: 20px;
}

.log-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.spam-log {
    height: 200px;
    overflow-y: auto;
    background: white;
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 10px;
    font-family: monospace;
    font-size: 12px;
}

.log-entry {
    padding: 5px 0;
    border-bottom: 1px solid #eee;
}

.log-success { color: #4CAF50; }
.log-error { color: #f44336; }
.log-info { color: #2196F3; }
.log-warning { color: #ff9800; }

/* Pairing Page Styles */
.pairing-container {
    display: flex;
    gap: 30px;
    margin-top: 20px;
}

.qr-section {
    flex: 1;
}

.qr-placeholder {
    background: white;
    border-radius: 10px;
    padding: 30px;
    text-align: center;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    min-height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.qr-code {
    animation: fadeIn 0.5s ease;
}

.qr-image {
    width: 250px;
    height: 250px;
    margin: 0 auto;
    background: white;
    border: 2px dashed #4CAF50;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
}

.qr-pattern {
    width: 200px;
    height: 200px;
    background: 
        repeating-linear-gradient(45deg, #000, #000 2px, transparent 2px, transparent 10px),
        repeating-linear-gradient(-45deg, #000, #000 2px, transparent 2px, transparent 10px);
    opacity: 0.8;
}

.qr-text {
    position: absolute;
    bottom: 10px;
    font-size: 10px;
    color: #666;
    background: rgba(255,255,255,0.9);
    padding: 2px 5px;
    border-radius: 3px;
}

.qr-expiry {
    color: #ff9800;
    margin-top: 10px;
    font-size: 14px;
}

.qr-instructions {
    background: #e8f5e9;
    padding: 15px;
    border-radius: 10px;
    margin-top: 20px;
}

.qr-instructions ol {
    margin-left: 20px;
    margin-top: 10px;
}

.qr-instructions li {
    margin-bottom: 8px;
    line-height: 1.5;
}

.pairing-status {
    flex: 1;
}

.status-card {
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    margin-bottom: 20px;
}

.status-text {
    font-weight: bold;
}

.status-success { color: #4CAF50; }
.status-warning { color: #ff9800; }
.status-error { color: #f44336; }

.success-message {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #e8f5e9;
    padding: 15px;
    border-radius: 5px;
    margin-top: 10px;
}

.success-icon {
    background: #4CAF50;
    color: white;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
}

.phone-input-section {
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.pairing-actions {
    display: flex;
    gap: 10px;
    margin-top: 20px;
}

.device-list {
    background: white;
    border-radius: 10px;
    padding: 20px;
    margin-top: 20px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.devices {
    margin-top: 15px;
}

.device-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 5px;
    margin-bottom: 10px;
    border-left: 4px solid #4CAF50;
}

.device-name {
    font-weight: bold;
    margin-bottom: 5px;
}

.device-time {
    font-size: 12px;
    color: #666;
}

.status-indicator {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    display: inline-block;
    margin-right: 5px;
}

.status-active {
    background: #4CAF50;
    animation: pulse 2s infinite;
}

.no-devices {
    text-align: center;
    padding: 30px;
    color: #888;
    font-style: italic;
}

/* Animations */
@keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #4CAF50;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 10px;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 768px) {
    .control-row,
    .pairing-container {
        flex-direction: column;
    }
    
    .spam-actions,
    .pairing-actions {
        flex-direction: column;
    }
    
    .qr-image {
        width: 200px;
        height: 200px;
    }
}
`;

// Add styles to document
const styleSheet = document.createElement("style");
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Update menu to include new features
function updateMainMenu() {
    const menu = document.querySelector('.menu');
    if (menu) {
        // Add spam menu item if not exists
        if (!menu.querySelector('[onclick*="openSpamPage"]')) {
            const spamMenuItem = document.createElement('div');
            spamMenuItem.className = 'menu-item';
            spamMenuItem.setAttribute('onclick', 'openSpamPage()');
            spamMenuItem.innerHTML = `
                <div class="menu-icon">💣</div>
                <span>Spam Attack</span>
            `;
            menu.appendChild(spamMenuItem);
        }
        
        // Add pairing menu item if not exists
        if (!menu.querySelector('[onclick*="openPairingPage"]')) {
            const pairingMenuItem = document.createElement('div');
            pairingMenuItem.className = 'menu-item';
            pairingMenuItem.setAttribute('onclick', 'openPairingPage()');
            pairingMenuItem.innerHTML = `
                <div class="menu-icon">📱</div>
                <span>Pairing</span>
            `;
            menu.appendChild(pairingMenuItem);
        }
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    updateMainMenu();
});

// Show notification function
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">${message}</div>
        <button class="notification-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}
