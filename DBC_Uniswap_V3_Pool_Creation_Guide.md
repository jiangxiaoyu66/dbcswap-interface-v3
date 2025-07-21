# DBC Uniswap V3 流动性池创建和流动性添加完整指南

## 📋 概述

本文档提供了在 DBC 链上创建 Uniswap V3 流动性池并添加流动性的完整接入方案，支持多种技术栈和开发环境。

### ⚠️ 重要说明
- **创建池子** ≠ **添加流动性**
- 创建池子只是部署合约，池子是空的（无法交易）
- 添加流动性才能让池子正常工作
- 本文档提供三种方案：只创建池子、只添加流动性、一次性完成

### 🌐 网络信息
- **链名称**: DBC 主网
- **Chain ID**: `19880818`
- **RPC URL**: `https://rpc.dbcwallet.io`
- **区块浏览器**: 待补充

### 📍 核心合约地址
```javascript
const DBC_CONTRACTS = {
  factory: '0x34A7E09D8810d2d8620700f82b471879223F1628',
  positionManager: '0xfCE792dd602fA70143e43e7556e8a92D762bA9FC',
  multicall: '0xB6De1eDDC64aEFBCCf8B910d320ab03585E7a0a2',
  wdbc: '0xD7EA4Da7794c7d09bceab4A21a6910D9114Bc936',
  poolInitCodeHash: '0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54'
}
```

### 💰 手续费等级
```javascript
const FeeAmount = {
  LOWEST: 100,   // 0.01%
  LOW: 500,      // 0.05%
  MEDIUM: 3000,  // 0.3%
  HIGH: 10000    // 1%
}
```

---

## 🚀 方案一：使用 Uniswap SDK（推荐）

### 适用技术栈
- Node.js / JavaScript / TypeScript
- React / Vue / Angular
- Next.js / Nuxt.js
- Express / Koa

### 安装依赖
```bash
npm install @uniswap/v3-sdk @uniswap/sdk-core ethers@5.7.2
npm install @ethersproject/abi @ethersproject/solidity
npm install jsbi tiny-invariant
npm install @uniswap/v3-periphery
```

### 核心代码实现

#### 1. 配置文件
```javascript
// config.js
export const DBC_CONFIG = {
  chainId: 19880818,
  rpcUrl: 'https://rpc.dbcwallet.io',
  contracts: {
    factory: '0x34A7E09D8810d2d8620700f82b471879223F1628',
    positionManager: '0xfCE792dd602fA70143e43e7556e8a92D762bA9FC',
    poolInitCodeHash: '0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54'
  }
}

export const FeeAmount = {
  LOWEST: 100,
  LOW: 500,
  MEDIUM: 3000,
  HIGH: 10000
}
```

#### 2. 工具函数
```javascript
// utils.js
import { Token } from '@uniswap/sdk-core'
import { encodeSqrtRatioX96 } from '@uniswap/v3-sdk'
import JSBI from 'jsbi'

export function createToken(address, decimals, symbol, name) {
  return new Token(19880818, address, decimals, symbol, name)
}

export function priceToSqrtPriceX96(price, token0Decimals = 18, token1Decimals = 18) {
  const decimalAdjustment = Math.pow(10, token0Decimals - token1Decimals)
  const adjustedPrice = price * decimalAdjustment
  const priceRatio = Math.floor(adjustedPrice * 1e18)
  return encodeSqrtRatioX96(JSBI.BigInt(priceRatio), JSBI.BigInt(1e18))
}
```

