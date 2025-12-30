import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun } from 'react-bootstrap-icons';

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            style={{
                background: 'transparent',
                border: '1px solid var(--border-color)',
                padding: '8px',
                borderRadius: '50%',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px'
            }}
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={18} color="#fbbf24" />}
        </button>
    );
}
