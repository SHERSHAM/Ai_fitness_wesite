/* ============================================================
   FITNEXA AI — AUTHENTICATION & ROUTE GUARD
   Session management, multi-user isolation & protected routes
   ============================================================ */

(function(window) {
    'use strict';

    const SESSION_KEY = 'fitnexa_current_user_id';

    const Auth = {
        getCurrentUserId: function() {
            return localStorage.getItem(SESSION_KEY);
        },

        getCurrentUser: function() {
            const userId = this.getCurrentUserId();
            if (!userId) return null;
            return window.DataStore ? window.DataStore.getUserById(userId) : null;
        },

        isLoggedIn: function() {
            return !!this.getCurrentUser();
        },

        setCurrentUser: function(userId) {
            localStorage.setItem(SESSION_KEY, userId);
        },

        login: function(email, password) {
            if (!window.DataStore) return { success: false, message: 'System initializing. Please refresh.' };

            const user = window.DataStore.getUserByEmail(email);
            if (!user) {
                return { success: false, message: 'No account found with this email address.' };
            }

            if (user.password !== password) {
                return { success: false, message: 'Incorrect password. Please verify credentials.' };
            }

            this.setCurrentUser(user.id);
            return { success: true, user: user };
        },

        signup: function(fullName, email, password) {
            if (!window.DataStore) return { success: false, message: 'System initializing. Please refresh.' };

            if (!fullName || fullName.trim().length < 2) {
                return { success: false, message: 'Please provide your full name.' };
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email || !emailRegex.test(email.trim())) {
                return { success: false, message: 'Please provide a valid email address.' };
            }

            if (!password || password.length < 6) {
                return { success: false, message: 'Password must be at least 6 characters long.' };
            }

            const existingUser = window.DataStore.getUserByEmail(email);
            if (existingUser) {
                return { success: false, message: 'An account with this email already exists. Please log in.' };
            }

            const newUser = window.DataStore.createUser({
                fullName: fullName.trim(),
                email: email.trim(),
                password: password
            });

            this.setCurrentUser(newUser.id);
            return { success: true, user: newUser };
        },

        logout: function() {
            localStorage.removeItem(SESSION_KEY);
            window.location.href = 'login.html';
        },

        switchUser: function(userIdOrEmail) {
            if (!window.DataStore) return;
            let user = window.DataStore.getUserById(userIdOrEmail);
            if (!user) {
                user = window.DataStore.getUserByEmail(userIdOrEmail);
            }
            if (user) {
                this.setCurrentUser(user.id);
                window.location.reload();
            }
        },

        // Protected route guard: call on protected pages
        requireAuth: function() {
            const user = this.getCurrentUser();
            if (!user) {
                const currentPage = encodeURIComponent(window.location.pathname.split('/').pop() || 'dashboard.html');
                window.location.href = `login.html?returnUrl=${currentPage}`;
                return false;
            }
            return true;
        },

        // Auth pages guard: redirect to dashboard if already authenticated
        redirectIfAuth: function(destination = 'dashboard.html') {
            if (this.isLoggedIn()) {
                window.location.href = destination;
                return true;
            }
            return false;
        }
    };

    window.Auth = Auth;
})(window);
