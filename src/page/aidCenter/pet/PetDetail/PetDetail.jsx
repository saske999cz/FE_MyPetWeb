import React, { useEffect, useState } from 'react';
import { Divider } from 'antd';
import { BiSolidCategoryAlt, BiSolidCommentDetail } from "react-icons/bi";
import { MdPublishedWithChanges, MdSell, MdOutlineUpdate, MdOutlinePets, MdBloodtype, MdEmail } from "react-icons/md";
import { PiGenderFemaleFill, PiGenderMaleFill } from "react-icons/pi";
import loadingImg from '../../../../assets/images/loading.png'
import './PetDetail.scss';
import { useParams } from 'react-router-dom';
import AuthUser from '../../../../utils/AuthUser';
import currency from '../../../../utils/currency';
import { format } from 'date-fns';
import { BeatLoader } from 'react-spinners'
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../../../../utils/firebase';
import { useAuth } from '../../../../utils/AuthContext';
import { FaDog, FaPhone, FaUser } from 'react-icons/fa6';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const PetDetail = () => {
  const { id } = useParams();

  const [pet, setPet] = useState({});
  const [loading, setLoading] = useState(true);
  const { http } = AuthUser();
  const { accessToken } = useAuth();

  // --------------------------     Fetch Pet API     --------------------------
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await http.get(`aid-center/pets/${id}`)
        const petData = response.data.data

        const imageRef = ref(storage, petData.image)
        const imageUrl = await getDownloadURL(imageRef)

        if (petData.customer) {
          const customerRef = ref(storage, petData.customer.avatar)
          const customerUrl = await getDownloadURL(ref(storage, customerRef))
          setPet({
            ...petData,
            image_url: imageUrl,
            customer_url: customerUrl
          })
        } else {
          setPet({
            ...petData,
            image_url: imageUrl
          })
        }

        setLoading(false)
      } catch (error) {
        console.log(error)
      }
    }

    fetchProduct()
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
    <div className='flex flex-col gap-4 justify-center p-4' style={{ background: '#fbfbfb' }}>
      <div className='flex flex-row items-start gap-8'>
        {/* Left Item */}
        <div className='flex flex-col items-start gap-4 max-w-[27%]'>
          <Divider orientation='left' orientationMargin={0}>
            <span className='text-gray-800 font-bold text-md'>Pet Gallery</span>
          </Divider>
          <div>
            <img
              className='w-96 h-96 p-2 border-2 border-gray-300 border-dashed bg-cover rounded-md transition-all duration-300 ease-in-out object-cover'
              src={pet.image_url}
              alt="product"
            />
          </div>
        </div>
        {pet.customer ? (
          <>
            {/* Middle Item */}
            <div className='flex flex-col flex-1 items-start'>
              <Divider style={{ color: 'red' }} orientation='left' orientationMargin={0}>
                <span className='text-gray-800 font-bold text-md'>Pet Details</span>
              </Divider>
              <div className='flex flex-col gap-2 w-full'>
                <p className='text-gray-800 text-2xl my-4 ml-4 mr-8 text-start font-semibold'>{pet.name}</p>
                <div className='flex flex-row justify-start my-1 ml-4 mr-8'>
                  <div className='flex flex-row gap-3 items-center w-40'>
                    <MdOutlinePets />
                    <p className='text-gray-800 text-md font-semibold'>Age</p>
                  </div>
                  <div className='text-gray-800 text-md font-semibold'>:</div>
                  <div className='ml-8 text-gray-600 text-md font-normal'>
                    <p>{currency(pet.age)} years</p>
                  </div>
                </div>
                <div className='flex flex-row justify-start my-1 ml-4 mr-8'>
                  <div className='flex flex-row gap-3 items-center w-40'>
                    {pet.gender === 'male' ? <PiGenderMaleFill /> : <PiGenderFemaleFill />}
                    <p className='text-gray-800 text-md font-semibold'>Gender</p>
                  </div>
                  <div className='text-gray-800 text-md font-semibold'>:</div>
                  <div className='ml-8 text-gray-600 text-md font-normal'>
                    <p>{pet.gender}</p>
                  </div>
                </div>
                <div className='flex flex-row justify-start my-1 ml-4 mr-8'>
                  <div className='flex flex-row gap-3 items-center w-40'>
                    <FaDog />
                    <p className='text-gray-800 text-md font-semibold'>Breed</p>
                  </div>
                  <div className='text-gray-800 text-md font-semibold'>:</div>
                  <div className='ml-8 text-gray-600 text-md font-normal'>
                    <p>{pet.breed.name}</p>
                  </div>
                </div>
                <div className='flex flex-row justify-start my-1 ml-4 mr-8'>
                  <div className='flex flex-row gap-3 items-center w-40'>
                    <MdBloodtype />
                    <p className='text-gray-800 text-md font-semibold'>Purebred</p>
                  </div>
                  <div className='text-gray-800 text-md font-semibold'>:</div>
                  <div className='ml-8 text-gray-600 text-md font-normal'>
                    <p>{pet.is_purebred ? 'Yes' : 'No'}</p>
                  </div>
                </div>
                <div className='flex flex-row justify-start my-1 ml-4 mr-8'>
                  <div className='flex flex-row gap-3 items-center w-40'>
                    <MdPublishedWithChanges />
                    <p className='text-gray-800 text-md font-semibold'>Created</p>
                  </div>
                  <div className='text-gray-800 text-md font-semibold'>:</div>
                  <div className='ml-8 text-gray-600 text-md font-normal'>
                    <p>{format(new Date(pet.created_at), 'dd-MM-yyyy')}</p>
                  </div>
                </div>
                <div className='flex flex-row justify-start my-1 ml-4 mr-8'>
                  <div className='flex flex-row gap-3 items-center w-40'>
                    <MdOutlineUpdate />
                    <p className='text-gray-800 text-md font-semibold text-start'>Last Updated</p>
                  </div>
                  <div className='text-gray-800 text-md font-semibold'>:</div>
                  <div className='ml-8 text-gray-600 text-md font-normal'>
                    <p>{format(new Date(pet.updated_at), 'dd-MM-yyyy')}</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Right Item */}
            <div className='flex flex-col flex-1 items-start'>
              <Divider style={{ color: 'red' }} orientation='left' orientationMargin={0}>
                <span className='text-gray-800 font-bold text-md'>Customer Info</span>
              </Divider>
              <div className='flex flex-col justify-start items-center ml-5 py-4 min-w-[14%]'>
                <div className='left-top'>
                  <LazyLoadImage
                    key={pet?.customer_url}
                    src={pet?.customer_url}
                    alt='avatar-customer'
                    effect="blur"
                    placeholderSrc={loadingImg}
                  />
                  <p
                    className='text-xl font-semibold mt-1 mb-2 transition duration-200 hover:cursor-pointer hover:text-blue-500'>
                    {pet?.customer.full_name}
                  </p>
                </div>
                <div className='flex flex-col justify-start items-start w-full gap-1'>
                  <div className='flex flex-row justify-start items-center gap-3'>
                    <FaUser />
                    <p>{pet?.customer.username}</p>
                  </div>
                  <div className='flex flex-row justify-start items-center gap-3'>
                    <FaPhone />
                    <p>{pet?.customer.phone}</p>
                  </div>
                  <div className='flex flex-row justify-start items-center gap-3'>
                    <MdEmail />
                    <p>{pet?.customer.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className='flex flex-col flex-1 items-start'>
            <Divider style={{ color: 'red' }} orientation='left' orientationMargin={0}>
              <span className='text-gray-800 font-bold text-md'>Pet Details</span>
            </Divider>
            <div className='flex flex-col gap-2 w-full'>
              <p className='text-gray-800 text-2xl my-4 ml-4 mr-8 text-start font-semibold'>{pet.name}</p>
              <div className='flex flex-row justify-start my-1 ml-4 mr-8'>
                <div className='flex flex-row gap-3 items-center w-40'>
                  <MdOutlinePets />
                  <p className='text-gray-800 text-md font-semibold'>Age</p>
                </div>
                <div className='text-gray-800 text-md font-semibold'>:</div>
                <div className='ml-8 text-gray-600 text-md font-normal'>
                  <p>{currency(pet.age)} years</p>
                </div>
              </div>
              <div className='flex flex-row justify-start my-1 ml-4 mr-8'>
                <div className='flex flex-row gap-3 items-center w-40'>
                  {pet.gender === 'male' ? <PiGenderMaleFill /> : <PiGenderFemaleFill />}
                  <p className='text-gray-800 text-md font-semibold'>Gender</p>
                </div>
                <div className='text-gray-800 text-md font-semibold'>:</div>
                <div className='ml-8 text-gray-600 text-md font-normal'>
                  <p>{pet.gender}</p>
                </div>
              </div>
              <div className='flex flex-row justify-start my-1 ml-4 mr-8'>
                <div className='flex flex-row gap-3 items-center w-40'>
                  <FaDog />
                  <p className='text-gray-800 text-md font-semibold'>Breed</p>
                </div>
                <div className='text-gray-800 text-md font-semibold'>:</div>
                <div className='ml-8 text-gray-600 text-md font-normal'>
                  <p>{pet.breed.name}</p>
                </div>
              </div>
              <div className='flex flex-row justify-start my-1 ml-4 mr-8'>
                <div className='flex flex-row gap-3 items-center w-40'>
                  <MdBloodtype />
                  <p className='text-gray-800 text-md font-semibold'>Purebred</p>
                </div>
                <div className='text-gray-800 text-md font-semibold'>:</div>
                <div className='ml-8 text-gray-600 text-md font-normal'>
                  <p>{pet.is_purebred ? 'Yes' : 'No'}</p>
                </div>
              </div>
              <div className='flex flex-row justify-start my-1 ml-4 mr-8'>
                <div className='flex flex-row gap-3 items-center w-40'>
                  <MdPublishedWithChanges />
                  <p className='text-gray-800 text-md font-semibold'>Created</p>
                </div>
                <div className='text-gray-800 text-md font-semibold'>:</div>
                <div className='ml-8 text-gray-600 text-md font-normal'>
                  <p>{format(new Date(pet.created_at), 'dd-MM-yyyy')}</p>
                </div>
              </div>
              <div className='flex flex-row justify-start my-1 ml-4 mr-8'>
                <div className='flex flex-row gap-3 items-center w-40'>
                  <MdOutlineUpdate />
                  <p className='text-gray-800 text-md font-semibold text-start'>Last Updated</p>
                </div>
                <div className='text-gray-800 text-md font-semibold'>:</div>
                <div className='ml-8 text-gray-600 text-md font-normal'>
                  <p>{format(new Date(pet.updated_at), 'dd-MM-yyyy')}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className='mt-4'>
        <Divider orientation='left' orientationMargin={0}>
          <span className='text-gray-800 font-bold text-md'>Pet Description</span>
        </Divider>
        <p className='text-gray-600 m-6 text-justify'>{pet.description}</p>
      </div>
    </div>
  );
}

export default PetDetail;
