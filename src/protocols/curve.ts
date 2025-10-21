import weightedPools from "../resources/current-allowlist/supportedWeightedLiquidityContracts.json";
import newWeightedPools from "../resources/new-allowlist/newWeightedLiquidityContracts.json";

import { Protocol, WeightedPoolTokenType } from "../utils/types";
import {
  getRandomColorFromSeed,
  mappingChainIdToChainName,
  mappingCurveChainIdToChainId,
} from "../utils/utils";
import * as fs from "fs";

export const newCurveWeightedPools = async (): Promise<
  WeightedPoolTokenType[]
> => {
  try {
    const supportedChains = [
      "hyperliquid",
      "base",
      "ethereum",
      "arbitrum",
      "bsc",
      "sonic",
    ];

    const currentCurveWeightedPools = weightedPools.filter(
      (vault) => vault.protocol === Protocol.Curve
    ) as WeightedPoolTokenType[];

    const allCurveDatas: any[] = [];

    for (const chain of supportedChains) {
      const response = await fetch(
        `https://api.curve.finance/v1/getPools/big/${chain}`
      );
      const datas = (await response.json()).data.poolData;
      allCurveDatas.push(...datas);
    }

    const allCurveWeightedPools: WeightedPoolTokenType[] = [];

    const iidSet = new Set();

    for (const pool of allCurveDatas) {
      if (!pool.symbol) {
        continue;
      }
      if (iidSet.has(pool.lpTokenAddress.toLowerCase())) {
        continue;
      }
      iidSet.add(pool.lpTokenAddress.toLowerCase());

      let poolId = pool.id;

      if (!Number.isNaN(Number(pool.id))) {
        if (pool.poolUrls.deposit.length == 0) {
          console.log({
            id: pool.id,
            address: pool.address,
            lpTokenAddress: pool.lpTokenAddress,
            symbol: pool.symbol,
            name: pool.name,
          });
          continue;
        }
        const regex = /\/pools\/([^\/]+)\/deposit/;
        const match = pool.poolUrls.deposit[0].match(regex);
        if (match) {
          poolId = match[1];
        }
      }

      const chainId = mappingCurveChainIdToChainId[pool.blockchainId];
      const poolData: WeightedPoolTokenType = {
        iid: `${
          mappingChainIdToChainName[chainId]
        }:${pool.lpTokenAddress.toLowerCase()}`,
        symbol: pool.symbol,
        name: pool.name,
        address: pool.lpTokenAddress.toLowerCase(),
        protocol: Protocol.Curve,
        underlying_iids: pool.coins.map((coin: any) => {
          return `${
            mappingChainIdToChainName[chainId]
          }:${coin.address.toLowerCase()}`;
        }),
        weights: pool.coins.map(() => 0),
        network: Number(chainId),
        decimals: 18,
        poolId: poolId + ":" + pool.address.toLowerCase(),
        tokenCategory: "weightedLiquidity",
        primaryColor: getRandomColorFromSeed(
          poolId + ":" + pool.address.toLowerCase(),
          "dark"
        ),
        url: `https://www.curve.finance/dex/${pool.blockchainId}/pools/${pool.id}/deposit`,
        colors: {
          light: getRandomColorFromSeed(
            poolId + ":" + pool.address.toLowerCase(),
            "light"
          ),
          dark: getRandomColorFromSeed(
            poolId + ":" + pool.address.toLowerCase(),
            "dark"
          ),
        },
      };
      allCurveWeightedPools.push(poolData);
    }

    console.log(`Found ${allCurveWeightedPools.length} Curve weighted pools.`);

    const newCurveWeightedPools = allCurveWeightedPools.filter(
      (pool) =>
        !currentCurveWeightedPools.some(
          (existingPool: any) => existingPool.iid === pool.iid
        ) && !newWeightedPools.some((newPool: any) => newPool.iid === pool.iid)
    );

    console.log(
      `Found ${newCurveWeightedPools.length} new Curve weighted pools.`
    );

    if (newCurveWeightedPools.length > 0) {
      fs.writeFileSync(
        "src/resources/new-allowlist/newWeightedLiquidityContracts.json",
        JSON.stringify([...newWeightedPools, ...newCurveWeightedPools], null, 2)
      );
    }
    return newCurveWeightedPools;
  } catch (error) {
    console.error("Error fetching Curve Weighted Pools:", error);
    return [];
  }
};
