import Image from 'next/future/image'
import { useKeenSlider } from 'keen-slider/react'
import { GetStaticProps } from 'next'
import Stripe from 'stripe'
import 'keen-slider/keen-slider.min.css'

import { stripe } from 'lib/stripe'
import { HomeContainer, Product } from 'styles/pages/home'
import { formatPrice } from 'utils/format-price'

type Products = {
  id: string
  name: string
  imageUrl: string
  price: number
}

type HomeProps = {
  products: Products[]
}

export default function Home({ products }: HomeProps) {
  const [sliderRef] = useKeenSlider({
    slides: {
      perView: 3,
      spacing: 48
    }
  })

  return (
    <HomeContainer ref={sliderRef} className="keen-slider">
      {products.map(product => (
        <Product key={product.id} className="keen-slider__slide">
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
        </Product>
      ))}
    </HomeContainer>
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