#### 3. 池子创建类
```javascript
// PoolCreator.js
import { ethers } from 'ethers'
import { Pool, NonfungiblePositionManager, TickMath, computePoolAddress } from '@uniswap/v3-sdk'
import JSBI from 'jsbi'

export class PoolCreator {
  constructor(privateKey, rpcUrl = 'https://rpc.dbcwallet.io') {
    this.provider = new ethers.providers.JsonRpcProvider(rpcUrl)
    this.signer = new ethers.Wallet(privateKey, this.provider)
    
    // NonfungiblePositionManager ABI（简化版）
    const abi = [
      'function createAndInitializePoolIfNecessary(address,address,uint24,uint160) external payable returns (address)',
      'function multicall(bytes[] calldata data) external payable returns (bytes[] memory results)'
    ]
    
    this.positionManager = new ethers.Contract(
      '0xfCE792dd602fA70143e43e7556e8a92D762bA9FC',
      abi,
      this.signer
    )
  }

  async createPool(params) {
    const { token0, token1, fee, initialPrice } = params
    
    // 创建 Token 实例
    const tokenA = createToken(token0.address, token0.decimals, token0.symbol, token0.name)
    const tokenB = createToken(token1.address, token1.decimals, token1.symbol, token1.name)
    
    // 确保正确排序
    const [sortedToken0, sortedToken1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]
    const adjustedPrice = tokenA.sortsBefore(tokenB) ? initialPrice : 1 / initialPrice
    
    // 计算 sqrtPriceX96
    const sqrtPriceX96 = priceToSqrtPriceX96(adjustedPrice, sortedToken0.decimals, sortedToken1.decimals)
    
    // 创建 Pool 实例
    const pool = new Pool(
      sortedToken0, sortedToken1, fee, sqrtPriceX96,
      JSBI.BigInt(0), TickMath.getTickAtSqrtRatio(sqrtPriceX96), []
    )
    
    // 生成调用参数
    const { calldata, value } = NonfungiblePositionManager.createCallParameters(pool)
    
    // 发送交易
    const tx = await this.positionManager.multicall([calldata], { value })
    const receipt = await tx.wait()
    
    // 计算池子地址
    const poolAddress = computePoolAddress({
      factoryAddress: '0x34A7E09D8810d2d8620700f82b471879223F1628',
      tokenA: sortedToken0, tokenB: sortedToken1, fee,
      initCodeHashManualOverride: '0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54'
    })
    
    return {
      success: true,
      transactionHash: receipt.transactionHash,
      poolAddress,
      gasUsed: receipt.gasUsed.toString()
    }
  }
}
```

#### 4. 使用示例
```javascript
// example.js
import { PoolCreator } from './PoolCreator.js'
import { FeeAmount } from './config.js'

async function main() {
  const creator = new PoolCreator('your-private-key-here')
  
  const result = await creator.createPool({
    token0: {
      address: '0xYourToken0Address',
      decimals: 18,
      symbol: 'TOKEN0',
      name: 'Token 0'
    },
    token1: {
      address: '0xYourToken1Address', 
      decimals: 18,
      symbol: 'TOKEN1',
      name: 'Token 1'
    },
    fee: FeeAmount.MEDIUM, // 0.3%
    initialPrice: 100 // 1 TOKEN1 = 100 TOKEN0
  })
  
  console.log('创建结果:', result)
}

main().catch(console.error)
```

---

## 🔧 方案二：直接调用合约（通用方案）

### 适用技术栈
- 任何支持 HTTP 请求的语言
- Python / Java / Go / Rust / PHP
- 移动端 (iOS/Android)
- 其他区块链开发框架

### 核心合约方法
```solidity
function createAndInitializePoolIfNecessary(
    address token0,
    address token1, 
    uint24 fee,
    uint160 sqrtPriceX96
) external payable returns (address pool)
```

