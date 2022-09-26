import Image from 'next/future/image'
import { HomeContainer, Product } from 'styles/pages/home'

import imgShirt1 from 'assets/shirts/shirt-1.png'
import imgShirt2 from 'assets/shirts/shirt-2.png'
// import imgShirt3 from 'assets/shirts/shirt-3.png'

export default function Home() {
  return (
    <HomeContainer>
      <Product>
        <Image src={imgShirt1} width="520" height={480} alt="" />

        <footer>
          <strong>Camiseta X</strong>
          <span>R$ 79,90</span>
        </footer>
      </Product>

      <Product>
        <Image src={imgShirt2} width="520" height={480} alt="" />

        <footer>
          <strong>Camiseta X</strong>
          <span>R$ 79,90</span>
        </footer>
      </Product>

      {/* <Product>
        <Image src={imgShirt3} width="520" height={480} alt="" />

        <footer>
          <strong>Camiseta X</strong>
          <span>R$ 79,90</span>
        </footer>
      </Product> */}
    </HomeContainer>
  )
}
