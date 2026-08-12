"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { GENERAL2_PREFIX } from "../../constants";
import styles from "./SavedInstantlyAnimation.module.css";

type SavedInstantlyAnimationProps = {
  showCaption?: boolean;
};

export const SavedInstantlyAnimation = ({
  showCaption = true,
}: SavedInstantlyAnimationProps) => {
  const t = useTranslations();
  const k = (suffix: string) => t(`${GENERAL2_PREFIX}${suffix}`);
  const sceneRef = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(103);

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
    const id = window.setInterval(() => {
      setCount((n) => (n >= 112 ? 103 : n + 1));
    }, 1200);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className={styles.root}>
      <svg width="0" height="0" aria-hidden style={{ position: "absolute" }}>
        <defs>
          <symbol id="s-flower" viewBox="0 0 200 200">
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
              <circle r="5" fill="#FAF8F4" />
            </g>
          </symbol>
          <symbol id="s-heart" viewBox="0 0 24 24">
            <path
              d="M12 20s-7.2-4.6-7.2-9.5A4.3 4.3 0 0 1 12 8a4.3 4.3 0 0 1 7.2 2.5C19.2 15.4 12 20 12 20z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinejoin="round"
            />
          </symbol>
          <symbol id="s-grid" viewBox="0 0 24 24">
            <g fill="none" stroke="currentColor" strokeWidth="1.9">
              <rect x="4" y="4" width="6.5" height="6.5" rx="1.5" />
              <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5" />
              <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5" />
              <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5" />
            </g>
          </symbol>
          <symbol id="s-time" viewBox="0 0 24 24">
            <g
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
            >
              <path d="M4 7h9M11 12h9M4 17h9" />
              <circle cx="17" cy="7" r="2.2" />
              <circle cx="7" cy="12" r="2.2" />
              <circle cx="17" cy="17" r="2.2" />
            </g>
          </symbol>
          <symbol id="s-task" viewBox="0 0 24 24">
            <g
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinejoin="round"
            >
              <rect x="4.5" y="4.5" width="15" height="15" rx="2.5" />
              <path d="M8.5 12l2.5 2.5 5-5" />
            </g>
          </symbol>
          <symbol id="s-wallet" viewBox="0 0 24 24">
            <g
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinejoin="round"
            >
              <rect x="3.5" y="6" width="17" height="12" rx="2.5" />
              <path d="M3.5 10h17M16 14h2" />
            </g>
          </symbol>
          <symbol id="s-mail" viewBox="0 0 24 24">
            <g
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinejoin="round"
            >
              <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" />
              <path d="M4 7.5l8 5.5 8-5.5" />
            </g>
          </symbol>
          <symbol id="s-guests" viewBox="0 0 24 24">
            <g
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
            >
              <circle cx="10" cy="8.5" r="3.4" />
              <path d="M3.6 19.5a6.6 6.6 0 0 1 12.8 0M18 7.5v5M15.5 10h5" />
            </g>
          </symbol>
          <symbol id="s-shop" viewBox="0 0 24 24">
            <g
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinejoin="round"
            >
              <path d="M4 9.5V19h16V9.5M2.5 6.5h19l-1.5 3h-16z" />
            </g>
          </symbol>
          <symbol id="s-spark" viewBox="0 0 24 24">
            <path
              d="M12 3.5l1.8 5.2 5.2 1.8-5.2 1.8L12 17.5l-1.8-5.2L5 10.5l5.2-1.8z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </symbol>
          <symbol id="s-msg" viewBox="0 0 24 24">
            <path
              d="M20 15.5a2 2 0 0 1-2 2H8l-4 3.5v-15a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinejoin="round"
            />
          </symbol>
          <symbol id="s-img" viewBox="0 0 24 24">
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
          <symbol id="s-star" viewBox="0 0 24 24">
            <path
              d="M12 4l2.5 5.2 5.5.8-4 3.9 1 5.6-5-2.8-5 2.8 1-5.6-4-3.9 5.5-.8z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </symbol>
          <symbol id="s-box" viewBox="0 0 24 24">
            <g
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinejoin="round"
            >
              <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" />
              <path d="M4 7.5l8 4.5 8-4.5M12 12v9" />
            </g>
          </symbol>
          <symbol id="s-mic" viewBox="0 0 24 24">
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
          <symbol id="s-video" viewBox="0 0 24 24">
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
          <symbol id="s-search" viewBox="0 0 24 24">
            <g
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            >
              <circle cx="11" cy="11" r="6" />
              <path d="M15.5 15.5L20 20" />
            </g>
          </symbol>
          <symbol id="s-sort" viewBox="0 0 24 24">
            <g
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            >
              <path d="M7 4v16M7 20l-3-3M17 20V4M17 4l3 3" />
            </g>
          </symbol>
          <symbol id="s-dl" viewBox="0 0 24 24">
            <g
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 4v11M7.5 10.5L12 15l4.5-4.5M5 19h14" />
            </g>
          </symbol>
          <symbol id="s-sun" viewBox="0 0 24 24">
            <g
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4" />
            </g>
          </symbol>
          <symbol id="s-cart" viewBox="0 0 24 24">
            <g
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 5h2.5l2.5 10h9l2-7H7" />
              <circle cx="9.5" cy="19" r="1.4" />
              <circle cx="16.5" cy="19" r="1.4" />
            </g>
          </symbol>
          <symbol id="s-check" viewBox="0 0 24 24">
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
          <span className={styles.num}>3</span>

          <div className={styles.laptop}>
            <div className={styles.lid}>
              <div className={styles.app}>
                <div className={styles.rail}>
                  <div className={styles.logo}>
                    <svg className={styles.fl}>
                      <use href="#s-flower" />
                    </svg>
                    <b>OVATION</b>
                  </div>
                  <div className={styles.ri}>
                    <svg>
                      <use href="#s-heart" />
                    </svg>
                    Planner
                  </div>
                  <div className={`${styles.ri} ${styles.sub}`}>
                    <svg>
                      <use href="#s-grid" />
                    </svg>
                    Dashboard
                  </div>
                  <div className={`${styles.ri} ${styles.sub}`}>
                    <svg>
                      <use href="#s-time" />
                    </svg>
                    Timeline
                  </div>
                  <div className={`${styles.ri} ${styles.sub}`}>
                    <svg>
                      <use href="#s-task" />
                    </svg>
                    Tasks
                  </div>
                  <div className={`${styles.ri} ${styles.sub}`}>
                    <svg>
                      <use href="#s-wallet" />
                    </svg>
                    Budget
                  </div>
                  <div className={`${styles.ri} ${styles.sub}`}>
                    <svg>
                      <use href="#s-mail" />
                    </svg>
                    Invitation
                  </div>
                  <div className={`${styles.ri} ${styles.sub}`}>
                    <svg>
                      <use href="#s-guests" />
                    </svg>
                    Guests
                  </div>
                  <div className={`${styles.ri} ${styles.sub}`}>
                    <svg>
                      <use href="#s-shop" />
                    </svg>
                    Vendors
                  </div>
                  <div className={`${styles.ri} ${styles.sub}`}>
                    <svg>
                      <use href="#s-spark" />
                    </svg>
                    AI Assistant
                  </div>
                  <div className={`${styles.ri} ${styles.on}`}>
                    <svg>
                      <use href="#s-msg" />
                    </svg>
                    Messages
                  </div>
                  <div className={styles.ri}>
                    <svg>
                      <use href="#s-img" />
                    </svg>
                    Gallery
                  </div>
                  <div className={styles.ri}>
                    <svg>
                      <use href="#s-star" />
                    </svg>
                    Keepsakes
                  </div>
                  <div className={styles.ri}>
                    <svg>
                      <use href="#s-box" />
                    </svg>
                    Orders
                  </div>
                  <div className={styles.me}>
                    <i>U</i>
                    <span>user1+2</span>
                  </div>
                </div>

                <div className={styles.main}>
                  <div className={styles.mhead}>
                    <h5>Messages</h5>
                    <div className={styles.tools}>
                      <i>
                        <svg>
                          <use href="#s-sun" />
                        </svg>
                      </i>
                      <i>
                        <svg>
                          <use href="#s-cart" />
                        </svg>
                      </i>
                    </div>
                  </div>
                  <div className={styles.tabs}>
                    <span className={`${styles.tab} ${styles.on}`}>
                      All · <span className={styles.n}>{count}</span>
                    </span>
                    <span className={styles.tab}>♥ Favourites · 18</span>
                    <span className={styles.tab}>
                      With photo · <span className={styles.n}>41</span>
                    </span>
                    <span className={styles.tab}>
                      With video · <span className={styles.n}>11</span>
                    </span>
                    <span className={styles.tab}>
                      With audio · <span className={styles.n}>61</span>
                    </span>
                  </div>

                  <div className={styles.panel}>
                    <div className={styles.ptop}>
                      <span className={styles.search}>
                        <svg>
                          <use href="#s-search" />
                        </svg>
                        Search messages…
                      </span>
                      <span className={styles.sort}>
                        <svg>
                          <use href="#s-sort" />
                        </svg>
                        Newest first
                      </span>
                      <span className={styles.exp}>
                        <svg>
                          <use href="#s-dl" />
                        </svg>
                        Export all
                      </span>
                    </div>
                    <div className={styles.thead}>
                      <span>MESSAGE</span>
                      <span>TYPE</span>
                      <span style={{ textAlign: "right" }}>DATE</span>
                    </div>
                    <div className={styles.rows}>
                      <div className={`${styles.row} ${styles.new2}`}>
                        <div className={styles.who}>
                          <span
                            className={styles.av}
                            style={{ background: "#F6D9C6" }}
                          >
                            MK
                          </span>
                          <span className={styles.tx}>
                            <b>Maria Klein</b>
                            <small>
                              “Wishing you a lifetime of little Tuesdays
                              together.”
                            </small>
                          </span>
                        </div>
                        <span className={styles.tp}>
                          <svg>
                            <use href="#s-video" />
                          </svg>
                          <svg>
                            <use href="#s-msg" />
                          </svg>
                        </span>
                        <span className={styles.dt}>Just now</span>
                      </div>
                      <div className={`${styles.row} ${styles.new}`}>
                        <div className={styles.who}>
                          <span
                            className={styles.av}
                            style={{ background: "#FBD3E1" }}
                          >
                            UR
                          </span>
                          <span className={styles.tx}>
                            <b>Uncle Ray</b>
                            <small>
                              “Forty years ago I said the same words to your
                              aunt.”
                            </small>
                          </span>
                        </div>
                        <span className={styles.tp}>
                          <svg>
                            <use href="#s-mic" />
                          </svg>
                          <svg>
                            <use href="#s-msg" />
                          </svg>
                        </span>
                        <span className={styles.dt}>Just now</span>
                      </div>
                      <div className={`${styles.row} ${styles.shift}`}>
                        <div className={styles.who}>
                          <span
                            className={styles.av}
                            style={{ background: "#F3DCC4" }}
                          >
                            HL
                          </span>
                          <span className={styles.tx}>
                            <b>Henrik Larsson</b>
                            <small>
                              “You both deserve all the happiness in the world.”
                            </small>
                          </span>
                        </div>
                        <span className={styles.tp}>
                          <svg>
                            <use href="#s-mic" />
                          </svg>
                          <svg>
                            <use href="#s-video" />
                          </svg>
                          <svg>
                            <use href="#s-msg" />
                          </svg>
                        </span>
                        <span className={styles.dt}>Jun 24, 04:20 PM</span>
                      </div>
                      <div className={`${styles.row} ${styles.shift}`}>
                        <div className={styles.who}>
                          <span
                            className={styles.av}
                            style={{ background: "#F7E4C8" }}
                          >
                            IH
                          </span>
                          <span className={styles.tx}>
                            <b>Ingrid Hansen</b>
                            <small>
                              “Sending all my love and best wishes on your
                              wedding day!”
                            </small>
                          </span>
                        </div>
                        <span className={styles.tp}>
                          <svg>
                            <use href="#s-mic" />
                          </svg>
                        </span>
                        <span className={styles.dt}>Jun 24, 04:20 PM</span>
                      </div>
                      <div className={`${styles.row} ${styles.shift}`}>
                        <div className={styles.who}>
                          <span
                            className={styles.av}
                            style={{ background: "#E7DCC9" }}
                          >
                            SM
                          </span>
                          <span className={styles.tx}>
                            <b>Sophie Müller</b>
                            <small>
                              “Wishing you endless joy, love, and laughter
                              together.”
                            </small>
                          </span>
                        </div>
                        <span className={styles.tp}>
                          <svg>
                            <use href="#s-img" />
                          </svg>
                          <svg>
                            <use href="#s-msg" />
                          </svg>
                        </span>
                        <span className={styles.dt}>Jun 23, 04:20 PM</span>
                      </div>
                      <div className={`${styles.row} ${styles.shift}`}>
                        <div className={styles.who}>
                          <span
                            className={styles.av}
                            style={{ background: "#F2D6DE" }}
                          >
                            EL
                          </span>
                          <span className={styles.tx}>
                            <b>Emma &amp; Luca</b>
                            <small>
                              “I just wanted to say how much you both mean to
                              me.”
                            </small>
                          </span>
                        </div>
                        <span className={styles.tp}>
                          <svg>
                            <use href="#s-mic" />
                          </svg>
                        </span>
                        <span className={styles.dt}>Jun 22, 04:20 PM</span>
                      </div>
                      <div className={`${styles.row} ${styles.shift}`}>
                        <div className={styles.who}>
                          <span
                            className={styles.av}
                            style={{ background: "#DED6EC" }}
                          >
                            AD
                          </span>
                          <span className={styles.tx}>
                            <b>Amina Diallo</b>
                            <small>
                              “Best wishes for a future filled with love and
                              joy.”
                            </small>
                          </span>
                        </div>
                        <span className={styles.tp}>
                          <svg>
                            <use href="#s-img" />
                          </svg>
                          <svg>
                            <use href="#s-msg" />
                          </svg>
                        </span>
                        <span className={styles.dt}>Jun 21, 04:20 PM</span>
                      </div>
                      <div className={`${styles.row} ${styles.shift}`}>
                        <div className={styles.who}>
                          <span
                            className={styles.av}
                            style={{ background: "#F0DFC6" }}
                          >
                            SJ
                          </span>
                          <span className={styles.tx}>
                            <b>
                              Sven Johansson{" "}
                              <span className={styles.hrt}>♥</span>
                            </b>
                            <small>
                              “Wishing you a love that grows deeper every single
                              day.”
                            </small>
                          </span>
                        </div>
                        <span className={styles.tp}>
                          <svg>
                            <use href="#s-mic" />
                          </svg>
                          <svg>
                            <use href="#s-video" />
                          </svg>
                        </span>
                        <span className={styles.dt}>Jun 19, 04:20 PM</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.base} />
          </div>

          <span className={styles.fly}>
            <i>
              <svg>
                <use href="#s-mic" />
              </svg>
            </i>
            Uncle Ray
          </span>

          <div className={styles.phone}>
            <div className={styles.pscreen}>
              <span className={styles.pisland} />
              <span className={styles.tick}>
                <svg>
                  <use href="#s-check" />
                </svg>
              </span>
              <b>Sent!</b>
              <small>Thank you</small>
              <span className={styles.bar}>Add another</span>
            </div>
          </div>

          <span className={styles.live}>
            <span className={styles.dot} />
            <span className={styles.n}>{count}</span>
            <small>saved</small>
          </span>
        </div>

        {showCaption && (
          <div className={styles.capText}>
            <h3>{k("saved_title")}</h3>
            <p>{k("saved_body")}</p>
          </div>
        )}
      </div>
    </div>
  );
};
