import weightedPools from "../resources/current-allowlist/supportedWeightedLiquidityContracts.json";
import newWeightedPools from "../resources/new-allowlist/newWeightedLiquidityContracts.json";

import { Protocol, WeightedPoolTokenType } from "../utils/types";
import { getRandomColorFromSeed, getTokenDetails } from "../utils/utils";
import * as fs from "fs";

export const newBexWeightedPools = async (): Promise<
  WeightedPoolTokenType[]
> => {
  try {
    const response = await fetch("https://api.berachain.com/", {
      headers: {
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "application/json",
        priority: "u=1, i",
        "sec-ch-ua":
          '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        Referer: "https://hub.berachain.com/",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
      body: '{"operationName":"GetPools","variables":{"chain":"BERACHAIN","first":300,"orderBy":"totalLiquidity","orderDirection":"desc","skip":0,"blacklistedPoolIds":[]},"query":"query GetPools($textSearch: String, $first: Int, $userAddress: String, $chain: [GqlChain!]!, $orderBy: GqlPoolOrderBy, $skip: Int, $orderDirection: GqlPoolOrderDirection, $blacklistedPoolIds: [String!]) {\\n  poolGetPools(\\n    textSearch: $textSearch\\n    first: $first\\n    orderBy: $orderBy\\n    orderDirection: $orderDirection\\n    skip: $skip\\n    where: {userAddress: $userAddress, chainIn: $chain, idNotIn: $blacklistedPoolIds}\\n  ) {\\n    ...MinimalPoolInList\\n    __typename\\n  }\\n  count: poolGetPoolsCount(\\n    textSearch: $textSearch\\n    where: {userAddress: $userAddress, chainIn: $chain}\\n  )\\n}\\n\\nfragment MinimalPoolInList on GqlPoolMinimal {\\n  id\\n  name\\n  address\\n  factory\\n  tokens: allTokens {\\n    address\\n    symbol\\n    name\\n    decimals\\n    weight\\n   __typename\\n  }\\n  address\\n  protocolVersion\\n  type\\n  dynamicData {\\n    ...DynamicData\\n    __typename\\n  }\\n  userBalance {\\n    ...UserBalance\\n    __typename\\n  }\\n  rewardVault {\\n    ...RewardVault\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment DynamicData on GqlPoolDynamicData {\\n  totalShares\\n  fees24h\\n  volume24h\\n  swapFee\\n  isInRecoveryMode\\n  isPaused\\n  totalLiquidity\\n  aprItems {\\n    apr\\n    type\\n    id\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment UserBalance on GqlPoolUserBalance {\\n  totalBalanceUsd\\n  walletBalance\\n  walletBalanceUsd\\n  __typename\\n}\\n\\nfragment RewardVault on GqlRewardVault {\\n  dynamicData {\\n    activeIncentivesValueUsd\\n    apr\\n    bgtCapturePercentage\\n    allTimeReceivedBGTAmount\\n    __typename\\n  }\\n  isVaultWhitelisted\\n  vaultAddress\\n  stakingTokenAddress\\n  __typename\\n}"}',
      method: "POST",
    });
    const datas = (await response.json()).data.poolGetPools;
    const allBexTokenAddresses = datas
      .filter(
        (pool: any) =>
          (pool.type === "COMPOSABLE_STABLE" || pool.type === "WEIGHTED") &&
          Number(pool.dynamicData.totalLiquidity) > 10000
      )
      .map((pool: any) => pool.address);

    const allBexTokens = await getTokenDetails(80094, allBexTokenAddresses);
    const allBexWeightedPools: WeightedPoolTokenType[] = datas
      .filter(
        (pool: any) =>
          (pool.type === "COMPOSABLE_STABLE" || pool.type === "WEIGHTED") &&
          Number(pool.dynamicData.totalLiquidity) > 10000
      )
      .map((pool: any) => {
        const poolTokenInfo = allBexTokens.find(
          (token) => token.address.toLowerCase() === pool.address.toLowerCase()
        );

        const underlying_iids = pool.tokens
          .filter(
            (token: any) =>
              token.address.toLowerCase() !== pool.address.toLowerCase()
          )
          .map((token: any) => `bera:${token.address.toLowerCase()}`);

        return {
          iid: `bera:${pool.address.toLowerCase()}`,
          name: pool.name,
          symbol: poolTokenInfo ? poolTokenInfo.symbol : "UNKNOWN",
          address: pool.address.toLowerCase(),
          protocol: Protocol.Bex,
          underlying_iids: underlying_iids,
          weights:
            pool.type === "COMPOSABLE_STABLE"
              ? underlying_iids.map(() => 0)
              : pool.tokens.map((t: any) => t.weight),
          network: 80094,
          decimals: poolTokenInfo ? poolTokenInfo.decimals : 18,
          poolId: pool.id.toLowerCase(),
          tokenCategory: "weightedLiquidity",
          primaryColor: getRandomColorFromSeed(pool.id, "dark"),
          url: `https://hub.berachain.com/pools/${pool.id.toLowerCase()}/details`,
          colors: {
            light: getRandomColorFromSeed(pool.id, "light"),
            dark: getRandomColorFromSeed(pool.id, "dark"),
          },
        };
      });

    console.log(`Found ${allBexWeightedPools.length} Bex weighted pools.`);

    const newBexWeightedPools = allBexWeightedPools.filter(
      (pool) =>
        !weightedPools.some(
          (existingPool: any) => existingPool.iid === pool.iid
        ) && !newWeightedPools.some((newPool: any) => newPool.iid === pool.iid)
    );

    console.log(
      `Found ${newBexWeightedPools.length} new Bex weighted pools to add.`
    );

    if (newBexWeightedPools.length > 0) {
      fs.writeFileSync(
        "src/resources/new-allowlist/newWeightedLiquidityContracts.json",
        JSON.stringify([...newWeightedPools, ...newBexWeightedPools], null, 2)
      );
    }

    return newBexWeightedPools;
  } catch (error) {
    console.error("Error fetching Bex weighted pools:", error);
    return [];
  }
};
