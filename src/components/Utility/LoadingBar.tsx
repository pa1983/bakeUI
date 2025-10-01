import { useState, useEffect, useRef } from 'react';
import '../../styles/LoadingBar.css'; // For the fade transition

interface LoadingBarProps {
    isLoading: boolean;
    max_duration: number;
}

const LoadingBar = ({ isLoading, max_duration }: LoadingBarProps) => {
    const [progress, setProgress] = useState(0);
    const [show, setShow] = useState(false);
    const [barColor, setBarColor] = useState('hsl(141, 71%, 48%)'); // Initial Bulma 'is-success' green

    const intervalId = useRef<number | null>(null);

    // Function to linearly interpolate between two HSL colors
    const interpolateColor = (color1: { h: number, s: number, l: number }, color2: { h: number, s: number, l: number }, factor: number) => {
        const h = color1.h + (color2.h - color1.h) * factor;
        const s = color1.s + (color2.s - color1.s) * factor;
        const l = color1.l + (color2.l - color1.l) * factor;
        return `hsl(${h}, ${s}%, ${l}%)`;
    };

    useEffect(() => {
        const startColor = { h: 141, s: 71, l: 48 }; // Bulma 'is-success' green
        const endColor = { h: 220, s: 80, l: 60 };   // A nice vibrant blue/purple
        // You could also use hex and convert to HSL, or just define start/end as hsl strings

        const start = () => {
            setShow(true);
            setProgress(0);
            setBarColor(interpolateColor(startColor, endColor, 0)); // Set initial color

            if (intervalId.current) {
                clearInterval(intervalId.current);
            }



            intervalId.current = window.setInterval(() => {
                setProgress((prevProgress) => {
                    const remaining = max_duration - prevProgress;
                    const increment = remaining * 0.015;

                    if (increment < 0.01) {
                        if (intervalId.current) clearInterval(intervalId.current);
                        return prevProgress;
                    }

                    const newProgress = prevProgress + increment;
                    // Calculate color based on current progress towards the target (0-95%)
                    const colorFactor = newProgress / max_duration;
                    setBarColor(interpolateColor(startColor, endColor, colorFactor));

                    return newProgress;
                });
            }, 100);
        };

        const finish = () => {
            if (intervalId.current) {
                clearInterval(intervalId.current);
                intervalId.current = null;
            }
            setProgress(100);
            setBarColor(interpolateColor(startColor, endColor, 1)); // Ensure final color state

            setTimeout(() => {
                setShow(false);
                // Optionally reset color after hiding, if you want it to always start from green
                // setBarColor(interpolateColor(startColor, endColor, 0));
            }, 400);
        };

        if (isLoading) {
            start();
        } else if (show) {
            finish();
        }

        // Cleanup effect
        return () => {
            if (intervalId.current) {
                clearInterval(intervalId.current);
            }
        };
    }, [isLoading, show]);

    return (
        <div className={`loading-bar-container ${show ? 'show' : ''}`}>
            <progress
                className="progress is-small" // Removed 'is-primary' as we're overriding it
                value={progress}
                max="100"
                style={{ '--progress-color': barColor } as React.CSSProperties}
            />
        </div>
    );
};

export default LoadingBar;