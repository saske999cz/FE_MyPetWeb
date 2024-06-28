import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import AuthUser from '../../../../utils/AuthUser';
import { useAuth } from '../../../../utils/AuthContext';
import { getDownloadURL, listAll, ref } from 'firebase/storage';
import { storage } from '../../../../utils/firebase';
import { BeatLoader } from 'react-spinners';
import { Divider } from 'antd';
import { BiSolidCommentDetail } from 'react-icons/bi';
import { FaLink, FaPhone, FaUser } from 'react-icons/fa6';
import { format } from 'date-fns';
import { MdEmail, MdLocationPin, MdOutlineUpdate } from 'react-icons/md';
import { IoTime } from 'react-icons/io5';
import { IoIosBusiness } from "react-icons/io";
import { AiOutlineGlobal } from 'react-icons/ai';
import { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete';
import Map from '../../../../components/Map';

const AdminAidCenterDetail = () => {
  const { http } = AuthUser();
  const { id } = useParams();
  const { accessToken } = useAuth();

  const [aidCenter, setAidCenter] = useState({})
  const [loading, setLoading] = useState(true)

  // Fetch list image state
  const [imageList, setImageList] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");

  const [location, setLocation] = useState('');

  const [coords, setCoords] = useState({ lat: 0, lng: 0 })

  // Get aid center address location
  useEffect(() => {
    const getCoords = async () => {
      if (loading) {
        try {
          console.log(location);
          const results = await geocodeByAddress(location);
          console.log(results);
          const latLng = await getLatLng(results[0]);
          setCoords(latLng);
        } catch (error) {
          console.log(error);
        }
      }
    };

    getCoords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  // --------------------------     Get Aid Center Detail     --------------------------
  useEffect(() => {
    const fetchAidCenter = async () => {
      try {
        const response = await http.get(`/admin/aid-centers/${id}`)
        const aidCenterData = response.data.data
        setAidCenter(aidCenterData)
        setLocation(aidCenterData.address)

        if (aidCenterData.certificate) {
          const certificateRef = ref(storage, aidCenterData.certificate)
          const certificateUrl = await getDownloadURL(certificateRef)
          setAidCenter({
            ...aidCenterData,
            certificate_url: certificateUrl
          })
        }

        return aidCenterData.image
      } catch (error) {
        console.log(error)
      }
    }

    const fetchAidCenterImages = async (imagePath) => {
      let fetchedImages = []
      try {
        const imageRef = ref(storage, imagePath)
        const response = await listAll(imageRef)
        const promises = response.items.map(async (item) => {
          try {
            const url = await getDownloadURL(item)
            fetchedImages.push(url)
          } catch (error) {
            console.log(error)
          }
        })

        await Promise.all(promises)
        setImageList(fetchedImages)
        setSelectedImage(fetchedImages[0])

        setLoading(false)
      } catch (error) {
        console.log(error)
      }
    }

    const loadData = async () => {
      setLoading(true)
      const aidCenterImage = await fetchAidCenter()
      if (aidCenterImage) {
        await fetchAidCenterImages(aidCenterImage)
      }
    }

    loadData()
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
            <span className='text-gray-800 font-bold text-md'>Aid Center Galleries</span>
          </Divider>
          <div>
            <img
              className='w-96 h-96 p-2 border-2 border-gray-300 border-dashed bg-cover rounded-md transition-all duration-300 ease-in-out object-cover'
              src={selectedImage}
              alt="aid-center"
            />
          </div>
          <div className='flex flex-row flex-wrap items-center justify-start w-full gap-3'>
            {imageList.map((image, index) => (
              <img
                key={index}
                className={`w-20 h-20 p-1 border-2 ${selectedImage === image ? 'border-blue-500' : 'border-gray-300'} border-dashed bg-cover rounded-md cursor-pointer transition-colors duration-200 ease-in-out object-cover hover:border-blue-400`}
                src={image}
                alt={`aid-center-${index + 1}`}
                onClick={() => setSelectedImage(image)}
              />
            ))}
          </div>
        </div>
        {/* Middle Item */}
        <div className='flex flex-col flex-1 items-start'>
          <Divider style={{ color: 'red' }} orientation='left' orientationMargin={0}>
            <span className='text-gray-800 font-bold text-md'>Aid Center Details</span>
          </Divider>
          <div className='flex flex-col gap-2 w-full'>
            <p className='text-gray-800 text-2xl my-4 ml-4 mr-8 text-start font-semibold'>{aidCenter.name}</p>
            <div className='flex flex-row justify-start my-1 ml-4 mr-8'>
              <div className='flex flex-row gap-3 items-center w-40'>
                <FaUser />
                <p className='text-gray-800 text-md font-semibold'>Username</p>
              </div>
              <div className='text-gray-800 text-md font-semibold'>:</div>
              <div className='ml-8 text-gray-600 text-md font-normal'>
                <p>{aidCenter.username}</p>
              </div>
            </div>
            <div className='flex flex-row justify-start my-1 ml-4 mr-8'>
              <div className='flex flex-row gap-3 items-center w-40'>
                <MdEmail />
                <p className='text-gray-800 text-md font-semibold'>Email</p>
              </div>
              <div className='text-gray-800 text-md font-semibold'>:</div>
              <div className='ml-8 text-gray-600 text-md font-normal'>
                <p>{aidCenter.email}</p>
              </div>
            </div>
            <div className='flex flex-row justify-start my-1 ml-4 mr-8'>
              <div className='flex flex-row gap-3 items-center w-40'>
                <FaPhone />
                <p className='text-gray-800 text-md font-semibold'>Phone</p>
              </div>
              <div className='text-gray-800 text-md font-semibold'>:</div>
              <div className='ml-8 text-gray-600 text-md font-normal'>
                <p>{aidCenter.phone}</p>
              </div>
            </div>
            <div className='flex flex-row justify-start my-1 ml-4 mr-8'>
              <div className='flex flex-row gap-3 items-center w-40'>
                <MdLocationPin />
                <p className='text-gray-800 text-md font-semibold'>Address</p>
              </div>
              <div className='text-gray-800 text-md font-semibold'>:</div>
              <div className='ml-8 text-gray-600 text-md font-normal'>
                <p>{aidCenter.address}</p>
              </div>
            </div>
            <div className='flex flex-row justify-start my-1 ml-4 mr-8'>
              <div className='flex flex-row gap-3 items-center w-40'>
                <IoTime />
                <p className='text-gray-800 text-md font-semibold'>Work Time</p>
              </div>
              <div className='text-gray-800 text-md font-semibold'>:</div>
              <div className='ml-8 text-gray-600 text-md font-normal'>
                <p>{aidCenter.work_time}</p>
              </div>
            </div>
            <div className='flex flex-row justify-start my-1 ml-4 mr-8'>
              <div className='flex flex-row gap-3 items-center w-40'>
                <IoIosBusiness />
                <p className='text-gray-800 text-md font-semibold'>Established Year</p>
              </div>
              <div className='text-gray-800 text-md font-semibold'>:</div>
              <div className='ml-8 text-gray-600 text-md font-normal'>
                <p>{aidCenter.establish_year}</p>
              </div>
            </div>
            <div className='flex flex-row justify-start my-1 ml-4 mr-8'>
              <div className='flex flex-row gap-3 items-center w-40'>
                <BiSolidCommentDetail />
                <p className='text-gray-800 text-md font-semibold'>Review</p>
              </div>
              <div className='text-gray-800 text-md font-semibold'>:</div>
              <div className='ml-8 text-gray-600 text-md font-normal'>
                <p>{aidCenter.rating_count} Reviews</p>
              </div>
            </div>
            <div className='flex flex-row justify-start my-1 ml-4 mr-8'>
              <div className='flex flex-row gap-3 items-center w-40'>
                <MdOutlineUpdate />
                <p className='text-gray-800 text-md font-semibold text-start'>Join Dated</p>
              </div>
              <div className='text-gray-800 text-md font-semibold'>:</div>
              <div className='ml-8 text-gray-600 text-md font-normal'>
                <p>{format(new Date(aidCenter.created_at), 'dd-MM-yyyy')}</p>
              </div>
            </div>
            <div className='flex flex-row justify-start my-1 ml-4 mr-8'>
              {(() => {
                if (aidCenter.website && aidCenter.fanpage) {
                  return (
                    <>
                      <div className='flex flex-row gap-3 items-center w-40'>
                        <AiOutlineGlobal />
                        <Link to={aidCenter.website} className='text-gray-800 text-md font-semibold transition duration-300 hover:text-blue-500'>Website</Link>
                      </div>
                      <div className='flex flex-row gap-3 items-center w-40'>
                        <FaLink />
                        <Link to={aidCenter.fanpage} className='text-gray-800 text-md font-semibold transition duration-300 hover:text-blue-500'>Fanpage</Link>
                      </div>
                    </>
                  )
                } else if (aidCenter.website) {
                  return (
                    <div className='flex flex-row gap-3 items-center w-40'>
                      <AiOutlineGlobal />
                      <Link to={aidCenter.website} className='text-gray-800 text-md font-semibold transition duration-300 hover:text-blue-500'>Website</Link>
                    </div>
                  )
                } else {
                  return (
                    <div className='flex flex-row gap-3 items-center w-40'>
                      <FaLink />
                      <Link to={aidCenter.fanpage} className='text-gray-800 text-md font-semibold transition duration-300 hover:text-blue-500'>Fanpage</Link>
                    </div>
                  )
                }
              })()}
            </div>
          </div>
        </div>
        {/* Right Item */}
        <div className='flex flex-col flex-1 items-start'>
          <Divider style={{ color: 'red' }} orientation='left' orientationMargin={0}>
            <span className='text-gray-800 font-bold text-md'>Map</span>
          </Divider>
          <div className='w-full mt-4'>
            <Map address={location} coords={coords} />
          </div>
        </div>
      </div>
      <div className='mt-4'>
        {aidCenter?.certificate ? (
          <div className='w-full flex flex-row gap-10'>
            <div className='flex flex-col flex-1'>
              <Divider orientation='left' orientationMargin={0}>
                <span className='text-gray-800 font-bold text-md'>Aid Center Description</span>
              </Divider>
              <p className='text-gray-600 m-6 text-justify'>{aidCenter.description}</p>
            </div>
            <div className='flex flex-col flex-1'>
              <Divider style={{ color: 'red' }} orientation='left' orientationMargin={0}>
                <span className='text-gray-800 font-bold text-md'>Certification</span>
              </Divider>
              <div className='flex mx-auto'>
                <img
                  className='w-60 h-60 p-2 border-2 border-gray-300 border-dashed bg-cover rounded-md transition-all duration-300 ease-in-out object-cover'
                  src={aidCenter.certificate_url}
                  alt="certificate"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className='w-full'>
            <Divider orientation='left' orientationMargin={0}>
              <span className='text-gray-800 font-bold text-md'>Aid Center Description</span>
            </Divider>
            <p className='text-gray-600 m-6 text-justify'>{aidCenter.description}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminAidCenterDetail