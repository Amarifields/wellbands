import React, { useEffect } from "react";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";

const RelaxPortal = () => {
  useEffect(() => {
    let frequencyPlayerInstance = null;
    let sessionTimerInstance = null;
    // ============================
    // GeometryVisualizer Class
    // ============================
    class GeometryVisualizer {
      constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        // 1) Remove an existing canvas if found:
        const oldCanvas = this.container.querySelector(".geometry-canvas");
        if (oldCanvas) {
          this.container.removeChild(oldCanvas);
        }

        // 2) Create a fresh canvas and append it
        this.canvas = document.createElement("canvas");
        this.canvas.className = "geometry-canvas";
        this.container.appendChild(this.canvas);

        // Create a minimize button that only shows in fullscreen
        this.minimizeBtn = document.createElement("button");
        this.minimizeBtn.className = "minimize-btn";
        this.minimizeBtn.innerHTML = '<i class="fas fa-compress"></i>';
        this.minimizeBtn.title = "Exit Fullscreen";
        this.minimizeBtn.style.display = "none";
        this.container.appendChild(this.minimizeBtn);

        // Event listener for the minimize button
        this.minimizeBtn.addEventListener("click", () => {
          if (document.fullscreenElement) {
            document.exitFullscreen();
          }
        });

        this.ctx = this.canvas.getContext("2d");
        this.resizeCanvas();

        this.time = 0;
        this.activePattern = "flower";
        this.animationFrame = null;

        // Add fullscreen change event listener to handle exit properly and manage minimize button
        document.addEventListener("fullscreenchange", () => {
          if (document.fullscreenElement === this.container) {
            this.minimizeBtn.style.display = "flex";
          } else {
            this.minimizeBtn.style.display = "none";
            setTimeout(() => this.resizeCanvas(), 100);
          }
        });

        window.addEventListener("resize", () => this.resizeCanvas());
        this.animate();
      }

      resizeCanvas() {
        const rect = this.container.getBoundingClientRect();

        // When in fullscreen, use the window dimensions
        if (document.fullscreenElement === this.container) {
          this.canvas.width = window.innerWidth;
          this.canvas.height = window.innerHeight;
        } else {
          // Otherwise use the container dimensions
          this.canvas.width = rect.width;
          this.canvas.height = rect.height;
        }

        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;

        // Adjust scale based on screen size for better mobile/tablet display
        const baseScale = 300;
        if (window.innerWidth <= 768) {
          // Mobile adjustment - go back to original scaling
          this.scale =
            Math.min(this.canvas.width, this.canvas.height) / baseScale;
        } else if (window.innerWidth <= 1024) {
          // Tablet adjustment - go back to original scaling
          this.scale =
            Math.min(this.canvas.width, this.canvas.height) / baseScale;
        } else {
          this.scale =
            Math.min(this.canvas.width, this.canvas.height) / baseScale;
        }
      }

      project3DTo2D(x, y, z, focalLength = 400, dimensionShift = 0) {
        // Use the same projection formula as in your HTML reference.
        const scale =
          focalLength / (focalLength + z + Math.sin(dimensionShift) * 100);
        return {
          x:
            this.centerX +
            (x * scale + Math.sin(dimensionShift * 0.5) * 20) * this.scale,
          y:
            this.centerY +
            (y * scale + Math.cos(dimensionShift * 0.5) * 20) * this.scale,
          scale,
        };
      }
      createGradient() {
        const gradient = this.ctx.createLinearGradient(
          0,
          0,
          this.canvas.width,
          this.canvas.height
        );
        gradient.addColorStop(0, "hsl(187, 100%, 42%)"); // close to #00b8d4
        gradient.addColorStop(1, "hsl(181, 100%, 50%)"); // close to #00e5ff
        return gradient;
      }
      drawFlowerOfLife() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const gradient = this.createGradient();
        const centerRadius = 18;
        const centerPoints = [];

        // Add center point
        centerPoints.push({ x: 0, y: 0 });

        // First ring - 6 points
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          centerPoints.push({
            x: centerRadius * 2 * Math.cos(angle),
            y: centerRadius * 2 * Math.sin(angle),
          });
        }

        // Second ring (for a denser pattern)
        for (let ring = 2; ring <= 3; ring++) {
          for (let i = 0; i < ring * 6; i++) {
            const angle = (i * 2 * Math.PI) / (ring * 6);
            const radius = ring * centerRadius * 2;
            centerPoints.push({
              x: radius * Math.cos(angle),
              y: radius * Math.sin(angle),
            });
          }
        }

        // Draw each circle with 3D effect
        centerPoints.forEach((center, index) => {
          const numPoints = 60;
          const points = [];
          const phaseOffset = index * 0.2;
          const layerDepth = Math.sin(this.time + phaseOffset) * 20;

          for (let i = 0; i < numPoints; i++) {
            const angle = (i * 2 * Math.PI) / numPoints;
            const point = {
              x: center.x + centerRadius * Math.cos(angle),
              y: center.y + centerRadius * Math.sin(angle),
              z: layerDepth,
            };
            // Pass this.time + phaseOffset (as in HTML reference)
            const projected = this.project3DTo2D(
              point.x,
              point.y,
              point.z,
              400,
              this.time + phaseOffset
            );
            points.push(projected);
          }

          this.ctx.beginPath();
          this.ctx.moveTo(points[0].x, points[0].y);
          for (let i = 1; i < points.length; i++) {
            this.ctx.lineTo(points[i].x, points[i].y);
          }
          this.ctx.closePath();

          this.ctx.strokeStyle = gradient;
          this.ctx.lineWidth =
            (1 + Math.sin(this.time + phaseOffset) * 0.5) * this.scale;
          this.ctx.globalAlpha =
            0.6 + Math.sin(this.time * 2 + phaseOffset) * 0.4;
          this.ctx.stroke();
        });
      }
      drawSriYantra() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const gradient = this.createGradient();
        const size = 150;
        const layers = 9;
        for (let i = 0; i < layers; i++) {
          const scale = 1 - i * 0.1;
          const rotation = (i * Math.PI) / layers + this.time;
          const height = Math.sqrt(3) * size * scale;
          const points3D = [
            { x: 0, y: -height / 2, z: i * 10 },
            { x: (size * scale) / 2, y: height / 2, z: i * 10 },
            { x: -(size * scale) / 2, y: height / 2, z: i * 10 },
          ];
          const points2D = points3D.map((p) => {
            const rotated = {
              x: p.x * Math.cos(rotation) - p.y * Math.sin(rotation),
              y: p.x * Math.sin(rotation) + p.y * Math.cos(rotation),
              z: p.z + Math.sin(this.time * 2 + i) * 20,
            };
            return this.project3DTo2D(
              rotated.x,
              rotated.y,
              rotated.z,
              400,
              this.time
            );
          });
          this.ctx.beginPath();
          this.ctx.moveTo(points2D[0].x, points2D[0].y);
          this.ctx.lineTo(points2D[1].x, points2D[1].y);
          this.ctx.lineTo(points2D[2].x, points2D[2].y);
          this.ctx.closePath();
          this.ctx.strokeStyle = gradient;
          this.ctx.lineWidth = (1 + Math.sin(this.time + i) * 0.5) * this.scale;
          this.ctx.globalAlpha = 0.5 + Math.sin(this.time * 2 + i) * 0.5;
          this.ctx.stroke();
        }
      }
      drawVesicaPiscis() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const gradient = this.createGradient();
        const radius = 100;
        const layers = 12;
        for (let i = 0; i < layers; i++) {
          const rotation = (i * Math.PI) / 6 + this.time;
          const offset = radius * 0.5;
          [-offset, offset].forEach((dx) => {
            const numPoints = 60;
            const points = [];
            const depth = i * 10 + Math.sin(this.time * 2 + i) * 20;
            for (let j = 0; j < numPoints; j++) {
              const angle = (j * 2 * Math.PI) / numPoints;
              const point = {
                x: dx + radius * Math.cos(angle) * Math.cos(rotation),
                y: radius * Math.sin(angle),
                z: depth + radius * Math.cos(angle) * Math.sin(rotation),
              };
              const projected = this.project3DTo2D(
                point.x,
                point.y,
                point.z,
                400,
                this.time
              );
              points.push(projected);
            }
            this.ctx.beginPath();
            this.ctx.moveTo(points[0].x, points[0].y);
            for (let k = 1; k < points.length; k++) {
              this.ctx.lineTo(points[k].x, points[k].y);
            }
            this.ctx.closePath();
            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth =
              (1 + Math.sin(this.time + i) * 0.5) * this.scale;
            this.ctx.globalAlpha = 0.4 + Math.sin(this.time * 2 + i) * 0.3;
            this.ctx.stroke();
          });
        }
      }
      setPattern(pattern) {
        this.activePattern = pattern;
      }
      animate() {
        // Change this from 0.01 to original speed of 0.01
        this.time += 0.01;
        switch (this.activePattern) {
          case "flower":
            this.drawFlowerOfLife();
            break;
          case "sri-yantra":
            this.drawSriYantra();
            break;
          case "vesica":
            this.drawVesicaPiscis();
            break;
          default:
            this.drawFlowerOfLife();
        }
        this.animationFrame = requestAnimationFrame(() => this.animate());
      }
      destroy() {
        if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
      }
    }

    // ============================
    // FrequencyPlayer Class
    // ============================
    class FrequencyPlayer {
      constructor() {
        this.audioContext = null;
        this.oscillator1 = null;
        this.oscillator2 = null;
        this.gainNode = null;
        this.isPlaying = false;
        this.volume = 0.5;
        this.currentTrack = "morning";
        this.startTime = 0;
        this.timerInterval = null;
        this.tracks = {
          morning: {
            title: "Clear Start (Morning)",
            description: "528Hz + 963Hz | Mental Clarity & Energy",
            frequencies: [528, 963],
          },
          evening: {
            title: "Quiet Reset (Evening)",
            description: "396Hz + Delta Waves | Deep Relaxation & Sleep",
            frequencies: [396, 4],
          },
        };
        this.playBtn = document.getElementById("play-btn");
        this.toggleTrackBtn = document.getElementById("toggle-track-btn");
        this.volumeSlider = document.getElementById("volume-slider");
        this.trackTitle = document.getElementById("track-title");
        this.trackDesc = document.getElementById("track-description");
        this.trackTime = document.getElementById("track-time");
        this.progressValue = document.getElementById("progress-value");
        if (this.playBtn)
          this.playBtn.addEventListener("click", () => this.togglePlay());
        if (this.toggleTrackBtn)
          this.toggleTrackBtn.addEventListener("click", () =>
            this.toggleTrack()
          );
        if (this.volumeSlider) {
          this.volumeSlider.addEventListener("input", (e) => {
            this.volume = parseFloat(e.target.value);
            if (this.isPlaying && this.gainNode) {
              this.gainNode.gain.setValueAtTime(
                this.volume,
                this.audioContext.currentTime
              );
            }
          });
        }
        this.updateTrackInfo();
      }
      togglePlay() {
        if (this.isPlaying) this.stopAudio();
        else this.startAudio();
      }
      startAudio() {
        if (this.isPlaying) return;
        if (!this.audioContext)
          this.audioContext = new (window.AudioContext ||
            window.webkitAudioContext)();
        this.gainNode = this.audioContext.createGain();
        this.gainNode.gain.value = this.volume;
        this.gainNode.connect(this.audioContext.destination);
        this.oscillator1 = this.audioContext.createOscillator();
        this.oscillator2 = this.audioContext.createOscillator();
        const freqs = this.tracks[this.currentTrack].frequencies;
        this.oscillator1.frequency.value = freqs[0];
        this.oscillator2.frequency.value = freqs[1];
        this.oscillator1.type = "sine";
        this.oscillator2.type =
          this.currentTrack === "morning" ? "sine" : "triangle";

        const gainNode1 = this.audioContext.createGain();
        const gainNode2 = this.audioContext.createGain();

        if (this.currentTrack === "morning") {
          gainNode1.gain.value = 0.7; // Reduce volume of morning frequency
          gainNode2.gain.value = 0.7; // Reduce volume of morning frequency
        } else {
          gainNode1.gain.value = 1.0;
          gainNode2.gain.value = 1.0;
        }

        this.oscillator1.connect(gainNode1);
        this.oscillator2.connect(gainNode2);
        gainNode1.connect(this.gainNode);
        gainNode2.connect(this.gainNode);

        const now = this.audioContext.currentTime;
        this.oscillator1.start(now);
        this.oscillator2.start(now);
        this.gainNode.gain.setValueAtTime(0, now);
        this.gainNode.gain.linearRampToValueAtTime(this.volume, now + 1);
        this.startTime = now;
        this.isPlaying = true;
        if (this.playBtn)
          this.playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        this.updateTimer();
        this.timerInterval = setInterval(() => this.updateTimer(), 1000);
      }
      stopAudio() {
        if (!this.isPlaying) return;
        const now = this.audioContext.currentTime;
        this.gainNode.gain.linearRampToValueAtTime(0, now + 1);
        setTimeout(() => {
          if (this.oscillator1) {
            this.oscillator1.stop();
            this.oscillator1 = null;
          }
          if (this.oscillator2) {
            this.oscillator2.stop();
            this.oscillator2 = null;
          }
          this.isPlaying = false;
          if (this.playBtn)
            this.playBtn.innerHTML = '<i class="fas fa-play"></i>';
          clearInterval(this.timerInterval);
        }, 1000);
      }
      toggleTrack() {
        const wasPlaying = this.isPlaying;
        if (this.isPlaying) this.stopAudio();
        this.currentTrack =
          this.currentTrack === "morning" ? "evening" : "morning";
        this.updateTrackInfo();
        if (wasPlaying) setTimeout(() => this.startAudio(), 1100);
      }
      updateTrackInfo() {
        const track = this.tracks[this.currentTrack];
        if (this.trackTitle) this.trackTitle.textContent = track.title;
        if (this.trackDesc) this.trackDesc.textContent = track.description;
        if (this.currentTrack === "morning") {
          if (this.toggleTrackBtn)
            this.toggleTrackBtn.innerHTML =
              '<i class="fas fa-moon mr-2"></i>Switch to Evening';
        } else {
          if (this.toggleTrackBtn)
            this.toggleTrackBtn.innerHTML =
              '<i class="fas fa-sun mr-2"></i>Switch to Morning';
        }
      }
      updateTimer() {
        if (!this.isPlaying || !this.audioContext) return;
        const elapsed = this.audioContext.currentTime - this.startTime;
        const minutes = Math.floor(elapsed / 60);
        const seconds = Math.floor(elapsed % 60);
        if (this.trackTime)
          this.trackTime.textContent = `${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

        const progress = elapsed >= 600 ? 100 : (elapsed / 600) * 100;
        if (this.progressValue)
          this.progressValue.style.width = `${Math.min(progress, 100)}%`;
      }
    }

    // ============================
    // BreathworkGuide Class
    // ============================
    class BreathworkGuide {
      constructor() {
        this.active = false;
        this.breathPhase = "inhale";
        this.patternType = "box";
        this.timer = null;
        this.patterns = {
          box: { inhale: 4, hold1: 4, exhale: 4, hold2: 4 },
          relaxing: { inhale: 4, hold1: 7, exhale: 8, hold2: 0 },
          balance: { inhale: 5, hold1: 0, exhale: 5, hold2: 0 },
        };
        this.breatheCircle = document.getElementById("breathe-circle");
        this.breatheText = document.getElementById("breathe-text");
        this.breatheToggleBtn = document.getElementById("breathe-toggle-btn");
        this.breathPatternSelect = document.getElementById("breath-pattern");
        if (this.breatheToggleBtn)
          this.breatheToggleBtn.addEventListener("click", () =>
            this.toggleBreathwork()
          );
        if (this.breathPatternSelect)
          this.breathPatternSelect.addEventListener("change", () => {
            this.patternType = this.breathPatternSelect.value;
            if (this.active) {
              this.stopBreathwork();
              this.startBreathwork();
            }
          });
      }
      toggleBreathwork() {
        if (this.active) this.stopBreathwork();
        else this.startBreathwork();
      }
      startBreathwork() {
        if (this.active) return;
        this.active = true;

        if (this.breatheToggleBtn)
          this.breatheToggleBtn.textContent = "Stop Session";

        this.patternType = this.breathPatternSelect
          ? this.breathPatternSelect.value
          : "box";

        this.breathPhase = "inhale";
        this.updateBreathingUI();

        if (this.breatheCircle)
          this.breatheCircle.classList.add("breathe-animation");

        const pattern = this.patterns[this.patternType];
        const totalTime =
          pattern.inhale + pattern.hold1 + pattern.exhale + pattern.hold2;

        if (this.breatheCircle)
          this.breatheCircle.style.animationDuration = `${totalTime}s`;

        // 👇 Corrected: run inhale for its full duration before moving to the next phase
        this.timer = setTimeout(
          () => this.moveToNextPhase(),
          pattern.inhale * 1000
        );
      }

      stopBreathwork() {
        if (!this.active) return;
        this.active = false;
        clearTimeout(this.timer);
        if (this.breatheToggleBtn)
          this.breatheToggleBtn.textContent = "Start Session";
        if (this.breatheCircle)
          this.breatheCircle.classList.remove("breathe-animation");
        if (this.breatheText) this.breatheText.textContent = "Inhale (4s)";
      }
      moveToNextPhase() {
        if (!this.active) return;
        const pattern = this.patterns[this.patternType];
        switch (this.breathPhase) {
          case "inhale":
            this.breathPhase = pattern.hold1 > 0 ? "hold1" : "exhale";
            break;
          case "hold1":
            this.breathPhase = "exhale";
            break;
          case "exhale":
            this.breathPhase = pattern.hold2 > 0 ? "hold2" : "inhale";
            break;
          case "hold2":
            this.breathPhase = "inhale";
            break;
          default:
            this.breathPhase = "inhale";
        }
        this.updateBreathingUI();
        const currentPhaseDuration = pattern[this.breathPhase] * 1000;
        this.timer = setTimeout(
          () => this.moveToNextPhase(),
          currentPhaseDuration
        );
      }
      updateBreathingUI() {
        const pattern = this.patterns[this.patternType];
        let instruction = "";
        switch (this.breathPhase) {
          case "inhale":
            instruction = `Inhale (${pattern.inhale}s)`;
            break;
          case "hold1":
            instruction = `Hold (${pattern.hold1}s)`;
            break;
          case "exhale":
            instruction = `Exhale (${pattern.exhale}s)`;
            break;
          case "hold2":
            instruction = `Hold (${pattern.hold2}s)`;
            break;
          default:
            instruction = `Inhale (${pattern.inhale}s)`;
        }
        if (this.breatheText) this.breatheText.textContent = instruction;
      }
    }

    // ============================
    // SessionTimer Class
    // ============================
    class SessionTimer {
      constructor(frequencyPlayer) {
        this.frequencyPlayer = frequencyPlayer;
        this.totalSeconds = 0; // No duration selected by default
        this.remainingSeconds = 0;
        this.active = false;
        this.paused = false;
        this.interval = null;
        this.linkWithFrequency = false;
        this.timerDisplay = document.getElementById("timer-display");
        this.startBtn = document.getElementById("timer-start-btn");
        this.pauseBtn = document.getElementById("timer-pause-btn");
        this.timeButtons = document.querySelectorAll(".timer-btn");

        if (this.startBtn)
          this.startBtn.addEventListener("click", () => this.toggleTimer());
        if (this.pauseBtn)
          this.pauseBtn.addEventListener("click", () => this.togglePause());

        this.timeButtons.forEach((btn) => {
          btn.addEventListener("click", () => {
            if (!this.active) {
              const minutes = parseInt(btn.dataset.time);
              this.setTime(minutes);
              this.linkWithFrequency = true; // Link timer to frequency when a duration is selected
              this.timeButtons.forEach((b) => b.classList.remove("active"));
              btn.classList.add("active");
            }
          });
        });

        // Removed automatic activation of the first timer button.
        this.updateDisplay();
      }
      setTime(minutes) {
        this.totalSeconds = minutes * 60;
        this.remainingSeconds = this.totalSeconds;
        this.updateDisplay();
      }
      toggleTimer() {
        if (this.active) this.stopTimer();
        else this.startTimer();
      }
      startTimer() {
        if (this.totalSeconds === 0) return; // Do not start the timer if no time is set
        this.active = true;
        this.paused = false;
        if (this.startBtn) this.startBtn.textContent = "Stop";
        if (this.pauseBtn) {
          this.pauseBtn.disabled = false;
          this.pauseBtn.classList.remove("opacity-50");
        }
        this.timeButtons.forEach((btn) => {
          btn.disabled = true;
          btn.classList.add("opacity-50");
        });
        this.interval = setInterval(() => {
          if (!this.paused) {
            this.remainingSeconds--;
            this.updateDisplay();
            if (this.remainingSeconds <= 0) {
              this.stopTimer();
              this.playEndSound();
            }
          }
        }, 1000);
      }
      stopTimer() {
        this.active = false;
        this.paused = false;
        clearInterval(this.interval);
        this.remainingSeconds = this.totalSeconds;
        this.updateDisplay();
        if (this.startBtn) this.startBtn.textContent = "Start";
        if (this.pauseBtn) {
          this.pauseBtn.textContent = "Pause";
          this.pauseBtn.disabled = true;
          this.pauseBtn.classList.add("opacity-50");
        }
        this.timeButtons.forEach((btn) => {
          btn.disabled = false;
          btn.classList.remove("opacity-50");
        });
      }
      togglePause() {
        if (!this.active) return;
        this.paused = !this.paused;
        if (this.pauseBtn)
          this.pauseBtn.textContent = this.paused ? "Resume" : "Pause";
      }
      updateDisplay() {
        const minutes = Math.floor(this.remainingSeconds / 60);
        const seconds = this.remainingSeconds % 60;
        if (this.timerDisplay)
          this.timerDisplay.textContent = `${minutes}:${seconds
            .toString()
            .padStart(2, "0")}`;
      }
      playEndSound() {
        // Remove ALL sound code - no beep at all
        // Only stop the frequency if timer was linked
        if (
          this.linkWithFrequency &&
          this.frequencyPlayer &&
          this.frequencyPlayer.isPlaying
        ) {
          this.frequencyPlayer.stopAudio();
        }
      }
    }

    // ============================
    // ParticleBackground Class
    // ============================
    class ParticleBackground {
      constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext("2d");
        this.particles = [];
        this.animationFrame = null;
        this.resizeCanvas();
        this.createParticles();
        this.animate();
        window.addEventListener("resize", () => {
          this.resizeCanvas();
          this.particles = [];
          this.createParticles();
        });
      }
      resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
      }
      createParticles() {
        const particleCount = Math.min(window.innerWidth / 15, 100);
        for (let i = 0; i < particleCount; i++) {
          this.particles.push({
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            radius: Math.random() * 2 + 1,
            color: `rgba(0, ${Math.floor(Math.random() * 100) + 180}, ${
              Math.floor(Math.random() * 55) + 200
            }, ${Math.random() * 0.2 + 0.1})`,
            speedX: Math.random() * 0.5 - 0.25,
            speedY: Math.random() * 0.5 - 0.25,
            pulsate: Math.random() * 0.03 + 0.01,
          });
        }
      }
      animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.particles.forEach((particle) => {
          this.ctx.beginPath();
          const safeRadius = Math.max(particle.radius, 0.1);
          this.ctx.arc(particle.x, particle.y, safeRadius, 0, Math.PI * 2);
          this.ctx.fillStyle = particle.color;
          this.ctx.fill();
          particle.x += particle.speedX;
          particle.y += particle.speedY;
          particle.radius += Math.sin(Date.now() * particle.pulsate) * 0.1;
          if (particle.x < 0) particle.x = this.canvas.width;
          if (particle.x > this.canvas.width) particle.x = 0;
          if (particle.y < 0) particle.y = this.canvas.height;
          if (particle.y > this.canvas.height) particle.y = 0;
        });
        this.connectParticles();
        this.animationFrame = requestAnimationFrame(() => this.animate());
      }
      connectParticles() {
        const maxDistance = 150;
        for (let i = 0; i < this.particles.length; i++) {
          for (let j = i + 1; j < this.particles.length; j++) {
            const dx = this.particles[i].x - this.particles[j].x;
            const dy = this.particles[i].y - this.particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < maxDistance) {
              const opacity = 1 - distance / maxDistance;
              this.ctx.strokeStyle = `rgba(0, 180, 220, ${opacity * 0.15})`;
              this.ctx.lineWidth = 1;
              this.ctx.beginPath();
              this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
              this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
              this.ctx.stroke();
            }
          }
        }
      }
    }

    // ---------------------------
    // Initialization
    // ---------------------------
    // Delay initialization to ensure all DOM nodes are available
    setTimeout(() => {
      const geometryVisualizer = new GeometryVisualizer("geometry-container");
      const patternBtns = document.querySelectorAll(".pattern-btn");
      patternBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          patternBtns.forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          geometryVisualizer.setPattern(btn.dataset.pattern);
        });
      });

      // First create the frequency player
      const frequencyPlayer = new FrequencyPlayer();

      // Then create the timer and pass the frequency player reference
      const sessionTimer = new SessionTimer(frequencyPlayer);

      new BreathworkGuide();
      new ParticleBackground("visual-canvas");
    }, 500);
  }, []);

  return (
    <div className="bg-gradient min-h-screen relative">
      <Navbar />
      {/* Full-screen Canvas for Background Particles */}
      <canvas
        id="visual-canvas"
        className="fixed top-0 left-0 w-full h-full"
      ></canvas>

      {/* Main Container */}
      <div className="bg-gradient min-h-screen">
        {/* Header */}
        <header className="w-full pt-32 py-6">
          <div className="container mx-auto px-4 section-header">
            <div className="text-center">
              <h1 className="section-title">
                <span className="text-white mr-3">Wellbands</span>
                <span className="gradient-text">Reset Portal</span>
              </h1>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sacred Geometry Harmonizer Section */}
            <div className="glass-card p-6 relative">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <i className="fas fa-atom mr-2 text-cyan-400"></i>
                Sacred Geometry Harmonizer
              </h2>

              {/* Maximize Button */}
              <button
                onClick={() => {
                  const container =
                    document.getElementById("geometry-container");
                  if (!document.fullscreenElement) {
                    container.requestFullscreen?.().catch((err) => {
                      console.error(
                        `Error attempting to enable fullscreen: ${err.message}`
                      );
                    });
                  } else {
                    document.exitFullscreen?.();
                  }
                }}
                title="Fullscreen"
                className="absolute top-4 right-4 text-white hover:text-cyan-400 transition z-10"
              >
                <i className="fas fa-expand"></i>
              </button>

              {/* Geometry Canvas Container */}
              <div
                className="pattern-container mb-4 relative w-full"
                id="geometry-container"
                style={{ aspectRatio: "16/9" }}
              ></div>

              {/* Pattern Selection Buttons */}
              <div className="flex flex-wrap gap-2 justify-center">
                <button
                  className="btn-secondary rounded-full px-4 py-2 active pattern-btn"
                  data-pattern="flower"
                >
                  Flower of Life
                </button>
                <button
                  className="btn-secondary rounded-full px-4 py-2 pattern-btn"
                  data-pattern="sri-yantra"
                >
                  Sri Yantra
                </button>
                <button
                  className="btn-secondary rounded-full px-4 py-2 pattern-btn"
                  data-pattern="vesica"
                >
                  Vesica Piscis
                </button>
              </div>
            </div>

            {/* Frequency Healing Section */}
            <div className="glass-card p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <i className="fas fa-wave-square mr-2 text-cyan-400"></i>
                Frequency Healing
              </h2>
              <div className="bg-black bg-opacity-20 rounded-lg p-4 mb-4">
                <div className="flex flex-col">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h3 id="track-title" className="font-medium">
                        Clear Start (Morning)
                      </h3>
                      <p
                        id="track-description"
                        className="text-xs text-gray-300"
                      >
                        528Hz + 963Hz | Mental Clarity & Energy
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <div className="flex space-x-4">
                      {/* Your play button and volume slider here */}
                      <button
                        id="play-btn"
                        className="btn-primary rounded-full h-12 w-12 flex items-center justify-center"
                      >
                        <i className="fas fa-play"></i>
                      </button>
                      <div className="flex flex-col justify-center">
                        <div className="flex items-center space-x-2">
                          <i className="fas fa-volume-down text-xs"></i>
                          <input
                            id="volume-slider"
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            defaultValue="0.5"
                            className="volume-slider"
                          />
                          <i className="fas fa-volume-up text-xs"></i>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                      <div className="flex space-x-4">
                        {/* Play button and volume slider */}
                      </div>
                      <div className="flex">
                        <button
                          id="toggle-track-btn"
                          className="btn-secondary rounded-full px-4 py-2 text-sm flex items-center justify-center w-full sm:w-auto mt-4 sm:mt-0"
                        >
                          <i className="fas fa-moon sm:mr-2 mr-1"></i>
                          <span>Switch to Evening</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="headphone-recommendation mt-6 flex items-center">
                  <i className="fas fa-headphones text-cyan-400 mr-2"></i>
                  <span className="text-xs text-gray-300">
                    For the most immersive and effective experience, we
                    recommend using quality headphones
                  </span>
                </div>
              </div>
              <div className="border-t border-cyan-900 pt-4">
                <h3 className="text-lg font-medium mb-2">Frequency Benefits</h3>
                <ul
                  id="frequency-benefits"
                  className="text-sm space-y-2 text-gray-300"
                >
                  <li className="flex items-start">
                    <i className="fas fa-circle text-cyan-400 text-xs mt-1 mr-2"></i>
                    <span>
                      Morning: 528Hz + 963Hz blend for mental clarity and
                      positive energy
                    </span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-circle text-cyan-400 text-xs mt-1 mr-2"></i>
                    <span>
                      Evening: 396Hz + delta waves for deep relaxation and
                      restful sleep
                    </span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-circle text-cyan-400 text-xs mt-1 mr-2"></i>
                    <span>
                      These frequencies are calibrated to rebalance your
                      biofield
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Guided Breathwork Section */}
            <div className="glass-card p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <i className="fas fa-wind mr-2 text-cyan-400"></i>
                Guided Breathwork
              </h2>
              <div className="flex flex-col items-center">
                <div
                  id="breathe-circle"
                  className="breathe-circle mb-4 flex items-center justify-center"
                >
                  <span id="breathe-text" className="text-lg font-medium">
                    Inhale (4s)
                  </span>
                </div>
                <div className="w-full max-w-md mb-4">
                  <label
                    htmlFor="breath-pattern"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Breath Pattern:
                  </label>
                  <select
                    id="breath-pattern"
                    className="w-full bg-gray-800 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="box">Box Breathing (4-4-4-4)</option>
                    <option value="relaxing">4-7-8 Relaxation</option>
                    <option value="balance">5-5 Balance</option>
                  </select>
                </div>
                <button
                  id="breathe-toggle-btn"
                  className="btn-primary rounded-full px-6 py-2 w-full max-w-md"
                >
                  Start Session
                </button>
              </div>
            </div>

            {/* Session Timer Section */}
            <div className="glass-card p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <i className="fas fa-hourglass-half mr-2 text-cyan-400"></i>
                Session Timer
              </h2>
              <div className="flex flex-col items-center">
                <div className="timer-display mb-6" id="timer-display">
                  5:00
                </div>
                <div className="grid grid-cols-3 gap-3 w-full max-w-md mb-4">
                  <button
                    className="btn-secondary rounded-lg py-2 timer-btn"
                    data-time="5"
                  >
                    5 min
                  </button>
                  <button
                    className="btn-secondary rounded-lg py-2 timer-btn"
                    data-time="15"
                  >
                    15 min
                  </button>
                  <button
                    className="btn-secondary rounded-lg py-2 timer-btn"
                    data-time="30"
                  >
                    30 min
                  </button>
                </div>

                {/* Replace checkbox with informative message */}
                <div className="timer-info-message mb-4 text-center">
                  <span className="text-sm text-gray-300">
                    <i className="fas fa-info-circle text-cyan-400 mr-2"></i>
                    Frequency session will automatically end when timer
                    completes
                  </span>
                </div>

                <div className="flex space-x-4 w-full max-w-md">
                  <button
                    id="timer-start-btn"
                    className="btn-primary rounded-full px-6 py-2 flex-1"
                  >
                    Start
                  </button>
                  <button
                    id="timer-pause-btn"
                    className="btn-secondary rounded-full px-6 py-2 flex-1"
                    disabled
                  >
                    Pause
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <div className="pt-12">
          <Footer />
        </div>
      </div>

      {/* Inline Global Styles */}
      <style>{`
        :root {
          --primary: #00b8d4;
          --primary-light: #00e5ff;
          --primary-dark: #0088a3;
          --accent: #64ffda;
          --dark-bg: #050b14;
          --card-bg: rgba(16, 25, 40, 0.6);
          --card-border: rgba(0, 184, 212, 0.2);
          --text-primary: #ffffff;
          --text-secondary: rgba(255, 255, 255, 0.7);
        }
        body {
          font-family: 'Inter', sans-serif;
          margin: 0;
          padding: 0;
          background: var(--dark-bg);
          color: var(--text-primary);
          min-height: 100vh;
          overflow-x: hidden;
        }
        h1, h2, h3, h4, h5, h6 {
          font-family: 'Montserrat', sans-serif;
        }
        .bg-gradient {
          background: radial-gradient(circle at center, rgba(0, 184, 212, 0.2) 0%, rgba(0, 229, 255, 0.05) 40%, rgba(5, 11, 20, 1) 100%);
          background-size: 200% 200%;
          animation: gradientAnimation 20s ease infinite;
        }
        @keyframes gradientAnimation {
          0% { background-position: 0% 0%; }
          50% { background-position: 100% 100%; }
          100% { background-position: 0% 0%; }
        }
        .glass-card {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 1rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
        }
        .glass-card:hover {
          border-color: rgba(0, 184, 212, 0.4);
          box-shadow: 0 8px 32px rgba(0, 184, 212, 0.1);
        }
        .btn-primary {
          background: linear-gradient(90deg, var(--primary) 0%, var(--primary-light) 100%);
          color: rgba(0, 0, 0, 0.9);
          font-weight: 600;
          border: none;
          position: relative;
          z-index: 1;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(0, 184, 212, 0.3);
        }
        .btn-primary:before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: all 0.6s ease;
          z-index: -1;
        }
        .btn-primary:hover:before {
          left: 100%;
        }
        .btn-secondary {
          background: rgba(0, 184, 212, 0.1);
          color: var(--primary-light);
          border: 1px solid rgba(0, 184, 212, 0.3);
          font-weight: 500;
          transition: all 0.3s ease;
        }
        .btn-secondary:hover {
          background: rgba(0, 184, 212, 0.2);
          transform: translateY(-2px);
        }
        .progress-bar {
          height: 6px;
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          overflow: hidden;
        }
        .progress-bar-value {
          height: 100%;
          background: linear-gradient(90deg, var(--primary) 0%, var(--primary-light) 100%);
          border-radius: 3px;
          transition: width 0.1s ease;
        }
        .breathe-circle {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          background: rgba(0, 229, 255, 0.1);
          box-shadow: 0 0 30px rgba(0, 229, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
 .pattern-container {
    position: relative;
    width: 100%;
    min-height: 500px;
  }
        .timer-display {
          font-size: 4rem;
          font-weight: 200;
          color: white;
          font-family: 'Montserrat', sans-serif;
        }
          .minimize-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(0, 184, 212, 0.5);
  color: white;
  display: none;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 100;
  transition: all 0.3s ease;
}

.minimize-btn:hover {
  background: rgba(0, 184, 212, 0.2);
  transform: scale(1.1);
}

/* Responsive pattern container */
.pattern-container {
  position: relative;
  width: 100%;
  min-height: 300px;
  height: auto;
  aspect-ratio: 16/9;
}

/* Fullscreen adjustments */
:fullscreen .pattern-container {
  width: 100vw;
  height: 100vh;
  min-height: 100vh;
  aspect-ratio: auto;
}

/* Improve canvas rendering on mobile/tablet */
@media (max-width: 768px) {
  .geometry-canvas {
    image-rendering: optimizeQuality;
  }
  
  :fullscreen .geometry-canvas {
    object-fit: contain;
  }
  
  /* Additional flower of life and vesica adjustments for mobile */
  .pattern-container {
    min-height: 250px; /* Smaller container on mobile */
  }
}

/* Headphone recommendation */
.headphone-recommendation {
  background: rgba(0, 184, 212, 0.1);
  padding: 8px 12px;
  border-radius: 4px;
  border-left: 3px solid var(--primary);
}
  .form-checkbox {
  appearance: none;
  -webkit-appearance: none;
  background-color: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--primary);
  border-radius: 4px;
  padding: 8px;
  display: inline-block;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
}

.form-checkbox:checked {
  background-color: var(--primary);
}

.form-checkbox:checked:after {
  content: '✓';
  font-size: 12px;
  position: absolute;
  top: 0;
  left: 2px;
  color: #fff;
}

.form-checkbox:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 184, 212, 0.3);
}
  .timer-info-message {
  background: rgba(0, 184, 212, 0.05);
  padding: 8px 12px;
  border-radius: 4px;
  width: 100%;
  max-width: md;
}
.section-header {
  text-align: center;
}

.section-title {
  font-size: 42px;
  font-weight: 700;
  margin-bottom: 16px;
  display: inline-block;
}

.gradient-text {
  background: linear-gradient(90deg, #00b8d4 0%, #00e5ff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

@media (max-width: 767px) {
  .section-title {
    font-size: 36px; /* Slightly smaller on very small screens */
  }
}
          
      `}</style>
    </div>
  );
};

export default RelaxPortal;
