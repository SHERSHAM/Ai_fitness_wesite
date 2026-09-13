/* ============================================================
   FITNEXA AI — ACTIVE WORKOUT HUD PLAYER
   Real-time interval timing, live biometrics & exercise progression
   ============================================================ */

(function(window) {
    'use strict';

    function WorkoutPlayer(options) {
        this.workout = options.workout;
        this.user = options.user;
        this.container = options.container;

        this.currentExerciseIndex = 0;
        this.currentSet = 1;
        this.totalSetsPerExercise = 4;
        this.isPaused = false;
        this.isResting = false;
        this.restTimeRemaining = 45;
        this.elapsedSeconds = 0;
        this.caloriesBurned = 0;
        this.heartRate = 138;
        this.formScore = 94;

        this.timerInterval = null;
        this.restInterval = null;
        this.biometricInterval = null;

        this.init();
    }

    WorkoutPlayer.prototype.init = function() {
        this.renderUI();
        this.attachEvents();
        this.startWorkoutTimer();
        this.startBiometricSimulation();
        this.updateExerciseView();
    };

    WorkoutPlayer.prototype.startWorkoutTimer = function() {
        const self = this;
        this.timerInterval = setInterval(function() {
            if (!self.isPaused) {
                self.elapsedSeconds++;
                self.caloriesBurned = Math.round(self.elapsedSeconds * 0.16); // ~10 kcal / min
                self.updateTimerDisplay();
            }
        }, 1000);
    };

    WorkoutPlayer.prototype.startBiometricSimulation = function() {
        const self = this;
        this.biometricInterval = setInterval(function() {
            if (!self.isPaused) {
                // Subtle organic variation in heart rate (138 - 158 BPM)
                const hrDelta = (Math.random() * 4) - 2;
                self.heartRate = Math.min(168, Math.max(132, Math.round(self.heartRate + hrDelta)));

                // Subtle variation in form score (91% - 97%)
                const formDelta = (Math.random() * 2) - 1;
                self.formScore = Math.min(99, Math.max(88, Math.round(self.formScore + formDelta)));

                self.updateBiometricsDisplay();
            }
        }, 2200);
    };

    WorkoutPlayer.prototype.formatTime = function(seconds) {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
    };

    WorkoutPlayer.prototype.renderUI = function() {
        this.container.innerHTML = `
            <div class="player-hud-grid">
                <!-- Main Visual Stage with 3D Depth & Sparta Titan Framing -->
                <div class="player-stage-card sparta-spec-panel hud-corner-bracket glass-card-3d tilt-card depth-container">
                    <div class="depth-atmospheric"></div>
                    <div class="player-image-container">
                        <img id="playerExImg" src="${this.workout.image || 'images/form-analysis.webp'}" alt="Exercise visual" class="player-visual-media">
                        <div class="player-live-badge"><span class="pulse-dot"></span> LIVE HUD</div>

                        <!-- Rest Overlay Modal with Animated Circular Ring -->
                        <div class="player-rest-overlay" id="playerRestOverlay" style="display: none;">
                            <div class="rest-overlay-content sparta-spec-panel p-4 text-center">
                                <div class="spec-badge-cyan mb-3"><i class="bi bi-heart-pulse-fill me-1"></i> RECOVERY INTERVAL</div>
                                <div class="position-relative d-inline-block mb-3" style="width: 150px; height: 150px;">
                                    <svg width="150" height="150" viewBox="0 0 150 150" style="transform: rotate(-90deg);">
                                        <circle cx="75" cy="75" r="64" stroke="rgba(255,255,255,0.08)" stroke-width="7" fill="none"></circle>
                                        <circle id="restRingCircle" cx="75" cy="75" r="64" stroke="var(--gold-metallic)" stroke-width="7" fill="none" stroke-linecap="round" style="stroke-dasharray: 402; stroke-dashoffset: 0; transition: stroke-dashoffset 0.9s linear; filter: drop-shadow(0 0 10px rgba(212,175,55,0.6));"></circle>
                                    </svg>
                                    <div class="position-absolute top-50 start-50 translate-middle text-center" style="pointer-events: none;">
                                        <div class="rest-counter" id="restTimerDisplay" style="font-family:var(--font-heading); font-size:2.2rem; font-weight:900; line-height:1; color:#ffffff;">00:45</div>
                                        <div style="font-size:0.65rem; color:var(--gold-light); letter-spacing:1px; margin-top:4px;">REST</div>
                                    </div>
                                </div>
                                <p class="text-muted mb-4" style="max-width:320px; margin:0 auto 1.5rem;">Focus on diaphragmatic breathing. Lower heart rate.</p>
                                <button class="btn-gold-glow btn-sm px-4" id="btnSkipRest">Skip Rest <i class="bi bi-fast-forward-fill ms-1"></i></button>
                            </div>
                        </div>

                        <!-- On-Screen HUD Overlay -->
                        <div class="player-hud-overlay">
                            <div class="d-flex justify-content-between align-items-end flex-wrap gap-3">
                                <div>
                                    <div class="spec-badge-gold mb-1" id="playerExCounter" style="font-size:0.65rem;padding:2px 8px;">EXERCISE 01 / 06</div>
                                    <h2 class="player-exercise-title" id="playerExTitle">BARBELL BENCH PRESS</h2>
                                    <div class="player-set-pill" id="playerSetInfo">SET 1 OF 4 &nbsp;·&nbsp; 8-10 REPS</div>
                                </div>
                                <div class="player-telemetry-cluster">
                                    <div class="telemetry-pill">
                                        <i class="bi bi-heart-pulse-fill text-danger"></i>
                                        <div>
                                            <span class="t-val" id="playerHR">142</span>
                                            <span class="t-lbl">BPM</span>
                                        </div>
                                    </div>
                                    <div class="telemetry-pill">
                                        <i class="bi bi-fire text-warning"></i>
                                        <div>
                                            <span class="t-val" id="playerCalories">0</span>
                                            <span class="t-lbl">KCAL</span>
                                        </div>
                                    </div>
                                    <div class="telemetry-pill">
                                        <i class="bi bi-bullseye text-cyan"></i>
                                        <div>
                                            <span class="t-val" id="playerForm">94%</span>
                                            <span class="t-lbl">FORM</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Live AI Form Coaching Bar -->
                            <div class="player-ai-bar mt-3" id="playerAiCoachBar">
                                <div class="ai-spark-icon"><i class="bi bi-stars"></i></div>
                                <div class="ai-spark-text" id="playerAiCue">"Maintain tight scapular retraction and drive the bar with control."</div>
                            </div>
                        </div>
                    </div>

                    <!-- Bottom Controls Toolbar -->
                    <div class="player-controls-bar">
                        <div class="player-elapsed-time">
                            <i class="bi bi-clock me-1 text-muted"></i>
                            <span id="playerElapsedTime">00:00</span>
                        </div>
                        <div class="player-actions-group">
                            <button class="player-btn-circle" id="btnPrevEx" title="Previous Exercise"><i class="bi bi-chevron-left"></i></button>
                            <button class="player-btn-primary" id="btnCompleteSet" style="background:var(--gold-gradient);color:#02050a;font-weight:800;border:none;">
                                <span id="btnSetText">Complete Set 1</span> <i class="bi bi-check2-circle ms-1"></i>
                            </button>
                            <button class="player-btn-circle" id="btnPause" title="Pause / Play"><i class="bi bi-pause-fill" id="pauseIcon"></i></button>
                            <button class="player-btn-circle" id="btnNextEx" title="Next Exercise"><i class="bi bi-chevron-right"></i></button>
                        </div>
                        <div>
                            <button class="btn-outline-glow btn-sm" id="btnFinishWorkout">Finish Session</button>
                        </div>
                    </div>
                </div>

                <!-- Right Sidebar: Exercise Checklist -->
                <div class="player-checklist-card sparta-spec-panel glass-card">
                    <div class="checklist-header">
                        <h4 class="checklist-title">Session Flow</h4>
                        <span class="spec-badge-cyan" id="flowProgress" style="font-size:0.65rem;">1 / ${this.workout.exercises.length}</span>
                    </div>
                    <div class="checklist-items-scroll" id="checklistItems">
                        ${this.renderChecklist()}
                    </div>
                </div>
            </div>

            <!-- Finish Summary Modal -->
            <div class="modal-backdrop-custom" id="finishModal" style="display: none;">
                <div class="modal-dialog-custom sparta-spec-panel hud-corner-bracket glass-card text-center p-4 p-md-5">
                    <div class="celebration-badge mb-3"><i class="bi bi-trophy-fill text-warning"></i></div>
                    <div class="spec-badge-gold mb-2 mx-auto" style="width:fit-content;"><i class="bi bi-check2-all me-1"></i> PROTOCOL COMPLETE</div>
                    <h2 class="heading-massive mb-2 mt-2">SESSION CRUSHED!</h2>
                    <p class="text-muted mb-4">Outstanding execution. Your performance metrics have been securely logged to your profile.</p>

                    <div class="summary-stats-grid mb-4">
                        <div class="stat-box sparta-spec-panel">
                            <div class="sb-val" id="summaryDuration">35:00</div>
                            <div class="sb-lbl">Total Time</div>
                        </div>
                        <div class="stat-box sparta-spec-panel">
                            <div class="sb-val" id="summaryCalories" style="color:var(--gold-metallic);">380</div>
                            <div class="sb-lbl">Calories Burned</div>
                        </div>
                        <div class="stat-box sparta-spec-panel">
                            <div class="sb-val" id="summaryForm" style="color:var(--blue-neon);">95%</div>
                            <div class="sb-lbl">Form Precision</div>
                        </div>
                    </div>

                    <button class="btn-gold-glow w-100" id="btnReturnDashboard">
                        ENTER DASHBOARD <i class="bi bi-arrow-right ms-2"></i>
                    </button>
                </div>
            </div>
        `;
    };

    WorkoutPlayer.prototype.renderChecklist = function() {
        const self = this;
        return this.workout.exercises.map(function(ex, idx) {
            const isCurrent = idx === self.currentExerciseIndex;
            const isDone = idx < self.currentExerciseIndex;
            return `
                <div class="flow-item ${isCurrent ? 'active' : ''} ${isDone ? 'done' : ''}" data-idx="${idx}">
                    <div class="flow-step-num">${isDone ? '<i class="bi bi-check-lg"></i>' : (idx + 1)}</div>
                    <div class="flow-step-body">
                        <div class="flow-step-name">${ex.name}</div>
                        <div class="flow-step-detail">${ex.sets} Sets · ${ex.reps} Reps</div>
                    </div>
                </div>
            `;
        }).join('');
    };

    WorkoutPlayer.prototype.updateExerciseView = function() {
        const ex = this.workout.exercises[this.currentExerciseIndex];
        if (!ex) return;

        this.totalSetsPerExercise = ex.sets || 4;

        document.getElementById('playerExCounter').textContent = `EXERCISE 0${this.currentExerciseIndex + 1} / 0${this.workout.exercises.length}`;
        document.getElementById('playerExTitle').textContent = ex.name.toUpperCase();
        document.getElementById('playerSetInfo').textContent = `SET ${this.currentSet} OF ${this.totalSetsPerExercise} · ${ex.reps} REPS · REST ${ex.rest || '60s'}`;
        document.getElementById('btnSetText').textContent = `Complete Set ${this.currentSet}`;
        document.getElementById('playerAiCue').textContent = `"${ex.formCue || 'Focus on smooth tempo and deliberate kinetic control.'}"`;
        document.getElementById('flowProgress').textContent = `${this.currentExerciseIndex + 1} / ${this.workout.exercises.length}`;

        // Re-render checklist highlights
        const items = document.querySelectorAll('.flow-item');
        items.forEach((item, idx) => {
            item.classList.remove('active', 'done');
            if (idx === this.currentExerciseIndex) item.classList.add('active');
            if (idx < this.currentExerciseIndex) item.classList.add('done');
        });

        // Smooth GSAP transition between exercises
        const stageImg = document.getElementById('playerExImg');
        const titleEl = document.getElementById('playerExTitle');
        if (typeof gsap !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            if (stageImg) gsap.fromTo(stageImg, { opacity: 0.75, scale: 0.98 }, { opacity: 1, scale: 1, duration: 0.35, ease: 'power2.out' });
            if (titleEl) gsap.fromTo(titleEl, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' });
        }
    };

    WorkoutPlayer.prototype.updateTimerDisplay = function() {
        const el = document.getElementById('playerElapsedTime');
        if (el) el.textContent = this.formatTime(this.elapsedSeconds);
        const calEl = document.getElementById('playerCalories');
        if (calEl) calEl.textContent = this.caloriesBurned;
    };

    WorkoutPlayer.prototype.updateBiometricsDisplay = function() {
        const hrEl = document.getElementById('playerHR');
        if (hrEl) hrEl.textContent = this.heartRate;
        const formEl = document.getElementById('playerForm');
        if (formEl) formEl.textContent = this.formScore + '%';
    };

    WorkoutPlayer.prototype.completeCurrentSet = function() {
        if (this.currentSet < this.totalSetsPerExercise) {
            this.currentSet++;
            this.triggerRestInterval();
        } else {
            // Exercise completed, advance to next exercise
            if (this.currentExerciseIndex < this.workout.exercises.length - 1) {
                this.currentExerciseIndex++;
                this.currentSet = 1;
                this.triggerRestInterval();
            } else {
                this.finishWorkout();
            }
        }
        this.updateExerciseView();
    };

    WorkoutPlayer.prototype.triggerRestInterval = function() {
        const overlay = document.getElementById('playerRestOverlay');
        const restDisplay = document.getElementById('restTimerDisplay');
        if (!overlay || !restDisplay) return;

        this.isResting = true;
        this.initialRestTime = 45;
        this.restTimeRemaining = this.initialRestTime;
        restDisplay.textContent = this.formatTime(this.restTimeRemaining);
        overlay.style.display = 'flex';

        const ringCircle = document.getElementById('restRingCircle');
        if (ringCircle) ringCircle.style.strokeDashoffset = '0';

        if (typeof gsap !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            gsap.fromTo('.rest-overlay-content', { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.5)' });
        }

        clearInterval(this.restInterval);
        const self = this;
        this.restInterval = setInterval(function() {
            if (!self.isPaused) {
                self.restTimeRemaining--;
                restDisplay.textContent = self.formatTime(self.restTimeRemaining);
                if (ringCircle) {
                    const fraction = Math.max(0, self.restTimeRemaining / self.initialRestTime);
                    ringCircle.style.strokeDashoffset = (402 * (1 - fraction)).toString();
                }
                if (self.restTimeRemaining <= 0) {
                    self.skipRest();
                }
            }
        }, 1000);
    };

    WorkoutPlayer.prototype.skipRest = function() {
        clearInterval(this.restInterval);
        this.isResting = false;
        const overlay = document.getElementById('playerRestOverlay');
        if (overlay) overlay.style.display = 'none';
    };

    WorkoutPlayer.prototype.togglePause = function() {
        this.isPaused = !this.isPaused;
        const icon = document.getElementById('pauseIcon');
        if (icon) {
            icon.className = this.isPaused ? 'bi bi-play-fill' : 'bi bi-pause-fill';
        }
    };

    WorkoutPlayer.prototype.finishWorkout = function() {
        clearInterval(this.timerInterval);
        clearInterval(this.biometricInterval);
        clearInterval(this.restInterval);

        // Record session into DataStore
        if (window.DataStore && this.user) {
            window.DataStore.recordSession(this.user.id, {
                workoutId: this.workout.id,
                workoutName: this.workout.name,
                duration: this.formatTime(this.elapsedSeconds),
                calories: Math.max(120, this.caloriesBurned),
                formScore: this.formScore
            });
        }

        // Show Modal
        const modal = document.getElementById('finishModal');
        document.getElementById('summaryDuration').textContent = this.formatTime(this.elapsedSeconds);
        document.getElementById('summaryCalories').textContent = Math.max(120, this.caloriesBurned);
        document.getElementById('summaryForm').textContent = this.formScore + '%';
        if (modal) modal.style.display = 'flex';
    };

    WorkoutPlayer.prototype.attachEvents = function() {
        const self = this;

        document.getElementById('btnCompleteSet').addEventListener('click', function() {
            self.completeCurrentSet();
        });

        document.getElementById('btnPause').addEventListener('click', function() {
            self.togglePause();
        });

        document.getElementById('btnSkipRest').addEventListener('click', function() {
            self.skipRest();
        });

        document.getElementById('btnNextEx').addEventListener('click', function() {
            if (self.currentExerciseIndex < self.workout.exercises.length - 1) {
                self.currentExerciseIndex++;
                self.currentSet = 1;
                self.skipRest();
                self.updateExerciseView();
            }
        });

        document.getElementById('btnPrevEx').addEventListener('click', function() {
            if (self.currentExerciseIndex > 0) {
                self.currentExerciseIndex--;
                self.currentSet = 1;
                self.skipRest();
                self.updateExerciseView();
            }
        });

        document.getElementById('btnFinishWorkout').addEventListener('click', function() {
            if (confirm('Are you ready to complete and log this workout session?')) {
                self.finishWorkout();
            }
        });

        document.getElementById('btnReturnDashboard').addEventListener('click', function() {
            window.location.href = 'dashboard.html';
        });

        // Click checklist item to jump
        document.getElementById('checklistItems').addEventListener('click', function(e) {
            const item = e.target.closest('.flow-item');
            if (item) {
                const idx = parseInt(item.getAttribute('data-idx'), 10);
                self.currentExerciseIndex = idx;
                self.currentSet = 1;
                self.skipRest();
                self.updateExerciseView();
            }
        });
    };

    window.WorkoutPlayer = WorkoutPlayer;
})(window);
