"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { GENERAL2_PREFIX } from "../../constants";
import styles from "./CreateEventAnimation.module.css";

type CreateEventAnimationProps = {
  showCaption?: boolean;
};

export const CreateEventAnimation = ({
  showCaption = true,
}: CreateEventAnimationProps) => {
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
          <symbol id="c-flower" viewBox="0 0 200 200">
            <g transform="translate(100 100) scale(.61)">
              <g fill="#FF78AC">
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
              <circle r="5" fill="#F2F0EA" />
            </g>
          </symbol>
          <symbol id="c-cal" viewBox="0 0 24 24">
            <g
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            >
              <rect x="4" y="5.5" width="16" height="14" rx="2.5" />
              <path d="M4 10h16M9 3.5v3M15 3.5v3" />
            </g>
          </symbol>
          <symbol id="c-check" viewBox="0 0 24 24">
            <path
              d="M5 12.5l4.5 4.5L19 7.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </symbol>
          <symbol id="c-link" viewBox="0 0 24 24">
            <g
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M10 13.5a4 4 0 0 0 5.7 0l2.8-2.8a4 4 0 0 0-5.7-5.7L11.4 6.4" />
              <path d="M14 10.5a4 4 0 0 0-5.7 0L5.5 13.3a4 4 0 0 0 5.7 5.7l1.4-1.4" />
            </g>
          </symbol>
        </defs>
      </svg>

      <div className={styles.step}>
        <div className={styles.scene} ref={sceneRef} aria-hidden>
          <span className={styles.num}>1</span>

          <div className={styles.win}>
            <div className={styles.chrome}>
              <s />
              <s />
              <s />
              <span className={styles.url}>
                <i />
                ovation.com/create
              </span>
            </div>
            <div className={styles.body}>
              <div className={styles.top}>
                <span className={styles.brand}>
                  <svg>
                    <use href="#c-flower" />
                  </svg>
                  <b>OVATION</b>
                </span>
                <span className={styles.prog}>
                  <span className={`${styles.lbl} ${styles.stepno}`}>
                    <span className={styles.s1}>Step 01 of 03</span>
                    <span className={styles.s3}>Step 02 of 03</span>
                  </span>
                  <span className={styles.bars}>
                    <i className={styles.on} />
                    <i className={styles.b2} />
                    <i className={styles.b3} />
                  </span>
                </span>
              </div>

              <div className={`${styles.pane} ${styles["s-type"]}`}>
                <span className={styles.eyebrow}>Step 1 · Event type</span>
                <h6>What are you celebrating?</h6>
                <p className={styles.sub}>
                  Choose the kind of event to get started
                </p>
                <div className={styles.types}>
                  <div className={`${styles.ty} ${styles.pick}`}>
                    <b>Wedding</b>
                    <small>Celebrate your marriage</small>
                  </div>
                  <div className={styles.ty}>
                    <b>Birthday</b>
                    <small>Celebrate another year</small>
                  </div>
                  <div className={styles.ty}>
                    <b>Corporate event</b>
                    <small>Conferences, launches &amp; more</small>
                  </div>
                  <div className={styles.ty}>
                    <b>Baby shower</b>
                    <small>Welcome the little one</small>
                  </div>
                  <div className={styles.ty}>
                    <b>Anniversary</b>
                    <small>Celebrate your years together</small>
                  </div>
                  <div className={styles.ty}>
                    <b>Memorial</b>
                    <small>Honor a life remembered</small>
                  </div>
                  <div className={styles.ty}>
                    <b>Graduation</b>
                    <small>Celebrate the achievement</small>
                  </div>
                  <div className={styles.ty}>
                    <b>Other</b>
                    <small>Any occasion you like</small>
                  </div>
                </div>
                <div className={styles.cont}>Continue</div>
              </div>

              <div className={`${styles.pane} ${styles["s-names"]}`}>
                <span className={styles.eyebrow}>Step 2 · Your book</span>
                <h6>
                  Names, date <em>&amp; place.</em>
                </h6>
                <p className={styles.sub}>
                  Just first names or nicknames — whatever your guests will
                  recognize.
                </p>
                <div className={styles.grid2}>
                  <div className={styles.fl}>
                    <div className={styles.lb}>Partner 1</div>
                    <div className={`${styles.in} ${styles.done}`}>
                      <span className={styles.ty1}>Alex</span>
                      <span className={styles.caret} />
                    </div>
                  </div>
                  <div className={styles.amp}>&amp;</div>
                  <div className={styles.fl}>
                    <div className={styles.lb}>Partner 2</div>
                    <div className={`${styles.in} ${styles.done}`}>
                      <span className={styles.ty2}>Sophia</span>
                      <span className={styles.caret} />
                    </div>
                  </div>
                </div>
                <div className={`${styles.fl} ${styles.rowf}`}>
                  <div className={styles.lb}>Wedding date (optional)</div>
                  <div className={styles.in}>
                    <svg style={{ color: "var(--pink)" }}>
                      <use href="#c-cal" />
                    </svg>
                    <span className={styles.date}>
                      <span className={styles.d0}>Pick a date</span>
                      <span className={styles.d1}>26 September 2026</span>
                    </span>
                  </div>
                </div>
                <div className={styles.grid2b}>
                  <div className={styles.fl}>
                    <div className={styles.lb}>Venue name</div>
                    <div className={styles.in}>
                      <span className={styles.venue}>
                        <span className={styles.v0}>e.g. Villa Rosa</span>
                        <span className={styles.v1}>Villa Rosa</span>
                      </span>
                    </div>
                  </div>
                  <div className={styles.fl}>
                    <div className={styles.lb}>City</div>
                    <div className={styles.in}>
                      <span className={styles.venue}>
                        <span className={styles.v0}>e.g. Tuscany</span>
                        <span className={styles.v1}>Tuscany</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className={styles.cont}>Continue</div>
              </div>

              <div className={`${styles.pane} ${styles["s-live"]}`}>
                <span className={styles.tick}>
                  <svg>
                    <use href="#c-check" />
                  </svg>
                </span>
                <b>Your event is live</b>
                <span className={styles.nm}>Alex &amp; Sophia</span>
                <small>Villa Rosa, Tuscany · 26 September 2026</small>
                <span className={styles.lk}>
                  <svg style={{ color: "var(--teal-strong)" }}>
                    <use href="#c-link" />
                  </svg>
                  <b>ovation.com/alex-sophia</b>
                </span>
              </div>

              <span className={`${styles.cur} ${styles.c1}`} />
              <span className={`${styles.cur} ${styles.c2}`} />
            </div>
          </div>

          <span className={styles.chip}>
            <svg style={{ color: "var(--teal-strong)" }}>
              <use href="#c-check" />
            </svg>
            Live in under two minutes
          </span>
        </div>

        {showCaption && (
          <div className={styles.capText}>
            <h3>{k("create_title")}</h3>
            <p>{k("create_body")}</p>
          </div>
        )}
      </div>
    </div>
  );
};
