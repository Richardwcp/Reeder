import React, { useState, SyntheticEvent } from 'react'
import styles from './signup.module.scss'

interface signUpProps {}

interface Form {
  userName: string
  password: string
  email: string
}
export default function signUp({}: signUpProps) {
  const [form, setForm] = useState<Form>({
    userName: '',
    password: '',
    email: '',
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
    <form id='signUpForm' onSubmit={handleSubmit}>
      <div>
        <label>
          Username:
          <input
            className={styles.usernameInput}
            type='text'
            name='username'
            placeholder='User Name'
            onChange={handleChange}
            alt='Enter your Username'
          />
        </label>
        <label>
          Password:
          <input
            className={styles.passwordInput}
            type='password'
            name='password'
            placeholder='Password'
            onChange={handleChange}
            alt='Enter your Password'
          />
        </label>
        <label>
          Email:
          <input
            className={styles.emailInput}
            type='email'
            name='email'
            placeholder='Email'
            onChange={handleChange}
            alt='Enter your Email'
          />
        </label>
        <input type='submit' value='Sign Up' />
      </div>
    </form>
  )
}
