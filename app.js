/* -------------------------------------------------------------
   GALACTIC MINEFIELD - GAME CORE LOGIC (UNIVERSAL ABILITIES)
   ------------------------------------------------------------- */

// --- SOUND SYNTHESIZER (WEB AUDIO API) ---
const SoundSynth = {
    ctx: null,
    muted: false,

    init() {
        if (!this.ctx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                this.ctx = new AudioContextClass();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    },

    playClick() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.08);

        gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.08);
    },

    playFlag() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(140, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(280, this.ctx.currentTime + 0.12);

        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.12);
    },

    playSweep() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const duration = 0.35;

        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.ctx.destination);

        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(250, now);
        osc1.frequency.linearRampToValueAtTime(1000, now + duration);

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(375, now);
        osc2.frequency.linearRampToValueAtTime(1500, now + duration);

        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        osc1.start();
        osc2.start();
        osc1.stop(now + duration);
        osc2.stop(now + duration);
    },

    playAbility() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const duration = 0.7;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAtTime(1800, now + duration);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.18, now + duration - 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        osc.start();
        osc.stop(now + duration);
    },

    playExplosion() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const duration = 1.6;

        // Create white noise
        const bufferSize = this.ctx.sampleRate * duration;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noiseNode = this.ctx.createBufferSource();
        noiseNode.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600, now);
        filter.frequency.exponentialRampToValueAtTime(15, now + duration);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.linearRampToValueAtTime(0.12, now + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        noiseNode.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        // Sub bass boom
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        bassOsc.connect(bassGain);
        bassGain.connect(this.ctx.destination);
        bassOsc.type = 'triangle';
        bassOsc.frequency.setValueAtTime(75, now);
        bassOsc.frequency.exponentialRampToValueAtTime(8, now + 0.4);
        bassGain.gain.setValueAtTime(0.35, now);
        bassGain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

        noiseNode.start();
        bassOsc.start();
        noiseNode.stop(now + duration);
        bassOsc.stop(now + 0.4);
    },

    playVictory() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const notes = [293.66, 349.23, 440.00, 587.33, 698.46, 880.00, 1174.66]; // D minor synth sweep
        const noteDuration = 0.12;

        notes.forEach((freq, index) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + index * noteDuration);

            gain.gain.setValueAtTime(0, now + index * noteDuration);
            gain.gain.linearRampToValueAtTime(0.12, now + index * noteDuration + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, now + index * noteDuration + 0.28);

            osc.start(now + index * noteDuration);
            osc.stop(now + index * noteDuration + 0.28);
        });
    },

    playAlarm() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.linearRampToValueAtTime(440, now + 0.25);
        osc.frequency.linearRampToValueAtTime(880, now + 0.5);
        osc.frequency.linearRampToValueAtTime(440, now + 0.75);
        osc.frequency.linearRampToValueAtTime(880, now + 1.0);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0.15, now + 0.8);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.0);

        osc.start();
        osc.stop(now + 1.0);
    }
};

