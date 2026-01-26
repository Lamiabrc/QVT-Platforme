import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./ZenaRippleHero.css";

export default function ZenaRippleHero() {
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Effet de zoom au scroll
    const handleScroll = () => {
      const scroll = window.scrollY;
      const scale = 1 + scroll * 0.0008;
      el.style.transform = `scale(${scale})`;
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const onClick = () => {
    navigate("/zena-chat");
  };

  return (
    <div
      ref={containerRef}
      className="zena-ripple-container"
      onClick={onClick}
    >
      <div className="zena-ripple-overlay" />
    </div>
  );
}
