import weightedPools from "../resources/current-allowlist/supportedWeightedLiquidityContracts.json";
import newWeightedPools from "../resources/new-allowlist/newWeightedLiquidityContracts.json";

import { Protocol, WeightedPoolTokenType } from "../utils/types";
import { getRandomColorFromSeed } from "../utils/utils";

export const newKodiakIslandWeightedPools = async (): Promise<
  WeightedPoolTokenType[]
> => {
  try {
    const currentKodiakIslandWeightedPools = weightedPools.filter(
      (vault) => vault.protocol === Protocol.KodiakIsland
    ) as WeightedPoolTokenType[];

    const response = await fetch(
      "https://staging.backend.kodiak.finance/vaults?orderBy=totalApr&orderDirection=desc&limit=1000&offset=0&chainId=80094&minimumTvl=10000&withBaults=false",
      {
        headers: {
          accept: "application/json",
          "accept-language": "en-US,en;q=0.9",
          "content-type": "application/json",
          "if-none-match": 'W/"8c08-lXC4kihjo4ViK0Cs5/cJOEzZiSY"',
          priority: "u=1, i",
          "sec-ch-ua":
            '"Chromium";v="136", "Brave";v="136", "Not.A/Brand";v="99"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"macOS"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
          "sec-gpc": "1",
        },
        referrer: "https://app.kodiak.finance/",
        referrerPolicy: "strict-origin-when-cross-origin",
        body: null,
        method: "GET",
        mode: "cors",
        credentials: "omit",
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch Kodiak Island Weighted Pools data: ${response.statusText}`
      );
    }

    const datas = (await response.json()).data;
    const allKodiakIslandWeightedPools: WeightedPoolTokenType[] = datas.map(
      (pool: any) => {
        console.log(pool);
        return {
          iid: `bera:${pool.tokenLp.id.toLowerCase()}`,
          name: pool.tokenLp?.name,
          symbol: pool.tokenLp?.symbol.replace(" ", "-"),
          address: pool.tokenLp.id.toLowerCase(),
          protocol: Protocol.KodiakIsland,
          underlying_iids: [
            `bera:${pool.token0.id.toLowerCase()}`,
            `bera:${pool.token1.id.toLowerCase()}`,
          ],
          weights: [0, 0],
          network: 80094,
          decimals: pool.tokenLp?.decimals,
          poolId: pool.id.toLowerCase(),
          tokenCategory: "weightedLiquidity",
          primaryColor: getRandomColorFromSeed(pool.id, "dark"),
          url: `https://app.kodiak.finance/#/liquidity/pools/${pool.id.toLowerCase()}`,
          colors: {
            light: getRandomColorFromSeed(pool.id, "light"),
            dark: getRandomColorFromSeed(pool.id, "dark"),
          },
        };
      }
    );

    console.log(
      `Found ${allKodiakIslandWeightedPools.length} Kodiak Island Weighted Pools.`
    );

    // Identify new pools not in the current allowlist
    const newKodiakIslandPools = allKodiakIslandWeightedPools.filter(
      (pool) =>
        !currentKodiakIslandWeightedPools.some(
          (currentPool) => currentPool.iid === pool.iid
        ) &&
        !(newWeightedPools as WeightedPoolTokenType[]).some(
          (currentPool) => currentPool.iid === pool.iid
        )
    );

    console.log(
      `Found ${newKodiakIslandPools.length} new Kodiak Island weighted pools to be added.`
    );

    if (newKodiakIslandPools.length > 0) {
      const fs = await import("fs");
      fs.writeFileSync(
        "src/resources/new-allowlist/newWeightedLiquidityContracts.json",
        JSON.stringify([...newWeightedPools, ...newKodiakIslandPools], null, 2)
      );
    }

    return newKodiakIslandPools;
  } catch (error) {
    console.error("Error fetching Kodiak Island Weighted Pools:", error);
    return [];
  }
};
