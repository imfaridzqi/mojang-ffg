import { useTheme } from '@/hooks/useTheme';

export default function ThemeToggle({ className = '' }) {
    const { dark, toggle } = useTheme();

    return (
        <button
            onClick={toggle}
            aria-label="Toggle theme"
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all
                bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10
                text-gray-600 dark:text-white/50 hover:text-gray-900 dark:hover:text-white/90
                ${className}`}
        >
            {dark ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
            )}
        </button>
    );
}
