import React from 'react'
import { GetServerSideProps } from 'next'
import { checkAuth } from '@utils/auth.utils'

interface Props {}

export default function Dashboard({}: Props) {
  return <div>Some text...</div>
}

export const getServerSideProps: GetServerSideProps = async context => {
  checkAuth(context)
  return {
    props: {},
  }
}
