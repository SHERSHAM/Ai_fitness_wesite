/* ============================================================
   FITNEXA AI — PERSISTENT DATA STORE & WORKOUT ENGINE
   Multi-user data isolation, rich workout catalog & local persistence
   ============================================================ */

(function(window) {
    'use strict';

    const STORAGE_KEY_PREFIX = 'fitnexa_';

    // ── DEFAULT WORKOUT CATALOG ──────────────────────────────
    const WORKOUT_CATALOG = [
        {
            id: 'upper-body-power',
            name: 'Upper Body Power',
            category: 'Strength',
            difficulty: 'Intermediate',
            duration: 45,
            calories: 420,
            image: 'images/workout-strength.webp',
            equipment: 'Full Gym',
            targetMuscles: ['Chest', 'Shoulders', 'Triceps', 'Upper Back'],
            goal: 'Build Strength',
            description: 'Intense hypertrophy and strength routine targeting the chest, shoulders, and triceps with progressive overload.',
            exercises: [
                {
                    name: 'Barbell Bench Press',
                    sets: 4,
                    reps: '8-10',
                    rest: '90s',
                    target: 'Chest & Triceps',
                    instructions: 'Retract scapulae, maintain arch, lower barbell with control to mid-chest, drive upward forcefully.',
                    formCue: 'Keep shoulders pinned and drive through feet.'
                },
                {
                    name: 'Incline Dumbbell Press',
                    sets: 3,
                    reps: '10-12',
                    rest: '60s',
                    target: 'Upper Chest',
                    instructions: 'Set bench to 30 degrees. Lower dumbbells slowly until slight stretch, press upward in arc.',
                    formCue: 'Do not bounce at the bottom of the movement.'
                },
                {
                    name: 'Bent-Over Barbell Row',
                    sets: 4,
                    reps: '8-10',
                    rest: '90s',
                    target: 'Lats & Rhomboids',
                    instructions: 'Hinge at hips to 45 degrees, pull bar to lower abdomen, squeeze lats at peak contraction.',
                    formCue: 'Maintain neutral spine without rounding lumbar.'
                },
                {
                    name: 'Overhead Dumbbell Shoulder Press',
                    sets: 3,
                    reps: '10-12',
                    rest: '60s',
                    target: 'Anterior & Medial Deltoids',
                    instructions: 'Press dumbbells overhead from ear level until arms fully extend without locking elbows.',
                    formCue: 'Brace core tightly to avoid hyperextending lower back.'
                },
                {
                    name: 'Dumbbell Lateral Raises',
                    sets: 4,
                    reps: '12-15',
                    rest: '45s',
                    target: 'Side Deltoids',
                    instructions: 'Raise dumbbells laterally leading with elbows to shoulder height with slight forward lean.',
                    formCue: 'Control the descent — 2 seconds negative.'
                },
                {
                    name: 'Tricep Rope Pushdowns',
                    sets: 3,
                    reps: '12-15',
                    rest: '45s',
                    target: 'Triceps',
                    instructions: 'Keep elbows tucked at sides, press down and spread rope apart at bottom lockout.',
                    formCue: 'Isolate triceps without using torso momentum.'
                }
            ]
        },
        {
            id: 'hiit-metabolic-blaze',
            name: 'HIIT Metabolic Blaze',
            category: 'HIIT',
            difficulty: 'Advanced',
            duration: 30,
            calories: 480,
            image: 'images/workout-hiit.webp',
            equipment: 'Dumbbells, Bodyweight',
            targetMuscles: ['Full Body', 'Cardiovascular', 'Core'],
            goal: 'Lose Fat',
            description: 'High-intensity interval blast designed to maximize excess post-exercise oxygen consumption (EPOC) and rapid fat loss.',
            exercises: [
                {
                    name: 'Dumbbell Thrusters',
                    sets: 4,
                    reps: '45s on / 15s rest',
                    rest: '45s',
                    target: 'Quads, Shoulders, Core',
                    instructions: 'Front squat with dumbbells at shoulders, drive through heels and press overhead explosively.',
                    formCue: 'Keep chest upright throughout squat depth.'
                },
                {
                    name: 'Kettlebell / Dumbbell Swings',
                    sets: 4,
                    reps: '45s on / 15s rest',
                    rest: '45s',
                    target: 'Glutes, Hamstrings, Core',
                    instructions: 'Hinge back aggressively at hips, snap hips forward to propel weight to eye level.',
                    formCue: 'Power comes from hips, not arms.'
                },
                {
                    name: 'Burpee Box Jumps',
                    sets: 4,
                    reps: '40s on / 20s rest',
                    rest: '45s',
                    target: 'Full Body Explosive',
                    instructions: 'Drop into chest-to-deck burpee, pop up immediately and jump onto 20-24" platform with soft landing.',
                    formCue: 'Land softly with knees slightly bent.'
                },
                {
                    name: 'Mountain Climbers & Plank Jacks',
                    sets: 3,
                    reps: '45s on / 15s rest',
                    rest: '30s',
                    target: 'Core & Cardio',
                    instructions: 'Sprint knees to chest in high plank, alternate with jumping feet out and in.',
                    formCue: 'Keep hips level with shoulders.'
                },
                {
                    name: 'Renegade Rows to Pushup',
                    sets: 3,
                    reps: '40s on / 20s rest',
                    rest: '45s',
                    target: 'Chest, Upper Back, Core',
                    instructions: 'Pushup on dumbbells, row right arm, pushup, row left arm without twisting hips.',
                    formCue: 'Widen feet for anti-rotational stability.'
                }
            ]
        },
        {
            id: 'lower-body-hypertrophy',
            name: 'Lower Body Hypertrophy',
            category: 'Muscle Building',
            difficulty: 'Intermediate',
            duration: 50,
            calories: 490,
            image: 'images/hero-athlete.webp',
            equipment: 'Full Gym',
            targetMuscles: ['Quadriceps', 'Hamstrings', 'Glutes', 'Calves'],
            goal: 'Build Muscle',
            description: 'Comprehensive leg day targeting maximal quadricep, hamstring, and glute muscle fiber recruitment.',
            exercises: [
                {
                    name: 'Barbell Back Squat',
                    sets: 4,
                    reps: '8-10',
                    rest: '90s',
                    target: 'Quads & Glutes',
                    instructions: 'Bar resting across traps, brace core, break at hips and knees simultaneously, descend below parallel.',
                    formCue: 'Knees track over toes, drive floor away.'
                },
                {
                    name: 'Romanian Deadlift (RDL)',
                    sets: 4,
                    reps: '10-12',
                    rest: '75s',
                    target: 'Hamstrings & Glutes',
                    instructions: 'Slight bend in knees, hinge hips back keeping bar glued to thighs until deep hamstring stretch.',
                    formCue: 'Do not round spine at bottom stretch.'
                },
                {
                    name: 'Bulgarian Split Squats',
                    sets: 3,
                    reps: '10 / leg',
                    rest: '60s',
                    target: 'Quads & Glutes Single-Leg',
                    instructions: 'Rear foot elevated on bench, descend until front thigh is parallel to ground, drive through front mid-foot.',
                    formCue: 'Stay upright to emphasize quads, lean forward for glutes.'
                },
                {
                    name: 'Standing Calf Raises',
                    sets: 4,
                    reps: '15-20',
                    rest: '45s',
                    target: 'Gastrocnemius',
                    instructions: 'Full stretch at bottom for 1 second pause, press high onto balls of feet, squeeze at top.',
                    formCue: 'Eliminate bouncy momentum.'
                }
            ]
        },
        {
            id: 'core-athletic-conditioning',
            name: 'Athletic Conditioning & Core',
            category: 'Endurance',
            difficulty: 'Intermediate',
            duration: 40,
            calories: 380,
            image: 'images/workout-endurance.webp',
            equipment: 'Medicine Ball, Resistance Bands',
            targetMuscles: ['Core', 'Obliques', 'Shoulders', 'Cardio'],
            goal: 'Improve Endurance',
            description: 'Functional conditioning circuit developing rotational power, isometric stamina, and cardiovascular engine.',
            exercises: [
                {
                    name: 'Med Ball Rotational Slams',
                    sets: 4,
                    reps: '12 / side',
                    rest: '45s',
                    target: 'Obliques & Transverse Abdominis',
                    instructions: 'Pivot back foot, generate rotation through torso and slam ball into ground beside lead foot.',
                    formCue: 'Violent hip rotation generates the power.'
                },
                {
                    name: 'Hanging Leg Raises',
                    sets: 4,
                    reps: '12-15',
                    rest: '45s',
                    target: 'Lower Abdominals & Hip Flexors',
                    instructions: 'Hang from bar with active shoulders, curl pelvis up toward ribs without swinging body.',
                    formCue: 'Do not use swinging momentum.'
                },
                {
                    name: 'Hollow Body Hold',
                    sets: 3,
                    reps: '45s',
                    rest: '30s',
                    target: 'Deep Core Bracing',
                    instructions: 'Press lower back flush into floor, arms overhead, legs extended 6" off floor, breathe rhythmically.',
                    formCue: 'Ensure zero gap between lumbar spine and mat.'
                }
            ]
        },
        {
            id: 'pure-fat-shred',
            name: 'Pure Fat Shred Circuit',
            category: 'Fat Loss',
            difficulty: 'Beginner',
            duration: 35,
            calories: 360,
            image: 'images/workout-fatloss.webp',
            equipment: 'Dumbbells, Mat',
            targetMuscles: ['Full Body', 'Heart Rate', 'Metabolism'],
            goal: 'Lose Fat',
            description: 'Fast-paced calorie burning circuit alternating compound strength and bodyweight cardio movements.',
            exercises: [
                {
                    name: 'Goblet Squats to Press',
                    sets: 4,
                    reps: '12-15',
                    rest: '45s',
                    target: 'Quads, Core, Shoulders',
                    instructions: 'Hold single dumbbell at chest, perform deep squat, press overhead at top of ascent.',
                    formCue: 'Keep elbows inside knees at bottom.'
                },
                {
                    name: 'Reverse Lunges with Bicep Curl',
                    sets: 3,
                    reps: '10 / side',
                    rest: '45s',
                    target: 'Hamstrings, Glutes, Biceps',
                    instructions: 'Step back into lunge, curl dumbbells simultaneously, return to standing with control.',
                    formCue: 'Maintain 90-degree angle on lead knee.'
                },
                {
                    name: 'Speed Skaters & Lateral Bounds',
                    sets: 4,
                    reps: '45s',
                    rest: '30s',
                    target: 'Lateral Chain & Cardio',
                    instructions: 'Bound laterally from one foot to other, absorbing landing on bent knee with arm swing.',
                    formCue: 'Absorb landing quietly through mid-foot.'
                }
            ]
        },
        {
            id: 'deep-mobility-restore',
            name: 'Deep Mobility & Recovery',
            category: 'Mobility',
            difficulty: 'Beginner',
            duration: 25,
            calories: 140,
            image: 'images/workout-mobility.webp',
            equipment: 'Foam Roller, Mat, Band',
            targetMuscles: ['Thoracic Spine', 'Hip Flexors', 'Hamstrings', 'Ankles'],
            goal: 'Improve Mobility',
            description: 'Gentle active recovery and kinetic release to enhance joint range of motion, relieve soreness, and prime recovery.',
            exercises: [
                {
                    name: 'World\'s Greatest Stretch',
                    sets: 3,
                    reps: '6 / side',
                    rest: '30s',
                    target: 'Hips, Thoracic Spine, Hamstrings',
                    instructions: 'Deep forward lunge, place hands inside front foot, rotate upper arm toward ceiling with deep exhale.',
                    formCue: 'Breathe into the thoracic twist.'
                },
                {
                    name: '90/90 Hip Flow & Transitions',
                    sets: 3,
                    reps: '8 transitions',
                    rest: '30s',
                    target: 'Hip Internal & External Rotation',
                    instructions: 'Sit with both legs at 90-degree angles, pivot knees smoothly side-to-side without hands touching floor.',
                    formCue: 'Keep spine tall throughout rotation.'
                },
                {
                    name: 'Thoracic Foam Roll Extensions',
                    sets: 3,
                    reps: '10 extensions',
                    rest: '30s',
                    target: 'Upper Back Mobility',
                    instructions: 'Foam roller across upper back, hands supporting neck, extend spine backward over roller with exhale.',
                    formCue: 'Do not hyperextend lumbar spine.'
                }
            ]
        },
        {
            id: 'iron-bench-chest-specialization',
            name: 'Iron Bench: Chest Specialization',
            category: 'Strength',
            difficulty: 'Advanced',
            duration: 55,
            calories: 470,
            image: 'images/form-analysis.webp',
            equipment: 'Full Gym',
            targetMuscles: ['Pectorals', 'Anterior Deltoid', 'Triceps'],
            goal: 'Build Strength',
            description: 'Powerlifting-focused chest development featuring paused bench presses, heavy dumbbell work, and weighted dips.',
            exercises: [
                {
                    name: 'Pause Barbell Bench Press',
                    sets: 5,
                    reps: '5',
                    rest: '120s',
                    target: 'Chest Power',
                    instructions: 'Lower bar with 3s tempo, pause completely 1 second on chest without sinking, press explosively.',
                    formCue: 'Maintain maximum leg drive during the press.'
                },
                {
                    name: 'Weighted Chest Dips',
                    sets: 4,
                    reps: '6-8',
                    rest: '90s',
                    target: 'Lower Pectorals & Triceps',
                    instructions: 'Lean torso forward 30 degrees, lower until upper arms parallel to bars, press up smoothly.',
                    formCue: 'Do not let shoulders roll forward at bottom.'
                },
                {
                    name: 'Cable Fly High-to-Low',
                    sets: 3,
                    reps: '12-15',
                    rest: '60s',
                    target: 'Sternal Pectorals',
                    instructions: 'Set pulleys above shoulder level, bring hands down and across in hugging arc with 1s squeeze.',
                    formCue: 'Keep elbows slightly bent and static.'
                }
            ]
        },
        {
            id: 'functional-longevity-reset',
            name: 'Functional Longevity Reset',
            category: 'Recovery',
            difficulty: 'Beginner',
            duration: 30,
            calories: 160,
            image: 'images/recovery-athlete.webp',
            equipment: 'Mat, Yoga Block',
            targetMuscles: ['Full Body Alignment', 'Breathing', 'Spine'],
            goal: 'Maintain Fitness',
            description: 'Restorative session combining diaphragmatic breathwork, spinal decompression, and parasympathetic activation.',
            exercises: [
                {
                    name: 'Cat-Cow Segmented Articulation',
                    sets: 3,
                    reps: '10 cycles',
                    rest: '20s',
                    target: 'Spinal Decompression',
                    instructions: 'Move bone by bone from tailbone to crown of head, matching spinal extension to inhalation.',
                    formCue: 'Slow, deliberate segment-by-segment movement.'
                },
                {
                    name: 'Box Breathing 4-4-4-4',
                    sets: 1,
                    reps: '5 minutes',
                    rest: '0s',
                    target: 'Autonomic Nervous System Reset',
                    instructions: 'Inhale 4s, hold 4s, exhale 4s, hold 4s through nasal breathing to reduce cortisol.',
                    formCue: 'Expand lower ribcage 360 degrees.'
                }
            ]
        }
    ];

    // ── PRELOADED DEMO USERS ─────────────────────────────────
    const SEED_USERS = [
        {
            id: 'user_alex_mercer',
            fullName: 'Alex Mercer',
            email: 'alex@fitnexa.ai',
            password: 'password123',
            avatar: 'images/hero-athlete.webp',
            memberSince: 'January 2026',
            planTier: 'Pro AI Member',
            profile: {
                fitnessGoal: 'Build Strength',
                fitnessLevel: 'Intermediate',
                preferredTraining: ['Strength', 'Bodyweight'],
                trainingDays: 4,
                sessionDuration: '45 minutes',
                equipment: ['Full gym', 'Dumbbells'],
                environment: 'Gym',
                additionalNotes: 'Focusing on bench press 1RM and shoulder stability.',
                todayWorkoutId: 'upper-body-power'
            },
            dashboardStats: {
                weeklyProgressPercent: 78,
                workoutsCompleted: 5,
                workoutsTarget: 6,
                activeDays: 6,
                caloriesBurned: 2450,
                hoursTrained: 4.8,
                recoveryScore: 86,
                activeStreakDays: 12,
                strengthGainPercent: 24,
                enduranceGainPercent: 18,
                consistencyPercent: 92
            },
            recovery: {
                score: 86,
                sleepHours: '7h 42m',
                sleepEfficiency: 91,
                restingHeartRate: 54,
                hrv: 68,
                trainingLoad: 'Medium',
                readiness: 'High',
                aiRecommendation: 'Your recovery score is high today (86%). Central nervous system recovery is optimal. You are primed for a high-intensity strength or hypertrophy session.'
            },
            nutrition: {
                calorieTarget: 2420,
                proteinGrams: 165,
                carbsGrams: 240,
                fatGrams: 70,
                waterLiters: 2.8,
                meals: [
                    { time: 'Breakfast', name: 'Greek Yogurt + Berries & Granola', calories: 420, protein: 32, carbs: 48, fat: 10 },
                    { time: 'Lunch', name: 'Grilled Chicken & Quinoa Rice Bowl', calories: 680, protein: 48, carbs: 75, fat: 18 },
                    { time: 'Dinner', name: 'Atlantic Salmon + Roasted Sweet Potato & Greens', calories: 620, protein: 52, carbs: 54, fat: 22 },
                    { time: 'Snack', name: 'Whey Isolate Protein Smoothie & Almonds', calories: 340, protein: 33, carbs: 24, fat: 12 }
                ]
            },
            workoutHistory: [
                { id: 'sess_101', date: 'Yesterday', workoutName: 'Chest & Deltoid Power', duration: '46 min', calories: 430, formScore: 94, completed: true },
                { id: 'sess_102', date: '2 days ago', workoutName: 'Lower Body Hypertrophy', duration: '52 min', calories: 510, formScore: 92, completed: true },
                { id: 'sess_103', date: '4 days ago', workoutName: 'Back & Core Volume', duration: '48 min', calories: 440, formScore: 95, completed: true },
                { id: 'sess_104', date: '5 days ago', workoutName: 'Upper Body Power', duration: '44 min', calories: 415, formScore: 93, completed: true },
                { id: 'sess_105', date: '6 days ago', workoutName: 'Mobility & Hip Flow', duration: '25 min', calories: 150, formScore: 98, completed: true }
            ],
            chatHistory: [
                { sender: 'user', text: 'What should I train today?' },
                { sender: 'ai', text: 'Your recovery is strong today at 86%. Based on your 4-day strength split, today is Upper Body Power — focusing on barbell bench press, incline press, and deltoid stability.' }
            ]
        },
        {
            id: 'user_sarah_connor',
            fullName: 'Sarah Connor',
            email: 'sarah@fitnexa.ai',
            password: 'password123',
            avatar: 'images/workout-hiit.webp',
            memberSince: 'February 2026',
            planTier: 'Elite Performance',
            profile: {
                fitnessGoal: 'Lose Fat',
                fitnessLevel: 'Advanced',
                preferredTraining: ['HIIT', 'Running', 'Mobility'],
                trainingDays: 5,
                sessionDuration: '30 minutes',
                equipment: ['Dumbbells', 'Resistance bands', 'Home gym'],
                environment: 'Home',
                additionalNotes: 'Cardio endurance and core conditioning focus.',
                todayWorkoutId: 'hiit-metabolic-blaze'
            },
            dashboardStats: {
                weeklyProgressPercent: 88,
                workoutsCompleted: 4,
                workoutsTarget: 5,
                activeDays: 5,
                caloriesBurned: 2890,
                hoursTrained: 3.5,
                recoveryScore: 92,
                activeStreakDays: 19,
                strengthGainPercent: 15,
                enduranceGainPercent: 34,
                consistencyPercent: 96
            },
            recovery: {
                score: 92,
                sleepHours: '8h 10m',
                sleepEfficiency: 95,
                restingHeartRate: 51,
                hrv: 74,
                trainingLoad: 'High',
                readiness: 'Peak',
                aiRecommendation: 'Peak recovery detected (92%). HRV is well above baseline. Excellent autonomic readiness for explosive HIIT metabolic intervals.'
            },
            nutrition: {
                calorieTarget: 1850,
                proteinGrams: 140,
                carbsGrams: 160,
                fatGrams: 55,
                waterLiters: 3.2,
                meals: [
                    { time: 'Breakfast', name: 'Egg White Omelet with Spinach & Avocado', calories: 360, protein: 34, carbs: 12, fat: 16 },
                    { time: 'Lunch', name: 'Chipotle Chicken Salad Bowl', calories: 540, protein: 44, carbs: 38, fat: 18 },
                    { time: 'Dinner', name: 'Seared Tuna Steak with Edamame & Brown Rice', calories: 580, protein: 48, carbs: 46, fat: 14 },
                    { time: 'Snack', name: 'Greek Yogurt with Flaxseed & Blueberries', calories: 240, protein: 22, carbs: 20, fat: 6 }
                ]
            },
            workoutHistory: [
                { id: 'sess_201', date: 'Yesterday', workoutName: 'HIIT Metabolic Blaze', duration: '31 min', calories: 495, formScore: 96, completed: true },
                { id: 'sess_202', date: '2 days ago', workoutName: 'Sprint Intervals & Core', duration: '35 min', calories: 460, formScore: 94, completed: true },
                { id: 'sess_203', date: '3 days ago', workoutName: 'Kettlebell Shred Circuit', duration: '30 min', calories: 430, formScore: 95, completed: true },
                { id: 'sess_204', date: '5 days ago', workoutName: 'Athletic Conditioning', duration: '40 min', calories: 410, formScore: 97, completed: true }
            ],
            chatHistory: [
                { sender: 'user', text: 'How is my recovery looking for today\'s HIIT session?' },
                { sender: 'ai', text: 'You scored 92% readiness this morning with 8h 10m of deep sleep and an HRV of 74ms. You are in peak physiological condition for today\'s HIIT Metabolic Blaze!' }
            ]
        }
    ];

    // ── INITIALIZE STORAGE ───────────────────────────────────
    function initStorage() {
        try {
            const existingUsers = localStorage.getItem(STORAGE_KEY_PREFIX + 'users');
            if (!existingUsers) {
                localStorage.setItem(STORAGE_KEY_PREFIX + 'users', JSON.stringify(SEED_USERS));
            } else {
                // Verify valid JSON
                JSON.parse(existingUsers);
            }
        } catch (e) {
            try {
                localStorage.setItem(STORAGE_KEY_PREFIX + 'users', JSON.stringify(SEED_USERS));
            } catch (err) {
                console.warn('LocalStorage unavailable or quota exceeded. Operating with in-memory state.', err);
            }
        }

        try {
            const existingWorkouts = localStorage.getItem(STORAGE_KEY_PREFIX + 'workouts');
            if (!existingWorkouts) {
                localStorage.setItem(STORAGE_KEY_PREFIX + 'workouts', JSON.stringify(WORKOUT_CATALOG));
            } else {
                JSON.parse(existingWorkouts);
            }
        } catch (e) {
            try {
                localStorage.setItem(STORAGE_KEY_PREFIX + 'workouts', JSON.stringify(WORKOUT_CATALOG));
            } catch (err) {
                console.warn('LocalStorage unavailable for workouts.', err);
            }
        }
    }

    initStorage();

    // ── CORE DATA STORE METHODS ──────────────────────────────
    const DataStore = {
        // Users
        getUsers: function() {
            try {
                const data = localStorage.getItem(STORAGE_KEY_PREFIX + 'users');
                return data ? JSON.parse(data) : SEED_USERS;
            } catch (e) {
                return SEED_USERS;
            }
        },

        saveUsers: function(users) {
            try {
                localStorage.setItem(STORAGE_KEY_PREFIX + 'users', JSON.stringify(users));
            } catch (e) {
                console.error('Failed to save users', e);
            }
        },

        getUserById: function(userId) {
            const users = this.getUsers();
            return users.find(u => u.id === userId) || null;
        },

        getUserByEmail: function(email) {
            if (!email) return null;
            const users = this.getUsers();
            return users.find(u => u.email.toLowerCase() === email.trim().toLowerCase()) || null;
        },

        createUser: function(userData) {
            const users = this.getUsers();
            const newUser = {
                id: 'user_' + Date.now(),
                fullName: userData.fullName,
                email: userData.email.toLowerCase().trim(),
                password: userData.password,
                avatar: 'images/hero-athlete.webp',
                memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
                planTier: 'Pro AI Member',
                profile: {
                    fitnessGoal: userData.fitnessGoal || 'Build Muscle',
                    fitnessLevel: userData.fitnessLevel || 'Intermediate',
                    preferredTraining: userData.preferredTraining || ['Strength'],
                    trainingDays: userData.trainingDays || 4,
                    sessionDuration: userData.sessionDuration || '45 minutes',
                    equipment: userData.equipment || ['Full Gym'],
                    environment: userData.environment || 'Gym',
                    additionalNotes: userData.additionalNotes || '',
                    todayWorkoutId: 'upper-body-power'
                },
                dashboardStats: {
                    weeklyProgressPercent: 0,
                    workoutsCompleted: 0,
                    workoutsTarget: userData.trainingDays || 4,
                    activeDays: 0,
                    caloriesBurned: 0,
                    hoursTrained: 0,
                    recoveryScore: 90,
                    activeStreakDays: 0,
                    strengthGainPercent: 0,
                    enduranceGainPercent: 0,
                    consistencyPercent: 0
                },
                recovery: {
                    score: 88,
                    sleepHours: '7h 30m',
                    sleepEfficiency: 90,
                    restingHeartRate: 58,
                    hrv: 65,
                    trainingLoad: 'Moderate',
                    readiness: 'High',
                    aiRecommendation: 'Welcome to Fitnexa AI! Your physiological baseline is strong. Ready to calibrate your first training session.'
                },
                nutrition: {
                    calorieTarget: 2300,
                    proteinGrams: 160,
                    carbsGrams: 220,
                    fatGrams: 65,
                    waterLiters: 3.0,
                    meals: [
                        { time: 'Breakfast', name: 'Oatmeal with Whey Protein & Berries', calories: 450, protein: 35, carbs: 55, fat: 9 },
                        { time: 'Lunch', name: 'Turkey & Brown Rice Harvest Bowl', calories: 650, protein: 46, carbs: 68, fat: 16 },
                        { time: 'Dinner', name: 'Lean Beef & Roasted Broccoli with Quinoa', calories: 680, protein: 50, carbs: 55, fat: 20 },
                        { time: 'Snack', name: 'Almond Butter & Apple with Protein Shake', calories: 320, protein: 26, carbs: 28, fat: 10 }
                    ]
                },
                workoutHistory: [],
                chatHistory: [
                    { sender: 'ai', text: `Welcome to Fitnexa AI, ${userData.fullName.split(' ')[0]}! I've personalized your fitness matrix based on your onboarding preferences. How can I help you conquer today's training?` }
                ]
            };

            users.push(newUser);
            this.saveUsers(users);
            return newUser;
        },

        updateUser: function(userId, updates) {
            const users = this.getUsers();
            const index = users.findIndex(u => u.id === userId);
            if (index === -1) return null;

            users[index] = { ...users[index], ...updates };
            this.saveUsers(users);
            return users[index];
        },

        updateUserProfile: function(userId, profileUpdates) {
            const user = this.getUserById(userId);
            if (!user) return null;
            user.profile = { ...user.profile, ...profileUpdates };
            
            // Adjust today's workout dynamically if goal changed
            if (profileUpdates.fitnessGoal) {
                if (profileUpdates.fitnessGoal === 'Lose Fat') {
                    user.profile.todayWorkoutId = 'hiit-metabolic-blaze';
                } else if (profileUpdates.fitnessGoal === 'Build Muscle') {
                    user.profile.todayWorkoutId = 'lower-body-hypertrophy';
                } else if (profileUpdates.fitnessGoal === 'Improve Mobility') {
                    user.profile.todayWorkoutId = 'deep-mobility-restore';
                } else {
                    user.profile.todayWorkoutId = 'upper-body-power';
                }
            }
            return this.updateUser(userId, user);
        },

        // Save Onboarding Flow
        saveOnboarding: function(userId, data) {
            const user = this.getUserById(userId);
            if (!user) return null;

            user.profile.fitnessGoal = data.primaryGoal || user.profile.fitnessGoal;
            user.profile.fitnessLevel = data.fitnessLevel || user.profile.fitnessLevel;
            user.profile.preferredTraining = data.preferredTraining || user.profile.preferredTraining;
            user.profile.trainingDays = parseInt(data.trainingDays, 10) || user.profile.trainingDays;
            user.profile.sessionDuration = data.sessionDuration || user.profile.sessionDuration;
            user.profile.equipment = data.equipment || user.profile.equipment;
            user.profile.environment = data.environment || user.profile.environment;
            user.profile.additionalNotes = data.notes || '';

            user.dashboardStats.workoutsTarget = user.profile.trainingDays;

            // Tailor recommendations according to selections
            if (user.profile.fitnessGoal === 'Lose Fat') {
                user.profile.todayWorkoutId = 'hiit-metabolic-blaze';
                user.nutrition.calorieTarget = 1950;
                user.nutrition.proteinGrams = 155;
                user.nutrition.carbsGrams = 170;
                user.nutrition.fatGrams = 55;
            } else if (user.profile.fitnessGoal === 'Build Strength') {
                user.profile.todayWorkoutId = 'upper-body-power';
                user.nutrition.calorieTarget = 2600;
                user.nutrition.proteinGrams = 180;
                user.nutrition.carbsGrams = 280;
                user.nutrition.fatGrams = 75;
            } else if (user.profile.fitnessGoal === 'Build Muscle') {
                user.profile.todayWorkoutId = 'lower-body-hypertrophy';
                user.nutrition.calorieTarget = 2750;
                user.nutrition.proteinGrams = 185;
                user.nutrition.carbsGrams = 310;
                user.nutrition.fatGrams = 80;
            }

            return this.updateUser(userId, user);
        },

        // Workouts
        getWorkouts: function() {
            try {
                const data = localStorage.getItem(STORAGE_KEY_PREFIX + 'workouts');
                return data ? JSON.parse(data) : WORKOUT_CATALOG;
            } catch (e) {
                return WORKOUT_CATALOG;
            }
        },

        getWorkoutById: function(id) {
            const workouts = this.getWorkouts();
            return workouts.find(w => w.id === id) || workouts[0];
        },

        // Record Completed Workout Session
        recordSession: function(userId, session) {
            const user = this.getUserById(userId);
            if (!user) return null;

            const sessionRecord = {
                id: 'sess_' + Date.now(),
                date: 'Just now',
                timestamp: new Date().toISOString(),
                workoutId: session.workoutId,
                workoutName: session.workoutName,
                duration: session.duration || '35 min',
                calories: session.calories || 380,
                formScore: session.formScore || 94,
                completed: true
            };

            if (!user.workoutHistory) user.workoutHistory = [];
            user.workoutHistory.unshift(sessionRecord);

            // Update stats
            user.dashboardStats.workoutsCompleted += 1;
            user.dashboardStats.caloriesBurned += sessionRecord.calories;
            user.dashboardStats.activeStreakDays += 1;
            user.dashboardStats.weeklyProgressPercent = Math.min(100, Math.round((user.dashboardStats.workoutsCompleted / user.dashboardStats.workoutsTarget) * 100));

            return this.updateUser(userId, user);
        },

        // Chat History
        addChatMessage: function(userId, message) {
            const user = this.getUserById(userId);
            if (!user) return;
            if (!user.chatHistory) user.chatHistory = [];
            user.chatHistory.push(message);
            this.updateUser(userId, user);
        },

        // Reset demo data helper
        resetDemoData: function() {
            try {
                localStorage.setItem(STORAGE_KEY_PREFIX + 'users', JSON.stringify(SEED_USERS));
                localStorage.setItem(STORAGE_KEY_PREFIX + 'workouts', JSON.stringify(WORKOUT_CATALOG));
            } catch (e) {
                console.warn('LocalStorage unavailable for reset.', e);
            }
        }
    };

    window.DataStore = DataStore;
})(window);
