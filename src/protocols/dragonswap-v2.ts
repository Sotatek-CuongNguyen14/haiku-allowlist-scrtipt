import weightedPools from "../resources/current-allowlist/supportedWeightedLiquidityContracts.json";
import newWeightedPools from "../resources/new-allowlist/newWeightedLiquidityContracts.json";

import { Protocol, WeightedPoolTokenType } from "../utils/types";
import { getRandomColorFromSeed } from "../utils/utils";
import * as fs from "fs";

export const newDragonSwapV2WeightedPools = async (): Promise<
  WeightedPoolTokenType[]
> => {
  try {
    const currentDragonSwapV2WeightedPools = weightedPools.filter(
      (vault) => vault.protocol === Protocol.DragonswapV2
    ) as WeightedPoolTokenType[];

    const response = await fetch("https://sei-api.dragonswap.app/api/v1/pools");
    if (!response.ok) {
      throw new Error(
        `Failed to fetch DragonSwap V2 pools: ${response.status} ${response.statusText}`
      );
    }
    const data = await response.json();
    const tokens = data.tokens;
    const allDragonSwapV2WeightedPools: WeightedPoolTokenType[] = data.pools
      .filter((pool: any) => {
        return pool.type === "V2_POOL";
      })
      .map((pool: any) => {
        const token0Data = tokens.find(
          (token: any) =>
            token.address.toLowerCase() === pool.token0_address.toLowerCase()
        );
        const token1Data = tokens.find(
          (token: any) =>
            token.address.toLowerCase() === pool.token1_address.toLowerCase()
        );
        return {
          iid: `sei:${pool.pool_address.toLowerCase()}`,
          name: `${token0Data.name}/${token1Data.name}`,
          symbol: `${token0Data.name}/${token1Data.name}`,
          address: pool.pool_address.toLowerCase(),
          protocol: Protocol.DragonswapV2,
          underlying_iids: [
            `sei:${token0Data.address.toLowerCase()}`,
            `sei:${token1Data.address.toLowerCase()}`,
          ],
          weights: [0, 0],
          network: 1329,
          decimals: 18,
          poolId: pool.pool_address.toLowerCase(),
          tokenCategory: "weightedLiquidity",
          primaryColor: getRandomColorFromSeed(pool.pool_address, "dark"),
          url: `https://dragonswap.app/pools/${pool.pool_address.toLowerCase()}`,
          colors: {
            light: getRandomColorFromSeed(pool.pool_address, "light"),
            dark: getRandomColorFromSeed(pool.pool_address, "dark"),
          },
        };
      });

    console.log(
      "Found",
      allDragonSwapV2WeightedPools.length,
      "DragonSwap V2 weighted pools."
    );

    const newDragonSwapV2WeightedPools = allDragonSwapV2WeightedPools.filter(
      (pool) =>
        !currentDragonSwapV2WeightedPools.some(
          (currentPool) => currentPool.iid === pool.iid
        ) &&
        !(newWeightedPools as WeightedPoolTokenType[]).some(
          (currentPool) => currentPool.iid === pool.iid
        )
    );

    console.log(
      "Found",
      newDragonSwapV2WeightedPools.length,
      "new DragonSwap V2 weighted pools."
    );

    if (newDragonSwapV2WeightedPools.length > 0) {
      fs.writeFileSync(
        "src/resources/new-allowlist/newWeightedLiquidityContracts.json",
        JSON.stringify(
          [...newWeightedPools, ...newDragonSwapV2WeightedPools],
          null,
          2
        )
      );
    }
    return newDragonSwapV2WeightedPools;
  } catch (error) {
    console.error("Error fetching DragonSwap V2 weighted pools:", error);
    return [];
  }
};
