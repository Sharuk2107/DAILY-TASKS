import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface ConfettiEffectProps {
    isActive: boolean;
    onComplete?: () => void;
}

interface Particle {
    id: number;
    x: number;
    y: number;
    color: string;
    size: number;
    delay: number;
    rotation: number;
    velocity: { x: number; y: number };
}

const COLORS = [
    '#00FFFF', // Cyan
    '#7B2CBF', // Deep Purple
    '#0099FF', // Electric Blue
    '#00FFD4', // Cyan variant
    '#9D4EDD', // Purple variant
    '#0077FF', // Blue variant
];

const ConfettiEffect = ({ isActive, onComplete }: ConfettiEffectProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const particlesRef = useRef<Particle[]>([]);

    useEffect(() => {
        if (isActive) {
            // Generate particles
            particlesRef.current = Array.from({ length: 50 }, (_, i) => ({
                id: i,
                x: Math.random() * 200 - 100,
                y: Math.random() * -100 - 50,
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                size: Math.random() * 8 + 4,
                delay: Math.random() * 0.3,
                rotation: Math.random() * 720 - 360,
                velocity: {
                    x: (Math.random() - 0.5) * 300,
                    y: Math.random() * -200 - 100,
                },
            }));

            // Trigger completion after animation
            const timeout = setTimeout(() => {
                onComplete?.();
            }, 1500);

            return () => clearTimeout(timeout);
        }
    }, [isActive, onComplete]);

    if (!isActive) return null;

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 pointer-events-none overflow-hidden"
        >
            {particlesRef.current.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute left-1/2 top-1/2 rounded-full"
                    style={{
                        width: particle.size,
                        height: particle.size,
                        backgroundColor: particle.color,
                        boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
                    }}
                    initial={{
                        x: 0,
                        y: 0,
                        opacity: 1,
                        scale: 0,
                    }}
                    animate={{
                        x: particle.velocity.x,
                        y: [0, particle.velocity.y, particle.velocity.y + 200],
                        opacity: [1, 1, 0],
                        scale: [0, 1.5, 0.5],
                        rotate: particle.rotation,
                    }}
                    transition={{
                        duration: 1.2,
                        delay: particle.delay,
                        ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                />
            ))}
        </div>
    );
};

// Custom checkbox component with animation
interface AnimatedCheckboxProps {
    checked: boolean;
    onChange: () => void;
}

export const AnimatedCheckbox = ({ checked, onChange }: AnimatedCheckboxProps) => {
    const pathLength = useMotionValue(0);
    const opacity = useTransform(pathLength, [0, 0.5], [0, 1]);

    useEffect(() => {
        if (checked) {
            animate(pathLength, 1, { duration: 0.3, ease: "easeOut" });
        } else {
            animate(pathLength, 0, { duration: 0.2 });
        }
    }, [checked, pathLength]);

    return (
        <motion.button
            onClick={onChange}
            className="
        relative
        w-10 h-10 md:w-12 md:h-12
        rounded-full
        border-2
        flex items-center justify-center
        transition-colors
        flex-shrink-0
      "
            style={{
                borderColor: checked ? 'transparent' : 'rgba(255, 255, 255, 0.3)',
                background: checked
                    ? 'linear-gradient(135deg, #00FFFF, #7B2CBF, #0099FF)'
                    : 'transparent',
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
        >
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className="text-white"
            >
                <motion.path
                    d="M5 12L10 17L19 7"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ pathLength, opacity }}
                />
            </svg>
        </motion.button>
    );
};

export default ConfettiEffect;
