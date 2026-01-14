import { motion, useSpring, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';
import { fetchStreakData, StreakData } from '../utils/api';

interface StreakTrackerProps {
    refreshTrigger?: number;
    userId?: string;
}

const StreakTracker = ({ refreshTrigger, userId }: StreakTrackerProps) => {
    const [completedDays, setCompletedDays] = useState<boolean[]>([]);
    const [currentStreak, setCurrentStreak] = useState(0);

    // Spring animation for streak counter
    const springStreak = useSpring(0, { stiffness: 300, damping: 30 });
    const displayStreak = useTransform(springStreak, (val) => Math.round(val));

    const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

    useEffect(() => {
        if (!userId) return;

        const loadStreak = async () => {
            try {
                const data: StreakData = await fetchStreakData(userId);
                setCurrentStreak(data.currentStreak);
                springStreak.set(data.currentStreak);

                // Calculate boolean array for last 7 days based on dates
                const daysResult: boolean[] = [];
                const completedSet = new Set(data.completedDates); // Assuming 'YYYY-MM-DD' strings wait no, toDateString

                for (let i = 6; i >= 0; i--) {
                    const date = new Date();
                    date.setDate(date.getDate() - i);
                    const dateStr = date.toDateString();
                    daysResult.push(completedSet.has(dateStr));
                }
                setCompletedDays(daysResult);

            } catch (e) {
                console.error("Streak load failed", e);
            }
        };
        loadStreak();
    }, [refreshTrigger, userId, springStreak]);

    // Get the day labels starting from today - 6 days
    const getDayLabel = (index: number): string => {
        const today = new Date();
        const dayOffset = 6 - index; // 0 = 6 days ago, 6 = today
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() - dayOffset);
        return dayLabels[targetDate.getDay() === 0 ? 6 : targetDate.getDay() - 1];
    };

    return (
        <motion.div
            className="mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
        >
            {/* Streak Counter */}
            <motion.div
                className="flex items-center justify-center gap-2 mb-6"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
            >
                <span className="text-2xl">🔥</span>
                <motion.span
                    className="text-2xl font-bold gradient-text"
                >
                    <motion.span>{displayStreak}</motion.span>
                </motion.span>
                <span className="text-white/50 text-lg">
                    {currentStreak === 1 ? 'Day' : 'Days'}
                </span>
            </motion.div>

            {/* Week Nodes */}
            <div className="flex items-center justify-center gap-3">
                {completedDays.map((completed, index) => (
                    <motion.div
                        key={index}
                        className="flex flex-col items-center gap-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                    >
                        {/* Node */}
                        <motion.div
                            className={`
                w-8 h-8 md:w-10 md:h-10
                rounded-full
                flex items-center justify-center
                border-2
                transition-all duration-300
              `}
                            style={{
                                borderColor: completed ? 'transparent' : 'rgba(255, 255, 255, 0.15)',
                                background: completed
                                    ? 'linear-gradient(135deg, #00FFFF, #7B2CBF, #0099FF)'
                                    : 'rgba(255, 255, 255, 0.03)',
                                boxShadow: completed
                                    ? '0 0 20px rgba(0, 255, 255, 0.4), 0 0 40px rgba(123, 44, 191, 0.3)'
                                    : 'none',
                            }}
                            whileHover={{ scale: 1.1 }}
                        >
                            {completed && (
                                <motion.svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
                                >
                                    <path
                                        d="M5 12L10 17L19 7"
                                        stroke="white"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </motion.svg>
                            )}
                        </motion.div>

                        {/* Day label */}
                        <span className={`
              text-xs
              ${completed ? 'text-white/70' : 'text-white/30'}
              ${index === 6 ? 'font-semibold' : ''}
            `}>
                            {getDayLabel(index)}
                        </span>
                    </motion.div>
                ))}
            </div>

            {/* Today indicator */}
            <motion.div
                className="text-center mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
            >
                <span className="text-xs text-white/30">
                    {completedDays[6] ? '✓ Today completed' : 'Today'}
                </span>
            </motion.div>
        </motion.div>
    );
};

export default StreakTracker;
