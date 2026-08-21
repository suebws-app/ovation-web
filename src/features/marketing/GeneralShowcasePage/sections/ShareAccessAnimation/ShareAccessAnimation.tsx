"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { GENERAL2_PREFIX } from "../../constants";
import styles from "./ShareAccessAnimation.module.css";

type ShareAccessAnimationProps = {
  showCaption?: boolean;
};

const QR_PATH =
  "M0 0h11v11H0zm3 3v5h5V3zM22 0h11v11H22zm3 3v5h5V3zM0 22h11v11H0zm3 3v5h5v-5zM14 0h3v3h-3zm3 3h3v3h-3zm-3 3h3v3h-3zm3 3h3v3h-3zm-3 3h3v3h-3zm-11 3h3v3H3zm5 0h3v3H8zm6 0h3v3h-3zm5-3h3v3h-3zm3 3h3v3h-3zm4 0h3v3h-3zm-9 3h3v3h-3zm4 0h3v3h-3zm5 0h3v3h-3zm-9 4h3v3h-3zm5 0h3v3h-3zm4 0h3v3h-3zm-9 4h3v3h-3zm4 0h3v3h-3zm5 0h3v3h-3zm-9 4h3v3h-3zm5 0h3v3h-3zm4 0h3v3h-3z";

