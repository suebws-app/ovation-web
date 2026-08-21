"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { GENERAL2_PREFIX } from "../../constants";
import styles from "./AddMemoriesAnimation.module.css";

type AddMemoriesAnimationProps = {
  showCaption?: boolean;
};

const WAVE_BARS = Array.from({ length: 18 });

export const AddMemoriesAnimation = ({
  showCaption = true,
}: AddMemoriesAnimationProps) => {
  const t = useTranslations();
  const k = (suffix: string) => t(`${GENERAL2_PREFIX}${suffix}`);
  const sceneRef = useRef<HTMLDivElement>(null);
  const [timer, setTimer] = useState("0:12");

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

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let n = 8;
    const id = window.setInterval(() => {
      n = n >= 32 ? 8 : n + 1;
      setTimer(`0:${String(n).padStart(2, "0")}`);
    }, 700);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className={styles.root}>
      <svg width="0" height="0" aria-hidden style={{ position: "absolute" }}>
        <defs>
          <symbol id="m-mic" viewBox="0 0 24 24">
            <g
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <rect x="9" y="3" width="6" height="10" rx="3" />
              <path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3" />
            </g>
          </symbol>
          <symbol id="m-video" viewBox="0 0 24 24">
            <g
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            >
              <rect x="2.5" y="6" width="13" height="12" rx="2.5" />
              <path d="M15.5 11l5-3v8l-5-3z" />
            </g>
          </symbol>
          <symbol id="m-camera" viewBox="0 0 24 24">
            <g
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            >
              <path d="M3 8.5h3l1.5-2h9L18 8.5h3v10H3z" />
              <circle cx="12" cy="13" r="3.2" />
            </g>
          </symbol>
          <symbol id="m-note" viewBox="0 0 24 24">
            <g
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 15.5a2 2 0 0 1-2 2H8l-4 3.5v-15a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z" />
            </g>
          </symbol>
          <symbol id="m-check" viewBox="0 0 24 24">
            <path
              d="M5 12.5l4.5 4.5L19 7.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </symbol>
        </defs>
      </svg>

      <div className={styles.step}>
        <div className={styles.scene} ref={sceneRef} aria-hidden>
          <span className={styles.num}>2</span>
          <span className={styles.surface} />

          <div className={styles.phone}>
            <i className={styles.bv} />
            <i className={styles.bp} />
            <div className={styles.screen}>
              <span className={styles.island} />
              <div className={styles.sbar}>
                <span>9:41</span>
                <span className={styles.rt}>
                  <svg
                    width="13"
                    height="9"
                    viewBox="0 0 18 12"
                    fill="currentColor"
                  >
                    <rect y="8" width="3" height="4" rx="1" />
                    <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
                    <rect x="10" y="3" width="3" height="9" rx="1" />
                    <rect x="15" width="3" height="12" rx="1" />
                  </svg>
                  <svg
                    width="11"
                    height="9"
                    viewBox="0 0 14 11"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  >
                    <path d="M1 4a9 9 0 0 1 12 0M3.5 6.6a5.5 5.5 0 0 1 7 0" />
                    <circle
                      cx="7"
                      cy="9.4"
                      r="1"
                      fill="currentColor"
                      stroke="none"
                    />
                  </svg>
                  <svg width="16" height="9" viewBox="0 0 22 11" fill="none">
                    <rect
                      x=".7"
                      y=".7"
                      width="18"
                      height="9.6"
                      rx="2.6"
                      stroke="currentColor"
                      strokeOpacity=".5"
                      strokeWidth="1.2"
                    />
                    <rect
                      x="2.4"
                      y="2.4"
                      width="13"
                      height="6.2"
                      rx="1.4"
                      fill="currentColor"
                    />
                  </svg>
                </span>
              </div>

              <div className={styles.pg}>
                <span className={styles.cnt}>01 / 02</span>
                <h4>Your message</h4>
                <p className={styles.sub}>
                  Add anything that feels right — voice, video, or a written
                  note.
                </p>
                <div className={styles.cards}>
                  <div className={`${styles.c} ${styles["c-voice"]}`}>
                    <div className={styles.hd}>
                      <span
                        className={styles.ic}
                        style={{ background: "#FBE3EA", color: "#E0577F" }}
                      >
                        <svg width="9" height="9">
                          <use href="#m-mic" />
                        </svg>
                      </span>
                      <span>
                        <b>Voice</b>
                        <small>Record up to 60 seconds.</small>
                      </span>
                    </div>
                    <div
                      className={styles.act}
                      style={{ background: "#FBE0E8", color: "#DA4483" }}
                    >
                      <svg width="7" height="7">
                        <use href="#m-mic" />
                      </svg>
                      Add a voice message
                      <span className={`${styles.finger} ${styles.f1}`} />
                    </div>
                    <div className={styles.filled}>
                      <svg width="7" height="7">
                        <use href="#m-check" />
                      </svg>
                      Voice added · 0:32
                    </div>
                  </div>
                  <div className={styles.c}>
                    <div className={styles.hd}>
                      <span
                        className={styles.ic}
                        style={{ background: "#F6DFDA", color: "#C0392B" }}
                      >
                        <svg width="9" height="9">
                          <use href="#m-video" />
                        </svg>
                      </span>
                      <span>
                        <b>Video</b>
                        <small>Record up to 60 seconds.</small>
                      </span>
                    </div>
                    <div
                      className={styles.act}
                      style={{ background: "#EFDCD6", color: "#B23A2B" }}
                    >
                      <svg width="7" height="7">
                        <use href="#m-video" />
                      </svg>
                      Add a video
                    </div>
                  </div>
                  <div className={styles.c}>
                    <div className={styles.hd}>
                      <span
                        className={styles.ic}
                        style={{ background: "#DFE9EE", color: "#3F6B7A" }}
                      >
                        <svg width="9" height="9">
                          <use href="#m-camera" />
                        </svg>
                      </span>
                      <span>
                        <b>Photos</b>
                        <small>Add up to 5 photos.</small>
                      </span>
                    </div>
                    <div
                      className={styles.act}
                      style={{ background: "#D9E6EC", color: "#2E5F70" }}
                    >
                      <svg width="7" height="7">
                        <use href="#m-camera" />
                      </svg>
                      Upload photo
                    </div>
                  </div>
                  <div className={styles.c}>
                    <div className={styles.hd}>
                      <span
                        className={styles.ic}
                        style={{ background: "#DFEBE4", color: "#3F7A5E" }}
                      >
                        <svg width="9" height="9">
                          <use href="#m-note" />
                        </svg>
                      </span>
                      <span>
                        <b>Written note</b>
                        <small>Up to 200 characters.</small>
                      </span>
                    </div>
                    <div
                      className={styles.act}
                      style={{ background: "#DDEAE3", color: "#2F6B50" }}
                    >
                      <svg width="7" height="7">
                        <use href="#m-note" />
                      </svg>
                      Add a written note
                    </div>
                  </div>
                </div>
                <div className={styles.foot}>
                  <span className={styles.back}>Back</span>
                  <span className={styles.go}>Continue</span>
                </div>
                <div className={styles.hint}>Add at least one.</div>
              </div>

              <div className={styles.sheet}>
                <span className={styles.grab} />
                <span className={styles.ttl}>Voice message</span>
                <span className={styles.orb}>
                  <svg width="24" height="24">
                    <use href="#m-mic" />
                  </svg>
                </span>
                <span className={styles.stat}>
                  <span className={styles.dot} />
                  Recording…
                  <span className={styles.t}>{timer}</span>
                </span>
                <span className={styles.wave}>
                  {WAVE_BARS.map((_, index) => (
                    <i key={index} />
                  ))}
                </span>
                <span className={styles.actBtn}>
                  <span className={styles.actLbl}>
                    <span className={styles.l1}>Start recording</span>
                    <span className={styles.l2}>Stop</span>
                    <span className={styles.l3}>Keep it</span>
                  </span>
                  <span className={`${styles.finger} ${styles.f2}`} />
                </span>
                <span className={styles.retry}>Try again</span>
              </div>

              <span className={styles.homebar} />
            </div>
          </div>

          <span className={styles.chip}>
            <svg width="15" height="15" style={{ color: "var(--teal-strong)" }}>
              <use href="#m-check" />
            </svg>
            Added — preview before sending
          </span>
        </div>

        {showCaption && (
          <div className={styles.capText}>
            <h3>{k("addmem_title")}</h3>
            <p>{k("addmem_body")}</p>
          </div>
        )}
      </div>
    </div>
  );
};
