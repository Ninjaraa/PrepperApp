import { Link, useLocation } from "react-router-dom";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: "bi-house" },
    { path: "/household", label: "Household", icon: "bi-people" },
    { path: "/inventory", label: "Inventory", icon: "bi-box-seam" },
    { path: "/shopping", label: "Shopping List", icon: "bi-cart" },
    { path: "/suggestions", label: "Suggestions", icon: "bi-lightbulb" },
    { path: "/achievements", label: "Achievements", icon: "bi-trophy" },
    { path: "/history", label: "Score History", icon: "bi-graph-up" },
  ];

  return (
    <nav className={styles.sidebar}>
      <div className="py-3">
        <ul className="nav flex-column">
          {navItems.map((item) => (
            <li className="nav-item mb-2" key={item.path}>
              <Link
                to={item.path}
                className={
                  "nav-link d-flex align-items-center py-2 px-3 rounded " +
                  (location.pathname === item.path
                    ? styles.active
                    : styles.navLink)
                }
              >
                <i className={"bi " + item.icon + " me-2"}></i>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
