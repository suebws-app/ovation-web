"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { GENERAL2_PREFIX } from "../../constants";
import styles from "./WatchItCollectAnimation.module.css";

type WatchItCollectAnimationProps = {
  showCaption?: boolean;
};

const QR_PATH =
  "M0 0h11v11H0zm3 3v5h5V3zM22 0h11v11H22zm3 3v5h5V3zM0 22h11v11H0zm3 3v5h5v-5zM14 0h3v3h-3zm3 3h3v3h-3zm-3 3h3v3h-3zm3 3h3v3h-3zm-3 3h3v3h-3zm-11 3h3v3H3zm5 0h3v3H8zm6 0h3v3h-3zm5-3h3v3h-3zm3 3h3v3h-3zm4 0h3v3h-3zm-9 3h3v3h-3zm4 0h3v3h-3zm5 0h3v3h-3zm-9 4h3v3h-3zm5 0h3v3h-3zm4 0h3v3h-3zm-9 4h3v3h-3zm4 0h3v3h-3zm5 0h3v3h-3zm-9 4h3v3h-3zm5 0h3v3h-3zm4 0h3v3h-3z";

const DOTS = Array.from({ length: 22 });

export const WatchItCollectAnimation = ({
  showCaption = true,
}: WatchItCollectAnimationProps) => {
  const t = useTranslations();
  const k = (suffix: string) => t(`${GENERAL2_PREFIX}${suffix}`);
  const sceneRef = useRef<HTMLDivElement>(null);
  const [msg, setMsg] = useState(103);
  const [photo, setPhoto] = useState(497);

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
      setMsg((n) => (n >= 112 ? 103 : n + 1));
      setPhoto((n) => (n >= 506 ? 497 : n + 1));
    }, 1200);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className={styles.root}>
      <svg width="0" height="0" aria-hidden style={{ position: "absolute" }}>
        <defs>
          <symbol id="w-flower" viewBox="0 0 200 200">
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
          <symbol id="w-home" viewBox="0 0 24 24">
            <path
              d="M4 10.5L12 4l8 6.5V20h-5.5v-5h-5v5H4z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinejoin="round"
            />
          </symbol>
          <symbol id="w-heart" viewBox="0 0 24 24">
            <path
              d="M12 20s-7.2-4.6-7.2-9.5A4.3 4.3 0 0 1 12 8a4.3 4.3 0 0 1 7.2 2.5C19.2 15.4 12 20 12 20z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinejoin="round"
            />
          </symbol>
          <symbol id="w-grid" viewBox="0 0 24 24">
            <g fill="none" stroke="currentColor" strokeWidth="1.9">
              <rect x="4" y="4" width="6.5" height="6.5" rx="1.5" />
              <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5" />
              <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5" />
              <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5" />
            </g>
          </symbol>
          <symbol id="w-time" viewBox="0 0 24 24">
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
          <symbol id="w-task" viewBox="0 0 24 24">
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
          <symbol id="w-wallet" viewBox="0 0 24 24">
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
          <symbol id="w-mail" viewBox="0 0 24 24">
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
          <symbol id="w-guests" viewBox="0 0 24 24">
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
          <symbol id="w-shop" viewBox="0 0 24 24">
            <g
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinejoin="round"
            >
              <path d="M4 9.5V19h16V9.5M2.5 6.5h19l-1.5 3h-16z" />
            </g>
          </symbol>
          <symbol id="w-spark" viewBox="0 0 24 24">
            <path
              d="M12 3.5l1.8 5.2 5.2 1.8-5.2 1.8L12 17.5l-1.8-5.2L5 10.5l5.2-1.8z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </symbol>
          <symbol id="w-msg" viewBox="0 0 24 24">
            <path
              d="M20 15.5a2 2 0 0 1-2 2H8l-4 3.5v-15a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinejoin="round"
            />
          </symbol>
          <symbol id="w-img" viewBox="0 0 24 24">
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
          <symbol id="w-star" viewBox="0 0 24 24">
            <path
              d="M12 4l2.5 5.2 5.5.8-4 3.9 1 5.6-5-2.8-5 2.8 1-5.6-4-3.9 5.5-.8z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </symbol>
          <symbol id="w-box" viewBox="0 0 24 24">
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
          <symbol id="w-mic" viewBox="0 0 24 24">
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
          <symbol id="w-video" viewBox="0 0 24 24">
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
          <symbol id="w-play" viewBox="0 0 24 24">
            <path d="M8 5.5l11 6.5-11 6.5z" fill="currentColor" />
          </symbol>
          <symbol id="w-sun" viewBox="0 0 24 24">
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
          <symbol id="w-cart" viewBox="0 0 24 24">
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
          <symbol id="w-qr" viewBox="0 0 33 33">
            <path fill="currentColor" d={QR_PATH} />
          </symbol>
          <symbol id="w-check" viewBox="0 0 24 24">
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
                    <svg>
                      <use href="#w-flower" />
                    </svg>
                    <b>OVATION</b>
                  </div>
                  <div className={`${styles.ri} ${styles.on}`}>
                    <svg>
                      <use href="#w-home" />
                    </svg>
                    Home
                  </div>
                  <div className={styles.ri}>
                    <svg>
                      <use href="#w-heart" />
                    </svg>
                    Planner
                  </div>
                  <div className={`${styles.ri} ${styles.sub}`}>
                    <svg>
                      <use href="#w-grid" />
                    </svg>
                    Dashboard
                  </div>
                  <div className={`${styles.ri} ${styles.sub}`}>
                    <svg>
                      <use href="#w-time" />
                    </svg>
                    Timeline
                  </div>
                  <div className={`${styles.ri} ${styles.sub}`}>
                    <svg>
                      <use href="#w-task" />
                    </svg>
                    Tasks
                  </div>
                  <div className={`${styles.ri} ${styles.sub}`}>
                    <svg>
                      <use href="#w-wallet" />
                    </svg>
                    Budget
                  </div>
                  <div className={`${styles.ri} ${styles.sub}`}>
                    <svg>
                      <use href="#w-mail" />
                    </svg>
                    Invitation
                  </div>
                  <div className={`${styles.ri} ${styles.sub}`}>
                    <svg>
                      <use href="#w-guests" />
                    </svg>
                    Guests
                  </div>
                  <div className={`${styles.ri} ${styles.sub}`}>
                    <svg>
                      <use href="#w-shop" />
                    </svg>
                    Vendors
                  </div>
                  <div className={`${styles.ri} ${styles.sub}`}>
                    <svg>
                      <use href="#w-spark" />
                    </svg>
                    AI Assistant
                  </div>
                  <div className={styles.ri}>
                    <svg>
                      <use href="#w-msg" />
                    </svg>
                    Messages
                  </div>
                  <div className={styles.ri}>
                    <svg>
                      <use href="#w-img" />
                    </svg>
                    Gallery
                  </div>
                  <div className={styles.ri}>
                    <svg>
                      <use href="#w-star" />
                    </svg>
                    Keepsakes
                  </div>
                  <div className={styles.ri}>
                    <svg>
                      <use href="#w-box" />
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
                    <h5>Home</h5>
                    <div className={styles.tools}>
                      <i>
                        <svg>
                          <use href="#w-sun" />
                        </svg>
                      </i>
                      <i>
                        <svg>
                          <use href="#w-cart" />
                        </svg>
                      </i>
                    </div>
                  </div>

                  <div className={styles.cols}>
                    <div className={styles.stack}>
                      <div className={`${styles.cardx} ${styles.msgs}`}>
                        <div className={styles.left}>
                          <span className={styles.ic}>
                            <svg>
                              <use href="#w-msg" />
                            </svg>
                          </span>
                          <div className={styles.count}>
                            <b>{msg}</b>
                            <span>messages</span>
                          </div>
                          <span className={styles.see}>See all messages</span>
                        </div>
                        <div className={styles.right}>
                          <span className={styles.lb}>LATEST</span>
                          <div className={`${styles.mrow} ${styles.new}`}>
                            <span
                              className={styles.av}
                              style={{ background: "#FBD3E1" }}
                            >
                              UR
                            </span>
                            <span className={styles.tx}>
                              <span className={styles.hd}>
                                <b>Uncle Ray</b>
                                <span className={styles.tm}>Just now</span>
                              </span>
                              <q>
                                “Forty years ago I said the same words to your
                                aunt.”
                              </q>
                              <span className={styles.dots}>
                                {DOTS.map((_, i) => (
                                  <i key={i} />
                                ))}
                              </span>
                            </span>
                            <span className={styles.play}>
                              <svg>
                                <use href="#w-play" />
                              </svg>
                            </span>
                          </div>
                          <div className={`${styles.mrow} ${styles.new2}`}>
                            <span
                              className={styles.av}
                              style={{ background: "#F3DCC4" }}
                            >
                              HL
                            </span>
                            <span className={styles.tx}>
                              <span className={styles.hd}>
                                <b>Henrik Larsson</b>
                                <span className={styles.tm}>04:20 PM</span>
                              </span>
                              <q>
                                “You both deserve all the happiness in the
                                world.”
                              </q>
                              <span className={styles.dots}>
                                {DOTS.map((_, i) => (
                                  <i key={i} />
                                ))}
                              </span>
                            </span>
                            <span className={styles.play}>
                              <svg>
                                <use href="#w-play" />
                              </svg>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className={`${styles.cardx} ${styles.gal}`}>
                        <div className={styles.lbrow}>
                          <b>Gallery</b>
                          <span>Open gallery</span>
                        </div>
                        <div className={styles.tiles}>
                          <span className={`${styles.tl} ${styles.pop}`}>
                            <svg>
                              <use href="#w-img" />
                            </svg>
                          </span>
                          <span className={`${styles.tl} ${styles.pop}`}>
                            <svg>
                              <use href="#w-video" />
                            </svg>
                          </span>
                          <span className={`${styles.tl} ${styles.pop}`}>
                            <svg>
                              <use href="#w-img" />
                            </svg>
                          </span>
                          <span className={`${styles.tl} ${styles.pop}`}>
                            <svg>
                              <use href="#w-img" />
                            </svg>
                          </span>
                          <span className={`${styles.tl} ${styles.pop}`}>
                            <svg>
                              <use href="#w-mic" />
                            </svg>
                          </span>
                          <span className={styles.tl}>
                            <svg>
                              <use href="#w-img" />
                            </svg>
                          </span>
                          <span className={styles.tl}>
                            <svg>
                              <use href="#w-img" />
                            </svg>
                          </span>
                          <span className={`${styles.tl} ${styles.more}`}>
                            +485
                          </span>
                        </div>
                        <div className={styles.photos}>
                          <b>{photo}</b>
                          <span>photos from the night</span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.side}>
                      <div className={styles.qrcard}>
                        <span className={styles.hd}>
                          <i>
                            <svg viewBox="0 0 33 33">
                              <use href="#w-qr" />
                            </svg>
                          </i>
                          <span className={styles.k}>Your QR code</span>
                        </span>
                        <span className={styles.box}>
                          <svg viewBox="0 0 33 33">
                            <use href="#w-qr" />
                          </svg>
                        </span>
                        <span className={styles.u}>
                          ovation.com/alex-sophia
                        </span>
                        <span className={styles.open}>Open QR page</span>
                      </div>
                      <div className={styles.inv}>
                        <span className={styles.k}>INVITATION</span>
                        <div className={styles.sheet}>
                          <span className={styles.s}>Save the date</span>
                          <span className={styles.nm}>Alex &amp; Sophia</span>
                          <span className={styles.dt}>
                            26 Sept 2026 · Villa Rosa
                          </span>
                        </div>
                        <span className={styles.btn}>Edit invitation</span>
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
                <use href="#w-mic" />
              </svg>
            </i>
            Uncle Ray · voice
          </span>

          <div className={styles.phone}>
            <div className={styles.pscreen}>
              <span className={styles.pisland} />
              <span className={styles.tick}>
                <svg>
                  <use href="#w-check" />
                </svg>
              </span>
              <b>Sent!</b>
              <small>Thank you</small>
            </div>
          </div>

          <span className={styles.live}>
            <span className={styles.dot} />
            <span className={styles.n}>{msg}</span>
            <small>and counting</small>
          </span>
        </div>

        {showCaption && (
          <div className={styles.capText}>
            <h3>{k("watch_title")}</h3>
            <p>{k("watch_body")}</p>
          </div>
        )}
      </div>
    </div>
  );
};
