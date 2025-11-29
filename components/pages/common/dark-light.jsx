import { useState, useEffect } from 'react';

export default function SwitchTab() {
    const [switchOpen, setSwitchOpen] = useState(false);
    // Theme Dark
    const [dark, setDark] = useState(false);
    const toggleDark = () => {
        setDark(true);
        document.body.classList.add('dark-mode');
    };
    const toggleLight = () => {
        setDark(false);
        document.body.classList.remove('dark-mode');
    };

    // Custom Cursor - Always disabled
    useEffect(() => {
        document.body.classList.add('cursor-no');
        document.body.classList.remove('cursor-yes');
        return () => {
            document.body.classList.remove('cursor-yes', 'cursor-no');
        };
    }, []);

    return null;
}
