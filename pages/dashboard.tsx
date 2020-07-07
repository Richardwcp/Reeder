import React from 'react'
import { GetServerSideProps } from 'next'
import { auth } from '@utils/auth.utils'

interface Props {
  token: string
}

export default function Dashboard({ token }: Props) {
  return <div>{token}</div>
}

export const getServerSideProps: GetServerSideProps = async context => {
  const token = auth(context)
  return {
    props: {
      token: token,
    },
  }
}
