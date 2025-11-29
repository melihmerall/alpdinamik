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

    // Custom Cursor
    const [cursorStyle, setCursorStyle] = useState(1);
    
    useEffect(() => {
        document.body.classList.add('cursor-yes');
        return () => {
            document.body.classList.remove('cursor-yes', 'cursor-no');
        };
    }, []);
    const toggleCursor = (style) => {
        setCursorStyle(style);
        if (style === 1) {
            document.body.classList.add('cursor-yes');
            document.body.classList.remove('cursor-no');
        } else {
            document.body.classList.add('cursor-no');
            document.body.classList.remove('cursor-yes');
        }
    };

    return (
        <>
            <div className={`switch__tab ${switchOpen ? 'active' : ''}`}>
                <div className="switch__tab-icon">
                    <div className="switch__tab-open" onClick={() => setSwitchOpen(true)}>
                        <i className="far fa-cog"></i>
                    </div>
                    <div className="switch__tab-close" onClick={() => setSwitchOpen(false)}>
                        <i className="fal fa-times"></i>
                    </div>
                </div>
                <div className="switch__tab-area">
                    <div className="switch__tab-area-item">
                        <h5>Mode</h5>
                        <div className="switch__tab-area-item-button dark">
                            <button onClick={toggleLight}>Light</button>
                            <button onClick={toggleDark}>Dark</button>
                        </div>
                    </div>
                    <div className="switch__tab-area-item">
                        <h5>Custom Cursor</h5>
                        <div className="switch__tab-area-item-buttons" id="cursor_style">
                            <button data-cursor="1" className={cursorStyle === 1 ? 'active' : ''} onClick={() => toggleCursor(1)}>Yes</button>
                            <button data-cursor="2" className={cursorStyle === 2 ? 'active' : ''} onClick={() => toggleCursor(2)}>No</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
