import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { QVTBOX_URL } from "@qvt/shared";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const ZenaHeroLanding = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const fullscreenRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const imageEl = imageRef.current;
    const heroEl = heroRef.current;
    if (!imageEl || !heroEl) return;

    let rafId = 0;
    const isMobile = window.innerWidth < 768;
    const state = {
      progress: 0,
      target: 0,
      parallaxX: 0,
      parallaxY: 0,
      tiltX: 0,
      tiltY: 0,
    };
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let scrollRange = Math.max(900, window.innerHeight * 1.6);
    const smoothing = prefersReducedMotion ? 0.18 : 0.12;

    const applyTransforms = () => {
      const rect = targetRef.current?.getBoundingClientRect();
      const viewportX = window.innerWidth / 2;
      const viewportY = window.innerHeight / 2;
      const targetX = rect ? rect.left + rect.width / 2 - viewportX : 0;
      const targetY = rect ? rect.top + rect.height / 2 - viewportY : 180;

      const scale = lerp(1.3, 0.2, state.progress);
      const translateX = lerp(0, targetX, state.progress) + (prefersReducedMotion ? 0 : state.parallaxX);
      const liftY = lerp(0, -120, state.progress);
      const translateY = lerp(0, targetY, state.progress) + liftY + (prefersReducedMotion ? 0 : state.parallaxY);
      const translateZ = lerp(0, -560, state.progress);
      const opacity = lerp(1, 0.02, state.progress);
      const radius = lerp(0, 9999, state.progress);
      const rotX = prefersReducedMotion ? 0 : state.tiltY;
      const rotY = prefersReducedMotion ? 0 : state.tiltX;

      imageEl.style.transform = `translate3d(-50%, -50%, 0) translate3d(${translateX}px, ${translateY}px, ${translateZ}px) scale(${scale}) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      imageEl.style.opacity = opacity.toFixed(3);
      imageEl.style.borderRadius = `${radius}px`;
      const fullyHidden = state.progress >= (isMobile ? 1.25 : 1.12);
      if (fullyHidden) {
        imageEl.style.opacity = "0";
        imageEl.style.visibility = "hidden";
        imageEl.style.display = "none";
        imageEl.style.pointerEvents = "none";
        if (fullscreenRef.current) {
          fullscreenRef.current.style.display = "none";
        }
      } else {
        imageEl.style.visibility = "visible";
        imageEl.style.display = "block";
        if (fullscreenRef.current) {
          fullscreenRef.current.style.display = "block";
        }
      }

      const heroHeight = lerp(110, isMobile ? 95 : 85, clamp(state.progress, 0, 1));
      heroEl.style.height = `${heroHeight}vh`;
      heroEl.style.minHeight = `${heroHeight}vh`;

      const contentEl = contentRef.current;
      if (contentEl) {
        const contentOpacity = clamp((state.progress - 0.18) / 0.24, 0, 1);
        const contentTranslate = 26 * (1 - contentOpacity);
        contentEl.style.opacity = contentOpacity.toFixed(3);
        contentEl.style.transform = `translate3d(0, ${contentTranslate}px, 0)`;
        contentEl.style.pointerEvents = contentOpacity > 0.1 ? "auto" : "none";
      }
    };

    const tick = () => {
      const eased = lerp(state.progress, state.target, smoothing);
      const delta = Math.abs(eased - state.progress);
      state.progress = eased;
      applyTransforms();
      if (delta > 0.0005) {
        rafId = requestAnimationFrame(tick);
      } else {
        rafId = 0;
      }
    };

    const onScroll = () => {
      state.target = clamp(window.scrollY / scrollRange, 0, 1);
      scrollRange = Math.max(720, window.innerHeight * 1.25);
      if (!rafId) rafId = requestAnimationFrame(tick);
    };

    const onMouseMove = (event: MouseEvent) => {
      if (prefersReducedMotion) return;
      const heroRect = heroRef.current?.getBoundingClientRect();
      if (!heroRect) return;
      const dx = (event.clientX - (heroRect.left + heroRect.width / 2)) / heroRect.width;
      const dy = (event.clientY - (heroRect.top + heroRect.height / 2)) / heroRect.height;
      state.parallaxX = dx * 20;
      state.parallaxY = dy * 22;
      state.tiltX = dx * 12;
      state.tiltY = -dy * 12;
      if (glowRef.current) {
        const gx = clamp((dx + 0.5) * 100, 0, 100);
        const gy = clamp((dy + 0.5) * 100, 0, 100);
        glowRef.current.style.setProperty("--glow-x", `${gx}%`);
        glowRef.current.style.setProperty("--glow-y", `${gy}%`);
      }
      if (!rafId) rafId = requestAnimationFrame(tick);
    };

    const onMouseLeave = () => {
      state.parallaxX = 0;
      state.parallaxY = 0;
      state.tiltX = 0;
      state.tiltY = 0;
      if (!rafId) rafId = requestAnimationFrame(tick);
    };

    const onResize = () => {
      if (!rafId) rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    heroEl.addEventListener("mousemove", onMouseMove);
    heroEl.addEventListener("mouseenter", onMouseMove);
    heroEl.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("resize", onResize);

    onScroll();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      heroEl.removeEventListener("mousemove", onMouseMove);
      heroEl.removeEventListener("mouseenter", onMouseMove);
      heroEl.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative w-full h-screen overflow-hidden isolate will-change-transform zena-hero-perspective"
    >
      <div className="pointer-events-none absolute inset-0 opacity-60 zena-hero-halo" />

      <div ref={fullscreenRef} className="zena-hero-fullscreen" aria-hidden>
        <div
          ref={imageRef}
          className="zena-hero-image hero-face-enhance hero-vignette hero-extra-particles absolute inset-0 w-full h-full will-change-transform"
        >
          <img
            src="/zena-face.png"
            alt="Portrait de ZENA"
            className="zena-hero-img absolute inset-0 w-full h-full object-cover will-change-transform"
            loading="eager"
            draggable="false"
          />
          <div className="zena-hero-vignette pointer-events-none" />
          <div
            ref={glowRef}
            className="pointer-events-none absolute inset-0 zena-hero-glow"
            style={{
              background:
                "radial-gradient(circle at var(--glow-x,50%) var(--glow-y,50%), rgba(255, 227, 170, 0.18), transparent 42%)",
              mixBlendMode: "soft-light",
              transition: "background-position 0.12s ease",
            }}
          />
          <div className="pointer-events-none absolute inset-0 zena-hero-particles" aria-hidden />
        </div>
      </div>

      <div
        ref={contentRef}
        className="relative z-10 mx-auto max-w-6xl px-6 pt-40 pb-20 md:pt-44 md:pb-24 lg:pt-64 lg:pb-28 grid lg:grid-cols-2 gap-12 items-center"
      >
        <div className="space-y-6 text-shadow-soft">
          <p className="text-xs uppercase tracking-[0.24em] text-[#f1dcb6]">
            ZENA · presence emotionnelle
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold leading-tight text-[#fff3df]">
            ZENA, votre voix guidee
          </h1>
          <p className="text-lg text-[#f0e3cf] leading-relaxed max-w-xl">
            L'effet ZENA s'ouvre sur un visage de particules dorees. Descendez
            pour explorer les univers concept, pro et perso.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/choose-sphere"
              className="inline-flex items-center gap-3 rounded-full bg-[#f1d6a0] text-[#1b130e] px-6 py-3 text-sm font-semibold shadow-[0_14px_40px_rgba(241,214,160,0.35)] hover:brightness-110 transition"
            >
              Entrer dans le hub
            </Link>
            <a href="#hub" className="text-sm text-[#f0e3cf] underline">
              Decouvrir le projet
            </a>
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-[#f0e3cf]">
            <a href={QVTBOX_URL} className="underline">
              Concept QVT Box
            </a>
            <Link to="/company/home" className="underline">
              ZENA Pro
            </Link>
            <Link to="/family/home" className="underline">
              ZENA Famille
            </Link>
          </div>
        </div>

        <div className="relative flex items-center justify-center overflow-visible">
          <div ref={targetRef} className="zena-hero-circle" aria-hidden>
            <img
              src="/zena-face-golden.png"
              alt="Portrait cercle ZENA"
              className="zena-hero-circle-img"
              loading="lazy"
            />
            <div className="zena-hero-circle-glow" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ZenaHeroLanding;
