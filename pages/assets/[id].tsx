import { useRouter } from 'next/router'
import type { NextPage, GetServerSideProps } from 'next/types'

const Detail: NextPage = () => {
  return (
    <main>
      <h1>This is the detail page</h1>
      <p>Or it could be, if it was implemented ¯\_(ツ)_/¯</p>
    </main>
  )
}

export const getServerSideProps: GetServerSideProps = async () => ({
  props: {
    // This is not a secret, it's just an environment specific value.
    // It doesn't matter if we expose it to the client
    firstTimeVisitor: process.env.COLLIBRA_FIRST_TIME_VISITOR || '',
  },
})

export default Detail
