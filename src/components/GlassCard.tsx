import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassCardProps {
    children: ReactNode;
    className?: string;
}

const GlassCard = ({ children, className = '' }: GlassCardProps) => {
    return (
        <motion.div
            className={`
        relative
        bg-white/5
        backdrop-blur-md
        border border-white/10
        rounded-3xl
        p-8 md:p-12
        shadow-[0_8px_32px_rgba(0,0,0,0.3)]
        ${className}
      `}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{
                type: "spring",
                stiffness: 300,
                damping: 30
            }}
            style={{
                boxShadow: `
          0 8px 32px rgba(0, 0, 0, 0.3),
          0 0 60px rgba(0, 255, 255, 0.03),
          0 0 60px rgba(123, 44, 191, 0.03),
          inset 0 1px 1px rgba(255, 255, 255, 0.05)
        `
            }}
        >
            {/* Subtle gradient border glow */}
            <div
                className="absolute inset-0 rounded-3xl opacity-20 pointer-events-none"
                style={{
                    background: `
            linear-gradient(
              135deg,
              rgba(0, 255, 255, 0.1) 0%,
              transparent 50%,
              rgba(123, 44, 191, 0.1) 100%
            )
          `,
                }}
            />

            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
};

export default GlassCard;
