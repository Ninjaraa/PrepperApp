import styles from "./Layout.module.css";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.appContainer}>
      <Header />
      <div className={styles.mainContent}>
        <Sidebar />
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
