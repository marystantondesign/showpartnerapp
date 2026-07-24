import Nav from "@/components/Nav/Nav";
import Footer from "@/components/Footer/Footer";
import Button from "@/components/Button/Button";
import styles from "./page.module.css";

const TICKER = [
  "2,140 RELAYS ACTIVE",
  "GEN 3",
  "COVERAGE 6.4%",
  "MEDIAN LATENCY 180MS",
  "NETWORK OPERATIONAL",
  "ESTD 2026",
];

const THREAD = [
  { from: "them" as const, text: "did you ever get that molar looked at" },
  { from: "me" as const, text: "going thursday" },
  { from: "them" as const, text: "halpern?" },
  { from: "me" as const, text: "yeah" },
  { from: "them" as const, text: "he's fine. forty minutes tops" },
  { from: "me" as const, text: "ok. thanks" },
];

const DIRECTIONS = [
  { eyebrow: "SIDEWAYS", title: "Twins", body: "A version of you living right now, in a reality close enough to talk to.", color: "var(--color-brand-relay-blue)" },
  { eyebrow: "ELSEWHERE", title: "Dreams", body: "The parallels where no version of you exists. You have been visiting them your whole life.", color: "var(--color-brand-violet)" },
  { eyebrow: "BACKWARDs", title: "Echoes", body: "Your own line, further back. Reached by trance rather than by relay.", color: "var(--color-brand-gold)" },
];

const APP_SECTIONS = [
  {
    title: "Twins",
    body: "Text, voice, and video with a version of you living right now. Classified identical or fraternal by how far the realities have drifted.",
    tag: "INCLUDED",
    tagColor: "var(--color-text-muted)",
    iconColor: "var(--color-brand-relay-blue)",
  },
  {
    title: "Dreams",
    body: "Record where you went. With guidance, return to it. This is not lucid dreaming. You are not steering, you are returning.",
    tag: "INCLUDED",
    tagColor: "var(--color-text-muted)",
    iconColor: "rgba(120,97,255,0.84)",
  },
  {
    title: "Echoes",
    body: "A guided trance into your own line, further back. Nothing is generated and nothing is verified.",
    tag: "BETA",
    tagColor: "var(--color-signal-degraded)",
    iconColor: "var(--color-brand-gold)",
  },
];

const SAFETY_CARDS = [
  { title: "Session limits", body: "Sessions end automatically after 40 minutes. Consecutive sessions require a rest interval." },
  { title: "Identity verification", body: "Every match is confirmed against your own biometric signature before a channel opens." },
  { title: "Withdrawal support", body: "Licensed counselors are available in-app for anyone who wants to stop." },
];

const PAPERS = [
  { title: "Stabilized information transfer across adjacent reality states", id: "VCL-2019-004" },
  { title: "Hypnotic induction protocols for recollective sessions", id: "VCL-2023-017" },
  { title: "Relay array siting and regional coverage density", id: "VCL-2025-002" },
];