### Python 示例
```python
# requirements: web3, eth-abi
from web3 import Web3
import math

# 连接到 DBC 网络
w3 = Web3(Web3.HTTPProvider('https://rpc.dbcwallet.io'))

# 合约地址和 ABI
POSITION_MANAGER = '0xfCE792dd602fA70143e43e7556e8a92D762bA9FC'
ABI = [
    {
        "inputs": [
            {"name": "token0", "type": "address"},
            {"name": "token1", "type": "address"}, 
            {"name": "fee", "type": "uint24"},
            {"name": "sqrtPriceX96", "type": "uint160"}
        ],
        "name": "createAndInitializePoolIfNecessary",
        "outputs": [{"name": "pool", "type": "address"}],
        "type": "function"
    }
]

def calculate_sqrt_price_x96(price):
    """计算 sqrtPriceX96"""
    price_ratio = int(price * 1e18)
    sqrt_price = int(math.sqrt(price_ratio * (2**192) / 1e18))
    return sqrt_price

def create_pool(private_key, token0, token1, fee, price):
    """创建流动性池"""
    account = w3.eth.account.from_key(private_key)
    contract = w3.eth.contract(address=POSITION_MANAGER, abi=ABI)
    
    # 确保 token 地址排序
    if token0.lower() > token1.lower():
        token0, token1 = token1, token0
        price = 1 / price
    
    sqrt_price_x96 = calculate_sqrt_price_x96(price)
    
    # 构建交易
    txn = contract.functions.createAndInitializePoolIfNecessary(
        token0, token1, fee, sqrt_price_x96
    ).build_transaction({
        'from': account.address,
        'gas': 500000,
        'gasPrice': w3.eth.gas_price,
        'nonce': w3.eth.get_transaction_count(account.address)
    })
    
    # 签名并发送
    signed_txn = w3.eth.account.sign_transaction(txn, private_key)
    tx_hash = w3.eth.send_raw_transaction(signed_txn.rawTransaction)
    receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    
    return {
        'success': True,
        'transaction_hash': receipt.transactionHash.hex(),
        'gas_used': receipt.gasUsed
    }

# 使用示例
result = create_pool(
    private_key='your-private-key',
    token0='0xToken0Address',
    token1='0xToken1Address', 
    fee=3000,  # 0.3%
    price=100  # 初始价格
)
print(result)
```

### Go 示例
```go
package main

import (
    "context"
    "crypto/ecdsa"
    "math/big"
    
    "github.com/ethereum/go-ethereum/accounts/abi/bind"
    "github.com/ethereum/go-ethereum/common"
    "github.com/ethereum/go-ethereum/crypto"
    "github.com/ethereum/go-ethereum/ethclient"
)

func createPool(privateKeyHex, token0, token1 string, fee *big.Int, price float64) error {
    // 连接到 DBC 网络
    client, err := ethclient.Dial("https://rpc.dbcwallet.io")
    if err != nil {
        return err
    }
    
    // 解析私钥
    privateKey, err := crypto.HexToECDSA(privateKeyHex)
    if err != nil {
        return err
    }
    
    publicKey := privateKey.Public().(*ecdsa.PublicKey)
    fromAddress := crypto.PubkeyToAddress(*publicKey)
    
    // 获取 nonce
    nonce, err := client.PendingNonceAt(context.Background(), fromAddress)
    if err != nil {
        return err
    }
    
    // 创建交易选项
    auth := bind.NewKeyedTransactor(privateKey)
    auth.Nonce = big.NewInt(int64(nonce))
    auth.Value = big.NewInt(0)
    auth.GasLimit = uint64(500000)
    
    // 计算 sqrtPriceX96
    priceRatio := big.NewInt(int64(price * 1e18))
    sqrtPriceX96 := new(big.Int).Sqrt(new(big.Int).Mul(priceRatio, new(big.Int).Lsh(big.NewInt(1), 192)))
    sqrtPriceX96.Div(sqrtPriceX96, big.NewInt(1e9)) // 调整精度
    
    // 调用合约（这里需要生成合约绑定代码）
    // 具体实现取决于你的合约绑定方式
    
    return nil
}
```

---

## 📱 方案三：Web3 前端集成

