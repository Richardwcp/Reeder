import React, { useState, SyntheticEvent } from 'react'
import styles from './index.module.scss'

interface LoginProps {}

interface Form {
  userName: string
  password: string
}
export default function login({}: LoginProps) {
  const [form, setForm] = useState<Form>({
    userName: '',
    password: '',
  })

  const handleChange = (e: SyntheticEvent) => {
    const el = e.target as HTMLInputElement
    const value = el.value

    setForm({
      ...form,
      [el.name]: value,
    })
  }

  const handleSubmit = async (e: SyntheticEvent) => {}

  return (
    <form id='loginForm' onSubmit={handleSubmit}>
      <div>
        <label>
          Username:
          <input
            className={styles.usernameInput}
            type='text'
            name='username'
            placeholder='First Name'
            onChange={handleChange}
            alt='Enter your Username'
          />
        </label>
        <label>
          Password:
          <input
            className={styles.passwordInput}
            type='password'
            name='username'
            placeholder='Password'
            onChange={handleChange}
            alt='Enter your Password'
          />
        </label>
        <input type='submit' value='Sign In' />
      </div>
    </form>
  )
}
