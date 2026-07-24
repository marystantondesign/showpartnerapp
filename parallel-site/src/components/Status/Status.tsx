import styles from "./Status.module.css";

type StatusVariant = "operational" | "degraded" | "down";

const STATE_LABEL: Record<StatusVariant, string> = {
  operational: "OPERATIONAL",
  degraded: "DEGRADED",
  down: "NO DATA",
};

const DOT_CLASS: Record<StatusVariant, keyof typeof styles> = {
  operational: "operational",
  degraded: "degraded",
  down: "down",
};

const STATE_CLASS: Record<StatusVariant, keyof typeof styles> = {
  operational: "stateOperational",
  degraded: "stateDegraded",
  down: "stateDown",
};

export default function Status({ variant, label }: { variant: StatusVariant; label: string }) {
  return (
    <div className={styles.status}>
      <span className={`${styles.dot} ${styles[DOT_CLASS[variant]]}`} />
      <p className={styles.label}>{label}</p>
      <span className={`${styles.state} ${styles[STATE_CLASS[variant]]}`}>{STATE_LABEL[variant]}</span>
    </div>
  );
}
