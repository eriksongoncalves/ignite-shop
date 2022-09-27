import { GetStaticProps } from 'next'
import Image from 'next/future/image'
import Link from 'next/link'
import Stripe from 'stripe'
import { useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'

import { stripe } from 'lib/stripe'
import * as S from 'styles/pages/home'
import { formatPrice } from 'utils/format-price'

type Product = {
  id: string
  name: string
  imageUrl: string
  price: string
}

type HomeProps = {
  products: Product[]
}

export default function Home({ products }: HomeProps) {
  const [sliderRef] = useKeenSlider({
    slides: {
      perView: 3,
      spacing: 48
    }
  })

  return (
    <S.HomeContainer ref={sliderRef} className="keen-slider">
      {products.map(product => (
        <Link
          href={`/product/${product.id}`}
          key={product.id}
          passHref
          prefetch={false}
        >
          <S.Product className="keen-slider__slide">
            <Image
              src={product.imageUrl}
              width="520"
              height={480}
              alt={product.name}
            />

            <footer>
              <strong>{product.name}</strong>
              <span>{product.price}</span>
            </footer>
          </S.Product>
        </Link>
      ))}
    </S.HomeContainer>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const response = await stripe.products.list({
    expand: ['data.default_price']
  })

  const products = response.data
    .filter(product => product.active)
    .map(product => {
      const defaultPrice = product.default_price as Stripe.Price
      const price = defaultPrice?.unit_amount
        ? defaultPrice.unit_amount / 100
        : 0

      return {
        id: product.id,
        name: product.name,
        imageUrl: product.images.length > 0 ? product.images[0] : null,
        price: formatPrice(price)
      }
    })

  return {
    props: { products },
    revalidate: 60 * 60 * 2 // 2 hours
  }
}
