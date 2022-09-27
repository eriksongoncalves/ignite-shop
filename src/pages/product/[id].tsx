import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import Image from 'next/future/image'
import Stripe from 'stripe'

import * as S from 'styles/pages/product'
import { stripe } from 'lib/stripe'
import { formatPrice } from 'utils/format-price'

type Product = {
  id: string
  name: string
  imageUrl: string
  price: string
  description: string
}

type ProductDetailProps = {
  product: Product
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const { isFallback } = useRouter()

  if (isFallback) {
    return <p>Loading...</p>
  }

  return (
    <S.ProductContainer>
      <S.ImageContainer>
        <Image
          src={product.imageUrl}
          width="520"
          height={480}
          alt={product.name}
        />
      </S.ImageContainer>

      <S.ProductDetail>
        <h1>{product.name}</h1>

        <span>{product.price}</span>

        <p>{product.description}</p>

        <button>Comprar agora</button>
      </S.ProductDetail>
    </S.ProductContainer>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [{ params: { id: 'prod_MVOtj2Oe91Yu2B' } }],
    fallback: true
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getStaticProps: GetStaticProps<any, { id: string }> = async ({
  params
}) => {
  const productId = params!.id

  const product = await stripe.products.retrieve(productId, {
    expand: ['default_price']
  })

  const defaultPrice = product.default_price as Stripe.Price
  const price = defaultPrice?.unit_amount ? defaultPrice.unit_amount / 100 : 0

  return {
    props: {
      product: {
        id: product.id,
        name: product.name,
        imageUrl: product.images.length > 0 ? product.images[0] : null,
        price: formatPrice(price),
        description: product.description
      }
    },
    revalidate: 60 * 60 * 1 // 1 hour
  }
}
