import { providers } from "ethers";
import * as core from "@mozaic-fi/intent-swapper-sdk-core";
import { mappingChainIdToRpcUrl } from './utils';

/**
 * RouterKit Singleton Manager
 * Manages RouterKit instances by chainId to avoid creating multiple instances
 * for the same chain and provider combination.
 */
class RouterKitManager {
  private static instances: Map<number, core.RouterKit> = new Map();
  private static providers: Map<number, providers.JsonRpcProvider> = new Map();

  /**
   * Get or create a RouterKit instance for the specified chainId
   * @param chainId - The chain ID
   * @param provider - Optional provider. If not provided, will create one using the chain's RPC URL
   * @returns RouterKit instance
   */
  static getInstance(
    chainId: number,
    provider?: providers.JsonRpcProvider
  ): core.RouterKit {
    // Check if we already have an instance for this chainId
    if (this.instances.has(chainId)) {
      return this.instances.get(chainId)!;
    }

    // Create provider if not provided
    let rpcProvider = provider;
    if (!rpcProvider) {
      const rpcUrl = mappingChainIdToRpcUrl[chainId];
      if (!rpcUrl) {
        throw new Error(`No RPC URL configured for chainId: ${chainId}`);
      }
      rpcProvider = new providers.StaticJsonRpcProvider(rpcUrl);
      this.providers.set(chainId, rpcProvider);
    }

    // Create new RouterKit instance
    const routerKit = new core.RouterKit(chainId, rpcProvider);
    this.instances.set(chainId, routerKit);

    return routerKit;
  }

  /**
   * Get the provider for a specific chainId
   * @param chainId - The chain ID
   * @returns JsonRpcProvider instance
   */
  static getProvider(chainId: number): providers.JsonRpcProvider {
    // Return existing provider if available
    if (this.providers.has(chainId)) {
      return this.providers.get(chainId)!;
    }

    // Create new provider
    const rpcUrl = mappingChainIdToRpcUrl[chainId];
    if (!rpcUrl) {
      throw new Error(`No RPC URL configured for chainId: ${chainId}`);
    }

    const provider = new providers.StaticJsonRpcProvider(rpcUrl);
    this.providers.set(chainId, provider);
    return provider;
  }

  /**
   * Clear all cached instances (useful for testing or memory management)
   */
  static clearInstances(): void {
    this.instances.clear();
    this.providers.clear();
  }

  /**
   * Get all cached chain IDs
   * @returns Array of chain IDs that have cached instances
   */
  static getCachedChainIds(): number[] {
    return Array.from(this.instances.keys());
  }

  /**
   * Check if an instance exists for the given chainId
   * @param chainId - The chain ID
   * @returns boolean indicating if instance exists
   */
  static hasInstance(chainId: number): boolean {
    return this.instances.has(chainId);
  }
}

export default RouterKitManager;
