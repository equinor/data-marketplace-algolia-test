import NextLink from 'next/link'
import { createInstantSearchNextRouter } from 'instantsearch-router-next-experimental'
import type { NextPage, GetServerSideProps } from 'next/types'
import { renderToString } from 'react-dom/server'
import { getServerState } from 'react-instantsearch-hooks-server'
import algoliasearch from 'algoliasearch/lite'
import {
  Configure,
  InstantSearch,
  InstantSearchServerState,
  InstantSearchSSRProvider,
  SearchBox,
  Hits,
  RefinementList,
  Highlight,
  Snippet,
} from 'react-instantsearch-hooks-web'

const searchClient = algoliasearch('appId', 'apiKey')

type Props = {
  serverState?: InstantSearchServerState
  serverUrl?: URL | string
  routingRef?: any
  featureFlags?: {
    USE_IMPROVED_SEARCH: boolean
  }
}

function Hit({ hit }: any) {
  const { id } = hit
  return (
    <NextLink
      href={{ pathname: '/assets/[id]', query: { id } }}
      className="link"
    >
      <h2>
        <Highlight
          hit={hit}
          attribute="name"
          classNames={{
            highlighted: 'highlighted',
          }}
        />
      </h2>
      <p>
        <Snippet
          attribute="excerpt"
          hit={hit}
          classNames={{
            highlighted: 'highlighted',
          }}
        />
      </p>
      <p>
        <Snippet
          attribute="description"
          hit={hit}
          classNames={{
            highlighted: 'highlighted',
          }}
        />
      </p>
    </NextLink>
  )
}

const HITS_PER_PAGE = 10

/* const onStateChange = (params: any) => {
  console.log('The query', params.uiState.Data_Set?.query)
  params.setUiState(params.uiState)
} */

const SearchPage: NextPage<Props> = ({ serverState, serverUrl }) => {
  // console.log('The server url', serverUrl)
  return (
    <main>
      <h1>Search for data</h1>
      <InstantSearchSSRProvider {...serverState}>
        <InstantSearch
          searchClient={searchClient}
          indexName="Data_Set"
          /*    onStateChange={onStateChange} */
          /* @ts-ignore */
          routing={{ router: createInstantSearchNextRouter({ serverUrl }) }}
        >
          <Configure
            hitsPerPage={HITS_PER_PAGE}
            snippetEllipsisText="..."
            attributesToSnippet={['excerpt:30', 'description:30']}
          />

          <div className="search">
            <div className="search-box">
              <SearchBox />
            </div>
            <div className="results">Showing a maximum of 10 hits</div>
            <div className="hits">
              {/* @ts-ignore  */}
              <Hits hitComponent={Hit} className="unstyled-list" />
            </div>
            <div className="filter">
              <h3>Filters</h3>
              <RefinementList attribute="community" className="unstyled-list" />
            </div>
          </div>
        </InstantSearch>
      </InstantSearchSSRProvider>
    </main>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const protocol = req.headers.referer?.split('://')[0] || 'https'
  const serverUrl = `${protocol}://${req.headers.host}${req.url}`

  const serverState = await getServerState(
    <SearchPage serverUrl={serverUrl} />,
    {
      renderToString,
    }
  )

  return {
    props: {
      serverState,
      serverUrl,
    },
  }
}

export default SearchPage
