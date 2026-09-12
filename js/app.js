/* ============================================================
   FITNEXA AI — APPLICATION SHELL & COMMON NAVIGATION
   SaaS Topbar, User Switcher, Active Route Highlights & Toasts
   ============================================================ */

(function(window) {
    'use strict';

    const App = {
        init: function() {
            // Check auth
            if (!window.Auth || !window.Auth.requireAuth()) return;

            const currentUser = window.Auth.getCurrentUser();
            if (!currentUser) return;

            this.renderNavbar(currentUser);
            this.renderUserSwitcherModal();
            this.highlightActiveRoute();
            this.attachGlobalEvents();
        },

        renderNavbar: function(user) {
            const mount = document.getElementById('appNavMount');
            if (!mount) return;

            const currentPath = window.location.pathname.split('/').pop() || 'dashboard.html';

            mount.innerHTML = `
                <nav class="app-topbar">
                    <div class="container-fluid px-3 px-lg-4">
                        <div class="d-flex align-items-center justify-content-between">
                            <!-- Left: Brand & Mobile Menu -->
                            <div class="d-flex align-items-center gap-3">
                                <button class="app-mobile-toggle d-lg-none" id="appMobileToggle" aria-label="Toggle navigation">
                                    <i class="bi bi-list"></i>
                                </button>
                                <a href="dashboard.html" class="app-logo">
                                    FITNEXA <span>AI</span>
                                </a>
                                <span class="app-badge d-none d-sm-inline-block">${user.profile.fitnessGoal.toUpperCase()}</span>
                            </div>

                            <!-- Center: Desktop App Navigation Links -->
                            <ul class="app-nav-links d-none d-lg-flex">
                                <li><a href="dashboard.html" class="app-link" data-route="dashboard.html"><i class="bi bi-grid-1x2-fill me-1"></i> Dashboard</a></li>
                                <li><a href="workouts.html" class="app-link" data-route="workouts.html"><i class="bi bi-lightning-charge-fill me-1"></i> Workouts</a></li>
                                <li><a href="ai-coach.html" class="app-link" data-route="ai-coach.html"><i class="bi bi-stars me-1 text-cyan"></i> AI Coach</a></li>
                                <li><a href="nutrition.html" class="app-link" data-route="nutrition.html"><i class="bi bi-pie-chart-fill me-1"></i> Nutrition</a></li>
                                <li><a href="progress.html" class="app-link" data-route="progress.html"><i class="bi bi-graph-up me-1"></i> Progress</a></li>
                                <li><a href="recovery.html" class="app-link" data-route="recovery.html"><i class="bi bi-heart-pulse-fill me-1"></i> Recovery</a></li>
                            </ul>

                            <!-- Right: Switcher, Notifications & User Dropdown -->
                            <div class="d-flex align-items-center gap-2 gap-md-3">
                                <!-- User Switcher Button (Testing Utility) -->
                                <button class="btn-app-switcher d-none d-md-inline-flex" id="btnOpenSwitcher" title="Switch Demo Accounts">
                                    <i class="bi bi-arrow-left-right me-1 text-cyan"></i> Switch Account
                                </button>

                                <!-- Notifications Indicator -->
                                <div class="app-notification-wrap position-relative">
                                    <button class="app-icon-btn" id="notifBell" title="Notifications">
                                        <i class="bi bi-bell"></i>
                                        <span class="notif-dot"></span>
                                    </button>
                                    <div class="notif-dropdown" id="notifDropdown" style="display: none;">
                                        <div class="notif-header">
                                            <span>Notifications</span>
                                            <span class="badge bg-primary-subtle text-primary">2 New</span>
                                        </div>
                                        <div class="notif-list">
                                            <div class="notif-item unread">
                                                <i class="bi bi-stars text-cyan"></i>
                                                <div>
                                                    <div class="notif-title">Recovery Score Ready</div>
                                                    <div class="notif-desc">Your readiness is ${user.recovery.score}% today. Optimal for strength!</div>
                                                </div>
                                            </div>
                                            <div class="notif-item unread">
                                                <i class="bi bi-fire text-warning"></i>
                                                <div>
                                                    <div class="notif-title">${user.dashboardStats.activeStreakDays}-Day Streak Maintained</div>
                                                    <div class="notif-desc">Consistency is paying off. Keep your momentum going!</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- User Profile Dropdown -->
                                <div class="app-user-wrap position-relative">
                                    <button class="app-user-btn" id="userMenuBtn">
                                        <img src="${user.avatar || 'images/hero-athlete.webp'}" alt="${user.fullName}" class="user-avatar-img">
                                        <span class="user-name-label d-none d-sm-inline">${user.fullName.split(' ')[0]}</span>
                                        <i class="bi bi-chevron-down ms-1" style="font-size: 0.75rem;"></i>
                                    </button>

                                    <div class="user-menu-dropdown" id="userDropdown" style="display: none;">
                                        <div class="user-menu-header">
                                            <div class="fw-bold text-white">${user.fullName}</div>
                                            <div class="text-muted small">${user.email}</div>
                                            <div class="badge-plan-tier mt-1">${user.planTier}</div>
                                        </div>
                                        <div class="user-menu-links">
                                            <a href="profile.html" class="menu-item"><i class="bi bi-person me-2"></i> Profile & Goals</a>
                                            <a href="settings.html" class="menu-item"><i class="bi bi-gear me-2"></i> Settings</a>
                                            <a href="achievements.html" class="menu-item"><i class="bi bi-trophy me-2"></i> Achievements</a>
                                            <a href="community.html" class="menu-item"><i class="bi bi-people me-2"></i> Community</a>
                                            <a href="index.html" class="menu-item"><i class="bi bi-house me-2"></i> Public Home</a>
                                            <div class="dropdown-divider"></div>
                                            <button class="menu-item text-danger border-0 bg-transparent w-100 text-start" id="btnLogoutAction">
                                                <i class="bi bi-box-arrow-right me-2"></i> Log Out
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>

                <!-- Mobile Drawer Menu -->
                <div class="app-mobile-drawer" id="appMobileDrawer" style="display: none;">
                    <div class="drawer-header">
                        <span class="fw-bold">FITNEXA MENU</span>
                        <button class="btn-close-drawer" id="btnCloseDrawer"><i class="bi bi-x-lg"></i></button>
                    </div>
                    <div class="drawer-user-info p-3 mb-2 glass-card-sm">
                        <div class="fw-bold text-white">${user.fullName}</div>
                        <div class="text-cyan small">${user.profile.fitnessGoal} · ${user.profile.fitnessLevel}</div>
                    </div>
                    <ul class="drawer-links">
                        <li><a href="dashboard.html"><i class="bi bi-grid-1x2-fill me-2"></i> Dashboard</a></li>
                        <li><a href="workouts.html"><i class="bi bi-lightning-charge-fill me-2"></i> Workouts Library</a></li>
                        <li><a href="ai-coach.html"><i class="bi bi-stars me-2 text-cyan"></i> Personal AI Coach</a></li>
                        <li><a href="nutrition.html"><i class="bi bi-pie-chart-fill me-2"></i> Nutrition Targets</a></li>
                        <li><a href="progress.html"><i class="bi bi-graph-up me-2"></i> Progress Analytics</a></li>
                        <li><a href="recovery.html"><i class="bi bi-heart-pulse-fill me-2"></i> Biometric Recovery</a></li>
                        <li><a href="profile.html"><i class="bi bi-person me-2"></i> Profile & Goals</a></li>
                        <li><a href="settings.html"><i class="bi bi-gear me-2"></i> Settings</a></li>
                        <li><a href="achievements.html"><i class="bi bi-trophy me-2"></i> Achievements</a></li>
                        <li><a href="community.html"><i class="bi bi-people me-2"></i> Community</a></li>
                        <li><a href="index.html"><i class="bi bi-house me-2"></i> Back to Public Website</a></li>
                    </ul>
                    <div class="p-3">
                        <button class="btn-primary-glow w-100 mb-2" id="btnDrawerSwitcher">Switch Demo Account</button>
                        <button class="btn-outline-glow w-100 text-danger border-danger" id="btnDrawerLogout">Log Out</button>
                    </div>
                </div>
            `;
        },

        renderUserSwitcherModal: function() {
            let modal = document.getElementById('userSwitcherModal');
            if (modal) return;

            modal = document.createElement('div');
            modal.id = 'userSwitcherModal';
            modal.className = 'modal-backdrop-custom';
            modal.style.display = 'none';

            const currentUserId = window.Auth ? window.Auth.getCurrentUserId() : '';
            const allUsers = window.DataStore ? window.DataStore.getUsers() : [];

            modal.innerHTML = `
                <div class="modal-dialog-custom glass-card p-4">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h4 class="m-0"><i class="bi bi-people-fill text-cyan me-2"></i>Switch Demo Account</h4>
                        <button class="btn-close-modal border-0 bg-transparent text-white" id="btnCloseSwitcher"><i class="bi bi-x-lg"></i></button>
                    </div>
                    <p class="text-muted small mb-4">Instantly switch between accounts to observe personalized goals, different workout splits, recovery scores, and isolated user data.</p>

                    <div class="switcher-list d-flex flex-column gap-3">
                        ${allUsers.map(u => `
                            <div class="switcher-account-card ${u.id === currentUserId ? 'active-account' : ''}" data-uid="${u.id}">
                                <img src="${u.avatar || 'images/hero-athlete.webp'}" alt="${u.fullName}" class="switcher-avatar">
                                <div class="switcher-info">
                                    <div class="fw-bold text-white d-flex align-items-center gap-2">
                                        ${u.fullName}
                                        ${u.id === currentUserId ? '<span class="badge bg-primary">ACTIVE</span>' : ''}
                                    </div>
                                    <div class="text-muted small">${u.email}</div>
                                    <div class="text-cyan small mt-1">Goal: <strong>${u.profile.fitnessGoal}</strong> (${u.profile.fitnessLevel}) · ${u.profile.trainingDays}d/wk</div>
                                </div>
                                <button class="btn-sm ${u.id === currentUserId ? 'btn-secondary disabled' : 'btn-primary-glow'} btn-select-account">
                                    ${u.id === currentUserId ? 'Current' : 'Select'}
                                </button>
                            </div>
                        `).join('')}
                    </div>

                    <div class="mt-4 pt-3 border-top border-secondary text-center">
                        <a href="signup.html" class="text-cyan small"><i class="bi bi-person-plus me-1"></i> Register a New Custom Account</a>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        },

        highlightActiveRoute: function() {
            const currentPath = window.location.pathname.split('/').pop() || 'dashboard.html';
            document.querySelectorAll('.app-link').forEach(link => {
                if (link.getAttribute('data-route') === currentPath) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        },

        attachGlobalEvents: function() {
            const userBtn = document.getElementById('userMenuBtn');
            const userDropdown = document.getElementById('userDropdown');
            const notifBtn = document.getElementById('notifBell');
            const notifDropdown = document.getElementById('notifDropdown');
            const switcherModal = document.getElementById('userSwitcherModal');

            if (userBtn && userDropdown) {
                userBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    userDropdown.style.display = userDropdown.style.display === 'none' ? 'block' : 'none';
                    if (notifDropdown) notifDropdown.style.display = 'none';
                });
            }

            if (notifBtn && notifDropdown) {
                notifBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    notifDropdown.style.display = notifDropdown.style.display === 'none' ? 'block' : 'none';
                    if (userDropdown) userDropdown.style.display = 'none';
                });
            }

            document.addEventListener('click', function() {
                if (userDropdown) userDropdown.style.display = 'none';
                if (notifDropdown) notifDropdown.style.display = 'none';
            });

            // Mobile menu toggle
            const mobileToggle = document.getElementById('appMobileToggle');
            const drawer = document.getElementById('appMobileDrawer');
            const closeDrawer = document.getElementById('btnCloseDrawer');

            if (mobileToggle && drawer) {
                mobileToggle.addEventListener('click', function() {
                    drawer.style.display = 'block';
                });
            }
            if (closeDrawer && drawer) {
                closeDrawer.addEventListener('click', function() {
                    drawer.style.display = 'none';
                });
            }

            // Logout
            const logoutBtn = document.getElementById('btnLogoutAction');
            const drawerLogout = document.getElementById('btnDrawerLogout');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', function() {
                    window.Auth.logout();
                });
            }
            if (drawerLogout) {
                drawerLogout.addEventListener('click', function() {
                    window.Auth.logout();
                });
            }

            // Switcher Modal Triggers
            const openSwitcher = document.getElementById('btnOpenSwitcher');
            const drawerSwitcher = document.getElementById('btnDrawerSwitcher');
            const closeSwitcher = document.getElementById('btnCloseSwitcher');

            function showModal() {
                if (switcherModal) switcherModal.style.display = 'flex';
                if (drawer) drawer.style.display = 'none';
            }
            function hideModal() {
                if (switcherModal) switcherModal.style.display = 'none';
            }

            if (openSwitcher) openSwitcher.addEventListener('click', showModal);
            if (drawerSwitcher) drawerSwitcher.addEventListener('click', showModal);
            if (closeSwitcher) closeSwitcher.addEventListener('click', hideModal);

            if (switcherModal) {
                switcherModal.addEventListener('click', function(e) {
                    if (e.target === switcherModal) hideModal();
                    const card = e.target.closest('.switcher-account-card');
                    if (card) {
                        const uid = card.getAttribute('data-uid');
                        window.Auth.switchUser(uid);
                    }
                });
            }
        },

        showToast: function(message, type = 'info') {
            let container = document.getElementById('toastContainer');
            if (!container) {
                container = document.createElement('div');
                container.id = 'toastContainer';
                container.className = 'app-toast-container';
                document.body.appendChild(container);
            }

            const toast = document.createElement('div');
            toast.className = `app-toast toast-${type}`;
            toast.innerHTML = `
                <i class="bi ${type === 'success' ? 'bi-check-circle-fill text-success' : 'bi-info-circle-fill text-cyan'} me-2"></i>
                <span>${message}</span>
            `;

            container.appendChild(toast);
            setTimeout(() => {
                toast.classList.add('show');
            }, 10);

            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }, 3500);
        }
    };

    window.App = App;
})(window);
