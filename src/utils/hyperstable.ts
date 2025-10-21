import { ethers } from "ethers";
import RouterKitManager from "./routerKit";

export const HYPERSTABLE_POOL_MANAGER_CONTRACT =
  "0x8ADf2532c86aB123228D75Eb9DA5085DC3eAf5b9";

function xorBytes(a: Uint8Array, b: Uint8Array, c: Uint8Array): Uint8Array {
  if (a.length !== b.length || a.length !== c.length)
    throw new Error("Lengths must match");
  const result = new Uint8Array(a.length);
  for (let i = 0; i < a.length; i++) {
    result[i] = a[i] ^ b[i] ^ c[i];
  }
  return result;
}

export function hyperStableEncodeSyntheticAddress(
  poolManagerAddress: string,
  tokenAddress: string,
  vaultIndex: number
): string {
  const tokenBytes = ethers.utils.arrayify(tokenAddress);
  const poolManagerBytes = ethers.utils.arrayify(poolManagerAddress);
  const vaultIndexBytes = new Uint8Array(20);
  const vaultIndexHex = vaultIndex.toString(16);
  const paddedHex = vaultIndexHex.padStart(40, "0");
  for (let i = 0; i < 20; i++) {
    const hexByte = paddedHex.slice(i * 2, i * 2 + 2);
    vaultIndexBytes[i] = parseInt(hexByte, 16);
  }

  const encodedBytes = xorBytes(tokenBytes, poolManagerBytes, vaultIndexBytes);
  return ethers.utils.getAddress(ethers.utils.hexlify(encodedBytes)) as string;
}

export function hyperStableDecodeSyntheticAddressToAddress(
  syntheticAddress: string,
  poolManagerAddress: string,
  vaultIndex: number
): string {
  const encodedBytes = ethers.utils.arrayify(syntheticAddress as string);
  const poolManagerBytes = ethers.utils.arrayify(poolManagerAddress);
  const vaultIndexBytes = new Uint8Array(20);
  const vaultIndexHex = vaultIndex.toString(16);
  const paddedHex = vaultIndexHex.padStart(40, "0");
  for (let i = 0; i < 20; i++) {
    const hexByte = paddedHex.slice(i * 2, i * 2 + 2);
    vaultIndexBytes[i] = parseInt(hexByte, 16);
  }

  const decodedBytes = xorBytes(
    encodedBytes,
    poolManagerBytes,
    vaultIndexBytes
  );
  return ethers.utils.getAddress(ethers.utils.hexlify(decodedBytes));
}

export function hyperStableDecodeSyntheticAddressToVaultIndex(
  syntheticAddress: string,
  poolManagerAddress: string,
  tokenAddress: string
): number {
  const encodedBytes = ethers.utils.arrayify(syntheticAddress);
  const poolManagerBytes = ethers.utils.arrayify(poolManagerAddress);
  const tokenBytes = ethers.utils.arrayify(tokenAddress);

  const vaultIndexBytes = xorBytes(encodedBytes, poolManagerBytes, tokenBytes);
  const vaultIndexHex = ethers.utils.hexlify(vaultIndexBytes);
  return parseInt(vaultIndexHex, 16);
}

export function encodeHyperStableSyntheticAddress(
  tokenAddress: string,
  vaultIndex: number
): string {
  return hyperStableEncodeSyntheticAddress(
    HYPERSTABLE_POOL_MANAGER_CONTRACT,
    tokenAddress,
    vaultIndex
  );
}

export function decodeHyperStableSyntheticAddressToAddress(
  syntheticAddress: string,
  vaultIndex: number
): string {
  return hyperStableDecodeSyntheticAddressToAddress(
    syntheticAddress,
    HYPERSTABLE_POOL_MANAGER_CONTRACT,
    vaultIndex
  );
}

export function decodeHyperStableSyntheticAddressToVaultIndex(
  syntheticAddress: string,
  tokenAddress: string
): number {
  return hyperStableDecodeSyntheticAddressToVaultIndex(
    syntheticAddress,
    HYPERSTABLE_POOL_MANAGER_CONTRACT,
    tokenAddress
  );
}

export async function isHyperStableAllowOperator(
  user: string,
  operator: string
): Promise<boolean> {
  try {
    const provider = RouterKitManager.getProvider(999);
    const slotBase = ethers.utils.keccak256(
      ethers.utils.toUtf8Bytes("hyperstable.storage.operable")
    );

    // mapping ngoài: mapping(address => mapping(address => bool)) isAllowedOperator;
    // offset = SLOT + 1
    const outerSlot = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ["address", "uint256"],
        [user, ethers.BigNumber.from(slotBase).add(1)]
      )
    );

    // mapping trong: mapping(address => bool)
    const finalSlot = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ["address", "uint256"],
        [operator, outerSlot]
      )
    );

    // đọc giá trị lưu trong slot
    const raw = await provider.getStorageAt(
      HYPERSTABLE_POOL_MANAGER_CONTRACT,
      finalSlot
    );
    return !ethers.BigNumber.from(raw).isZero();
  } catch (error) {
    console.error("isHyperStableAllowOperator error", error);
    return false;
  }
}

export function hyperstableCreateSyntheticAddress(
  tokenAddress: string,
  vaultIndex: number
): string {
  return hyperStableEncodeSyntheticAddress(
    HYPERSTABLE_POOL_MANAGER_CONTRACT,
    tokenAddress,
    vaultIndex
  );
}
