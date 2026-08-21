"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { GENERAL2_PREFIX } from "../../constants";
import styles from "./PlanTheEventAnimation.module.css";

type PlanTheEventAnimationProps = {
  showCaption?: boolean;
};

export const PlanTheEventAnimation = ({
  showCaption = true,
}: PlanTheEventAnimationProps) => {
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
      { threshold: 0.25 },
    );
    observer.observe(scene);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.root}>
      <svg width="0" height="0" aria-hidden style={{ position: "absolute" }}>
        <defs>
          <symbol id="pl-flower" viewBox="0 0 200 200">
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
          <symbol id="pl-home" viewBox="0 0 24 24">
            <path
              d="M4 10.5L12 4l8 6.5V20h-5.5v-5h-5v5H4z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinejoin="round"
            />
          </symbol>
          <symbol id="pl-heart" viewBox="0 0 24 24">
            <path
              d="M12 20s-7.2-4.6-7.2-9.5A4.3 4.3 0 0 1 12 8a4.3 4.3 0 0 1 7.2 2.5C19.2 15.4 12 20 12 20z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinejoin="round"
            />
          </symbol>
          <symbol id="pl-grid" viewBox="0 0 24 24">
            <g fill="none" stroke="currentColor" strokeWidth="1.9">
              <rect x="4" y="4" width="6.5" height="6.5" rx="1.5" />
              <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5" />
              <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5" />
              <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5" />
            </g>
          </symbol>
          <symbol id="pl-time" viewBox="0 0 24 24">
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
          <symbol id="pl-task" viewBox="0 0 24 24">
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
          <symbol id="pl-wallet" viewBox="0 0 24 24">
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
          <symbol id="pl-mail" viewBox="0 0 24 24">
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
          <symbol id="pl-guests" viewBox="0 0 24 24">
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
          <symbol id="pl-shop" viewBox="0 0 24 24">
            <g
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinejoin="round"
            >
              <path d="M4 9.5V19h16V9.5M2.5 6.5h19l-1.5 3h-16z" />
            </g>
          </symbol>
          <symbol id="pl-spark" viewBox="0 0 24 24">
            <path
              d="M12 3.5l1.8 5.2 5.2 1.8-5.2 1.8L12 17.5l-1.8-5.2L5 10.5l5.2-1.8z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </symbol>
          <symbol id="pl-msg" viewBox="0 0 24 24">
            <path
              d="M20 15.5a2 2 0 0 1-2 2H8l-4 3.5v-15a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinejoin="round"
            />
          </symbol>
          <symbol id="pl-img" viewBox="0 0 24 24">
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
          <symbol id="pl-star" viewBox="0 0 24 24">
            <path
              d="M12 4l2.5 5.2 5.5.8-4 3.9 1 5.6-5-2.8-5 2.8 1-5.6-4-3.9 5.5-.8z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </symbol>
          <symbol id="pl-box" viewBox="0 0 24 24">
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
          <symbol id="pl-send" viewBox="0 0 24 24">
            <path
              d="M4 12l16-7-6 16-3.5-6.5z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinejoin="round"
            />
          </symbol>
          <symbol id="pl-check" viewBox="0 0 24 24">
            <path
              d="M5 12.5l4.5 4.5L19 7.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </symbol>
        </defs>
      </svg>

      <div className={styles.step}>
        <div className={styles.scene} ref={sceneRef} aria-hidden>
          <div className={styles.win}>
            <div className={styles.chrome}>
              <s />
              <s />
              <s />
              <span className={styles.url}>
                <i />
                ovation.com/planner
              </span>
            </div>
            <div className={styles.app}>
              <div className={styles.rail}>
                <div className={styles.logo}>
                  <svg>
                    <use href="#pl-flower" />
                  </svg>
                  <b>OVATION</b>
                </div>
                <div className={styles.ri}>
                  <svg>
                    <use href="#pl-home" />
                  </svg>
                  Home
                </div>
                <div className={styles.ri}>
                  <svg>
                    <use href="#pl-heart" />
                  </svg>
                  Planner
                </div>
                <div style={{ position: "relative" }}>
                  <span className={styles.pill} />
                  <div
                    className={`${styles.ri} ${styles.sub} ${styles.hl} ${styles.a3}`}
                  >
                    <svg>
                      <use href="#pl-grid" />
                    </svg>
                    Dashboard
                  </div>
                  <div className={`${styles.ri} ${styles.sub}`}>
                    <svg>
                      <use href="#pl-time" />
                    </svg>
                    Timeline
                  </div>
                  <div className={`${styles.ri} ${styles.sub}`}>
                    <svg>
                      <use href="#pl-task" />
                    </svg>
                    Tasks
                  </div>
                  <div
                    className={`${styles.ri} ${styles.sub} ${styles.hl} ${styles.a2}`}
                  >
                    <svg>
                      <use href="#pl-wallet" />
                    </svg>
                    Budget
                  </div>
                  <div className={`${styles.ri} ${styles.sub}`}>
                    <svg>
                      <use href="#pl-mail" />
                    </svg>
                    Invitation
                  </div>
                  <div className={`${styles.ri} ${styles.sub}`}>
                    <svg>
                      <use href="#pl-guests" />
                    </svg>
                    Guests
                  </div>
                  <div className={`${styles.ri} ${styles.sub}`}>
                    <svg>
                      <use href="#pl-shop" />
                    </svg>
                    Vendors
                  </div>
                  <div
                    className={`${styles.ri} ${styles.sub} ${styles.hl} ${styles.a1}`}
                  >
                    <svg>
                      <use href="#pl-spark" />
                    </svg>
                    AI Assistant
                  </div>
                </div>
                <div className={styles.ri}>
                  <svg>
                    <use href="#pl-msg" />
                  </svg>
                  Messages
                </div>
                <div className={styles.ri}>
                  <svg>
                    <use href="#pl-img" />
                  </svg>
                  Gallery
                </div>
                <div className={styles.ri}>
                  <svg>
                    <use href="#pl-star" />
                  </svg>
                  Keepsakes
                </div>
                <div className={styles.ri}>
                  <svg>
                    <use href="#pl-box" />
                  </svg>
                  Orders
                </div>
                <div className={styles.me}>
                  <i>U</i>
                  <span>user1+2</span>
                </div>
              </div>

              <div className={styles.main}>
                <div className={`${styles.screen} ${styles.s1}`}>
                  <h5>AI planning assistant</h5>
                  <p className={styles.sub}>
                    Ask in plain language. It knows your date, budget, guests
                    and vendors — and can update the plan.
                  </p>
                  <div className={styles.chat}>
                    <div className={styles.bub}>
                      <span className={styles.av}>
                        <svg>
                          <use href="#pl-heart" />
                        </svg>
                      </span>
                      <span className={styles.tx}>
                        Hi! I&apos;m your Ovation planning assistant. Ask me
                        anything about your event — in <b>Action</b> mode I can
                        add tasks, budget items and vendors for you.
                      </span>
                    </div>
                    <div className={`${styles.bub} ${styles.me} ${styles.q}`}>
                      <span className={styles.tx}>
                        What am I forgetting three months out?
                      </span>
                    </div>
                    <span className={styles.typing}>
                      <i />
                      <i />
                      <i />
                    </span>
                    <div className={`${styles.bub} ${styles.a}`}>
                      <span className={styles.av}>
                        <svg>
                          <use href="#pl-heart" />
                        </svg>
                      </span>
                      <span className={styles.tx}>
                        Three things are missing. Shall I add them to your plan?
                      </span>
                    </div>
                    <div className={styles.plan}>
                      <div className={styles.pc}>
                        <span className={styles.k}>
                          <svg>
                            <use href="#pl-task" />
                          </svg>
                          Task
                        </span>
                        <b>Book videographer</b>
                        <small>Due in 2 weeks</small>
                      </div>
                      <div className={styles.pc}>
                        <span className={styles.k}>
                          <svg>
                            <use href="#pl-wallet" />
                          </svg>
                          Budget
                        </span>
                        <b>Flowers · $1,200</b>
                        <small>Added to Decoración</small>
                      </div>
                      <div className={styles.pc}>
                        <span className={styles.k}>
                          <svg>
                            <use href="#pl-shop" />
                          </svg>
                          Vendor
                        </span>
                        <b>Trio for cocktails</b>
                        <small>3 options shortlisted</small>
                      </div>
                    </div>
                    <div className={styles.sugg}>
                      <span>
                        <svg style={{ color: "var(--pink)" }}>
                          <use href="#pl-spark" />
                        </svg>
                        What am I forgetting?
                      </span>
                      <span>
                        <svg style={{ color: "var(--pink)" }}>
                          <use href="#pl-spark" />
                        </svg>
                        How should I budget for flowers?
                      </span>
                      <span>
                        <svg style={{ color: "var(--pink)" }}>
                          <use href="#pl-spark" />
                        </svg>
                        Generate my full plan
                      </span>
                    </div>
                    <div className={styles.ask}>
                      <span className={styles.modes}>
                        <b className={styles.on}>Plan</b>
                        <b>Action</b>
                      </span>
                      <span className={styles.in}>
                        <span className={styles.typed}>
                          What am I forgetting?
                        </span>
                        <span className={styles.caret} />
                      </span>
                      <span className={styles.send}>
                        <svg>
                          <use href="#pl-send" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>

                <div className={`${styles.screen} ${styles.s2}`}>
                  <h5>Budget planner</h5>
                  <p className={styles.sub}>
                    $7,150 of $10,000 allocated · $2,850 remaining
                  </p>
                  <div className={styles.brow}>
                    <div className={styles.bcard}>
                      <span className={styles.bcardTitle}>Budget snapshot</span>
                      <div className={styles.snap}>
                        <div>
                          <span className={styles.lb}>Budget</span>
                          <span className={styles.vv}>$10,000</span>
                        </div>
                        <div>
                          <span className={styles.lb}>Spent</span>
                          <span className={`${styles.vv} ${styles.pink}`}>
                            $7,150
                          </span>
                        </div>
                        <div>
                          <span className={styles.lb}>Remaining</span>
                          <span className={styles.vv}>$2,850</span>
                        </div>
                      </div>
                      <div className={styles.stack}>
                        <i />
                        <i />
                        <i />
                        <i />
                        <i />
                        <i />
                      </div>
                      <div className={styles.legend}>
                        <span>
                          <s style={{ background: "var(--pink)" }} />
                          Lugar
                        </span>
                        <span>
                          <s style={{ background: "var(--teal-strong)" }} />
                          Catering
                        </span>
                        <span>
                          <s style={{ background: "var(--gold)" }} />
                          Fotografía
                        </span>
                        <span>
                          <s style={{ background: "var(--violet)" }} />
                          Decoración
                        </span>
                        <span>
                          <s style={{ background: "var(--sky)" }} />
                          Música
                        </span>
                        <span>+ 1 more</span>
                      </div>
                      <div className={styles.tbl}>
                        <div className={styles.th}>
                          <span>CATEGORY</span>
                          <span>ESTIMATED</span>
                          <span>ACTUAL</span>
                          <span>PROGRESS</span>
                        </div>
                        <div className={styles.tr}>
                          <span className={styles.cat}>
                            <s style={{ background: "var(--pink)" }} />
                            Lugar
                          </span>
                          <span className={styles.amt}>$3,000</span>
                          <span className={styles.amt}>$2,160</span>
                          <span className={styles.bar}>
                            <i />
                          </span>
                        </div>
                        <div className={styles.tr}>
                          <span className={styles.cat}>
                            <s style={{ background: "var(--teal-strong)" }} />
                            Catering
                          </span>
                          <span className={styles.amt}>$2,000</span>
                          <span className={styles.amt}>$960</span>
                          <span className={styles.bar}>
                            <i />
                          </span>
                        </div>
                        <div className={styles.tr}>
                          <span className={styles.cat}>
                            <s style={{ background: "var(--gold)" }} />
                            Fotografía
                          </span>
                          <span className={styles.amt}>$1,500</span>
                          <span className={styles.amt}>$1,290</span>
                          <span className={styles.bar}>
                            <i />
                          </span>
                        </div>
                        <div className={styles.tr}>
                          <span className={styles.cat}>
                            <s style={{ background: "var(--violet)" }} />
                            Decoración
                          </span>
                          <span className={styles.amt}>$1,200</span>
                          <span className={styles.amt}>$420</span>
                          <span className={styles.bar}>
                            <i />
                          </span>
                        </div>
                        <div className={styles.tr}>
                          <span className={styles.cat}>
                            <s style={{ background: "var(--sky)" }} />
                            Música
                          </span>
                          <span className={styles.amt}>$1,000</span>
                          <span className={styles.amt}>$600</span>
                          <span className={styles.bar}>
                            <i />
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className={styles.bcard}>
                      <div className={styles.donut}>
                        <svg viewBox="0 0 60 60">
                          <circle
                            className={styles.trk}
                            cx="30"
                            cy="30"
                            r="26"
                          />
                          <circle
                            className={styles.val}
                            cx="30"
                            cy="30"
                            r="26"
                          />
                        </svg>
                        <span className={styles.mid}>
                          <b>72%</b>
                          <span>OF BUDGET</span>
                        </span>
                      </div>
                      <div className={styles.kv}>
                        <span>
                          Total budget<b>$10,000</b>
                        </span>
                        <span>
                          Paid<b>$5,400</b>
                        </span>
                        <span>
                          Outstanding<b>$1,750</b>
                        </span>
                      </div>
                      <div className={styles.ontrack}>
                        <svg>
                          <use href="#pl-check" />
                        </svg>
                        <span>
                          <b>On track</b>
                          <small>
                            You&apos;re $2,850 under your total budget. Nicely
                            balanced.
                          </small>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`${styles.screen} ${styles.s3}`}>
                  <h5>Planner dashboard</h5>
                  <p className={styles.sub}>
                    Everything at a glance — tasks, payments, RSVPs and where
                    you are on the timeline.
                  </p>
                  <div className={styles.grid3}>
                    <div className={`${styles.g} ${styles.hero}`}>
                      <span>
                        <span className={styles.nm}>Alex &amp; Sophia</span>
                        <span className={styles.loc}>
                          Villa Borghese Gardens, Rome
                        </span>
                      </span>
                    </div>
                    <div className={styles.g}>
                      <div className={styles.ring}>
                        <span className={styles.d}>
                          <svg viewBox="0 0 40 40">
                            <circle
                              className={styles.trk}
                              cx="20"
                              cy="20"
                              r="16"
                            />
                            <circle
                              className={styles.val}
                              cx="20"
                              cy="20"
                              r="16"
                            />
                          </svg>
                          <span className={styles.mid}>
                            <b>63%</b>
                          </span>
                        </span>
                        <span className={styles.tx}>
                          <b>Overall progress</b>
                          <small>
                            5 of 8 milestones done. Right on schedule.
                          </small>
                        </span>
                      </div>
                    </div>

                    <div className={styles.g}>
                      <span className={styles.lb}>
                        <svg>
                          <use href="#pl-task" />
                        </svg>
                        Today&apos;s tasks
                      </span>
                      <div className={styles.task}>
                        <span className={styles.box}>
                          <svg>
                            <use href="#pl-check" />
                          </svg>
                        </span>
                        <span className={styles.tx}>
                          <b>Reservar el lugar</b>
                          <small>Lugar · Ambos</small>
                        </span>
                        <span className={styles.pr}>PRIORITY</span>
                      </div>
                      <div className={styles.task}>
                        <span className={styles.box}>
                          <svg>
                            <use href="#pl-check" />
                          </svg>
                        </span>
                        <span className={styles.tx}>
                          <b>Seleccionar catering</b>
                          <small>Catering · Ambos</small>
                        </span>
                        <span className={styles.pr}>PRIORITY</span>
                      </div>
                      <div className={styles.task}>
                        <span className={styles.box}>
                          <svg>
                            <use href="#pl-check" />
                          </svg>
                        </span>
                        <span className={styles.tx}>
                          <b>Contratar fotógrafo</b>
                          <small>Fotografía · Ambos</small>
                        </span>
                      </div>
                    </div>

                    <div className={styles.g}>
                      <span className={styles.lb}>
                        <svg>
                          <use href="#pl-wallet" />
                        </svg>
                        Upcoming payments
                      </span>
                      <div className={styles.task}>
                        <span className={styles.tx}>
                          <b>Catering deposit</b>
                          <small>Due 12 Sept · $960</small>
                        </span>
                      </div>
                      <div className={styles.task}>
                        <span className={styles.tx}>
                          <b>Photographer balance</b>
                          <small>Due 20 Sept · $1,290</small>
                        </span>
                      </div>
                    </div>

                    <div className={styles.g}>
                      <span className={styles.lb}>
                        <svg>
                          <use href="#pl-guests" />
                        </svg>
                        RSVP
                      </span>
                      <div className={styles.rsvp}>
                        <svg viewBox="0 0 52 52">
                          <circle
                            className={styles.trk}
                            cx="26"
                            cy="26"
                            r="21"
                          />
                          <circle
                            className={styles.val}
                            cx="26"
                            cy="26"
                            r="21"
                          />
                        </svg>
                        <span className={styles.mid}>
                          <b>86</b>
                          <span>COMING</span>
                        </span>
                      </div>
                      <div className={styles.rlist}>
                        <span>
                          <s style={{ background: "var(--green)" }} />
                          Accepted<b>86</b>
                        </span>
                        <span>
                          <s style={{ background: "#C4322B" }} />
                          Declined<b>7</b>
                        </span>
                        <span>
                          <s style={{ background: "#6F6156" }} />
                          Pending<b>27</b>
                        </span>
                      </div>
                    </div>

                    <div className={styles.g} style={{ gridColumn: "span 2" }}>
                      <span className={styles.lb}>
                        <svg>
                          <use href="#pl-time" />
                        </svg>
                        Where you are
                      </span>
                      <div className={styles.tl}>
                        <span className={styles.now}>
                          <s />3 meses antes
                          <span className={styles.tag}>NOW</span>
                        </span>
                        <span>
                          <s />1 mes antes
                          <span className={styles.tag}>NEXT</span>
                        </span>
                        <span>
                          <s />1 semana antes
                          <span className={styles.tag}>NEXT</span>
                        </span>
                      </div>
                    </div>

                    <div className={styles.g}>
                      <span className={styles.lb}>
                        <svg>
                          <use href="#pl-shop" />
                        </svg>
                        Vendors
                      </span>
                      <div className={styles.task}>
                        <span className={styles.tx}>
                          <b>Villa Borghese</b>
                          <small>Venue · confirmed</small>
                        </span>
                      </div>
                      <div className={styles.task}>
                        <span className={styles.tx}>
                          <b>Studio Lume</b>
                          <small>Photography · confirmed</small>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showCaption && (
          <div className={styles.capText}>
            <h3>{k("plan_title")}</h3>
            <p>{k("plan_body")}</p>
          </div>
        )}
      </div>
    </div>
  );
};
