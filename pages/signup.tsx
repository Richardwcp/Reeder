import React, { useState, SyntheticEvent } from 'react'
import styles from './signup.module.scss'
import { useRouter } from 'next/router'

interface signUpProps {}

interface Form {
  username: string
  password: string
  email: string
}
export default function signUp({}: signUpProps) {
  const router = useRouter()
  const [form, setForm] = useState<Form>({
    username: '',
    password: '',
    email: '',
  })

  const { email, password, username } = form

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
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      const { success } = await res.json()

      if (success) {
        router.push('/dashboard')
      }
    } catch (error) {
      alert(error.message)
    }
  }

  return (
    <form id='signUpForm' onSubmit={handleSubmit}>
      <div>
        <label>
          Email:
          <input
            className={styles.emailInput}
            type='email'
            name='email'
            placeholder='Email'
            onChange={handleChange}
            alt='Enter your Email'
            value={email}
          />
        </label>
        <label>
          Username:
          <input
            className={styles.usernameInput}
            type='text'
            name='username'
            placeholder='User Name'
            onChange={handleChange}
            alt='Enter your Username'
            value={username}
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
            value={password}
          />
        </label>

        <input type='submit' value='Sign Up' />
      </div>
    </form>
  )
}