export default function Home() {
  return (
    <div className={styles.page}>
      <Nav />

      <div className={styles.ticker}>
        {TICKER.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>

      <section className={styles.hero}>
        <p className={styles.heroWordmark}>Parallel</p>
        <h1 className={styles.heroHeadline}>Meet yourself.</h1>
        <p className={styles.heroSubhead}>
          Text, call, and video with verified versions of yourself in neighboring realities. Included with every
          Parallel account.
        </p>
        <div className={styles.ctaRow}>
          <Button
            variant="primary"
            style={{ background: "var(--color-signal-degraded)", color: "var(--color-brand-cyan)" }}
          >
            Download Parallel
          </Button>
          <Button
            variant="secondary"
            style={{ color: "var(--color-brand-cyan)", borderColor: "var(--color-brand-cyan)", borderWidth: "1.5px" }}
          >
            Check coverage
          </Button>
        </div>
        <p className={styles.heroFinePrint}>Available on iPhone, Android, and web. Requires relay coverage in your area.</p>

        <div className={styles.deviceStage}>
          <div className={styles.device}>
            <div className={styles.deviceStatusBar}>
              <span>9:41</span>
              <span>RELAY 04</span>
            </div>
            <div className={styles.deviceContactHeader}>
              <strong>Elena Marsh</strong>
              <span>Verified match</span>
            </div>
            <div className={styles.thread}>
              {THREAD.map((message, i) => (
                <div key={i} className={`${styles.threadRow} ${message.from === "me" ? styles.threadRowEnd : ""}`}>
                  <div className={`${styles.bubble} ${message.from === "me" ? styles.bubbleSent : styles.bubbleReceived}`}>
                    {message.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.names}>
        <p className={styles.eyebrow}>ON THE NAMES</p>
        <h2 className={styles.namesHeadline}>A parallel is a reality running alongside this one.</h2>
        <p className={styles.namesBody}>
          Not a metaphor. A place you can reach without leaving your body. People have been reaching them for as long
          as there have been people. In sleep, in trance, in the quiet minutes after something goes badly wrong. What
          was missing was never the ability. What was missing was the instrument.
        </p>
        <div className={styles.directions}>
          {DIRECTIONS.map((d) => (
            <div key={d.title} className={styles.direction} style={{ "--direction-color": d.color } as React.CSSProperties}>
              <p className={styles.directionEyebrow}>{d.eyebrow}</p>
              <p className={styles.directionTitle}>{d.title}</p>
              <p className={styles.directionBody}>{d.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.inside}>
        <div className={styles.insideHead}>
          <p className={styles.eyebrow}>INSIDE PARALLEL</p>
          <h2 className={styles.insideHeadline}>One app. Three directions.</h2>
          <p className={styles.insideBody}>
            You download one application. Twins, Dreams, and Echoes are included with every Parallel account and run
            on the same Continuum Network.
          </p>
        </div>

        <div className={styles.appCard}>
          <div className={styles.appBar}>
            <div className={styles.appIcon} />
            <div className={styles.appMeta}>
              <p className={styles.appName}>Parallel</p>
              <p className={styles.appVersion}>VERSION 4.2 · REQUIRES CONTINUUM NETWORK COVERAGE</p>
            </div>
            <span className={styles.appPill}>One download</span>
          </div>
          <div className={styles.appSections}>
            {APP_SECTIONS.map((section) => (
              <div key={section.title} className={styles.sectionRow}>
                <div className={styles.sectionRowIcon} style={{ background: section.iconColor }} />
                <div className={styles.sectionRowCopy}>
                  <p className={styles.sectionRowTitle}>{section.title}</p>
                  <p className={styles.sectionRowBody}>{section.body}</p>
                </div>
                <span className={styles.sectionRowTag} style={{ color: section.tagColor }}>
                  {section.tag}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className={styles.insideQuote}>Sideways, elsewhere, and backward. Three directions, one instrument.</p>
      </section>

      <div className={styles.banner} data-figma-asset-pending="56:932">
        Image pending — Figma asset unreachable from this environment
      </div>

      <section className={styles.coverage}>
        <div className={styles.coverageRow}>
          <div className={styles.coverageMap}>
            <div className={styles.diagramPlaceholder} data-figma-asset-pending="39:49">
              Diagram / Relay array — pending asset
            </div>
          </div>
          <div className={styles.coverageCopy}>
            <h2 className={styles.coverageHeadline}>Coverage where you live.</h2>
            <p className={styles.coverageBody}>
              Parallel requires a Continuum Relay Array within range. Coverage is strongest in metropolitan areas and
              expands quarterly.
            </p>
            <div className={styles.addressField}>
              <span className={styles.addressPlaceholder}>Enter your address</span>
              <button className={styles.checkButton}>Check</button>
            </div>
            <p className={styles.coverageMeta}>2,140 relays active. Last updated 14 July 2026.</p>
          </div>
        </div>
      </section>

      <section className={styles.safety}>
        <div className={styles.sectionHead}>
          <p className={styles.eyebrow}>SAFETY</p>
          <h2 className={styles.sectionHeadline}>Designed with limits.</h2>
        </div>
        <div className={styles.safetyRow}>
          {SAFETY_CARDS.map((card) => (
            <div key={card.title} className={styles.safetyCard}>
              <p className={styles.safetyCardTitle}>{card.title}</p>
              <p className={styles.safetyCardBody}>{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.research}>
        <div className={styles.sectionHead}>
          <p className={styles.eyebrow}>RESEARCH</p>
          <h2 className={styles.sectionHeadline}>Published work.</h2>
        </div>
        <div className={styles.paperList}>
          {PAPERS.map((paper) => (
            <div key={paper.id} className={styles.paper}>
              <p className={styles.paperTitle}>{paper.title}</p>
              <p className={styles.paperId}>{paper.id}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
