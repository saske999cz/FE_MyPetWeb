import React, { useEffect, useState } from 'react'
import logo from '../../../../assets/images/LogoBlack.png'
import { Link, useParams } from 'react-router-dom';
import AuthUser from '../../../../utils/AuthUser';
import { useAuth } from '../../../../utils/AuthContext';
import { getDownloadURL, listAll, ref } from 'firebase/storage';
import { storage } from '../../../../utils/firebase';
import { BeatLoader } from 'react-spinners';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Divider, Table, Tooltip } from 'antd';
import { FaBarsProgress, FaFileInvoiceDollar, FaMedal, FaStar, FaUser } from 'react-icons/fa6';
import { format } from 'date-fns';
import Column from 'antd/es/table/Column';
import loadingImg from '../../../../assets/images/loading.png'
import paypalLogo from '../../../../assets/images/paypal_logo.png'
import codLogo from '../../../../assets/images/cod_logo.png'
import currency from '../../../../utils/currency';
import getOrderStatus from '../../../../utils/orderStatus';
import { BiSolidCategoryAlt } from 'react-icons/bi';
import { IoPricetag } from 'react-icons/io5';


const InvoiceDetail = () => {
  const { id } = useParams();
  const { http } = AuthUser()
  const { accessToken } = useAuth()

  const [loading, setLoading] = useState(true)

  const COD_PAYMENT_METHOD = 'COD'
  const PAYPAL_PAYMENT_METHOD = 'Paypal'

  const [invoice, setInvoice] = useState({})
  const [totalCartItems, setTotalCartItems] = useState()

  // --------------------------     Fetch Product Images API     --------------------------
  const fetchProductImages = async (cartItems) => {
    const promises = cartItems.map(async (item) => {
      try {
        const imageRef = ref(storage, item.product_image);
        const response = await listAll(imageRef);
        const urls = await Promise.all(
          response.items.map((imageItem) => getDownloadURL(imageItem))
        );
        if (urls.length > 0) {
          item.image_url = urls[0]; // Gán URL của ảnh đầu tiên vào field image_url
        }
      } catch (error) {
        console.log(error);
      }
    });

    try {
      await Promise.all(promises);
    } catch (error) {
      console.log(error);
    }
  };

  // --------------------------     Fetch Avatar API     --------------------------
  const fetchAvatar = async (avatarPath) => {
    try {
      const avatarRef = ref(storage, avatarPath);
      const url = await getDownloadURL(avatarRef);
      return url;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  // --------------------------     Fetch Rating Detail API     --------------------------
  useEffect(() => {
    const fetchInvoiceDetail = async () => {
      try {
        const response = await http.get(`shop/sub-orders/${id}`)
        const invoiceData = response.data.data
        await fetchProductImages(invoiceData.cart_items);
        const avatarUrl = await fetchAvatar(invoiceData.sub_order.avatar);
        setInvoice({
          ...invoiceData,
          sub_order: {
            ...invoiceData.sub_order,
            avatar_url: avatarUrl,
          },
        });
        setTotalCartItems(invoiceData.cart_items.length)
        console.log(invoiceData)
        setLoading(false)
      } catch (error) {
        console.log(error)
      }
    }

    fetchInvoiceDetail()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken])

  if (loading) {
    return (
      <div className='h-full'>
        <BeatLoader className='relative top-1/2 transform -translate-y-1/2' color="#2463eb" size={36} />
      </div>
    )
  }

  return (
    <div className='flex flex-col w-full items-start justify-start gap-4 bg-white p-6 rounded-md'>
      <div className='flex flex-col items-center justify-start w-full'>
        <img src={logo} alt="petshop-logo" width={240} height={240} className='pr-6' />
        <div className='flex items-center gap-2 mt-3'>
          <IoPricetag size={20} />
          <h1 className='font-bold text-2xl'>INVOICE   #{invoice?.sub_order.id}</h1>
        </div>
      </div>
      <div className='flex items-center gap-10 w-full'>
        <div className='flex flex-col justify-start items-center ml-5 py-4 min-w-[14%]'>
          <div className='left-top'>
            <LazyLoadImage
              key={invoice?.sub_order.avatar_url}
              src={invoice?.sub_order.avatar_url}
              alt='avatar-customer'
              effect="blur"
              placeholderSrc={loading}
            />
            <p
              className='text-xl font-semibold mt-1 mb-2 transition duration-200 hover:cursor-pointer hover:text-blue-500'>
              {invoice?.sub_order.full_name}
            </p>
          </div>
          <div className='flex flex-col justify-start items-start w-full gap-1'>
            <div className='flex flex-row justify-start items-center gap-3'>
              <Tooltip title="Joined Date">
                <FaUser />
              </Tooltip>
              <p>{format(new Date(invoice?.sub_order.account_creation_date), 'dd-MM-yyyy')}</p>
            </div>
            <div className='flex flex-row justify-start items-center gap-3'>
              <Tooltip title="Total Rating">
                <FaStar />
              </Tooltip>
              <p>{invoice?.sub_order.rating_count}</p>
            </div>
            <div className='flex flex-row justify-start items-center gap-3'>
              <Tooltip title="Ranking Point">
                <FaMedal />
              </Tooltip>
              <p>{invoice?.sub_order.ranking_point}</p>
            </div>
          </div>
        </div>
        <div className='w-full'>
          <Table
            bordered
            dataSource={invoice?.cart_items}
            pagination={{
              defaultCurrent: 1,
              defaultPageSize: 8,
              hideOnSinglePage: true,
            }}
          >
            <Column
              align='left'
              title='No.'
              key='no.'
              render={(text, record, index) => (
                <span className='font-semibold'>{index + 1}</span>
              )}
            />
            <Column
              align='left'
              title='ID'
              key='index'
              dataIndex='product_id'
              render={(text, _) => {
                return (
                  <Link to={`/dashboard/product-view/${text}`} className='font-semibold text-blue-500'>
                    <span>#{text}</span>
                  </Link>
                )
              }}
            />
            <Column
              align='left'
              title='Product Name'
              key='name'
              dataIndex='name'
              render={(text, record, index) => {
                return (
                  <div className='flex flex-row items-center gap-3'>
                    <LazyLoadImage
                      key={index}
                      src={record.image_url}
                      alt={`Product ${index}`}
                      className='w-10 h-10 bg-white border-neutral-300 border-2 rounded-md p-1 object-cover'
                      effect='blur'
                      placeholderSrc={loadingImg}
                    />
                    <span className='font-semibold'>{text}</span>
                  </div>
                )
              }}
            />
            <Column
              align='left'
              title='Price'
              key='price'
              dataIndex='price'
              render={(text, _) => <span className='font-semibold'>{currency(text)}</span>}
            />
            <Column
              align='left'
              title='Quantity'
              key='quantity'
              dataIndex='quantity'
              render={(text, _) => <span>{text}</span>}
            />
            <Column
              align='left'
              title='Amount'
              key='amount'
              dataIndex='amount'
              render={(text, _) => <span className='font-semibold'>{(currency(text))}</span>}
            />
          </Table>
          <p className='text-[18px] font-semibold text-right mt-4 mr-8 text-gray-600'>{`Total ${totalCartItems == 1 ? `${totalCartItems} product` : `${totalCartItems} products`}`}</p>
          <Divider style={{borderTop: '1px solid #ccc'}} />
          <div className='flex flex-col items-end justify-start gap-2'>
            <div className='flex flex-row justify-between my-1 ml-4 mr-8'>
              <div className='flex flex-row gap-3 items-center justify-start w-48'>
                <FaFileInvoiceDollar size={20} />
                <p className='text-gray-800 text-md font-semibold'>Total</p>
              </div>
              <div className='text-gray-800 text-md font-semibold'>:</div>
              <div className='ml-8 text-black text-md font-normal w-32 text-end'>
                <p className='text-[18px] font-semibold'>{currency(invoice?.sub_order.sub_total_prices)}</p>
              </div>
            </div>
            <div className='flex flex-row justify-between my-1 ml-4 mr-8'>
              <div className='flex flex-row gap-3 items-center justify-start w-48'>
                <FaFileInvoiceDollar size={20} />
                <p className='text-gray-800 text-md font-semibold'>Payment Method</p>
              </div>
              <div className='text-gray-800 text-md font-semibold'>:</div>
              <div className='ml-8 text-black text-md font-normal w-32'>
                <div className='flex items-center gap-2 justify-end'>
                  {(() => {
                    if (invoice?.sub_order.payment_method === COD_PAYMENT_METHOD) {
                      return <img src={codLogo} width={40} height={40} alt="payment-method-logo" />
                    } else if (invoice?.sub_order.payment_method === PAYPAL_PAYMENT_METHOD) {
                      return <img src={paypalLogo} width={40} height={40} alt="payment-method-logo" />
                    }
                  })()}
                  <span className='font-normal text-[14px]'>{invoice?.sub_order.payment_method}</span>
                </div>
              </div>
            </div>
            <div className='flex flex-row justify-between my-1 ml-4 mr-8'>
              <div className='flex flex-row gap-3 items-center justify-start w-48'>
                <FaBarsProgress size={20} />
                <p className='text-gray-800 text-md font-semibold'>Status</p>
              </div>
              <div className='text-gray-800 text-md font-semibold'>:</div>
              <div className='ml-8 text-gray-600 text-md font-normal w-32 text-end'>
                {getOrderStatus(invoice?.sub_order.status)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InvoiceDetail