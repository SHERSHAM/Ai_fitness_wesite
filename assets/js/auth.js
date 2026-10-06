/* ============================================================
   FITNEXA AI — AUTHENTICATION & ROUTE GUARD (Supabase Edition)
   Session management using Supabase Auth
   ============================================================ */

(function(window) {
    'use strict';

    const Auth = {
        // Get current session from Supabase
        getCurrentUser: async function() {
            if (!window.supabaseClient) return null;
            const { data: { user }, error } = await window.supabaseClient.auth.getUser();
            if (error || !user) return null;
            return user;
        },

        // Synchronous check using cached session
        getCurrentUserSync: function() {
            if (!window.supabaseClient) return null;
            // This uses the cached session from the last getSession call
            const session = this._cachedSession;
            if (session && session.user) return session.user;
            return null;
        },

        isLoggedIn: function() {
            return !!this._cachedSession;
        },

        // Initialize session cache (call on page load)
        initSession: async function() {
            if (!window.supabaseClient) {
                this._cachedSession = null;
                return null;
            }
            const { data: { session }, error } = await window.supabaseClient.auth.getSession();
            this._cachedSession = session;
            return session;
        },

        // Login with email and password via Supabase
        login: async function(email, password) {
            if (!window.supabaseClient) {
                return { success: false, message: 'Supabase is not configured. Please check supabase-config.js.' };
            }

            const { data, error } = await window.supabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) {
                return { success: false, message: error.message };
            }

            this._cachedSession = data.session;
            return { success: true, user: data.user, session: data.session };
        },

        // Signup with email, password, and fullName via Supabase
        signup: async function(fullName, email, password) {
            if (!window.supabaseClient) {
                return { success: false, message: 'Supabase is not configured. Please check supabase-config.js.' };
            }

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

            const { data, error } = await window.supabaseClient.auth.signUp({
                email: email.trim(),
                password: password,
                options: {
                    data: {
                        full_name: fullName.trim()
                    }
                }
            });

            if (error) {
                return { success: false, message: error.message };
            }

            this._cachedSession = data.session;
            return { success: true, user: data.user, session: data.session };
        },

        // Logout
        logout: async function() {
            if (window.supabaseClient) {
                await window.supabaseClient.auth.signOut();
            }
            this._cachedSession = null;
            window.location.href = window.location.pathname.includes('/dashboard/') ? '../login.html' : 'login.html';
        },

        // Protected route guard: call on protected pages
        requireAuth: async function() {
            const session = await this.initSession();
            if (!session) {
                const currentPage = encodeURIComponent(window.location.pathname.split('/').pop() || 'index.html');
                const loginPath = window.location.pathname.includes('/dashboard/') ? '../login.html' : 'login.html';
                window.location.href = `${loginPath}?returnUrl=${currentPage}`;
                return false;
            }
            return true;
        },

        // Auth pages guard: redirect to dashboard if already authenticated
        redirectIfAuth: async function(destination) {
            destination = destination || (window.location.pathname.includes('/dashboard/') ? 'index.html' : 'dashboard/index.html');
            const session = await this.initSession();
            if (session) {
                window.location.href = destination;
                return true;
            }
            return false;
        },

        // Google OAuth Login
        loginWithGoogle: async function() {
            if (!window.supabaseClient) return;
            const { data, error } = await window.supabaseClient.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin + '/dashboard/index.html'
                }
            });
            if (error) {
                console.error('Google login error:', error.message);
            }
        },

        // Apple OAuth Login
        loginWithApple: async function() {
            if (!window.supabaseClient) return;
            const { data, error } = await window.supabaseClient.auth.signInWithOAuth({
                provider: 'apple',
                options: {
                    redirectTo: window.location.origin + '/dashboard/index.html'
                }
            });
            if (error) {
                console.error('Apple login error:', error.message);
            }
        },

        // Password reset
        resetPassword: async function(email) {
            if (!window.supabaseClient) {
                return { success: false, message: 'Supabase is not configured.' };
            }
            const { error } = await window.supabaseClient.auth.resetPasswordForEmail(email, {
                redirectTo: window.location.origin + '/login.html'
            });
            if (error) {
                return { success: false, message: error.message };
            }
            return { success: true, message: 'Password reset email sent. Check your inbox.' };
        },

        // Internal session cache
        _cachedSession: null
    };

    window.Auth = Auth;
})(window);