### React 示例
```jsx
// usePoolCreator.js
import { useState } from 'react'
import { ethers } from 'ethers'

export function usePoolCreator() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  
  const createPool = async (params) => {
    setLoading(true)
    try {
      // 检查 MetaMask
      if (!window.ethereum) {
        throw new Error('请安装 MetaMask')
      }
      
      // 连接钱包
      await window.ethereum.request({ method: 'eth_requestAccounts' })
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      
      // 检查网络
      const network = await provider.getNetwork()
      if (network.chainId !== 19880818) {
        throw new Error('请切换到 DBC 网络')
      }
      
      // 合约实例
      const contract = new ethers.Contract(
        '0xfCE792dd602fA70143e43e7556e8a92D762bA9FC',
        ['function createAndInitializePoolIfNecessary(address,address,uint24,uint160) external payable'],
        signer
      )
      
      // 计算参数（简化版）
      const sqrtPriceX96 = ethers.BigNumber.from(
        Math.floor(Math.sqrt(params.price * 1e18) * Math.pow(2, 96))
      )
      
      // 发送交易
      const tx = await contract.createAndInitializePoolIfNecessary(
        params.token0,
        params.token1,
        params.fee,
        sqrtPriceX96
      )
      
      const receipt = await tx.wait()
      setResult({ success: true, hash: receipt.transactionHash })
      
    } catch (error) {
      setResult({ success: false, error: error.message })
    } finally {
      setLoading(false)
    }
  }
  
  return { createPool, loading, result }
}

// PoolCreator.jsx
export function PoolCreator() {
  const { createPool, loading, result } = usePoolCreator()
  
  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    
    createPool({
      token0: formData.get('token0'),
      token1: formData.get('token1'),
      fee: parseInt(formData.get('fee')),
      price: parseFloat(formData.get('price'))
    })
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input name="token0" placeholder="Token0 地址" required />
      <input name="token1" placeholder="Token1 地址" required />
      <select name="fee">
        <option value="500">0.05%</option>
        <option value="3000">0.3%</option>
        <option value="10000">1%</option>
      </select>
      <input name="price" type="number" placeholder="初始价格" required />
      <button type="submit" disabled={loading}>
        {loading ? '创建中...' : '创建池子'}
      </button>
      
      {result && (
        <div>
          {result.success ? (
            <p>✅ 创建成功: {result.hash}</p>
          ) : (
            <p>❌ 创建失败: {result.error}</p>
          )}
        </div>
      )}
    </form>
  )
}
```

---

## 🔍 重要参数说明

### sqrtPriceX96 计算
```javascript
// 价格转换公式
function priceToSqrtPriceX96(price) {
  // price = token1/token0 的比率
  const priceRatio = price * 1e18
  const sqrtPrice = Math.sqrt(priceRatio)
  const sqrtPriceX96 = Math.floor(sqrtPrice * Math.pow(2, 96) / 1e9)
  return sqrtPriceX96
}
```

### 代币地址排序
```javascript
// Uniswap V3 要求 token0 < token1
function sortTokens(tokenA, tokenB) {
  return tokenA.toLowerCase() < tokenB.toLowerCase() 
    ? [tokenA, tokenB] 
    : [tokenB, tokenA]
}
```

### 池子地址计算
```javascript
// 使用 CREATE2 计算池子地址
function computePoolAddress(token0, token1, fee) {
  const salt = keccak256(
    defaultAbiCoder.encode(['address', 'address', 'uint24'], [token0, token1, fee])
  )
  return getCreate2Address(
    '0x34A7E09D8810d2d8620700f82b471879223F1628', // factory
    salt,
    '0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54' // initCodeHash
  )
}
```

---

## ⚠️ 注意事项

### 安全提醒
1. **私钥安全**: 永远不要在前端代码中硬编码私钥
2. **网络验证**: 确保连接到正确的 DBC 网络
3. **地址验证**: 验证所有代币地址的有效性
4. **测试优先**: 建议先在测试网进行测试

### 常见错误
1. **代币顺序错误**: 确保 token0 < token1
2. **价格计算错误**: 注意小数位数和精度
3. **Gas 不足**: 预留足够的 Gas 费用
4. **池子已存在**: 检查池子是否已经创建

### Gas 费用估算
- 创建新池子: ~200,000 - 500,000 Gas
- 建议设置 Gas Limit: 500,000
- Gas Price: 使用网络推荐值

