import { londrina, pt_serif, mukta } from './fonts'
import styles from './blog_item.module.css'

export default function Blog_item({title, date, text}) {
    return (
        <div className={`container ${styles.blog_item}`}>
            <h2 className={`${londrina.className} ${styles.title}`}>{title}</h2>
            <span className={`${pt_serif.className} ${styles.pub_date}`}>{date}</span>
            <span className={`${mukta.className} ${styles.blog_text}`}>{text}</span>
        </div> 
    )
}