# 🌌 Galactic Minefield

A sleek, client-side, **Star Wars themed single-player Minesweeper web application** featuring interactive visuals, space-industrial aesthetics, synthesized sound effects, special player abilities, and local score keeping. 

---

## 🚀 Features

* **Sleek Space-Industrial Interface:** A retro-futuristic dark mode inspired by Star Wars computer terminal consoles, complete with glowing borders, HSL colors, metallic elements, scanline effects, and CSS micro-animations.
* **First-Click Safety:** Rest assured that your first click in the minefield will never trigger a mine. The layout generated dynamically sets a 3x3 safe zone around your starting position.
* **Force Abilities & Shields:**
  * **Force Sight (Active - 10pt score penalty):** Safely clears and reveals a 3x3 block around a target unrevealed cell. Any hidden mines inside that 3x3 block are automatically flagged without detonating.
  * **Force Barrier (Passive - 10pt score penalty):** Prevents a loss the first time you click a mine. The mine is automatically shielded (with a blue forcefield) and flagged.
* **QoL Controls & Shift-Click Chording:**
  * **Shift-Click Highlight:** Shift-clicking a revealed number cell highlights all 8 surrounding cells with a distinct cyan glow to help you visualize adjacent sectors.
  * **Chording Sweep:** If the count of flags surrounding a number cell matches the number itself, Shift-clicking will automatically sweep (clear) all remaining unflagged adjacent tiles. *Warning: If flags are incorrectly placed, this sweep will detonate a mine and fail the mission!*
* **Dynamic Audio Synthesis:** Integrates the Web Audio API to play synthesized retro sound effects for clicks, scan sweeps, sector flagging, high-energy explosions, and victory fanfares directly in your browser without requiring external audio asset files.
* **Operative Profile Persistence:** Keeps track of your Operative Name in local storage so you don't have to re-enter it when restarting.
* **Mission Registry & High Scores:** Tracks and logs local high scores (shortest completion time in seconds) across all three difficulties:
  * **Recruit:** 9x9 Grid | 10 Mines
  * **Veteran:** 16x16 Grid | 40 Mines
  * **Commando:** 24x24 Grid | 99 Mines
* **Penalty-inclusive Scoring:** Score is time-based (lower is better). In a defeat, a failure penalty of 1000 and unsecured mine penalty (50 points per mine) are added. Additionally, triggering the Force Barrier adds a 10 point penalty, and utilizing Force Sight costs a 10 point penalty.

---

## 🛠️ Technology Stack

1. **HTML5:** Structured semantic markup.
2. **CSS3 (Vanilla):** Dynamic CSS grid scaling, neon box shadows, keyframe animations, glassmorphism, responsive media queries, custom scrollbars.
3. **JavaScript (ES6):** State engine, neighbor adjacency math, flood-fill recursion, Web Audio API sound synthesis, local storage persistence, event mapping.

---

## 🎮 How to Play

1. Open `index.html` directly in any modern web browser or serve it locally.
2. Enter your **Operative Name** and select your **Mission Difficulty** (Recruit, Veteran, or Commando).
3. Click **Launch Mission** to initialize the sector map.
4. **Controls:**
   - **Left-Click:** Sweep/reveal a sector.
   - **Right-Click:** Flag/Unflag a sector as containing a hidden mine.
   - **Shift-Click (on a revealed number):** Highlight adjacent sectors. If flag requirements match, sweeps the unflagged neighbors.
   - **Force Sight (Tactical Panel):** Click to activate, then left-click any unrevealed sector to scan and safe-flag a 3x3 area (Costs 10 score penalty).
   - **Force Barrier (Passive System):** Automatically active; intercepts the first clicked mine, placing a blue forcefield and flagging it (Costs 10 score penalty).
5. In case of success or failure, review your **Mission Report** overlay, compare your score against the sector **High Score**, and capture a report screenshot to share with your faction!

---

## 📦 Deployment & Setup

This is a zero-dependency client-side single-page app. 

### Local Server Setup
To serve the game locally with a simple HTTP server (Python 3):
```bash
python3 -m http.server 8000
```
Then navigate to `http://localhost:8000` in your web browser.

### Hosting
You can host this project on services like **Netlify**, **Vercel**, or **GitHub Pages** by simply uploading/dragging-and-dropping the root files (`index.html`, `style.css`, and `app.js`).

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](file:///home/windos/Code/galactic-minefield/LICENSE) file for details.