---

## 🧪 测试和验证

### 检查池子是否创建成功
```javascript
// 方法1: 检查合约代码
async function checkPoolExists(poolAddress) {
  const provider = new ethers.providers.JsonRpcProvider('https://rpc.dbcwallet.io')
  const code = await provider.getCode(poolAddress)
  return code !== '0x'
}

// 方法2: 调用 factory 合约
async function getPoolFromFactory(token0, token1, fee) {
  const factoryABI = ['function getPool(address,address,uint24) view returns (address)']
  const factory = new ethers.Contract('0x34A7E09D8810d2d8620700f82b471879223F1628', factoryABI, provider)
  return await factory.getPool(token0, token1, fee)
}
```

### 获取池子信息
```javascript
async function getPoolInfo(poolAddress) {
  const poolABI = [
    'function token0() view returns (address)',
    'function token1() view returns (address)',
    'function fee() view returns (uint24)',
    'function slot0() view returns (uint160,int24,uint16,uint16,uint16,uint8,bool)'
  ]

  const pool = new ethers.Contract(poolAddress, poolABI, provider)

  const [token0, token1, fee, slot0] = await Promise.all([
    pool.token0(),
    pool.token1(),
    pool.fee(),
    pool.slot0()
  ])

  return {
    token0,
    token1,
    fee,
    sqrtPriceX96: slot0[0],
    tick: slot0[1],
    liquidity: slot0[2]
  }
}
```

---

## 🔧 故障排除

### 常见错误及解决方案

#### 1. "Pool already exists" 错误
```javascript
// 解决方案：检查池子是否已存在
const poolAddress = computePoolAddress(token0, token1, fee)
const exists = await checkPoolExists(poolAddress)
if (exists) {
  console.log('池子已存在，地址:', poolAddress)
  return { success: true, poolAddress, existed: true }
}
```

#### 2. "Invalid token order" 错误
```javascript
// 解决方案：确保正确排序
function sortTokens(tokenA, tokenB, priceA2B) {
  if (tokenA.toLowerCase() < tokenB.toLowerCase()) {
    return { token0: tokenA, token1: tokenB, price: priceA2B }
  } else {
    return { token0: tokenB, token1: tokenA, price: 1 / priceA2B }
  }
}
```

#### 3. Gas 估算失败
```javascript
// 解决方案：手动设置 Gas
const gasLimit = 500000 // 固定 Gas Limit
const gasPrice = await provider.getGasPrice()

const tx = await contract.createAndInitializePoolIfNecessary(
  token0, token1, fee, sqrtPriceX96,
  { gasLimit, gasPrice: gasPrice.mul(110).div(100) } // 增加 10% Gas Price
)
```

#### 4. 网络连接问题
```javascript
// 解决方案：添加重试机制
async function createPoolWithRetry(params, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await createPool(params)
    } catch (error) {
      if (i === maxRetries - 1) throw error
      console.log(`重试 ${i + 1}/${maxRetries}:`, error.message)
      await new Promise(resolve => setTimeout(resolve, 2000)) // 等待 2 秒
    }
  }
}
```

---

## 📊 完整示例项目

### 项目结构
```
pool-creator/
├── package.json
├── .env.example
├── src/
│   ├── config.js
│   ├── utils.js
│   ├── PoolCreator.js
│   ├── validator.js
│   └── examples/
│       ├── basic.js
│       ├── batch.js
│       └── frontend.html
└── README.md
```

### package.json
```json
{
  "name": "dbc-pool-creator",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node src/examples/basic.js",
    "batch": "node src/examples/batch.js"
  },
  "dependencies": {
    "@uniswap/v3-sdk": "^3.10.0",
    "@uniswap/sdk-core": "^4.2.0",
    "ethers": "^5.7.2",
    "dotenv": "^16.0.0"
  }
}
```

