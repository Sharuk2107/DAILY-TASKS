import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

interface TaskInputProps {
    onSubmit: (task: string) => void;
    onTypingChange: (isTyping: boolean, intensity: number) => void;
}

const TaskInput = ({ onSubmit, onTypingChange }: TaskInputProps) => {
    const [task, setTask] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setTask(value);

        // Calculate intensity based on text length (max at 50 chars)
        const intensity = Math.min(value.length / 50, 1) + 1;
        onTypingChange(true, intensity);

        // Clear existing timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Set timeout to reset typing state
        typingTimeoutRef.current = setTimeout(() => {
            onTypingChange(false, 1);
        }, 300);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!task.trim()) return;

        onSubmit(task.trim());
        onTypingChange(false, 1);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && task.trim()) {
            handleSubmit(e);
        }
    };

    return (
        <motion.form
            onSubmit={handleSubmit}
            className="w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.input
                ref={inputRef}
                type="text"
                value={task}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="What is your one focus today?"
                className="
          w-full
          bg-transparent
          border-none
          outline-none
          text-2xl md:text-3xl lg:text-4xl
          font-light
          text-white
          placeholder-white/20
          text-center
          py-4
        "
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
            />

            <motion.p
                className="text-white/30 text-sm text-center mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                Press Enter to set your focus
            </motion.p>
        </motion.form>
    );
};

export default TaskInput;
