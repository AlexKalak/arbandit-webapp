'use client'

import V3PoolPage from "@/src/features/tradingInfo/ui/v3pools/V3PoolPage"
import { useParams } from "next/navigation"

const PoolPage = () => {
  const { address } = useParams<{ address: string }>()

  return (
    <div>
      {
        //FIX: chainId
      }
      <V3PoolPage address={address} chainID={1} />
    </div>
  )

}

export default PoolPage
