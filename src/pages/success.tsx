import { GetServerSideProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { stripe } from 'lib/stripe'
import Image from 'next/future/image'

import * as S from 'styles/pages/success'
import Stripe from 'stripe'

type SuccessProps = {
  customerName: string
  product: {
    name: string
    imageUrl: string
  }
}

export default function Success({ customerName, product }: SuccessProps) {
  return (
    <>
      <Head>
        <title>Compra efetuada | Ignite Shop</title>
        <meta name="robots" content="noindex" />
      </Head>

      <S.SuccessContainer>
        <h1>Compra Efetuada</h1>

        <S.ImageContainer>
          <Image
            src={product.imageUrl}
            width={120}
            height={110}
            alt={product.name}
          />
        </S.ImageContainer>

        <p>
          Uhuul <strong>{customerName}</strong>, sua{' '}
          <strong>{product.name}</strong> já está a caminho da sua casa.
        </p>

        <Link href="/" passHref>
          <a>Voltar ao catalogo</a>
        </Link>
      </S.SuccessContainer>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  { session_id: string }
> = async ({ query }) => {
  const sessionId = query?.session_id

  if (!sessionId) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  const session = await stripe.checkout.sessions.retrieve(String(sessionId), {
    expand: ['line_items', 'line_items.data.price.product']
  })

  const customerName = session!.customer_details?.name || ''
  const product = session.line_items!.data[0].price!.product as Stripe.Product

  return {
    props: {
      customerName,
      product: {
        name: product.name,
        imageUrl: product.images[0]
      }
    }
  }
}
