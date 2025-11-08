'use client'

import { ApolloProvider } from "@apollo/client/react"
import client from "./api/onClient/graphql/apolloClient"


const Providers = ({ children }: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  )
}

export default Providers
