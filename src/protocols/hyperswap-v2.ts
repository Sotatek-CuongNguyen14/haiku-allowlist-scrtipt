import weightedPools from "../resources/current-allowlist/supportedWeightedLiquidityContracts.json";
import newWeightedPools from "../resources/new-allowlist/newWeightedLiquidityContracts.json";

import { Protocol, WeightedPoolTokenType } from "../utils/types";
import {
  getRandomColorFromSeed,
  getTokenDetails,
} from "../utils/utils";
import * as fs from "fs";

export const newHyperswapV2WeightedPools = async (): Promise<
  WeightedPoolTokenType[]
> => {
  try {
    const currentHyperswapV2WeightedPools = weightedPools.filter(
      (vault) => vault.protocol === Protocol.HyperswapV2
    ) as WeightedPoolTokenType[];

    const response = await fetch(
      "https://proxy.hyperswapx.workers.dev/api/pairs?sort=total_tvl_usd&page=0&maxPerPage=500&version=v2",
      {
        headers: {
          "x-client-token":
            "UlNWAgpUBgcHAR0CAAYBAQZWUltVBVdcA1oDAlNRWVMNU1ZWA1MHBwEFAVMDU1JXAQoEWABTUg8ACFYADFgEWVZSBwYJUggOAAIK",
        },
      }
    );
    if (!response.ok) {
      throw new Error(
        `Failed to fetch Hyperswap V2 pools: ${response.status} ${response.statusText}`
      );
    }
    const datas = (await response.json()).data.pairs;

    const allHyperswapV2TokenAddresses = datas
      .filter((pair: any) => Number(pair.totalTvlUSD) > 10000)
      .map((pair: any) => {
        return pair.pairAddress;
      });

    const allHyperswapV2Tokens = await getTokenDetails(
      999,
      allHyperswapV2TokenAddresses
    );

    const allHyperswapV2WeightedPools: WeightedPoolTokenType[] = datas
      .filter((pair: any) => Number(pair.totalTvlUSD) > 10000)
      .map((pair: any) => {
        const poolTokenInfo = allHyperswapV2Tokens.find(
          (token) =>
            token.address.toLowerCase() === pair.pairAddress.toLowerCase()
        );
        return {
          iid: `hype:${pair.pairAddress.toLowerCase()}`,
          symbol: poolTokenInfo?.symbol,
          name: poolTokenInfo?.name,
          address: pair.pairAddress,
          protocol: Protocol.HyperswapV2,
          underlying_iids: [
            `hype:${pair.token0.token0Address.toLowerCase()}`,
            `hype:${pair.token1.token1Address.toLowerCase()}`,
          ],
          weights: [0, 0],
          network: 999,
          decimals: poolTokenInfo?.decimals,
          poolId: pair.pairAddress.toLowerCase(),
          tokenCategory: "weightedLiquidity",
          primaryColor: getRandomColorFromSeed(pair.pairAddress, "dark"),
          url: "https://app.hyperswap.exchange/#/explore/explore-pools",
          colors: {
            light: getRandomColorFromSeed(pair.pairAddress, "light"),
            dark: getRandomColorFromSeed(pair.pairAddress, "dark"),
          },
        };
      });

    console.log(
      `Found ${allHyperswapV2WeightedPools.length} Hyperswap V2 weighted pools.`
    );

    const newHyperswapV2WeightedPools = allHyperswapV2WeightedPools.filter(
      (pool) =>
        !currentHyperswapV2WeightedPools.some(
          (currentPool) => currentPool.iid === pool.iid
        ) &&
        !(newWeightedPools as WeightedPoolTokenType[]).some(
          (currentPool) => currentPool.iid === pool.iid
        )
    );

    console.log(
      `Found ${newHyperswapV2WeightedPools.length} new Hyperswap V2 weighted pools to be added.`
    );

    if (newHyperswapV2WeightedPools.length > 0) {
      fs.writeFileSync(
        "src/resources/new-allowlist/newWeightedLiquidityContracts.json",
        JSON.stringify([...newWeightedPools, ...newHyperswapV2WeightedPools], null, 2)
      );
    }

    return newHyperswapV2WeightedPools;
  } catch (error) {
    console.error("Error fetching Hyperswap V2 weighted pools:", error);
    return [];
  }
};