### 环境变量示例
```bash
# .env.example
PRIVATE_KEY=your_private_key_here
RPC_URL=https://rpc.dbcwallet.io
TOKEN0_ADDRESS=0x...
TOKEN1_ADDRESS=0x...
INITIAL_PRICE=100
FEE_TIER=3000
```

### 批量创建示例
```javascript
// src/examples/batch.js
import { PoolCreator } from '../PoolCreator.js'
import { FeeAmount } from '../config.js'

const pools = [
  {
    token0: { address: '0x...', decimals: 18, symbol: 'USDT', name: 'Tether USD' },
    token1: { address: '0x...', decimals: 18, symbol: 'USDC', name: 'USD Coin' },
    fee: FeeAmount.LOW,
    initialPrice: 1.0
  },
  {
    token0: { address: '0x...', decimals: 18, symbol: 'WDBC', name: 'Wrapped DBC' },
    token1: { address: '0x...', decimals: 18, symbol: 'USDT', name: 'Tether USD' },
    fee: FeeAmount.MEDIUM,
    initialPrice: 0.1
  }
]

async function batchCreatePools() {
  const creator = new PoolCreator(process.env.PRIVATE_KEY)

  for (const pool of pools) {
    console.log(`创建池子: ${pool.token0.symbol}/${pool.token1.symbol}`)

    try {
      const result = await creator.createPool(pool)
      if (result.success) {
        console.log(`✅ 成功: ${result.poolAddress}`)
      } else {
        console.log(`❌ 失败: ${result.error}`)
      }
    } catch (error) {
      console.log(`❌ 异常: ${error.message}`)
    }

    // 等待 5 秒再创建下一个
    await new Promise(resolve => setTimeout(resolve, 5000))
  }
}

batchCreatePools().catch(console.error)
```

---

## 🌐 多链支持

### 配置不同网络
```javascript
// networks.js
export const NETWORKS = {
  DBC_MAINNET: {
    chainId: 19880818,
    rpcUrl: 'https://rpc.dbcwallet.io',
    contracts: {
      factory: '0x34A7E09D8810d2d8620700f82b471879223F1628',
      positionManager: '0xfCE792dd602fA70143e43e7556e8a92D762bA9FC'
    }
  },
  DBC_TESTNET: {
    chainId: 19850818,
    rpcUrl: 'https://rpc-testnet.dbcwallet.io',
    contracts: {
      factory: '0xAc2366109dA0B0aFd28ecC2d2FE171c78594d113',
      positionManager: '0xdc8748C1e8d93aBE88B7B77AED4fEb0bAb4fACCE'
    }
  }
}

// 使用示例
const creator = new PoolCreator(privateKey, NETWORKS.DBC_TESTNET)
```

---

## 📞 技术支持

### 问题反馈
如有技术问题，请提供以下信息：
1. **技术栈**: 使用的编程语言和框架版本
2. **错误信息**: 完整的错误堆栈信息
3. **交易信息**: 交易哈希、Gas 使用情况
4. **参数信息**: 代币地址、手续费、初始价格
5. **网络信息**: 使用的 RPC 节点和网络状态

### 联系方式
- 技术文档: [链接待补充]
- 开发者社区: [链接待补充]
- 问题反馈: [链接待补充]

---

## 📚 相关资源

### 官方文档
- [Uniswap V3 协议文档](https://docs.uniswap.org/protocol/V3/introduction)
- [Uniswap V3 SDK 文档](https://docs.uniswap.org/sdk/v3/overview)

### 开发工具
- [Ethers.js 文档](https://docs.ethers.io/)
- [Web3.py 文档](https://web3py.readthedocs.io/)
- [Hardhat 开发框架](https://hardhat.org/)

### 代码示例
- [Uniswap V3 示例代码](https://github.com/Uniswap/examples)
- [池子创建示例](https://github.com/Uniswap/v3-periphery)

---

## 📄 许可证

本文档基于 MIT 许可证开源，可自由使用和修改。

---

*最后更新: 2024年12月*
*版本: v1.0.0*
