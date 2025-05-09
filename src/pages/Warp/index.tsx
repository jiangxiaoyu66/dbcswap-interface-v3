import { Box, Text, Button, Input } from '@chakra-ui/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function WarpPage() {
  const [amount, setAmount] = useState('')
  const navigate = useNavigate()

  const handleWarp = () => {
    // TODO: 实现Warp逻辑
    console.log('Warp amount:', amount)
  }

  return (
    <Box maxW="600px" mx="auto" p={6}>
      <Text fontSize="2xl" fontWeight="bold" mb={6}>
        Warp
      </Text>
      
      <Box bg="gray.100" p={6} borderRadius="lg">
        <Text mb={4}>输入Warp金额</Text>
        
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="输入金额"
          mb={4}
        />

        <Button
          colorScheme="blue"
          width="100%"
          onClick={handleWarp}
        >
          Warp
        </Button>
      </Box>
    </Box>
  )
} 