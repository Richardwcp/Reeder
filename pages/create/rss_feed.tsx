import React, { useState, SyntheticEvent } from 'react'
import { GetStaticProps } from 'next'
import styles from './rss_feed.module.scss'
import { client, q } from '@utils/fauna-client'
interface Props {
  categories: string[]
}

interface Form {
  author: string
  feedName: string
  feedUrl: string
  category: string
}

export default function rss_feed({ categories }: Props) {
  const [form, setForm] = useState<Form>({
    author: 'authorTest',
    feedName: 'nameTest',
    feedUrl: 'https://urlTest.com',
    category: 'Home',
  })

  const { author, feedName, feedUrl, category } = form

  const handleChange = (e: SyntheticEvent) => {
    const el = e.target as HTMLInputElement
    const value = el.value

    setForm({
      ...form,
      [el.name]: value,
    })
  }

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault()

    const res = await fetch('/api/feed/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    })

    const data = await res.json()
    console.log('handleSubmit -> data', data)
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <fieldset className={styles.formGroup}>
          <legend>New RSS feed</legend>
          <label htmlFor='author'>Author Name: </label>
          <input
            type='text'
            id='author'
            value={author}
            onChange={handleChange}
            name='author'
            required
          />
          <label htmlFor='feedName'>Feed Name: </label>
          <input
            type='text'
            id='feedName'
            value={feedName}
            onChange={handleChange}
            name='feedName'
            required
          />
          <label htmlFor='feedUrl'>Feed Url: </label>
          <input
            type='url'
            id='feedUrl'
            value={feedUrl}
            onChange={handleChange}
            name='feedUrl'
            required
          />
          <label htmlFor='category'>Category: </label>

          <select
            name='category'
            id='category'
            onChange={handleChange}
            value={category}
            required
          >
            <option hidden disabled value=''>
              Select a category...
            </option>

            {categories.map(category => (
              <option value={category} key={category}>
                {category}
              </option>
            ))}
          </select>
          <br />
          <input type='submit' value='Create' />
        </fieldset>
      </form>
    </>
  )
}

export const getStaticProps: GetStaticProps = async context => {
  const { data } = await client.query(
    q.Map(
      q.Paginate(q.Match(q.Index('all_categories'))),
      q.Lambda('category', q.Var('category'))
    )
  )

  return {
    props: {
      categories: data,
    },
  }
}
