"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { GENERAL2_PREFIX } from "../../constants";
import styles from "./KeepItForeverAnimation.module.css";

type KeepItForeverAnimationProps = {
  showCaption?: boolean;
};

const Photo = () => (
  <span className={styles.ph}>
    <svg>
      <use href="#kf-img" />
    </svg>
  </span>
);

export const KeepItForeverAnimation = ({
  showCaption = true,
}: KeepItForeverAnimationProps) => {
  const t = useTranslations();
  const k = (suffix: string) => t(`${GENERAL2_PREFIX}${suffix}`);
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    scene.classList.add(styles.paused);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          scene.classList.toggle(styles.paused, !entry.isIntersecting);
        });
      },
      { threshold: 0.3 },
    );
    observer.observe(scene);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.root}>
      <svg width="0" height="0" aria-hidden style={{ position: "absolute" }}>
        <defs>
          <symbol id="kf-flower" viewBox="0 0 200 200">
            <g transform="translate(100 100) scale(.61)">
              <g fill="currentColor">
                <path
                  transform="rotate(0)"
                  d="M -3 -16 C -17 -34 -22 -56 -12 -74 C -6 -82 6 -82 12 -74 C 22 -56 17 -34 3 -16 C 2 -14 -2 -14 -3 -16 Z"
                />
                <path
                  transform="rotate(45)"
                  d="M -3 -16 C -17 -34 -22 -56 -12 -74 C -6 -82 6 -82 12 -74 C 22 -56 17 -34 3 -16 C 2 -14 -2 -14 -3 -16 Z"
                />
                <path
                  transform="rotate(90)"
                  d="M -3 -16 C -17 -34 -22 -56 -12 -74 C -6 -82 6 -82 12 -74 C 22 -56 17 -34 3 -16 C 2 -14 -2 -14 -3 -16 Z"
                />
                <path
                  transform="rotate(135)"
                  d="M -3 -16 C -17 -34 -22 -56 -12 -74 C -6 -82 6 -82 12 -74 C 22 -56 17 -34 3 -16 C 2 -14 -2 -14 -3 -16 Z"
                />
                <path
                  transform="rotate(180)"
                  d="M -3 -16 C -17 -34 -22 -56 -12 -74 C -6 -82 6 -82 12 -74 C 22 -56 17 -34 3 -16 C 2 -14 -2 -14 -3 -16 Z"
                />
                <path
                  transform="rotate(225)"
                  d="M -3 -16 C -17 -34 -22 -56 -12 -74 C -6 -82 6 -82 12 -74 C 22 -56 17 -34 3 -16 C 2 -14 -2 -14 -3 -16 Z"
                />
                <path
                  transform="rotate(270)"
                  d="M -3 -16 C -17 -34 -22 -56 -12 -74 C -6 -82 6 -82 12 -74 C 22 -56 17 -34 3 -16 C 2 -14 -2 -14 -3 -16 Z"
                />
                <path
                  transform="rotate(315)"
                  d="M -3 -16 C -17 -34 -22 -56 -12 -74 C -6 -82 6 -82 12 -74 C 22 -56 17 -34 3 -16 C 2 -14 -2 -14 -3 -16 Z"
                />
              </g>
              <circle r="5" fill="#241D18" />
            </g>
          </symbol>
          <symbol id="kf-img" viewBox="0 0 24 24">
            <g
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinejoin="round"
            >
              <rect x="3.5" y="5" width="17" height="14" rx="2.5" />
              <path d="M4 16l4.5-4.5 3.5 3.5 3-3 5 5" />
              <circle cx="9" cy="9.5" r="1.4" />
            </g>
          </symbol>
          <symbol id="kf-check" viewBox="0 0 24 24">
            <path
              d="M5 12.5l4.5 4.5L19 7.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </symbol>
          <symbol id="kf-book" viewBox="0 0 24 24">
            <g
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            >
              <path d="M4 5.5h6a2.5 2.5 0 0 1 2 1.2 2.5 2.5 0 0 1 2-1.2h6v13h-6a2.5 2.5 0 0 0-2 1.2 2.5 2.5 0 0 0-2-1.2H4z" />
              <path d="M12 6.7v12" />
            </g>
          </symbol>
          <symbol id="kf-truck" viewBox="0 0 24 24">
            <g
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            >
              <path d="M2.5 6.5h11v9h-11zM13.5 9.5h4l3 3v3h-7z" />
              <circle cx="7" cy="18" r="1.6" />
              <circle cx="17" cy="18" r="1.6" />
            </g>
          </symbol>
        </defs>
      </svg>

      <div className={styles.step}>
        <div className={styles.scene} ref={sceneRef} aria-hidden>
          <span className={styles.num}>4</span>
          <span className={styles.desk} />

          <span className={styles.fly}>
            <svg>
              <use href="#kf-img" />
            </svg>
          </span>
          <span className={`${styles.fly} ${styles.f2}`}>
            <svg>
              <use href="#kf-img" />
            </svg>
          </span>
          <span className={`${styles.fly} ${styles.f3}`}>
            <svg>
              <use href="#kf-img" />
            </svg>
          </span>

          <div className={styles.stage}>
            <div className={styles.book}>
              <span className={styles.shadow} />
              <span className={styles.block} />

              <div
                className={`${styles.face} ${styles.right} ${styles["lay-d"]}`}
              >
                <Photo />
                <Photo />
                <Photo />
              </div>

              <div className={`${styles.leaf} ${styles.l3}`}>
                <div
                  className={`${styles.face} ${styles.right} ${styles["lay-b"]}`}
                >
                  <Photo />
                  <Photo />
                  <Photo />
                </div>
                <div
                  className={`${styles.face} ${styles.left} ${styles.back} ${styles["lay-c"]}`}
                >
                  <Photo />
                </div>
                <span className={styles.shade} />
              </div>
              <div className={`${styles.leaf} ${styles.l2}`}>
                <div
                  className={`${styles.face} ${styles.right} ${styles["lay-a"]}`}
                >
                  <Photo />
                  <Photo />
                  <Photo />
                </div>
                <div
                  className={`${styles.face} ${styles.left} ${styles.back} ${styles["lay-b"]}`}
                >
                  <Photo />
                  <Photo />
                  <Photo />
                </div>
                <span className={styles.shade} />
              </div>
              <div className={`${styles.leaf} ${styles.l1}`}>
                <div
                  className={`${styles.face} ${styles.right} ${styles["lay-c"]}`}
                >
                  <Photo />
                </div>
                <div
                  className={`${styles.face} ${styles.left} ${styles.back} ${styles["lay-a"]}`}
                >
                  <Photo />
                  <Photo />
                  <Photo />
                </div>
                <span className={styles.shade} />
              </div>

              <span className={styles.spine} />
              <div className={styles.cover}>
                <div className={styles.front}>
                  <div className={styles.plate}>
                    <svg className={styles.fl} viewBox="0 0 200 200">
                      <use href="#kf-flower" />
                    </svg>
                    <span className={styles.nm}>Alex &amp; Sophia</span>
                    <span className={styles.dt}>26 · 09 · 2026</span>
                    <span className={styles.sub}>The Gold Book</span>
                  </div>
                  <span className={styles.sheen} />
                </div>
                <div
                  className={`${styles.back} ${styles.face} ${styles.left} ${styles["lay-b"]}`}
                >
                  <Photo />
                  <Photo />
                  <Photo />
                </div>
              </div>
            </div>
          </div>

          <div className={styles.order}>
            <span className={styles.t}>Hardcover Gold Book</span>
            <span className={styles.m}>
              Your photos, printed and bound in linen with gold foil.
            </span>
            <span className={styles.specs}>
              <span>
                <svg>
                  <use href="#kf-book" />
                </svg>
                Linen cover · gold foil · 84 pages
              </span>
              <span>
                <svg>
                  <use href="#kf-truck" />
                </svg>
                Delivered in 7 days
              </span>
            </span>
            <span className={styles.btn}>Order the book</span>
          </div>

          <span className={styles.chip}>
            <svg style={{ color: "var(--teal-strong)" }}>
              <use href="#kf-check" />
            </svg>
            Laid out for you — no design work
          </span>
        </div>

        {showCaption && (
          <div className={styles.capText}>
            <h3>{k("keep_title")}</h3>
            <p>{k("keep_body")}</p>
          </div>
        )}
      </div>
    </div>
  );
};
