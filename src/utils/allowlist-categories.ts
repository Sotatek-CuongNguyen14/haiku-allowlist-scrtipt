import tokens from '../resources/current-allowlist/supportedTokenContracts.json'
import collaterals from '../resources/current-allowlist/supportedCollateralContracts.json'
import varDebts from '../resources/current-allowlist/supportedVarDebtContracts.json'
import vaults from '../resources/current-allowlist/supportedVaultContracts.json'
import weightedPools from '../resources/current-allowlist/supportedWeightedLiquidityContracts.json'
import concentratedPools from '../resources/current-allowlist/supportedConcentratedLiquidityContracts.json'

export const protocolAllowlistCategories = () => {
  const collateralProtocols = new Set(
    collaterals.map((item) => item.protocol)
  )

  const varDebtProtocols = new Set(
    varDebts.map((item) => item.protocol)
  )

  const vaultProtocols = new Set(
    vaults.map((item) => item.protocol)
  )

  const weightedPoolProtocols = new Set(
    weightedPools.map((item) => item.protocol)
  )

  const concentratedPoolProtocols = new Set(
    concentratedPools.map((item) => item.protocol)
  )

  console.log("Collateral Protocols:", Array.from(collateralProtocols))
  console.log("Variable Debt Protocols:", Array.from(varDebtProtocols))
  console.log("Vault Protocols:", Array.from(vaultProtocols))
  console.log("Weighted Pool Protocols:", Array.from(weightedPoolProtocols))
  console.log("Concentrated Pool Protocols:", Array.from(concentratedPoolProtocols))

  return {
    collateralProtocols: Array.from(collateralProtocols),
    varDebtProtocols: Array.from(varDebtProtocols),
    vaultProtocols: Array.from(vaultProtocols),
    weightedPoolProtocols: Array.from(weightedPoolProtocols),
    concentratedPoolProtocols: Array.from(concentratedPoolProtocols),
  }
}