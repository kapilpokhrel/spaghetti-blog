import { londrina } from './fonts';
import styles from './header.module.css';

export default function Header({ children }) {
  return (
    <div className={`container ${styles.header} ${londrina.className}`}>
      {children}
    </div>
  );
}
