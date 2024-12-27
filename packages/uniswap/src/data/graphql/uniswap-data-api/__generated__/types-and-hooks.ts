import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | undefined;
export type InputMaybe<T> = T | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /**
   * The `AWSJSON` scalar type provided by AWS AppSync, represents a JSON string that
   * complies with [RFC 8259](https://tools.ietf.org/html/rfc8259).  Maps like
   * "**{\\"upvotes\\": 10}**", lists like "**[1,2,3]**", and scalar values like
   * "**\\"AWSJSON example string\\"**", "**1**", and "**true**" are accepted as
   * valid JSON and will automatically be parsed and loaded in the resolver mapping
   * templates as Maps, Lists, or Scalar values rather than as the literal input
   * strings.  Invalid JSON strings like "**{a: 1}**", "**{'a': 1}**" and "**Unquoted
   * string**" will throw GraphQL validation errors.
   */
  AWSJSON: any;
};

/**
 *  Types, unions, and inputs (alphabetized):
 * These are colocated to highlight the relationship between some types and their inputs.
 */
export type ActivityDetails = SwapOrderDetails | TransactionDetails;

export type ActivityDetailsInput = {
  swapOrderDetails?: InputMaybe<SwapOrderDetailsInput>;
  transactionDetails?: InputMaybe<TransactionDetailsInput>;
};

/**
 *  Enums (alphabetized):
 * deprecated and replaced with TransactionType, please do not use this
 */
export enum ActivityType {
  Approve = 'APPROVE',
  Borrow = 'BORROW',
  Burn = 'BURN',
  Cancel = 'CANCEL',
  Claim = 'CLAIM',
  Deployment = 'DEPLOYMENT',
  Lend = 'LEND',
  Mint = 'MINT',
  Nft = 'NFT',
  Receive = 'RECEIVE',
  Repay = 'REPAY',
  Send = 'SEND',
  Stake = 'STAKE',
  Swap = 'SWAP',
  SwapOrder = 'SWAP_ORDER',
  Staking = 'Staking',
  Unknown = 'UNKNOWN',
  Unstake = 'UNSTAKE',
  Withdraw = 'WITHDRAW',
  Market = 'market',
  Money = 'money'
}

export type Amount = IAmount & {
  __typename?: 'Amount';
  currency?: Maybe<Currency>;
  id: Scalars['ID'];
  value: Scalars['Float'];
};

export type AmountChange = {
  __typename?: 'AmountChange';
  absolute?: Maybe<Amount>;
  id: Scalars['ID'];
  percentage?: Maybe<Amount>;
};

export type AmountInput = {
  currency?: InputMaybe<Currency>;
  value: Scalars['Float'];
};

export type ApplicationContract = IContract & {
  __typename?: 'ApplicationContract';
  address: Scalars['String'];
  chain: Chain;
  icon?: Maybe<Image>;
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
};

export type ApplicationContractInput = {
  address: Scalars['String'];
  chain: Chain;
  icon?: InputMaybe<ImageInput>;
  name?: InputMaybe<Scalars['String']>;
};

export type AssetActivity = {
  __typename?: 'AssetActivity';
  addresses?: Maybe<Array<Scalars['String']>>;
  /** @deprecated use assetChanges field in details */
  assetChanges: Array<Maybe<AssetChange>>;
  chain: Chain;
  details: ActivityDetails;
  /** @deprecated not required, remove usage */
  gasUsed?: Maybe<Scalars['Float']>;
  id: Scalars['ID'];
  timestamp: Scalars['Int'];
  /** @deprecated use fields from details */
  transaction: Transaction;
  /** @deprecated use type field in details */
  type: ActivityType;
};

export type AssetActivityInput = {
  chain: Chain;
  details: ActivityDetailsInput;
  timestamp: Scalars['Int'];
};

export enum AssetActivitySwitch {
  Alternate = 'ALTERNATE',
  Legacy = 'LEGACY'
}

export type AssetChange = NftApproval | NftApproveForAll | NftTransfer | TokenApproval | TokenTransfer;

export type AssetChangeInput = {
  nftApproval?: InputMaybe<NftApprovalInput>;
  nftApproveForAll?: InputMaybe<NftApproveForAllInput>;
  nftTransfer?: InputMaybe<NftTransferInput>;
  tokenApproval?: InputMaybe<TokenApprovalInput>;
  tokenTransfer?: InputMaybe<TokenTransferInput>;
};

export enum Chain {
  Arbitrum = 'ARBITRUM',
  Avalanche = 'AVALANCHE',
  Base = 'BASE',
  Blast = 'BLAST',
  Bnb = 'BNB',
  Celo = 'CELO',
  Ethereum = 'ETHEREUM',
  EthereumGoerli = 'ETHEREUM_GOERLI',
  EthereumSepolia = 'ETHEREUM_SEPOLIA',
  Optimism = 'OPTIMISM',
  Polygon = 'POLYGON',
  UnknownChain = 'UNKNOWN_CHAIN',
  DBC = 'DBC'
}

export enum CollectionSortableField {
  Volume = 'VOLUME'
}

export type ContractInput = {
  address?: InputMaybe<Scalars['String']>;
  chain: Chain;
};

export enum Currency {
  Aud = 'AUD',
  Brl = 'BRL',
  Cad = 'CAD',
  Cny = 'CNY',
  Eth = 'ETH',
  Eur = 'EUR',
  Gbp = 'GBP',
  Hkd = 'HKD',
  Idr = 'IDR',
  Inr = 'INR',
  Jpy = 'JPY',
  Matic = 'MATIC',
  Ngn = 'NGN',
  Pkr = 'PKR',
  Rub = 'RUB',
  Sgd = 'SGD',
  Thb = 'THB',
  Try = 'TRY',
  Uah = 'UAH',
  Usd = 'USD',
  Vnd = 'VND'
}

export type CurrencyAmountInput = {
  currency: Currency;
  value: Scalars['Float'];
};

export type DescriptionTranslations = {
  __typename?: 'DescriptionTranslations';
  descriptionEnUs?: Maybe<Scalars['String']>;
  descriptionEs419?: Maybe<Scalars['String']>;
  descriptionEsEs?: Maybe<Scalars['String']>;
  descriptionEsUs?: Maybe<Scalars['String']>;
  descriptionFrFr?: Maybe<Scalars['String']>;
  descriptionHiIn?: Maybe<Scalars['String']>;
  descriptionIdId?: Maybe<Scalars['String']>;
  descriptionJaJp?: Maybe<Scalars['String']>;
  descriptionMsMy?: Maybe<Scalars['String']>;
  descriptionNlNl?: Maybe<Scalars['String']>;
  descriptionPtPt?: Maybe<Scalars['String']>;
  descriptionRuRu?: Maybe<Scalars['String']>;
  descriptionThTh?: Maybe<Scalars['String']>;
  descriptionTrTr?: Maybe<Scalars['String']>;
  descriptionUkUa?: Maybe<Scalars['String']>;
  descriptionUrPk?: Maybe<Scalars['String']>;
  descriptionViVn?: Maybe<Scalars['String']>;
  descriptionZhHans?: Maybe<Scalars['String']>;
  descriptionZhHant?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
};

export type Dimensions = {
  __typename?: 'Dimensions';
  height?: Maybe<Scalars['Float']>;
  id: Scalars['ID'];
  width?: Maybe<Scalars['Float']>;
};

export type DimensionsInput = {
  height?: InputMaybe<Scalars['Float']>;
  width?: InputMaybe<Scalars['Float']>;
};

export type FeeData = {
  __typename?: 'FeeData';
  buyFeeBps?: Maybe<Scalars['String']>;
  sellFeeBps?: Maybe<Scalars['String']>;
};

export enum HighLow {
  High = 'HIGH',
  Low = 'LOW'
}

/**   FIVE_MINUTE is only supported for TokenMarket.pricePercentChange */
export enum HistoryDuration {
  Day = 'DAY',
  FiveMinute = 'FIVE_MINUTE',
  Hour = 'HOUR',
  Max = 'MAX',
  Month = 'MONTH',
  Week = 'WEEK',
  Year = 'YEAR'
}

/**   Interfaces (alphabetized): */
export type IAmount = {
  currency?: Maybe<Currency>;
  value: Scalars['Float'];
};

export type IContract = {
  address?: Maybe<Scalars['String']>;
  chain: Chain;
};

export type IPool = {
  address: Scalars['String'];
  chain: Chain;
  createdAtTimestamp?: Maybe<Scalars['Int']>;
  cumulativeVolume?: Maybe<Amount>;
  historicalVolume?: Maybe<Array<Maybe<TimestampedAmount>>>;
  id: Scalars['ID'];
  priceHistory?: Maybe<Array<Maybe<TimestampedPoolPrice>>>;
  protocolVersion: ProtocolVersion;
  token0?: Maybe<Token>;
  token0Supply?: Maybe<Scalars['Float']>;
  token1?: Maybe<Token>;
  token1Supply?: Maybe<Scalars['Float']>;
  totalLiquidity?: Maybe<Amount>;
  totalLiquidityPercentChange24h?: Maybe<Amount>;
  transactions?: Maybe<Array<Maybe<PoolTransaction>>>;
  txCount?: Maybe<Scalars['Int']>;
};


export type IPoolCumulativeVolumeArgs = {
  duration: HistoryDuration;
};


export type IPoolHistoricalVolumeArgs = {
  duration: HistoryDuration;
};


export type IPoolPriceHistoryArgs = {
  duration: HistoryDuration;
};


export type IPoolTransactionsArgs = {
  first: Scalars['Int'];
  timestampCursor?: InputMaybe<Scalars['Int']>;
};

export type Image = {
  __typename?: 'Image';
  dimensions?: Maybe<Dimensions>;
  id: Scalars['ID'];
  url: Scalars['String'];
};

export type ImageInput = {
  dimensions?: InputMaybe<DimensionsInput>;
  url: Scalars['String'];
};

export enum MediaType {
  Audio = 'AUDIO',
  Image = 'IMAGE',
  Raw = 'RAW',
  Video = 'VIDEO'
}

export type Mutation = {
  __typename?: 'Mutation';
  assetActivity: AssetActivity;
  heartbeat: Status;
  unsubscribe: Status;
};


export type MutationAssetActivityArgs = {
  input: AssetActivityInput;
};


export type MutationHeartbeatArgs = {
  subscriptionId: Scalars['ID'];
  type: SubscriptionType;
};


export type MutationUnsubscribeArgs = {
  subscriptionId: Scalars['ID'];
  type: SubscriptionType;
};

export type NftActivity = {
  __typename?: 'NftActivity';
  address: Scalars['String'];
  asset?: Maybe<NftAsset>;
  fromAddress: Scalars['String'];
  id: Scalars['ID'];
  marketplace?: Maybe<Scalars['String']>;
  orderStatus?: Maybe<OrderStatus>;
  price?: Maybe<Amount>;
  quantity?: Maybe<Scalars['Int']>;
  timestamp: Scalars['Int'];
  toAddress?: Maybe<Scalars['String']>;
  tokenId?: Maybe<Scalars['String']>;
  transactionHash?: Maybe<Scalars['String']>;
  type: NftActivityType;
  url?: Maybe<Scalars['String']>;
};

export type NftActivityConnection = {
  __typename?: 'NftActivityConnection';
  edges: Array<NftActivityEdge>;
  pageInfo: PageInfo;
};

export type NftActivityEdge = {
  __typename?: 'NftActivityEdge';
  cursor: Scalars['String'];
  node: NftActivity;
};

export type NftActivityFilterInput = {
  activityTypes?: InputMaybe<Array<NftActivityType>>;
  address?: InputMaybe<Scalars['String']>;
  tokenId?: InputMaybe<Scalars['String']>;
};

export enum NftActivityType {
  CancelListing = 'CANCEL_LISTING',
  Listing = 'LISTING',
  Sale = 'SALE',
  Transfer = 'TRANSFER'
}

export type NftApproval = {
  __typename?: 'NftApproval';
  approvedAddress: Scalars['String'];
  /**   can be erc721, erc1155, noncompliant */
  asset: NftAsset;
  id: Scalars['ID'];
  nftStandard: NftStandard;
};

export type NftApprovalInput = {
  approvedAddress: Scalars['String'];
  asset: NftAssetInput;
  nftStandard: NftStandard;
};

export type NftApproveForAll = {
  __typename?: 'NftApproveForAll';
  approved: Scalars['Boolean'];
  /**   can be erc721, erc1155, noncompliant */
  asset: NftAsset;
  id: Scalars['ID'];
  nftStandard: NftStandard;
  operatorAddress: Scalars['String'];
};

export type NftApproveForAllInput = {
  approved: Scalars['Boolean'];
  asset: NftAssetInput;
  nftStandard: NftStandard;
  operatorAddress: Scalars['String'];
};

export type NftAsset = {
  __typename?: 'NftAsset';
  animationUrl?: Maybe<Scalars['String']>;
  collection?: Maybe<NftCollection>;
  creator?: Maybe<NftProfile>;
  description?: Maybe<Scalars['String']>;
  flaggedBy?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  image?: Maybe<Image>;
  /** @deprecated Field no longer supported */
  imageUrl?: Maybe<Scalars['String']>;
  isSpam?: Maybe<Scalars['Boolean']>;
  listings?: Maybe<NftOrderConnection>;
  mediaType?: Maybe<MediaType>;
  metadataUrl?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  nftContract?: Maybe<NftContract>;
  originalImage?: Maybe<Image>;
  /**   TODO: may need to be array to support erc1155 cases. not needed at the moment so will revisit. */
  ownerAddress?: Maybe<Scalars['String']>;
  rarities?: Maybe<Array<NftAssetRarity>>;
  smallImage?: Maybe<Image>;
  /** @deprecated Field no longer supported */
  smallImageUrl?: Maybe<Scalars['String']>;
  suspiciousFlag?: Maybe<Scalars['Boolean']>;
  thumbnail?: Maybe<Image>;
  /** @deprecated Field no longer supported */
  thumbnailUrl?: Maybe<Scalars['String']>;
  tokenId: Scalars['String'];
  traits?: Maybe<Array<NftAssetTrait>>;
};


export type NftAssetListingsArgs = {
  after?: InputMaybe<Scalars['String']>;
  asc?: InputMaybe<Scalars['Boolean']>;
  before?: InputMaybe<Scalars['String']>;
  chain?: InputMaybe<Chain>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};

export type NftAssetConnection = {
  __typename?: 'NftAssetConnection';
  edges: Array<NftAssetEdge>;
  pageInfo: PageInfo;
  totalCount?: Maybe<Scalars['Int']>;
};

export type NftAssetEdge = {
  __typename?: 'NftAssetEdge';
  cursor: Scalars['String'];
  node: NftAsset;
};

export type NftAssetInput = {
  animationUrl?: InputMaybe<Scalars['String']>;
  collection?: InputMaybe<NftCollectionInput>;
  description?: InputMaybe<Scalars['String']>;
  image?: InputMaybe<ImageInput>;
  isSpam?: InputMaybe<Scalars['Boolean']>;
  mediaType?: InputMaybe<MediaType>;
  name?: InputMaybe<Scalars['String']>;
  nftContract?: InputMaybe<NftContractInput>;
  smallImage?: InputMaybe<ImageInput>;
  thumbnail?: InputMaybe<ImageInput>;
  tokenId: Scalars['String'];
};

export type NftAssetRarity = {
  __typename?: 'NftAssetRarity';
  id: Scalars['ID'];
  provider?: Maybe<NftRarityProvider>;
  rank?: Maybe<Scalars['Int']>;
  score?: Maybe<Scalars['Float']>;
};

export enum NftAssetSortableField {
  Price = 'PRICE',
  Rarity = 'RARITY'
}

export type NftAssetTrait = {
  __typename?: 'NftAssetTrait';
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  rarity?: Maybe<Scalars['Float']>;
  value?: Maybe<Scalars['String']>;
};

export type NftAssetTraitInput = {
  name: Scalars['String'];
  values: Array<Scalars['String']>;
};

export type NftAssetsFilterInput = {
  listed?: InputMaybe<Scalars['Boolean']>;
  marketplaces?: InputMaybe<Array<NftMarketplace>>;
  maxPrice?: InputMaybe<Scalars['String']>;
  minPrice?: InputMaybe<Scalars['String']>;
  tokenIds?: InputMaybe<Array<Scalars['String']>>;
  tokenSearchQuery?: InputMaybe<Scalars['String']>;
  traits?: InputMaybe<Array<NftAssetTraitInput>>;
};

export type NftBalance = {
  __typename?: 'NftBalance';
  id: Scalars['ID'];
  lastPrice?: Maybe<TimestampedAmount>;
  listedMarketplaces?: Maybe<Array<NftMarketplace>>;
  listingFees?: Maybe<Array<Maybe<NftFee>>>;
  ownedAsset?: Maybe<NftAsset>;
  quantity?: Maybe<Scalars['Int']>;
};

export type NftBalanceAssetInput = {
  address: Scalars['String'];
  tokenId: Scalars['String'];
};

export type NftBalanceConnection = {
  __typename?: 'NftBalanceConnection';
  edges: Array<NftBalanceEdge>;
  pageInfo: PageInfo;
};

export type NftBalanceEdge = {
  __typename?: 'NftBalanceEdge';
  cursor: Scalars['String'];
  node: NftBalance;
};

export type NftBalancesFilterInput = {
  addresses?: InputMaybe<Array<Scalars['String']>>;
  assets?: InputMaybe<Array<NftBalanceAssetInput>>;
  filterSpam?: InputMaybe<Scalars['Boolean']>;
};

export type NftCollection = {
  __typename?: 'NftCollection';
  bannerImage?: Maybe<Image>;
  /**
   *  TODO: support querying for collection assets here
   * assets(page: Int, pageSize: Int, orderBy: NftAssetSortableField): [NftAsset]
   * @deprecated Field no longer supported
   */
  bannerImageUrl?: Maybe<Scalars['String']>;
  collectionId: Scalars['String'];
  creator?: Maybe<NftProfile>;
  description?: Maybe<Scalars['String']>;
  discordUrl?: Maybe<Scalars['String']>;
  homepageUrl?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  image?: Maybe<Image>;
  /** @deprecated Field no longer supported */
  imageUrl?: Maybe<Scalars['String']>;
  instagramName?: Maybe<Scalars['String']>;
  isVerified?: Maybe<Scalars['Boolean']>;
  markets?: Maybe<Array<NftCollectionMarket>>;
  name?: Maybe<Scalars['String']>;
  nftContracts?: Maybe<Array<NftContract>>;
  numAssets?: Maybe<Scalars['Int']>;
  /** @deprecated Field no longer supported */
  openseaUrl?: Maybe<Scalars['String']>;
  traits?: Maybe<Array<NftCollectionTrait>>;
  twitterName?: Maybe<Scalars['String']>;
};


export type NftCollectionMarketsArgs = {
  currencies: Array<Currency>;
};

export type NftCollectionBalance = {
  __typename?: 'NftCollectionBalance';
  address: Scalars['String'];
  balance: Scalars['Float'];
  id: Scalars['ID'];
  logoImage?: Maybe<Image>;
  name: Scalars['String'];
};

export type NftCollectionBalanceConnection = {
  __typename?: 'NftCollectionBalanceConnection';
  edges: Array<NftCollectionBalanceEdge>;
  pageInfo: PageInfo;
};

export type NftCollectionBalanceEdge = {
  __typename?: 'NftCollectionBalanceEdge';
  cursor: Scalars['String'];
  node: NftCollectionBalance;
};

export type NftCollectionConnection = {
  __typename?: 'NftCollectionConnection';
  edges: Array<NftCollectionEdge>;
  pageInfo: PageInfo;
};

export type NftCollectionEdge = {
  __typename?: 'NftCollectionEdge';
  cursor: Scalars['String'];
  node: NftCollection;
};

export type NftCollectionInput = {
  collectionId: Scalars['String'];
  name?: InputMaybe<Scalars['String']>;
  nftContracts?: InputMaybe<Array<NftContractInput>>;
};

export type NftCollectionMarket = {
  __typename?: 'NftCollectionMarket';
  floorPrice?: Maybe<TimestampedAmount>;
  floorPricePercentChange?: Maybe<TimestampedAmount>;
  id: Scalars['ID'];
  listings?: Maybe<TimestampedAmount>;
  marketplaces?: Maybe<Array<NftCollectionMarketplace>>;
  nftContracts?: Maybe<Array<NftContract>>;
  owners?: Maybe<Scalars['Int']>;
  percentListed?: Maybe<TimestampedAmount>;
  percentUniqueOwners?: Maybe<TimestampedAmount>;
  sales?: Maybe<TimestampedAmount>;
  totalVolume?: Maybe<TimestampedAmount>;
  volume?: Maybe<TimestampedAmount>;
  /** @deprecated Field no longer supported */
  volume24h?: Maybe<Amount>;
  volumePercentChange?: Maybe<TimestampedAmount>;
};


export type NftCollectionMarketFloorPricePercentChangeArgs = {
  duration?: InputMaybe<HistoryDuration>;
};


export type NftCollectionMarketMarketplacesArgs = {
  marketplaces?: InputMaybe<Array<NftMarketplace>>;
};


export type NftCollectionMarketSalesArgs = {
  duration?: InputMaybe<HistoryDuration>;
};


export type NftCollectionMarketVolumeArgs = {
  duration?: InputMaybe<HistoryDuration>;
};


export type NftCollectionMarketVolumePercentChangeArgs = {
  duration?: InputMaybe<HistoryDuration>;
};

export type NftCollectionMarketplace = {
  __typename?: 'NftCollectionMarketplace';
  floorPrice?: Maybe<Scalars['Float']>;
  id: Scalars['ID'];
  listings?: Maybe<Scalars['Int']>;
  marketplace?: Maybe<NftMarketplace>;
};

export type NftCollectionTrait = {
  __typename?: 'NftCollectionTrait';
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  stats?: Maybe<Array<NftCollectionTraitStats>>;
  values?: Maybe<Array<Scalars['String']>>;
};

export type NftCollectionTraitStats = {
  __typename?: 'NftCollectionTraitStats';
  assets?: Maybe<Scalars['Int']>;
  id: Scalars['ID'];
  listings?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type NftCollectionsFilterInput = {
  addresses?: InputMaybe<Array<Scalars['String']>>;
  nameQuery?: InputMaybe<Scalars['String']>;
};

export type NftContract = IContract & {
  __typename?: 'NftContract';
  address: Scalars['String'];
  chain: Chain;
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  standard?: Maybe<NftStandard>;
  symbol?: Maybe<Scalars['String']>;
  totalSupply?: Maybe<Scalars['Int']>;
};

export type NftContractInput = {
  address: Scalars['String'];
  chain: Chain;
  name?: InputMaybe<Scalars['String']>;
  standard?: InputMaybe<NftStandard>;
  symbol?: InputMaybe<Scalars['String']>;
  totalSupply?: InputMaybe<Scalars['Int']>;
};

export type NftFee = {
  __typename?: 'NftFee';
  basisPoints: Scalars['Int'];
  id: Scalars['ID'];
  payoutAddress: Scalars['String'];
};

export enum NftMarketplace {
  Cryptopunks = 'CRYPTOPUNKS',
  Foundation = 'FOUNDATION',
  Looksrare = 'LOOKSRARE',
  Nft20 = 'NFT20',
  Nftx = 'NFTX',
  Opensea = 'OPENSEA',
  Sudoswap = 'SUDOSWAP',
  X2Y2 = 'X2Y2'
}

export type NftOrder = {
  __typename?: 'NftOrder';
  address: Scalars['String'];
  auctionType?: Maybe<Scalars['String']>;
  createdAt: Scalars['Float'];
  endAt?: Maybe<Scalars['Float']>;
  id: Scalars['ID'];
  maker: Scalars['String'];
  marketplace: NftMarketplace;
  marketplaceUrl: Scalars['String'];
  orderHash?: Maybe<Scalars['String']>;
  poolPrices?: Maybe<Array<Scalars['String']>>;
  price: Amount;
  protocolParameters?: Maybe<Scalars['AWSJSON']>;
  quantity: Scalars['Int'];
  startAt: Scalars['Float'];
  status: OrderStatus;
  taker?: Maybe<Scalars['String']>;
  tokenId?: Maybe<Scalars['String']>;
  type: OrderType;
};

export type NftOrderConnection = {
  __typename?: 'NftOrderConnection';
  edges: Array<NftOrderEdge>;
  pageInfo: PageInfo;
};

export type NftOrderEdge = {
  __typename?: 'NftOrderEdge';
  cursor: Scalars['String'];
  node: NftOrder;
};

export type NftProfile = {
  __typename?: 'NftProfile';
  address: Scalars['String'];
  id: Scalars['ID'];
  isVerified?: Maybe<Scalars['Boolean']>;
  profileImage?: Maybe<Image>;
  username?: Maybe<Scalars['String']>;
};

export enum NftRarityProvider {
  RaritySniper = 'RARITY_SNIPER'
}

export type NftRouteResponse = {
  __typename?: 'NftRouteResponse';
  calldata: Scalars['String'];
  id: Scalars['ID'];
  route?: Maybe<Array<NftTrade>>;
  sendAmount: TokenAmount;
  toAddress: Scalars['String'];
};

export enum NftStandard {
  Erc721 = 'ERC721',
  Erc1155 = 'ERC1155',
  Noncompliant = 'NONCOMPLIANT'
}

export type NftTrade = {
  __typename?: 'NftTrade';
  amount: Scalars['Int'];
  contractAddress: Scalars['String'];
  id: Scalars['ID'];
  marketplace: NftMarketplace;
  /**   price represents the current price of the NFT, which can be different from quotePrice */
  price: TokenAmount;
  /**   quotePrice represents the last quoted price of the NFT */
  quotePrice?: Maybe<TokenAmount>;
  tokenId: Scalars['String'];
  tokenType?: Maybe<NftStandard>;
};

export type NftTradeInput = {
  amount: Scalars['Int'];
  contractAddress: Scalars['String'];
  id: Scalars['ID'];
  marketplace: NftMarketplace;
  quotePrice?: InputMaybe<TokenAmountInput>;
  tokenId: Scalars['String'];
  tokenType?: InputMaybe<NftStandard>;
};

export type NftTransfer = {
  __typename?: 'NftTransfer';
  asset: NftAsset;
  direction: TransactionDirection;
  id: Scalars['ID'];
  nftStandard: NftStandard;
  recipient: Scalars['String'];
  sender: Scalars['String'];
};

export type NftTransferInput = {
  asset: NftAssetInput;
  direction: TransactionDirection;
  nftStandard: NftStandard;
  recipient: Scalars['String'];
  sender: Scalars['String'];
};

export enum OrderStatus {
  Cancelled = 'CANCELLED',
  Executed = 'EXECUTED',
  Expired = 'EXPIRED',
  Valid = 'VALID'
}

export enum OrderType {
  Listing = 'LISTING',
  Offer = 'OFFER'
}

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']>;
  hasNextPage?: Maybe<Scalars['Boolean']>;
  hasPreviousPage?: Maybe<Scalars['Boolean']>;
  startCursor?: Maybe<Scalars['String']>;
};

/**   v2 pool parameters as defined by https://github.com/Uniswap/v2-sdk/blob/main/src/entities/pair.ts */
export type PairInput = {
  tokenAmountA: TokenAmountInput;
  tokenAmountB: TokenAmountInput;
};

export type PermitDetailsInput = {
  amount: Scalars['String'];
  expiration: Scalars['String'];
  nonce: Scalars['String'];
  token: Scalars['String'];
};

export type PermitInput = {
  details: PermitDetailsInput;
  sigDeadline: Scalars['String'];
  signature: Scalars['String'];
  spender: Scalars['String'];
};

/**   v3 pool parameters as defined by https://github.com/Uniswap/v3-sdk/blob/main/src/entities/pool.ts */
export type PoolInput = {
  fee: Scalars['Int'];
  liquidity: Scalars['String'];
  sqrtRatioX96: Scalars['String'];
  tickCurrent: Scalars['String'];
  tokenA: TokenInput;
  tokenB: TokenInput;
};

export type PoolTransaction = {
  __typename?: 'PoolTransaction';
  account: Scalars['String'];
  chain: Chain;
  hash: Scalars['String'];
  id: Scalars['ID'];
  protocolVersion: ProtocolVersion;
  timestamp: Scalars['Int'];
  token0: Token;
  token0Quantity: Scalars['String'];
  token1: Token;
  token1Quantity: Scalars['String'];
  type: PoolTransactionType;
  usdValue: Amount;
};

export enum PoolTransactionType {
  Add = 'ADD',
  Remove = 'REMOVE',
  Swap = 'SWAP'
}

export type Portfolio = {
  __typename?: 'Portfolio';
  assetActivities?: Maybe<Array<Maybe<AssetActivity>>>;
  id: Scalars['ID'];
  /**   TODO: (michael.zhang) replace with paginated query */
  nftBalances?: Maybe<Array<Maybe<NftBalance>>>;
  ownerAddress: Scalars['String'];
  tokenBalances?: Maybe<Array<Maybe<TokenBalance>>>;
  tokensTotalDenominatedValue?: Maybe<Amount>;
  tokensTotalDenominatedValueChange?: Maybe<AmountChange>;
};


export type PortfolioAssetActivitiesArgs = {
  _fs?: InputMaybe<AssetActivitySwitch>;
  chains?: InputMaybe<Array<Chain>>;
  includeOffChain?: InputMaybe<Scalars['Boolean']>;
  page?: InputMaybe<Scalars['Int']>;
  pageSize?: InputMaybe<Scalars['Int']>;
};


export type PortfolioTokensTotalDenominatedValueChangeArgs = {
  duration?: InputMaybe<HistoryDuration>;
};

/**   Specify how the portfolio value should be calculated for each `ownerAddress`. */
export type PortfolioValueModifier = {
  includeSmallBalances?: InputMaybe<Scalars['Boolean']>;
  includeSpamTokens?: InputMaybe<Scalars['Boolean']>;
  ownerAddress: Scalars['String'];
  tokenExcludeOverrides?: InputMaybe<Array<ContractInput>>;
  tokenIncludeOverrides?: InputMaybe<Array<ContractInput>>;
};

export enum PriceSource {
  SubgraphV2 = 'SUBGRAPH_V2',
  SubgraphV3 = 'SUBGRAPH_V3'
}

export enum ProtocolVersion {
  V2 = 'V2',
  V3 = 'V3'
}

export type PushNotification = {
  __typename?: 'PushNotification';
  contents: Scalars['AWSJSON'];
  id: Scalars['ID'];
  notifyAddress: Scalars['String'];
  signerHeader: Scalars['AWSJSON'];
  viewerHeader: Scalars['AWSJSON'];
};

export type Query = {
  __typename?: 'Query';
  convert?: Maybe<Amount>;
  dailyProtocolTvl?: Maybe<Array<TimestampedAmount>>;
  historicalProtocolVolume?: Maybe<Array<TimestampedAmount>>;
  nftActivity?: Maybe<NftActivityConnection>;
  nftAssets?: Maybe<NftAssetConnection>;
  nftBalances?: Maybe<NftBalanceConnection>;
  nftCollectionBalances?: Maybe<NftCollectionBalanceConnection>;
  nftCollections?: Maybe<NftCollectionConnection>;
  nftRoute?: Maybe<NftRouteResponse>;
  portfolios?: Maybe<Array<Maybe<Portfolio>>>;
  searchTokens?: Maybe<Array<Maybe<Token>>>;
  /**
   *  token consumes chain and address instead of contract because the apollo client request cache can only use
   * keys from the response, and the token response does not contain a contract, but does contain an unwrapped
   * contract: chain and address.
   */
  token?: Maybe<Token>;
  tokenProjects?: Maybe<Array<Maybe<TokenProject>>>;
  tokens?: Maybe<Array<Maybe<Token>>>;
  topCollections?: Maybe<NftCollectionConnection>;
  topTokens?: Maybe<Array<Maybe<Token>>>;
  /**   returns top v2 pairs sorted by total value locked in desc order */
  topV2Pairs?: Maybe<Array<V2Pair>>;
  /**   returns top v3 pools sorted by total value locked in desc order */
  topV3Pools?: Maybe<Array<V3Pool>>;
  transactionNotification?: Maybe<TransactionNotification>;
  v2Pair?: Maybe<V2Pair>;
  v2Transactions?: Maybe<Array<Maybe<PoolTransaction>>>;
  v3Pool?: Maybe<V3Pool>;
  v3Transactions?: Maybe<Array<PoolTransaction>>;
};


export type QueryConvertArgs = {
  fromAmount: CurrencyAmountInput;
  toCurrency: Currency;
};


export type QueryDailyProtocolTvlArgs = {
  chain: Chain;
  version: ProtocolVersion;
};


export type QueryHistoricalProtocolVolumeArgs = {
  chain: Chain;
  duration: HistoryDuration;
  version: ProtocolVersion;
};


export type QueryNftActivityArgs = {
  after?: InputMaybe<Scalars['String']>;
  chain?: InputMaybe<Chain>;
  filter?: InputMaybe<NftActivityFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
};


export type QueryNftAssetsArgs = {
  address: Scalars['String'];
  after?: InputMaybe<Scalars['String']>;
  asc?: InputMaybe<Scalars['Boolean']>;
  before?: InputMaybe<Scalars['String']>;
  chain?: InputMaybe<Chain>;
  filter?: InputMaybe<NftAssetsFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<NftAssetSortableField>;
};


export type QueryNftBalancesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  chain?: InputMaybe<Chain>;
  filter?: InputMaybe<NftBalancesFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  ownerAddress: Scalars['String'];
};


export type QueryNftCollectionBalancesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  chain?: InputMaybe<Chain>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  ownerAddress: Scalars['String'];
};


export type QueryNftCollectionsArgs = {
  after?: InputMaybe<Scalars['String']>;
  chain?: InputMaybe<Chain>;
  filter?: InputMaybe<NftCollectionsFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
};


export type QueryNftRouteArgs = {
  chain?: InputMaybe<Chain>;
  nftTrades: Array<NftTradeInput>;
  senderAddress: Scalars['String'];
  tokenTrades?: InputMaybe<Array<TokenTradeInput>>;
};


export type QueryPortfoliosArgs = {
  chains?: InputMaybe<Array<Chain>>;
  lookupTokens?: InputMaybe<Array<ContractInput>>;
  ownerAddresses: Array<Scalars['String']>;
  valueModifiers?: InputMaybe<Array<PortfolioValueModifier>>;
};


export type QuerySearchTokensArgs = {
  chains?: InputMaybe<Array<Chain>>;
  searchQuery: Scalars['String'];
};


export type QueryTokenArgs = {
  address?: InputMaybe<Scalars['String']>;
  chain: Chain;
};


export type QueryTokenProjectsArgs = {
  contracts: Array<ContractInput>;
};


export type QueryTokensArgs = {
  contracts: Array<ContractInput>;
};


export type QueryTopCollectionsArgs = {
  after?: InputMaybe<Scalars['String']>;
  chains?: InputMaybe<Array<Chain>>;
  cursor?: InputMaybe<Scalars['String']>;
  duration?: InputMaybe<HistoryDuration>;
  first?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<CollectionSortableField>;
};


export type QueryTopTokensArgs = {
  chain?: InputMaybe<Chain>;
  orderBy?: InputMaybe<TokenSortableField>;
  page?: InputMaybe<Scalars['Int']>;
  pageSize?: InputMaybe<Scalars['Int']>;
};


export type QueryTopV2PairsArgs = {
  chain: Chain;
  first: Scalars['Int'];
  tokenFilter?: InputMaybe<Scalars['String']>;
  tvlCursor?: InputMaybe<Scalars['Float']>;
};


export type QueryTopV3PoolsArgs = {
  chain: Chain;
  first: Scalars['Int'];
  tokenFilter?: InputMaybe<Scalars['String']>;
  tvlCursor?: InputMaybe<Scalars['Float']>;
};


export type QueryTransactionNotificationArgs = {
  address: Scalars['String'];
  chain: Chain;
  transactionHash: Scalars['String'];
};


export type QueryV2PairArgs = {
  address: Scalars['String'];
  chain: Chain;
};


export type QueryV2TransactionsArgs = {
  chain: Chain;
  first: Scalars['Int'];
  timestampCursor?: InputMaybe<Scalars['Int']>;
};


export type QueryV3PoolArgs = {
  address: Scalars['String'];
  chain: Chain;
};


export type QueryV3TransactionsArgs = {
  chain: Chain;
  first: Scalars['Int'];
  timestampCursor?: InputMaybe<Scalars['Int']>;
};

export enum SafetyLevel {
  Blocked = 'BLOCKED',
  MediumWarning = 'MEDIUM_WARNING',
  StrongWarning = 'STRONG_WARNING',
  Verified = 'VERIFIED'
}

export type Status = {
  __typename?: 'Status';
  success: Scalars['Boolean'];
};

export type Subscription = {
  __typename?: 'Subscription';
  onAssetActivity?: Maybe<AssetActivity>;
};


export type SubscriptionOnAssetActivityArgs = {
  addresses: Array<Scalars['String']>;
  subscriptionId: Scalars['ID'];
};

export enum SubscriptionType {
  AssetActivity = 'ASSET_ACTIVITY'
}

export type SwapOrderDetails = {
  __typename?: 'SwapOrderDetails';
  encodedOrder: Scalars['String'];
  expiry: Scalars['Int'];
  hash: Scalars['String'];
  id: Scalars['ID'];
  inputToken: Token;
  inputTokenQuantity: Scalars['String'];
  offerer: Scalars['String'];
  outputToken: Token;
  outputTokenQuantity: Scalars['String'];
  /** @deprecated use swapOrderStatus to disambiguate from transactionStatus */
  status: SwapOrderStatus;
  swapOrderStatus: SwapOrderStatus;
  swapOrderType: SwapOrderType;
};

export type SwapOrderDetailsInput = {
  encodedOrder: Scalars['String'];
  expiry: Scalars['Int'];
  hash: Scalars['String'];
  inputAmount: Scalars['String'];
  inputToken: TokenAssetInput;
  offerer: Scalars['String'];
  outputAmount: Scalars['String'];
  outputToken: TokenAssetInput;
  status?: InputMaybe<SwapOrderStatus>;
  swapOrderStatus: SwapOrderStatus;
  swapOrderType: SwapOrderType;
};

export enum SwapOrderStatus {
  Cancelled = 'CANCELLED',
  Error = 'ERROR',
  Expired = 'EXPIRED',
  Filled = 'FILLED',
  InsufficientFunds = 'INSUFFICIENT_FUNDS',
  Open = 'OPEN'
}

export enum SwapOrderType {
  Dutch = 'DUTCH',
  DutchV2 = 'DUTCH_V2',
  Limit = 'LIMIT'
}

export type TimestampedAmount = IAmount & {
  __typename?: 'TimestampedAmount';
  currency?: Maybe<Currency>;
  id: Scalars['ID'];
  timestamp: Scalars['Int'];
  value: Scalars['Float'];
};

export type TimestampedOhlc = {
  __typename?: 'TimestampedOhlc';
  close: Amount;
  high: Amount;
  id: Scalars['ID'];
  low: Amount;
  open: Amount;
  timestamp: Scalars['Int'];
};

export type TimestampedPoolPrice = {
  __typename?: 'TimestampedPoolPrice';
  id: Scalars['ID'];
  timestamp: Scalars['Int'];
  token0Price: Scalars['Float'];
  token1Price: Scalars['Float'];
};

export type Token = IContract & {
  __typename?: 'Token';
  address?: Maybe<Scalars['String']>;
  chain: Chain;
  decimals?: Maybe<Scalars['Int']>;
  feeData?: Maybe<FeeData>;
  id: Scalars['ID'];
  market?: Maybe<TokenMarket>;
  name?: Maybe<Scalars['String']>;
  project?: Maybe<TokenProject>;
  standard?: Maybe<TokenStandard>;
  symbol?: Maybe<Scalars['String']>;
  v2Transactions?: Maybe<Array<Maybe<PoolTransaction>>>;
  v3Transactions?: Maybe<Array<Maybe<PoolTransaction>>>;
};


export type TokenMarketArgs = {
  currency?: InputMaybe<Currency>;
};


export type TokenV2TransactionsArgs = {
  first: Scalars['Int'];
  timestampCursor?: InputMaybe<Scalars['Int']>;
};


export type TokenV3TransactionsArgs = {
  first: Scalars['Int'];
  timestampCursor?: InputMaybe<Scalars['Int']>;
};

export type TokenAmount = {
  __typename?: 'TokenAmount';
  currency: Currency;
  id: Scalars['ID'];
  value: Scalars['String'];
};

export type TokenAmountInput = {
  amount: Scalars['String'];
  token: TokenInput;
};

export type TokenApproval = {
  __typename?: 'TokenApproval';
  approvedAddress: Scalars['String'];
  /**   can be erc20 or native */
  asset: Token;
  id: Scalars['ID'];
  quantity: Scalars['String'];
  tokenStandard: TokenStandard;
};

export type TokenApprovalInput = {
  approvedAddress: Scalars['String'];
  asset: TokenAssetInput;
  quantity: Scalars['String'];
  tokenStandard: TokenStandard;
};

export type TokenAssetInput = {
  address?: InputMaybe<Scalars['String']>;
  chain: Chain;
  decimals?: InputMaybe<Scalars['Int']>;
  name?: InputMaybe<Scalars['String']>;
  standard: TokenStandard;
  symbol?: InputMaybe<Scalars['String']>;
};

export type TokenBalance = {
  __typename?: 'TokenBalance';
  blockNumber?: Maybe<Scalars['Int']>;
  blockTimestamp?: Maybe<Scalars['Int']>;
  denominatedValue?: Maybe<Amount>;
  id: Scalars['ID'];
  isHidden?: Maybe<Scalars['Boolean']>;
  ownerAddress: Scalars['String'];
  quantity?: Maybe<Scalars['Float']>;
  token?: Maybe<Token>;
  tokenProjectMarket?: Maybe<TokenProjectMarket>;
};

export type TokenInput = {
  address: Scalars['String'];
  chainId: Scalars['Int'];
  decimals: Scalars['Int'];
  isNative: Scalars['Boolean'];
};

export type TokenMarket = {
  __typename?: 'TokenMarket';
  fullyDilutedValuation?: Maybe<Amount>;
  historicalTvl?: Maybe<Array<Maybe<TimestampedAmount>>>;
  historicalVolume?: Maybe<Array<Maybe<TimestampedAmount>>>;
  id: Scalars['ID'];
  ohlc?: Maybe<Array<Maybe<TimestampedOhlc>>>;
  price?: Maybe<Amount>;
  priceHighLow?: Maybe<Amount>;
  priceHistory?: Maybe<Array<Maybe<TimestampedAmount>>>;
  pricePercentChange?: Maybe<Amount>;
  priceSource: PriceSource;
  token: Token;
  totalValueLocked?: Maybe<Amount>;
  /**   this volume is cumulative volume over the specified duration */
  volume?: Maybe<Amount>;
};


export type TokenMarketHistoricalTvlArgs = {
  duration: HistoryDuration;
};


export type TokenMarketHistoricalVolumeArgs = {
  duration: HistoryDuration;
};


export type TokenMarketOhlcArgs = {
  duration: HistoryDuration;
};


export type TokenMarketPriceHighLowArgs = {
  duration: HistoryDuration;
  highLow: HighLow;
};


export type TokenMarketPriceHistoryArgs = {
  duration: HistoryDuration;
};


export type TokenMarketPricePercentChangeArgs = {
  duration: HistoryDuration;
};


export type TokenMarketVolumeArgs = {
  duration: HistoryDuration;
};

export type TokenProject = {
  __typename?: 'TokenProject';
  description?: Maybe<Scalars['String']>;
  descriptionTranslations?: Maybe<DescriptionTranslations>;
  homepageUrl?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  isSpam?: Maybe<Scalars['Boolean']>;
  logo?: Maybe<Image>;
  /** @deprecated use logo */
  logoUrl?: Maybe<Scalars['String']>;
  markets?: Maybe<Array<Maybe<TokenProjectMarket>>>;
  name?: Maybe<Scalars['String']>;
  safetyLevel?: Maybe<SafetyLevel>;
  /** @deprecated use logo */
  smallLogo?: Maybe<Image>;
  spamCode?: Maybe<Scalars['Int']>;
  tokens: Array<Token>;
  twitterName?: Maybe<Scalars['String']>;
};


export type TokenProjectMarketsArgs = {
  currencies: Array<Currency>;
};

export type TokenProjectMarket = {
  __typename?: 'TokenProjectMarket';
  currency: Currency;
  fullyDilutedValuation?: Maybe<Amount>;
  id: Scalars['ID'];
  marketCap?: Maybe<Amount>;
  price?: Maybe<Amount>;
  priceHigh52w?: Maybe<Amount>;
  priceHighLow?: Maybe<Amount>;
  priceHistory?: Maybe<Array<Maybe<TimestampedAmount>>>;
  priceLow52w?: Maybe<Amount>;
  pricePercentChange?: Maybe<Amount>;
  pricePercentChange24h?: Maybe<Amount>;
  tokenProject: TokenProject;
};


export type TokenProjectMarketPriceHighLowArgs = {
  duration: HistoryDuration;
  highLow: HighLow;
};


export type TokenProjectMarketPriceHistoryArgs = {
  duration: HistoryDuration;
};


export type TokenProjectMarketPricePercentChangeArgs = {
  duration: HistoryDuration;
};

export enum TokenSortableField {
  MarketCap = 'MARKET_CAP',
  Popularity = 'POPULARITY',
  TotalValueLocked = 'TOTAL_VALUE_LOCKED',
  Volume = 'VOLUME'
}

export enum TokenStandard {
  Erc20 = 'ERC20',
  Native = 'NATIVE'
}

export type TokenTradeInput = {
  permit?: InputMaybe<PermitInput>;
  routes?: InputMaybe<TokenTradeRoutesInput>;
  slippageToleranceBasisPoints?: InputMaybe<Scalars['Int']>;
  tokenAmount: TokenAmountInput;
};

export type TokenTradeRouteInput = {
  inputAmount: TokenAmountInput;
  outputAmount: TokenAmountInput;
  pools: Array<TradePoolInput>;
};

export type TokenTradeRoutesInput = {
  mixedRoutes?: InputMaybe<Array<TokenTradeRouteInput>>;
  tradeType: TokenTradeType;
  v2Routes?: InputMaybe<Array<TokenTradeRouteInput>>;
  v3Routes?: InputMaybe<Array<TokenTradeRouteInput>>;
};

export enum TokenTradeType {
  ExactInput = 'EXACT_INPUT',
  ExactOutput = 'EXACT_OUTPUT'
}

export type TokenTransfer = {
  __typename?: 'TokenTransfer';
  asset: Token;
  direction: TransactionDirection;
  id: Scalars['ID'];
  quantity: Scalars['String'];
  recipient: Scalars['String'];
  sender: Scalars['String'];
  tokenStandard: TokenStandard;
  transactedValue?: Maybe<Amount>;
};

export type TokenTransferInput = {
  asset: TokenAssetInput;
  direction: TransactionDirection;
  quantity: Scalars['String'];
  recipient: Scalars['String'];
  sender: Scalars['String'];
  tokenStandard: TokenStandard;
  transactedValue?: InputMaybe<AmountInput>;
};

export type TradePoolInput = {
  pair?: InputMaybe<PairInput>;
  pool?: InputMaybe<PoolInput>;
};

export type Transaction = {
  __typename?: 'Transaction';
  blockNumber: Scalars['Int'];
  from: Scalars['String'];
  gasLimit?: Maybe<Scalars['Float']>;
  hash: Scalars['String'];
  id: Scalars['ID'];
  maxFeePerGas?: Maybe<Scalars['Float']>;
  nonce: Scalars['Int'];
  status: TransactionStatus;
  to: Scalars['String'];
};

export type TransactionDetails = {
  __typename?: 'TransactionDetails';
  application?: Maybe<ApplicationContract>;
  assetChanges: Array<Maybe<AssetChange>>;
  from: Scalars['String'];
  hash: Scalars['String'];
  id: Scalars['ID'];
  nonce: Scalars['Int'];
  /** @deprecated use transactionStatus to disambiguate from swapOrderStatus */
  status: TransactionStatus;
  to: Scalars['String'];
  transactionStatus: TransactionStatus;
  type: TransactionType;
};

export type TransactionDetailsInput = {
  application?: InputMaybe<ApplicationContractInput>;
  assetChanges: Array<InputMaybe<AssetChangeInput>>;
  from: Scalars['String'];
  hash: Scalars['String'];
  nonce: Scalars['Int'];
  status?: InputMaybe<TransactionStatus>;
  to: Scalars['String'];
  transactionStatus: TransactionStatus;
  type: TransactionType;
};

export enum TransactionDirection {
  In = 'IN',
  Out = 'OUT',
  Self = 'SELF'
}

export type TransactionNotification = {
  __typename?: 'TransactionNotification';
  hash: Scalars['String'];
  id: Scalars['ID'];
  push: Array<PushNotification>;
};

export enum TransactionStatus {
  Confirmed = 'CONFIRMED',
  Failed = 'FAILED',
  Pending = 'PENDING'
}

export enum TransactionType {
  Approve = 'APPROVE',
  Borrow = 'BORROW',
  Cancel = 'CANCEL',
  Claim = 'CLAIM',
  Deployment = 'DEPLOYMENT',
  Lend = 'LEND',
  Mint = 'MINT',
  Receive = 'RECEIVE',
  Repay = 'REPAY',
  Send = 'SEND',
  Stake = 'STAKE',
  Swap = 'SWAP',
  SwapOrder = 'SWAP_ORDER',
  Unknown = 'UNKNOWN',
  Unstake = 'UNSTAKE',
  Withdraw = 'WITHDRAW'
}

export type V2Pair = IPool & {
  __typename?: 'V2Pair';
  address: Scalars['String'];
  chain: Chain;
  createdAtTimestamp?: Maybe<Scalars['Int']>;
  cumulativeVolume?: Maybe<Amount>;
  historicalVolume?: Maybe<Array<Maybe<TimestampedAmount>>>;
  id: Scalars['ID'];
  priceHistory?: Maybe<Array<Maybe<TimestampedPoolPrice>>>;
  protocolVersion: ProtocolVersion;
  token0?: Maybe<Token>;
  token0Supply?: Maybe<Scalars['Float']>;
  token1?: Maybe<Token>;
  token1Supply?: Maybe<Scalars['Float']>;
  totalLiquidity?: Maybe<Amount>;
  totalLiquidityPercentChange24h?: Maybe<Amount>;
  transactions?: Maybe<Array<Maybe<PoolTransaction>>>;
  txCount?: Maybe<Scalars['Int']>;
};


export type V2PairCumulativeVolumeArgs = {
  duration: HistoryDuration;
};


export type V2PairHistoricalVolumeArgs = {
  duration: HistoryDuration;
};


export type V2PairPriceHistoryArgs = {
  duration: HistoryDuration;
};


export type V2PairTransactionsArgs = {
  first: Scalars['Int'];
  timestampCursor?: InputMaybe<Scalars['Int']>;
};

export type V3Pool = IPool & {
  __typename?: 'V3Pool';
  address: Scalars['String'];
  chain: Chain;
  createdAtTimestamp?: Maybe<Scalars['Int']>;
  cumulativeVolume?: Maybe<Amount>;
  feeTier?: Maybe<Scalars['Float']>;
  historicalVolume?: Maybe<Array<Maybe<TimestampedAmount>>>;
  id: Scalars['ID'];
  priceHistory?: Maybe<Array<Maybe<TimestampedPoolPrice>>>;
  protocolVersion: ProtocolVersion;
  ticks?: Maybe<Array<Maybe<V3PoolTick>>>;
  token0?: Maybe<Token>;
  token0Supply?: Maybe<Scalars['Float']>;
  token1?: Maybe<Token>;
  token1Supply?: Maybe<Scalars['Float']>;
  totalLiquidity?: Maybe<Amount>;
  totalLiquidityPercentChange24h?: Maybe<Amount>;
  transactions?: Maybe<Array<Maybe<PoolTransaction>>>;
  txCount?: Maybe<Scalars['Int']>;
};


export type V3PoolCumulativeVolumeArgs = {
  duration: HistoryDuration;
};


export type V3PoolHistoricalVolumeArgs = {
  duration: HistoryDuration;
};


export type V3PoolPriceHistoryArgs = {
  duration: HistoryDuration;
};


export type V3PoolTicksArgs = {
  first: Scalars['Int'];
  tickIdxCursor?: InputMaybe<Scalars['Int']>;
};


export type V3PoolTransactionsArgs = {
  first: Scalars['Int'];
  timestampCursor?: InputMaybe<Scalars['Int']>;
};

export type V3PoolTick = {
  __typename?: 'V3PoolTick';
  id: Scalars['ID'];
  liquidityGross?: Maybe<Scalars['String']>;
  liquidityNet?: Maybe<Scalars['String']>;
  tickIdx?: Maybe<Scalars['Int']>;
};

export type NftsQueryVariables = Exact<{
  ownerAddress: Scalars['String'];
}>;


export type NftsQuery = { __typename?: 'Query', portfolios?: Array<{ __typename?: 'Portfolio', id: string, nftBalances?: Array<{ __typename?: 'NftBalance', id: string, ownedAsset?: { __typename?: 'NftAsset', id: string, description?: string | undefined, name?: string | undefined, tokenId: string, collection?: { __typename?: 'NftCollection', id: string, collectionId: string, description?: string | undefined, isVerified?: boolean | undefined, name?: string | undefined, numAssets?: number | undefined, image?: { __typename?: 'Image', id: string, url: string } | undefined, markets?: Array<{ __typename?: 'NftCollectionMarket', id: string, owners?: number | undefined, floorPrice?: { __typename?: 'TimestampedAmount', value: number } | undefined, volume24h?: { __typename?: 'Amount', value: number } | undefined, totalVolume?: { __typename?: 'TimestampedAmount', value: number } | undefined }> | undefined } | undefined, image?: { __typename?: 'Image', id: string, url: string } | undefined, nftContract?: { __typename?: 'NftContract', id: string, address: string, chain: Chain, standard?: NftStandard | undefined } | undefined, thumbnail?: { __typename?: 'Image', id: string, url: string } | undefined, creator?: { __typename?: 'NftProfile', id: string, address: string, username?: string | undefined } | undefined } | undefined } | undefined> | undefined } | undefined> | undefined };

export type NftItemScreenQueryVariables = Exact<{
  contractAddress: Scalars['String'];
  filter?: InputMaybe<NftAssetsFilterInput>;
  activityFilter?: InputMaybe<NftActivityFilterInput>;
}>;


export type NftItemScreenQuery = { __typename?: 'Query', nftAssets?: { __typename?: 'NftAssetConnection', edges: Array<{ __typename?: 'NftAssetEdge', node: { __typename?: 'NftAsset', id: string, ownerAddress?: string | undefined, description?: string | undefined, name?: string | undefined, tokenId: string, collection?: { __typename?: 'NftCollection', id: string, collectionId: string, description?: string | undefined, isVerified?: boolean | undefined, name?: string | undefined, numAssets?: number | undefined, image?: { __typename?: 'Image', id: string, url: string } | undefined, markets?: Array<{ __typename?: 'NftCollectionMarket', id: string, owners?: number | undefined, floorPrice?: { __typename?: 'TimestampedAmount', value: number } | undefined, totalVolume?: { __typename?: 'TimestampedAmount', value: number } | undefined }> | undefined, nftContracts?: Array<{ __typename?: 'NftContract', id: string, address: string }> | undefined } | undefined, image?: { __typename?: 'Image', id: string, url: string, dimensions?: { __typename?: 'Dimensions', width?: number | undefined, height?: number | undefined } | undefined } | undefined, nftContract?: { __typename?: 'NftContract', id: string, address: string, chain: Chain, standard?: NftStandard | undefined } | undefined, creator?: { __typename?: 'NftProfile', id: string, address: string, username?: string | undefined } | undefined, traits?: Array<{ __typename?: 'NftAssetTrait', id: string, name?: string | undefined, rarity?: number | undefined, value?: string | undefined }> | undefined, listings?: { __typename?: 'NftOrderConnection', edges: Array<{ __typename?: 'NftOrderEdge', node: { __typename?: 'NftOrder', id: string, price: { __typename?: 'Amount', currency?: Currency | undefined, value: number } } }> } | undefined } }> } | undefined, nftActivity?: { __typename?: 'NftActivityConnection', edges: Array<{ __typename?: 'NftActivityEdge', node: { __typename?: 'NftActivity', id: string, quantity?: number | undefined, price?: { __typename?: 'Amount', currency?: Currency | undefined, value: number } | undefined } }> } | undefined };

export type NftCollectionScreenQueryVariables = Exact<{
  contractAddress: Scalars['String'];
  first?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
}>;


export type NftCollectionScreenQuery = { __typename?: 'Query', nftCollections?: { __typename?: 'NftCollectionConnection', edges: Array<{ __typename?: 'NftCollectionEdge', node: { __typename?: 'NftCollection', id: string, isVerified?: boolean | undefined, numAssets?: number | undefined, description?: string | undefined, homepageUrl?: string | undefined, twitterName?: string | undefined, name?: string | undefined, bannerImage?: { __typename?: 'Image', id: string, url: string } | undefined, image?: { __typename?: 'Image', id: string, url: string } | undefined, markets?: Array<{ __typename?: 'NftCollectionMarket', id: string, owners?: number | undefined, floorPrice?: { __typename?: 'TimestampedAmount', value: number } | undefined, volume24h?: { __typename?: 'Amount', value: number } | undefined, totalVolume?: { __typename?: 'TimestampedAmount', value: number } | undefined }> | undefined } }> } | undefined, nftAssets?: { __typename?: 'NftAssetConnection', edges: Array<{ __typename?: 'NftAssetEdge', node: { __typename?: 'NftAsset', ownerAddress?: string | undefined, id: string, name?: string | undefined, tokenId: string, nftContract?: { __typename?: 'NftContract', id: string, address: string } | undefined, collection?: { __typename?: 'NftCollection', id: string, collectionId: string, name?: string | undefined } | undefined, image?: { __typename?: 'Image', id: string, url: string, dimensions?: { __typename?: 'Dimensions', width?: number | undefined, height?: number | undefined } | undefined } | undefined, listings?: { __typename?: 'NftOrderConnection', edges: Array<{ __typename?: 'NftOrderEdge', node: { __typename?: 'NftOrder', id: string, price: { __typename?: 'Amount', currency?: Currency | undefined, value: number } } }> } | undefined } }>, pageInfo: { __typename?: 'PageInfo', endCursor?: string | undefined, hasNextPage?: boolean | undefined, hasPreviousPage?: boolean | undefined, startCursor?: string | undefined } } | undefined };

export type NftsTabQueryVariables = Exact<{
  ownerAddress: Scalars['String'];
  first?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<NftBalancesFilterInput>;
}>;


export type NftsTabQuery = { __typename?: 'Query', nftBalances?: { __typename?: 'NftBalanceConnection', edges: Array<{ __typename?: 'NftBalanceEdge', node: { __typename?: 'NftBalance', ownedAsset?: { __typename?: 'NftAsset', id: string, name?: string | undefined, tokenId: string, description?: string | undefined, isSpam?: boolean | undefined, collection?: { __typename?: 'NftCollection', id: string, name?: string | undefined, isVerified?: boolean | undefined, markets?: Array<{ __typename?: 'NftCollectionMarket', id: string, floorPrice?: { __typename?: 'TimestampedAmount', value: number } | undefined }> | undefined } | undefined, image?: { __typename?: 'Image', id: string, url: string, dimensions?: { __typename?: 'Dimensions', width?: number | undefined, height?: number | undefined } | undefined } | undefined, nftContract?: { __typename?: 'NftContract', id: string, address: string } | undefined } | undefined } }>, pageInfo: { __typename?: 'PageInfo', endCursor?: string | undefined, hasNextPage?: boolean | undefined, hasPreviousPage?: boolean | undefined, startCursor?: string | undefined } } | undefined };

export type PortfolioBalancesQueryVariables = Exact<{
  ownerAddress: Scalars['String'];
  valueModifiers?: InputMaybe<Array<PortfolioValueModifier> | PortfolioValueModifier>;
}>;


export type PortfolioBalancesQuery = { __typename?: 'Query', portfolios?: Array<{ __typename?: 'Portfolio', id: string, tokensTotalDenominatedValue?: { __typename?: 'Amount', value: number } | undefined, tokensTotalDenominatedValueChange?: { __typename?: 'AmountChange', absolute?: { __typename?: 'Amount', value: number } | undefined, percentage?: { __typename?: 'Amount', value: number } | undefined } | undefined, tokenBalances?: Array<{ __typename?: 'TokenBalance', id: string, quantity?: number | undefined, isHidden?: boolean | undefined, denominatedValue?: { __typename?: 'Amount', currency?: Currency | undefined, value: number } | undefined, token?: { __typename?: 'Token', chain: Chain, address?: string | undefined, symbol?: string | undefined, decimals?: number | undefined, project?: { __typename?: 'TokenProject', id: string, name?: string | undefined, logoUrl?: string | undefined, safetyLevel?: SafetyLevel | undefined, isSpam?: boolean | undefined } | undefined } | undefined, tokenProjectMarket?: { __typename?: 'TokenProjectMarket', relativeChange24?: { __typename?: 'Amount', value: number } | undefined } | undefined } | undefined> | undefined } | undefined> | undefined };

export type MultiplePortfolioBalancesQueryVariables = Exact<{
  ownerAddresses: Array<Scalars['String']> | Scalars['String'];
  valueModifiers?: InputMaybe<Array<PortfolioValueModifier> | PortfolioValueModifier>;
}>;


export type MultiplePortfolioBalancesQuery = { __typename?: 'Query', portfolios?: Array<{ __typename?: 'Portfolio', id: string, tokensTotalDenominatedValue?: { __typename?: 'Amount', value: number } | undefined, tokensTotalDenominatedValueChange?: { __typename?: 'AmountChange', absolute?: { __typename?: 'Amount', value: number } | undefined, percentage?: { __typename?: 'Amount', value: number } | undefined } | undefined, tokenBalances?: Array<{ __typename?: 'TokenBalance', id: string, quantity?: number | undefined, isHidden?: boolean | undefined, denominatedValue?: { __typename?: 'Amount', currency?: Currency | undefined, value: number } | undefined, token?: { __typename?: 'Token', chain: Chain, address?: string | undefined, symbol?: string | undefined, decimals?: number | undefined, project?: { __typename?: 'TokenProject', id: string, name?: string | undefined, logoUrl?: string | undefined, safetyLevel?: SafetyLevel | undefined, isSpam?: boolean | undefined } | undefined } | undefined, tokenProjectMarket?: { __typename?: 'TokenProjectMarket', relativeChange24?: { __typename?: 'Amount', value: number } | undefined } | undefined } | undefined> | undefined } | undefined> | undefined };

export type SelectWalletScreenQueryVariables = Exact<{
  ownerAddresses: Array<Scalars['String']> | Scalars['String'];
}>;


export type SelectWalletScreenQuery = { __typename?: 'Query', portfolios?: Array<{ __typename?: 'Portfolio', id: string, ownerAddress: string, tokensTotalDenominatedValue?: { __typename?: 'Amount', value: number } | undefined } | undefined> | undefined };

export type TransactionHistoryUpdaterQueryVariables = Exact<{
  addresses: Array<Scalars['String']> | Scalars['String'];
}>;


export type TransactionHistoryUpdaterQuery = { __typename?: 'Query', portfolios?: Array<{ __typename?: 'Portfolio', id: string, ownerAddress: string, assetActivities?: Array<{ __typename?: 'AssetActivity', id: string, timestamp: number, details: { __typename?: 'SwapOrderDetails' } | { __typename?: 'TransactionDetails', id: string, hash: string } } | undefined> | undefined } | undefined> | undefined };

export type TokenQueryVariables = Exact<{
  chain: Chain;
  address?: InputMaybe<Scalars['String']>;
}>;


export type TokenQuery = { __typename?: 'Query', token?: { __typename?: 'Token', symbol?: string | undefined, decimals?: number | undefined, chain: Chain, address?: string | undefined, standard?: TokenStandard | undefined, project?: { __typename?: 'TokenProject', id: string, name?: string | undefined, logoUrl?: string | undefined, safetyLevel?: SafetyLevel | undefined, isSpam?: boolean | undefined } | undefined } | undefined };

export type TokenDetailsScreenQueryVariables = Exact<{
  chain: Chain;
  address?: InputMaybe<Scalars['String']>;
  includeSpanish?: InputMaybe<Scalars['Boolean']>;
  includeFrench?: InputMaybe<Scalars['Boolean']>;
  includeJapanese?: InputMaybe<Scalars['Boolean']>;
  includePortuguese?: InputMaybe<Scalars['Boolean']>;
  includeChineseSimplified?: InputMaybe<Scalars['Boolean']>;
  includeChineseTraditional?: InputMaybe<Scalars['Boolean']>;
}>;


export type TokenDetailsScreenQuery = { __typename?: 'Query', token?: { __typename?: 'Token', address?: string | undefined, chain: Chain, symbol?: string | undefined, name?: string | undefined, market?: { __typename?: 'TokenMarket', id: string, volume?: { __typename?: 'Amount', value: number } | undefined, price?: { __typename?: 'Amount', value: number } | undefined, priceHigh52W?: { __typename?: 'Amount', value: number } | undefined, priceLow52W?: { __typename?: 'Amount', value: number } | undefined } | undefined, project?: { __typename?: 'TokenProject', id: string, name?: string | undefined, description?: string | undefined, homepageUrl?: string | undefined, twitterName?: string | undefined, safetyLevel?: SafetyLevel | undefined, logoUrl?: string | undefined, descriptionTranslations?: { __typename?: 'DescriptionTranslations', descriptionEsEs?: string | undefined, descriptionFrFr?: string | undefined, descriptionJaJp?: string | undefined, descriptionPtPt?: string | undefined, descriptionZhHans?: string | undefined, descriptionZhHant?: string | undefined } | undefined, markets?: Array<{ __typename?: 'TokenProjectMarket', id: string, price?: { __typename?: 'Amount', value: number } | undefined, marketCap?: { __typename?: 'Amount', value: number } | undefined, fullyDilutedValuation?: { __typename?: 'Amount', value: number } | undefined, priceHigh52W?: { __typename?: 'Amount', value: number } | undefined, priceLow52W?: { __typename?: 'Amount', value: number } | undefined } | undefined> | undefined, tokens: Array<{ __typename?: 'Token', chain: Chain, address?: string | undefined }> } | undefined } | undefined };

export type TokenProjectsQueryVariables = Exact<{
  contracts: Array<ContractInput> | ContractInput;
}>;


export type TokenProjectsQuery = { __typename?: 'Query', tokenProjects?: Array<{ __typename?: 'TokenProject', id: string, name?: string | undefined, logoUrl?: string | undefined, safetyLevel?: SafetyLevel | undefined, tokens: Array<{ __typename?: 'Token', chain: Chain, address?: string | undefined, decimals?: number | undefined, symbol?: string | undefined }> } | undefined> | undefined };

export type TransactionListQueryVariables = Exact<{
  address: Scalars['String'];
}>;


export type TransactionListQuery = { __typename?: 'Query', portfolios?: Array<{ __typename?: 'Portfolio', id: string, assetActivities?: Array<{ __typename?: 'AssetActivity', id: string, timestamp: number, chain: Chain, details: { __typename?: 'SwapOrderDetails' } | { __typename?: 'TransactionDetails', id: string, to: string, type: TransactionType, hash: string, from: string, status: TransactionStatus, assetChanges: Array<{ __typename: 'NftApproval' } | { __typename: 'NftApproveForAll' } | { __typename: 'NftTransfer', id: string, nftStandard: NftStandard, sender: string, recipient: string, direction: TransactionDirection, asset: { __typename?: 'NftAsset', id: string, name?: string | undefined, isSpam?: boolean | undefined, tokenId: string, nftContract?: { __typename?: 'NftContract', id: string, chain: Chain, address: string } | undefined, image?: { __typename?: 'Image', id: string, url: string } | undefined, collection?: { __typename?: 'NftCollection', id: string, name?: string | undefined } | undefined } } | { __typename: 'TokenApproval', id: string, tokenStandard: TokenStandard, approvedAddress: string, quantity: string, asset: { __typename?: 'Token', id: string, symbol?: string | undefined, decimals?: number | undefined, address?: string | undefined, chain: Chain } } | { __typename: 'TokenTransfer', id: string, tokenStandard: TokenStandard, quantity: string, sender: string, recipient: string, direction: TransactionDirection, asset: { __typename?: 'Token', id: string, symbol?: string | undefined, address?: string | undefined, decimals?: number | undefined, chain: Chain, project?: { __typename?: 'TokenProject', id: string, isSpam?: boolean | undefined, spamCode?: number | undefined } | undefined }, transactedValue?: { __typename?: 'Amount', id: string, currency?: Currency | undefined, value: number } | undefined } | undefined> } } | undefined> | undefined } | undefined> | undefined };

export type FeedTransactionListQueryVariables = Exact<{
  addresses: Array<Scalars['String']> | Scalars['String'];
}>;


export type FeedTransactionListQuery = { __typename?: 'Query', portfolios?: Array<{ __typename?: 'Portfolio', id: string, ownerAddress: string, assetActivities?: Array<{ __typename?: 'AssetActivity', id: string, timestamp: number, chain: Chain, details: { __typename?: 'SwapOrderDetails' } | { __typename?: 'TransactionDetails', id: string, to: string, type: TransactionType, hash: string, from: string, status: TransactionStatus, assetChanges: Array<{ __typename: 'NftApproval' } | { __typename: 'NftApproveForAll' } | { __typename: 'NftTransfer', id: string, nftStandard: NftStandard, sender: string, recipient: string, direction: TransactionDirection, asset: { __typename?: 'NftAsset', id: string, name?: string | undefined, isSpam?: boolean | undefined, tokenId: string, nftContract?: { __typename?: 'NftContract', id: string, chain: Chain, address: string } | undefined, image?: { __typename?: 'Image', id: string, url: string } | undefined, collection?: { __typename?: 'NftCollection', id: string, name?: string | undefined } | undefined } } | { __typename: 'TokenApproval', id: string, tokenStandard: TokenStandard, approvedAddress: string, quantity: string, asset: { __typename?: 'Token', id: string, symbol?: string | undefined, decimals?: number | undefined, address?: string | undefined, chain: Chain } } | { __typename: 'TokenTransfer', id: string, tokenStandard: TokenStandard, quantity: string, sender: string, recipient: string, direction: TransactionDirection, asset: { __typename?: 'Token', id: string, symbol?: string | undefined, address?: string | undefined, decimals?: number | undefined, chain: Chain, project?: { __typename?: 'TokenProject', id: string, isSpam?: boolean | undefined, spamCode?: number | undefined } | undefined }, transactedValue?: { __typename?: 'Amount', currency?: Currency | undefined, value: number } | undefined } | undefined> } } | undefined> | undefined } | undefined> | undefined };

export type TopTokensQueryVariables = Exact<{
  chain?: InputMaybe<Chain>;
  page?: InputMaybe<Scalars['Int']>;
  pageSize?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TokenSortableField>;
}>;


export type TopTokensQuery = { __typename?: 'Query', topTokens?: Array<{ __typename?: 'Token', address?: string | undefined, chain: Chain, decimals?: number | undefined, symbol?: string | undefined, standard?: TokenStandard | undefined, project?: { __typename?: 'TokenProject', id: string, name?: string | undefined, isSpam?: boolean | undefined, logoUrl?: string | undefined, safetyLevel?: SafetyLevel | undefined } | undefined } | undefined> | undefined };

export type SearchTokensQueryVariables = Exact<{
  searchQuery: Scalars['String'];
  chains?: InputMaybe<Array<Chain> | Chain>;
}>;


export type SearchTokensQuery = { __typename?: 'Query', searchTokens?: Array<{ __typename?: 'Token', id: string, chain: Chain, address?: string | undefined, decimals?: number | undefined, symbol?: string | undefined, project?: { __typename?: 'TokenProject', id: string, name?: string | undefined, logoUrl?: string | undefined, safetyLevel?: SafetyLevel | undefined } | undefined } | undefined> | undefined };

export type ExploreSearchQueryVariables = Exact<{
  searchQuery: Scalars['String'];
  nftCollectionsFilter: NftCollectionsFilterInput;
}>;


export type ExploreSearchQuery = { __typename?: 'Query', searchTokens?: Array<{ __typename?: 'Token', chain: Chain, address?: string | undefined, decimals?: number | undefined, symbol?: string | undefined, market?: { __typename?: 'TokenMarket', volume?: { __typename?: 'Amount', value: number } | undefined } | undefined, project?: { __typename?: 'TokenProject', id: string, name?: string | undefined, logoUrl?: string | undefined, safetyLevel?: SafetyLevel | undefined } | undefined } | undefined> | undefined, nftCollections?: { __typename?: 'NftCollectionConnection', edges: Array<{ __typename?: 'NftCollectionEdge', node: { __typename?: 'NftCollection', id: string, name?: string | undefined, collectionId: string, isVerified?: boolean | undefined, nftContracts?: Array<{ __typename?: 'NftContract', id: string, chain: Chain, address: string }> | undefined, image?: { __typename?: 'Image', id: string, url: string } | undefined } }> } | undefined };

export type TopTokenPartsFragment = { __typename?: 'Token', symbol?: string | undefined, chain: Chain, address?: string | undefined, market?: { __typename?: 'TokenMarket', id: string, totalValueLocked?: { __typename?: 'Amount', value: number } | undefined, volume?: { __typename?: 'Amount', value: number } | undefined } | undefined, project?: { __typename?: 'TokenProject', id: string, name?: string | undefined, logoUrl?: string | undefined, markets?: Array<{ __typename?: 'TokenProjectMarket', id: string, price?: { __typename?: 'Amount', value: number } | undefined, pricePercentChange24h?: { __typename?: 'Amount', value: number } | undefined, marketCap?: { __typename?: 'Amount', value: number } | undefined } | undefined> | undefined } | undefined };

export type ExploreTokensTabQueryVariables = Exact<{
  topTokensOrderBy: TokenSortableField;
}>;


export type ExploreTokensTabQuery = { __typename?: 'Query', topTokens?: Array<{ __typename?: 'Token', symbol?: string | undefined, chain: Chain, address?: string | undefined, market?: { __typename?: 'TokenMarket', id: string, totalValueLocked?: { __typename?: 'Amount', value: number } | undefined, volume?: { __typename?: 'Amount', value: number } | undefined } | undefined, project?: { __typename?: 'TokenProject', id: string, name?: string | undefined, logoUrl?: string | undefined, markets?: Array<{ __typename?: 'TokenProjectMarket', id: string, price?: { __typename?: 'Amount', value: number } | undefined, pricePercentChange24h?: { __typename?: 'Amount', value: number } | undefined, marketCap?: { __typename?: 'Amount', value: number } | undefined } | undefined> | undefined } | undefined } | undefined> | undefined, eth?: { __typename?: 'Token', symbol?: string | undefined, chain: Chain, address?: string | undefined, market?: { __typename?: 'TokenMarket', id: string, totalValueLocked?: { __typename?: 'Amount', value: number } | undefined, volume?: { __typename?: 'Amount', value: number } | undefined } | undefined, project?: { __typename?: 'TokenProject', id: string, name?: string | undefined, logoUrl?: string | undefined, markets?: Array<{ __typename?: 'TokenProjectMarket', id: string, price?: { __typename?: 'Amount', value: number } | undefined, pricePercentChange24h?: { __typename?: 'Amount', value: number } | undefined, marketCap?: { __typename?: 'Amount', value: number } | undefined } | undefined> | undefined } | undefined } | undefined };

export type FavoriteTokenCardQueryVariables = Exact<{
  chain: Chain;
  address?: InputMaybe<Scalars['String']>;
}>;


export type FavoriteTokenCardQuery = { __typename?: 'Query', token?: { __typename?: 'Token', symbol?: string | undefined, chain: Chain, address?: string | undefined, project?: { __typename?: 'TokenProject', id: string, name?: string | undefined, logoUrl?: string | undefined, markets?: Array<{ __typename?: 'TokenProjectMarket', id: string, price?: { __typename?: 'Amount', value: number } | undefined, pricePercentChange24h?: { __typename?: 'Amount', value: number } | undefined } | undefined> | undefined } | undefined } | undefined };

export type TokensQueryVariables = Exact<{
  contracts: Array<ContractInput> | ContractInput;
}>;


export type TokensQuery = { __typename?: 'Query', tokens?: Array<{ __typename?: 'Token', symbol?: string | undefined, chain: Chain, address?: string | undefined, project?: { __typename?: 'TokenProject', name?: string | undefined } | undefined } | undefined> | undefined };

export type ConvertQueryVariables = Exact<{
  fromCurrency: Currency;
  toCurrency: Currency;
}>;


export type ConvertQuery = { __typename?: 'Query', convert?: { __typename?: 'Amount', value: number, currency?: Currency | undefined } | undefined };

export type ConvertWebQueryVariables = Exact<{
  toCurrency: Currency;
}>;


export type ConvertWebQuery = { __typename?: 'Query', convert?: { __typename?: 'Amount', id: string, value: number, currency?: Currency | undefined } | undefined };

export type HistoricalProtocolVolumeQueryVariables = Exact<{
  chain: Chain;
  duration: HistoryDuration;
}>;


export type HistoricalProtocolVolumeQuery = { __typename?: 'Query', v3HistoricalProtocolVolume?: Array<{ __typename?: 'TimestampedAmount', id: string, timestamp: number, value: number }> | undefined, v2HistoricalProtocolVolume?: Array<{ __typename?: 'TimestampedAmount', id: string, timestamp: number, value: number }> | undefined };

export type DailyProtocolTvlQueryVariables = Exact<{
  chain: Chain;
}>;


export type DailyProtocolTvlQuery = { __typename?: 'Query', v3DailyProtocolTvl?: Array<{ __typename?: 'TimestampedAmount', id: string, timestamp: number, value: number }> | undefined, v2DailyProtocolTvl?: Array<{ __typename?: 'TimestampedAmount', id: string, timestamp: number, value: number }> | undefined };

export type RecentTokenTransfersQueryVariables = Exact<{
  address: Scalars['String'];
}>;


export type RecentTokenTransfersQuery = { __typename?: 'Query', portfolios?: Array<{ __typename?: 'Portfolio', id: string, ownerAddress: string, assetActivities?: Array<{ __typename?: 'AssetActivity', id: string, timestamp: number, chain: Chain, details: { __typename?: 'SwapOrderDetails' } | { __typename?: 'TransactionDetails', to: string, type: TransactionType, hash: string, from: string, status: TransactionStatus, assetChanges: Array<{ __typename: 'NftApproval' } | { __typename: 'NftApproveForAll' } | { __typename: 'NftTransfer', id: string, nftStandard: NftStandard, sender: string, recipient: string, direction: TransactionDirection, asset: { __typename?: 'NftAsset', id: string, name?: string | undefined, isSpam?: boolean | undefined, tokenId: string, nftContract?: { __typename?: 'NftContract', id: string, chain: Chain, address: string } | undefined, image?: { __typename?: 'Image', id: string, url: string } | undefined, collection?: { __typename?: 'NftCollection', id: string, name?: string | undefined } | undefined } } | { __typename: 'TokenApproval', id: string, tokenStandard: TokenStandard, approvedAddress: string, quantity: string, asset: { __typename?: 'Token', id: string, symbol?: string | undefined, decimals?: number | undefined, address?: string | undefined, chain: Chain } } | { __typename: 'TokenTransfer', id: string, tokenStandard: TokenStandard, quantity: string, sender: string, recipient: string, direction: TransactionDirection, asset: { __typename?: 'Token', id: string, symbol?: string | undefined, address?: string | undefined, decimals?: number | undefined, chain: Chain, project?: { __typename?: 'TokenProject', id: string, isSpam?: boolean | undefined, spamCode?: number | undefined } | undefined }, transactedValue?: { __typename?: 'Amount', currency?: Currency | undefined, value: number } | undefined } | undefined> } } | undefined> | undefined } | undefined> | undefined };

export type RecentlySearchedAssetsQueryVariables = Exact<{
  collectionAddresses: Array<Scalars['String']> | Scalars['String'];
  contracts: Array<ContractInput> | ContractInput;
}>;


export type RecentlySearchedAssetsQuery = { __typename?: 'Query', nftCollections?: { __typename?: 'NftCollectionConnection', edges: Array<{ __typename?: 'NftCollectionEdge', node: { __typename?: 'NftCollection', collectionId: string, isVerified?: boolean | undefined, name?: string | undefined, numAssets?: number | undefined, image?: { __typename?: 'Image', url: string } | undefined, nftContracts?: Array<{ __typename?: 'NftContract', address: string }> | undefined, markets?: Array<{ __typename?: 'NftCollectionMarket', floorPrice?: { __typename?: 'TimestampedAmount', currency?: Currency | undefined, value: number } | undefined }> | undefined } }> } | undefined, tokens?: Array<{ __typename?: 'Token', id: string, decimals?: number | undefined, name?: string | undefined, chain: Chain, standard?: TokenStandard | undefined, address?: string | undefined, symbol?: string | undefined, market?: { __typename?: 'TokenMarket', id: string, price?: { __typename?: 'Amount', id: string, value: number, currency?: Currency | undefined } | undefined, pricePercentChange?: { __typename?: 'Amount', id: string, value: number } | undefined, volume24H?: { __typename?: 'Amount', id: string, value: number, currency?: Currency | undefined } | undefined } | undefined, project?: { __typename?: 'TokenProject', id: string, logoUrl?: string | undefined, safetyLevel?: SafetyLevel | undefined } | undefined } | undefined> | undefined };

export type SearchPopularTokensWebQueryVariables = Exact<{
  chain: Chain;
  orderBy?: InputMaybe<TokenSortableField>;
}>;


export type SearchPopularTokensWebQuery = { __typename?: 'Query', topTokens?: Array<{ __typename?: 'Token', id: string, address?: string | undefined, chain: Chain, symbol?: string | undefined, name?: string | undefined, decimals?: number | undefined, project?: { __typename?: 'TokenProject', id: string, logoUrl?: string | undefined, safetyLevel?: SafetyLevel | undefined, isSpam?: boolean | undefined } | undefined } | undefined> | undefined };

export type SimpleTokenQueryVariables = Exact<{
  chain: Chain;
  address?: InputMaybe<Scalars['String']>;
}>;


export type SimpleTokenQuery = { __typename?: 'Query', token?: { __typename?: 'Token', id: string, address?: string | undefined, chain: Chain, symbol?: string | undefined, name?: string | undefined, decimals?: number | undefined, standard?: TokenStandard | undefined, project?: { __typename?: 'TokenProject', id: string, safetyLevel?: SafetyLevel | undefined, isSpam?: boolean | undefined, logo?: { __typename?: 'Image', id: string, url: string } | undefined } | undefined } | undefined };

export type TokenSpotPriceQueryVariables = Exact<{
  chain: Chain;
  address?: InputMaybe<Scalars['String']>;
}>;


export type TokenSpotPriceQuery = { __typename?: 'Query', token?: { __typename?: 'Token', id: string, address?: string | undefined, chain: Chain, name?: string | undefined, symbol?: string | undefined, project?: { __typename?: 'TokenProject', id: string, markets?: Array<{ __typename?: 'TokenProjectMarket', id: string, price?: { __typename?: 'Amount', id: string, value: number } | undefined } | undefined> | undefined } | undefined } | undefined };

export type UniswapPricesQueryVariables = Exact<{
  contracts: Array<ContractInput> | ContractInput;
}>;


export type UniswapPricesQuery = { __typename?: 'Query', tokens?: Array<{ __typename?: 'Token', id: string, address?: string | undefined, chain: Chain, standard?: TokenStandard | undefined, project?: { __typename?: 'TokenProject', id: string, markets?: Array<{ __typename?: 'TokenProjectMarket', id: string, price?: { __typename?: 'Amount', id: string, value: number } | undefined } | undefined> | undefined } | undefined } | undefined> | undefined };

export type NftAssetPartsFragment = { __typename?: 'NftAsset', id: string, name?: string | undefined, isSpam?: boolean | undefined, tokenId: string, nftContract?: { __typename?: 'NftContract', id: string, chain: Chain, address: string } | undefined, image?: { __typename?: 'Image', id: string, url: string } | undefined, collection?: { __typename?: 'NftCollection', id: string, name?: string | undefined } | undefined };

export type NftTransferPartsFragment = { __typename?: 'NftTransfer', id: string, nftStandard: NftStandard, sender: string, recipient: string, direction: TransactionDirection, asset: { __typename?: 'NftAsset', id: string, name?: string | undefined, isSpam?: boolean | undefined, tokenId: string, nftContract?: { __typename?: 'NftContract', id: string, chain: Chain, address: string } | undefined, image?: { __typename?: 'Image', id: string, url: string } | undefined, collection?: { __typename?: 'NftCollection', id: string, name?: string | undefined } | undefined } };

export type TokenAssetPartsFragment = { __typename?: 'Token', id: string, name?: string | undefined, symbol?: string | undefined, address?: string | undefined, decimals?: number | undefined, chain: Chain, standard?: TokenStandard | undefined, project?: { __typename?: 'TokenProject', id: string, isSpam?: boolean | undefined, logo?: { __typename?: 'Image', id: string, url: string } | undefined } | undefined };

export type TokenTransferPartsFragment = { __typename?: 'TokenTransfer', id: string, tokenStandard: TokenStandard, quantity: string, sender: string, recipient: string, direction: TransactionDirection, asset: { __typename?: 'Token', id: string, name?: string | undefined, symbol?: string | undefined, address?: string | undefined, decimals?: number | undefined, chain: Chain, standard?: TokenStandard | undefined, project?: { __typename?: 'TokenProject', id: string, isSpam?: boolean | undefined, logo?: { __typename?: 'Image', id: string, url: string } | undefined } | undefined }, transactedValue?: { __typename?: 'Amount', id: string, currency?: Currency | undefined, value: number } | undefined };

export type TokenApprovalPartsFragment = { __typename?: 'TokenApproval', id: string, tokenStandard: TokenStandard, approvedAddress: string, quantity: string, asset: { __typename?: 'Token', id: string, name?: string | undefined, symbol?: string | undefined, address?: string | undefined, decimals?: number | undefined, chain: Chain, standard?: TokenStandard | undefined, project?: { __typename?: 'TokenProject', id: string, isSpam?: boolean | undefined, logo?: { __typename?: 'Image', id: string, url: string } | undefined } | undefined } };

export type NftApprovalPartsFragment = { __typename?: 'NftApproval', id: string, nftStandard: NftStandard, approvedAddress: string, asset: { __typename?: 'NftAsset', id: string, name?: string | undefined, isSpam?: boolean | undefined, tokenId: string, nftContract?: { __typename?: 'NftContract', id: string, chain: Chain, address: string } | undefined, image?: { __typename?: 'Image', id: string, url: string } | undefined, collection?: { __typename?: 'NftCollection', id: string, name?: string | undefined } | undefined } };

export type NftApproveForAllPartsFragment = { __typename?: 'NftApproveForAll', id: string, nftStandard: NftStandard, operatorAddress: string, approved: boolean, asset: { __typename?: 'NftAsset', id: string, name?: string | undefined, isSpam?: boolean | undefined, tokenId: string, nftContract?: { __typename?: 'NftContract', id: string, chain: Chain, address: string } | undefined, image?: { __typename?: 'Image', id: string, url: string } | undefined, collection?: { __typename?: 'NftCollection', id: string, name?: string | undefined } | undefined } };

export type TransactionPartsFragment = { __typename?: 'Transaction', id: string, blockNumber: number, hash: string, status: TransactionStatus, to: string, from: string, nonce: number };

export type TransactionDetailsPartsFragment = { __typename?: 'TransactionDetails', id: string, type: TransactionType, from: string, to: string, hash: string, nonce: number, status: TransactionStatus, assetChanges: Array<{ __typename: 'NftApproval', id: string, nftStandard: NftStandard, approvedAddress: string, asset: { __typename?: 'NftAsset', id: string, name?: string | undefined, isSpam?: boolean | undefined, tokenId: string, nftContract?: { __typename?: 'NftContract', id: string, chain: Chain, address: string } | undefined, image?: { __typename?: 'Image', id: string, url: string } | undefined, collection?: { __typename?: 'NftCollection', id: string, name?: string | undefined } | undefined } } | { __typename: 'NftApproveForAll', id: string, nftStandard: NftStandard, operatorAddress: string, approved: boolean, asset: { __typename?: 'NftAsset', id: string, name?: string | undefined, isSpam?: boolean | undefined, tokenId: string, nftContract?: { __typename?: 'NftContract', id: string, chain: Chain, address: string } | undefined, image?: { __typename?: 'Image', id: string, url: string } | undefined, collection?: { __typename?: 'NftCollection', id: string, name?: string | undefined } | undefined } } | { __typename: 'NftTransfer', id: string, nftStandard: NftStandard, sender: string, recipient: string, direction: TransactionDirection, asset: { __typename?: 'NftAsset', id: string, name?: string | undefined, isSpam?: boolean | undefined, tokenId: string, nftContract?: { __typename?: 'NftContract', id: string, chain: Chain, address: string } | undefined, image?: { __typename?: 'Image', id: string, url: string } | undefined, collection?: { __typename?: 'NftCollection', id: string, name?: string | undefined } | undefined } } | { __typename: 'TokenApproval', id: string, tokenStandard: TokenStandard, approvedAddress: string, quantity: string, asset: { __typename?: 'Token', id: string, name?: string | undefined, symbol?: string | undefined, address?: string | undefined, decimals?: number | undefined, chain: Chain, standard?: TokenStandard | undefined, project?: { __typename?: 'TokenProject', id: string, isSpam?: boolean | undefined, logo?: { __typename?: 'Image', id: string, url: string } | undefined } | undefined } } | { __typename: 'TokenTransfer', id: string, tokenStandard: TokenStandard, quantity: string, sender: string, recipient: string, direction: TransactionDirection, asset: { __typename?: 'Token', id: string, name?: string | undefined, symbol?: string | undefined, address?: string | undefined, decimals?: number | undefined, chain: Chain, standard?: TokenStandard | undefined, project?: { __typename?: 'TokenProject', id: string, isSpam?: boolean | undefined, logo?: { __typename?: 'Image', id: string, url: string } | undefined } | undefined }, transactedValue?: { __typename?: 'Amount', id: string, currency?: Currency | undefined, value: number } | undefined } | undefined> };

export type SwapOrderDetailsPartsFragment = { __typename?: 'SwapOrderDetails', id: string, offerer: string, hash: string, expiry: number, swapOrderType: SwapOrderType, encodedOrder: string, inputTokenQuantity: string, outputTokenQuantity: string, orderStatus: SwapOrderStatus, inputToken: { __typename?: 'Token', id: string, name?: string | undefined, symbol?: string | undefined, address?: string | undefined, decimals?: number | undefined, chain: Chain, standard?: TokenStandard | undefined, project?: { __typename?: 'TokenProject', id: string, isSpam?: boolean | undefined, logo?: { __typename?: 'Image', id: string, url: string } | undefined } | undefined }, outputToken: { __typename?: 'Token', id: string, name?: string | undefined, symbol?: string | undefined, address?: string | undefined, decimals?: number | undefined, chain: Chain, standard?: TokenStandard | undefined, project?: { __typename?: 'TokenProject', id: string, isSpam?: boolean | undefined, logo?: { __typename?: 'Image', id: string, url: string } | undefined } | undefined } };

export type AssetActivityPartsFragment = { __typename?: 'AssetActivity', id: string, timestamp: number, chain: Chain, details: { __typename: 'SwapOrderDetails', id: string, offerer: string, hash: string, expiry: number, swapOrderType: SwapOrderType, encodedOrder: string, inputTokenQuantity: string, outputTokenQuantity: string, orderStatus: SwapOrderStatus, inputToken: { __typename?: 'Token', id: string, name?: string | undefined, symbol?: string | undefined, address?: string | undefined, decimals?: number | undefined, chain: Chain, standard?: TokenStandard | undefined, project?: { __typename?: 'TokenProject', id: string, isSpam?: boolean | undefined, logo?: { __typename?: 'Image', id: string, url: string } | undefined } | undefined }, outputToken: { __typename?: 'Token', id: string, name?: string | undefined, symbol?: string | undefined, address?: string | undefined, decimals?: number | undefined, chain: Chain, standard?: TokenStandard | undefined, project?: { __typename?: 'TokenProject', id: string, isSpam?: boolean | undefined, logo?: { __typename?: 'Image', id: string, url: string } | undefined } | undefined } } | { __typename: 'TransactionDetails', id: string, type: TransactionType, from: string, to: string, hash: string, nonce: number, status: TransactionStatus, assetChanges: Array<{ __typename: 'NftApproval', id: string, nftStandard: NftStandard, approvedAddress: string, asset: { __typename?: 'NftAsset', id: string, name?: string | undefined, isSpam?: boolean | undefined, tokenId: string, nftContract?: { __typename?: 'NftContract', id: string, chain: Chain, address: string } | undefined, image?: { __typename?: 'Image', id: string, url: string } | undefined, collection?: { __typename?: 'NftCollection', id: string, name?: string | undefined } | undefined } } | { __typename: 'NftApproveForAll', id: string, nftStandard: NftStandard, operatorAddress: string, approved: boolean, asset: { __typename?: 'NftAsset', id: string, name?: string | undefined, isSpam?: boolean | undefined, tokenId: string, nftContract?: { __typename?: 'NftContract', id: string, chain: Chain, address: string } | undefined, image?: { __typename?: 'Image', id: string, url: string } | undefined, collection?: { __typename?: 'NftCollection', id: string, name?: string | undefined } | undefined } } | { __typename: 'NftTransfer', id: string, nftStandard: NftStandard, sender: string, recipient: string, direction: TransactionDirection, asset: { __typename?: 'NftAsset', id: string, name?: string | undefined, isSpam?: boolean | undefined, tokenId: string, nftContract?: { __typename?: 'NftContract', id: string, chain: Chain, address: string } | undefined, image?: { __typename?: 'Image', id: string, url: string } | undefined, collection?: { __typename?: 'NftCollection', id: string, name?: string | undefined } | undefined } } | { __typename: 'TokenApproval', id: string, tokenStandard: TokenStandard, approvedAddress: string, quantity: string, asset: { __typename?: 'Token', id: string, name?: string | undefined, symbol?: string | undefined, address?: string | undefined, decimals?: number | undefined, chain: Chain, standard?: TokenStandard | undefined, project?: { __typename?: 'TokenProject', id: string, isSpam?: boolean | undefined, logo?: { __typename?: 'Image', id: string, url: string } | undefined } | undefined } } | { __typename: 'TokenTransfer', id: string, tokenStandard: TokenStandard, quantity: string, sender: string, recipient: string, direction: TransactionDirection, asset: { __typename?: 'Token', id: string, name?: string | undefined, symbol?: string | undefined, address?: string | undefined, decimals?: number | undefined, chain: Chain, standard?: TokenStandard | undefined, project?: { __typename?: 'TokenProject', id: string, isSpam?: boolean | undefined, logo?: { __typename?: 'Image', id: string, url: string } | undefined } | undefined }, transactedValue?: { __typename?: 'Amount', id: string, currency?: Currency | undefined, value: number } | undefined } | undefined> } };

export type ActivityWebQueryVariables = Exact<{
  account: Scalars['String'];
  chains: Array<Chain> | Chain;
}>;


export type ActivityWebQuery = { __typename?: 'Query', portfolios?: Array<{ __typename?: 'Portfolio', id: string, assetActivities?: Array<{ __typename?: 'AssetActivity', id: string, timestamp: number, chain: Chain, details: { __typename: 'SwapOrderDetails', id: string, offerer: string, hash: string, expiry: number, swapOrderType: SwapOrderType, encodedOrder: string, inputTokenQuantity: string, outputTokenQuantity: string, orderStatus: SwapOrderStatus, inputToken: { __typename?: 'Token', id: string, name?: string | undefined, symbol?: string | undefined, address?: string | undefined, decimals?: number | undefined, chain: Chain, standard?: TokenStandard | undefined, project?: { __typename?: 'TokenProject', id: string, isSpam?: boolean | undefined, logo?: { __typename?: 'Image', id: string, url: string } | undefined } | undefined }, outputToken: { __typename?: 'Token', id: string, name?: string | undefined, symbol?: string | undefined, address?: string | undefined, decimals?: number | undefined, chain: Chain, standard?: TokenStandard | undefined, project?: { __typename?: 'TokenProject', id: string, isSpam?: boolean | undefined, logo?: { __typename?: 'Image', id: string, url: string } | undefined } | undefined } } | { __typename: 'TransactionDetails', id: string, type: TransactionType, from: string, to: string, hash: string, nonce: number, status: TransactionStatus, assetChanges: Array<{ __typename: 'NftApproval', id: string, nftStandard: NftStandard, approvedAddress: string, asset: { __typename?: 'NftAsset', id: string, name?: string | undefined, isSpam?: boolean | undefined, tokenId: string, nftContract?: { __typename?: 'NftContract', id: string, chain: Chain, address: string } | undefined, image?: { __typename?: 'Image', id: string, url: string } | undefined, collection?: { __typename?: 'NftCollection', id: string, name?: string | undefined } | undefined } } | { __typename: 'NftApproveForAll', id: string, nftStandard: NftStandard, operatorAddress: string, approved: boolean, asset: { __typename?: 'NftAsset', id: string, name?: string | undefined, isSpam?: boolean | undefined, tokenId: string, nftContract?: { __typename?: 'NftContract', id: string, chain: Chain, address: string } | undefined, image?: { __typename?: 'Image', id: string, url: string } | undefined, collection?: { __typename?: 'NftCollection', id: string, name?: string | undefined } | undefined } } | { __typename: 'NftTransfer', id: string, nftStandard: NftStandard, sender: string, recipient: string, direction: TransactionDirection, asset: { __typename?: 'NftAsset', id: string, name?: string | undefined, isSpam?: boolean | undefined, tokenId: string, nftContract?: { __typename?: 'NftContract', id: string, chain: Chain, address: string } | undefined, image?: { __typename?: 'Image', id: string, url: string } | undefined, collection?: { __typename?: 'NftCollection', id: string, name?: string | undefined } | undefined } } | { __typename: 'TokenApproval', id: string, tokenStandard: TokenStandard, approvedAddress: string, quantity: string, asset: { __typename?: 'Token', id: string, name?: string | undefined, symbol?: string | undefined, address?: string | undefined, decimals?: number | undefined, chain: Chain, standard?: TokenStandard | undefined, project?: { __typename?: 'TokenProject', id: string, isSpam?: boolean | undefined, logo?: { __typename?: 'Image', id: string, url: string } | undefined } | undefined } } | { __typename: 'TokenTransfer', id: string, tokenStandard: TokenStandard, quantity: string, sender: string, recipient: string, direction: TransactionDirection, asset: { __typename?: 'Token', id: string, name?: string | undefined, symbol?: string | undefined, address?: string | undefined, decimals?: number | undefined, chain: Chain, standard?: TokenStandard | undefined, project?: { __typename?: 'TokenProject', id: string, isSpam?: boolean | undefined, logo?: { __typename?: 'Image', id: string, url: string } | undefined } | undefined }, transactedValue?: { __typename?: 'Amount', id: string, currency?: Currency | undefined, value: number } | undefined } | undefined> } } | undefined> | undefined } | undefined> | undefined };

export type OnAssetActivitySubscriptionVariables = Exact<{
  subscriptionId: Scalars['ID'];
  account: Scalars['String'];
}>;


export type OnAssetActivitySubscription = { __typename?: 'Subscription', onAssetActivity?: { __typename?: 'AssetActivity', id: string, timestamp: number, chain: Chain, details: { __typename: 'SwapOrderDetails', id: string, offerer: string, hash: string, expiry: number, swapOrderType: SwapOrderType, encodedOrder: string, inputTokenQuantity: string, outputTokenQuantity: string, orderStatus: SwapOrderStatus, inputToken: { __typename?: 'Token', id: string, name?: string | undefined, symbol?: string | undefined, address?: string | undefined, decimals?: number | undefined, chain: Chain, standard?: TokenStandard | undefined, project?: { __typename?: 'TokenProject', id: string, isSpam?: boolean | undefined, logo?: { __typename?: 'Image', id: string, url: string } | undefined } | undefined }, outputToken: { __typename?: 'Token', id: string, name?: string | undefined, symbol?: string | undefined, address?: string | undefined, decimals?: number | undefined, chain: Chain, standard?: TokenStandard | undefined, project?: { __typename?: 'TokenProject', id: string, isSpam?: boolean | undefined, logo?: { __typename?: 'Image', id: string, url: string } | undefined } | undefined } } | { __typename: 'TransactionDetails', id: string, type: TransactionType, from: string, to: string, hash: string, nonce: number, status: TransactionStatus, assetChanges: Array<{ __typename: 'NftApproval', id: string, nftStandard: NftStandard, approvedAddress: string, asset: { __typename?: 'NftAsset', id: string, name?: string | undefined, isSpam?: boolean | undefined, tokenId: string, nftContract?: { __typename?: 'NftContract', id: string, chain: Chain, address: string } | undefined, image?: { __typename?: 'Image', id: string, url: string } | undefined, collection?: { __typename?: 'NftCollection', id: string, name?: string | undefined } | undefined } } | { __typename: 'NftApproveForAll', id: string, nftStandard: NftStandard, operatorAddress: string, approved: boolean, asset: { __typename?: 'NftAsset', id: string, name?: string | undefined, isSpam?: boolean | undefined, tokenId: string, nftContract?: { __typename?: 'NftContract', id: string, chain: Chain, address: string } | undefined, image?: { __typename?: 'Image', id: string, url: string } | undefined, collection?: { __typename?: 'NftCollection', id: string, name?: string | undefined } | undefined } } | { __typename: 'NftTransfer', id: string, nftStandard: NftStandard, sender: string, recipient: string, direction: TransactionDirection, asset: { __typename?: 'NftAsset', id: string, name?: string | undefined, isSpam?: boolean | undefined, tokenId: string, nftContract?: { __typename?: 'NftContract', id: string, chain: Chain, address: string } | undefined, image?: { __typename?: 'Image', id: string, url: string } | undefined, collection?: { __typename?: 'NftCollection', id: string, name?: string | undefined } | undefined } } | { __typename: 'TokenApproval', id: string, tokenStandard: TokenStandard, approvedAddress: string, quantity: string, asset: { __typename?: 'Token', id: string, name?: string | undefined, symbol?: string | undefined, address?: string | undefined, decimals?: number | undefined, chain: Chain, standard?: TokenStandard | undefined, project?: { __typename?: 'TokenProject', id: string, isSpam?: boolean | undefined, logo?: { __typename?: 'Image', id: string, url: string } | undefined } | undefined } } | { __typename: 'TokenTransfer', id: string, tokenStandard: TokenStandard, quantity: string, sender: string, recipient: string, direction: TransactionDirection, asset: { __typename?: 'Token', id: string, name?: string | undefined, symbol?: string | undefined, address?: string | undefined, decimals?: number | undefined, chain: Chain, standard?: TokenStandard | undefined, project?: { __typename?: 'TokenProject', id: string, isSpam?: boolean | undefined, logo?: { __typename?: 'Image', id: string, url: string } | undefined } | undefined }, transactedValue?: { __typename?: 'Amount', id: string, currency?: Currency | undefined, value: number } | undefined } | undefined> } } | undefined };

export type TokenPromoQueryVariables = Exact<{
  chain: Chain;
  address?: InputMaybe<Scalars['String']>;
}>;


export type TokenPromoQuery = { __typename?: 'Query', token?: { __typename?: 'Token', id: string, address?: string | undefined, chain: Chain, market?: { __typename?: 'TokenMarket', id: string, price?: { __typename?: 'Amount', id: string, value: number } | undefined, pricePercentChange?: { __typename?: 'Amount', id: string, value: number } | undefined } | undefined } | undefined };

export type CollectionPromoQueryVariables = Exact<{
  addresses: Array<Scalars['String']> | Scalars['String'];
}>;


export type CollectionPromoQuery = { __typename?: 'Query', nftCollections?: { __typename?: 'NftCollectionConnection', edges: Array<{ __typename?: 'NftCollectionEdge', node: { __typename?: 'NftCollection', markets?: Array<{ __typename?: 'NftCollectionMarket', floorPricePercentChange?: { __typename?: 'TimestampedAmount', value: number } | undefined }> | undefined } }> } | undefined };

export type DailyProtocolVolumeQueryVariables = Exact<{
  version: ProtocolVersion;
}>;


export type DailyProtocolVolumeQuery = { __typename?: 'Query', historicalProtocolVolume?: Array<{ __typename?: 'TimestampedAmount', value: number }> | undefined };

export type CollectionSearchQueryVariables = Exact<{
  query: Scalars['String'];
}>;


export type CollectionSearchQuery = { __typename?: 'Query', nftCollections?: { __typename?: 'NftCollectionConnection', edges: Array<{ __typename?: 'NftCollectionEdge', cursor: string, node: { __typename?: 'NftCollection', isVerified?: boolean | undefined, name?: string | undefined, numAssets?: number | undefined, image?: { __typename?: 'Image', url: string } | undefined, nftContracts?: Array<{ __typename?: 'NftContract', address: string, chain: Chain, name?: string | undefined, symbol?: string | undefined, totalSupply?: number | undefined }> | undefined, markets?: Array<{ __typename?: 'NftCollectionMarket', floorPrice?: { __typename?: 'TimestampedAmount', currency?: Currency | undefined, value: number } | undefined }> | undefined } }>, pageInfo: { __typename?: 'PageInfo', endCursor?: string | undefined, hasNextPage?: boolean | undefined, hasPreviousPage?: boolean | undefined, startCursor?: string | undefined } } | undefined };

export type NftDetailsQueryVariables = Exact<{
  address: Scalars['String'];
  tokenId: Scalars['String'];
}>;


export type NftDetailsQuery = { __typename?: 'Query', nftAssets?: { __typename?: 'NftAssetConnection', edges: Array<{ __typename?: 'NftAssetEdge', node: { __typename?: 'NftAsset', id: string, name?: string | undefined, ownerAddress?: string | undefined, tokenId: string, description?: string | undefined, animationUrl?: string | undefined, suspiciousFlag?: boolean | undefined, metadataUrl?: string | undefined, image?: { __typename?: 'Image', url: string } | undefined, smallImage?: { __typename?: 'Image', url: string } | undefined, originalImage?: { __typename?: 'Image', url: string } | undefined, creator?: { __typename?: 'NftProfile', address: string, isVerified?: boolean | undefined, profileImage?: { __typename?: 'Image', url: string } | undefined } | undefined, collection?: { __typename?: 'NftCollection', name?: string | undefined, isVerified?: boolean | undefined, numAssets?: number | undefined, twitterName?: string | undefined, discordUrl?: string | undefined, homepageUrl?: string | undefined, description?: string | undefined, image?: { __typename?: 'Image', url: string } | undefined, nftContracts?: Array<{ __typename?: 'NftContract', address: string, standard?: NftStandard | undefined }> | undefined } | undefined, listings?: { __typename?: 'NftOrderConnection', edges: Array<{ __typename?: 'NftOrderEdge', cursor: string, node: { __typename?: 'NftOrder', address: string, createdAt: number, endAt?: number | undefined, id: string, maker: string, marketplace: NftMarketplace, marketplaceUrl: string, orderHash?: string | undefined, quantity: number, startAt: number, status: OrderStatus, taker?: string | undefined, tokenId?: string | undefined, type: OrderType, protocolParameters?: any | undefined, price: { __typename?: 'Amount', currency?: Currency | undefined, value: number } } }> } | undefined, rarities?: Array<{ __typename?: 'NftAssetRarity', provider?: NftRarityProvider | undefined, rank?: number | undefined, score?: number | undefined }> | undefined, traits?: Array<{ __typename?: 'NftAssetTrait', name?: string | undefined, value?: string | undefined }> | undefined } }> } | undefined };

export type NftActivityQueryVariables = Exact<{
  filter?: InputMaybe<NftActivityFilterInput>;
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
}>;


export type NftActivityQuery = { __typename?: 'Query', nftActivity?: { __typename?: 'NftActivityConnection', edges: Array<{ __typename?: 'NftActivityEdge', node: { __typename?: 'NftActivity', id: string, address: string, tokenId?: string | undefined, type: NftActivityType, marketplace?: string | undefined, fromAddress: string, toAddress?: string | undefined, transactionHash?: string | undefined, orderStatus?: OrderStatus | undefined, quantity?: number | undefined, url?: string | undefined, timestamp: number, asset?: { __typename?: 'NftAsset', id: string, metadataUrl?: string | undefined, name?: string | undefined, suspiciousFlag?: boolean | undefined, image?: { __typename?: 'Image', id: string, url: string } | undefined, smallImage?: { __typename?: 'Image', id: string, url: string } | undefined, rarities?: Array<{ __typename?: 'NftAssetRarity', id: string, provider?: NftRarityProvider | undefined, rank?: number | undefined, score?: number | undefined }> | undefined, nftContract?: { __typename?: 'NftContract', id: string, standard?: NftStandard | undefined } | undefined, collection?: { __typename?: 'NftCollection', id: string, image?: { __typename?: 'Image', id: string, url: string } | undefined } | undefined } | undefined, price?: { __typename?: 'Amount', id: string, value: number } | undefined } }>, pageInfo: { __typename?: 'PageInfo', endCursor?: string | undefined, hasNextPage?: boolean | undefined, hasPreviousPage?: boolean | undefined, startCursor?: string | undefined } } | undefined };

export type NftBalanceQueryVariables = Exact<{
  ownerAddress: Scalars['String'];
  filter?: InputMaybe<NftBalancesFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  last?: InputMaybe<Scalars['Int']>;
  before?: InputMaybe<Scalars['String']>;
}>;


export type NftBalanceQuery = { __typename?: 'Query', nftBalances?: { __typename?: 'NftBalanceConnection', edges: Array<{ __typename?: 'NftBalanceEdge', node: { __typename?: 'NftBalance', listedMarketplaces?: Array<NftMarketplace> | undefined, ownedAsset?: { __typename?: 'NftAsset', id: string, animationUrl?: string | undefined, description?: string | undefined, flaggedBy?: string | undefined, name?: string | undefined, ownerAddress?: string | undefined, suspiciousFlag?: boolean | undefined, tokenId: string, collection?: { __typename?: 'NftCollection', id: string, isVerified?: boolean | undefined, name?: string | undefined, twitterName?: string | undefined, image?: { __typename?: 'Image', id: string, url: string } | undefined, nftContracts?: Array<{ __typename?: 'NftContract', id: string, address: string, chain: Chain, name?: string | undefined, standard?: NftStandard | undefined, symbol?: string | undefined, totalSupply?: number | undefined }> | undefined, markets?: Array<{ __typename?: 'NftCollectionMarket', id: string, floorPrice?: { __typename?: 'TimestampedAmount', id: string, value: number } | undefined }> | undefined } | undefined, image?: { __typename?: 'Image', id: string, url: string } | undefined, originalImage?: { __typename?: 'Image', id: string, url: string } | undefined, smallImage?: { __typename?: 'Image', id: string, url: string } | undefined, thumbnail?: { __typename?: 'Image', id: string, url: string } | undefined, listings?: { __typename?: 'NftOrderConnection', edges: Array<{ __typename?: 'NftOrderEdge', node: { __typename?: 'NftOrder', createdAt: number, marketplace: NftMarketplace, endAt?: number | undefined, price: { __typename?: 'Amount', id: string, value: number, currency?: Currency | undefined } } }> } | undefined } | undefined, listingFees?: Array<{ __typename?: 'NftFee', id: string, payoutAddress: string, basisPoints: number } | undefined> | undefined, lastPrice?: { __typename?: 'TimestampedAmount', id: string, currency?: Currency | undefined, timestamp: number, value: number } | undefined } }>, pageInfo: { __typename?: 'PageInfo', endCursor?: string | undefined, hasNextPage?: boolean | undefined, hasPreviousPage?: boolean | undefined, startCursor?: string | undefined } } | undefined };

export type NftRouteQueryVariables = Exact<{
  chain?: InputMaybe<Chain>;
  senderAddress: Scalars['String'];
  nftTrades: Array<NftTradeInput> | NftTradeInput;
  tokenTrades?: InputMaybe<Array<TokenTradeInput> | TokenTradeInput>;
}>;


export type NftRouteQuery = { __typename?: 'Query', nftRoute?: { __typename?: 'NftRouteResponse', id: string, calldata: string, toAddress: string, route?: Array<{ __typename?: 'NftTrade', amount: number, contractAddress: string, id: string, marketplace: NftMarketplace, tokenId: string, tokenType?: NftStandard | undefined, price: { __typename?: 'TokenAmount', id: string, currency: Currency, value: string }, quotePrice?: { __typename?: 'TokenAmount', id: string, currency: Currency, value: string } | undefined }> | undefined, sendAmount: { __typename?: 'TokenAmount', id: string, currency: Currency, value: string } } | undefined };

export type NftUniversalRouterAddressQueryVariables = Exact<{
  chain?: InputMaybe<Chain>;
}>;


export type NftUniversalRouterAddressQuery = { __typename?: 'Query', nftRoute?: { __typename?: 'NftRouteResponse', toAddress: string } | undefined };

export type TrendingCollectionsQueryVariables = Exact<{
  size?: InputMaybe<Scalars['Int']>;
  timePeriod?: InputMaybe<HistoryDuration>;
}>;


export type TrendingCollectionsQuery = { __typename?: 'Query', topCollections?: { __typename?: 'NftCollectionConnection', edges: Array<{ __typename?: 'NftCollectionEdge', node: { __typename?: 'NftCollection', name?: string | undefined, isVerified?: boolean | undefined, nftContracts?: Array<{ __typename?: 'NftContract', address: string, totalSupply?: number | undefined }> | undefined, image?: { __typename?: 'Image', url: string } | undefined, bannerImage?: { __typename?: 'Image', url: string } | undefined, markets?: Array<{ __typename?: 'NftCollectionMarket', owners?: number | undefined, floorPrice?: { __typename?: 'TimestampedAmount', value: number } | undefined, totalVolume?: { __typename?: 'TimestampedAmount', value: number } | undefined, volume?: { __typename?: 'TimestampedAmount', value: number } | undefined, volumePercentChange?: { __typename?: 'TimestampedAmount', value: number } | undefined, floorPricePercentChange?: { __typename?: 'TimestampedAmount', value: number } | undefined, sales?: { __typename?: 'TimestampedAmount', value: number } | undefined, listings?: { __typename?: 'TimestampedAmount', value: number } | undefined }> | undefined } }> } | undefined };

export type AssetQueryVariables = Exact<{
  address: Scalars['String'];
  orderBy?: InputMaybe<NftAssetSortableField>;
  asc?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<NftAssetsFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  last?: InputMaybe<Scalars['Int']>;
  before?: InputMaybe<Scalars['String']>;
}>;


export type AssetQuery = { __typename?: 'Query', nftAssets?: { __typename?: 'NftAssetConnection', totalCount?: number | undefined, edges: Array<{ __typename?: 'NftAssetEdge', cursor: string, node: { __typename?: 'NftAsset', id: string, name?: string | undefined, tokenId: string, animationUrl?: string | undefined, suspiciousFlag?: boolean | undefined, image?: { __typename?: 'Image', url: string } | undefined, smallImage?: { __typename?: 'Image', url: string } | undefined, collection?: { __typename?: 'NftCollection', name?: string | undefined, isVerified?: boolean | undefined, nftContracts?: Array<{ __typename?: 'NftContract', address: string, standard?: NftStandard | undefined }> | undefined } | undefined, listings?: { __typename?: 'NftOrderConnection', edges: Array<{ __typename?: 'NftOrderEdge', cursor: string, node: { __typename?: 'NftOrder', address: string, createdAt: number, endAt?: number | undefined, id: string, maker: string, marketplace: NftMarketplace, marketplaceUrl: string, orderHash?: string | undefined, quantity: number, startAt: number, status: OrderStatus, taker?: string | undefined, tokenId?: string | undefined, type: OrderType, protocolParameters?: any | undefined, price: { __typename?: 'Amount', currency?: Currency | undefined, value: number } } }> } | undefined, rarities?: Array<{ __typename?: 'NftAssetRarity', rank?: number | undefined }> | undefined } }>, pageInfo: { __typename?: 'PageInfo', endCursor?: string | undefined, hasNextPage?: boolean | undefined, hasPreviousPage?: boolean | undefined, startCursor?: string | undefined } } | undefined };

export type CollectionQueryVariables = Exact<{
  addresses: Array<Scalars['String']> | Scalars['String'];
}>;


export type CollectionQuery = { __typename?: 'Query', nftCollections?: { __typename?: 'NftCollectionConnection', edges: Array<{ __typename?: 'NftCollectionEdge', cursor: string, node: { __typename?: 'NftCollection', collectionId: string, description?: string | undefined, discordUrl?: string | undefined, homepageUrl?: string | undefined, instagramName?: string | undefined, isVerified?: boolean | undefined, name?: string | undefined, numAssets?: number | undefined, twitterName?: string | undefined, bannerImage?: { __typename?: 'Image', url: string } | undefined, image?: { __typename?: 'Image', url: string } | undefined, nftContracts?: Array<{ __typename?: 'NftContract', address: string, chain: Chain, name?: string | undefined, standard?: NftStandard | undefined, symbol?: string | undefined, totalSupply?: number | undefined }> | undefined, traits?: Array<{ __typename?: 'NftCollectionTrait', name?: string | undefined, values?: Array<string> | undefined, stats?: Array<{ __typename?: 'NftCollectionTraitStats', name?: string | undefined, value?: string | undefined, assets?: number | undefined, listings?: number | undefined }> | undefined }> | undefined, markets?: Array<{ __typename?: 'NftCollectionMarket', owners?: number | undefined, floorPrice?: { __typename?: 'TimestampedAmount', currency?: Currency | undefined, value: number } | undefined, totalVolume?: { __typename?: 'TimestampedAmount', value: number, currency?: Currency | undefined } | undefined, listings?: { __typename?: 'TimestampedAmount', value: number } | undefined, volume?: { __typename?: 'TimestampedAmount', value: number, currency?: Currency | undefined } | undefined, volumePercentChange?: { __typename?: 'TimestampedAmount', value: number, currency?: Currency | undefined } | undefined, floorPricePercentChange?: { __typename?: 'TimestampedAmount', value: number, currency?: Currency | undefined } | undefined, marketplaces?: Array<{ __typename?: 'NftCollectionMarketplace', marketplace?: NftMarketplace | undefined, listings?: number | undefined, floorPrice?: number | undefined }> | undefined }> | undefined } }>, pageInfo: { __typename?: 'PageInfo', endCursor?: string | undefined, hasNextPage?: boolean | undefined, hasPreviousPage?: boolean | undefined, startCursor?: string | undefined } } | undefined };

export type PoolTokenFragment = { __typename?: 'Token', id: string, address?: string | undefined, name?: string | undefined, symbol?: string | undefined, chain: Chain, decimals?: number | undefined, project?: { __typename?: 'TokenProject', id: string, logo?: { __typename?: 'Image', id: string, url: string } | undefined } | undefined };

export type V3PoolQueryVariables = Exact<{
  chain: Chain;
  address: Scalars['String'];
}>;


export type V3PoolQuery = { __typename?: 'Query', v3Pool?: { __typename?: 'V3Pool', id: string, protocolVersion: ProtocolVersion, address: string, feeTier?: number | undefined, token0Supply?: number | undefined, token1Supply?: number | undefined, txCount?: number | undefined, token0?: { __typename?: 'Token', id: string, address?: string | undefined, name?: string | undefined, symbol?: string | undefined, chain: Chain, decimals?: number | undefined, project?: { __typename?: 'TokenProject', id: string, markets?: Array<{ __typename?: 'TokenProjectMarket', id: string, price?: { __typename?: 'Amount', id: string, value: number } | undefined } | undefined> | undefined, logo?: { __typename?: 'Image', id: string, url: string } | undefined } | undefined } | undefined, token1?: { __typename?: 'Token', id: string, address?: string | undefined, name?: string | undefined, symbol?: string | undefined, chain: Chain, decimals?: number | undefined, project?: { __typename?: 'TokenProject', id: string, markets?: Array<{ __typename?: 'TokenProjectMarket', id: string, price?: { __typename?: 'Amount', id: string, value: number } | undefined } | undefined> | undefined, logo?: { __typename?: 'Image', id: string, url: string } | undefined } | undefined } | undefined, volume24h?: { __typename?: 'Amount', value: number } | undefined, historicalVolume?: Array<{ __typename?: 'TimestampedAmount', value: number, timestamp: number } | undefined> | undefined, totalLiquidity?: { __typename?: 'Amount', value: number } | undefined, totalLiquidityPercentChange24h?: { __typename?: 'Amount', value: number } | undefined } | undefined };

export type PoolPriceHistoryQueryVariables = Exact<{
  chain: Chain;
  address: Scalars['String'];
  duration: HistoryDuration;
  isV3: Scalars['Boolean'];
}>;


export type PoolPriceHistoryQuery = { __typename?: 'Query', v3Pool?: { __typename?: 'V3Pool', id: string, priceHistory?: Array<{ __typename?: 'TimestampedPoolPrice', id: string, token0Price: number, token1Price: number, timestamp: number } | undefined> | undefined } | undefined, v2Pair?: { __typename?: 'V2Pair', id: string, priceHistory?: Array<{ __typename?: 'TimestampedPoolPrice', id: string, token0Price: number, token1Price: number, timestamp: number } | undefined> | undefined } | undefined };

export type PoolVolumeHistoryQueryVariables = Exact<{
  chain: Chain;
  address: Scalars['String'];
  duration: HistoryDuration;
  isV3: Scalars['Boolean'];
}>;


export type PoolVolumeHistoryQuery = { __typename?: 'Query', v3Pool?: { __typename?: 'V3Pool', id: string, historicalVolume?: Array<{ __typename?: 'TimestampedAmount', id: string, value: number, timestamp: number } | undefined> | undefined } | undefined, v2Pair?: { __typename?: 'V2Pair', id: string, historicalVolume?: Array<{ __typename?: 'TimestampedAmount', id: string, value: number, timestamp: number } | undefined> | undefined } | undefined };

export type V2PairQueryVariables = Exact<{
  address: Scalars['String'];
}>;


export type V2PairQuery = { __typename?: 'Query', v2Pair?: { __typename?: 'V2Pair', id: string, protocolVersion: ProtocolVersion, address: string, token0Supply?: number | undefined, token1Supply?: number | undefined, txCount?: number | undefined, token0?: { __typename?: 'Token', id: string, address?: string | undefined, name?: string | undefined, symbol?: string | undefined, chain: Chain, decimals?: number | undefined, project?: { __typename?: 'TokenProject', id: string, markets?: Array<{ __typename?: 'TokenProjectMarket', id: string, price?: { __typename?: 'Amount', id: string, value: number } | undefined } | undefined> | undefined, logo?: { __typename?: 'Image', id: string, url: string } | undefined } | undefined } | undefined, token1?: { __typename?: 'Token', id: string, address?: string | undefined, name?: string | undefined, symbol?: string | undefined, chain: Chain, decimals?: number | undefined, project?: { __typename?: 'TokenProject', id: string, markets?: Array<{ __typename?: 'TokenProjectMarket', id: string, price?: { __typename?: 'Amount', id: string, value: number } | undefined } | undefined> | undefined, logo?: { __typename?: 'Image', id: string, url: string } | undefined } | undefined } | undefined, volume24h?: { __typename?: 'Amount', value: number } | undefined, historicalVolume?: Array<{ __typename?: 'TimestampedAmount', value: number, timestamp: number } | undefined> | undefined, totalLiquidity?: { __typename?: 'Amount', value: number } | undefined, totalLiquidityPercentChange24h?: { __typename?: 'Amount', value: number } | undefined } | undefined };

export type PoolTransactionTokenFragment = { __typename?: 'Token', id: string, address?: string | undefined, symbol?: string | undefined, chain: Chain, decimals?: number | undefined, project?: { __typename?: 'TokenProject', id: string, name?: string | undefined, logo?: { __typename?: 'Image', id: string, url: string } | undefined } | undefined };

export type V3PoolTransactionsQueryVariables = Exact<{
  chain: Chain;
  address: Scalars['String'];
  first: Scalars['Int'];
  cursor?: InputMaybe<Scalars['Int']>;
}>;


export type V3PoolTransactionsQuery = { __typename?: 'Query', v3Pool?: { __typename?: 'V3Pool', id: string, transactions?: Array<{ __typename?: 'PoolTransaction', timestamp: number, hash: string, account: string, token0Quantity: string, token1Quantity: string, type: PoolTransactionType, token0: { __typename?: 'Token', id: string, address?: string | undefined, symbol?: string | undefined, chain: Chain, decimals?: number | undefined, project?: { __typename?: 'TokenProject', id: string, name?: string | undefined, logo?: { __typename?: 'Image', id: string, url: string } | undefined } | undefined }, token1: { __typename?: 'Token', id: string, address?: string | undefined, symbol?: string | undefined, chain: Chain, decimals?: number | undefined, project?: { __typename?: 'TokenProject', id: string, name?: string | undefined, logo?: { __typename?: 'Image', id: string, url: string } | undefined } | undefined }, usdValue: { __typename?: 'Amount', value: number } } | undefined> | undefined } | undefined };

export type V2PairTransactionsQueryVariables = Exact<{
  address: Scalars['String'];
  first: Scalars['Int'];
  cursor?: InputMaybe<Scalars['Int']>;
}>;


export type V2PairTransactionsQuery = { __typename?: 'Query', v2Pair?: { __typename?: 'V2Pair', id: string, transactions?: Array<{ __typename?: 'PoolTransaction', timestamp: number, hash: string, account: string, token0Quantity: string, token1Quantity: string, type: PoolTransactionType, token0: { __typename?: 'Token', id: string, address?: string | undefined, symbol?: string | undefined, chain: Chain, decimals?: number | undefined, project?: { __typename?: 'TokenProject', id: string, name?: string | undefined, logo?: { __typename?: 'Image', id: string, url: string } | undefined } | undefined }, token1: { __typename?: 'Token', id: string, address?: string | undefined, symbol?: string | undefined, chain: Chain, decimals?: number | undefined, project?: { __typename?: 'TokenProject', id: string, name?: string | undefined, logo?: { __typename?: 'Image', id: string, url: string } | undefined } | undefined }, usdValue: { __typename?: 'Amount', value: number } } | undefined> | undefined } | undefined };

export type PortfolioTokenBalancePartsFragment = { __typename?: 'TokenBalance', id: string, quantity?: number | undefined, denominatedValue?: { __typename?: 'Amount', id: string, currency?: Currency | undefined, value: number } | undefined, token?: { __typename?: 'Token', id: string, chain: Chain, address?: string | undefined, name?: string | undefined, symbol?: string | undefined, standard?: TokenStandard | undefined, decimals?: number | undefined } | undefined, tokenProjectMarket?: { __typename?: 'TokenProjectMarket', id: string, pricePercentChange?: { __typename?: 'Amount', id: string, value: number } | undefined, tokenProject: { __typename?: 'TokenProject', id: string, logoUrl?: string | undefined, isSpam?: boolean | undefined } } | undefined };

export type PortfolioBalancesWebQueryVariables = Exact<{
  ownerAddress: Scalars['String'];
  chains: Array<Chain> | Chain;
}>;


export type PortfolioBalancesWebQuery = { __typename?: 'Query', portfolios?: Array<{ __typename?: 'Portfolio', id: string, tokensTotalDenominatedValue?: { __typename?: 'Amount', id: string, value: number } | undefined, tokensTotalDenominatedValueChange?: { __typename?: 'AmountChange', absolute?: { __typename?: 'Amount', id: string, value: number } | undefined, percentage?: { __typename?: 'Amount', id: string, value: number } | undefined } | undefined, tokenBalances?: Array<{ __typename?: 'TokenBalance', id: string, quantity?: number | undefined, denominatedValue?: { __typename?: 'Amount', id: string, currency?: Currency | undefined, value: number } | undefined, token?: { __typename?: 'Token', id: string, chain: Chain, address?: string | undefined, name?: string | undefined, symbol?: string | undefined, standard?: TokenStandard | undefined, decimals?: number | undefined } | undefined, tokenProjectMarket?: { __typename?: 'TokenProjectMarket', id: string, pricePercentChange?: { __typename?: 'Amount', id: string, value: number } | undefined, tokenProject: { __typename?: 'TokenProject', id: string, logoUrl?: string | undefined, isSpam?: boolean | undefined } } | undefined } | undefined> | undefined } | undefined> | undefined };

export type TrendingTokensQueryVariables = Exact<{
  chain: Chain;
}>;


export type TrendingTokensQuery = { __typename?: 'Query', topTokens?: Array<{ __typename?: 'Token', id: string, decimals?: number | undefined, name?: string | undefined, chain: Chain, standard?: TokenStandard | undefined, address?: string | undefined, symbol?: string | undefined, market?: { __typename?: 'TokenMarket', id: string, price?: { __typename?: 'Amount', id: string, value: number, currency?: Currency | undefined } | undefined, pricePercentChange?: { __typename?: 'Amount', id: string, value: number } | undefined, volume24H?: { __typename?: 'Amount', id: string, value: number, currency?: Currency | undefined } | undefined } | undefined, project?: { __typename?: 'TokenProject', id: string, logoUrl?: string | undefined, safetyLevel?: SafetyLevel | undefined } | undefined } | undefined> | undefined };

export type SearchTokensWebQueryVariables = Exact<{
  searchQuery: Scalars['String'];
  chains?: InputMaybe<Array<Chain> | Chain>;
}>;


export type SearchTokensWebQuery = { __typename?: 'Query', searchTokens?: Array<{ __typename?: 'Token', id: string, decimals?: number | undefined, name?: string | undefined, chain: Chain, standard?: TokenStandard | undefined, address?: string | undefined, symbol?: string | undefined, market?: { __typename?: 'TokenMarket', id: string, price?: { __typename?: 'Amount', id: string, value: number, currency?: Currency | undefined } | undefined, pricePercentChange?: { __typename?: 'Amount', id: string, value: number } | undefined, volume24H?: { __typename?: 'Amount', id: string, value: number, currency?: Currency | undefined } | undefined } | undefined, project?: { __typename?: 'TokenProject', id: string, logoUrl?: string | undefined, safetyLevel?: SafetyLevel | undefined, isSpam?: boolean | undefined } | undefined } | undefined> | undefined };

export type TopTokens100QueryVariables = Exact<{
  duration: HistoryDuration;
  chain: Chain;
}>;


export type TopTokens100Query = { __typename?: 'Query', topTokens?: Array<{ __typename?: 'Token', id: string, name?: string | undefined, chain: Chain, address?: string | undefined, symbol?: string | undefined, standard?: TokenStandard | undefined, market?: { __typename?: 'TokenMarket', id: string, totalValueLocked?: { __typename?: 'Amount', id: string, value: number, currency?: Currency | undefined } | undefined, price?: { __typename?: 'Amount', id: string, value: number, currency?: Currency | undefined } | undefined, pricePercentChange?: { __typename?: 'Amount', id: string, currency?: Currency | undefined, value: number } | undefined, pricePercentChange1Hour?: { __typename?: 'Amount', id: string, currency?: Currency | undefined, value: number } | undefined, pricePercentChange1Day?: { __typename?: 'Amount', id: string, currency?: Currency | undefined, value: number } | undefined, volume?: { __typename?: 'Amount', id: string, value: number, currency?: Currency | undefined } | undefined } | undefined, project?: { __typename?: 'TokenProject', id: string, logoUrl?: string | undefined, markets?: Array<{ __typename?: 'TokenProjectMarket', id: string, fullyDilutedValuation?: { __typename?: 'Amount', id: string, value: number, currency?: Currency | undefined } | undefined } | undefined> | undefined } | undefined } | undefined> | undefined };

export type TopTokensSparklineQueryVariables = Exact<{
  duration: HistoryDuration;
  chain: Chain;
}>;


export type TopTokensSparklineQuery = { __typename?: 'Query', topTokens?: Array<{ __typename?: 'Token', id: string, address?: string | undefined, chain: Chain, market?: { __typename?: 'TokenMarket', id: string, priceHistory?: Array<{ __typename?: 'TimestampedAmount', id: string, timestamp: number, value: number } | undefined> | undefined } | undefined } | undefined> | undefined };

export type TokenWebQueryVariables = Exact<{
  chain: Chain;
  address?: InputMaybe<Scalars['String']>;
}>;


export type TokenWebQuery = { __typename?: 'Query', token?: { __typename?: 'Token', id: string, decimals?: number | undefined, name?: string | undefined, chain: Chain, address?: string | undefined, symbol?: string | undefined, standard?: TokenStandard | undefined, market?: { __typename?: 'TokenMarket', id: string, totalValueLocked?: { __typename?: 'Amount', id: string, value: number, currency?: Currency | undefined } | undefined, price?: { __typename?: 'Amount', id: string, value: number, currency?: Currency | undefined } | undefined, volume24H?: { __typename?: 'Amount', id: string, value: number, currency?: Currency | undefined } | undefined, priceHigh52W?: { __typename?: 'Amount', id: string, value: number } | undefined, priceLow52W?: { __typename?: 'Amount', id: string, value: number } | undefined } | undefined, project?: { __typename?: 'TokenProject', id: string, description?: string | undefined, homepageUrl?: string | undefined, twitterName?: string | undefined, logoUrl?: string | undefined, tokens: Array<{ __typename?: 'Token', id: string, chain: Chain, address?: string | undefined }>, markets?: Array<{ __typename?: 'TokenProjectMarket', id: string, fullyDilutedValuation?: { __typename?: 'Amount', id: string, value: number, currency?: Currency | undefined } | undefined, marketCap?: { __typename?: 'Amount', id: string, value: number, currency?: Currency | undefined } | undefined } | undefined> | undefined } | undefined } | undefined };

export type TokenProjectWebQueryVariables = Exact<{
  chain: Chain;
  address?: InputMaybe<Scalars['String']>;
}>;


export type TokenProjectWebQuery = { __typename?: 'Query', token?: { __typename?: 'Token', id: string, decimals?: number | undefined, name?: string | undefined, chain: Chain, address?: string | undefined, symbol?: string | undefined, standard?: TokenStandard | undefined, project?: { __typename?: 'TokenProject', id: string, description?: string | undefined, homepageUrl?: string | undefined, twitterName?: string | undefined, logoUrl?: string | undefined, tokens: Array<{ __typename?: 'Token', id: string, chain: Chain, address?: string | undefined }> } | undefined } | undefined };

export type CandlestickOhlcFragment = { __typename?: 'TimestampedOhlc', id: string, timestamp: number, open: { __typename?: 'Amount', id: string, value: number }, high: { __typename?: 'Amount', id: string, value: number }, low: { __typename?: 'Amount', id: string, value: number }, close: { __typename?: 'Amount', id: string, value: number } };

export type PriceHistoryFallbackFragment = { __typename?: 'TimestampedAmount', id: string, value: number, timestamp: number };

export type TokenPriceQueryVariables = Exact<{
  chain: Chain;
  address?: InputMaybe<Scalars['String']>;
  duration: HistoryDuration;
  fallback?: InputMaybe<Scalars['Boolean']>;
}>;


export type TokenPriceQuery = { __typename?: 'Query', token?: { __typename?: 'Token', id: string, address?: string | undefined, chain: Chain, market?: { __typename?: 'TokenMarket', id: string, price?: { __typename?: 'Amount', id: string, value: number } | undefined, ohlc?: Array<{ __typename?: 'TimestampedOhlc', id: string, timestamp: number, open: { __typename?: 'Amount', id: string, value: number }, high: { __typename?: 'Amount', id: string, value: number }, low: { __typename?: 'Amount', id: string, value: number }, close: { __typename?: 'Amount', id: string, value: number } } | undefined> | undefined, priceHistory?: Array<{ __typename?: 'TimestampedAmount', id: string, value: number, timestamp: number } | undefined> | undefined } | undefined } | undefined };

export type TokenHistoricalVolumesQueryVariables = Exact<{
  chain: Chain;
  address?: InputMaybe<Scalars['String']>;
  duration: HistoryDuration;
}>;


export type TokenHistoricalVolumesQuery = { __typename?: 'Query', token?: { __typename?: 'Token', id: string, address?: string | undefined, chain: Chain, market?: { __typename?: 'TokenMarket', id: string, historicalVolume?: Array<{ __typename?: 'TimestampedAmount', id: string, timestamp: number, value: number } | undefined> | undefined } | undefined } | undefined };

export type TokenHistoricalTvlsQueryVariables = Exact<{
  chain: Chain;
  address?: InputMaybe<Scalars['String']>;
  duration: HistoryDuration;
}>;


export type TokenHistoricalTvlsQuery = { __typename?: 'Query', token?: { __typename?: 'Token', id: string, address?: string | undefined, chain: Chain, market?: { __typename?: 'TokenMarket', id: string, historicalTvl?: Array<{ __typename?: 'TimestampedAmount', id: string, timestamp: number, value: number } | undefined> | undefined, totalValueLocked?: { __typename?: 'Amount', id: string, value: number, currency?: Currency | undefined } | undefined } | undefined } | undefined };

export type V3TokenTransactionsQueryVariables = Exact<{
  chain: Chain;
  address: Scalars['String'];
  first: Scalars['Int'];
  cursor?: InputMaybe<Scalars['Int']>;
}>;


export type V3TokenTransactionsQuery = { __typename?: 'Query', token?: { __typename?: 'Token', id: string, address?: string | undefined, symbol?: string | undefined, chain: Chain, decimals?: number | undefined, v3Transactions?: Array<{ __typename?: 'PoolTransaction', timestamp: number, hash: string, account: string, token0Quantity: string, token1Quantity: string, type: PoolTransactionType, token0: { __typename?: 'Token', id: string, address?: string | undefined, symbol?: string | undefined, chain: Chain, decimals?: number | undefined, project?: { __typename?: 'TokenProject', id: string, name?: string | undefined, tokens: Array<{ __typename?: 'Token', id: string, address?: string | undefined, symbol?: string | undefined, chain: Chain }>, logo?: { __typename?: 'Image', id: string, url: string } | undefined } | undefined }, token1: { __typename?: 'Token', id: string, address?: string | undefined, symbol?: string | undefined, chain: Chain, decimals?: number | undefined, project?: { __typename?: 'TokenProject', id: string, name?: string | undefined, tokens: Array<{ __typename?: 'Token', id: string, address?: string | undefined, symbol?: string | undefined, chain: Chain }>, logo?: { __typename?: 'Image', id: string, url: string } | undefined } | undefined }, usdValue: { __typename?: 'Amount', value: number } } | undefined> | undefined, project?: { __typename?: 'TokenProject', id: string, name?: string | undefined, tokens: Array<{ __typename?: 'Token', id: string, address?: string | undefined, symbol?: string | undefined, chain: Chain }>, logo?: { __typename?: 'Image', id: string, url: string } | undefined } | undefined } | undefined };

export type V2TokenTransactionsQueryVariables = Exact<{
  address: Scalars['String'];
  first: Scalars['Int'];
  cursor?: InputMaybe<Scalars['Int']>;
}>;


export type V2TokenTransactionsQuery = { __typename?: 'Query', token?: { __typename?: 'Token', id: string, address?: string | undefined, symbol?: string | undefined, chain: Chain, decimals?: number | undefined, v2Transactions?: Array<{ __typename?: 'PoolTransaction', timestamp: number, hash: string, account: string, token0Quantity: string, token1Quantity: string, type: PoolTransactionType, token0: { __typename?: 'Token', id: string, address?: string | undefined, symbol?: string | undefined, chain: Chain, decimals?: number | undefined, project?: { __typename?: 'TokenProject', id: string, name?: string | undefined, tokens: Array<{ __typename?: 'Token', id: string, address?: string | undefined, symbol?: string | undefined, chain: Chain }>, logo?: { __typename?: 'Image', id: string, url: string } | undefined } | undefined }, token1: { __typename?: 'Token', id: string, address?: string | undefined, symbol?: string | undefined, chain: Chain, decimals?: number | undefined, project?: { __typename?: 'TokenProject', id: string, name?: string | undefined, tokens: Array<{ __typename?: 'Token', id: string, address?: string | undefined, symbol?: string | undefined, chain: Chain }>, logo?: { __typename?: 'Image', id: string, url: string } | undefined } | undefined }, usdValue: { __typename?: 'Amount', value: number } } | undefined> | undefined, project?: { __typename?: 'TokenProject', id: string, name?: string | undefined, tokens: Array<{ __typename?: 'Token', id: string, address?: string | undefined, symbol?: string | undefined, chain: Chain }>, logo?: { __typename?: 'Image', id: string, url: string } | undefined } | undefined } | undefined };

export type TopV3PoolsQueryVariables = Exact<{
  chain: Chain;
  first: Scalars['Int'];
  cursor?: InputMaybe<Scalars['Float']>;
  tokenAddress?: InputMaybe<Scalars['String']>;
}>;


export type TopV3PoolsQuery = { __typename?: 'Query', topV3Pools?: Array<{ __typename?: 'V3Pool', id: string, protocolVersion: ProtocolVersion, address: string, feeTier?: number | undefined, txCount?: number | undefined, totalLiquidity?: { __typename?: 'Amount', value: number } | undefined, token0?: { __typename?: 'Token', id: string, address?: string | undefined, name?: string | undefined, symbol?: string | undefined, chain: Chain, decimals?: number | undefined, project?: { __typename?: 'TokenProject', id: string, logo?: { __typename?: 'Image', id: string, url: string } | undefined } | undefined } | undefined, token1?: { __typename?: 'Token', id: string, address?: string | undefined, name?: string | undefined, symbol?: string | undefined, chain: Chain, decimals?: number | undefined, project?: { __typename?: 'TokenProject', id: string, logo?: { __typename?: 'Image', id: string, url: string } | undefined } | undefined } | undefined, volume24h?: { __typename?: 'Amount', value: number } | undefined, volumeWeek?: { __typename?: 'Amount', value: number } | undefined }> | undefined };

export type TopV2PairsQueryVariables = Exact<{
  first: Scalars['Int'];
  cursor?: InputMaybe<Scalars['Float']>;
  tokenAddress?: InputMaybe<Scalars['String']>;
}>;


export type TopV2PairsQuery = { __typename?: 'Query', topV2Pairs?: Array<{ __typename?: 'V2Pair', id: string, protocolVersion: ProtocolVersion, address: string, txCount?: number | undefined, totalLiquidity?: { __typename?: 'Amount', value: number } | undefined, token0?: { __typename?: 'Token', id: string, address?: string | undefined, name?: string | undefined, symbol?: string | undefined, chain: Chain, decimals?: number | undefined, project?: { __typename?: 'TokenProject', id: string, logo?: { __typename?: 'Image', id: string, url: string } | undefined } | undefined } | undefined, token1?: { __typename?: 'Token', id: string, address?: string | undefined, name?: string | undefined, symbol?: string | undefined, chain: Chain, decimals?: number | undefined, project?: { __typename?: 'TokenProject', id: string, logo?: { __typename?: 'Image', id: string, url: string } | undefined } | undefined } | undefined, volume24h?: { __typename?: 'Amount', value: number } | undefined, volumeWeek?: { __typename?: 'Amount', value: number } | undefined }> | undefined };

export type TransactionTokenFragment = { __typename?: 'Token', id: string, address?: string | undefined, symbol?: string | undefined, chain: Chain, decimals?: number | undefined, project?: { __typename?: 'TokenProject', id: string, name?: string | undefined, tokens: Array<{ __typename?: 'Token', id: string, address?: string | undefined, symbol?: string | undefined, chain: Chain }>, logo?: { __typename?: 'Image', id: string, url: string } | undefined } | undefined };

export type V3TransactionsQueryVariables = Exact<{
  chain: Chain;
  first: Scalars['Int'];
  cursor?: InputMaybe<Scalars['Int']>;
}>;


export type V3TransactionsQuery = { __typename?: 'Query', v3Transactions?: Array<{ __typename?: 'PoolTransaction', id: string, chain: Chain, protocolVersion: ProtocolVersion, timestamp: number, hash: string, account: string, token0Quantity: string, token1Quantity: string, type: PoolTransactionType, token0: { __typename?: 'Token', id: string, address?: string | undefined, symbol?: string | undefined, chain: Chain, decimals?: number | undefined, project?: { __typename?: 'TokenProject', id: string, name?: string | undefined, tokens: Array<{ __typename?: 'Token', id: string, address?: string | undefined, symbol?: string | undefined, chain: Chain }>, logo?: { __typename?: 'Image', id: string, url: string } | undefined } | undefined }, token1: { __typename?: 'Token', id: string, address?: string | undefined, symbol?: string | undefined, chain: Chain, decimals?: number | undefined, project?: { __typename?: 'TokenProject', id: string, name?: string | undefined, tokens: Array<{ __typename?: 'Token', id: string, address?: string | undefined, symbol?: string | undefined, chain: Chain }>, logo?: { __typename?: 'Image', id: string, url: string } | undefined } | undefined }, usdValue: { __typename?: 'Amount', id: string, value: number } }> | undefined };

export type V2TransactionsQueryVariables = Exact<{
  first: Scalars['Int'];
  cursor?: InputMaybe<Scalars['Int']>;
}>;


export type V2TransactionsQuery = { __typename?: 'Query', v2Transactions?: Array<{ __typename?: 'PoolTransaction', id: string, chain: Chain, protocolVersion: ProtocolVersion, timestamp: number, hash: string, account: string, token0Quantity: string, token1Quantity: string, type: PoolTransactionType, token0: { __typename?: 'Token', id: string, address?: string | undefined, symbol?: string | undefined, chain: Chain, decimals?: number | undefined, project?: { __typename?: 'TokenProject', id: string, name?: string | undefined, tokens: Array<{ __typename?: 'Token', id: string, address?: string | undefined, symbol?: string | undefined, chain: Chain }>, logo?: { __typename?: 'Image', id: string, url: string } | undefined } | undefined }, token1: { __typename?: 'Token', id: string, address?: string | undefined, symbol?: string | undefined, chain: Chain, decimals?: number | undefined, project?: { __typename?: 'TokenProject', id: string, name?: string | undefined, tokens: Array<{ __typename?: 'Token', id: string, address?: string | undefined, symbol?: string | undefined, chain: Chain }>, logo?: { __typename?: 'Image', id: string, url: string } | undefined } | undefined }, usdValue: { __typename?: 'Amount', id: string, value: number } } | undefined> | undefined };

export const TopTokenPartsFragmentDoc = gql`
    fragment TopTokenParts on Token {
  symbol
  chain
  address
  market {
    id
    totalValueLocked {
      value
    }
    volume(duration: DAY) {
      value
    }
  }
  project {
    id
    name
    logoUrl
    markets(currencies: [USD]) {
      id
      price {
        value
      }
      pricePercentChange24h {
        value
      }
      marketCap {
        value
      }
    }
  }
}
    `;
export const TransactionPartsFragmentDoc = gql`
    fragment TransactionParts on Transaction {
  id
  blockNumber
  hash
  status
  to
  from
  nonce
}
    `;
export const TokenAssetPartsFragmentDoc = gql`
    fragment TokenAssetParts on Token {
  id
  name
  symbol
  address
  decimals
  chain
  standard
  project {
    id
    isSpam
    logo {
      id
      url
    }
  }
}
    `;
export const TokenTransferPartsFragmentDoc = gql`
    fragment TokenTransferParts on TokenTransfer {
  id
  asset {
    ...TokenAssetParts
  }
  tokenStandard
  quantity
  sender
  recipient
  direction
  transactedValue {
    id
    currency
    value
  }
}
    ${TokenAssetPartsFragmentDoc}`;
export const NftAssetPartsFragmentDoc = gql`
    fragment NFTAssetParts on NftAsset {
  id
  name
  isSpam
  nftContract {
    id
    chain
    address
  }
  tokenId
  image {
    id
    url
  }
  collection {
    id
    name
  }
}
    `;
export const NftTransferPartsFragmentDoc = gql`
    fragment NFTTransferParts on NftTransfer {
  id
  asset {
    ...NFTAssetParts
  }
  nftStandard
  sender
  recipient
  direction
}
    ${NftAssetPartsFragmentDoc}`;
export const TokenApprovalPartsFragmentDoc = gql`
    fragment TokenApprovalParts on TokenApproval {
  id
  asset {
    ...TokenAssetParts
  }
  tokenStandard
  approvedAddress
  quantity
}
    ${TokenAssetPartsFragmentDoc}`;
export const NftApprovalPartsFragmentDoc = gql`
    fragment NFTApprovalParts on NftApproval {
  id
  asset {
    ...NFTAssetParts
  }
  nftStandard
  approvedAddress
}
    ${NftAssetPartsFragmentDoc}`;
export const NftApproveForAllPartsFragmentDoc = gql`
    fragment NFTApproveForAllParts on NftApproveForAll {
  id
  asset {
    ...NFTAssetParts
  }
  nftStandard
  operatorAddress
  approved
}
    ${NftAssetPartsFragmentDoc}`;
export const TransactionDetailsPartsFragmentDoc = gql`
    fragment TransactionDetailsParts on TransactionDetails {
  id
  type
  from
  to
  hash
  nonce
  status: transactionStatus
  assetChanges {
    __typename
    ... on TokenTransfer {
      ...TokenTransferParts
    }
    ... on NftTransfer {
      ...NFTTransferParts
    }
    ... on TokenApproval {
      ...TokenApprovalParts
    }
    ... on NftApproval {
      ...NFTApprovalParts
    }
    ... on NftApproveForAll {
      ...NFTApproveForAllParts
    }
  }
}
    ${TokenTransferPartsFragmentDoc}
${NftTransferPartsFragmentDoc}
${TokenApprovalPartsFragmentDoc}
${NftApprovalPartsFragmentDoc}
${NftApproveForAllPartsFragmentDoc}`;
export const SwapOrderDetailsPartsFragmentDoc = gql`
    fragment SwapOrderDetailsParts on SwapOrderDetails {
  id
  offerer
  hash
  orderStatus: swapOrderStatus
  expiry
  swapOrderType
  encodedOrder
  inputToken {
    ...TokenAssetParts
  }
  inputTokenQuantity
  outputToken {
    ...TokenAssetParts
  }
  outputTokenQuantity
}
    ${TokenAssetPartsFragmentDoc}`;
export const AssetActivityPartsFragmentDoc = gql`
    fragment AssetActivityParts on AssetActivity {
  id
  timestamp
  chain
  details {
    __typename
    ... on TransactionDetails {
      ...TransactionDetailsParts
    }
    ... on SwapOrderDetails {
      ...SwapOrderDetailsParts
    }
  }
}
    ${TransactionDetailsPartsFragmentDoc}
${SwapOrderDetailsPartsFragmentDoc}`;
export const PoolTokenFragmentDoc = gql`
    fragment PoolToken on Token {
  id
  address
  name
  symbol
  chain
  decimals
  project {
    id
    logo {
      id
      url
    }
  }
}
    `;
export const PoolTransactionTokenFragmentDoc = gql`
    fragment PoolTransactionToken on Token {
  id
  address
  symbol
  chain
  decimals
  project {
    id
    name
    logo {
      id
      url
    }
  }
}
    `;
export const PortfolioTokenBalancePartsFragmentDoc = gql`
    fragment PortfolioTokenBalanceParts on TokenBalance {
  id
  quantity
  denominatedValue {
    id
    currency
    value
  }
  token {
    id
    chain
    address
    name
    symbol
    standard
    decimals
  }
  tokenProjectMarket {
    id
    pricePercentChange(duration: DAY) {
      id
      value
    }
    tokenProject {
      id
      logoUrl
      isSpam
    }
  }
}
    `;
export const CandlestickOhlcFragmentDoc = gql`
    fragment CandlestickOHLC on TimestampedOhlc {
  id
  timestamp
  open {
    id
    value
  }
  high {
    id
    value
  }
  low {
    id
    value
  }
  close {
    id
    value
  }
}
    `;
export const PriceHistoryFallbackFragmentDoc = gql`
    fragment PriceHistoryFallback on TimestampedAmount {
  id
  value
  timestamp
}
    `;
export const TransactionTokenFragmentDoc = gql`
    fragment TransactionToken on Token {
  id
  address
  symbol
  chain
  decimals
  project {
    id
    name
    tokens {
      id
      address
      symbol
      chain
    }
    logo {
      id
      url
    }
  }
}
    `;
export const NftsDocument = gql`
    query Nfts($ownerAddress: String!) {
  portfolios(ownerAddresses: [$ownerAddress]) {
    id
    nftBalances {
      id
      ownedAsset {
        id
        collection {
          id
          collectionId
          description
          image {
            id
            url
          }
          isVerified
          name
          numAssets
          markets(currencies: [USD]) {
            id
            floorPrice {
              value
            }
            owners
            volume24h {
              value
            }
            totalVolume {
              value
            }
          }
        }
        description
        image {
          id
          url
        }
        name
        nftContract {
          id
          address
          chain
          standard
        }
        thumbnail {
          id
          url
        }
        tokenId
        creator {
          id
          address
          username
        }
      }
    }
  }
}
    `;

/**
 * __useNftsQuery__
 *
 * To run a query within a React component, call `useNftsQuery` and pass it any options that fit your needs.
 * When your component renders, `useNftsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNftsQuery({
 *   variables: {
 *      ownerAddress: // value for 'ownerAddress'
 *   },
 * });
 */
export function useNftsQuery(baseOptions: Apollo.QueryHookOptions<NftsQuery, NftsQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<NftsQuery, NftsQueryVariables>(NftsDocument, options);
}
export function useNftsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NftsQuery, NftsQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<NftsQuery, NftsQueryVariables>(NftsDocument, options);
}
export type NftsQueryHookResult = ReturnType<typeof useNftsQuery>;
export type NftsLazyQueryHookResult = ReturnType<typeof useNftsLazyQuery>;
export type NftsQueryResult = Apollo.QueryResult<NftsQuery, NftsQueryVariables>;
export const NftItemScreenDocument = gql`
    query NFTItemScreen($contractAddress: String!, $filter: NftAssetsFilterInput, $activityFilter: NftActivityFilterInput) {
  nftAssets(address: $contractAddress, filter: $filter) {
    edges {
      node {
        id
        ownerAddress
        collection {
          id
          collectionId
          description
          image {
            id
            url
          }
          isVerified
          name
          numAssets
          markets(currencies: [USD]) {
            id
            floorPrice {
              value
            }
            owners
            totalVolume {
              value
            }
          }
          nftContracts {
            id
            address
          }
        }
        description
        image {
          id
          url
          dimensions {
            width
            height
          }
        }
        name
        nftContract {
          id
          address
          chain
          standard
        }
        tokenId
        creator {
          id
          address
          username
        }
        traits {
          id
          name
          rarity
          value
        }
        listings(first: 1) {
          edges {
            node {
              id
              price {
                currency
                value
              }
            }
          }
        }
      }
    }
  }
  nftActivity(filter: $activityFilter) {
    edges {
      node {
        id
        quantity
        price {
          currency
          value
        }
      }
    }
  }
}
    `;

/**
 * __useNftItemScreenQuery__
 *
 * To run a query within a React component, call `useNftItemScreenQuery` and pass it any options that fit your needs.
 * When your component renders, `useNftItemScreenQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNftItemScreenQuery({
 *   variables: {
 *      contractAddress: // value for 'contractAddress'
 *      filter: // value for 'filter'
 *      activityFilter: // value for 'activityFilter'
 *   },
 * });
 */
export function useNftItemScreenQuery(baseOptions: Apollo.QueryHookOptions<NftItemScreenQuery, NftItemScreenQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<NftItemScreenQuery, NftItemScreenQueryVariables>(NftItemScreenDocument, options);
}
export function useNftItemScreenLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NftItemScreenQuery, NftItemScreenQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<NftItemScreenQuery, NftItemScreenQueryVariables>(NftItemScreenDocument, options);
}
export type NftItemScreenQueryHookResult = ReturnType<typeof useNftItemScreenQuery>;
export type NftItemScreenLazyQueryHookResult = ReturnType<typeof useNftItemScreenLazyQuery>;
export type NftItemScreenQueryResult = Apollo.QueryResult<NftItemScreenQuery, NftItemScreenQueryVariables>;
export const NftCollectionScreenDocument = gql`
    query NftCollectionScreen($contractAddress: String!, $first: Int, $after: String) {
  nftCollections(filter: {addresses: [$contractAddress]}) {
    edges {
      node {
        id
        bannerImage {
          id
          url
        }
        isVerified
        numAssets
        description
        homepageUrl
        twitterName
        image {
          id
          url
        }
        name
        markets(currencies: [USD]) {
          id
          floorPrice {
            value
          }
          owners
          volume24h {
            value
          }
          totalVolume {
            value
          }
        }
      }
    }
  }
  nftAssets(
    address: $contractAddress
    first: $first
    after: $after
    orderBy: PRICE
    asc: true
  ) {
    edges {
      node {
        ownerAddress
        id
        name
        tokenId
        nftContract {
          id
          address
        }
        collection {
          id
          collectionId
          name
        }
        image {
          id
          url
          dimensions {
            width
            height
          }
        }
        listings(first: 1) {
          edges {
            node {
              id
              price {
                currency
                value
              }
            }
          }
        }
      }
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
  }
}
    `;

/**
 * __useNftCollectionScreenQuery__
 *
 * To run a query within a React component, call `useNftCollectionScreenQuery` and pass it any options that fit your needs.
 * When your component renders, `useNftCollectionScreenQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNftCollectionScreenQuery({
 *   variables: {
 *      contractAddress: // value for 'contractAddress'
 *      first: // value for 'first'
 *      after: // value for 'after'
 *   },
 * });
 */
export function useNftCollectionScreenQuery(baseOptions: Apollo.QueryHookOptions<NftCollectionScreenQuery, NftCollectionScreenQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<NftCollectionScreenQuery, NftCollectionScreenQueryVariables>(NftCollectionScreenDocument, options);
}
export function useNftCollectionScreenLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NftCollectionScreenQuery, NftCollectionScreenQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<NftCollectionScreenQuery, NftCollectionScreenQueryVariables>(NftCollectionScreenDocument, options);
}
export type NftCollectionScreenQueryHookResult = ReturnType<typeof useNftCollectionScreenQuery>;
export type NftCollectionScreenLazyQueryHookResult = ReturnType<typeof useNftCollectionScreenLazyQuery>;
export type NftCollectionScreenQueryResult = Apollo.QueryResult<NftCollectionScreenQuery, NftCollectionScreenQueryVariables>;
export const NftsTabDocument = gql`
    query NftsTab($ownerAddress: String!, $first: Int, $after: String, $filter: NftBalancesFilterInput) {
  nftBalances(
    ownerAddress: $ownerAddress
    first: $first
    after: $after
    filter: $filter
  ) {
    edges {
      node {
        ownedAsset {
          id
          collection {
            id
            name
            isVerified
            markets(currencies: [ETH]) {
              id
              floorPrice {
                value
              }
            }
          }
          image {
            id
            url
            dimensions {
              width
              height
            }
          }
          name
          tokenId
          description
          nftContract {
            id
            address
          }
          isSpam
        }
      }
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
  }
}
    `;

/**
 * __useNftsTabQuery__
 *
 * To run a query within a React component, call `useNftsTabQuery` and pass it any options that fit your needs.
 * When your component renders, `useNftsTabQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNftsTabQuery({
 *   variables: {
 *      ownerAddress: // value for 'ownerAddress'
 *      first: // value for 'first'
 *      after: // value for 'after'
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useNftsTabQuery(baseOptions: Apollo.QueryHookOptions<NftsTabQuery, NftsTabQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<NftsTabQuery, NftsTabQueryVariables>(NftsTabDocument, options);
}
export function useNftsTabLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NftsTabQuery, NftsTabQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<NftsTabQuery, NftsTabQueryVariables>(NftsTabDocument, options);
}
export type NftsTabQueryHookResult = ReturnType<typeof useNftsTabQuery>;
export type NftsTabLazyQueryHookResult = ReturnType<typeof useNftsTabLazyQuery>;
export type NftsTabQueryResult = Apollo.QueryResult<NftsTabQuery, NftsTabQueryVariables>;
export const PortfolioBalancesDocument = gql`
    query PortfolioBalances($ownerAddress: String!, $valueModifiers: [PortfolioValueModifier!]) {
  portfolios(
    ownerAddresses: [$ownerAddress]
    chains: [ETHEREUM, POLYGON, ARBITRUM, OPTIMISM, BASE, BNB, BLAST]
    valueModifiers: $valueModifiers
  ) {
    id
    tokensTotalDenominatedValue {
      value
    }
    tokensTotalDenominatedValueChange(duration: DAY) {
      absolute {
        value
      }
      percentage {
        value
      }
    }
    tokenBalances {
      id
      quantity
      isHidden
      denominatedValue {
        currency
        value
      }
      token {
        chain
        address
        symbol
        decimals
        project {
          id
          name
          logoUrl
          safetyLevel
          isSpam
        }
      }
      tokenProjectMarket {
        relativeChange24: pricePercentChange(duration: DAY) {
          value
        }
      }
    }
  }
}
    `;

/**
 * __usePortfolioBalancesQuery__
 *
 * To run a query within a React component, call `usePortfolioBalancesQuery` and pass it any options that fit your needs.
 * When your component renders, `usePortfolioBalancesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePortfolioBalancesQuery({
 *   variables: {
 *      ownerAddress: // value for 'ownerAddress'
 *      valueModifiers: // value for 'valueModifiers'
 *   },
 * });
 */
export function usePortfolioBalancesQuery(baseOptions: Apollo.QueryHookOptions<PortfolioBalancesQuery, PortfolioBalancesQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<PortfolioBalancesQuery, PortfolioBalancesQueryVariables>(PortfolioBalancesDocument, options);
}
export function usePortfolioBalancesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PortfolioBalancesQuery, PortfolioBalancesQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<PortfolioBalancesQuery, PortfolioBalancesQueryVariables>(PortfolioBalancesDocument, options);
}
export type PortfolioBalancesQueryHookResult = ReturnType<typeof usePortfolioBalancesQuery>;
export type PortfolioBalancesLazyQueryHookResult = ReturnType<typeof usePortfolioBalancesLazyQuery>;
export type PortfolioBalancesQueryResult = Apollo.QueryResult<PortfolioBalancesQuery, PortfolioBalancesQueryVariables>;
export const MultiplePortfolioBalancesDocument = gql`
    query MultiplePortfolioBalances($ownerAddresses: [String!]!, $valueModifiers: [PortfolioValueModifier!]) {
  portfolios(
    ownerAddresses: $ownerAddresses
    chains: [ETHEREUM, POLYGON, ARBITRUM, OPTIMISM, BASE, BNB, BLAST]
    valueModifiers: $valueModifiers
  ) {
    id
    tokensTotalDenominatedValue {
      value
    }
    tokensTotalDenominatedValueChange(duration: DAY) {
      absolute {
        value
      }
      percentage {
        value
      }
    }
    tokenBalances {
      id
      quantity
      isHidden
      denominatedValue {
        currency
        value
      }
      token {
        chain
        address
        symbol
        decimals
        project {
          id
          name
          logoUrl
          safetyLevel
          isSpam
        }
      }
      tokenProjectMarket {
        relativeChange24: pricePercentChange(duration: DAY) {
          value
        }
      }
    }
  }
}
    `;

/**
 * __useMultiplePortfolioBalancesQuery__
 *
 * To run a query within a React component, call `useMultiplePortfolioBalancesQuery` and pass it any options that fit your needs.
 * When your component renders, `useMultiplePortfolioBalancesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMultiplePortfolioBalancesQuery({
 *   variables: {
 *      ownerAddresses: // value for 'ownerAddresses'
 *      valueModifiers: // value for 'valueModifiers'
 *   },
 * });
 */
export function useMultiplePortfolioBalancesQuery(baseOptions: Apollo.QueryHookOptions<MultiplePortfolioBalancesQuery, MultiplePortfolioBalancesQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<MultiplePortfolioBalancesQuery, MultiplePortfolioBalancesQueryVariables>(MultiplePortfolioBalancesDocument, options);
}
export function useMultiplePortfolioBalancesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MultiplePortfolioBalancesQuery, MultiplePortfolioBalancesQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<MultiplePortfolioBalancesQuery, MultiplePortfolioBalancesQueryVariables>(MultiplePortfolioBalancesDocument, options);
}
export type MultiplePortfolioBalancesQueryHookResult = ReturnType<typeof useMultiplePortfolioBalancesQuery>;
export type MultiplePortfolioBalancesLazyQueryHookResult = ReturnType<typeof useMultiplePortfolioBalancesLazyQuery>;
export type MultiplePortfolioBalancesQueryResult = Apollo.QueryResult<MultiplePortfolioBalancesQuery, MultiplePortfolioBalancesQueryVariables>;
export const SelectWalletScreenDocument = gql`
    query SelectWalletScreen($ownerAddresses: [String!]!) {
  portfolios(
    ownerAddresses: $ownerAddresses
    chains: [ETHEREUM, POLYGON, ARBITRUM, OPTIMISM, BASE, BNB, BLAST]
  ) {
    id
    ownerAddress
    tokensTotalDenominatedValue {
      value
    }
  }
}
    `;

/**
 * __useSelectWalletScreenQuery__
 *
 * To run a query within a React component, call `useSelectWalletScreenQuery` and pass it any options that fit your needs.
 * When your component renders, `useSelectWalletScreenQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSelectWalletScreenQuery({
 *   variables: {
 *      ownerAddresses: // value for 'ownerAddresses'
 *   },
 * });
 */
export function useSelectWalletScreenQuery(baseOptions: Apollo.QueryHookOptions<SelectWalletScreenQuery, SelectWalletScreenQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<SelectWalletScreenQuery, SelectWalletScreenQueryVariables>(SelectWalletScreenDocument, options);
}
export function useSelectWalletScreenLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SelectWalletScreenQuery, SelectWalletScreenQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<SelectWalletScreenQuery, SelectWalletScreenQueryVariables>(SelectWalletScreenDocument, options);
}
export type SelectWalletScreenQueryHookResult = ReturnType<typeof useSelectWalletScreenQuery>;
export type SelectWalletScreenLazyQueryHookResult = ReturnType<typeof useSelectWalletScreenLazyQuery>;
export type SelectWalletScreenQueryResult = Apollo.QueryResult<SelectWalletScreenQuery, SelectWalletScreenQueryVariables>;
export const TransactionHistoryUpdaterDocument = gql`
    query TransactionHistoryUpdater($addresses: [String!]!) {
  portfolios(
    ownerAddresses: $addresses
    chains: [ETHEREUM, POLYGON, ARBITRUM, OPTIMISM, BASE, BNB, BLAST]
  ) {
    id
    ownerAddress
    assetActivities(pageSize: 1, page: 1) {
      id
      timestamp
      details {
        ... on TransactionDetails {
          id
          hash
        }
      }
    }
  }
}
    `;

/**
 * __useTransactionHistoryUpdaterQuery__
 *
 * To run a query within a React component, call `useTransactionHistoryUpdaterQuery` and pass it any options that fit your needs.
 * When your component renders, `useTransactionHistoryUpdaterQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTransactionHistoryUpdaterQuery({
 *   variables: {
 *      addresses: // value for 'addresses'
 *   },
 * });
 */
export function useTransactionHistoryUpdaterQuery(baseOptions: Apollo.QueryHookOptions<TransactionHistoryUpdaterQuery, TransactionHistoryUpdaterQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<TransactionHistoryUpdaterQuery, TransactionHistoryUpdaterQueryVariables>(TransactionHistoryUpdaterDocument, options);
}
export function useTransactionHistoryUpdaterLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TransactionHistoryUpdaterQuery, TransactionHistoryUpdaterQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<TransactionHistoryUpdaterQuery, TransactionHistoryUpdaterQueryVariables>(TransactionHistoryUpdaterDocument, options);
}
export type TransactionHistoryUpdaterQueryHookResult = ReturnType<typeof useTransactionHistoryUpdaterQuery>;
export type TransactionHistoryUpdaterLazyQueryHookResult = ReturnType<typeof useTransactionHistoryUpdaterLazyQuery>;
export type TransactionHistoryUpdaterQueryResult = Apollo.QueryResult<TransactionHistoryUpdaterQuery, TransactionHistoryUpdaterQueryVariables>;
export const TokenDocument = gql`
    query Token($chain: Chain!, $address: String) {
  token(chain: $chain, address: $address) {
    symbol
    decimals
    chain
    address
    standard
    project {
      id
      name
      logoUrl
      safetyLevel
      isSpam
    }
  }
}
    `;

/**
 * __useTokenQuery__
 *
 * To run a query within a React component, call `useTokenQuery` and pass it any options that fit your needs.
 * When your component renders, `useTokenQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTokenQuery({
 *   variables: {
 *      chain: // value for 'chain'
 *      address: // value for 'address'
 *   },
 * });
 */
export function useTokenQuery(baseOptions: Apollo.QueryHookOptions<TokenQuery, TokenQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<TokenQuery, TokenQueryVariables>(TokenDocument, options);
}
export function useTokenLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TokenQuery, TokenQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<TokenQuery, TokenQueryVariables>(TokenDocument, options);
}
export type TokenQueryHookResult = ReturnType<typeof useTokenQuery>;
export type TokenLazyQueryHookResult = ReturnType<typeof useTokenLazyQuery>;
export type TokenQueryResult = Apollo.QueryResult<TokenQuery, TokenQueryVariables>;
export const TokenDetailsScreenDocument = gql`
    query TokenDetailsScreen($chain: Chain!, $address: String, $includeSpanish: Boolean = false, $includeFrench: Boolean = false, $includeJapanese: Boolean = false, $includePortuguese: Boolean = false, $includeChineseSimplified: Boolean = false, $includeChineseTraditional: Boolean = false) {
  token(chain: $chain, address: $address) {
    address
    chain
    symbol
    name
    market(currency: USD) {
      id
      volume(duration: DAY) {
        value
      }
      price {
        value
      }
      priceHigh52W: priceHighLow(duration: YEAR, highLow: HIGH) {
        value
      }
      priceLow52W: priceHighLow(duration: YEAR, highLow: LOW) {
        value
      }
    }
    project {
      id
      name
      description
      descriptionTranslations {
        descriptionEsEs @include(if: $includeSpanish)
        descriptionFrFr @include(if: $includeFrench)
        descriptionJaJp @include(if: $includeJapanese)
        descriptionPtPt @include(if: $includePortuguese)
        descriptionZhHans @include(if: $includeChineseSimplified)
        descriptionZhHant @include(if: $includeChineseTraditional)
      }
      homepageUrl
      twitterName
      safetyLevel
      logoUrl
      markets(currencies: [USD]) {
        id
        price {
          value
        }
        marketCap {
          value
        }
        fullyDilutedValuation {
          value
        }
        priceHigh52W: priceHighLow(duration: YEAR, highLow: HIGH) {
          value
        }
        priceLow52W: priceHighLow(duration: YEAR, highLow: LOW) {
          value
        }
      }
      tokens {
        chain
        address
      }
    }
  }
}
    `;

/**
 * __useTokenDetailsScreenQuery__
 *
 * To run a query within a React component, call `useTokenDetailsScreenQuery` and pass it any options that fit your needs.
 * When your component renders, `useTokenDetailsScreenQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTokenDetailsScreenQuery({
 *   variables: {
 *      chain: // value for 'chain'
 *      address: // value for 'address'
 *      includeSpanish: // value for 'includeSpanish'
 *      includeFrench: // value for 'includeFrench'
 *      includeJapanese: // value for 'includeJapanese'
 *      includePortuguese: // value for 'includePortuguese'
 *      includeChineseSimplified: // value for 'includeChineseSimplified'
 *      includeChineseTraditional: // value for 'includeChineseTraditional'
 *   },
 * });
 */
export function useTokenDetailsScreenQuery(baseOptions: Apollo.QueryHookOptions<TokenDetailsScreenQuery, TokenDetailsScreenQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<TokenDetailsScreenQuery, TokenDetailsScreenQueryVariables>(TokenDetailsScreenDocument, options);
}
export function useTokenDetailsScreenLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TokenDetailsScreenQuery, TokenDetailsScreenQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<TokenDetailsScreenQuery, TokenDetailsScreenQueryVariables>(TokenDetailsScreenDocument, options);
}
export type TokenDetailsScreenQueryHookResult = ReturnType<typeof useTokenDetailsScreenQuery>;
export type TokenDetailsScreenLazyQueryHookResult = ReturnType<typeof useTokenDetailsScreenLazyQuery>;
export type TokenDetailsScreenQueryResult = Apollo.QueryResult<TokenDetailsScreenQuery, TokenDetailsScreenQueryVariables>;
export const TokenProjectsDocument = gql`
    query TokenProjects($contracts: [ContractInput!]!) {
  tokenProjects(contracts: $contracts) {
    id
    name
    logoUrl
    safetyLevel
    tokens {
      chain
      address
      decimals
      symbol
    }
  }
}
    `;

/**
 * __useTokenProjectsQuery__
 *
 * To run a query within a React component, call `useTokenProjectsQuery` and pass it any options that fit your needs.
 * When your component renders, `useTokenProjectsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTokenProjectsQuery({
 *   variables: {
 *      contracts: // value for 'contracts'
 *   },
 * });
 */
export function useTokenProjectsQuery(baseOptions: Apollo.QueryHookOptions<TokenProjectsQuery, TokenProjectsQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<TokenProjectsQuery, TokenProjectsQueryVariables>(TokenProjectsDocument, options);
}
export function useTokenProjectsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TokenProjectsQuery, TokenProjectsQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<TokenProjectsQuery, TokenProjectsQueryVariables>(TokenProjectsDocument, options);
}
export type TokenProjectsQueryHookResult = ReturnType<typeof useTokenProjectsQuery>;
export type TokenProjectsLazyQueryHookResult = ReturnType<typeof useTokenProjectsLazyQuery>;
export type TokenProjectsQueryResult = Apollo.QueryResult<TokenProjectsQuery, TokenProjectsQueryVariables>;
export const TransactionListDocument = gql`
    query TransactionList($address: String!) {
  portfolios(
    ownerAddresses: [$address]
    chains: [ETHEREUM, POLYGON, ARBITRUM, OPTIMISM, BASE, BNB, BLAST]
  ) {
    id
    assetActivities(
      pageSize: 100
      page: 1
      chains: [ETHEREUM, POLYGON, ARBITRUM, OPTIMISM, BASE, BNB, BLAST]
    ) {
      id
      timestamp
      chain
      details {
        ... on TransactionDetails {
          id
          to
          type
          hash
          from
          status
          assetChanges {
            __typename
            ... on TokenTransfer {
              id
              asset {
                id
                symbol
                address
                decimals
                chain
                project {
                  id
                  isSpam
                  spamCode
                }
              }
              tokenStandard
              quantity
              sender
              recipient
              direction
              transactedValue {
                id
                currency
                value
              }
            }
            ... on NftTransfer {
              id
              asset {
                id
                name
                isSpam
                nftContract {
                  id
                  chain
                  address
                }
                tokenId
                image {
                  id
                  url
                }
                collection {
                  id
                  name
                }
              }
              nftStandard
              sender
              recipient
              direction
            }
            ... on TokenApproval {
              id
              asset {
                id
                symbol
                decimals
                address
                chain
              }
              tokenStandard
              approvedAddress
              quantity
            }
          }
        }
      }
    }
  }
}
    `;

/**
 * __useTransactionListQuery__
 *
 * To run a query within a React component, call `useTransactionListQuery` and pass it any options that fit your needs.
 * When your component renders, `useTransactionListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTransactionListQuery({
 *   variables: {
 *      address: // value for 'address'
 *   },
 * });
 */
export function useTransactionListQuery(baseOptions: Apollo.QueryHookOptions<TransactionListQuery, TransactionListQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<TransactionListQuery, TransactionListQueryVariables>(TransactionListDocument, options);
}
export function useTransactionListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TransactionListQuery, TransactionListQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<TransactionListQuery, TransactionListQueryVariables>(TransactionListDocument, options);
}
export type TransactionListQueryHookResult = ReturnType<typeof useTransactionListQuery>;
export type TransactionListLazyQueryHookResult = ReturnType<typeof useTransactionListLazyQuery>;
export type TransactionListQueryResult = Apollo.QueryResult<TransactionListQuery, TransactionListQueryVariables>;
export const FeedTransactionListDocument = gql`
    query FeedTransactionList($addresses: [String!]!) {
  portfolios(
    ownerAddresses: $addresses
    chains: [ETHEREUM, POLYGON, ARBITRUM, OPTIMISM, BASE, BNB, BLAST]
  ) {
    id
    ownerAddress
    assetActivities(
      pageSize: 30
      page: 1
      chains: [ETHEREUM, POLYGON, ARBITRUM, OPTIMISM, BASE, BNB, BLAST]
    ) {
      id
      timestamp
      chain
      details {
        ... on TransactionDetails {
          id
          to
          type
          hash
          from
          status
          assetChanges {
            __typename
            ... on TokenTransfer {
              id
              asset {
                id
                symbol
                address
                decimals
                chain
                project {
                  id
                  isSpam
                  spamCode
                }
              }
              tokenStandard
              quantity
              sender
              recipient
              direction
              transactedValue {
                currency
                value
              }
            }
            ... on NftTransfer {
              id
              asset {
                id
                name
                isSpam
                nftContract {
                  id
                  chain
                  address
                }
                tokenId
                image {
                  id
                  url
                }
                collection {
                  id
                  name
                }
              }
              nftStandard
              sender
              recipient
              direction
            }
            ... on TokenApproval {
              id
              asset {
                id
                symbol
                decimals
                address
                chain
              }
              tokenStandard
              approvedAddress
              quantity
            }
          }
        }
      }
    }
  }
}
    `;

/**
 * __useFeedTransactionListQuery__
 *
 * To run a query within a React component, call `useFeedTransactionListQuery` and pass it any options that fit your needs.
 * When your component renders, `useFeedTransactionListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFeedTransactionListQuery({
 *   variables: {
 *      addresses: // value for 'addresses'
 *   },
 * });
 */
export function useFeedTransactionListQuery(baseOptions: Apollo.QueryHookOptions<FeedTransactionListQuery, FeedTransactionListQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<FeedTransactionListQuery, FeedTransactionListQueryVariables>(FeedTransactionListDocument, options);
}
export function useFeedTransactionListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FeedTransactionListQuery, FeedTransactionListQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<FeedTransactionListQuery, FeedTransactionListQueryVariables>(FeedTransactionListDocument, options);
}
export type FeedTransactionListQueryHookResult = ReturnType<typeof useFeedTransactionListQuery>;
export type FeedTransactionListLazyQueryHookResult = ReturnType<typeof useFeedTransactionListLazyQuery>;
export type FeedTransactionListQueryResult = Apollo.QueryResult<FeedTransactionListQuery, FeedTransactionListQueryVariables>;
export const TopTokensDocument = gql`
    query TopTokens($chain: Chain, $page: Int = 1, $pageSize: Int = 100, $orderBy: TokenSortableField = POPULARITY) {
  topTokens(chain: $chain, page: $page, pageSize: $pageSize, orderBy: $orderBy) {
    address
    chain
    decimals
    symbol
    standard
    project {
      id
      name
      isSpam
      logoUrl
      safetyLevel
    }
  }
}
    `;

/**
 * __useTopTokensQuery__
 *
 * To run a query within a React component, call `useTopTokensQuery` and pass it any options that fit your needs.
 * When your component renders, `useTopTokensQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTopTokensQuery({
 *   variables: {
 *      chain: // value for 'chain'
 *      page: // value for 'page'
 *      pageSize: // value for 'pageSize'
 *      orderBy: // value for 'orderBy'
 *   },
 * });
 */
export function useTopTokensQuery(baseOptions?: Apollo.QueryHookOptions<TopTokensQuery, TopTokensQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<TopTokensQuery, TopTokensQueryVariables>(TopTokensDocument, options);
}
export function useTopTokensLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TopTokensQuery, TopTokensQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<TopTokensQuery, TopTokensQueryVariables>(TopTokensDocument, options);
}
export type TopTokensQueryHookResult = ReturnType<typeof useTopTokensQuery>;
export type TopTokensLazyQueryHookResult = ReturnType<typeof useTopTokensLazyQuery>;
export type TopTokensQueryResult = Apollo.QueryResult<TopTokensQuery, TopTokensQueryVariables>;
export const SearchTokensDocument = gql`
    query SearchTokens($searchQuery: String!, $chains: [Chain!]) {
  searchTokens(searchQuery: $searchQuery, chains: $chains) {
    id
    chain
    address
    decimals
    symbol
    project {
      id
      name
      logoUrl
      safetyLevel
    }
  }
}
    `;

/**
 * __useSearchTokensQuery__
 *
 * To run a query within a React component, call `useSearchTokensQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchTokensQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchTokensQuery({
 *   variables: {
 *      searchQuery: // value for 'searchQuery'
 *      chains: // value for 'chains'
 *   },
 * });
 */
export function useSearchTokensQuery(baseOptions: Apollo.QueryHookOptions<SearchTokensQuery, SearchTokensQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<SearchTokensQuery, SearchTokensQueryVariables>(SearchTokensDocument, options);
}
export function useSearchTokensLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchTokensQuery, SearchTokensQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<SearchTokensQuery, SearchTokensQueryVariables>(SearchTokensDocument, options);
}
export type SearchTokensQueryHookResult = ReturnType<typeof useSearchTokensQuery>;
export type SearchTokensLazyQueryHookResult = ReturnType<typeof useSearchTokensLazyQuery>;
export type SearchTokensQueryResult = Apollo.QueryResult<SearchTokensQuery, SearchTokensQueryVariables>;
export const ExploreSearchDocument = gql`
    query ExploreSearch($searchQuery: String!, $nftCollectionsFilter: NftCollectionsFilterInput!) {
  searchTokens(searchQuery: $searchQuery) {
    chain
    address
    decimals
    symbol
    market {
      volume(duration: DAY) {
        value
      }
    }
    project {
      id
      name
      logoUrl
      safetyLevel
    }
  }
  nftCollections(filter: $nftCollectionsFilter, first: 4) {
    edges {
      node {
        id
        name
        collectionId
        isVerified
        nftContracts {
          id
          chain
          address
        }
        image {
          id
          url
        }
      }
    }
  }
}
    `;

/**
 * __useExploreSearchQuery__
 *
 * To run a query within a React component, call `useExploreSearchQuery` and pass it any options that fit your needs.
 * When your component renders, `useExploreSearchQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useExploreSearchQuery({
 *   variables: {
 *      searchQuery: // value for 'searchQuery'
 *      nftCollectionsFilter: // value for 'nftCollectionsFilter'
 *   },
 * });
 */
export function useExploreSearchQuery(baseOptions: Apollo.QueryHookOptions<ExploreSearchQuery, ExploreSearchQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<ExploreSearchQuery, ExploreSearchQueryVariables>(ExploreSearchDocument, options);
}
export function useExploreSearchLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ExploreSearchQuery, ExploreSearchQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<ExploreSearchQuery, ExploreSearchQueryVariables>(ExploreSearchDocument, options);
}
export type ExploreSearchQueryHookResult = ReturnType<typeof useExploreSearchQuery>;
export type ExploreSearchLazyQueryHookResult = ReturnType<typeof useExploreSearchLazyQuery>;
export type ExploreSearchQueryResult = Apollo.QueryResult<ExploreSearchQuery, ExploreSearchQueryVariables>;
export const ExploreTokensTabDocument = gql`
    query ExploreTokensTab($topTokensOrderBy: TokenSortableField!) {
  topTokens(chain: ETHEREUM, page: 1, pageSize: 100, orderBy: $topTokensOrderBy) {
    ...TopTokenParts
  }
  eth: token(address: null, chain: ETHEREUM) {
    ...TopTokenParts
  }
}
    ${TopTokenPartsFragmentDoc}`;

/**
 * __useExploreTokensTabQuery__
 *
 * To run a query within a React component, call `useExploreTokensTabQuery` and pass it any options that fit your needs.
 * When your component renders, `useExploreTokensTabQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useExploreTokensTabQuery({
 *   variables: {
 *      topTokensOrderBy: // value for 'topTokensOrderBy'
 *   },
 * });
 */
export function useExploreTokensTabQuery(baseOptions: Apollo.QueryHookOptions<ExploreTokensTabQuery, ExploreTokensTabQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<ExploreTokensTabQuery, ExploreTokensTabQueryVariables>(ExploreTokensTabDocument, options);
}
export function useExploreTokensTabLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ExploreTokensTabQuery, ExploreTokensTabQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<ExploreTokensTabQuery, ExploreTokensTabQueryVariables>(ExploreTokensTabDocument, options);
}
export type ExploreTokensTabQueryHookResult = ReturnType<typeof useExploreTokensTabQuery>;
export type ExploreTokensTabLazyQueryHookResult = ReturnType<typeof useExploreTokensTabLazyQuery>;
export type ExploreTokensTabQueryResult = Apollo.QueryResult<ExploreTokensTabQuery, ExploreTokensTabQueryVariables>;
export const FavoriteTokenCardDocument = gql`
    query FavoriteTokenCard($chain: Chain!, $address: String) {
  token(chain: $chain, address: $address) {
    symbol
    chain
    address
    project {
      id
      name
      logoUrl
      markets(currencies: [USD]) {
        id
        price {
          value
        }
        pricePercentChange24h {
          value
        }
      }
    }
  }
}
    `;

/**
 * __useFavoriteTokenCardQuery__
 *
 * To run a query within a React component, call `useFavoriteTokenCardQuery` and pass it any options that fit your needs.
 * When your component renders, `useFavoriteTokenCardQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFavoriteTokenCardQuery({
 *   variables: {
 *      chain: // value for 'chain'
 *      address: // value for 'address'
 *   },
 * });
 */
export function useFavoriteTokenCardQuery(baseOptions: Apollo.QueryHookOptions<FavoriteTokenCardQuery, FavoriteTokenCardQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<FavoriteTokenCardQuery, FavoriteTokenCardQueryVariables>(FavoriteTokenCardDocument, options);
}
export function useFavoriteTokenCardLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FavoriteTokenCardQuery, FavoriteTokenCardQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<FavoriteTokenCardQuery, FavoriteTokenCardQueryVariables>(FavoriteTokenCardDocument, options);
}
export type FavoriteTokenCardQueryHookResult = ReturnType<typeof useFavoriteTokenCardQuery>;
export type FavoriteTokenCardLazyQueryHookResult = ReturnType<typeof useFavoriteTokenCardLazyQuery>;
export type FavoriteTokenCardQueryResult = Apollo.QueryResult<FavoriteTokenCardQuery, FavoriteTokenCardQueryVariables>;
export const TokensDocument = gql`
    query Tokens($contracts: [ContractInput!]!) {
  tokens(contracts: $contracts) {
    symbol
    chain
    address
    project {
      name
    }
  }
}
    `;

/**
 * __useTokensQuery__
 *
 * To run a query within a React component, call `useTokensQuery` and pass it any options that fit your needs.
 * When your component renders, `useTokensQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTokensQuery({
 *   variables: {
 *      contracts: // value for 'contracts'
 *   },
 * });
 */
export function useTokensQuery(baseOptions: Apollo.QueryHookOptions<TokensQuery, TokensQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<TokensQuery, TokensQueryVariables>(TokensDocument, options);
}
export function useTokensLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TokensQuery, TokensQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<TokensQuery, TokensQueryVariables>(TokensDocument, options);
}
export type TokensQueryHookResult = ReturnType<typeof useTokensQuery>;
export type TokensLazyQueryHookResult = ReturnType<typeof useTokensLazyQuery>;
export type TokensQueryResult = Apollo.QueryResult<TokensQuery, TokensQueryVariables>;
export const ConvertDocument = gql`
    query Convert($fromCurrency: Currency!, $toCurrency: Currency!) {
  convert(
    fromAmount: {currency: $fromCurrency, value: 1.0}
    toCurrency: $toCurrency
  ) {
    value
    currency
  }
}
    `;

/**
 * __useConvertQuery__
 *
 * To run a query within a React component, call `useConvertQuery` and pass it any options that fit your needs.
 * When your component renders, `useConvertQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useConvertQuery({
 *   variables: {
 *      fromCurrency: // value for 'fromCurrency'
 *      toCurrency: // value for 'toCurrency'
 *   },
 * });
 */
export function useConvertQuery(baseOptions: Apollo.QueryHookOptions<ConvertQuery, ConvertQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<ConvertQuery, ConvertQueryVariables>(ConvertDocument, options);
}
export function useConvertLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ConvertQuery, ConvertQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<ConvertQuery, ConvertQueryVariables>(ConvertDocument, options);
}
export type ConvertQueryHookResult = ReturnType<typeof useConvertQuery>;
export type ConvertLazyQueryHookResult = ReturnType<typeof useConvertLazyQuery>;
export type ConvertQueryResult = Apollo.QueryResult<ConvertQuery, ConvertQueryVariables>;
export const ConvertWebDocument = gql`
    query ConvertWeb($toCurrency: Currency!) {
  convert(fromAmount: {currency: USD, value: 1.0}, toCurrency: $toCurrency) {
    id
    value
    currency
  }
}
    `;

/**
 * __useConvertWebQuery__
 *
 * To run a query within a React component, call `useConvertWebQuery` and pass it any options that fit your needs.
 * When your component renders, `useConvertWebQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useConvertWebQuery({
 *   variables: {
 *      toCurrency: // value for 'toCurrency'
 *   },
 * });
 */
export function useConvertWebQuery(baseOptions: Apollo.QueryHookOptions<ConvertWebQuery, ConvertWebQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<ConvertWebQuery, ConvertWebQueryVariables>(ConvertWebDocument, options);
}
export function useConvertWebLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ConvertWebQuery, ConvertWebQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<ConvertWebQuery, ConvertWebQueryVariables>(ConvertWebDocument, options);
}
export type ConvertWebQueryHookResult = ReturnType<typeof useConvertWebQuery>;
export type ConvertWebLazyQueryHookResult = ReturnType<typeof useConvertWebLazyQuery>;
export type ConvertWebQueryResult = Apollo.QueryResult<ConvertWebQuery, ConvertWebQueryVariables>;
export const HistoricalProtocolVolumeDocument = gql`
    query HistoricalProtocolVolume($chain: Chain!, $duration: HistoryDuration!) {
  v3HistoricalProtocolVolume: historicalProtocolVolume(
    chain: $chain
    version: V3
    duration: $duration
  ) {
    id
    timestamp
    value
  }
  v2HistoricalProtocolVolume: historicalProtocolVolume(
    chain: $chain
    version: V2
    duration: $duration
  ) {
    id
    timestamp
    value
  }
}
    `;

/**
 * __useHistoricalProtocolVolumeQuery__
 *
 * To run a query within a React component, call `useHistoricalProtocolVolumeQuery` and pass it any options that fit your needs.
 * When your component renders, `useHistoricalProtocolVolumeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHistoricalProtocolVolumeQuery({
 *   variables: {
 *      chain: // value for 'chain'
 *      duration: // value for 'duration'
 *   },
 * });
 */
export function useHistoricalProtocolVolumeQuery(baseOptions: Apollo.QueryHookOptions<HistoricalProtocolVolumeQuery, HistoricalProtocolVolumeQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<HistoricalProtocolVolumeQuery, HistoricalProtocolVolumeQueryVariables>(HistoricalProtocolVolumeDocument, options);
}
export function useHistoricalProtocolVolumeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<HistoricalProtocolVolumeQuery, HistoricalProtocolVolumeQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<HistoricalProtocolVolumeQuery, HistoricalProtocolVolumeQueryVariables>(HistoricalProtocolVolumeDocument, options);
}
export type HistoricalProtocolVolumeQueryHookResult = ReturnType<typeof useHistoricalProtocolVolumeQuery>;
export type HistoricalProtocolVolumeLazyQueryHookResult = ReturnType<typeof useHistoricalProtocolVolumeLazyQuery>;
export type HistoricalProtocolVolumeQueryResult = Apollo.QueryResult<HistoricalProtocolVolumeQuery, HistoricalProtocolVolumeQueryVariables>;
export const DailyProtocolTvlDocument = gql`
    query DailyProtocolTVL($chain: Chain!) {
  v3DailyProtocolTvl: dailyProtocolTvl(chain: $chain, version: V3) {
    id
    timestamp
    value
  }
  v2DailyProtocolTvl: dailyProtocolTvl(chain: $chain, version: V2) {
    id
    timestamp
    value
  }
}
    `;

/**
 * __useDailyProtocolTvlQuery__
 *
 * To run a query within a React component, call `useDailyProtocolTvlQuery` and pass it any options that fit your needs.
 * When your component renders, `useDailyProtocolTvlQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDailyProtocolTvlQuery({
 *   variables: {
 *      chain: // value for 'chain'
 *   },
 * });
 */
export function useDailyProtocolTvlQuery(baseOptions: Apollo.QueryHookOptions<DailyProtocolTvlQuery, DailyProtocolTvlQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<DailyProtocolTvlQuery, DailyProtocolTvlQueryVariables>(DailyProtocolTvlDocument, options);
}
export function useDailyProtocolTvlLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DailyProtocolTvlQuery, DailyProtocolTvlQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<DailyProtocolTvlQuery, DailyProtocolTvlQueryVariables>(DailyProtocolTvlDocument, options);
}
export type DailyProtocolTvlQueryHookResult = ReturnType<typeof useDailyProtocolTvlQuery>;
export type DailyProtocolTvlLazyQueryHookResult = ReturnType<typeof useDailyProtocolTvlLazyQuery>;
export type DailyProtocolTvlQueryResult = Apollo.QueryResult<DailyProtocolTvlQuery, DailyProtocolTvlQueryVariables>;
export const RecentTokenTransfersDocument = gql`
    query RecentTokenTransfers($address: String!) {
  portfolios(
    ownerAddresses: [$address]
    chains: [ETHEREUM, POLYGON, ARBITRUM, OPTIMISM, BASE, BNB]
  ) {
    id
    ownerAddress
    assetActivities(
      pageSize: 100
      page: 1
      chains: [ETHEREUM, POLYGON, ARBITRUM, OPTIMISM, BASE, BNB]
    ) {
      id
      timestamp
      chain
      details {
        ... on TransactionDetails {
          to
          type
          hash
          from
          status
          assetChanges {
            __typename
            ... on TokenTransfer {
              id
              asset {
                id
                symbol
                address
                decimals
                chain
                project {
                  id
                  isSpam
                  spamCode
                }
              }
              tokenStandard
              quantity
              sender
              recipient
              direction
              transactedValue {
                currency
                value
              }
            }
            ... on NftTransfer {
              id
              asset {
                id
                name
                isSpam
                nftContract {
                  id
                  chain
                  address
                }
                tokenId
                image {
                  id
                  url
                }
                collection {
                  id
                  name
                }
              }
              nftStandard
              sender
              recipient
              direction
            }
            ... on TokenApproval {
              id
              asset {
                id
                symbol
                decimals
                address
                chain
              }
              tokenStandard
              approvedAddress
              quantity
            }
          }
        }
      }
    }
  }
}
    `;

/**
 * __useRecentTokenTransfersQuery__
 *
 * To run a query within a React component, call `useRecentTokenTransfersQuery` and pass it any options that fit your needs.
 * When your component renders, `useRecentTokenTransfersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRecentTokenTransfersQuery({
 *   variables: {
 *      address: // value for 'address'
 *   },
 * });
 */
export function useRecentTokenTransfersQuery(baseOptions: Apollo.QueryHookOptions<RecentTokenTransfersQuery, RecentTokenTransfersQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<RecentTokenTransfersQuery, RecentTokenTransfersQueryVariables>(RecentTokenTransfersDocument, options);
}
export function useRecentTokenTransfersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RecentTokenTransfersQuery, RecentTokenTransfersQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<RecentTokenTransfersQuery, RecentTokenTransfersQueryVariables>(RecentTokenTransfersDocument, options);
}
export type RecentTokenTransfersQueryHookResult = ReturnType<typeof useRecentTokenTransfersQuery>;
export type RecentTokenTransfersLazyQueryHookResult = ReturnType<typeof useRecentTokenTransfersLazyQuery>;
export type RecentTokenTransfersQueryResult = Apollo.QueryResult<RecentTokenTransfersQuery, RecentTokenTransfersQueryVariables>;
export const RecentlySearchedAssetsDocument = gql`
    query RecentlySearchedAssets($collectionAddresses: [String!]!, $contracts: [ContractInput!]!) {
  nftCollections(filter: {addresses: $collectionAddresses}) {
    edges {
      node {
        collectionId
        image {
          url
        }
        isVerified
        name
        numAssets
        nftContracts {
          address
        }
        markets(currencies: ETH) {
          floorPrice {
            currency
            value
          }
        }
      }
    }
  }
  tokens(contracts: $contracts) {
    id
    decimals
    name
    chain
    standard
    address
    symbol
    market(currency: USD) {
      id
      price {
        id
        value
        currency
      }
      pricePercentChange(duration: DAY) {
        id
        value
      }
      volume24H: volume(duration: DAY) {
        id
        value
        currency
      }
    }
    project {
      id
      logoUrl
      safetyLevel
    }
  }
}
    `;

/**
 * __useRecentlySearchedAssetsQuery__
 *
 * To run a query within a React component, call `useRecentlySearchedAssetsQuery` and pass it any options that fit your needs.
 * When your component renders, `useRecentlySearchedAssetsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRecentlySearchedAssetsQuery({
 *   variables: {
 *      collectionAddresses: // value for 'collectionAddresses'
 *      contracts: // value for 'contracts'
 *   },
 * });
 */
export function useRecentlySearchedAssetsQuery(baseOptions: Apollo.QueryHookOptions<RecentlySearchedAssetsQuery, RecentlySearchedAssetsQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<RecentlySearchedAssetsQuery, RecentlySearchedAssetsQueryVariables>(RecentlySearchedAssetsDocument, options);
}
export function useRecentlySearchedAssetsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RecentlySearchedAssetsQuery, RecentlySearchedAssetsQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<RecentlySearchedAssetsQuery, RecentlySearchedAssetsQueryVariables>(RecentlySearchedAssetsDocument, options);
}
export type RecentlySearchedAssetsQueryHookResult = ReturnType<typeof useRecentlySearchedAssetsQuery>;
export type RecentlySearchedAssetsLazyQueryHookResult = ReturnType<typeof useRecentlySearchedAssetsLazyQuery>;
export type RecentlySearchedAssetsQueryResult = Apollo.QueryResult<RecentlySearchedAssetsQuery, RecentlySearchedAssetsQueryVariables>;
export const SearchPopularTokensWebDocument = gql`
    query SearchPopularTokensWeb($chain: Chain!, $orderBy: TokenSortableField) {
  topTokens(chain: $chain, orderBy: $orderBy, page: 1, pageSize: 100) {
    id
    address
    chain
    symbol
    name
    decimals
    project {
      id
      logoUrl
      safetyLevel
      isSpam
    }
  }
}
    `;

/**
 * __useSearchPopularTokensWebQuery__
 *
 * To run a query within a React component, call `useSearchPopularTokensWebQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchPopularTokensWebQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchPopularTokensWebQuery({
 *   variables: {
 *      chain: // value for 'chain'
 *      orderBy: // value for 'orderBy'
 *   },
 * });
 */
export function useSearchPopularTokensWebQuery(baseOptions: Apollo.QueryHookOptions<SearchPopularTokensWebQuery, SearchPopularTokensWebQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<SearchPopularTokensWebQuery, SearchPopularTokensWebQueryVariables>(SearchPopularTokensWebDocument, options);
}
export function useSearchPopularTokensWebLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchPopularTokensWebQuery, SearchPopularTokensWebQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<SearchPopularTokensWebQuery, SearchPopularTokensWebQueryVariables>(SearchPopularTokensWebDocument, options);
}
export type SearchPopularTokensWebQueryHookResult = ReturnType<typeof useSearchPopularTokensWebQuery>;
export type SearchPopularTokensWebLazyQueryHookResult = ReturnType<typeof useSearchPopularTokensWebLazyQuery>;
export type SearchPopularTokensWebQueryResult = Apollo.QueryResult<SearchPopularTokensWebQuery, SearchPopularTokensWebQueryVariables>;
export const SimpleTokenDocument = gql`
    query SimpleToken($chain: Chain!, $address: String = null) {
  token(chain: $chain, address: $address) {
    id
    address
    chain
    symbol
    name
    decimals
    standard
    project {
      id
      logo {
        id
        url
      }
      safetyLevel
      isSpam
    }
  }
}
    `;

/**
 * __useSimpleTokenQuery__
 *
 * To run a query within a React component, call `useSimpleTokenQuery` and pass it any options that fit your needs.
 * When your component renders, `useSimpleTokenQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSimpleTokenQuery({
 *   variables: {
 *      chain: // value for 'chain'
 *      address: // value for 'address'
 *   },
 * });
 */
export function useSimpleTokenQuery(baseOptions: Apollo.QueryHookOptions<SimpleTokenQuery, SimpleTokenQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<SimpleTokenQuery, SimpleTokenQueryVariables>(SimpleTokenDocument, options);
}
export function useSimpleTokenLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SimpleTokenQuery, SimpleTokenQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<SimpleTokenQuery, SimpleTokenQueryVariables>(SimpleTokenDocument, options);
}
export type SimpleTokenQueryHookResult = ReturnType<typeof useSimpleTokenQuery>;
export type SimpleTokenLazyQueryHookResult = ReturnType<typeof useSimpleTokenLazyQuery>;
export type SimpleTokenQueryResult = Apollo.QueryResult<SimpleTokenQuery, SimpleTokenQueryVariables>;
export const TokenSpotPriceDocument = gql`
    query TokenSpotPrice($chain: Chain!, $address: String = null) {
  token(chain: $chain, address: $address) {
    id
    address
    chain
    name
    symbol
    project {
      id
      markets(currencies: [USD]) {
        id
        price {
          id
          value
        }
      }
    }
  }
}
    `;

/**
 * __useTokenSpotPriceQuery__
 *
 * To run a query within a React component, call `useTokenSpotPriceQuery` and pass it any options that fit your needs.
 * When your component renders, `useTokenSpotPriceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTokenSpotPriceQuery({
 *   variables: {
 *      chain: // value for 'chain'
 *      address: // value for 'address'
 *   },
 * });
 */
export function useTokenSpotPriceQuery(baseOptions: Apollo.QueryHookOptions<TokenSpotPriceQuery, TokenSpotPriceQueryVariables>) {

  // // 添加调试日志
  // console.log('TokenSpotPrice Query Params:', {
  //   chain: baseOptions.variables?.chain,
  //   address: baseOptions.variables?.address,
  //   skip: baseOptions.skip,
  //   pollInterval: baseOptions.pollInterval
  // });


  const options = { ...defaultOptions, ...baseOptions }
  const result = Apollo.useQuery<TokenSpotPriceQuery, TokenSpotPriceQueryVariables>(TokenSpotPriceDocument, options);

  // // 添加结果调试日志
  // console.log('TokenSpotPrice Query Result:', {
  //   data: result?.data,
  //   loading: result?.loading,
  //   error: result?.error,
  //   networkStatus: result?.networkStatus,
  //   price: result?.data?.token?.project?.markets?.[0]?.price?.value
  // });
  // return result;
}
export function useTokenSpotPriceLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TokenSpotPriceQuery, TokenSpotPriceQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<TokenSpotPriceQuery, TokenSpotPriceQueryVariables>(TokenSpotPriceDocument, options);
}
export type TokenSpotPriceQueryHookResult = ReturnType<typeof useTokenSpotPriceQuery>;
export type TokenSpotPriceLazyQueryHookResult = ReturnType<typeof useTokenSpotPriceLazyQuery>;
export type TokenSpotPriceQueryResult = Apollo.QueryResult<TokenSpotPriceQuery, TokenSpotPriceQueryVariables>;
export const UniswapPricesDocument = gql`
    query UniswapPrices($contracts: [ContractInput!]!) {
  tokens(contracts: $contracts) {
    id
    address
    chain
    standard
    project {
      id
      markets(currencies: [USD]) {
        id
        price {
          id
          value
        }
      }
    }
  }
}
    `;

/**
 * __useUniswapPricesQuery__
 *
 * To run a query within a React component, call `useUniswapPricesQuery` and pass it any options that fit your needs.
 * When your component renders, `useUniswapPricesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUniswapPricesQuery({
 *   variables: {
 *      contracts: // value for 'contracts'
 *   },
 * });
 */
export function useUniswapPricesQuery(baseOptions: Apollo.QueryHookOptions<UniswapPricesQuery, UniswapPricesQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<UniswapPricesQuery, UniswapPricesQueryVariables>(UniswapPricesDocument, options);
}
export function useUniswapPricesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UniswapPricesQuery, UniswapPricesQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<UniswapPricesQuery, UniswapPricesQueryVariables>(UniswapPricesDocument, options);
}
export type UniswapPricesQueryHookResult = ReturnType<typeof useUniswapPricesQuery>;
export type UniswapPricesLazyQueryHookResult = ReturnType<typeof useUniswapPricesLazyQuery>;
export type UniswapPricesQueryResult = Apollo.QueryResult<UniswapPricesQuery, UniswapPricesQueryVariables>;
export const ActivityWebDocument = gql`
    query ActivityWeb($account: String!, $chains: [Chain!]!) {
  portfolios(ownerAddresses: [$account], chains: $chains) {
    id
    assetActivities(pageSize: 100, page: 1, includeOffChain: true, chains: $chains) {
      ...AssetActivityParts
    }
  }
}
    ${AssetActivityPartsFragmentDoc}`;

/**
 * __useActivityWebQuery__
 *
 * To run a query within a React component, call `useActivityWebQuery` and pass it any options that fit your needs.
 * When your component renders, `useActivityWebQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useActivityWebQuery({
 *   variables: {
 *      account: // value for 'account'
 *      chains: // value for 'chains'
 *   },
 * });
 */
export function useActivityWebQuery(baseOptions: Apollo.QueryHookOptions<ActivityWebQuery, ActivityWebQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<ActivityWebQuery, ActivityWebQueryVariables>(ActivityWebDocument, options);
}
export function useActivityWebLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ActivityWebQuery, ActivityWebQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<ActivityWebQuery, ActivityWebQueryVariables>(ActivityWebDocument, options);
}
export type ActivityWebQueryHookResult = ReturnType<typeof useActivityWebQuery>;
export type ActivityWebLazyQueryHookResult = ReturnType<typeof useActivityWebLazyQuery>;
export type ActivityWebQueryResult = Apollo.QueryResult<ActivityWebQuery, ActivityWebQueryVariables>;
export const OnAssetActivityDocument = gql`
    subscription OnAssetActivity($subscriptionId: ID!, $account: String!) {
  onAssetActivity(subscriptionId: $subscriptionId, addresses: [$account]) {
    ...AssetActivityParts
  }
}
    ${AssetActivityPartsFragmentDoc}`;

/**
 * __useOnAssetActivitySubscription__
 *
 * To run a query within a React component, call `useOnAssetActivitySubscription` and pass it any options that fit your needs.
 * When your component renders, `useOnAssetActivitySubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOnAssetActivitySubscription({
 *   variables: {
 *      subscriptionId: // value for 'subscriptionId'
 *      account: // value for 'account'
 *   },
 * });
 */
export function useOnAssetActivitySubscription(baseOptions: Apollo.SubscriptionHookOptions<OnAssetActivitySubscription, OnAssetActivitySubscriptionVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useSubscription<OnAssetActivitySubscription, OnAssetActivitySubscriptionVariables>(OnAssetActivityDocument, options);
}
export type OnAssetActivitySubscriptionHookResult = ReturnType<typeof useOnAssetActivitySubscription>;
export type OnAssetActivitySubscriptionResult = Apollo.SubscriptionResult<OnAssetActivitySubscription>;
export const TokenPromoDocument = gql`
    query TokenPromo($chain: Chain!, $address: String = null) {
  token(chain: $chain, address: $address) {
    id
    address
    chain
    market(currency: USD) {
      id
      price {
        id
        value
      }
      pricePercentChange(duration: DAY) {
        id
        value
      }
    }
  }
}
    `;

/**
 * __useTokenPromoQuery__
 *
 * To run a query within a React component, call `useTokenPromoQuery` and pass it any options that fit your needs.
 * When your component renders, `useTokenPromoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTokenPromoQuery({
 *   variables: {
 *      chain: // value for 'chain'
 *      address: // value for 'address'
 *   },
 * });
 */
export function useTokenPromoQuery(baseOptions: Apollo.QueryHookOptions<TokenPromoQuery, TokenPromoQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<TokenPromoQuery, TokenPromoQueryVariables>(TokenPromoDocument, options);
}
export function useTokenPromoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TokenPromoQuery, TokenPromoQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<TokenPromoQuery, TokenPromoQueryVariables>(TokenPromoDocument, options);
}
export type TokenPromoQueryHookResult = ReturnType<typeof useTokenPromoQuery>;
export type TokenPromoLazyQueryHookResult = ReturnType<typeof useTokenPromoLazyQuery>;
export type TokenPromoQueryResult = Apollo.QueryResult<TokenPromoQuery, TokenPromoQueryVariables>;
export const CollectionPromoDocument = gql`
    query CollectionPromo($addresses: [String!]!) {
  nftCollections(filter: {addresses: $addresses}) {
    edges {
      node {
        markets(currencies: ETH) {
          floorPricePercentChange(duration: DAY) {
            value
          }
        }
      }
    }
  }
}
    `;

/**
 * __useCollectionPromoQuery__
 *
 * To run a query within a React component, call `useCollectionPromoQuery` and pass it any options that fit your needs.
 * When your component renders, `useCollectionPromoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCollectionPromoQuery({
 *   variables: {
 *      addresses: // value for 'addresses'
 *   },
 * });
 */
export function useCollectionPromoQuery(baseOptions: Apollo.QueryHookOptions<CollectionPromoQuery, CollectionPromoQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<CollectionPromoQuery, CollectionPromoQueryVariables>(CollectionPromoDocument, options);
}
export function useCollectionPromoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CollectionPromoQuery, CollectionPromoQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<CollectionPromoQuery, CollectionPromoQueryVariables>(CollectionPromoDocument, options);
}
export type CollectionPromoQueryHookResult = ReturnType<typeof useCollectionPromoQuery>;
export type CollectionPromoLazyQueryHookResult = ReturnType<typeof useCollectionPromoLazyQuery>;
export type CollectionPromoQueryResult = Apollo.QueryResult<CollectionPromoQuery, CollectionPromoQueryVariables>;
export const DailyProtocolVolumeDocument = gql`
    query DailyProtocolVolume($version: ProtocolVersion!) {
  historicalProtocolVolume(chain: ETHEREUM, version: $version, duration: MONTH) {
    value
  }
}
    `;

/**
 * __useDailyProtocolVolumeQuery__
 *
 * To run a query within a React component, call `useDailyProtocolVolumeQuery` and pass it any options that fit your needs.
 * When your component renders, `useDailyProtocolVolumeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDailyProtocolVolumeQuery({
 *   variables: {
 *      version: // value for 'version'
 *   },
 * });
 */
export function useDailyProtocolVolumeQuery(baseOptions: Apollo.QueryHookOptions<DailyProtocolVolumeQuery, DailyProtocolVolumeQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<DailyProtocolVolumeQuery, DailyProtocolVolumeQueryVariables>(DailyProtocolVolumeDocument, options);
}
export function useDailyProtocolVolumeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DailyProtocolVolumeQuery, DailyProtocolVolumeQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<DailyProtocolVolumeQuery, DailyProtocolVolumeQueryVariables>(DailyProtocolVolumeDocument, options);
}
export type DailyProtocolVolumeQueryHookResult = ReturnType<typeof useDailyProtocolVolumeQuery>;
export type DailyProtocolVolumeLazyQueryHookResult = ReturnType<typeof useDailyProtocolVolumeLazyQuery>;
export type DailyProtocolVolumeQueryResult = Apollo.QueryResult<DailyProtocolVolumeQuery, DailyProtocolVolumeQueryVariables>;
export const CollectionSearchDocument = gql`
    query CollectionSearch($query: String!) {
  nftCollections(filter: {nameQuery: $query}) {
    edges {
      cursor
      node {
        image {
          url
        }
        isVerified
        name
        numAssets
        nftContracts {
          address
          chain
          name
          symbol
          totalSupply
        }
        markets(currencies: ETH) {
          floorPrice {
            currency
            value
          }
        }
      }
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
  }
}
    `;

/**
 * __useCollectionSearchQuery__
 *
 * To run a query within a React component, call `useCollectionSearchQuery` and pass it any options that fit your needs.
 * When your component renders, `useCollectionSearchQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCollectionSearchQuery({
 *   variables: {
 *      query: // value for 'query'
 *   },
 * });
 */
export function useCollectionSearchQuery(baseOptions: Apollo.QueryHookOptions<CollectionSearchQuery, CollectionSearchQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<CollectionSearchQuery, CollectionSearchQueryVariables>(CollectionSearchDocument, options);
}
export function useCollectionSearchLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CollectionSearchQuery, CollectionSearchQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<CollectionSearchQuery, CollectionSearchQueryVariables>(CollectionSearchDocument, options);
}
export type CollectionSearchQueryHookResult = ReturnType<typeof useCollectionSearchQuery>;
export type CollectionSearchLazyQueryHookResult = ReturnType<typeof useCollectionSearchLazyQuery>;
export type CollectionSearchQueryResult = Apollo.QueryResult<CollectionSearchQuery, CollectionSearchQueryVariables>;
export const NftDetailsDocument = gql`
    query NftDetails($address: String!, $tokenId: String!) {
  nftAssets(address: $address, filter: {listed: false, tokenIds: [$tokenId]}) {
    edges {
      node {
        id
        name
        ownerAddress
        image {
          url
        }
        smallImage {
          url
        }
        originalImage {
          url
        }
        tokenId
        description
        animationUrl
        suspiciousFlag
        creator {
          address
          profileImage {
            url
          }
          isVerified
        }
        collection {
          name
          isVerified
          numAssets
          twitterName
          discordUrl
          homepageUrl
          image {
            url
          }
          nftContracts {
            address
            standard
          }
          description
        }
        listings(first: 1) {
          edges {
            node {
              address
              createdAt
              endAt
              id
              maker
              marketplace
              marketplaceUrl
              orderHash
              price {
                currency
                value
              }
              quantity
              startAt
              status
              taker
              tokenId
              type
              protocolParameters
            }
            cursor
          }
        }
        rarities {
          provider
          rank
          score
        }
        metadataUrl
        traits {
          name
          value
        }
      }
    }
  }
}
    `;

/**
 * __useNftDetailsQuery__
 *
 * To run a query within a React component, call `useNftDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useNftDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNftDetailsQuery({
 *   variables: {
 *      address: // value for 'address'
 *      tokenId: // value for 'tokenId'
 *   },
 * });
 */
export function useNftDetailsQuery(baseOptions: Apollo.QueryHookOptions<NftDetailsQuery, NftDetailsQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<NftDetailsQuery, NftDetailsQueryVariables>(NftDetailsDocument, options);
}
export function useNftDetailsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NftDetailsQuery, NftDetailsQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<NftDetailsQuery, NftDetailsQueryVariables>(NftDetailsDocument, options);
}
export type NftDetailsQueryHookResult = ReturnType<typeof useNftDetailsQuery>;
export type NftDetailsLazyQueryHookResult = ReturnType<typeof useNftDetailsLazyQuery>;
export type NftDetailsQueryResult = Apollo.QueryResult<NftDetailsQuery, NftDetailsQueryVariables>;
export const NftActivityDocument = gql`
    query NftActivity($filter: NftActivityFilterInput, $after: String, $first: Int) {
  nftActivity(filter: $filter, after: $after, first: $first) {
    edges {
      node {
        id
        address
        tokenId
        asset {
          id
          metadataUrl
          image {
            id
            url
          }
          smallImage {
            id
            url
          }
          name
          rarities {
            id
            provider
            rank
            score
          }
          suspiciousFlag
          nftContract {
            id
            standard
          }
          collection {
            id
            image {
              id
              url
            }
          }
        }
        type
        marketplace
        fromAddress
        toAddress
        transactionHash
        price {
          id
          value
        }
        orderStatus
        quantity
        url
        timestamp
      }
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
  }
}
    `;

/**
 * __useNftActivityQuery__
 *
 * To run a query within a React component, call `useNftActivityQuery` and pass it any options that fit your needs.
 * When your component renders, `useNftActivityQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNftActivityQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      after: // value for 'after'
 *      first: // value for 'first'
 *   },
 * });
 */
export function useNftActivityQuery(baseOptions?: Apollo.QueryHookOptions<NftActivityQuery, NftActivityQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<NftActivityQuery, NftActivityQueryVariables>(NftActivityDocument, options);
}
export function useNftActivityLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NftActivityQuery, NftActivityQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<NftActivityQuery, NftActivityQueryVariables>(NftActivityDocument, options);
}
export type NftActivityQueryHookResult = ReturnType<typeof useNftActivityQuery>;
export type NftActivityLazyQueryHookResult = ReturnType<typeof useNftActivityLazyQuery>;
export type NftActivityQueryResult = Apollo.QueryResult<NftActivityQuery, NftActivityQueryVariables>;
export const NftBalanceDocument = gql`
    query NftBalance($ownerAddress: String!, $filter: NftBalancesFilterInput, $first: Int, $after: String, $last: Int, $before: String) {
  nftBalances(
    ownerAddress: $ownerAddress
    filter: $filter
    first: $first
    after: $after
    last: $last
    before: $before
  ) {
    edges {
      node {
        ownedAsset {
          id
          animationUrl
          collection {
            id
            isVerified
            image {
              id
              url
            }
            name
            twitterName
            nftContracts {
              id
              address
              chain
              name
              standard
              symbol
              totalSupply
            }
            markets(currencies: ETH) {
              id
              floorPrice {
                id
                value
              }
            }
          }
          description
          flaggedBy
          image {
            id
            url
          }
          originalImage {
            id
            url
          }
          name
          ownerAddress
          smallImage {
            id
            url
          }
          suspiciousFlag
          tokenId
          thumbnail {
            id
            url
          }
          listings(first: 1) {
            edges {
              node {
                price {
                  id
                  value
                  currency
                }
                createdAt
                marketplace
                endAt
              }
            }
          }
        }
        listedMarketplaces
        listingFees {
          id
          payoutAddress
          basisPoints
        }
        lastPrice {
          id
          currency
          timestamp
          value
        }
      }
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
  }
}
    `;

/**
 * __useNftBalanceQuery__
 *
 * To run a query within a React component, call `useNftBalanceQuery` and pass it any options that fit your needs.
 * When your component renders, `useNftBalanceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNftBalanceQuery({
 *   variables: {
 *      ownerAddress: // value for 'ownerAddress'
 *      filter: // value for 'filter'
 *      first: // value for 'first'
 *      after: // value for 'after'
 *      last: // value for 'last'
 *      before: // value for 'before'
 *   },
 * });
 */
export function useNftBalanceQuery(baseOptions: Apollo.QueryHookOptions<NftBalanceQuery, NftBalanceQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<NftBalanceQuery, NftBalanceQueryVariables>(NftBalanceDocument, options);
}
export function useNftBalanceLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NftBalanceQuery, NftBalanceQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<NftBalanceQuery, NftBalanceQueryVariables>(NftBalanceDocument, options);
}
export type NftBalanceQueryHookResult = ReturnType<typeof useNftBalanceQuery>;
export type NftBalanceLazyQueryHookResult = ReturnType<typeof useNftBalanceLazyQuery>;
export type NftBalanceQueryResult = Apollo.QueryResult<NftBalanceQuery, NftBalanceQueryVariables>;
export const NftRouteDocument = gql`
    query NftRoute($chain: Chain = ETHEREUM, $senderAddress: String!, $nftTrades: [NftTradeInput!]!, $tokenTrades: [TokenTradeInput!]) {
  nftRoute(
    chain: $chain
    senderAddress: $senderAddress
    nftTrades: $nftTrades
    tokenTrades: $tokenTrades
  ) {
    id
    calldata
    route {
      amount
      contractAddress
      id
      marketplace
      price {
        id
        currency
        value
      }
      quotePrice {
        id
        currency
        value
      }
      tokenId
      tokenType
    }
    sendAmount {
      id
      currency
      value
    }
    toAddress
  }
}
    `;

/**
 * __useNftRouteQuery__
 *
 * To run a query within a React component, call `useNftRouteQuery` and pass it any options that fit your needs.
 * When your component renders, `useNftRouteQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNftRouteQuery({
 *   variables: {
 *      chain: // value for 'chain'
 *      senderAddress: // value for 'senderAddress'
 *      nftTrades: // value for 'nftTrades'
 *      tokenTrades: // value for 'tokenTrades'
 *   },
 * });
 */
export function useNftRouteQuery(baseOptions: Apollo.QueryHookOptions<NftRouteQuery, NftRouteQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<NftRouteQuery, NftRouteQueryVariables>(NftRouteDocument, options);
}
export function useNftRouteLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NftRouteQuery, NftRouteQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<NftRouteQuery, NftRouteQueryVariables>(NftRouteDocument, options);
}
export type NftRouteQueryHookResult = ReturnType<typeof useNftRouteQuery>;
export type NftRouteLazyQueryHookResult = ReturnType<typeof useNftRouteLazyQuery>;
export type NftRouteQueryResult = Apollo.QueryResult<NftRouteQuery, NftRouteQueryVariables>;
export const NftUniversalRouterAddressDocument = gql`
    query NftUniversalRouterAddress($chain: Chain = ETHEREUM) {
  nftRoute(chain: $chain, senderAddress: "", nftTrades: []) {
    toAddress
  }
}
    `;

/**
 * __useNftUniversalRouterAddressQuery__
 *
 * To run a query within a React component, call `useNftUniversalRouterAddressQuery` and pass it any options that fit your needs.
 * When your component renders, `useNftUniversalRouterAddressQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNftUniversalRouterAddressQuery({
 *   variables: {
 *      chain: // value for 'chain'
 *   },
 * });
 */
export function useNftUniversalRouterAddressQuery(baseOptions?: Apollo.QueryHookOptions<NftUniversalRouterAddressQuery, NftUniversalRouterAddressQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<NftUniversalRouterAddressQuery, NftUniversalRouterAddressQueryVariables>(NftUniversalRouterAddressDocument, options);
}
export function useNftUniversalRouterAddressLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NftUniversalRouterAddressQuery, NftUniversalRouterAddressQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<NftUniversalRouterAddressQuery, NftUniversalRouterAddressQueryVariables>(NftUniversalRouterAddressDocument, options);
}
export type NftUniversalRouterAddressQueryHookResult = ReturnType<typeof useNftUniversalRouterAddressQuery>;
export type NftUniversalRouterAddressLazyQueryHookResult = ReturnType<typeof useNftUniversalRouterAddressLazyQuery>;
export type NftUniversalRouterAddressQueryResult = Apollo.QueryResult<NftUniversalRouterAddressQuery, NftUniversalRouterAddressQueryVariables>;
export const TrendingCollectionsDocument = gql`
    query TrendingCollections($size: Int, $timePeriod: HistoryDuration) {
  topCollections(first: $size, duration: $timePeriod) {
    edges {
      node {
        name
        nftContracts {
          address
          totalSupply
        }
        image {
          url
        }
        bannerImage {
          url
        }
        isVerified
        markets(currencies: ETH) {
          floorPrice {
            value
          }
          owners
          totalVolume {
            value
          }
          volume(duration: $timePeriod) {
            value
          }
          volumePercentChange(duration: $timePeriod) {
            value
          }
          floorPricePercentChange(duration: $timePeriod) {
            value
          }
          sales {
            value
          }
          listings {
            value
          }
        }
      }
    }
  }
}
    `;

/**
 * __useTrendingCollectionsQuery__
 *
 * To run a query within a React component, call `useTrendingCollectionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useTrendingCollectionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTrendingCollectionsQuery({
 *   variables: {
 *      size: // value for 'size'
 *      timePeriod: // value for 'timePeriod'
 *   },
 * });
 */
export function useTrendingCollectionsQuery(baseOptions?: Apollo.QueryHookOptions<TrendingCollectionsQuery, TrendingCollectionsQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<TrendingCollectionsQuery, TrendingCollectionsQueryVariables>(TrendingCollectionsDocument, options);
}
export function useTrendingCollectionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TrendingCollectionsQuery, TrendingCollectionsQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<TrendingCollectionsQuery, TrendingCollectionsQueryVariables>(TrendingCollectionsDocument, options);
}
export type TrendingCollectionsQueryHookResult = ReturnType<typeof useTrendingCollectionsQuery>;
export type TrendingCollectionsLazyQueryHookResult = ReturnType<typeof useTrendingCollectionsLazyQuery>;
export type TrendingCollectionsQueryResult = Apollo.QueryResult<TrendingCollectionsQuery, TrendingCollectionsQueryVariables>;
export const AssetDocument = gql`
    query Asset($address: String!, $orderBy: NftAssetSortableField, $asc: Boolean, $filter: NftAssetsFilterInput, $first: Int, $after: String, $last: Int, $before: String) {
  nftAssets(
    address: $address
    orderBy: $orderBy
    asc: $asc
    filter: $filter
    first: $first
    after: $after
    last: $last
    before: $before
  ) {
    edges {
      node {
        id
        name
        image {
          url
        }
        smallImage {
          url
        }
        tokenId
        animationUrl
        suspiciousFlag
        collection {
          name
          isVerified
          nftContracts {
            address
            standard
          }
        }
        listings(first: 1) {
          edges {
            node {
              address
              createdAt
              endAt
              id
              maker
              marketplace
              marketplaceUrl
              orderHash
              price {
                currency
                value
              }
              quantity
              startAt
              status
              taker
              tokenId
              type
              protocolParameters
            }
            cursor
          }
        }
        rarities {
          rank
        }
      }
      cursor
    }
    totalCount
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
  }
}
    `;

/**
 * __useAssetQuery__
 *
 * To run a query within a React component, call `useAssetQuery` and pass it any options that fit your needs.
 * When your component renders, `useAssetQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAssetQuery({
 *   variables: {
 *      address: // value for 'address'
 *      orderBy: // value for 'orderBy'
 *      asc: // value for 'asc'
 *      filter: // value for 'filter'
 *      first: // value for 'first'
 *      after: // value for 'after'
 *      last: // value for 'last'
 *      before: // value for 'before'
 *   },
 * });
 */
export function useAssetQuery(baseOptions: Apollo.QueryHookOptions<AssetQuery, AssetQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AssetQuery, AssetQueryVariables>(AssetDocument, options);
}
export function useAssetLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AssetQuery, AssetQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AssetQuery, AssetQueryVariables>(AssetDocument, options);
}
export type AssetQueryHookResult = ReturnType<typeof useAssetQuery>;
export type AssetLazyQueryHookResult = ReturnType<typeof useAssetLazyQuery>;
export type AssetQueryResult = Apollo.QueryResult<AssetQuery, AssetQueryVariables>;
export const CollectionDocument = gql`
    query Collection($addresses: [String!]!) {
  nftCollections(filter: {addresses: $addresses}) {
    edges {
      cursor
      node {
        bannerImage {
          url
        }
        collectionId
        description
        discordUrl
        homepageUrl
        image {
          url
        }
        instagramName
        isVerified
        name
        numAssets
        twitterName
        nftContracts {
          address
          chain
          name
          standard
          symbol
          totalSupply
        }
        traits {
          name
          values
          stats {
            name
            value
            assets
            listings
          }
        }
        markets(currencies: ETH) {
          floorPrice {
            currency
            value
          }
          owners
          totalVolume {
            value
            currency
          }
          listings {
            value
          }
          volume(duration: DAY) {
            value
            currency
          }
          volumePercentChange(duration: DAY) {
            value
            currency
          }
          floorPricePercentChange(duration: DAY) {
            value
            currency
          }
          marketplaces {
            marketplace
            listings
            floorPrice
          }
        }
      }
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
  }
}
    `;

/**
 * __useCollectionQuery__
 *
 * To run a query within a React component, call `useCollectionQuery` and pass it any options that fit your needs.
 * When your component renders, `useCollectionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCollectionQuery({
 *   variables: {
 *      addresses: // value for 'addresses'
 *   },
 * });
 */
export function useCollectionQuery(baseOptions: Apollo.QueryHookOptions<CollectionQuery, CollectionQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<CollectionQuery, CollectionQueryVariables>(CollectionDocument, options);
}
export function useCollectionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CollectionQuery, CollectionQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<CollectionQuery, CollectionQueryVariables>(CollectionDocument, options);
}
export type CollectionQueryHookResult = ReturnType<typeof useCollectionQuery>;
export type CollectionLazyQueryHookResult = ReturnType<typeof useCollectionLazyQuery>;
export type CollectionQueryResult = Apollo.QueryResult<CollectionQuery, CollectionQueryVariables>;
export const V3PoolDocument = gql`
    query V3Pool($chain: Chain!, $address: String!) {
  v3Pool(chain: $chain, address: $address) {
    id
    protocolVersion
    address
    feeTier
    token0 {
      ...PoolToken
      project {
        id
        markets(currencies: [USD]) {
          id
          price {
            id
            value
          }
        }
        logo {
          id
          url
        }
      }
    }
    token0Supply
    token1 {
      ...PoolToken
      project {
        id
        markets(currencies: [USD]) {
          id
          price {
            id
            value
          }
        }
        logo {
          id
          url
        }
      }
    }
    token1Supply
    txCount
    volume24h: cumulativeVolume(duration: DAY) {
      value
    }
    historicalVolume(duration: WEEK) {
      value
      timestamp
    }
    totalLiquidity {
      value
    }
    totalLiquidityPercentChange24h {
      value
    }
  }
}
    ${PoolTokenFragmentDoc}`;

/**
 * __useV3PoolQuery__
 *
 * To run a query within a React component, call `useV3PoolQuery` and pass it any options that fit your needs.
 * When your component renders, `useV3PoolQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useV3PoolQuery({
 *   variables: {
 *      chain: // value for 'chain'
 *      address: // value for 'address'
 *   },
 * });
 */
export function useV3PoolQuery(baseOptions: Apollo.QueryHookOptions<V3PoolQuery, V3PoolQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<V3PoolQuery, V3PoolQueryVariables>(V3PoolDocument, options);
}
export function useV3PoolLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<V3PoolQuery, V3PoolQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<V3PoolQuery, V3PoolQueryVariables>(V3PoolDocument, options);
}
export type V3PoolQueryHookResult = ReturnType<typeof useV3PoolQuery>;
export type V3PoolLazyQueryHookResult = ReturnType<typeof useV3PoolLazyQuery>;
export type V3PoolQueryResult = Apollo.QueryResult<V3PoolQuery, V3PoolQueryVariables>;
export const PoolPriceHistoryDocument = gql`
    query PoolPriceHistory($chain: Chain!, $address: String!, $duration: HistoryDuration!, $isV3: Boolean!) {
  v3Pool(chain: $chain, address: $address) @include(if: $isV3) {
    id
    priceHistory(duration: $duration) {
      id
      token0Price
      token1Price
      timestamp
    }
  }
  v2Pair(chain: ETHEREUM, address: $address) @skip(if: $isV3) {
    id
    priceHistory(duration: $duration) {
      id
      token0Price
      token1Price
      timestamp
    }
  }
}
    `;

/**
 * __usePoolPriceHistoryQuery__
 *
 * To run a query within a React component, call `usePoolPriceHistoryQuery` and pass it any options that fit your needs.
 * When your component renders, `usePoolPriceHistoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePoolPriceHistoryQuery({
 *   variables: {
 *      chain: // value for 'chain'
 *      address: // value for 'address'
 *      duration: // value for 'duration'
 *      isV3: // value for 'isV3'
 *   },
 * });
 */
export function usePoolPriceHistoryQuery(baseOptions: Apollo.QueryHookOptions<PoolPriceHistoryQuery, PoolPriceHistoryQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<PoolPriceHistoryQuery, PoolPriceHistoryQueryVariables>(PoolPriceHistoryDocument, options);
}
export function usePoolPriceHistoryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PoolPriceHistoryQuery, PoolPriceHistoryQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<PoolPriceHistoryQuery, PoolPriceHistoryQueryVariables>(PoolPriceHistoryDocument, options);
}
export type PoolPriceHistoryQueryHookResult = ReturnType<typeof usePoolPriceHistoryQuery>;
export type PoolPriceHistoryLazyQueryHookResult = ReturnType<typeof usePoolPriceHistoryLazyQuery>;
export type PoolPriceHistoryQueryResult = Apollo.QueryResult<PoolPriceHistoryQuery, PoolPriceHistoryQueryVariables>;
export const PoolVolumeHistoryDocument = gql`
    query PoolVolumeHistory($chain: Chain!, $address: String!, $duration: HistoryDuration!, $isV3: Boolean!) {
  v3Pool(chain: $chain, address: $address) @include(if: $isV3) {
    id
    historicalVolume(duration: $duration) {
      id
      value
      timestamp
    }
  }
  v2Pair(chain: ETHEREUM, address: $address) @skip(if: $isV3) {
    id
    historicalVolume(duration: $duration) {
      id
      value
      timestamp
    }
  }
}
    `;

/**
 * __usePoolVolumeHistoryQuery__
 *
 * To run a query within a React component, call `usePoolVolumeHistoryQuery` and pass it any options that fit your needs.
 * When your component renders, `usePoolVolumeHistoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePoolVolumeHistoryQuery({
 *   variables: {
 *      chain: // value for 'chain'
 *      address: // value for 'address'
 *      duration: // value for 'duration'
 *      isV3: // value for 'isV3'
 *   },
 * });
 */
export function usePoolVolumeHistoryQuery(baseOptions: Apollo.QueryHookOptions<PoolVolumeHistoryQuery, PoolVolumeHistoryQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<PoolVolumeHistoryQuery, PoolVolumeHistoryQueryVariables>(PoolVolumeHistoryDocument, options);
}
export function usePoolVolumeHistoryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PoolVolumeHistoryQuery, PoolVolumeHistoryQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<PoolVolumeHistoryQuery, PoolVolumeHistoryQueryVariables>(PoolVolumeHistoryDocument, options);
}
export type PoolVolumeHistoryQueryHookResult = ReturnType<typeof usePoolVolumeHistoryQuery>;
export type PoolVolumeHistoryLazyQueryHookResult = ReturnType<typeof usePoolVolumeHistoryLazyQuery>;
export type PoolVolumeHistoryQueryResult = Apollo.QueryResult<PoolVolumeHistoryQuery, PoolVolumeHistoryQueryVariables>;
export const V2PairDocument = gql`
    query V2Pair($address: String!) {
  v2Pair(chain: ETHEREUM, address: $address) {
    id
    protocolVersion
    address
    token0 {
      ...PoolToken
      project {
        id
        markets(currencies: [USD]) {
          id
          price {
            id
            value
          }
        }
        logo {
          id
          url
        }
      }
    }
    token0Supply
    token1 {
      ...PoolToken
      project {
        id
        markets(currencies: [USD]) {
          id
          price {
            id
            value
          }
        }
        logo {
          id
          url
        }
      }
    }
    token1Supply
    txCount
    volume24h: cumulativeVolume(duration: DAY) {
      value
    }
    historicalVolume(duration: WEEK) {
      value
      timestamp
    }
    totalLiquidity {
      value
    }
    totalLiquidityPercentChange24h {
      value
    }
  }
}
    ${PoolTokenFragmentDoc}`;

/**
 * __useV2PairQuery__
 *
 * To run a query within a React component, call `useV2PairQuery` and pass it any options that fit your needs.
 * When your component renders, `useV2PairQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useV2PairQuery({
 *   variables: {
 *      address: // value for 'address'
 *   },
 * });
 */
export function useV2PairQuery(baseOptions: Apollo.QueryHookOptions<V2PairQuery, V2PairQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<V2PairQuery, V2PairQueryVariables>(V2PairDocument, options);
}
export function useV2PairLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<V2PairQuery, V2PairQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<V2PairQuery, V2PairQueryVariables>(V2PairDocument, options);
}
export type V2PairQueryHookResult = ReturnType<typeof useV2PairQuery>;
export type V2PairLazyQueryHookResult = ReturnType<typeof useV2PairLazyQuery>;
export type V2PairQueryResult = Apollo.QueryResult<V2PairQuery, V2PairQueryVariables>;
export const V3PoolTransactionsDocument = gql`
    query V3PoolTransactions($chain: Chain!, $address: String!, $first: Int!, $cursor: Int) {
  v3Pool(chain: $chain, address: $address) {
    id
    transactions(first: $first, timestampCursor: $cursor) {
      timestamp
      hash
      account
      token0 {
        ...PoolTransactionToken
      }
      token0Quantity
      token1 {
        ...PoolTransactionToken
      }
      token1Quantity
      usdValue {
        value
      }
      type
    }
  }
}
    ${PoolTransactionTokenFragmentDoc}`;

/**
 * __useV3PoolTransactionsQuery__
 *
 * To run a query within a React component, call `useV3PoolTransactionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useV3PoolTransactionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useV3PoolTransactionsQuery({
 *   variables: {
 *      chain: // value for 'chain'
 *      address: // value for 'address'
 *      first: // value for 'first'
 *      cursor: // value for 'cursor'
 *   },
 * });
 */
export function useV3PoolTransactionsQuery(baseOptions: Apollo.QueryHookOptions<V3PoolTransactionsQuery, V3PoolTransactionsQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<V3PoolTransactionsQuery, V3PoolTransactionsQueryVariables>(V3PoolTransactionsDocument, options);
}
export function useV3PoolTransactionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<V3PoolTransactionsQuery, V3PoolTransactionsQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<V3PoolTransactionsQuery, V3PoolTransactionsQueryVariables>(V3PoolTransactionsDocument, options);
}
export type V3PoolTransactionsQueryHookResult = ReturnType<typeof useV3PoolTransactionsQuery>;
export type V3PoolTransactionsLazyQueryHookResult = ReturnType<typeof useV3PoolTransactionsLazyQuery>;
export type V3PoolTransactionsQueryResult = Apollo.QueryResult<V3PoolTransactionsQuery, V3PoolTransactionsQueryVariables>;
export const V2PairTransactionsDocument = gql`
    query V2PairTransactions($address: String!, $first: Int!, $cursor: Int) {
  v2Pair(chain: ETHEREUM, address: $address) {
    id
    transactions(first: $first, timestampCursor: $cursor) {
      timestamp
      hash
      account
      token0 {
        ...PoolTransactionToken
      }
      token0Quantity
      token1 {
        ...PoolTransactionToken
      }
      token1Quantity
      usdValue {
        value
      }
      type
    }
  }
}
    ${PoolTransactionTokenFragmentDoc}`;

/**
 * __useV2PairTransactionsQuery__
 *
 * To run a query within a React component, call `useV2PairTransactionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useV2PairTransactionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useV2PairTransactionsQuery({
 *   variables: {
 *      address: // value for 'address'
 *      first: // value for 'first'
 *      cursor: // value for 'cursor'
 *   },
 * });
 */
export function useV2PairTransactionsQuery(baseOptions: Apollo.QueryHookOptions<V2PairTransactionsQuery, V2PairTransactionsQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<V2PairTransactionsQuery, V2PairTransactionsQueryVariables>(V2PairTransactionsDocument, options);
}
export function useV2PairTransactionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<V2PairTransactionsQuery, V2PairTransactionsQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<V2PairTransactionsQuery, V2PairTransactionsQueryVariables>(V2PairTransactionsDocument, options);
}
export type V2PairTransactionsQueryHookResult = ReturnType<typeof useV2PairTransactionsQuery>;
export type V2PairTransactionsLazyQueryHookResult = ReturnType<typeof useV2PairTransactionsLazyQuery>;
export type V2PairTransactionsQueryResult = Apollo.QueryResult<V2PairTransactionsQuery, V2PairTransactionsQueryVariables>;
export const PortfolioBalancesWebDocument = gql`
    query PortfolioBalancesWeb($ownerAddress: String!, $chains: [Chain!]!) {
  portfolios(ownerAddresses: [$ownerAddress], chains: $chains) {
    id
    tokensTotalDenominatedValue {
      id
      value
    }
    tokensTotalDenominatedValueChange(duration: DAY) {
      absolute {
        id
        value
      }
      percentage {
        id
        value
      }
    }
    tokenBalances {
      ...PortfolioTokenBalanceParts
    }
  }
}
    ${PortfolioTokenBalancePartsFragmentDoc}`;

/**
 * __usePortfolioBalancesWebQuery__
 *
 * To run a query within a React component, call `usePortfolioBalancesWebQuery` and pass it any options that fit your needs.
 * When your component renders, `usePortfolioBalancesWebQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePortfolioBalancesWebQuery({
 *   variables: {
 *      ownerAddress: // value for 'ownerAddress'
 *      chains: // value for 'chains'
 *   },
 * });
 */
export function usePortfolioBalancesWebQuery(baseOptions: Apollo.QueryHookOptions<PortfolioBalancesWebQuery, PortfolioBalancesWebQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<PortfolioBalancesWebQuery, PortfolioBalancesWebQueryVariables>(PortfolioBalancesWebDocument, options);
}
export function usePortfolioBalancesWebLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PortfolioBalancesWebQuery, PortfolioBalancesWebQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<PortfolioBalancesWebQuery, PortfolioBalancesWebQueryVariables>(PortfolioBalancesWebDocument, options);
}
export type PortfolioBalancesWebQueryHookResult = ReturnType<typeof usePortfolioBalancesWebQuery>;
export type PortfolioBalancesWebLazyQueryHookResult = ReturnType<typeof usePortfolioBalancesWebLazyQuery>;
export type PortfolioBalancesWebQueryResult = Apollo.QueryResult<PortfolioBalancesWebQuery, PortfolioBalancesWebQueryVariables>;
export const TrendingTokensDocument = gql`
    query TrendingTokens($chain: Chain!) {
  topTokens(pageSize: 4, page: 1, chain: $chain, orderBy: VOLUME) {
    id
    decimals
    name
    chain
    standard
    address
    symbol
    market(currency: USD) {
      id
      price {
        id
        value
        currency
      }
      pricePercentChange(duration: DAY) {
        id
        value
      }
      volume24H: volume(duration: DAY) {
        id
        value
        currency
      }
    }
    project {
      id
      logoUrl
      safetyLevel
    }
  }
}
    `;

/**
 * __useTrendingTokensQuery__
 *
 * To run a query within a React component, call `useTrendingTokensQuery` and pass it any options that fit your needs.
 * When your component renders, `useTrendingTokensQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTrendingTokensQuery({
 *   variables: {
 *      chain: // value for 'chain'
 *   },
 * });
 */
export function useTrendingTokensQuery(baseOptions: Apollo.QueryHookOptions<TrendingTokensQuery, TrendingTokensQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<TrendingTokensQuery, TrendingTokensQueryVariables>(TrendingTokensDocument, options);
}
export function useTrendingTokensLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TrendingTokensQuery, TrendingTokensQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<TrendingTokensQuery, TrendingTokensQueryVariables>(TrendingTokensDocument, options);
}
export type TrendingTokensQueryHookResult = ReturnType<typeof useTrendingTokensQuery>;
export type TrendingTokensLazyQueryHookResult = ReturnType<typeof useTrendingTokensLazyQuery>;
export type TrendingTokensQueryResult = Apollo.QueryResult<TrendingTokensQuery, TrendingTokensQueryVariables>;
export const SearchTokensWebDocument = gql`
    query SearchTokensWeb($searchQuery: String!, $chains: [Chain!]) {
  searchTokens(searchQuery: $searchQuery, chains: $chains) {
    id
    decimals
    name
    chain
    standard
    address
    symbol
    market(currency: USD) {
      id
      price {
        id
        value
        currency
      }
      pricePercentChange(duration: DAY) {
        id
        value
      }
      volume24H: volume(duration: DAY) {
        id
        value
        currency
      }
    }
    project {
      id
      logoUrl
      safetyLevel
      isSpam
    }
  }
}
    `;

/**
 * __useSearchTokensWebQuery__
 *
 * To run a query within a React component, call `useSearchTokensWebQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchTokensWebQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchTokensWebQuery({
 *   variables: {
 *      searchQuery: // value for 'searchQuery'
 *      chains: // value for 'chains'
 *   },
 * });
 */
export function useSearchTokensWebQuery(baseOptions: Apollo.QueryHookOptions<SearchTokensWebQuery, SearchTokensWebQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<SearchTokensWebQuery, SearchTokensWebQueryVariables>(SearchTokensWebDocument, options);
}
export function useSearchTokensWebLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchTokensWebQuery, SearchTokensWebQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<SearchTokensWebQuery, SearchTokensWebQueryVariables>(SearchTokensWebDocument, options);
}
export type SearchTokensWebQueryHookResult = ReturnType<typeof useSearchTokensWebQuery>;
export type SearchTokensWebLazyQueryHookResult = ReturnType<typeof useSearchTokensWebLazyQuery>;
export type SearchTokensWebQueryResult = Apollo.QueryResult<SearchTokensWebQuery, SearchTokensWebQueryVariables>;
export const TopTokens100Document = gql`
    query TopTokens100($duration: HistoryDuration!, $chain: Chain!) {
  topTokens(pageSize: 100, page: 1, chain: $chain, orderBy: VOLUME) {
    id
    name
    chain
    address
    symbol
    standard
    market(currency: USD) {
      id
      totalValueLocked {
        id
        value
        currency
      }
      price {
        id
        value
        currency
      }
      pricePercentChange(duration: $duration) {
        id
        currency
        value
      }
      pricePercentChange1Hour: pricePercentChange(duration: HOUR) {
        id
        currency
        value
      }
      pricePercentChange1Day: pricePercentChange(duration: DAY) {
        id
        currency
        value
      }
      volume(duration: $duration) {
        id
        value
        currency
      }
    }
    project {
      id
      logoUrl
      markets(currencies: [USD]) {
        id
        fullyDilutedValuation {
          id
          value
          currency
        }
      }
    }
  }
}
    `;

/**
 * __useTopTokens100Query__
 *
 * To run a query within a React component, call `useTopTokens100Query` and pass it any options that fit your needs.
 * When your component renders, `useTopTokens100Query` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTopTokens100Query({
 *   variables: {
 *      duration: // value for 'duration'
 *      chain: // value for 'chain'
 *   },
 * });
 */
export function useTopTokens100Query(baseOptions: Apollo.QueryHookOptions<TopTokens100Query, TopTokens100QueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<TopTokens100Query, TopTokens100QueryVariables>(TopTokens100Document, options);
}
export function useTopTokens100LazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TopTokens100Query, TopTokens100QueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<TopTokens100Query, TopTokens100QueryVariables>(TopTokens100Document, options);
}
export type TopTokens100QueryHookResult = ReturnType<typeof useTopTokens100Query>;
export type TopTokens100LazyQueryHookResult = ReturnType<typeof useTopTokens100LazyQuery>;
export type TopTokens100QueryResult = Apollo.QueryResult<TopTokens100Query, TopTokens100QueryVariables>;
export const TopTokensSparklineDocument = gql`
    query TopTokensSparkline($duration: HistoryDuration!, $chain: Chain!) {
  topTokens(pageSize: 100, page: 1, chain: $chain, orderBy: VOLUME) {
    id
    address
    chain
    market(currency: USD) {
      id
      priceHistory(duration: $duration) {
        id
        timestamp
        value
      }
    }
  }
}
    `;

/**
 * __useTopTokensSparklineQuery__
 *
 * To run a query within a React component, call `useTopTokensSparklineQuery` and pass it any options that fit your needs.
 * When your component renders, `useTopTokensSparklineQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTopTokensSparklineQuery({
 *   variables: {
 *      duration: // value for 'duration'
 *      chain: // value for 'chain'
 *   },
 * });
 */
export function useTopTokensSparklineQuery(baseOptions: Apollo.QueryHookOptions<TopTokensSparklineQuery, TopTokensSparklineQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<TopTokensSparklineQuery, TopTokensSparklineQueryVariables>(TopTokensSparklineDocument, options);
}
export function useTopTokensSparklineLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TopTokensSparklineQuery, TopTokensSparklineQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<TopTokensSparklineQuery, TopTokensSparklineQueryVariables>(TopTokensSparklineDocument, options);
}
export type TopTokensSparklineQueryHookResult = ReturnType<typeof useTopTokensSparklineQuery>;
export type TopTokensSparklineLazyQueryHookResult = ReturnType<typeof useTopTokensSparklineLazyQuery>;
export type TopTokensSparklineQueryResult = Apollo.QueryResult<TopTokensSparklineQuery, TopTokensSparklineQueryVariables>;
export const TokenWebDocument = gql`
    query TokenWeb($chain: Chain!, $address: String = null) {
  token(chain: $chain, address: $address) {
    id
    decimals
    name
    chain
    address
    symbol
    standard
    market(currency: USD) {
      id
      totalValueLocked {
        id
        value
        currency
      }
      price {
        id
        value
        currency
      }
      volume24H: volume(duration: DAY) {
        id
        value
        currency
      }
      priceHigh52W: priceHighLow(duration: YEAR, highLow: HIGH) {
        id
        value
      }
      priceLow52W: priceHighLow(duration: YEAR, highLow: LOW) {
        id
        value
      }
    }
    project {
      id
      description
      homepageUrl
      twitterName
      logoUrl
      tokens {
        id
        chain
        address
      }
      markets(currencies: [USD]) {
        id
        fullyDilutedValuation {
          id
          value
          currency
        }
        marketCap {
          id
          value
          currency
        }
      }
    }
  }
}
    `;

/**
 * __useTokenWebQuery__
 *
 * To run a query within a React component, call `useTokenWebQuery` and pass it any options that fit your needs.
 * When your component renders, `useTokenWebQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTokenWebQuery({
 *   variables: {
 *      chain: // value for 'chain'
 *      address: // value for 'address'
 *   },
 * });
 */
export function useTokenWebQuery(baseOptions: Apollo.QueryHookOptions<TokenWebQuery, TokenWebQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<TokenWebQuery, TokenWebQueryVariables>(TokenWebDocument, options);
}
export function useTokenWebLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TokenWebQuery, TokenWebQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<TokenWebQuery, TokenWebQueryVariables>(TokenWebDocument, options);
}
export type TokenWebQueryHookResult = ReturnType<typeof useTokenWebQuery>;
export type TokenWebLazyQueryHookResult = ReturnType<typeof useTokenWebLazyQuery>;
export type TokenWebQueryResult = Apollo.QueryResult<TokenWebQuery, TokenWebQueryVariables>;
export const TokenProjectWebDocument = gql`
    query TokenProjectWeb($chain: Chain!, $address: String = null) {
  token(chain: $chain, address: $address) {
    id
    decimals
    name
    chain
    address
    symbol
    standard
    project {
      id
      description
      homepageUrl
      twitterName
      logoUrl
      tokens {
        id
        chain
        address
      }
    }
  }
}
    `;

/**
 * __useTokenProjectWebQuery__
 *
 * To run a query within a React component, call `useTokenProjectWebQuery` and pass it any options that fit your needs.
 * When your component renders, `useTokenProjectWebQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTokenProjectWebQuery({
 *   variables: {
 *      chain: // value for 'chain'
 *      address: // value for 'address'
 *   },
 * });
 */
export function useTokenProjectWebQuery(baseOptions: Apollo.QueryHookOptions<TokenProjectWebQuery, TokenProjectWebQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<TokenProjectWebQuery, TokenProjectWebQueryVariables>(TokenProjectWebDocument, options);
}
export function useTokenProjectWebLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TokenProjectWebQuery, TokenProjectWebQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<TokenProjectWebQuery, TokenProjectWebQueryVariables>(TokenProjectWebDocument, options);
}
export type TokenProjectWebQueryHookResult = ReturnType<typeof useTokenProjectWebQuery>;
export type TokenProjectWebLazyQueryHookResult = ReturnType<typeof useTokenProjectWebLazyQuery>;
export type TokenProjectWebQueryResult = Apollo.QueryResult<TokenProjectWebQuery, TokenProjectWebQueryVariables>;
export const TokenPriceDocument = gql`
    query TokenPrice($chain: Chain!, $address: String = null, $duration: HistoryDuration!, $fallback: Boolean = false) {
  token(chain: $chain, address: $address) {
    id
    address
    chain
    market(currency: USD) {
      id
      price {
        id
        value
      }
      ohlc(duration: $duration) @skip(if: $fallback) {
        ...CandlestickOHLC
      }
      priceHistory(duration: $duration) @include(if: $fallback) {
        ...PriceHistoryFallback
      }
    }
  }
}
    ${CandlestickOhlcFragmentDoc}
${PriceHistoryFallbackFragmentDoc}`;

/**
 * __useTokenPriceQuery__
 *
 * To run a query within a React component, call `useTokenPriceQuery` and pass it any options that fit your needs.
 * When your component renders, `useTokenPriceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTokenPriceQuery({
 *   variables: {
 *      chain: // value for 'chain'
 *      address: // value for 'address'
 *      duration: // value for 'duration'
 *      fallback: // value for 'fallback'
 *   },
 * });
 */
export function useTokenPriceQuery(baseOptions: Apollo.QueryHookOptions<TokenPriceQuery, TokenPriceQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<TokenPriceQuery, TokenPriceQueryVariables>(TokenPriceDocument, options);
}
export function useTokenPriceLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TokenPriceQuery, TokenPriceQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<TokenPriceQuery, TokenPriceQueryVariables>(TokenPriceDocument, options);
}
export type TokenPriceQueryHookResult = ReturnType<typeof useTokenPriceQuery>;
export type TokenPriceLazyQueryHookResult = ReturnType<typeof useTokenPriceLazyQuery>;
export type TokenPriceQueryResult = Apollo.QueryResult<TokenPriceQuery, TokenPriceQueryVariables>;
export const TokenHistoricalVolumesDocument = gql`
    query TokenHistoricalVolumes($chain: Chain!, $address: String = null, $duration: HistoryDuration!) {
  token(chain: $chain, address: $address) {
    id
    address
    chain
    market(currency: USD) {
      id
      historicalVolume(duration: $duration) {
        id
        timestamp
        value
      }
    }
  }
}
    `;

/**
 * __useTokenHistoricalVolumesQuery__
 *
 * To run a query within a React component, call `useTokenHistoricalVolumesQuery` and pass it any options that fit your needs.
 * When your component renders, `useTokenHistoricalVolumesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTokenHistoricalVolumesQuery({
 *   variables: {
 *      chain: // value for 'chain'
 *      address: // value for 'address'
 *      duration: // value for 'duration'
 *   },
 * });
 */
export function useTokenHistoricalVolumesQuery(baseOptions: Apollo.QueryHookOptions<TokenHistoricalVolumesQuery, TokenHistoricalVolumesQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<TokenHistoricalVolumesQuery, TokenHistoricalVolumesQueryVariables>(TokenHistoricalVolumesDocument, options);
}
export function useTokenHistoricalVolumesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TokenHistoricalVolumesQuery, TokenHistoricalVolumesQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<TokenHistoricalVolumesQuery, TokenHistoricalVolumesQueryVariables>(TokenHistoricalVolumesDocument, options);
}
export type TokenHistoricalVolumesQueryHookResult = ReturnType<typeof useTokenHistoricalVolumesQuery>;
export type TokenHistoricalVolumesLazyQueryHookResult = ReturnType<typeof useTokenHistoricalVolumesLazyQuery>;
export type TokenHistoricalVolumesQueryResult = Apollo.QueryResult<TokenHistoricalVolumesQuery, TokenHistoricalVolumesQueryVariables>;
export const TokenHistoricalTvlsDocument = gql`
    query TokenHistoricalTvls($chain: Chain!, $address: String = null, $duration: HistoryDuration!) {
  token(chain: $chain, address: $address) {
    id
    address
    chain
    market(currency: USD) {
      id
      historicalTvl(duration: $duration) {
        id
        timestamp
        value
      }
      totalValueLocked {
        id
        value
        currency
      }
    }
  }
}
    `;

/**
 * __useTokenHistoricalTvlsQuery__
 *
 * To run a query within a React component, call `useTokenHistoricalTvlsQuery` and pass it any options that fit your needs.
 * When your component renders, `useTokenHistoricalTvlsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTokenHistoricalTvlsQuery({
 *   variables: {
 *      chain: // value for 'chain'
 *      address: // value for 'address'
 *      duration: // value for 'duration'
 *   },
 * });
 */
export function useTokenHistoricalTvlsQuery(baseOptions: Apollo.QueryHookOptions<TokenHistoricalTvlsQuery, TokenHistoricalTvlsQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<TokenHistoricalTvlsQuery, TokenHistoricalTvlsQueryVariables>(TokenHistoricalTvlsDocument, options);
}
export function useTokenHistoricalTvlsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TokenHistoricalTvlsQuery, TokenHistoricalTvlsQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<TokenHistoricalTvlsQuery, TokenHistoricalTvlsQueryVariables>(TokenHistoricalTvlsDocument, options);
}
export type TokenHistoricalTvlsQueryHookResult = ReturnType<typeof useTokenHistoricalTvlsQuery>;
export type TokenHistoricalTvlsLazyQueryHookResult = ReturnType<typeof useTokenHistoricalTvlsLazyQuery>;
export type TokenHistoricalTvlsQueryResult = Apollo.QueryResult<TokenHistoricalTvlsQuery, TokenHistoricalTvlsQueryVariables>;
export const V3TokenTransactionsDocument = gql`
    query V3TokenTransactions($chain: Chain!, $address: String!, $first: Int!, $cursor: Int) {
  token(chain: $chain, address: $address) {
    ...TransactionToken
    v3Transactions(first: $first, timestampCursor: $cursor) {
      timestamp
      hash
      account
      token0 {
        ...TransactionToken
      }
      token0Quantity
      token1 {
        ...TransactionToken
      }
      token1Quantity
      usdValue {
        value
      }
      type
    }
  }
}
    ${TransactionTokenFragmentDoc}`;

/**
 * __useV3TokenTransactionsQuery__
 *
 * To run a query within a React component, call `useV3TokenTransactionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useV3TokenTransactionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useV3TokenTransactionsQuery({
 *   variables: {
 *      chain: // value for 'chain'
 *      address: // value for 'address'
 *      first: // value for 'first'
 *      cursor: // value for 'cursor'
 *   },
 * });
 */
export function useV3TokenTransactionsQuery(baseOptions: Apollo.QueryHookOptions<V3TokenTransactionsQuery, V3TokenTransactionsQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<V3TokenTransactionsQuery, V3TokenTransactionsQueryVariables>(V3TokenTransactionsDocument, options);
}
export function useV3TokenTransactionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<V3TokenTransactionsQuery, V3TokenTransactionsQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<V3TokenTransactionsQuery, V3TokenTransactionsQueryVariables>(V3TokenTransactionsDocument, options);
}
export type V3TokenTransactionsQueryHookResult = ReturnType<typeof useV3TokenTransactionsQuery>;
export type V3TokenTransactionsLazyQueryHookResult = ReturnType<typeof useV3TokenTransactionsLazyQuery>;
export type V3TokenTransactionsQueryResult = Apollo.QueryResult<V3TokenTransactionsQuery, V3TokenTransactionsQueryVariables>;
export const V2TokenTransactionsDocument = gql`
    query V2TokenTransactions($address: String!, $first: Int!, $cursor: Int) {
  token(chain: ETHEREUM, address: $address) {
    ...TransactionToken
    v2Transactions(first: $first, timestampCursor: $cursor) {
      timestamp
      hash
      account
      token0 {
        ...TransactionToken
      }
      token0Quantity
      token1 {
        ...TransactionToken
      }
      token1Quantity
      usdValue {
        value
      }
      type
    }
  }
}
    ${TransactionTokenFragmentDoc}`;

/**
 * __useV2TokenTransactionsQuery__
 *
 * To run a query within a React component, call `useV2TokenTransactionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useV2TokenTransactionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useV2TokenTransactionsQuery({
 *   variables: {
 *      address: // value for 'address'
 *      first: // value for 'first'
 *      cursor: // value for 'cursor'
 *   },
 * });
 */
export function useV2TokenTransactionsQuery(baseOptions: Apollo.QueryHookOptions<V2TokenTransactionsQuery, V2TokenTransactionsQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<V2TokenTransactionsQuery, V2TokenTransactionsQueryVariables>(V2TokenTransactionsDocument, options);
}
export function useV2TokenTransactionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<V2TokenTransactionsQuery, V2TokenTransactionsQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<V2TokenTransactionsQuery, V2TokenTransactionsQueryVariables>(V2TokenTransactionsDocument, options);
}
export type V2TokenTransactionsQueryHookResult = ReturnType<typeof useV2TokenTransactionsQuery>;
export type V2TokenTransactionsLazyQueryHookResult = ReturnType<typeof useV2TokenTransactionsLazyQuery>;
export type V2TokenTransactionsQueryResult = Apollo.QueryResult<V2TokenTransactionsQuery, V2TokenTransactionsQueryVariables>;
export const TopV3PoolsDocument = gql`
    query TopV3Pools($chain: Chain!, $first: Int!, $cursor: Float, $tokenAddress: String) {
  topV3Pools(
    first: $first
    chain: $chain
    tokenFilter: $tokenAddress
    tvlCursor: $cursor
  ) {
    id
    protocolVersion
    address
    totalLiquidity {
      value
    }
    feeTier
    token0 {
      ...PoolToken
    }
    token1 {
      ...PoolToken
    }
    txCount
    volume24h: cumulativeVolume(duration: DAY) {
      value
    }
    volumeWeek: cumulativeVolume(duration: WEEK) {
      value
    }
  }
}
    ${PoolTokenFragmentDoc}`;

/**
 * __useTopV3PoolsQuery__
 *
 * To run a query within a React component, call `useTopV3PoolsQuery` and pass it any options that fit your needs.
 * When your component renders, `useTopV3PoolsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTopV3PoolsQuery({
 *   variables: {
 *      chain: // value for 'chain'
 *      first: // value for 'first'
 *      cursor: // value for 'cursor'
 *      tokenAddress: // value for 'tokenAddress'
 *   },
 * });
 */
export function useTopV3PoolsQuery(baseOptions: Apollo.QueryHookOptions<TopV3PoolsQuery, TopV3PoolsQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<TopV3PoolsQuery, TopV3PoolsQueryVariables>(TopV3PoolsDocument, options);
}
export function useTopV3PoolsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TopV3PoolsQuery, TopV3PoolsQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<TopV3PoolsQuery, TopV3PoolsQueryVariables>(TopV3PoolsDocument, options);
}
export type TopV3PoolsQueryHookResult = ReturnType<typeof useTopV3PoolsQuery>;
export type TopV3PoolsLazyQueryHookResult = ReturnType<typeof useTopV3PoolsLazyQuery>;
export type TopV3PoolsQueryResult = Apollo.QueryResult<TopV3PoolsQuery, TopV3PoolsQueryVariables>;
export const TopV2PairsDocument = gql`
    query TopV2Pairs($first: Int!, $cursor: Float, $tokenAddress: String) {
  topV2Pairs(
    first: $first
    chain: ETHEREUM
    tokenFilter: $tokenAddress
    tvlCursor: $cursor
  ) {
    id
    protocolVersion
    address
    totalLiquidity {
      value
    }
    token0 {
      ...PoolToken
    }
    token1 {
      ...PoolToken
    }
    txCount
    volume24h: cumulativeVolume(duration: DAY) {
      value
    }
    volumeWeek: cumulativeVolume(duration: WEEK) {
      value
    }
  }
}
    ${PoolTokenFragmentDoc}`;

/**
 * __useTopV2PairsQuery__
 *
 * To run a query within a React component, call `useTopV2PairsQuery` and pass it any options that fit your needs.
 * When your component renders, `useTopV2PairsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTopV2PairsQuery({
 *   variables: {
 *      first: // value for 'first'
 *      cursor: // value for 'cursor'
 *      tokenAddress: // value for 'tokenAddress'
 *   },
 * });
 */
export function useTopV2PairsQuery(baseOptions: Apollo.QueryHookOptions<TopV2PairsQuery, TopV2PairsQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<TopV2PairsQuery, TopV2PairsQueryVariables>(TopV2PairsDocument, options);
}
export function useTopV2PairsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TopV2PairsQuery, TopV2PairsQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<TopV2PairsQuery, TopV2PairsQueryVariables>(TopV2PairsDocument, options);
}
export type TopV2PairsQueryHookResult = ReturnType<typeof useTopV2PairsQuery>;
export type TopV2PairsLazyQueryHookResult = ReturnType<typeof useTopV2PairsLazyQuery>;
export type TopV2PairsQueryResult = Apollo.QueryResult<TopV2PairsQuery, TopV2PairsQueryVariables>;
export const V3TransactionsDocument = gql`
    query V3Transactions($chain: Chain!, $first: Int!, $cursor: Int) {
  v3Transactions(chain: $chain, first: $first, timestampCursor: $cursor) {
    id
    chain
    protocolVersion
    timestamp
    hash
    account
    token0 {
      ...TransactionToken
    }
    token0Quantity
    token1 {
      ...TransactionToken
    }
    token1Quantity
    usdValue {
      id
      value
    }
    type
  }
}
    ${TransactionTokenFragmentDoc}`;

/**
 * __useV3TransactionsQuery__
 *
 * To run a query within a React component, call `useV3TransactionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useV3TransactionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useV3TransactionsQuery({
 *   variables: {
 *      chain: // value for 'chain'
 *      first: // value for 'first'
 *      cursor: // value for 'cursor'
 *   },
 * });
 */
export function useV3TransactionsQuery(baseOptions: Apollo.QueryHookOptions<V3TransactionsQuery, V3TransactionsQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<V3TransactionsQuery, V3TransactionsQueryVariables>(V3TransactionsDocument, options);
}
export function useV3TransactionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<V3TransactionsQuery, V3TransactionsQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<V3TransactionsQuery, V3TransactionsQueryVariables>(V3TransactionsDocument, options);
}
export type V3TransactionsQueryHookResult = ReturnType<typeof useV3TransactionsQuery>;
export type V3TransactionsLazyQueryHookResult = ReturnType<typeof useV3TransactionsLazyQuery>;
export type V3TransactionsQueryResult = Apollo.QueryResult<V3TransactionsQuery, V3TransactionsQueryVariables>;
export const V2TransactionsDocument = gql`
    query V2Transactions($first: Int!, $cursor: Int) {
  v2Transactions(chain: ETHEREUM, first: $first, timestampCursor: $cursor) {
    id
    chain
    protocolVersion
    timestamp
    hash
    account
    token0 {
      ...TransactionToken
    }
    token0Quantity
    token1 {
      ...TransactionToken
    }
    token1Quantity
    usdValue {
      id
      value
    }
    type
  }
}
    ${TransactionTokenFragmentDoc}`;

/**
 * __useV2TransactionsQuery__
 *
 * To run a query within a React component, call `useV2TransactionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useV2TransactionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useV2TransactionsQuery({
 *   variables: {
 *      first: // value for 'first'
 *      cursor: // value for 'cursor'
 *   },
 * });
 */
export function useV2TransactionsQuery(baseOptions: Apollo.QueryHookOptions<V2TransactionsQuery, V2TransactionsQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<V2TransactionsQuery, V2TransactionsQueryVariables>(V2TransactionsDocument, options);
}
export function useV2TransactionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<V2TransactionsQuery, V2TransactionsQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<V2TransactionsQuery, V2TransactionsQueryVariables>(V2TransactionsDocument, options);
}
export type V2TransactionsQueryHookResult = ReturnType<typeof useV2TransactionsQuery>;
export type V2TransactionsLazyQueryHookResult = ReturnType<typeof useV2TransactionsLazyQuery>;
export type V2TransactionsQueryResult = Apollo.QueryResult<V2TransactionsQuery, V2TransactionsQueryVariables>;


export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping of union types */
export type ResolversUnionTypes = {
  ActivityDetails: (SwapOrderDetails) | (Omit<TransactionDetails, 'assetChanges'> & { assetChanges: Array<Maybe<ResolversTypes['AssetChange']>> });
  AssetChange: (NftApproval) | (NftApproveForAll) | (NftTransfer) | (TokenApproval) | (TokenTransfer);
};

/** Mapping of union parent types */
export type ResolversUnionParentTypes = {
  ActivityDetails: (SwapOrderDetails) | (Omit<TransactionDetails, 'assetChanges'> & { assetChanges: Array<Maybe<ResolversParentTypes['AssetChange']>> });
  AssetChange: (NftApproval) | (NftApproveForAll) | (NftTransfer) | (TokenApproval) | (TokenTransfer);
};

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AWSJSON: ResolverTypeWrapper<Scalars['AWSJSON']>;
  ActivityDetails: ResolverTypeWrapper<ResolversUnionTypes['ActivityDetails']>;
  ActivityDetailsInput: ActivityDetailsInput;
  ActivityType: ActivityType;
  Amount: ResolverTypeWrapper<Amount>;
  AmountChange: ResolverTypeWrapper<AmountChange>;
  AmountInput: AmountInput;
  ApplicationContract: ResolverTypeWrapper<ApplicationContract>;
  ApplicationContractInput: ApplicationContractInput;
  AssetActivity: ResolverTypeWrapper<Omit<AssetActivity, 'assetChanges' | 'details'> & { assetChanges: Array<Maybe<ResolversTypes['AssetChange']>>, details: ResolversTypes['ActivityDetails'] }>;
  AssetActivityInput: AssetActivityInput;
  AssetActivitySwitch: AssetActivitySwitch;
  AssetChange: ResolverTypeWrapper<ResolversUnionTypes['AssetChange']>;
  AssetChangeInput: AssetChangeInput;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Chain: Chain;
  CollectionSortableField: CollectionSortableField;
  ContractInput: ContractInput;
  Currency: Currency;
  CurrencyAmountInput: CurrencyAmountInput;
  DescriptionTranslations: ResolverTypeWrapper<DescriptionTranslations>;
  Dimensions: ResolverTypeWrapper<Dimensions>;
  DimensionsInput: DimensionsInput;
  FeeData: ResolverTypeWrapper<FeeData>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  HighLow: HighLow;
  HistoryDuration: HistoryDuration;
  IAmount: ResolversTypes['Amount'] | ResolversTypes['TimestampedAmount'];
  IContract: ResolversTypes['ApplicationContract'] | ResolversTypes['NftContract'] | ResolversTypes['Token'];
  ID: ResolverTypeWrapper<Scalars['ID']>;
  IPool: ResolversTypes['V2Pair'] | ResolversTypes['V3Pool'];
  Image: ResolverTypeWrapper<Image>;
  ImageInput: ImageInput;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  MediaType: MediaType;
  Mutation: ResolverTypeWrapper<{}>;
  NftActivity: ResolverTypeWrapper<NftActivity>;
  NftActivityConnection: ResolverTypeWrapper<NftActivityConnection>;
  NftActivityEdge: ResolverTypeWrapper<NftActivityEdge>;
  NftActivityFilterInput: NftActivityFilterInput;
  NftActivityType: NftActivityType;
  NftApproval: ResolverTypeWrapper<NftApproval>;
  NftApprovalInput: NftApprovalInput;
  NftApproveForAll: ResolverTypeWrapper<NftApproveForAll>;
  NftApproveForAllInput: NftApproveForAllInput;
  NftAsset: ResolverTypeWrapper<NftAsset>;
  NftAssetConnection: ResolverTypeWrapper<NftAssetConnection>;
  NftAssetEdge: ResolverTypeWrapper<NftAssetEdge>;
  NftAssetInput: NftAssetInput;
  NftAssetRarity: ResolverTypeWrapper<NftAssetRarity>;
  NftAssetSortableField: NftAssetSortableField;
  NftAssetTrait: ResolverTypeWrapper<NftAssetTrait>;
  NftAssetTraitInput: NftAssetTraitInput;
  NftAssetsFilterInput: NftAssetsFilterInput;
  NftBalance: ResolverTypeWrapper<NftBalance>;
  NftBalanceAssetInput: NftBalanceAssetInput;
  NftBalanceConnection: ResolverTypeWrapper<NftBalanceConnection>;
  NftBalanceEdge: ResolverTypeWrapper<NftBalanceEdge>;
  NftBalancesFilterInput: NftBalancesFilterInput;
  NftCollection: ResolverTypeWrapper<NftCollection>;
  NftCollectionBalance: ResolverTypeWrapper<NftCollectionBalance>;
  NftCollectionBalanceConnection: ResolverTypeWrapper<NftCollectionBalanceConnection>;
  NftCollectionBalanceEdge: ResolverTypeWrapper<NftCollectionBalanceEdge>;
  NftCollectionConnection: ResolverTypeWrapper<NftCollectionConnection>;
  NftCollectionEdge: ResolverTypeWrapper<NftCollectionEdge>;
  NftCollectionInput: NftCollectionInput;
  NftCollectionMarket: ResolverTypeWrapper<NftCollectionMarket>;
  NftCollectionMarketplace: ResolverTypeWrapper<NftCollectionMarketplace>;
  NftCollectionTrait: ResolverTypeWrapper<NftCollectionTrait>;
  NftCollectionTraitStats: ResolverTypeWrapper<NftCollectionTraitStats>;
  NftCollectionsFilterInput: NftCollectionsFilterInput;
  NftContract: ResolverTypeWrapper<NftContract>;
  NftContractInput: NftContractInput;
  NftFee: ResolverTypeWrapper<NftFee>;
  NftMarketplace: NftMarketplace;
  NftOrder: ResolverTypeWrapper<NftOrder>;
  NftOrderConnection: ResolverTypeWrapper<NftOrderConnection>;
  NftOrderEdge: ResolverTypeWrapper<NftOrderEdge>;
  NftProfile: ResolverTypeWrapper<NftProfile>;
  NftRarityProvider: NftRarityProvider;
  NftRouteResponse: ResolverTypeWrapper<NftRouteResponse>;
  NftStandard: NftStandard;
  NftTrade: ResolverTypeWrapper<NftTrade>;
  NftTradeInput: NftTradeInput;
  NftTransfer: ResolverTypeWrapper<NftTransfer>;
  NftTransferInput: NftTransferInput;
  OrderStatus: OrderStatus;
  OrderType: OrderType;
  PageInfo: ResolverTypeWrapper<PageInfo>;
  PairInput: PairInput;
  PermitDetailsInput: PermitDetailsInput;
  PermitInput: PermitInput;
  PoolInput: PoolInput;
  PoolTransaction: ResolverTypeWrapper<PoolTransaction>;
  PoolTransactionType: PoolTransactionType;
  Portfolio: ResolverTypeWrapper<Portfolio>;
  PortfolioValueModifier: PortfolioValueModifier;
  PriceSource: PriceSource;
  ProtocolVersion: ProtocolVersion;
  PushNotification: ResolverTypeWrapper<PushNotification>;
  Query: ResolverTypeWrapper<{}>;
  SafetyLevel: SafetyLevel;
  Status: ResolverTypeWrapper<Status>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Subscription: ResolverTypeWrapper<{}>;
  SubscriptionType: SubscriptionType;
  SwapOrderDetails: ResolverTypeWrapper<SwapOrderDetails>;
  SwapOrderDetailsInput: SwapOrderDetailsInput;
  SwapOrderStatus: SwapOrderStatus;
  SwapOrderType: SwapOrderType;
  TimestampedAmount: ResolverTypeWrapper<TimestampedAmount>;
  TimestampedOhlc: ResolverTypeWrapper<TimestampedOhlc>;
  TimestampedPoolPrice: ResolverTypeWrapper<TimestampedPoolPrice>;
  Token: ResolverTypeWrapper<Token>;
  TokenAmount: ResolverTypeWrapper<TokenAmount>;
  TokenAmountInput: TokenAmountInput;
  TokenApproval: ResolverTypeWrapper<TokenApproval>;
  TokenApprovalInput: TokenApprovalInput;
  TokenAssetInput: TokenAssetInput;
  TokenBalance: ResolverTypeWrapper<TokenBalance>;
  TokenInput: TokenInput;
  TokenMarket: ResolverTypeWrapper<TokenMarket>;
  TokenProject: ResolverTypeWrapper<TokenProject>;
  TokenProjectMarket: ResolverTypeWrapper<TokenProjectMarket>;
  TokenSortableField: TokenSortableField;
  TokenStandard: TokenStandard;
  TokenTradeInput: TokenTradeInput;
  TokenTradeRouteInput: TokenTradeRouteInput;
  TokenTradeRoutesInput: TokenTradeRoutesInput;
  TokenTradeType: TokenTradeType;
  TokenTransfer: ResolverTypeWrapper<TokenTransfer>;
  TokenTransferInput: TokenTransferInput;
  TradePoolInput: TradePoolInput;
  Transaction: ResolverTypeWrapper<Transaction>;
  TransactionDetails: ResolverTypeWrapper<Omit<TransactionDetails, 'assetChanges'> & { assetChanges: Array<Maybe<ResolversTypes['AssetChange']>> }>;
  TransactionDetailsInput: TransactionDetailsInput;
  TransactionDirection: TransactionDirection;
  TransactionNotification: ResolverTypeWrapper<TransactionNotification>;
  TransactionStatus: TransactionStatus;
  TransactionType: TransactionType;
  V2Pair: ResolverTypeWrapper<V2Pair>;
  V3Pool: ResolverTypeWrapper<V3Pool>;
  V3PoolTick: ResolverTypeWrapper<V3PoolTick>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AWSJSON: Scalars['AWSJSON'];
  ActivityDetails: ResolversUnionParentTypes['ActivityDetails'];
  ActivityDetailsInput: ActivityDetailsInput;
  Amount: Amount;
  AmountChange: AmountChange;
  AmountInput: AmountInput;
  ApplicationContract: ApplicationContract;
  ApplicationContractInput: ApplicationContractInput;
  AssetActivity: Omit<AssetActivity, 'assetChanges' | 'details'> & { assetChanges: Array<Maybe<ResolversParentTypes['AssetChange']>>, details: ResolversParentTypes['ActivityDetails'] };
  AssetActivityInput: AssetActivityInput;
  AssetChange: ResolversUnionParentTypes['AssetChange'];
  AssetChangeInput: AssetChangeInput;
  Boolean: Scalars['Boolean'];
  ContractInput: ContractInput;
  CurrencyAmountInput: CurrencyAmountInput;
  DescriptionTranslations: DescriptionTranslations;
  Dimensions: Dimensions;
  DimensionsInput: DimensionsInput;
  FeeData: FeeData;
  Float: Scalars['Float'];
  IAmount: ResolversParentTypes['Amount'] | ResolversParentTypes['TimestampedAmount'];
  IContract: ResolversParentTypes['ApplicationContract'] | ResolversParentTypes['NftContract'] | ResolversParentTypes['Token'];
  ID: Scalars['ID'];
  IPool: ResolversParentTypes['V2Pair'] | ResolversParentTypes['V3Pool'];
  Image: Image;
  ImageInput: ImageInput;
  Int: Scalars['Int'];
  Mutation: {};
  NftActivity: NftActivity;
  NftActivityConnection: NftActivityConnection;
  NftActivityEdge: NftActivityEdge;
  NftActivityFilterInput: NftActivityFilterInput;
  NftApproval: NftApproval;
  NftApprovalInput: NftApprovalInput;
  NftApproveForAll: NftApproveForAll;
  NftApproveForAllInput: NftApproveForAllInput;
  NftAsset: NftAsset;
  NftAssetConnection: NftAssetConnection;
  NftAssetEdge: NftAssetEdge;
  NftAssetInput: NftAssetInput;
  NftAssetRarity: NftAssetRarity;
  NftAssetTrait: NftAssetTrait;
  NftAssetTraitInput: NftAssetTraitInput;
  NftAssetsFilterInput: NftAssetsFilterInput;
  NftBalance: NftBalance;
  NftBalanceAssetInput: NftBalanceAssetInput;
  NftBalanceConnection: NftBalanceConnection;
  NftBalanceEdge: NftBalanceEdge;
  NftBalancesFilterInput: NftBalancesFilterInput;
  NftCollection: NftCollection;
  NftCollectionBalance: NftCollectionBalance;
  NftCollectionBalanceConnection: NftCollectionBalanceConnection;
  NftCollectionBalanceEdge: NftCollectionBalanceEdge;
  NftCollectionConnection: NftCollectionConnection;
  NftCollectionEdge: NftCollectionEdge;
  NftCollectionInput: NftCollectionInput;
  NftCollectionMarket: NftCollectionMarket;
  NftCollectionMarketplace: NftCollectionMarketplace;
  NftCollectionTrait: NftCollectionTrait;
  NftCollectionTraitStats: NftCollectionTraitStats;
  NftCollectionsFilterInput: NftCollectionsFilterInput;
  NftContract: NftContract;
  NftContractInput: NftContractInput;
  NftFee: NftFee;
  NftOrder: NftOrder;
  NftOrderConnection: NftOrderConnection;
  NftOrderEdge: NftOrderEdge;
  NftProfile: NftProfile;
  NftRouteResponse: NftRouteResponse;
  NftTrade: NftTrade;
  NftTradeInput: NftTradeInput;
  NftTransfer: NftTransfer;
  NftTransferInput: NftTransferInput;
  PageInfo: PageInfo;
  PairInput: PairInput;
  PermitDetailsInput: PermitDetailsInput;
  PermitInput: PermitInput;
  PoolInput: PoolInput;
  PoolTransaction: PoolTransaction;
  Portfolio: Portfolio;
  PortfolioValueModifier: PortfolioValueModifier;
  PushNotification: PushNotification;
  Query: {};
  Status: Status;
  String: Scalars['String'];
  Subscription: {};
  SwapOrderDetails: SwapOrderDetails;
  SwapOrderDetailsInput: SwapOrderDetailsInput;
  TimestampedAmount: TimestampedAmount;
  TimestampedOhlc: TimestampedOhlc;
  TimestampedPoolPrice: TimestampedPoolPrice;
  Token: Token;
  TokenAmount: TokenAmount;
  TokenAmountInput: TokenAmountInput;
  TokenApproval: TokenApproval;
  TokenApprovalInput: TokenApprovalInput;
  TokenAssetInput: TokenAssetInput;
  TokenBalance: TokenBalance;
  TokenInput: TokenInput;
  TokenMarket: TokenMarket;
  TokenProject: TokenProject;
  TokenProjectMarket: TokenProjectMarket;
  TokenTradeInput: TokenTradeInput;
  TokenTradeRouteInput: TokenTradeRouteInput;
  TokenTradeRoutesInput: TokenTradeRoutesInput;
  TokenTransfer: TokenTransfer;
  TokenTransferInput: TokenTransferInput;
  TradePoolInput: TradePoolInput;
  Transaction: Transaction;
  TransactionDetails: Omit<TransactionDetails, 'assetChanges'> & { assetChanges: Array<Maybe<ResolversParentTypes['AssetChange']>> };
  TransactionDetailsInput: TransactionDetailsInput;
  TransactionNotification: TransactionNotification;
  V2Pair: V2Pair;
  V3Pool: V3Pool;
  V3PoolTick: V3PoolTick;
};

export type Aws_Api_KeyDirectiveArgs = {};

export type Aws_Api_KeyDirectiveResolver<Result, Parent, ContextType = any, Args = Aws_Api_KeyDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type Aws_AuthDirectiveArgs = {
  cognito_groups?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type Aws_AuthDirectiveResolver<Result, Parent, ContextType = any, Args = Aws_AuthDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type Aws_Cognito_User_PoolsDirectiveArgs = {
  cognito_groups?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type Aws_Cognito_User_PoolsDirectiveResolver<Result, Parent, ContextType = any, Args = Aws_Cognito_User_PoolsDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type Aws_IamDirectiveArgs = {};

export type Aws_IamDirectiveResolver<Result, Parent, ContextType = any, Args = Aws_IamDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type Aws_LambdaDirectiveArgs = {};

export type Aws_LambdaDirectiveResolver<Result, Parent, ContextType = any, Args = Aws_LambdaDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type Aws_OidcDirectiveArgs = {};

export type Aws_OidcDirectiveResolver<Result, Parent, ContextType = any, Args = Aws_OidcDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type Aws_PublishDirectiveArgs = {
  subscriptions?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type Aws_PublishDirectiveResolver<Result, Parent, ContextType = any, Args = Aws_PublishDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type Aws_SubscribeDirectiveArgs = {
  mutations?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type Aws_SubscribeDirectiveResolver<Result, Parent, ContextType = any, Args = Aws_SubscribeDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type DeferDirectiveArgs = {};

export type DeferDirectiveResolver<Result, Parent, ContextType = any, Args = DeferDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export interface AwsjsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['AWSJSON'], any> {
  name: 'AWSJSON';
}

export type ActivityDetailsResolvers<ContextType = any, ParentType extends ResolversParentTypes['ActivityDetails'] = ResolversParentTypes['ActivityDetails']> = {
  __resolveType: TypeResolveFn<'SwapOrderDetails' | 'TransactionDetails', ParentType, ContextType>;
};

export type AmountResolvers<ContextType = any, ParentType extends ResolversParentTypes['Amount'] = ResolversParentTypes['Amount']> = {
  currency?: Resolver<Maybe<ResolversTypes['Currency']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AmountChangeResolvers<ContextType = any, ParentType extends ResolversParentTypes['AmountChange'] = ResolversParentTypes['AmountChange']> = {
  absolute?: Resolver<Maybe<ResolversTypes['Amount']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  percentage?: Resolver<Maybe<ResolversTypes['Amount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ApplicationContractResolvers<ContextType = any, ParentType extends ResolversParentTypes['ApplicationContract'] = ResolversParentTypes['ApplicationContract']> = {
  address?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  chain?: Resolver<ResolversTypes['Chain'], ParentType, ContextType>;
  icon?: Resolver<Maybe<ResolversTypes['Image']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AssetActivityResolvers<ContextType = any, ParentType extends ResolversParentTypes['AssetActivity'] = ResolversParentTypes['AssetActivity']> = {
  addresses?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  assetChanges?: Resolver<Array<Maybe<ResolversTypes['AssetChange']>>, ParentType, ContextType>;
  chain?: Resolver<ResolversTypes['Chain'], ParentType, ContextType>;
  details?: Resolver<ResolversTypes['ActivityDetails'], ParentType, ContextType>;
  gasUsed?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  transaction?: Resolver<ResolversTypes['Transaction'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['ActivityType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AssetChangeResolvers<ContextType = any, ParentType extends ResolversParentTypes['AssetChange'] = ResolversParentTypes['AssetChange']> = {
  __resolveType: TypeResolveFn<'NftApproval' | 'NftApproveForAll' | 'NftTransfer' | 'TokenApproval' | 'TokenTransfer', ParentType, ContextType>;
};

export type DescriptionTranslationsResolvers<ContextType = any, ParentType extends ResolversParentTypes['DescriptionTranslations'] = ResolversParentTypes['DescriptionTranslations']> = {
  descriptionEnUs?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  descriptionEs419?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  descriptionEsEs?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  descriptionEsUs?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  descriptionFrFr?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  descriptionHiIn?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  descriptionIdId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  descriptionJaJp?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  descriptionMsMy?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  descriptionNlNl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  descriptionPtPt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  descriptionRuRu?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  descriptionThTh?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  descriptionTrTr?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  descriptionUkUa?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  descriptionUrPk?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  descriptionViVn?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  descriptionZhHans?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  descriptionZhHant?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DimensionsResolvers<ContextType = any, ParentType extends ResolversParentTypes['Dimensions'] = ResolversParentTypes['Dimensions']> = {
  height?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  width?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FeeDataResolvers<ContextType = any, ParentType extends ResolversParentTypes['FeeData'] = ResolversParentTypes['FeeData']> = {
  buyFeeBps?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  sellFeeBps?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IAmountResolvers<ContextType = any, ParentType extends ResolversParentTypes['IAmount'] = ResolversParentTypes['IAmount']> = {
  __resolveType: TypeResolveFn<'Amount' | 'TimestampedAmount', ParentType, ContextType>;
  currency?: Resolver<Maybe<ResolversTypes['Currency']>, ParentType, ContextType>;
  value?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
};

export type IContractResolvers<ContextType = any, ParentType extends ResolversParentTypes['IContract'] = ResolversParentTypes['IContract']> = {
  __resolveType: TypeResolveFn<'ApplicationContract' | 'NftContract' | 'Token', ParentType, ContextType>;
  address?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  chain?: Resolver<ResolversTypes['Chain'], ParentType, ContextType>;
};

export type IPoolResolvers<ContextType = any, ParentType extends ResolversParentTypes['IPool'] = ResolversParentTypes['IPool']> = {
  __resolveType: TypeResolveFn<'V2Pair' | 'V3Pool', ParentType, ContextType>;
  address?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  chain?: Resolver<ResolversTypes['Chain'], ParentType, ContextType>;
  createdAtTimestamp?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  cumulativeVolume?: Resolver<Maybe<ResolversTypes['Amount']>, ParentType, ContextType, RequireFields<IPoolCumulativeVolumeArgs, 'duration'>>;
  historicalVolume?: Resolver<Maybe<Array<Maybe<ResolversTypes['TimestampedAmount']>>>, ParentType, ContextType, RequireFields<IPoolHistoricalVolumeArgs, 'duration'>>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  priceHistory?: Resolver<Maybe<Array<Maybe<ResolversTypes['TimestampedPoolPrice']>>>, ParentType, ContextType, RequireFields<IPoolPriceHistoryArgs, 'duration'>>;
  protocolVersion?: Resolver<ResolversTypes['ProtocolVersion'], ParentType, ContextType>;
  token0?: Resolver<Maybe<ResolversTypes['Token']>, ParentType, ContextType>;
  token0Supply?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  token1?: Resolver<Maybe<ResolversTypes['Token']>, ParentType, ContextType>;
  token1Supply?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  totalLiquidity?: Resolver<Maybe<ResolversTypes['Amount']>, ParentType, ContextType>;
  totalLiquidityPercentChange24h?: Resolver<Maybe<ResolversTypes['Amount']>, ParentType, ContextType>;
  transactions?: Resolver<Maybe<Array<Maybe<ResolversTypes['PoolTransaction']>>>, ParentType, ContextType, RequireFields<IPoolTransactionsArgs, 'first'>>;
  txCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
};

export type ImageResolvers<ContextType = any, ParentType extends ResolversParentTypes['Image'] = ResolversParentTypes['Image']> = {
  dimensions?: Resolver<Maybe<ResolversTypes['Dimensions']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  assetActivity?: Resolver<ResolversTypes['AssetActivity'], ParentType, ContextType, RequireFields<MutationAssetActivityArgs, 'input'>>;
  heartbeat?: Resolver<ResolversTypes['Status'], ParentType, ContextType, RequireFields<MutationHeartbeatArgs, 'subscriptionId' | 'type'>>;
  unsubscribe?: Resolver<ResolversTypes['Status'], ParentType, ContextType, RequireFields<MutationUnsubscribeArgs, 'subscriptionId' | 'type'>>;
};

export type NftActivityResolvers<ContextType = any, ParentType extends ResolversParentTypes['NftActivity'] = ResolversParentTypes['NftActivity']> = {
  address?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  asset?: Resolver<Maybe<ResolversTypes['NftAsset']>, ParentType, ContextType>;
  fromAddress?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  marketplace?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  orderStatus?: Resolver<Maybe<ResolversTypes['OrderStatus']>, ParentType, ContextType>;
  price?: Resolver<Maybe<ResolversTypes['Amount']>, ParentType, ContextType>;
  quantity?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  toAddress?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  tokenId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  transactionHash?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['NftActivityType'], ParentType, ContextType>;
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NftActivityConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['NftActivityConnection'] = ResolversParentTypes['NftActivityConnection']> = {
  edges?: Resolver<Array<ResolversTypes['NftActivityEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NftActivityEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['NftActivityEdge'] = ResolversParentTypes['NftActivityEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['NftActivity'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NftApprovalResolvers<ContextType = any, ParentType extends ResolversParentTypes['NftApproval'] = ResolversParentTypes['NftApproval']> = {
  approvedAddress?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  asset?: Resolver<ResolversTypes['NftAsset'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  nftStandard?: Resolver<ResolversTypes['NftStandard'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NftApproveForAllResolvers<ContextType = any, ParentType extends ResolversParentTypes['NftApproveForAll'] = ResolversParentTypes['NftApproveForAll']> = {
  approved?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  asset?: Resolver<ResolversTypes['NftAsset'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  nftStandard?: Resolver<ResolversTypes['NftStandard'], ParentType, ContextType>;
  operatorAddress?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NftAssetResolvers<ContextType = any, ParentType extends ResolversParentTypes['NftAsset'] = ResolversParentTypes['NftAsset']> = {
  animationUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  collection?: Resolver<Maybe<ResolversTypes['NftCollection']>, ParentType, ContextType>;
  creator?: Resolver<Maybe<ResolversTypes['NftProfile']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  flaggedBy?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  image?: Resolver<Maybe<ResolversTypes['Image']>, ParentType, ContextType>;
  imageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  isSpam?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  listings?: Resolver<Maybe<ResolversTypes['NftOrderConnection']>, ParentType, ContextType, Partial<NftAssetListingsArgs>>;
  mediaType?: Resolver<Maybe<ResolversTypes['MediaType']>, ParentType, ContextType>;
  metadataUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  nftContract?: Resolver<Maybe<ResolversTypes['NftContract']>, ParentType, ContextType>;
  originalImage?: Resolver<Maybe<ResolversTypes['Image']>, ParentType, ContextType>;
  ownerAddress?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  rarities?: Resolver<Maybe<Array<ResolversTypes['NftAssetRarity']>>, ParentType, ContextType>;
  smallImage?: Resolver<Maybe<ResolversTypes['Image']>, ParentType, ContextType>;
  smallImageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  suspiciousFlag?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  thumbnail?: Resolver<Maybe<ResolversTypes['Image']>, ParentType, ContextType>;
  thumbnailUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  tokenId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  traits?: Resolver<Maybe<Array<ResolversTypes['NftAssetTrait']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NftAssetConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['NftAssetConnection'] = ResolversParentTypes['NftAssetConnection']> = {
  edges?: Resolver<Array<ResolversTypes['NftAssetEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NftAssetEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['NftAssetEdge'] = ResolversParentTypes['NftAssetEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['NftAsset'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NftAssetRarityResolvers<ContextType = any, ParentType extends ResolversParentTypes['NftAssetRarity'] = ResolversParentTypes['NftAssetRarity']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  provider?: Resolver<Maybe<ResolversTypes['NftRarityProvider']>, ParentType, ContextType>;
  rank?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  score?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NftAssetTraitResolvers<ContextType = any, ParentType extends ResolversParentTypes['NftAssetTrait'] = ResolversParentTypes['NftAssetTrait']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  rarity?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  value?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NftBalanceResolvers<ContextType = any, ParentType extends ResolversParentTypes['NftBalance'] = ResolversParentTypes['NftBalance']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastPrice?: Resolver<Maybe<ResolversTypes['TimestampedAmount']>, ParentType, ContextType>;
  listedMarketplaces?: Resolver<Maybe<Array<ResolversTypes['NftMarketplace']>>, ParentType, ContextType>;
  listingFees?: Resolver<Maybe<Array<Maybe<ResolversTypes['NftFee']>>>, ParentType, ContextType>;
  ownedAsset?: Resolver<Maybe<ResolversTypes['NftAsset']>, ParentType, ContextType>;
  quantity?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NftBalanceConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['NftBalanceConnection'] = ResolversParentTypes['NftBalanceConnection']> = {
  edges?: Resolver<Array<ResolversTypes['NftBalanceEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NftBalanceEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['NftBalanceEdge'] = ResolversParentTypes['NftBalanceEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['NftBalance'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NftCollectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['NftCollection'] = ResolversParentTypes['NftCollection']> = {
  bannerImage?: Resolver<Maybe<ResolversTypes['Image']>, ParentType, ContextType>;
  bannerImageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  collectionId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  creator?: Resolver<Maybe<ResolversTypes['NftProfile']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  discordUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  homepageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  image?: Resolver<Maybe<ResolversTypes['Image']>, ParentType, ContextType>;
  imageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  instagramName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  isVerified?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  markets?: Resolver<Maybe<Array<ResolversTypes['NftCollectionMarket']>>, ParentType, ContextType, RequireFields<NftCollectionMarketsArgs, 'currencies'>>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  nftContracts?: Resolver<Maybe<Array<ResolversTypes['NftContract']>>, ParentType, ContextType>;
  numAssets?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  openseaUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  traits?: Resolver<Maybe<Array<ResolversTypes['NftCollectionTrait']>>, ParentType, ContextType>;
  twitterName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NftCollectionBalanceResolvers<ContextType = any, ParentType extends ResolversParentTypes['NftCollectionBalance'] = ResolversParentTypes['NftCollectionBalance']> = {
  address?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  balance?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  logoImage?: Resolver<Maybe<ResolversTypes['Image']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NftCollectionBalanceConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['NftCollectionBalanceConnection'] = ResolversParentTypes['NftCollectionBalanceConnection']> = {
  edges?: Resolver<Array<ResolversTypes['NftCollectionBalanceEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NftCollectionBalanceEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['NftCollectionBalanceEdge'] = ResolversParentTypes['NftCollectionBalanceEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['NftCollectionBalance'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NftCollectionConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['NftCollectionConnection'] = ResolversParentTypes['NftCollectionConnection']> = {
  edges?: Resolver<Array<ResolversTypes['NftCollectionEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NftCollectionEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['NftCollectionEdge'] = ResolversParentTypes['NftCollectionEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['NftCollection'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NftCollectionMarketResolvers<ContextType = any, ParentType extends ResolversParentTypes['NftCollectionMarket'] = ResolversParentTypes['NftCollectionMarket']> = {
  floorPrice?: Resolver<Maybe<ResolversTypes['TimestampedAmount']>, ParentType, ContextType>;
  floorPricePercentChange?: Resolver<Maybe<ResolversTypes['TimestampedAmount']>, ParentType, ContextType, Partial<NftCollectionMarketFloorPricePercentChangeArgs>>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  listings?: Resolver<Maybe<ResolversTypes['TimestampedAmount']>, ParentType, ContextType>;
  marketplaces?: Resolver<Maybe<Array<ResolversTypes['NftCollectionMarketplace']>>, ParentType, ContextType, Partial<NftCollectionMarketMarketplacesArgs>>;
  nftContracts?: Resolver<Maybe<Array<ResolversTypes['NftContract']>>, ParentType, ContextType>;
  owners?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  percentListed?: Resolver<Maybe<ResolversTypes['TimestampedAmount']>, ParentType, ContextType>;
  percentUniqueOwners?: Resolver<Maybe<ResolversTypes['TimestampedAmount']>, ParentType, ContextType>;
  sales?: Resolver<Maybe<ResolversTypes['TimestampedAmount']>, ParentType, ContextType, Partial<NftCollectionMarketSalesArgs>>;
  totalVolume?: Resolver<Maybe<ResolversTypes['TimestampedAmount']>, ParentType, ContextType>;
  volume?: Resolver<Maybe<ResolversTypes['TimestampedAmount']>, ParentType, ContextType, Partial<NftCollectionMarketVolumeArgs>>;
  volume24h?: Resolver<Maybe<ResolversTypes['Amount']>, ParentType, ContextType>;
  volumePercentChange?: Resolver<Maybe<ResolversTypes['TimestampedAmount']>, ParentType, ContextType, Partial<NftCollectionMarketVolumePercentChangeArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NftCollectionMarketplaceResolvers<ContextType = any, ParentType extends ResolversParentTypes['NftCollectionMarketplace'] = ResolversParentTypes['NftCollectionMarketplace']> = {
  floorPrice?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  listings?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  marketplace?: Resolver<Maybe<ResolversTypes['NftMarketplace']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NftCollectionTraitResolvers<ContextType = any, ParentType extends ResolversParentTypes['NftCollectionTrait'] = ResolversParentTypes['NftCollectionTrait']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  stats?: Resolver<Maybe<Array<ResolversTypes['NftCollectionTraitStats']>>, ParentType, ContextType>;
  values?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NftCollectionTraitStatsResolvers<ContextType = any, ParentType extends ResolversParentTypes['NftCollectionTraitStats'] = ResolversParentTypes['NftCollectionTraitStats']> = {
  assets?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  listings?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  value?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NftContractResolvers<ContextType = any, ParentType extends ResolversParentTypes['NftContract'] = ResolversParentTypes['NftContract']> = {
  address?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  chain?: Resolver<ResolversTypes['Chain'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  standard?: Resolver<Maybe<ResolversTypes['NftStandard']>, ParentType, ContextType>;
  symbol?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  totalSupply?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NftFeeResolvers<ContextType = any, ParentType extends ResolversParentTypes['NftFee'] = ResolversParentTypes['NftFee']> = {
  basisPoints?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  payoutAddress?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NftOrderResolvers<ContextType = any, ParentType extends ResolversParentTypes['NftOrder'] = ResolversParentTypes['NftOrder']> = {
  address?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  auctionType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  endAt?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  maker?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  marketplace?: Resolver<ResolversTypes['NftMarketplace'], ParentType, ContextType>;
  marketplaceUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  orderHash?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  poolPrices?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  price?: Resolver<ResolversTypes['Amount'], ParentType, ContextType>;
  protocolParameters?: Resolver<Maybe<ResolversTypes['AWSJSON']>, ParentType, ContextType>;
  quantity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  startAt?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['OrderStatus'], ParentType, ContextType>;
  taker?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  tokenId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['OrderType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NftOrderConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['NftOrderConnection'] = ResolversParentTypes['NftOrderConnection']> = {
  edges?: Resolver<Array<ResolversTypes['NftOrderEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NftOrderEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['NftOrderEdge'] = ResolversParentTypes['NftOrderEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['NftOrder'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NftProfileResolvers<ContextType = any, ParentType extends ResolversParentTypes['NftProfile'] = ResolversParentTypes['NftProfile']> = {
  address?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isVerified?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  profileImage?: Resolver<Maybe<ResolversTypes['Image']>, ParentType, ContextType>;
  username?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NftRouteResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['NftRouteResponse'] = ResolversParentTypes['NftRouteResponse']> = {
  calldata?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  route?: Resolver<Maybe<Array<ResolversTypes['NftTrade']>>, ParentType, ContextType>;
  sendAmount?: Resolver<ResolversTypes['TokenAmount'], ParentType, ContextType>;
  toAddress?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NftTradeResolvers<ContextType = any, ParentType extends ResolversParentTypes['NftTrade'] = ResolversParentTypes['NftTrade']> = {
  amount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  contractAddress?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  marketplace?: Resolver<ResolversTypes['NftMarketplace'], ParentType, ContextType>;
  price?: Resolver<ResolversTypes['TokenAmount'], ParentType, ContextType>;
  quotePrice?: Resolver<Maybe<ResolversTypes['TokenAmount']>, ParentType, ContextType>;
  tokenId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tokenType?: Resolver<Maybe<ResolversTypes['NftStandard']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NftTransferResolvers<ContextType = any, ParentType extends ResolversParentTypes['NftTransfer'] = ResolversParentTypes['NftTransfer']> = {
  asset?: Resolver<ResolversTypes['NftAsset'], ParentType, ContextType>;
  direction?: Resolver<ResolversTypes['TransactionDirection'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  nftStandard?: Resolver<ResolversTypes['NftStandard'], ParentType, ContextType>;
  recipient?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sender?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PageInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']> = {
  endCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hasNextPage?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  hasPreviousPage?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  startCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PoolTransactionResolvers<ContextType = any, ParentType extends ResolversParentTypes['PoolTransaction'] = ResolversParentTypes['PoolTransaction']> = {
  account?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  chain?: Resolver<ResolversTypes['Chain'], ParentType, ContextType>;
  hash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  protocolVersion?: Resolver<ResolversTypes['ProtocolVersion'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  token0?: Resolver<ResolversTypes['Token'], ParentType, ContextType>;
  token0Quantity?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  token1?: Resolver<ResolversTypes['Token'], ParentType, ContextType>;
  token1Quantity?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['PoolTransactionType'], ParentType, ContextType>;
  usdValue?: Resolver<ResolversTypes['Amount'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PortfolioResolvers<ContextType = any, ParentType extends ResolversParentTypes['Portfolio'] = ResolversParentTypes['Portfolio']> = {
  assetActivities?: Resolver<Maybe<Array<Maybe<ResolversTypes['AssetActivity']>>>, ParentType, ContextType, Partial<PortfolioAssetActivitiesArgs>>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  nftBalances?: Resolver<Maybe<Array<Maybe<ResolversTypes['NftBalance']>>>, ParentType, ContextType>;
  ownerAddress?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tokenBalances?: Resolver<Maybe<Array<Maybe<ResolversTypes['TokenBalance']>>>, ParentType, ContextType>;
  tokensTotalDenominatedValue?: Resolver<Maybe<ResolversTypes['Amount']>, ParentType, ContextType>;
  tokensTotalDenominatedValueChange?: Resolver<Maybe<ResolversTypes['AmountChange']>, ParentType, ContextType, Partial<PortfolioTokensTotalDenominatedValueChangeArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PushNotificationResolvers<ContextType = any, ParentType extends ResolversParentTypes['PushNotification'] = ResolversParentTypes['PushNotification']> = {
  contents?: Resolver<ResolversTypes['AWSJSON'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  notifyAddress?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  signerHeader?: Resolver<ResolversTypes['AWSJSON'], ParentType, ContextType>;
  viewerHeader?: Resolver<ResolversTypes['AWSJSON'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  convert?: Resolver<Maybe<ResolversTypes['Amount']>, ParentType, ContextType, RequireFields<QueryConvertArgs, 'fromAmount' | 'toCurrency'>>;
  dailyProtocolTvl?: Resolver<Maybe<Array<ResolversTypes['TimestampedAmount']>>, ParentType, ContextType, RequireFields<QueryDailyProtocolTvlArgs, 'chain' | 'version'>>;
  historicalProtocolVolume?: Resolver<Maybe<Array<ResolversTypes['TimestampedAmount']>>, ParentType, ContextType, RequireFields<QueryHistoricalProtocolVolumeArgs, 'chain' | 'duration' | 'version'>>;
  nftActivity?: Resolver<Maybe<ResolversTypes['NftActivityConnection']>, ParentType, ContextType, Partial<QueryNftActivityArgs>>;
  nftAssets?: Resolver<Maybe<ResolversTypes['NftAssetConnection']>, ParentType, ContextType, RequireFields<QueryNftAssetsArgs, 'address'>>;
  nftBalances?: Resolver<Maybe<ResolversTypes['NftBalanceConnection']>, ParentType, ContextType, RequireFields<QueryNftBalancesArgs, 'ownerAddress'>>;
  nftCollectionBalances?: Resolver<Maybe<ResolversTypes['NftCollectionBalanceConnection']>, ParentType, ContextType, RequireFields<QueryNftCollectionBalancesArgs, 'ownerAddress'>>;
  nftCollections?: Resolver<Maybe<ResolversTypes['NftCollectionConnection']>, ParentType, ContextType, Partial<QueryNftCollectionsArgs>>;
  nftRoute?: Resolver<Maybe<ResolversTypes['NftRouteResponse']>, ParentType, ContextType, RequireFields<QueryNftRouteArgs, 'nftTrades' | 'senderAddress'>>;
  portfolios?: Resolver<Maybe<Array<Maybe<ResolversTypes['Portfolio']>>>, ParentType, ContextType, RequireFields<QueryPortfoliosArgs, 'ownerAddresses'>>;
  searchTokens?: Resolver<Maybe<Array<Maybe<ResolversTypes['Token']>>>, ParentType, ContextType, RequireFields<QuerySearchTokensArgs, 'searchQuery'>>;
  token?: Resolver<Maybe<ResolversTypes['Token']>, ParentType, ContextType, RequireFields<QueryTokenArgs, 'chain'>>;
  tokenProjects?: Resolver<Maybe<Array<Maybe<ResolversTypes['TokenProject']>>>, ParentType, ContextType, RequireFields<QueryTokenProjectsArgs, 'contracts'>>;
  tokens?: Resolver<Maybe<Array<Maybe<ResolversTypes['Token']>>>, ParentType, ContextType, RequireFields<QueryTokensArgs, 'contracts'>>;
  topCollections?: Resolver<Maybe<ResolversTypes['NftCollectionConnection']>, ParentType, ContextType, Partial<QueryTopCollectionsArgs>>;
  topTokens?: Resolver<Maybe<Array<Maybe<ResolversTypes['Token']>>>, ParentType, ContextType, Partial<QueryTopTokensArgs>>;
  topV2Pairs?: Resolver<Maybe<Array<ResolversTypes['V2Pair']>>, ParentType, ContextType, RequireFields<QueryTopV2PairsArgs, 'chain' | 'first'>>;
  topV3Pools?: Resolver<Maybe<Array<ResolversTypes['V3Pool']>>, ParentType, ContextType, RequireFields<QueryTopV3PoolsArgs, 'chain' | 'first'>>;
  transactionNotification?: Resolver<Maybe<ResolversTypes['TransactionNotification']>, ParentType, ContextType, RequireFields<QueryTransactionNotificationArgs, 'address' | 'chain' | 'transactionHash'>>;
  v2Pair?: Resolver<Maybe<ResolversTypes['V2Pair']>, ParentType, ContextType, RequireFields<QueryV2PairArgs, 'address' | 'chain'>>;
  v2Transactions?: Resolver<Maybe<Array<Maybe<ResolversTypes['PoolTransaction']>>>, ParentType, ContextType, RequireFields<QueryV2TransactionsArgs, 'chain' | 'first'>>;
  v3Pool?: Resolver<Maybe<ResolversTypes['V3Pool']>, ParentType, ContextType, RequireFields<QueryV3PoolArgs, 'address' | 'chain'>>;
  v3Transactions?: Resolver<Maybe<Array<ResolversTypes['PoolTransaction']>>, ParentType, ContextType, RequireFields<QueryV3TransactionsArgs, 'chain' | 'first'>>;
};

export type StatusResolvers<ContextType = any, ParentType extends ResolversParentTypes['Status'] = ResolversParentTypes['Status']> = {
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  onAssetActivity?: SubscriptionResolver<Maybe<ResolversTypes['AssetActivity']>, "onAssetActivity", ParentType, ContextType, RequireFields<SubscriptionOnAssetActivityArgs, 'addresses' | 'subscriptionId'>>;
};

export type SwapOrderDetailsResolvers<ContextType = any, ParentType extends ResolversParentTypes['SwapOrderDetails'] = ResolversParentTypes['SwapOrderDetails']> = {
  encodedOrder?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  expiry?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  hash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  inputToken?: Resolver<ResolversTypes['Token'], ParentType, ContextType>;
  inputTokenQuantity?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  offerer?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  outputToken?: Resolver<ResolversTypes['Token'], ParentType, ContextType>;
  outputTokenQuantity?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['SwapOrderStatus'], ParentType, ContextType>;
  swapOrderStatus?: Resolver<ResolversTypes['SwapOrderStatus'], ParentType, ContextType>;
  swapOrderType?: Resolver<ResolversTypes['SwapOrderType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TimestampedAmountResolvers<ContextType = any, ParentType extends ResolversParentTypes['TimestampedAmount'] = ResolversParentTypes['TimestampedAmount']> = {
  currency?: Resolver<Maybe<ResolversTypes['Currency']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TimestampedOhlcResolvers<ContextType = any, ParentType extends ResolversParentTypes['TimestampedOhlc'] = ResolversParentTypes['TimestampedOhlc']> = {
  close?: Resolver<ResolversTypes['Amount'], ParentType, ContextType>;
  high?: Resolver<ResolversTypes['Amount'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  low?: Resolver<ResolversTypes['Amount'], ParentType, ContextType>;
  open?: Resolver<ResolversTypes['Amount'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TimestampedPoolPriceResolvers<ContextType = any, ParentType extends ResolversParentTypes['TimestampedPoolPrice'] = ResolversParentTypes['TimestampedPoolPrice']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  token0Price?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  token1Price?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TokenResolvers<ContextType = any, ParentType extends ResolversParentTypes['Token'] = ResolversParentTypes['Token']> = {
  address?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  chain?: Resolver<ResolversTypes['Chain'], ParentType, ContextType>;
  decimals?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  feeData?: Resolver<Maybe<ResolversTypes['FeeData']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  market?: Resolver<Maybe<ResolversTypes['TokenMarket']>, ParentType, ContextType, Partial<TokenMarketArgs>>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  project?: Resolver<Maybe<ResolversTypes['TokenProject']>, ParentType, ContextType>;
  standard?: Resolver<Maybe<ResolversTypes['TokenStandard']>, ParentType, ContextType>;
  symbol?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  v2Transactions?: Resolver<Maybe<Array<Maybe<ResolversTypes['PoolTransaction']>>>, ParentType, ContextType, RequireFields<TokenV2TransactionsArgs, 'first'>>;
  v3Transactions?: Resolver<Maybe<Array<Maybe<ResolversTypes['PoolTransaction']>>>, ParentType, ContextType, RequireFields<TokenV3TransactionsArgs, 'first'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TokenAmountResolvers<ContextType = any, ParentType extends ResolversParentTypes['TokenAmount'] = ResolversParentTypes['TokenAmount']> = {
  currency?: Resolver<ResolversTypes['Currency'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TokenApprovalResolvers<ContextType = any, ParentType extends ResolversParentTypes['TokenApproval'] = ResolversParentTypes['TokenApproval']> = {
  approvedAddress?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  asset?: Resolver<ResolversTypes['Token'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  quantity?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tokenStandard?: Resolver<ResolversTypes['TokenStandard'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TokenBalanceResolvers<ContextType = any, ParentType extends ResolversParentTypes['TokenBalance'] = ResolversParentTypes['TokenBalance']> = {
  blockNumber?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  blockTimestamp?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  denominatedValue?: Resolver<Maybe<ResolversTypes['Amount']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isHidden?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  ownerAddress?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  quantity?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  token?: Resolver<Maybe<ResolversTypes['Token']>, ParentType, ContextType>;
  tokenProjectMarket?: Resolver<Maybe<ResolversTypes['TokenProjectMarket']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TokenMarketResolvers<ContextType = any, ParentType extends ResolversParentTypes['TokenMarket'] = ResolversParentTypes['TokenMarket']> = {
  fullyDilutedValuation?: Resolver<Maybe<ResolversTypes['Amount']>, ParentType, ContextType>;
  historicalTvl?: Resolver<Maybe<Array<Maybe<ResolversTypes['TimestampedAmount']>>>, ParentType, ContextType, RequireFields<TokenMarketHistoricalTvlArgs, 'duration'>>;
  historicalVolume?: Resolver<Maybe<Array<Maybe<ResolversTypes['TimestampedAmount']>>>, ParentType, ContextType, RequireFields<TokenMarketHistoricalVolumeArgs, 'duration'>>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  ohlc?: Resolver<Maybe<Array<Maybe<ResolversTypes['TimestampedOhlc']>>>, ParentType, ContextType, RequireFields<TokenMarketOhlcArgs, 'duration'>>;
  price?: Resolver<Maybe<ResolversTypes['Amount']>, ParentType, ContextType>;
  priceHighLow?: Resolver<Maybe<ResolversTypes['Amount']>, ParentType, ContextType, RequireFields<TokenMarketPriceHighLowArgs, 'duration' | 'highLow'>>;
  priceHistory?: Resolver<Maybe<Array<Maybe<ResolversTypes['TimestampedAmount']>>>, ParentType, ContextType, RequireFields<TokenMarketPriceHistoryArgs, 'duration'>>;
  pricePercentChange?: Resolver<Maybe<ResolversTypes['Amount']>, ParentType, ContextType, RequireFields<TokenMarketPricePercentChangeArgs, 'duration'>>;
  priceSource?: Resolver<ResolversTypes['PriceSource'], ParentType, ContextType>;
  token?: Resolver<ResolversTypes['Token'], ParentType, ContextType>;
  totalValueLocked?: Resolver<Maybe<ResolversTypes['Amount']>, ParentType, ContextType>;
  volume?: Resolver<Maybe<ResolversTypes['Amount']>, ParentType, ContextType, RequireFields<TokenMarketVolumeArgs, 'duration'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TokenProjectResolvers<ContextType = any, ParentType extends ResolversParentTypes['TokenProject'] = ResolversParentTypes['TokenProject']> = {
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  descriptionTranslations?: Resolver<Maybe<ResolversTypes['DescriptionTranslations']>, ParentType, ContextType>;
  homepageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isSpam?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  logo?: Resolver<Maybe<ResolversTypes['Image']>, ParentType, ContextType>;
  logoUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  markets?: Resolver<Maybe<Array<Maybe<ResolversTypes['TokenProjectMarket']>>>, ParentType, ContextType, RequireFields<TokenProjectMarketsArgs, 'currencies'>>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  safetyLevel?: Resolver<Maybe<ResolversTypes['SafetyLevel']>, ParentType, ContextType>;
  smallLogo?: Resolver<Maybe<ResolversTypes['Image']>, ParentType, ContextType>;
  spamCode?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  tokens?: Resolver<Array<ResolversTypes['Token']>, ParentType, ContextType>;
  twitterName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TokenProjectMarketResolvers<ContextType = any, ParentType extends ResolversParentTypes['TokenProjectMarket'] = ResolversParentTypes['TokenProjectMarket']> = {
  currency?: Resolver<ResolversTypes['Currency'], ParentType, ContextType>;
  fullyDilutedValuation?: Resolver<Maybe<ResolversTypes['Amount']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  marketCap?: Resolver<Maybe<ResolversTypes['Amount']>, ParentType, ContextType>;
  price?: Resolver<Maybe<ResolversTypes['Amount']>, ParentType, ContextType>;
  priceHigh52w?: Resolver<Maybe<ResolversTypes['Amount']>, ParentType, ContextType>;
  priceHighLow?: Resolver<Maybe<ResolversTypes['Amount']>, ParentType, ContextType, RequireFields<TokenProjectMarketPriceHighLowArgs, 'duration' | 'highLow'>>;
  priceHistory?: Resolver<Maybe<Array<Maybe<ResolversTypes['TimestampedAmount']>>>, ParentType, ContextType, RequireFields<TokenProjectMarketPriceHistoryArgs, 'duration'>>;
  priceLow52w?: Resolver<Maybe<ResolversTypes['Amount']>, ParentType, ContextType>;
  pricePercentChange?: Resolver<Maybe<ResolversTypes['Amount']>, ParentType, ContextType, RequireFields<TokenProjectMarketPricePercentChangeArgs, 'duration'>>;
  pricePercentChange24h?: Resolver<Maybe<ResolversTypes['Amount']>, ParentType, ContextType>;
  tokenProject?: Resolver<ResolversTypes['TokenProject'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TokenTransferResolvers<ContextType = any, ParentType extends ResolversParentTypes['TokenTransfer'] = ResolversParentTypes['TokenTransfer']> = {
  asset?: Resolver<ResolversTypes['Token'], ParentType, ContextType>;
  direction?: Resolver<ResolversTypes['TransactionDirection'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  quantity?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  recipient?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sender?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tokenStandard?: Resolver<ResolversTypes['TokenStandard'], ParentType, ContextType>;
  transactedValue?: Resolver<Maybe<ResolversTypes['Amount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TransactionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Transaction'] = ResolversParentTypes['Transaction']> = {
  blockNumber?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  from?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  gasLimit?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  hash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  maxFeePerGas?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  nonce?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['TransactionStatus'], ParentType, ContextType>;
  to?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TransactionDetailsResolvers<ContextType = any, ParentType extends ResolversParentTypes['TransactionDetails'] = ResolversParentTypes['TransactionDetails']> = {
  application?: Resolver<Maybe<ResolversTypes['ApplicationContract']>, ParentType, ContextType>;
  assetChanges?: Resolver<Array<Maybe<ResolversTypes['AssetChange']>>, ParentType, ContextType>;
  from?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  hash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  nonce?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['TransactionStatus'], ParentType, ContextType>;
  to?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  transactionStatus?: Resolver<ResolversTypes['TransactionStatus'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['TransactionType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TransactionNotificationResolvers<ContextType = any, ParentType extends ResolversParentTypes['TransactionNotification'] = ResolversParentTypes['TransactionNotification']> = {
  hash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  push?: Resolver<Array<ResolversTypes['PushNotification']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type V2PairResolvers<ContextType = any, ParentType extends ResolversParentTypes['V2Pair'] = ResolversParentTypes['V2Pair']> = {
  address?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  chain?: Resolver<ResolversTypes['Chain'], ParentType, ContextType>;
  createdAtTimestamp?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  cumulativeVolume?: Resolver<Maybe<ResolversTypes['Amount']>, ParentType, ContextType, RequireFields<V2PairCumulativeVolumeArgs, 'duration'>>;
  historicalVolume?: Resolver<Maybe<Array<Maybe<ResolversTypes['TimestampedAmount']>>>, ParentType, ContextType, RequireFields<V2PairHistoricalVolumeArgs, 'duration'>>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  priceHistory?: Resolver<Maybe<Array<Maybe<ResolversTypes['TimestampedPoolPrice']>>>, ParentType, ContextType, RequireFields<V2PairPriceHistoryArgs, 'duration'>>;
  protocolVersion?: Resolver<ResolversTypes['ProtocolVersion'], ParentType, ContextType>;
  token0?: Resolver<Maybe<ResolversTypes['Token']>, ParentType, ContextType>;
  token0Supply?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  token1?: Resolver<Maybe<ResolversTypes['Token']>, ParentType, ContextType>;
  token1Supply?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  totalLiquidity?: Resolver<Maybe<ResolversTypes['Amount']>, ParentType, ContextType>;
  totalLiquidityPercentChange24h?: Resolver<Maybe<ResolversTypes['Amount']>, ParentType, ContextType>;
  transactions?: Resolver<Maybe<Array<Maybe<ResolversTypes['PoolTransaction']>>>, ParentType, ContextType, RequireFields<V2PairTransactionsArgs, 'first'>>;
  txCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type V3PoolResolvers<ContextType = any, ParentType extends ResolversParentTypes['V3Pool'] = ResolversParentTypes['V3Pool']> = {
  address?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  chain?: Resolver<ResolversTypes['Chain'], ParentType, ContextType>;
  createdAtTimestamp?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  cumulativeVolume?: Resolver<Maybe<ResolversTypes['Amount']>, ParentType, ContextType, RequireFields<V3PoolCumulativeVolumeArgs, 'duration'>>;
  feeTier?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  historicalVolume?: Resolver<Maybe<Array<Maybe<ResolversTypes['TimestampedAmount']>>>, ParentType, ContextType, RequireFields<V3PoolHistoricalVolumeArgs, 'duration'>>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  priceHistory?: Resolver<Maybe<Array<Maybe<ResolversTypes['TimestampedPoolPrice']>>>, ParentType, ContextType, RequireFields<V3PoolPriceHistoryArgs, 'duration'>>;
  protocolVersion?: Resolver<ResolversTypes['ProtocolVersion'], ParentType, ContextType>;
  ticks?: Resolver<Maybe<Array<Maybe<ResolversTypes['V3PoolTick']>>>, ParentType, ContextType, RequireFields<V3PoolTicksArgs, 'first'>>;
  token0?: Resolver<Maybe<ResolversTypes['Token']>, ParentType, ContextType>;
  token0Supply?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  token1?: Resolver<Maybe<ResolversTypes['Token']>, ParentType, ContextType>;
  token1Supply?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  totalLiquidity?: Resolver<Maybe<ResolversTypes['Amount']>, ParentType, ContextType>;
  totalLiquidityPercentChange24h?: Resolver<Maybe<ResolversTypes['Amount']>, ParentType, ContextType>;
  transactions?: Resolver<Maybe<Array<Maybe<ResolversTypes['PoolTransaction']>>>, ParentType, ContextType, RequireFields<V3PoolTransactionsArgs, 'first'>>;
  txCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type V3PoolTickResolvers<ContextType = any, ParentType extends ResolversParentTypes['V3PoolTick'] = ResolversParentTypes['V3PoolTick']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  liquidityGross?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  liquidityNet?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  tickIdx?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  AWSJSON?: GraphQLScalarType;
  ActivityDetails?: ActivityDetailsResolvers<ContextType>;
  Amount?: AmountResolvers<ContextType>;
  AmountChange?: AmountChangeResolvers<ContextType>;
  ApplicationContract?: ApplicationContractResolvers<ContextType>;
  AssetActivity?: AssetActivityResolvers<ContextType>;
  AssetChange?: AssetChangeResolvers<ContextType>;
  DescriptionTranslations?: DescriptionTranslationsResolvers<ContextType>;
  Dimensions?: DimensionsResolvers<ContextType>;
  FeeData?: FeeDataResolvers<ContextType>;
  IAmount?: IAmountResolvers<ContextType>;
  IContract?: IContractResolvers<ContextType>;
  IPool?: IPoolResolvers<ContextType>;
  Image?: ImageResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  NftActivity?: NftActivityResolvers<ContextType>;
  NftActivityConnection?: NftActivityConnectionResolvers<ContextType>;
  NftActivityEdge?: NftActivityEdgeResolvers<ContextType>;
  NftApproval?: NftApprovalResolvers<ContextType>;
  NftApproveForAll?: NftApproveForAllResolvers<ContextType>;
  NftAsset?: NftAssetResolvers<ContextType>;
  NftAssetConnection?: NftAssetConnectionResolvers<ContextType>;
  NftAssetEdge?: NftAssetEdgeResolvers<ContextType>;
  NftAssetRarity?: NftAssetRarityResolvers<ContextType>;
  NftAssetTrait?: NftAssetTraitResolvers<ContextType>;
  NftBalance?: NftBalanceResolvers<ContextType>;
  NftBalanceConnection?: NftBalanceConnectionResolvers<ContextType>;
  NftBalanceEdge?: NftBalanceEdgeResolvers<ContextType>;
  NftCollection?: NftCollectionResolvers<ContextType>;
  NftCollectionBalance?: NftCollectionBalanceResolvers<ContextType>;
  NftCollectionBalanceConnection?: NftCollectionBalanceConnectionResolvers<ContextType>;
  NftCollectionBalanceEdge?: NftCollectionBalanceEdgeResolvers<ContextType>;
  NftCollectionConnection?: NftCollectionConnectionResolvers<ContextType>;
  NftCollectionEdge?: NftCollectionEdgeResolvers<ContextType>;
  NftCollectionMarket?: NftCollectionMarketResolvers<ContextType>;
  NftCollectionMarketplace?: NftCollectionMarketplaceResolvers<ContextType>;
  NftCollectionTrait?: NftCollectionTraitResolvers<ContextType>;
  NftCollectionTraitStats?: NftCollectionTraitStatsResolvers<ContextType>;
  NftContract?: NftContractResolvers<ContextType>;
  NftFee?: NftFeeResolvers<ContextType>;
  NftOrder?: NftOrderResolvers<ContextType>;
  NftOrderConnection?: NftOrderConnectionResolvers<ContextType>;
  NftOrderEdge?: NftOrderEdgeResolvers<ContextType>;
  NftProfile?: NftProfileResolvers<ContextType>;
  NftRouteResponse?: NftRouteResponseResolvers<ContextType>;
  NftTrade?: NftTradeResolvers<ContextType>;
  NftTransfer?: NftTransferResolvers<ContextType>;
  PageInfo?: PageInfoResolvers<ContextType>;
  PoolTransaction?: PoolTransactionResolvers<ContextType>;
  Portfolio?: PortfolioResolvers<ContextType>;
  PushNotification?: PushNotificationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Status?: StatusResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  SwapOrderDetails?: SwapOrderDetailsResolvers<ContextType>;
  TimestampedAmount?: TimestampedAmountResolvers<ContextType>;
  TimestampedOhlc?: TimestampedOhlcResolvers<ContextType>;
  TimestampedPoolPrice?: TimestampedPoolPriceResolvers<ContextType>;
  Token?: TokenResolvers<ContextType>;
  TokenAmount?: TokenAmountResolvers<ContextType>;
  TokenApproval?: TokenApprovalResolvers<ContextType>;
  TokenBalance?: TokenBalanceResolvers<ContextType>;
  TokenMarket?: TokenMarketResolvers<ContextType>;
  TokenProject?: TokenProjectResolvers<ContextType>;
  TokenProjectMarket?: TokenProjectMarketResolvers<ContextType>;
  TokenTransfer?: TokenTransferResolvers<ContextType>;
  Transaction?: TransactionResolvers<ContextType>;
  TransactionDetails?: TransactionDetailsResolvers<ContextType>;
  TransactionNotification?: TransactionNotificationResolvers<ContextType>;
  V2Pair?: V2PairResolvers<ContextType>;
  V3Pool?: V3PoolResolvers<ContextType>;
  V3PoolTick?: V3PoolTickResolvers<ContextType>;
};

export type DirectiveResolvers<ContextType = any> = {
  aws_api_key?: Aws_Api_KeyDirectiveResolver<any, any, ContextType>;
  aws_auth?: Aws_AuthDirectiveResolver<any, any, ContextType>;
  aws_cognito_user_pools?: Aws_Cognito_User_PoolsDirectiveResolver<any, any, ContextType>;
  aws_iam?: Aws_IamDirectiveResolver<any, any, ContextType>;
  aws_lambda?: Aws_LambdaDirectiveResolver<any, any, ContextType>;
  aws_oidc?: Aws_OidcDirectiveResolver<any, any, ContextType>;
  aws_publish?: Aws_PublishDirectiveResolver<any, any, ContextType>;
  aws_subscribe?: Aws_SubscribeDirectiveResolver<any, any, ContextType>;
  defer?: DeferDirectiveResolver<any, any, ContextType>;
};
