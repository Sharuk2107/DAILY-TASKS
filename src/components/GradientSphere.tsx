import { motion } from 'framer-motion';

interface GradientSphereProps {
    isTyping?: boolean;
    intensity?: number;
}

const GradientSphere = ({ isTyping = false, intensity = 1 }: GradientSphereProps) => {
    const baseFilter = 80;
    const dynamicFilter = isTyping ? baseFilter * 0.8 : baseFilter;
    const saturation = isTyping ? 1.3 * intensity : 1;
    const brightness = isTyping ? 1.2 * intensity : 1;

    return (
        <motion.div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/3 pointer-events-none"
            initial={{ scale: 1, opacity: 0 }}
            animate={{
                scale: [1, 1.05, 1],
                opacity: 1
            }}
            transition={{
                scale: {
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                },
                opacity: {
                    duration: 1,
                    ease: "easeOut"
                }
            }}
        >
            <motion.div
                className="relative w-[600px] h-[600px] md:w-[800px] md:h-[800px]"
                animate={{
                    filter: `blur(${dynamicFilter}px) saturate(${saturation}) brightness(${brightness})`
                }}
                transition={{ duration: 0.3 }}
            >
                {/* Main gradient sphere */}
                <div
                    className="absolute inset-0 rounded-full"
                    style={{
                        background: `
              radial-gradient(
                ellipse at 30% 40%,
                rgba(0, 255, 255, 0.8) 0%,
                transparent 50%
              ),
              radial-gradient(
                ellipse at 70% 60%,
                rgba(123, 44, 191, 0.8) 0%,
                transparent 50%
              ),
              radial-gradient(
                ellipse at 50% 80%,
                rgba(0, 153, 255, 0.8) 0%,
                transparent 50%
              ),
              radial-gradient(
                circle at 50% 50%,
                rgba(0, 255, 255, 0.3) 0%,
                rgba(123, 44, 191, 0.3) 40%,
                rgba(0, 153, 255, 0.3) 70%,
                transparent 100%
              )
            `,
                    }}
                />

                {/* Animated mesh overlay */}
                <motion.div
                    className="absolute inset-0 rounded-full opacity-60"
                    animate={{
                        rotate: [0, 360]
                    }}
                    transition={{
                        duration: 60,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    style={{
                        background: `
              conic-gradient(
                from 0deg at 50% 50%,
                transparent 0deg,
                rgba(0, 255, 255, 0.4) 60deg,
                transparent 120deg,
                rgba(123, 44, 191, 0.4) 180deg,
                transparent 240deg,
                rgba(0, 153, 255, 0.4) 300deg,
                transparent 360deg
              )
            `,
                    }}
                />

                {/* Secondary rotating layer */}
                <motion.div
                    className="absolute inset-0 rounded-full opacity-40"
                    animate={{
                        rotate: [360, 0]
                    }}
                    transition={{
                        duration: 45,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    style={{
                        background: `
              conic-gradient(
                from 180deg at 50% 50%,
                rgba(0, 255, 255, 0.3) 0deg,
                transparent 90deg,
                rgba(0, 153, 255, 0.3) 180deg,
                transparent 270deg,
                rgba(123, 44, 191, 0.3) 360deg
              )
            `,
                    }}
                />
            </motion.div>
        </motion.div>
    );
};

export default GradientSphere;
