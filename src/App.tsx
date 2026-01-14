import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import GradientSphere from './components/GradientSphere';
import GlassCard from './components/GlassCard';
import WelcomeView from './components/WelcomeView';
import TaskInput from './components/TaskInput';
import ActiveTask from './components/ActiveTask';
import StreakTracker from './components/StreakTracker';
import { LogOut } from 'lucide-react';
import {
    User,
    Task,
    loginUser,
    fetchCurrentTask,
    createTask,
    completeTask
} from './utils/api';
import { getStoredUser, clearStoredUser } from './utils/storage';

type ViewState = 'welcome' | 'input' | 'active';

function App() {
    const [user, setUser] = useState<User | null>(null);
    const [task, setTask] = useState<Task | null>(null);
    const [viewState, setViewState] = useState<ViewState>('welcome');
    const [isTyping, setIsTyping] = useState(false);
    const [typingIntensity, setTypingIntensity] = useState(1);
    const [streakRefresh, setStreakRefresh] = useState(0);

    // Initialize state from localStorage (Session restoration)
    useEffect(() => {
        const initSession = async () => {
            const storedUser = getStoredUser();
            if (storedUser) {
                try {
                    // Verify/Refresh user data from API
                    const userData = await loginUser(storedUser.username);
                    setUser(userData);

                    // Fetch Task
                    if (userData.id) {
                        const currentTask = await fetchCurrentTask(userData.id);
                        if (currentTask) {
                            setTask(currentTask);
                            setViewState('active');
                        } else {
                            setViewState('input');
                        }
                    }
                } catch (e) {
                    console.error("Session restore failed", e);
                    clearStoredUser();
                    setViewState('welcome');
                }
            } else {
                setViewState('welcome');
            }
        };
        initSession();
    }, []);

    const handleLogin = async (newUser: User) => {
        setUser(newUser);
        if (newUser.id) {
            try {
                const currentTask = await fetchCurrentTask(newUser.id);
                if (currentTask) {
                    setTask(currentTask);
                    setViewState('active');
                } else {
                    setViewState('input');
                }
            } catch (e) {
                console.error(e);
                setViewState('input'); // Default
            }
        }
    };

    const handleLogout = () => {
        clearStoredUser();
        setUser(null);
        setTask(null);
        setViewState('welcome');
    };

    const handleTaskSubmit = async (taskText: string) => {
        if (!user || !user.id) return;

        try {
            const newTask = await createTask(user.id, taskText);
            setTask(newTask);
            setViewState('active');
        } catch (e) {
            console.error("Create task failed", e);
        }
    };

    const handleTaskComplete = async () => {
        if (!task || !user || !user.id) return;

        try {
            await completeTask(task.id, user.id);

            // Update local state to reflect completion immediately
            setTask({ ...task, completed: true });

            // Trigger streak refresh
            setStreakRefresh(prev => prev + 1);
        } catch (e) {
            console.error("Complete task failed", e);
        }
    };

    const handleNewTask = () => {
        setTask(null);
        setViewState('input');
    };

    const handleTypingChange = (typing: boolean, intensity: number) => {
        setIsTyping(typing);
        setTypingIntensity(intensity);
    };

    return (
        <div className="relative min-h-screen w-full bg-black overflow-hidden">
            {/* Animated Gradient Sphere */}
            <GradientSphere isTyping={isTyping} intensity={typingIntensity} />

            {/* Main Content */}
            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-8">
                {/* Logout Button - only show when logged in */}
                {user && (
                    <motion.button
                        onClick={handleLogout}
                        className="
              absolute top-6 right-6
              flex items-center gap-2
              px-4 py-2
              rounded-xl
              bg-white/5
              border border-white/10
              text-white/50
              hover:text-white/80
              hover:bg-white/10
              transition-all
            "
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <LogOut size={16} />
                        <span className="text-sm">Logout</span>
                    </motion.button>
                )}

                {/* User greeting - only show when logged in */}
                {user && viewState !== 'welcome' && (
                    <motion.div
                        className="absolute top-6 left-6 text-white/40 text-sm"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        Hey, <span className="text-white/60">{user.username}</span>
                    </motion.div>
                )}

                {/* Content Container */}
                <AnimatePresence mode="wait">
                    {viewState === 'welcome' && (
                        <motion.div
                            key="welcome"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="w-full flex justify-center"
                        >
                            <WelcomeView onLogin={handleLogin} />
                        </motion.div>
                    )}

                    {viewState === 'input' && (
                        <motion.div
                            key="input"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full max-w-2xl"
                        >
                            <GlassCard>
                                <TaskInput
                                    onSubmit={handleTaskSubmit}
                                    onTypingChange={handleTypingChange}
                                />
                            </GlassCard>
                            {/* Pass userId to StreakTracker */}
                            <StreakTracker refreshTrigger={streakRefresh} userId={user?.id} />
                        </motion.div>
                    )}

                    {viewState === 'active' && task && (
                        <motion.div
                            key="active"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full max-w-2xl"
                        >
                            <GlassCard>
                                <ActiveTask
                                    task={task}
                                    onComplete={handleTaskComplete}
                                    onNewTask={handleNewTask}
                                />
                            </GlassCard>
                            {/* Pass userId to StreakTracker */}
                            <StreakTracker refreshTrigger={streakRefresh} userId={user?.id} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default App;