export const ShareAccessAnimation = ({
  showCaption = true,
}: ShareAccessAnimationProps) => {
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
          <symbol id="sa-qr" viewBox="0 0 33 33">
            <path fill="currentColor" d={QR_PATH} />
          </symbol>
          <symbol id="sa-link" viewBox="0 0 24 24">
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
          <symbol id="sa-dl" viewBox="0 0 24 24">
            <g
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 4v11M7.5 10.5L12 15l4.5-4.5M5 19h14" />
            </g>
          </symbol>
          <symbol id="sa-check" viewBox="0 0 24 24">
            <path
              d="M5 12.5l4.5 4.5L19 7.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </symbol>
          <symbol id="sa-chat" viewBox="0 0 24 24">
            <path
              d="M20 15.5a2 2 0 0 1-2 2H8l-4 3.5v-15a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z"
              fill="currentColor"
            />
          </symbol>
          <symbol id="sa-mail" viewBox="0 0 24 24">
            <g
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinejoin="round"
            >
              <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" />
              <path d="M4 7.5l8 5.5 8-5.5" />
            </g>
          </symbol>
          <symbol id="sa-air" viewBox="0 0 24 24">
            <g
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            >
              <path d="M4 10a11 11 0 0 1 16 0M7.5 13.5a6.5 6.5 0 0 1 9 0" />
              <circle
                cx="12"
                cy="17.5"
                r="1.3"
                fill="currentColor"
                stroke="none"
              />
            </g>
          </symbol>
        </defs>
      </svg>

      <div className={styles.step}>
        <div className={styles.scene} ref={sceneRef} aria-hidden>
          <span className={styles.num}>2</span>

          <div className={styles.win}>
            <div className={styles.chrome}>
              <s />
              <s />
              <s />
              <span className={styles.url}>
                <i />
                ovation.com/qr-code
              </span>
            </div>
            <div className={styles.body}>
              <h6>
                Your <em>QR code.</em>
              </h6>
              <p className={styles.sub}>
                Any guest who scans this lands on your welcome screen. Download,
                print, share — napkins included.
              </p>
              <div className={styles.cols}>
                <div className={styles.poster}>
                  <span className={styles.k}>Scan to leave a message</span>
                  <span className={styles.nm}>Alex &amp; Sophia</span>
                  <div className={styles.qrbox}>
                    <svg viewBox="0 0 33 33">
                      <use href="#sa-qr" />
                    </svg>
                    <span className={styles.badge}>O</span>
                  </div>
                  <span className={styles.u}>ovation.com/alex-sophia</span>
                </div>
                <div className={styles.rail}>
                  <div className={styles.box}>
                    <div className={styles.lb}>Your short link</div>
                    <div className={styles.linkrow}>
                      <svg style={{ color: "var(--teal-strong)" }}>
                        <use href="#sa-link" />
                      </svg>
                      <span className={styles.u}>ovation.com/alex-sophia</span>
                      <span className={styles.copy}>Copy</span>
                    </div>
                    <div className={styles.slug}>Slug: alex-sophia</div>
                  </div>
                  <div className={styles.box}>
                    <div className={styles.lb}>Style</div>
                    <div className={styles.styles}>
                      <span className={`${styles.swc} ${styles.on}`}>
                        <span className={`${styles.sw} ${styles.on}`}>
                          <svg
                            viewBox="0 0 33 33"
                            style={{ color: "var(--ink)" }}
                          >
                            <use href="#sa-qr" />
                          </svg>
                        </span>
                        <span className={styles.cap}>Classic</span>
                      </span>
                      <span className={styles.swc}>
                        <span className={styles.sw}>
                          <svg viewBox="0 0 33 33" style={{ color: "#5B7FC7" }}>
                            <use href="#sa-qr" />
                          </svg>
                        </span>
                        <span className={styles.cap}>Cornflower</span>
                      </span>
                      <span className={styles.swc}>
                        <span className={styles.sw}>
                          <svg viewBox="0 0 33 33" style={{ color: "#E1855C" }}>
                            <use href="#sa-qr" />
                          </svg>
                        </span>
                        <span className={styles.cap}>Peach</span>
                      </span>
                      <span className={styles.swc}>
                        <span
                          className={styles.sw}
                          style={{ background: "var(--ink)" }}
                        >
                          <svg viewBox="0 0 33 33" style={{ color: "#EDE4D4" }}>
                            <use href="#sa-qr" />
                          </svg>
                        </span>
                        <span className={styles.cap}>Sand on ink</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`${styles.cols} ${styles["cols-b"]}`}>
                <div className={styles.box}>
                  <div className={styles.lb}>Download</div>
                  <div className={styles.dls}>
                    <span className={styles.dl}>
                      <b>PNG</b>
                      <span className={styles.dm}>2048 × 2048</span>
                      <i>
                        <svg>
                          <use href="#sa-dl" />
                        </svg>
                      </i>
                    </span>
                    <span className={styles.dl}>
                      <b>SVG</b>
                      <span className={styles.dm}>Vector</span>
                      <i>
                        <svg>
                          <use href="#sa-dl" />
                        </svg>
                      </i>
                    </span>
                    <span className={styles.dl}>
                      <b>PDF</b>
                      <span className={styles.dm}>
                        Print-ready · A4 card sheet
                      </span>
                      <i>
                        <svg>
                          <use href="#sa-dl" />
                        </svg>
                      </i>
                    </span>
                  </div>
                </div>
                <div className={styles.box}>
                  <div className={styles.lb}>Share directly</div>
                  <div className={styles.sharebar}>
                    <span className={styles.sb}>
                      <i style={{ background: "#25D366" }}>
                        <svg>
                          <use href="#sa-chat" />
                        </svg>
                      </i>
                      WhatsApp
                    </span>
                    <span className={styles.sb}>
                      <i style={{ background: "#5B7FC7" }}>
                        <svg>
                          <use href="#sa-mail" />
                        </svg>
                      </i>
                      Email
                    </span>
                    <span className={styles.sb}>
                      <i style={{ background: "#3FBF54" }}>
                        <svg>
                          <use href="#sa-chat" />
                        </svg>
                      </i>
                      Messages
                    </span>
                    <span className={styles.sb}>
                      <i style={{ background: "#2E7A8F" }}>
                        <svg>
                          <use href="#sa-air" />
                        </svg>
                      </i>
                      AirDrop
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.phone}>
            <div className={styles.pscreen}>
              <span className={styles.pisland} />
              <div className={styles.bub}>
                Scan this to leave us a message 💗
                <span className={styles.lkc}>
                  <i>O</i>
                  <b>ovation.com/alex-sophia</b>
                </span>
              </div>
              <div className={styles.bub}>
                Already done — Uncle Ray sent a video!
              </div>
              <span className={styles.homebar} />
            </div>
          </div>

          <div className={styles.tents}>
            <div className={styles.tent}>
              <span className={styles.tk}>Alex &amp; Sophia</span>
              <span className={styles.mini}>
                <svg viewBox="0 0 33 33">
                  <use href="#sa-qr" />
                </svg>
              </span>
              <span className={styles.tb}>TABLE 1</span>
            </div>
            <div className={styles.tent}>
              <span className={styles.tk}>Alex &amp; Sophia</span>
              <span className={styles.mini}>
                <svg viewBox="0 0 33 33">
                  <use href="#sa-qr" />
                </svg>
              </span>
              <span className={styles.tb}>TABLE 2</span>
            </div>
            <div className={styles.tent}>
              <span className={styles.tk}>Alex &amp; Sophia</span>
              <span className={styles.mini}>
                <svg viewBox="0 0 33 33">
                  <use href="#sa-qr" />
                </svg>
              </span>
              <span className={styles.tb}>TABLE 3</span>
            </div>
          </div>

          <span className={styles.toast}>
            <svg style={{ color: "var(--teal-strong)" }}>
              <use href="#sa-check" />
            </svg>
            Link copied
          </span>
          <span className={styles.chip}>
            <svg style={{ color: "var(--teal-strong)" }}>
              <use href="#sa-check" />
            </svg>
            Print for tables, or send the link
          </span>
        </div>

        {showCaption && (
          <div className={styles.capText}>
            <h3>{k("share_title")}</h3>
            <p>{k("share_body")}</p>
          </div>
        )}
      </div>
    </div>
  );
};
