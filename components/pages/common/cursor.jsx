import { useEffect, useRef } from "react";


const CustomCursor = () => {
    const ballRef = useRef(null);
    const textRef = useRef(null);
    useEffect(() => {
        const ball = ballRef.current;
        const cursorText = textRef.current;
        const hoverAreas = document.querySelectorAll(".data_cursor");
        let lastHoveredElement = null;
        let mouseX = 0,
            mouseY = 0;
        let ballX = 0,
            ballY = 0;
        const speed = 0.1;
        const updateCursor = () => {
            ballX += (mouseX - ballX) * speed;
            ballY += (mouseY - ballY) * speed;
            if (ball && cursorText) {
                ball.style.transform = `translate3d(${ballX}px, ${ballY}px, 0)`;
                cursorText.style.transform = `translate3d(${ballX}px, ${ballY}px, 0)`;  
            }
            requestAnimationFrame(updateCursor);
        };
        const handleMouseMove = (e) => {
            const scrollX = window.scrollX || document.documentElement.scrollLeft || 0;
            const scrollY = window.scrollY || document.documentElement.scrollTop || 0;

            mouseX = e.clientX + scrollX;
            mouseY = e.clientY + scrollY;
        };
        const handleHoverEnter = (e) => {
            const text = e.target.getAttribute("data-cursor-text");
            if (text && cursorText) {
                cursorText.textContent = text;
                cursorText.style.opacity = "1";  
            }
            if (ball) {
                ball.style.height = "90px";
                ball.style.width = "90px";
                ball.style.top = "-35px";
                ball.style.left = "-25px";
            }
            lastHoveredElement = e.target;
        };
        const handleHoverLeave = () => {
            if (cursorText) {
                cursorText.style.opacity = "0";  
            }
            if (ball) {
                ball.style.height = "12px";
                ball.style.width = "12px";
                ball.style.top = "0";
                ball.style.left = "0";
            }
            lastHoveredElement = null;
        };
        document.addEventListener("mousemove", handleMouseMove);
        hoverAreas.forEach((elem) => {
            elem.addEventListener("mouseenter", handleHoverEnter);
            elem.addEventListener("mouseleave", handleHoverLeave);
        });
        updateCursor();
        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            hoverAreas.forEach((elem) => {
                elem.removeEventListener("mouseenter", handleHoverEnter);
                elem.removeEventListener("mouseleave", handleHoverLeave);
            });
        };
    }, []);

    return (
        <div className="cursor">
            <div className="hide">
                <div id="cursor-ball" ref={ballRef}></div>
            </div>
            <div id="cursor-text" ref={textRef}></div>
        </div>
    );
};

export default CustomCursor;
