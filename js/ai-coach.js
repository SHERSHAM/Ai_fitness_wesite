/* ============================================================
   FITNEXA AI — CONVERSATIONAL AI COACH ENGINE
   Context-aware fitness intelligence, dynamic advice & typing simulation
   ============================================================ */

(function(window) {
    'use strict';

    const AICoach = {
        generateResponse: function(user, promptText) {
            const prompt = promptText.toLowerCase().trim();
            const goal = user.profile.fitnessGoal;
            const recovery = user.recovery.score;
            const streak = user.dashboardStats.activeStreakDays;
            const name = user.fullName.split(' ')[0];
            const todayWorkout = window.DataStore ? window.DataStore.getWorkoutById(user.profile.todayWorkoutId) : null;
            const workoutName = todayWorkout ? todayWorkout.name : 'Targeted Functional Session';

            // Specific intent matching
            if (prompt.includes('what should i train') || prompt.includes('today') || prompt.includes('workout')) {
                if (recovery >= 80) {
                    return `Your recovery is peak today at ${recovery}%, ${name}. Central nervous system readiness is fully primed. Based on your ${goal} program, I've programmed **${workoutName}** (${todayWorkout ? todayWorkout.duration : 45} minutes). Push for progressive overload on your primary compound lifts today!`;
                } else if (recovery >= 65) {
                    return `Your recovery is moderate at ${recovery}%. You're cleared for **${workoutName}**, but maintain RPE 7-8 and prioritize clean form rather than maximal poundages today. Stay hydrated throughout!`;
                } else {
                    return `Your recovery score is lower today (${recovery}%). High-stress training is counterproductive right now. I recommend swapping to our **Deep Mobility & Recovery** routine or taking a brisk 30-minute outdoor walk to flush lactic acid and accelerate repair.`;
                }
            }

            if (prompt.includes('recovery') || prompt.includes('sleep') || prompt.includes('hrv') || prompt.includes('sore')) {
                return `**Biometric Recovery Breakdown for ${name}:**\n• Recovery Index: **${recovery}%** (${user.recovery.readiness} Readiness)\n• Sleep Tracked: **${user.recovery.sleepHours}** (${user.recovery.sleepEfficiency}% efficiency)\n• Resting Heart Rate: **${user.recovery.restingHeartRate} BPM** | HRV: **${user.recovery.hrv} ms**\n\n${user.recovery.aiRecommendation}`;
            }

            if (prompt.includes('nutrition') || prompt.includes('macro') || prompt.includes('eat') || prompt.includes('calorie') || prompt.includes('protein')) {
                return `**Nutrition Strategy for ${goal}:**\n• Daily Energy Target: **${user.nutrition.calorieTarget.toLocaleString()} kcal**\n• Protein: **${user.nutrition.proteinGrams}g** (for muscle protein synthesis)\n• Carbs: **${user.nutrition.carbsGrams}g** (glycogen replenishment)\n• Healthy Fats: **${user.nutrition.fatGrams}g** (hormonal balance)\n• Hydration Goal: **${user.nutrition.waterLiters} Liters**\n\n*Note: Nutritional recommendations represent general athletic wellness guidance and should not replace clinical dietetic advice.*`;
            }

            if (prompt.includes('progress') || prompt.includes('stats') || prompt.includes('how am i doing') || prompt.includes('strength')) {
                return `You're making outstanding headway, ${name}! Current metrics across the board:\n• Active Training Streak: **${streak} consecutive days**\n• Strength Gain: **+${user.dashboardStats.strengthGainPercent}%** over 30 days\n• Endurance Capacity: **+${user.dashboardStats.enduranceGainPercent}%**\n• Consistency Rating: **${user.dashboardStats.consistencyPercent}%**\n\nYour trajectory shows exceptional adherence to your ${user.profile.trainingDays}-day schedule. Keep this momentum locked in!`;
            }

            if (prompt.includes('change') || prompt.includes('plan') || prompt.includes('schedule') || prompt.includes('adjust')) {
                return `I can dynamically recalibrate your training architecture anytime! You are currently configured for **${goal}** across **${user.profile.trainingDays} days/week** in a **${user.profile.environment}** setting. Head over to your [Profile & Settings](profile.html) to adjust equipment, duration, or goal priorities, and my neural planner will re-synthesize your schedule instantly.`;
            }

            if (prompt.includes('motivation') || prompt.includes('tired') || prompt.includes('lazy') || prompt.includes('mindset')) {
                return `"The struggle you're in today is developing the strength you need for tomorrow."\n\n${name}, champions show up on days when motivation is zero and discipline takes over. You've conquered ${user.dashboardStats.workoutsCompleted} workouts this week with a ${streak}-day streak. Step up, execute the first 5 minutes of your warm-up, and let momentum carry you!`;
            }

            if (prompt.includes('form') || prompt.includes('squat') || prompt.includes('bench') || prompt.includes('deadlift')) {
                return `During compound movements, prioritize kinetic alignment:\n1. **Rooting:** Grip the floor with 3 points of contact (heel, big toe, pinky toe).\n2. **Bracing:** Draw a deep diaphragmatic breath into your abdomen and brace 360 degrees.\n3. **Tempo:** 2-3 second eccentric control, brief stabilization, explosive concentric power.\n\nCheck out the active form tracking inside the [Active Workout Player](workout-session.html) for real-time scoring!`;
            }

            // General smart conversational response
            return `I've analyzed your question through your ${goal} profile and current recovery baseline of ${recovery}%. Consistent micro-adjustments in training intensity, protein timing, and sleep hygiene will compound into massive physical gains. What specific aspect of your program would you like to drill into?`;
        }
    };

    window.AICoach = AICoach;
})(window);
