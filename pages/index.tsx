import { GetStaticProps, GetServerSideProps } from 'next'
// import jsdom from 'jsdom'

export default function Home() {
  return <>Hello World</>
}

export const getServerSideProps: GetServerSideProps = async context => {
  const RSS_URL: string = 'http://feeds.bbci.co.uk/news/rss.xml'
  // const { JSDOM } = jsdom
  // const { window } = new JSDOM(``)

  const res = await fetch(RSS_URL)
  const str = await res.text()

  const doc: Document = new DOMParser().parseFromString(str, 'text/xml')

  const items = doc.querySelectorAll('item')

  let html = ``
  items.forEach(el => {
    html += `
      <article>
      <img src="${el.querySelector('link').innerHTML}/image/large.png" alt="">
      <h2>
      <a href="${
        el.querySelector('link').innerHTML
      }" target="_blank" rel="noopener">
      ${el.querySelector('title').innerHTML}
      </a>
      </h2>
      </article>
      `
  })

  console.log('html', html)

  return {
    props: {},
  }
}