// --- GAMESTATE STATE ENGINE ---
const GameState = {
    state: 'LANDING', // LANDING, READY, PLAYING, VICTORY, DEFEAT
    operativeName: '',
    difficulty: 'recruit',
    
    rows: 9,
    cols: 9,
    minesCount: 10,
    
    board: [],
    timer: 0,
    timerInterval: null,
    firstClickDone: false,
    startTime: null,
    
    forceSightCharges: 1,
    forceSightMaxCharges: 1,
    forceSightEnabled: true,
    
    forceBarrierCharges: 1,
    forceBarrierMaxCharges: 1,
    forceBarrierEnabled: true,
    
    targetingMode: null, // null, 'force-sight'
    
    flagsPlaced: 0,
    
    isSettingScore: false,
    tamperSequenceTriggered: false,
    securityObserver: null,
    
    activeCompetition: null,
    competitionTimer: null,

    init() {
        this.cacheDOM();
        this.bindEvents();
        this.setupSecurityObserver();
        
        // Load persisted Operative Name
        try {
            const savedName = localStorage.getItem('galactic_minefield_operative_name');
            if (savedName) {
                this.dom.playerNameInput.value = savedName;
            }
        } catch (e) {
            console.warn("localStorage is not available: ", e);
        }

        // Check for Competition URL Parameter
        const urlParams = new URLSearchParams(window.location.search);
        const compId = urlParams.get('comp');
        if (compId) {
            this.loadCompetition(compId);
        }
    },

    async loadCompetition(compId) {
        try {
            const response = await fetch('competitions.json');
            if (!response.ok) throw new Error('Could not fetch competitions data.');
            const data = await response.json();
            
            let compArray = data.competitions || data.competition;
            let compData = null;
            if (compArray && Array.isArray(compArray)) {
                compData = compArray.find(c => c.id === compId);
            } else {
                compData = data[compId];
            }
            
            if (compData) {
                this.activeCompetition = { id: compId, ...compData };
                this.difficulty = 'competition'; // Override difficulty
                
                // Set Powers Configuration
                if (this.activeCompetition.powers) {
                    if (this.activeCompetition.powers.forceSight) {
                        this.forceSightEnabled = this.activeCompetition.powers.forceSight.enabled !== false;
                        this.forceSightMaxCharges = this.activeCompetition.powers.forceSight.charges !== undefined ? this.activeCompetition.powers.forceSight.charges : 1;
                    } else {
                        this.forceSightEnabled = false;
                        this.forceSightMaxCharges = 0;
                    }
                    if (this.activeCompetition.powers.forceBarrier) {
                        this.forceBarrierEnabled = this.activeCompetition.powers.forceBarrier.enabled !== false;
                        this.forceBarrierMaxCharges = this.activeCompetition.powers.forceBarrier.charges !== undefined ? this.activeCompetition.powers.forceBarrier.charges : 1;
                    } else {
                        this.forceBarrierEnabled = false;
                        this.forceBarrierMaxCharges = 0;
                    }
                }
                
                // Start/End Time Logic
                if (this.activeCompetition.startTime || this.activeCompetition.endTime) {
                    this.startCompetitionTimer();
                }
                
                // Lock UI
                const diffSelectors = document.querySelector('.selector-group');
                if (diffSelectors) {
                    diffSelectors.innerHTML = `
                        <label>ACTIVE COMPETITION:</label>
                        <div class="comp-banner" style="padding: 10px; border: 1px solid var(--holo-cyan); border-radius: 4px; text-align: center; color: var(--holo-cyan); text-shadow: 0 0 8px var(--holo-cyan); margin-bottom: 20px; font-weight: 700;">
                            ${this.activeCompetition.name}
                        </div>
                    `;
                }
            } else {
                console.warn('Competition not found.');
            }
        } catch (e) {
            console.error("Error loading competition:", e);
        }
    },

    startCompetitionTimer() {
        const updateStatus = () => {
            const now = new Date().getTime();
            let start = this.activeCompetition.startTime ? new Date(this.activeCompetition.startTime).getTime() : null;
            let end = this.activeCompetition.endTime ? new Date(this.activeCompetition.endTime).getTime() : null;

            if (start && now < start) {
                this.dom.launchBtn.disabled = true;
                this.dom.compStatusContainer.style.display = 'block';
                const diff = start - now;
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const secs = Math.floor((diff % (1000 * 60)) / 1000);
                this.dom.compStatusText.textContent = `STARTS IN: ${hours}h ${mins}m ${secs}s`;
                this.dom.compStatusText.style.color = 'var(--warning-yellow)';
                this.dom.compStatusText.style.textShadow = '0 0 5px var(--warning-yellow)';
                this.dom.launchBtn.textContent = 'STANDBY';
            } else if (end && now > end) {
                this.dom.launchBtn.disabled = true;
                this.dom.compStatusContainer.style.display = 'block';
                this.dom.compStatusText.textContent = 'COMPETITION HAS EXPIRED';
                this.dom.compStatusText.style.color = 'var(--sith-red)';
                this.dom.compStatusText.style.textShadow = '0 0 5px var(--sith-red)';
                this.dom.launchBtn.textContent = 'EXPIRED';
                if (this.competitionTimer) clearInterval(this.competitionTimer);
            } else {
                this.dom.launchBtn.disabled = false;
                this.dom.launchBtn.textContent = 'LAUNCH MISSION';
                this.dom.compStatusContainer.style.display = 'none';
                if (!end && this.competitionTimer) {
                    clearInterval(this.competitionTimer);
                }
            }
        };

        updateStatus();
        if (this.competitionTimer) clearInterval(this.competitionTimer);
        this.competitionTimer = setInterval(updateStatus, 1000);
    },

    cacheDOM() {
        this.dom = {
            soundToggle: document.getElementById('sound-toggle-btn'),
            soundStatus: document.getElementById('sound-status-text'),
            landingScreen: document.getElementById('landing-screen'),
            gameplayScreen: document.getElementById('gameplay-screen'),
            gameoverModal: document.getElementById('gameover-modal'),
            
            playerNameInput: document.getElementById('player-name'),
            launchBtn: document.getElementById('launch-btn'),
            
            hudPlayerName: document.getElementById('hud-player-name'),
            hudMissionName: document.getElementById('hud-mission-name'),
            timerDisplay: document.getElementById('timer-display'),
            mineCounterDisplay: document.getElementById('mine-counter-display'),
            
            statusBar: document.getElementById('status-bar'),
            statusMessage: document.getElementById('status-message'),
            
            reportTitle: document.querySelector('.report-header h2'),
            reportName: document.getElementById('report-name'),
            reportOutcome: document.getElementById('report-outcome'),
            reportTime: document.getElementById('report-time'),
            mineGrid: document.getElementById('mine-grid'),
            boardWrapper: document.getElementById('board-wrapper'),
            
            compStatusContainer: document.getElementById('comp-status-container'),
            compStatusText: document.getElementById('comp-status-text'),
            
            soundToggle: document.getElementById('sound-toggle-btn'),
            forceSightBtn: document.getElementById('force-sight-btn'),
            forceSightBtnText: document.getElementById('force-sight-btn-text'),
            forceBarrierStatus: document.getElementById('force-barrier-status'),
            forceBarrierStatusText: document.getElementById('force-barrier-status-text'),
            
            abortBtn: document.getElementById('abort-btn'),
            retryBtn: document.getElementById('retry-btn'),
            
            reportName: document.getElementById('report-name'),
            reportOutcome: document.getElementById('report-outcome'),
            reportTime: document.getElementById('report-time'),
            reportMinesSecured: document.getElementById('report-mines-secured'),
            reportScore: document.getElementById('report-score'),
            reportHighscore: document.getElementById('report-highscore'),
            scoreExplanation: document.getElementById('score-explanation'),
            reportStampText: document.getElementById('report-stamp-text'),
            missionReportBox: document.getElementById('mission-report-box')
        };
    },

    bindEvents() {
        // Sound toggle
        this.dom.soundToggle.addEventListener('click', () => this.toggleSound());

        // Difficulty select buttons
        const diffBtns = document.querySelectorAll('.diff-btn');
        diffBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                diffBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.difficulty = btn.dataset.diff;
                SoundSynth.playClick();
            });
        });

        // Launch Game
        this.dom.launchBtn.addEventListener('click', () => this.launchGame());

        // Board interaction (Left & Right clicks)
        this.dom.mineGrid.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            if (this.state !== 'PLAYING') return;
            
            const cellElement = e.target.closest('.cell');
            if (!cellElement) return;
            
            const r = parseInt(cellElement.dataset.row);
            const c = parseInt(cellElement.dataset.col);
            this.rightClickCell(r, c);
        });

        this.dom.mineGrid.addEventListener('click', (e) => {
            if (this.state !== 'PLAYING' && this.state !== 'READY') return;
            
            const cellElement = e.target.closest('.cell');
            if (!cellElement) return;
            
            const r = parseInt(cellElement.dataset.row);
            const c = parseInt(cellElement.dataset.col);
            
            if (e.shiftKey) {
                e.preventDefault();
                this.shiftClickCell(r, c);
            } else {
                this.leftClickCell(r, c);
            }
        });

        // Double-click/chord support on revealed numbers
        this.dom.mineGrid.addEventListener('dblclick', (e) => {
            if (this.state !== 'PLAYING') return;
            const cellElement = e.target.closest('.cell');
            if (!cellElement) return;
            
            const r = parseInt(cellElement.dataset.row);
            const c = parseInt(cellElement.dataset.col);
            this.chordCell(r, c);
        });

        // Ability buttons clicks
        this.dom.forceSightBtn.addEventListener('click', () => this.activateForceSight());

        // Abort / Retry Game
        this.dom.abortBtn.addEventListener('click', () => this.abortMission());
        this.dom.retryBtn.addEventListener('click', () => this.retryMission());
    },

    toggleSound() {
        SoundSynth.muted = !SoundSynth.muted;
        if (SoundSynth.muted) {
            this.dom.soundStatus.textContent = 'AUDIO: OFF';
            this.dom.soundToggle.classList.add('muted');
            this.dom.soundToggle.querySelector('.sound-icon').textContent = '🔇';
        } else {
            SoundSynth.init();
            this.dom.soundStatus.textContent = 'AUDIO: ON';
            this.dom.soundToggle.classList.remove('muted');
            this.dom.soundToggle.querySelector('.sound-icon').textContent = '🔊';
            SoundSynth.playClick();
        }
    },

    launchGame() {
        // Validate operative name
        const nameVal = this.dom.playerNameInput.value.trim();
        if (!nameVal) {
            this.dom.playerNameInput.focus();
            this.dom.playerNameInput.classList.add('error');
            setTimeout(() => this.dom.playerNameInput.classList.remove('error'), 1000);
            return;
        }

        SoundSynth.init();
        SoundSynth.playSweep();

        this.operativeName = nameVal;
        
        // Persist Operative Name
        try {
            localStorage.setItem('galactic_minefield_operative_name', nameVal);
        } catch (e) {
            console.warn("localStorage is not available: ", e);
        }
        
        // Setup Grid boundaries based on difficulty
        if (this.difficulty === 'recruit') {
            this.rows = 9;
            this.cols = 9;
            this.minesCount = 10;
        } else if (this.difficulty === 'veteran') {
            this.rows = 16;
            this.cols = 16;
            this.minesCount = 40;
        } else if (this.difficulty === 'commando') {
            this.rows = 24;
            this.cols = 24;
            this.minesCount = 99;
        } else if (this.difficulty === 'competition' && this.activeCompetition) {
            this.rows = this.activeCompetition.difficulty.rows;
            this.cols = this.activeCompetition.difficulty.cols;
            this.minesCount = this.activeCompetition.difficulty.mines;
        }

        // Reset state values
        this.timer = 0;
        this.firstClickDone = false;
        this.startTime = null;
        this.forceSightCharges = this.forceSightEnabled ? this.forceSightMaxCharges : 0;
        this.forceBarrierCharges = this.forceBarrierEnabled ? this.forceBarrierMaxCharges : 0;
        this.targetingMode = null;
        this.flagsPlaced = 0;
        
        // Reset security state and styling
        this.isSettingScore = true;
        this.tamperSequenceTriggered = false;
        document.body.classList.remove('slicer-emergency');
        this.dom.reportScore.style.color = '';
        this.dom.reportScore.style.textShadow = '';
        this.dom.reportScore.classList.remove('compromised-text');
        this.dom.reportName.style.color = '';
        this.dom.reportName.style.textShadow = '';
        this.dom.scoreExplanation.style.color = '';
        setTimeout(() => {
            this.isSettingScore = false;
        }, 0);
        
        // Update HUD operative display details
        this.dom.hudPlayerName.textContent = this.operativeName.toUpperCase();

        let missionName = 'STANDARD OPERATIONS';
        if (this.difficulty === 'competition' && this.activeCompetition) {
            missionName = this.activeCompetition.name;
        } else {
            missionName = this.difficulty.toUpperCase();
        }
        if (this.dom.hudMissionName) {
            this.dom.hudMissionName.textContent = missionName;
        }

        // Setup HUD readouts
        this.dom.timerDisplay.textContent = '000';
        this.dom.mineCounterDisplay.textContent = String(this.minesCount).padStart(3, '0');

        this.state = 'READY';
        this.createBoardHTML();
        this.updateAbilityButtonUI();
        this.updateStatusMessage("SECTOR MAP GENERATED. SCAN AN INITIAL SECTOR TO DEPLOY MINESWEPT.");

        // Transitions
        this.dom.landingScreen.classList.remove('visible');
        this.dom.gameplayScreen.classList.add('visible');
    },

    createBoardHTML() {
        this.dom.mineGrid.style.gridTemplateColumns = `repeat(${this.cols}, 1fr)`;
        this.dom.mineGrid.style.gridTemplateRows = `repeat(${this.rows}, 1fr)`;
        this.dom.mineGrid.innerHTML = '';
        
        this.board = [];

        // Scale tiles size so they fit in viewport nicely
        let cellSize = '32px';
        if (this.cols > 16) {
            cellSize = '26px';
        } else if (this.cols > 9) {
            cellSize = '30px';
        }
        
        for (let r = 0; r < this.rows; r++) {
            const rowData = [];
            for (let c = 0; c < this.cols; c++) {
                const cellObj = {
                    row: r,
                    col: c,
                    isMine: false,
                    isRevealed: false,
                    isFlagged: false,
                    isShielded: false,
                    neighborMines: 0
                };
                rowData.push(cellObj);

                // Create DOM element
                const cellEl = document.createElement('div');
                cellEl.classList.add('cell');
                cellEl.style.width = cellSize;
                cellEl.style.height = cellSize;
                cellEl.dataset.row = r;
                cellEl.dataset.col = c;
                
                this.dom.mineGrid.appendChild(cellEl);
            }
            this.board.push(rowData);
        }
    },

    generateMines(clickRow, clickCol) {
        let placedMines = 0;
        
        while (placedMines < this.minesCount) {
            const r = Math.floor(Math.random() * this.rows);
            const c = Math.floor(Math.random() * this.cols);

            // First-click safety rules:
            const isClickSector = (Math.abs(r - clickRow) <= 1 && Math.abs(c - clickCol) <= 1);
            
            if (!this.board[r][c].isMine && !isClickSector) {
                this.board[r][c].isMine = true;
                placedMines++;
            }
        }

        // Calculate Neighbor Adjacency Numbers
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (this.board[r][c].isMine) continue;
                
                let count = 0;
                this.getNeighbors(r, c).forEach(n => {
                    if (n.isMine) count++;
                });
                this.board[r][c].neighborMines = count;
            }
        }
    },

    getNeighbors(r, c) {
        const neighbors = [];
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) continue;
                const nr = r + dr;
                const nc = c + dc;
                if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols) {
                    neighbors.push(this.board[nr][nc]);
                }
            }
        }
        return neighbors;
    },

    getCellDOM(r, c) {
        return this.dom.mineGrid.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
    },

    updateStatusMessage(msg, type = 'holo-cyan') {
        this.dom.statusMessage.textContent = msg.toUpperCase();
        this.dom.statusBar.style.color = `var(--${type})`;
        this.dom.statusBar.style.borderColor = `var(--${type})`;
    },

    startTimer() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => {
            if (this.state === 'PLAYING') {
                this.timer++;
                this.dom.timerDisplay.textContent = String(this.timer).padStart(3, '0');
            }
        }, 1000);
    },

    // --- GAMEPLAY MECHANICS ---
    leftClickCell(r, c) {
        // Handle active targeting abilities first
        if (this.targetingMode) {
            this.handleTargetingAbilityClick(r, c);
            return;
        }

        const cell = this.board[r][c];
        if (cell.isRevealed || cell.isFlagged) return;

        // First click generation
        if (!this.firstClickDone) {
            this.firstClickDone = true;
            this.state = 'PLAYING';
            this.generateMines(r, c);
            this.startTimer();
            this.startTime = Date.now();
            this.updateAbilityButtonUI();
            this.updateStatusMessage("SHIELDS ACTIVE. SWEEP THE FIELD.");
        }

        if (cell.isMine) {
            this.handleMineHit(r, c);
        } else {
            SoundSynth.playClick();
            this.revealCell(r, c);
            this.checkVictory();
        }
    },

    rightClickCell(r, c) {
        if (!this.firstClickDone) return;
        
        const cell = this.board[r][c];
        if (cell.isRevealed || cell.isShielded) return;

        cell.isFlagged = !cell.isFlagged;
        const cellDOM = this.getCellDOM(r, c);

        if (cell.isFlagged) {
            this.flagsPlaced++;
            cellDOM.classList.add('flagged');
            cellDOM.innerHTML = `
                <svg class="reticle-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="2" />
                    <circle cx="12" cy="12" r="2" fill="currentColor" />
                    <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                </svg>
            `;
            SoundSynth.playFlag();
        } else {
            this.flagsPlaced--;
            cellDOM.classList.remove('flagged');
            cellDOM.innerHTML = '';
            SoundSynth.playFlag();
        }

        const remaining = this.minesCount - this.flagsPlaced;
        this.dom.mineCounterDisplay.textContent = String(remaining).padStart(3, '0');
    },

    chordCell(r, c) {
        const cell = this.board[r][c];
        if (!cell.isRevealed || cell.neighborMines === 0) return;

        const neighbors = this.getNeighbors(r, c);
        let flagCount = 0;
        neighbors.forEach(n => {
            if (n.isFlagged) flagCount++;
        });

        if (flagCount === cell.neighborMines) {
            SoundSynth.playClick();
            neighbors.forEach(n => {
                if (!n.isRevealed && !n.isFlagged) {
                    if (n.isMine) {
                        this.handleMineHit(n.row, n.col);
                    } else {
                        this.revealCell(n.row, n.col);
                    }
                }
            });
            this.checkVictory();
        }
    },

    shiftClickCell(r, c) {
        const cell = this.board[r][c];
        if (!cell.isRevealed || cell.neighborMines === 0) return;

        const neighbors = this.getNeighbors(r, c);
        
        // 1. Highlight all adjacent unrevealed cells
        neighbors.forEach(n => {
            if (!n.isRevealed) {
                const dom = this.getCellDOM(n.row, n.col);
                if (dom) {
                    dom.classList.add('neighbor-highlight');
                    setTimeout(() => dom.classList.remove('neighbor-highlight'), 600);
                }
            }
        });

        // 2. Clear non-flagged cells if adjacent flags match the number
        let flagCount = 0;
        neighbors.forEach(n => {
            if (n.isFlagged) flagCount++;
        });

        if (flagCount === cell.neighborMines) {
            SoundSynth.playClick();
            let hitMine = false;
            let explodeRow = -1;
            let explodeCol = -1;

            neighbors.forEach(n => {
                if (!n.isRevealed && !n.isFlagged) {
                    if (n.isMine) {
                        hitMine = true;
                        explodeRow = n.row;
                        explodeCol = n.col;
                    } else {
                        this.revealCell(n.row, n.col);
                    }
                }
            });

            if (hitMine) {
                this.handleMineHit(explodeRow, explodeCol);
            } else {
                this.checkVictory();
            }
        }
    },

    handleMineHit(r, c) {
        // Mine clicked! Check for Force Barrier
        if (this.forceBarrierCharges > 0) {
            this.forceBarrierCharges--;
            const cell = this.board[r][c];
            
            // Mark cell as shielded
            cell.isFlagged = true;
            this.flagsPlaced++;
            
            // Re-render cell to show shield
            this.renderCell(cell);
            
            // Update UI
            this.updateAbilityButtonUI();
            this.dom.mineCounterDisplay.textContent = `${this.flagsPlaced} / ${this.minesCount}`;
            this.updateStatusMessage('FORCE BARRIER DEPLOYED', 'holo-cyan');
            SoundSynth.playPowerActivate();
            
            this.checkVictory();
            return;
        }

        this.triggerDefeat(r, c);
    },

    renderCell(cell) {
        const cellDOM = this.getCellDOM(cell.row, cell.col);
        cellDOM.classList.add('shielded-mine');
        cellDOM.innerHTML = `
            <svg class="mine-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="6" fill="currentColor" />
                <path d="M12 2v20M2 12h20M5 5l14 14M5 19L19 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                <circle cx="12" cy="12" r="3" fill="none" stroke="#fff" stroke-width="1" opacity="0.5" />
            </svg>
            <svg class="forcefield-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 2" />
            </svg>
        `;
    },

    revealCell(r, c) {
        const cell = this.board[r][c];
        if (cell.isRevealed || cell.isFlagged) return;

        cell.isRevealed = true;
        const cellDOM = this.getCellDOM(r, c);
        cellDOM.classList.add('revealed');

        if (cell.neighborMines > 0) {
            cellDOM.textContent = cell.neighborMines;
            cellDOM.classList.add(`num-${cell.neighborMines}`);
        } else {
            this.getNeighbors(r, c).forEach(n => {
                if (!n.isRevealed && !n.isFlagged) {
                    this.revealCell(n.row, n.col);
                }
            });
        }
    },

    checkVictory() {
        let safeCellsRevealed = 0;
        const totalSafeCells = (this.rows * this.cols) - this.minesCount;

        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (this.board[r][c].isRevealed && !this.board[r][c].isMine) {
                    safeCellsRevealed++;
                }
            }
        }

        if (safeCellsRevealed === totalSafeCells) {
            this.triggerVictory();
        }
    },

    // --- GAME OVER OUTCOMES ---
    triggerVictory() {
        this.state = 'VICTORY';
        if (this.timerInterval) clearInterval(this.timerInterval);
        
        SoundSynth.playVictory();

        // Auto-flag remaining hidden mines
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                const cell = this.board[r][c];
                if (cell.isMine && !cell.isFlagged) {
                    cell.isFlagged = true;
                    const cellDOM = this.getCellDOM(r, c);
                    cellDOM.classList.add('flagged');
                    cellDOM.innerHTML = `
                        <svg class="reticle-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="2" />
                            <circle cx="12" cy="12" r="2" fill="currentColor" />
                            <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                        </svg>
                    `;
                }
            }
        }
        
        this.flagsPlaced = this.minesCount;
        this.dom.mineCounterDisplay.textContent = '000';
        this.updateStatusMessage("GRID DISARMED. MISSION ACCOMPLISHED.", 'jedi-green');

        setTimeout(() => this.showMissionReport(true), 1500);
    },

    triggerDefeat(explodedRow, explodedCol) {
        this.state = 'DEFEAT';
        if (this.timerInterval) clearInterval(this.timerInterval);

        SoundSynth.playExplosion();

        // Reveal all mines
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                const cell = this.board[r][c];
                const cellDOM = this.getCellDOM(r, c);

                if (cell.isMine) {
                    if (!cell.isFlagged) {
                        cellDOM.classList.add('mine');
                        cellDOM.innerHTML = `
                            <svg class="mine-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="6" fill="currentColor" />
                                <path d="M12 2v20M2 12h20M5 5l14 14M5 19L19 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                                <circle cx="12" cy="12" r="3" fill="none" stroke="#fff" stroke-width="1" opacity="0.5" />
                            </svg>
                        `;
                        if (r === explodedRow && c === explodedCol) {
                            cellDOM.style.background = 'radial-gradient(circle, var(--sith-red) 0%, #150507 100%)';
                        }
                    }
                } else if (cell.isFlagged) {
                    cellDOM.classList.add('wrong-flag');
                }
            }
        }

        this.updateStatusMessage("GRID MELTDOWN. MISSION FAILURE.", 'sith-red');

        setTimeout(() => this.showMissionReport(false), 2000);
    },

    showMissionReport(isVictory) {
        // Check if the timer has been tampered with in-memory
        if (this.startTime) {
            const actualSeconds = Math.round((Date.now() - this.startTime) / 1000);
            if (this.timer < actualSeconds - 3) {
                this.dom.gameoverModal.classList.add('visible');
                this.triggerAntiTamperSequence();
                return;
            }
        }

        this.dom.reportPanel = this.dom.gameoverModal.querySelector('.report-panel');
        this.dom.reportPanel.className = 'modal-content report-panel'; // reset outcome classes
        
        if (isVictory) {
            this.dom.reportPanel.classList.add('success');
            this.dom.reportOutcome.textContent = 'SUCCESS';
            this.dom.reportOutcome.className = 'rep-value glow-text-green';
            this.dom.reportStampText.textContent = 'SUCCESS';
        } else {
            this.dom.reportPanel.classList.add('failure');
            this.dom.reportOutcome.textContent = 'FAILURE';
            this.dom.reportOutcome.className = 'rep-value glow-text-red';
            this.dom.reportStampText.textContent = 'FAILURE';
        }

        this.dom.reportName.textContent = this.operativeName.toUpperCase();
        this.dom.reportTime.textContent = `${this.timer} SECONDS`;

        // Calculate correct flags count
        let correctFlags = 0;
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (this.board[r][c].isMine && this.board[r][c].isFlagged) {
                    correctFlags++;
                }
            }
        }
        this.dom.reportMinesSecured.textContent = `${correctFlags} / ${this.minesCount}`;

        // Score formula
        let finalScore = 0;
        let explanationParts = [];
        
        if (isVictory) {
            finalScore = this.timer;
            explanationParts.push(`Time (${this.timer})`);
        } else {
            const unsecuredMines = this.minesCount - correctFlags;
            const failurePenalty = 1000;
            const minePenalty = unsecuredMines * 50;
            finalScore = this.timer + failurePenalty + minePenalty;
            explanationParts.push(`Time (${this.timer})`);
            explanationParts.push(`Failure Penalty (${failurePenalty})`);
            explanationParts.push(`Unsecured Mines (${minePenalty})`);
        }

        // Add Force Powers Penalties
        const forceSightPenalty = (this.forceSightMaxCharges - this.forceSightCharges) * 10;
        const forceBarrierPenalty = (this.forceBarrierMaxCharges - this.forceBarrierCharges) * 10;
        finalScore += forceSightPenalty + forceBarrierPenalty;
        if (forceBarrierPenalty > 0) explanationParts.push(`Force Barrier (${forceBarrierPenalty})`);
        if (forceSightPenalty > 0) explanationParts.push(`Force Sight (${forceSightPenalty})`);

        this.isSettingScore = true;
        this.dom.reportScore.textContent = finalScore;
        this.dom.scoreExplanation.textContent = `Score = ${explanationParts.join(' + ')} (Lower is better)`;
        setTimeout(() => {
            this.isSettingScore = false;
        }, 0);

        // Check and update High Score (Records are only updated on successful missions)
        let recordKey = 'galactic_minefield_highscore_' + this.difficulty;
        if (this.activeCompetition) {
            recordKey = 'galactic_minefield_highscore_comp_' + this.activeCompetition.id;
            this.dom.reportTitle.textContent = `${this.activeCompetition.name.toUpperCase()} REPORT`;
        } else {
            this.dom.reportTitle.textContent = "DEBRIS FIELD MISSION REPORT";
        }
        
        let isNewRecord = false;
        try {
            const savedHS = localStorage.getItem(recordKey);
            if (isVictory) {
                if (!savedHS || finalScore < parseInt(savedHS)) {
                    localStorage.setItem(recordKey, finalScore);
                    isNewRecord = true;
                }
            }
            const currentRecord = localStorage.getItem(recordKey);
            if (currentRecord) {
                this.dom.reportHighscore.textContent = isNewRecord 
                    ? `${currentRecord} POINTS (NEW RECORD!)` 
                    : `${currentRecord} POINTS`;
            } else {
                this.dom.reportHighscore.textContent = 'NO RECORD SET';
            }
        } catch (e) {
            console.warn("localStorage is not available: ", e);
            this.dom.reportHighscore.textContent = 'N/A';
        }

        // Open Modal
        this.dom.gameoverModal.classList.add('visible');
    },

    abortMission() {
        SoundSynth.playClick();
        if (this.timerInterval) clearInterval(this.timerInterval);
        
        // Reset screens
        this.dom.gameplayScreen.classList.remove('visible');
        this.dom.landingScreen.classList.add('visible');
        this.state = 'LANDING';
    },

    retryMission() {
        SoundSynth.playClick();
        this.dom.gameoverModal.classList.remove('visible');
        this.launchGame();
    },

    // --- UNIVERSAL ABILITIES CONTROL PANEL ---
    updateAbilityButtonUI() {
        // 1. Force Sight/Barrier Button UI
        if (this.state === 'READY' || this.state === 'LANDING') {
            this.dom.forceSightBtn.disabled = true;
            this.dom.forceSightBtnText.textContent = this.forceSightEnabled ? 'UNAVAILABLE' : 'DISABLED';
            
            this.dom.forceBarrierStatus.className = 'ability-status-box offline';
            this.dom.forceBarrierStatusText.textContent = this.forceBarrierEnabled ? 'UNAVAILABLE' : 'DISABLED';
            return;
        }

        // Force Sight UI Update
        if (!this.forceSightEnabled) {
            this.dom.forceSightBtn.disabled = true;
            this.dom.forceSightBtnText.textContent = 'DISABLED';
            this.dom.forceSightBtn.classList.remove('targeting-active');
        } else if (this.forceSightCharges <= 0) {
            this.dom.forceSightBtn.disabled = true;
            this.dom.forceSightBtnText.textContent = 'FORCE SIGHT DEPLETED';
            this.dom.forceSightBtn.classList.remove('targeting-active');
        } else {
            this.dom.forceSightBtn.disabled = false;
            if (this.targetingMode === 'force-sight') {
                this.dom.forceSightBtnText.textContent = 'SELECT TARGET CELL';
                this.dom.forceSightBtn.classList.add('targeting-active');
            } else {
                let chargesText = this.forceSightMaxCharges > 1 ? `ACTIVATE (${this.forceSightCharges})` : 'ACTIVATE';
                this.dom.forceSightBtnText.textContent = chargesText;
                this.dom.forceSightBtn.classList.remove('targeting-active');
            }
        }

        // Force Barrier UI Update
        if (!this.forceBarrierEnabled) {
            this.dom.forceBarrierStatus.className = 'ability-status-box offline';
            this.dom.forceBarrierStatusText.textContent = 'DISABLED';
        } else if (this.forceBarrierCharges <= 0) {
            this.dom.forceBarrierStatus.className = 'ability-status-box depleted';
            this.dom.forceBarrierStatusText.textContent = 'FORCE BARRIER DEPLETED';
        } else {
            this.dom.forceBarrierStatus.className = 'ability-status-box';
            let chargesText = this.forceBarrierMaxCharges > 1 ? `READY (${this.forceBarrierCharges})` : 'READY';
            this.dom.forceBarrierStatusText.textContent = chargesText;
        }
    },

    activateForceSight() {
        if (!this.forceSightEnabled || this.forceSightCharges <= 0 || this.state !== 'PLAYING') return;
        SoundSynth.playClick();
        
        if (this.targetingMode === 'force-sight') {
            this.exitTargetingMode();
        } else {
            this.enterTargetingMode('force-sight');
        }
    },

    enterTargetingMode(mode) {
        this.targetingMode = mode;
        this.dom.boardWrapper.classList.add('targeting-mode');
        this.updateAbilityButtonUI();
        
        let msg = "Select target cell on grid...";
        if (mode === 'force-sight') msg = "Force Sight Active: Click an unrevealed cell to clear 3x3 sector.";
        
        this.updateStatusMessage(msg, 'warning-yellow');
    },

    exitTargetingMode() {
        this.targetingMode = null;
        this.dom.boardWrapper.classList.remove('targeting-mode');
        this.updateAbilityButtonUI();
        this.updateStatusMessage("SHIELDS ACTIVE. SWEEP THE FIELD.");
    },

    handleTargetingAbilityClick(r, c) {
        const mode = this.targetingMode;
        
        if (mode === 'force-sight') {
            // Force sight must target an unrevealed cell
            const cell = this.board[r][c];
            if (cell.isRevealed) {
                this.updateAbilityButtonUI();
                this.updateStatusMessage('TARGETING MODE CANCELED', 'holo-cyan');
                SoundSynth.playClick();
            } else {
                this.forceSightCharges--;
                this.executeForceSight(r, c);
            }
        }

        this.exitTargetingMode();
        this.checkVictory();
    },

    // --- INDIVIDUAL ACTIONS ---

    // 1. Force Sight: safe clears 3x3 block, auto-flags mines
    executeForceSight(centerRow, centerCol) {
        SoundSynth.playAbility();
        this.showFloatingHUDAlert("👁️ FORCE SIGHT ACTIVE: scanning 3x3 sector.");

        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                const nr = centerRow + dr;
                const nc = centerCol + dc;

                if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols) {
                    const cell = this.board[nr][nc];
                    
                    if (cell.isMine) {
                        if (!cell.isFlagged) {
                            cell.isFlagged = true;
                            this.flagsPlaced++;
                            
                            const cellDOM = this.getCellDOM(nr, nc);
                            cellDOM.classList.add('flagged');
                            cellDOM.innerHTML = `
                                <svg class="reticle-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="2" />
                                    <circle cx="12" cy="12" r="2" fill="currentColor" />
                                    <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                                </svg>
                            `;
                        }
                    } else {
                        this.revealCell(nr, nc);
                    }
                }
            }
        }

        const remaining = this.minesCount - this.flagsPlaced;
        this.dom.mineCounterDisplay.textContent = String(remaining).padStart(3, '0');
    },

    // --- FLOATING HUD ALERTS UTILITY ---
    showFloatingHUDAlert(msg) {
        const oldAlert = document.querySelector('.hud-alert');
        if (oldAlert) oldAlert.remove();

        const alertEl = document.createElement('div');
        alertEl.classList.add('hud-alert');
        alertEl.innerHTML = `
            <span class="hud-alert-icon">📡</span>
            <span class="hud-alert-text">${msg.toUpperCase()}</span>
        `;
        document.body.appendChild(alertEl);

        setTimeout(() => {
            if (alertEl.parentNode) alertEl.remove();
        }, 5000);
    },

    // --- DOM ANTI-TAMPER SECURITY ---
    setupSecurityObserver() {
        if (this.securityObserver) return;

        this.securityObserver = new MutationObserver((mutations) => {
            if (this.isSettingScore) return;
            this.triggerAntiTamperSequence();
        });

        // Observe text modifications, child nodes, attribute changes
        this.securityObserver.observe(this.dom.reportScore, {
            childList: true,
            characterData: true,
            subtree: true,
            attributes: false
        });
    },

    triggerAntiTamperSequence() {
        if (this.tamperSequenceTriggered) return;
        this.tamperSequenceTriggered = true;

        SoundSynth.playAlarm();

        // 1. Instantly override the reportScore DOM with glitch warning text
        this.isSettingScore = true;
        this.dom.reportScore.textContent = "⚠️ SLICER_DETECTED";
        this.dom.reportScore.style.color = "var(--sith-red)";
        this.dom.reportScore.style.textShadow = "0 0 10px var(--sith-red)";
        this.dom.reportScore.classList.add('compromised-text');

        setTimeout(() => {
            this.isSettingScore = false;
        }, 100);

        // 2. Glitch the Operative Name & Status
        this.dom.reportName.textContent = "COMPROMISED ENTITY";
        this.dom.reportName.style.color = "var(--sith-red)";
        this.dom.reportName.style.textShadow = "0 0 5px var(--sith-red)";

        this.dom.reportOutcome.textContent = "SECURITY VIOLATION";
        this.dom.reportOutcome.className = 'rep-value glow-text-red compromised-blink';

        this.dom.reportStampText.textContent = "SLICER ALERT";

        // 3. Glitch the score explanation
        this.dom.scoreExplanation.textContent = "⚠️ DATA INTEGRITY BREACH: SECURE PROTOCOLS INITIATED. THREAT NEUTRALIZED.";
        this.dom.scoreExplanation.style.color = "var(--sith-red)";

        // 4. Show warning HUD alert
        this.showFloatingHUDAlert("🚨 WARNING: FORGED DATA DETECTED. SYSTEM LOCKDOWN!");

        // 5. Add body emergency class for strobe animations
        document.body.classList.add('slicer-emergency');
    }
};

// Start logic when DOM completes loading
document.addEventListener('DOMContentLoaded', () => {
    GameState.init();
});
