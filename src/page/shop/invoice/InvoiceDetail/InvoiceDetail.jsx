import React from 'react'
import logo from '../../../../assets/images/LogoBlack.png'
import { useParams } from 'react-router-dom';

const InvoiceDetail = () => {
  const { id } = useParams();

  return (
    <div className='flex flex-col w-full h-full items-start justify-start gap-4 bg-white p-6 rounded-md'>
      <div className='flex flex-col items-center justify-start w-full'>
        <img src={logo} alt="petshop-logo" width={240} height={240} className='pr-6' />
        <h1 className='font-bold text-2xl mt-2'>INVOICE #{id}</h1>
      </div>
    </div>
  )
}

export default InvoiceDetail