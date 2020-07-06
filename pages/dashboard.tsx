import React, { useEffect } from 'react'
import { GetStaticProps } from 'next'
import { auth } from '@utils/auth.utils'

interface Props {}

export default function Dashboard({}: Props) {
  const getTest = async () => {
    await fetch('/api')
  }

  // useEffect(() => {
  //   getTest()
  // }, [])
  return <div>Test</div>
}

Dashboard.getInitialProps = async context => {
  auth(context)
  return {
    props: {},
  }
}
