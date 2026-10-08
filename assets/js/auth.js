/* ============================================================
   FITNEXA AI — AUTHENTICATION & ROUTE GUARD (Supabase Edition)
   Session management using Supabase Auth
   ============================================================ */

(function(window) {
    'use strict';

    const Auth = {
        // Get current session from Supabase or Developer Session
        getCurrentUser: async function() {
            if (this._cachedSession && this._cachedSession.user) {
                return this._cachedSession.user;
            }
            if (window.supabaseClient) {
                try {
                    const { data: { user }, error } = await window.supabaseClient.auth.getUser();
                    if (!error && user) return user;
                } catch (e) {}
            }
            const session = await this.initSession();
            return session ? session.user : null;
        },

        // Synchronous check using cached session
        getCurrentUserSync: function() {
            const session = this._cachedSession;
            if (session && session.user) return session.user;
            return null;
        },

        isLoggedIn: function() {
            return !!this._cachedSession;
        },

        // Initialize session cache (call on page load)
        initSession: async function() {
            let session = null;

            // 1. Try Supabase Session first if configured
            if (window.supabaseClient) {
                try {
                    const { data, error } = await window.supabaseClient.auth.getSession();
                    if (!error && data && data.session) {
                        session = data.session;
                    }
                } catch (e) {
                    console.warn('[FITNEXA Auth] Supabase getSession error:', e);
                }
            }

            // 2. If no Supabase session, check developer / local persistent session
            if (!session) {
                try {
                    const localDevSession = localStorage.getItem('fitnexa_auth_session');
                    if (localDevSession) {
                        session = JSON.parse(localDevSession);
                    }
                } catch (e) {
                    console.warn('[FITNEXA Auth] Local session parse error:', e);
                }
            }

            this._cachedSession = session;
            return session;
        },

        // Login with email and password (supports Developer Master Account and Supabase)
        login: async function(email, password) {
            const cleanEmail = (email || '').trim().toLowerCase();
            const cleanPass = (password || '').trim();

            // 1. Check for Developer Master Credentials
            const devEmails = ['developer@gmail.com', 'dev@gmail.com', 'dev.fitnexa@gmail.com', 'dev@fitnexa.ai'];
            const devPasswords = ['developer123', 'dev123', 'DevFitness2026!', 'password123', 'admin123'];

            if (devEmails.includes(cleanEmail) && devPasswords.includes(cleanPass)) {
                const devSession = {
                    access_token: 'fitnexa_dev_token_' + Date.now(),
                    token_type: 'bearer',
                    expires_in: 604800, // 7 days
                    user: {
                        id: 'dev_lead_master',
                        aud: 'authenticated',
                        role: 'authenticated',
                        email: 'developer@gmail.com',
                        user_metadata: {
                            full_name: 'Lead Developer'
                        }
                    }
                };

                this._cachedSession = devSession;
                try {
                    localStorage.setItem('fitnexa_auth_session', JSON.stringify(devSession));
                } catch (e) {}

                return { success: true, user: devSession.user, session: devSession, isDeveloper: true };
            }

            // 2. Check DataStore seed users (Alex Mercer, Sarah Connor, etc.)
            if (window.DataStore && window.DataStore.getUserByEmail) {
                const localUser = window.DataStore.getUserByEmail(cleanEmail);
                if (localUser && localUser.password === cleanPass) {
                    const seedSession = {
                        access_token: 'fitnexa_user_token_' + Date.now(),
                        token_type: 'bearer',
                        expires_in: 604800,
                        user: {
                            id: localUser.id,
                            aud: 'authenticated',
                            role: 'authenticated',
                            email: localUser.email,
                            user_metadata: {
                                full_name: localUser.fullName
                            }
                        }
                    };

                    this._cachedSession = seedSession;
                    try {
                        localStorage.setItem('fitnexa_auth_session', JSON.stringify(seedSession));
                    } catch (e) {}

                    return { success: true, user: seedSession.user, session: seedSession };
                }
            }

            // 3. Try Supabase Auth
            if (window.supabaseClient) {
                try {
                    const { data, error } = await window.supabaseClient.auth.signInWithPassword({
                        email: cleanEmail,
                        password: cleanPass
                    });

                    if (error) {
                        return { success: false, message: error.message };
                    }

                    this._cachedSession = data.session;
                    return { success: true, user: data.user, session: data.session };
                } catch (err) {
                    return { success: false, message: err.message || 'Supabase authentication failed.' };
                }
            }

            return { success: false, message: 'Invalid credentials. Please check your email and password.' };
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
            try {
                localStorage.removeItem('fitnexa_auth_session');
            } catch (e) {}
            if (window.supabaseClient) {
                try {
                    await window.supabaseClient.auth.signOut();
                } catch (e) {}
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
