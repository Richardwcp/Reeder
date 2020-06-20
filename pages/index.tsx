import { GetServerSideProps } from "next";
import jsdom from "jsdom";
import Header from "./components/Header/header";
import styles from "./index.module.scss";

type Item = {
  title: string;
  description: string;
  link: string;
  date: string;
};

type HomeProps = {
  items: Item[];
};

export default function Home({ items }: HomeProps) {
  return (
    <>
      <Header />
      {items.map(({ title, description, link, date }) => {
        return (
          <section className={styles.article}>
            <article className={styles.card}>
              <div className={styles.imageContainer}></div>
              <div className={styles.content}>
                <p className={styles.headline}>
                  <a href={link}>{title}</a>
                </p>
                <p className={styles.description}>{description}</p>
              </div>
              <div className={styles.cardBottom}>
                <p className={styles.author}>Jane Doe</p>
              </div>
            </article>
          </section>
        );
      })}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const RSS_URL: string = "http://feeds.skynews.com/feeds/rss/technology.xml";
  const { JSDOM } = jsdom;
  const { window } = new JSDOM(``);

  const res = await fetch(RSS_URL);
  const str = await res.text();

  const doc: Document = new window.DOMParser().parseFromString(str, "text/xml");

  const nodeList = doc.querySelectorAll("item");

  let items = [];
  nodeList.forEach((el) => {
    const title = el.querySelector("title").innerHTML;
    const description = el.querySelector("description").innerHTML;
    const link = el.querySelector("link").innerHTML;
    const date = el.querySelector("pubDate").innerHTML;

    const item = {
      title,
      description,
      link,
      date,
    };

    items.push(item);
  });

  return {
    props: {
      items,
    },
  };
};
