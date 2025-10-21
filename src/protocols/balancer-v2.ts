import weightedPools from "../resources/current-allowlist/supportedWeightedLiquidityContracts.json";
import newWeightedPools from "../resources/new-allowlist/newWeightedLiquidityContracts.json";

import { Protocol, WeightedPoolTokenType } from "../utils/types";
import {
  getRandomColorFromSeed,
  mappingBalancerChainToChainId,
  mappingChainIdToChainName,
} from "../utils/utils";
import * as fs from "fs";

export const newBalancerWeightedPools = async (): Promise<
  WeightedPoolTokenType[]
> => {
  try {
    const currentBalancerWeightedPools = weightedPools.filter(
      (vault) => vault.protocol === Protocol.BalancerV2
    ) as WeightedPoolTokenType[];

    const response = await fetch("https://api-v3.balancer.fi/graphql", {
      headers: {
        accept: "*/*",
        "accept-language": "en-US,en;q=0.5",
        "content-type": "application/json",
        priority: "u=1, i",
        "sec-ch-ua": '"Not)A;Brand";v="8", "Chromium";v="138", "Brave";v="138"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "sec-gpc": "1",
        "x-graphql-client-name": "FrontendClient",
        "x-graphql-client-version": "1.0.0",
        Referer: "https://balancer.fi/",
      },
      body: '{"operationName":"GetPools","variables":{"first":10000,"skip":0,"orderBy":"totalLiquidity","orderDirection":"desc","where":{"poolTypeIn":["WEIGHTED"],"chainIn":["MAINNET","ARBITRUM","AVALANCHE","BASE","GNOSIS","POLYGON","OPTIMISM","HYPEREVM"],"userAddress":null,"minTvl":8000,"tagIn":null,"tagNotIn":["BLACK_LISTED"]},"textSearch":null},"query":"query GetPools($first: Int, $skip: Int, $orderBy: GqlPoolOrderBy, $orderDirection: GqlPoolOrderDirection, $where: GqlPoolFilter, $textSearch: String) {\\n  pools: poolGetPools(\\n    first: $first\\n    skip: $skip\\n    orderBy: $orderBy\\n    orderDirection: $orderDirection\\n    where: $where\\n    textSearch: $textSearch\\n  ) {\\n    address\\n    chain\\n    createTime\\n    decimals\\n    protocolVersion\\n    tags\\n    hasErc4626\\n    hasNestedErc4626\\n    hook {\\n      ...Hook\\n      __typename\\n    }\\n    poolTokens {\\n      id\\n      address\\n      symbol\\n      weight\\n      name\\n      canUseBufferForSwaps\\n      useWrappedForAddRemove\\n      useUnderlyingForAddRemove\\n      logoURI\\n      nestedPool {\\n        id\\n        address\\n        symbol\\n        name\\n        tokens {\\n          id\\n          address\\n          symbol\\n          weight\\n          name\\n          canUseBufferForSwaps\\n          useWrappedForAddRemove\\n          useUnderlyingForAddRemove\\n          logoURI\\n          __typename\\n        }\\n        __typename\\n      }\\n      __typename\\n    }\\n    dynamicData {\\n      totalLiquidity\\n      lifetimeVolume\\n      lifetimeSwapFees\\n      volume24h\\n      fees24h\\n      holdersCount\\n      swapFee\\n      swapsCount\\n      totalShares\\n      aprItems {\\n        id\\n        title\\n        apr\\n        type\\n        rewardTokenSymbol\\n        rewardTokenAddress\\n        __typename\\n      }\\n      __typename\\n    }\\n    staking {\\n      id\\n      type\\n      chain\\n      address\\n      gauge {\\n        id\\n        gaugeAddress\\n        version\\n        status\\n        workingSupply\\n        otherGauges {\\n          gaugeAddress\\n          version\\n          status\\n          id\\n          rewards {\\n            id\\n            tokenAddress\\n            rewardPerSecond\\n            __typename\\n          }\\n          __typename\\n        }\\n        rewards {\\n          id\\n          rewardPerSecond\\n          tokenAddress\\n          __typename\\n        }\\n        __typename\\n      }\\n      aura {\\n        id\\n        apr\\n        auraPoolAddress\\n        auraPoolId\\n        isShutdown\\n        __typename\\n      }\\n      __typename\\n    }\\n    factory\\n    id\\n    name\\n    owner\\n    swapFeeManager\\n    pauseManager\\n    poolCreator\\n    symbol\\n    type\\n    userBalance {\\n      totalBalance\\n      totalBalanceUsd\\n      walletBalance\\n      walletBalanceUsd\\n      stakedBalances {\\n        balance\\n        balanceUsd\\n        stakingType\\n        stakingId\\n        __typename\\n      }\\n      __typename\\n    }\\n    poolTokens {\\n      ...PoolTokens\\n      __typename\\n    }\\n    lbpParams {\\n      startTime\\n      endTime\\n      __typename\\n    }\\n    __typename\\n  }\\n  count: poolGetPoolsCount(\\n    first: $first\\n    skip: $skip\\n    orderBy: $orderBy\\n    orderDirection: $orderDirection\\n    where: $where\\n    textSearch: $textSearch\\n  )\\n}\\n\\nfragment UnderlyingToken on GqlToken {\\n  chain\\n  chainId\\n  address\\n  decimals\\n  name\\n  symbol\\n  priority\\n  tradable\\n  isErc4626\\n  logoURI\\n  __typename\\n}\\n\\nfragment Erc4626ReviewData on Erc4626ReviewData {\\n  reviewFile\\n  summary\\n  warnings\\n  __typename\\n}\\n\\nfragment Hook on GqlHook {\\n  address\\n  config {\\n    enableHookAdjustedAmounts\\n    shouldCallAfterAddLiquidity\\n    shouldCallAfterInitialize\\n    shouldCallAfterRemoveLiquidity\\n    shouldCallAfterSwap\\n    shouldCallBeforeAddLiquidity\\n    shouldCallBeforeInitialize\\n    shouldCallBeforeRemoveLiquidity\\n    shouldCallBeforeSwap\\n    shouldCallComputeDynamicSwapFee\\n    __typename\\n  }\\n  type\\n  params {\\n    ... on ExitFeeHookParams {\\n      exitFeePercentage\\n      __typename\\n    }\\n    ... on FeeTakingHookParams {\\n      addLiquidityFeePercentage\\n      removeLiquidityFeePercentage\\n      swapFeePercentage\\n      __typename\\n    }\\n    ... on StableSurgeHookParams {\\n      maxSurgeFeePercentage\\n      surgeThresholdPercentage\\n      __typename\\n    }\\n    ... on MevTaxHookParams {\\n      mevTaxThreshold\\n      mevTaxMultiplier\\n      maxMevSwapFeePercentage\\n      __typename\\n    }\\n    __typename\\n  }\\n  reviewData {\\n    reviewFile\\n    summary\\n    warnings\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment PoolTokens on GqlPoolTokenDetail {\\n  id\\n  chain\\n  chainId\\n  address\\n  decimals\\n  name\\n  symbol\\n  priority\\n  tradable\\n  canUseBufferForSwaps\\n  useWrappedForAddRemove\\n  useUnderlyingForAddRemove\\n  index\\n  balance\\n  balanceUSD\\n  priceRate\\n  decimals\\n  weight\\n  hasNestedPool\\n  isAllowed\\n  priceRateProvider\\n  logoURI\\n  priceRateProviderData {\\n    address\\n    name\\n    summary\\n    reviewed\\n    warnings\\n    upgradeableComponents {\\n      entryPoint\\n      implementationReviewed\\n      __typename\\n    }\\n    reviewFile\\n    factory\\n    __typename\\n  }\\n  nestedPool {\\n    id\\n    address\\n    type\\n    bptPriceRate\\n    nestedPercentage\\n    nestedShares\\n    totalLiquidity\\n    totalShares\\n    tokens {\\n      index\\n      address\\n      decimals\\n      balance\\n      balanceUSD\\n      symbol\\n      weight\\n      isErc4626\\n      canUseBufferForSwaps\\n      useWrappedForAddRemove\\n      useUnderlyingForAddRemove\\n      logoURI\\n      underlyingToken {\\n        ...UnderlyingToken\\n        __typename\\n      }\\n      erc4626ReviewData {\\n        ...Erc4626ReviewData\\n        __typename\\n      }\\n      __typename\\n    }\\n    hook {\\n      ...Hook\\n      __typename\\n    }\\n    __typename\\n  }\\n  isErc4626\\n  isBufferAllowed\\n  underlyingToken {\\n    ...UnderlyingToken\\n    __typename\\n  }\\n  erc4626ReviewData {\\n    ...Erc4626ReviewData\\n    __typename\\n  }\\n  __typename\\n}"}',
      method: "POST",
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch Balancer V2 data: ${response.statusText}`
      );
    }

    const datas = (await response.json()).data.pools;

    console.log("datas", datas);

    const allBalancerWeightedPools: WeightedPoolTokenType[] = datas
      .filter(
        (pool: any) =>
          pool.type === "WEIGHTED" && pool.dynamicData.totalLiquidity > 10000
      )
      .map((pool: any) => {
        const chainId = mappingBalancerChainToChainId[pool.chain];

        return {
          iid: `${
            mappingChainIdToChainName[chainId]
          }:${pool.address.toLowerCase()}`,
          name: pool.name,
          symbol: pool.symbol,
          address: pool.address.toLowerCase(),
          protocol: Protocol.BalancerV2,
          underlying_iids: pool.poolTokens.map(
            (token: any) =>
              `${
                mappingChainIdToChainName[chainId]
              }:${token.address.toLowerCase()}`
          ),
          weights: pool.poolTokens.map((token: any) => token.weight),
          network: chainId,
          decimals: pool.decimals,
          poolId: pool.id.toLowerCase(),
          tokenCategory: "weightedLiquidity",
          primaryColor: getRandomColorFromSeed(pool.id, "dark"),
          url: `https://balancer.fi/pools/gnosis/v2/${pool.id.toLowerCase()}`,
          colors: {
            light: getRandomColorFromSeed(pool.id, "light"),
            dark: getRandomColorFromSeed(pool.id, "dark"),
          },
        };
      });

    console.log(
      `Found ${allBalancerWeightedPools.length} Balancer V2 weighted pools from API.`
    );

    const newBalancerPools = allBalancerWeightedPools.filter(
      (pool) =>
        !currentBalancerWeightedPools.some(
          (currentPool) => currentPool.iid === pool.iid
        ) &&
        !(newWeightedPools as WeightedPoolTokenType[]).some(
          (currentPool) => currentPool.iid === pool.iid
        )
    );

    console.log(
      `Found ${newBalancerPools.length} new Balancer V2 weighted pools to be added.`
    );

    if (newBalancerPools.length > 0) {
      fs.writeFileSync(
        "src/resources/new-allowlist/newWeightedLiquidityContracts.json",
        JSON.stringify([...newWeightedPools, ...newBalancerPools], null, 2)
      );
    }

    return newBalancerPools;
  } catch (error) {
    console.error("Error fetching Balancer V2 weighted pools:", error);
    return [];
  }
};
