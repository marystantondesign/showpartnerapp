import Link from "next/link";
import styles from "./Nav.module.css";

const LINKS = ["Overview", "Network", "Labs", "Research", "Safety", "Company"];

export default function Nav() {
  return (
    <header className={styles.nav}>
      <p className={styles.wordmark}>Parallel</p>
      <nav className={styles.links}>
        {LINKS.map((label) => (
          <Link key={label} href={`/${label.toLowerCase()}`} className={styles.link}>
            {label}
          </Link>
        ))}
        <Link href="/download" className={styles.download}>
          Download
        </Link>
      </nav>
    </header>
  );
}
