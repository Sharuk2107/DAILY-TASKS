import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Task } from '../utils/api';
import ConfettiEffect from './ConfettiEffect';
import { playPopSound, playSuccessChord } from '../utils/sound';

interface ActiveTaskProps {
    task: Task;
    onComplete: () => void;
    onNewTask: () => void;
}

const ActiveTask = ({ task, onComplete, onNewTask }: ActiveTaskProps) => {
    const [showConfetti, setShowConfetti] = useState(false);
    const [isCompleted, setIsCompleted] = useState(task.completed);

    // Sync with prop changes (e.g. from initial load)
    useEffect(() => {
        setIsCompleted(task.completed);
    }, [task.completed]);

    const handleToggle = () => {
        if (!isCompleted) {
            setIsCompleted(true);
            setShowConfetti(true);
            playPopSound();
            setTimeout(playSuccessChord, 300); // Play chord shortly after
            onComplete();
        }
    };

    const handleConfettiComplete = () => {
        setShowConfetti(false);
    };

    return (
        <motion.div
            className="w-full max-w-2xl mx-auto text-center relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {/* Confetti Effect */}
            <ConfettiEffect isActive={showConfetti} onComplete={handleConfettiComplete} />

            {/* Task Display */}
            <div className="flex items-center justify-center gap-6 mb-8 group cursor-pointer" onClick={handleToggle}>
                {/* New Animated Checkbox */}
                <div className="relative">
                    <motion.div
                        className={`
                w-10 h-10 md:w-12 md:h-12
                rounded-full
                border-2
                flex items-center justify-center
                transition-all duration-500
                ${isCompleted
                                ? 'border-transparent bg-gradient-to-br from-cyan-400 to-blue-600 shadow-[0_0_30px_rgba(0,255,255,0.4)]'
                                : 'border-white/30 group-hover:border-white/60'}
              `}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        {isCompleted && (
                            <motion.svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                initial={{ scale: 0, rotate: -45 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 400, delay: 0.1 }}
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

                    {/* Ripple Effect Ring (shows momentarily on completion) */}
                    {showConfetti && (
                        <motion.div
                            className="absolute inset-0 rounded-full border-2 border-cyan-400"
                            initial={{ scale: 1, opacity: 1 }}
                            animate={{ scale: 2.5, opacity: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                    )}
                </div>


                <div className="relative">
                    <motion.h2
                        className={`
              text-2xl md:text-3xl lg:text-4xl
              font-semibold
              text-white
              transition-opacity duration-500
              ${isCompleted ? 'opacity-50' : 'opacity-100'}
            `}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: isCompleted ? 0.5 : 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        {task.text}
                    </motion.h2>

                    {/* Animated strikethrough */}
                    {isCompleted && (
                        <motion.div
                            className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-cyan-400 via-purple-500 to-blue-500"
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                        />
                    )}
                </div>
            </div>

            {/* Completion message */}
            {isCompleted && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8"
                >
                    <p className="text-white/50 mb-6">
                        Amazing work! You crushed your focus today. 🎉
                    </p>
                    <motion.button
                        onClick={onNewTask}
                        className="
              px-6 py-3
              rounded-xl
              bg-white/10
              border border-white/10
              text-white/70
              hover:bg-white/15
              hover:text-white
              transition-all
            "
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Set tomorrow's focus
                    </motion.button>
                </motion.div>
            )}
        </motion.div>
    );
};

export default ActiveTask;
