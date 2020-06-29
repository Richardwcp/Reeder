import React, { useState, SyntheticEvent } from 'react'
import { GetStaticProps } from 'next'
import styles from './rss_feed.module.scss'
import { getAllCategories } from '@lib/category'

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
    author: '',
    feedName: '',
    feedUrl: '',
    category: '',
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

    try {
      const res = await fetch('/api/feed/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      const { msg } = await res.json()
      alert(msg)
    } catch (error) {
      alert('Failed to create RSS feed')
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <fieldset className={styles.formGroup}>
          <legend className={styles.legendTitle}>New RSS Feed</legend>
          <label className={styles.fieldLabel} htmlFor='author'>
            Author Name:
          </label>
          <input
            className={styles.inputField}
            type='text'
            id='author'
            value={author}
            onChange={handleChange}
            name='author'
            required
          />
          <label className={styles.fieldLabel} htmlFor='feedName'>
            Feed Name:
          </label>
          <input
            className={styles.inputField}
            type='text'
            id='feedName'
            value={feedName}
            onChange={handleChange}
            name='feedName'
            required
          />
          <label className={styles.fieldLabel} htmlFor='feedUrl'>
            Feed Url:
          </label>
          <input
            className={styles.inputField}
            type='url'
            id='feedUrl'
            value={feedUrl}
            onChange={handleChange}
            name='feedUrl'
            required
          />
          <label className={styles.fieldLabel} htmlFor='category'>
            Category:
          </label>

          <select
            className={styles.selectField}
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
  const data = await getAllCategories()

  return {
    props: {
      categories: data,
    },
  }
}
