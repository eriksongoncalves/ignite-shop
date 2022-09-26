import { useRouter } from 'next/router'

export default function ProductDetail() {
  const { query } = useRouter()
  const productId = query.id

  return <h1>ProductDetail - {productId}</h1>
}
