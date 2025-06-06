import {
  CollectionDocument,
  CollectionQuery,
} from 'uniswap/src/data/graphql/uniswap-data-api/__generated__/types-and-hooks'
import client from '../client'

export default async function getCollection(collectionAddress: string, url: string) {
  const origin = new URL(url).origin
  const image = origin + '/api/image/nfts/collection/' + collectionAddress
  const { data } = await client.query<CollectionQuery>({
    query: CollectionDocument,
    variables: {
      addresses: collectionAddress,
    },
  })
  const collection = data?.nftCollections?.edges[0]?.node
  if (!collection || !collection.name) {
    return undefined
  }
  const formattedAsset = {
    title: collection.name + ' on DBCSwap',
    image,
    url,
    name: collection.name ?? 'Collection',
    ogImage: collection.image?.url ?? origin + '/images/192x192_App_Icon.png',
    isVerified: collection.isVerified ?? false,
  }
  return formattedAsset
}
