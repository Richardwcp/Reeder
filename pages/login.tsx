import React, { useState, SyntheticEvent } from 'react'
import styles from './login.module.scss'
import { useRouter } from 'next/router'

interface LoginProps {}

interface Form {
  email: string
  password: string
}

export default function login({}: LoginProps) {
  const router = useRouter()
  const [form, setForm] = useState<Form>({
    email: '',
    password: '',
  })

  const { email, password } = form

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
      const res = await fetch('/api/authenticate', {
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
    <form id='loginForm' onSubmit={handleSubmit}>
      <div>
        <label>
          Email:
          <input
            type='email'
            name='email'
            placeholder='Email'
            onChange={handleChange}
            alt='Enter your Email'
            value={email}
          />
        </label>
        <label>
          Password:
          <input
            type='password'
            name='password'
            placeholder='Password'
            onChange={handleChange}
            alt='Enter your Password'
            value={password}
          />
        </label>
        <input type='submit' value='Sign In' />
      </div>
    </form>
  )
}
