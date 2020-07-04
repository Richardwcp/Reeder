import React from "react";
import styles from "./card.module.scss";
import { getDateFromTimestamp } from "@utils/date.utils";
import Likes from "@components/Likes/likes";
interface Props {
  title: string;
  description: string;
  link: string;
  pubDate: number;
}

export default function card({ title, description, link, pubDate }: Props) {
  return (
    <article className={styles.card}>
      {/* <div className={styles.imageContainer}></div> */}
      <div className={styles.content}>
        <div className={styles.abstract}>
          <p className={styles.headline}>
            <a href={link}>{title}</a>
          </p>
          <p className={styles.description}>{description}</p>
        </div>
        <div className={styles.cardBottom}>
          <span>{getDateFromTimestamp(pubDate)}</span>
          <span className={styles.author}>Jane Doe</span>
          <Likes />
        </div>
      </div>
    </article>
  );
}
