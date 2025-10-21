import vaults from "../resources/current-allowlist/supportedVaultContracts.json";
import newVaults from "../resources/new-allowlist/newVaultContracts.json";

import { Protocol, VaultTokenType } from "../utils/types";
import { getRandomColorFromSeed } from "../utils/utils";
import * as fs from "fs";

export const newKodiakBaults = async (): Promise<VaultTokenType[]> => {
  try {
    const currentKodiakBaults = vaults.filter(
      (vault) => vault.protocol === Protocol.KodiakBaults
    ) as VaultTokenType[];

    const response = await fetch(
      "https://backend.kodiak.finance/vaults?orderBy=totalApr&orderDirection=desc&limit=20&offset=0&chainId=80094&minimumTvl=8000&withBaults=true",
      {
        headers: {
          accept: "application/json",
          "accept-language": "en-US,en;q=0.9",
          "content-type": "application/json",
          priority: "u=1, i",
          "sec-ch-ua":
            '"Brave";v="137", "Chromium";v="137", "Not/A)Brand";v="24"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"macOS"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
          "sec-gpc": "1",
          Referer: "https://app.kodiak.finance/",
          "Referrer-Policy": "strict-origin-when-cross-origin",
        },
        body: null,
        method: "GET",
      }
    );
    const datas = (await response.json()).data;

    const allKodiakBaults: VaultTokenType[] = datas
      .filter((vault: any) => {
        return vault.tvl >= 10000;
      })
      .map((vault: any) => {
        return (vault.baults ?? []).map((bault: any) => {
          return {
            iid: `bera:${bault.id.toLowerCase()}`,
            address: bault.id.toLowerCase(),
            underlying_iid: `bera:${vault.tokenLp.id.toLowerCase()}`,
            decimals: 18,
            protocol: Protocol.KodiakBaults,
            network: 80094,
            symbol: vault.tokenLp.symbol.replace(" ", "-"),
            tokenCategory: "vault",
            color: getRandomColorFromSeed(bault.id, "dark"),
            url: `https://app.kodiak.finance/#/liquidity/pools/${vault.id.toLowerCase()}`,
            name: vault.tokenLp.symbol.split(" ")[1],
            colors: {
              light: getRandomColorFromSeed(bault.id, "light"),
              dark: getRandomColorFromSeed(bault.id, "dark"),
            },
          };
        });
      })
      .flat();

    console.log(`Found ${allKodiakBaults.length} Kodiak Baults from API.`);

    const newKodiakBaults = allKodiakBaults.filter(
      (vault) =>
        !currentKodiakBaults.some(
          (currentVault) => currentVault.iid === vault.iid
        ) && !newVaults.some((newVault) => newVault.iid === vault.iid)
    );

    if (newKodiakBaults.length > 0) {
      fs.writeFileSync(
        "src/resources/new-allowlist/newVaultContracts.json",
        JSON.stringify([...newVaults, ...newKodiakBaults], null, 2)
      );
    }
    console.log(
      `Found ${newKodiakBaults.length} new Kodiak Baults to be added.`
    );

    return newKodiakBaults;
  } catch (error) {
    console.error("Error fetching Kodiak Baults:", error);
    return [];
  }
};
