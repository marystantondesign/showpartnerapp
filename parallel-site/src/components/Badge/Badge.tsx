import styles from "./Badge.module.css";

type BadgeVariant = "included" | "public-beta" | "coming-soon";

const LABEL: Record<BadgeVariant, string> = {
  included: "INCLUDED",
  "public-beta": "PUBLIC BETA",
  "coming-soon": "COMING SOON",
};

const VARIANT_CLASS: Record<BadgeVariant, keyof typeof styles> = {
  included: "included",
  "public-beta": "publicBeta",
  "coming-soon": "comingSoon",
};

export default function Badge({ variant }: { variant: BadgeVariant }) {
  return <span className={`${styles.badge} ${styles[VARIANT_CLASS[variant]]}`}>{LABEL[variant]}</span>;
}
