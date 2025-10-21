import vaults from "../resources/current-allowlist/supportedVaultContracts.json";
import newVaults from "../resources/new-allowlist/newVaultContracts.json";
import { Protocol, VaultTokenType } from "../utils/types";

export const newBendVaults = async (): Promise<VaultTokenType[]> => {
  try {
    return [];
  } catch (error) {
    console.error("Error fetching Infrared vaults:", error);
    return [];
  }
};
