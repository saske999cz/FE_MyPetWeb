import React, { useState } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import loading from '../../assets/images/loading.png'
import './CustomerReview.scss'
import TextEditor from "../TextEditor";
import { Flex, Rate, Tooltip } from 'antd'
import { FaEye, FaMedal, FaStar, FaUser } from 'react-icons/fa6'
import { BiSolidLike, BiSolidMessageRoundedDetail } from 'react-icons/bi'
import { MdOutlineReply, MdReport } from 'react-icons/md'
import { FaEdit } from 'react-icons/fa'
import { AiFillLike } from "react-icons/ai";
import { IoCloseSharp } from 'react-icons/io5'
import { format } from 'date-fns'
import AuthUser from '../../utils/AuthUser'
import { ImReply } from "react-icons/im";
import Reply from '../Reply/Reply';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const CustomerReview = ({ rating, ratingIndex, toggleReportModal }) => {
  const { username, avatar, http } = AuthUser()
  const navigate = useNavigate()

  const REPLY_WRAPPER_OPEN = "open"
  const REPLY_WRAPPER_CLOSING = "closing"
  const REPLY_WRAPPER_CLOSED = "closed"
  const NESTED_REPLY_OPEN = "open"
  const NESTED_REPLY_CLOSING = "closing"
  const NESTED_REPLY_CLOSED = "closed"
  const PREVIEW_OPEN = "open"
  const PREVIEW_CLOSING = "closing"
  const PREVIEW_CLOSED = "closed"

  const [likeCount, setLikeCount] = useState(rating.likes.total_likes)
  const [likeStatus, setLikeStatus] = useState(rating.likes.shop_liked)

  const [replyState, setReplyState] = useState(REPLY_WRAPPER_CLOSED)
  const [nestedReplyState, setNestedReplyState] = useState(NESTED_REPLY_CLOSED)
  const [previewState, setPreviewState] = useState(PREVIEW_CLOSED);

  const [reply, setReply] = useState('')
  const [replyError, setRelpyError] = useState(false);

  const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];

  // --------------------------     Handle Reply     --------------------------
  const handleLikeRating = () => {
    if (!likeStatus) {
      http.post(`shop/rating-products/${rating.rating_id}/like`)
        .then((resolve) => {
          const total_likes = resolve.data.total_likes ?? 0
          setLikeCount(total_likes)
          setLikeStatus(true)

          toast.success(`Liked rating of ${rating.customer_username}`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: 0,
            theme: "colored",
          })
        })
        .catch((error) => {
          console.log(error)
        })
    } else {
      http.post(`shop/rating-products/${rating.rating_id}/unlike`)
        .then((resolve) => {
          const total_likes = resolve.data.total_likes ?? 0
          setLikeCount(total_likes)
          setLikeStatus(false)

          toast.success(`Unliked rating of ${rating.customer_username}`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: 0,
            theme: "colored",
          })
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }

  // --------------------------     Handle Reply     --------------------------
  const createReplyModule = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],

      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent

      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['link', 'image', 'video', 'formula'],          // add's image support

      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],

      ['clean'] // remove formatting button
    ],
  }

  const handleOpenOutsideReply = () => {
    if (replyState === REPLY_WRAPPER_OPEN) {
      setReplyState(REPLY_WRAPPER_CLOSING);
      setTimeout(() => {
        setReplyState(REPLY_WRAPPER_CLOSED);
      }, 400);
    } else {
      setReplyState(REPLY_WRAPPER_OPEN);
    }
  }

  const handleOpenNestedReply = () => {
    if (nestedReplyState === NESTED_REPLY_OPEN) {
      setNestedReplyState(NESTED_REPLY_CLOSING)
      setTimeout(() => {
        setNestedReplyState(REPLY_WRAPPER_CLOSED)
      }, 400)
    } else {
      setNestedReplyState(NESTED_REPLY_OPEN);
    }
  }

  const handlePostReply = () => {
    if (!reply.trim()) {
      setRelpyError(true)
    } else {
      setRelpyError(false)

      const formData = new FormData()
      formData.append('reply', reply);

      http.post(`shop/rating-products/${rating.rating_id}/reply`, formData)
        .then((resolve) => {
          if (resolve.status === 200) {
            Swal.fire({
              title: 'Done!',
              text: 'Successfully posted reply',
              icon: 'success',
            }).then(() => {
              navigate(0)
            })
          }
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }

  const handlePreviewReply = () => {
    if (reply.trim() !== "") {
      setRelpyError(false)
    }

    if (previewState === PREVIEW_OPEN) {
      setPreviewState(PREVIEW_CLOSING)
      setTimeout(() => {
        setPreviewState(PREVIEW_CLOSED)
      }, 400)
    } else {
      setPreviewState(PREVIEW_OPEN)
    }
  }

  const onChangeReply = (value) => {
    setReply(value)
    console.log('Reply:', value)
  }

  return (
    // Comment Container
    <div className='flex flex-col justify-start items-start w-full'>
      {/* Comment Wrapper */}
      <div className='flex flex-row w-full bg-neutral-100 mb-5 gap-5 border-l-8 border-neutral-200 rounded-md'>
        {/* Comment Wrapper Left */}
        <div className='flex flex-col justify-start items-center ml-5 py-4 min-w-[10%]'>
          {/* Left Top */}
          <div className='left-top'>
            <LazyLoadImage
              key={ratingIndex}
              src={rating.avatar_url}
              alt={`Avatar ${ratingIndex}`}
              effect="blur"
              placeholderSrc={loading}
            />
            <p
              className='text-xl font-semibold mt-1 mb-2 transition duration-200 hover:cursor-pointer hover:text-blue-500'>
              {rating.customer_username}
            </p>
          </div>
          {/* Left Bottom */}
          <div className='flex flex-col justify-start items-start w-full gap-1'>
            <div className='flex flex-row justify-start items-center gap-3'>
              <Tooltip title="Joined Date">
                <FaUser />
              </Tooltip>
              <p>{format(new Date(rating.account_creation_date), 'dd-MM-yyyy')}</p>
            </div>
            <div className='flex flex-row justify-start items-center gap-3'>
              <Tooltip title="Total Rating">
                <FaStar />
              </Tooltip>
              <p>{rating.customer_rating_count}</p>
            </div>
            <div className='flex flex-row justify-start items-center gap-3'>
              <Tooltip title="Ranking Point">
                <FaMedal />
              </Tooltip>
              <p>{rating.customer_ranking_point}</p>
            </div>
          </div>
        </div>
        {/* Vertical Divider */}
        <div className='flex flex-col border-l-2 border-neutral-600' />
        {/* Comment Wrapper Right */}
        <div className='flex flex-col w-full mr-6 py-4 gap-3'>
          {/* Right Top */}
          <div className='flex flex-row items-center justify-between w-full'>
            <div className='font-normal text-[18] text-neutral-500'>
              <Tooltip title="Review Date">
                <p>{format(new Date(rating.rating_date), 'MMM dd, yyyy')}</p>
              </Tooltip>
            </div>
            <div className='flex flex-row gap-3'>
              {rating.reply === null && (
                <button onClick={handleOpenOutsideReply} className='flex flex-row items-center gap-2 p-2 bg-blue-600 transition duration-300 rounded-md hover:opacity-80'>
                  <MdOutlineReply size={24} style={{ color: 'white' }} />
                  <p className='font-bold text-white'>{replyState !== REPLY_WRAPPER_OPEN ? 'REPLY' : 'CLOSE REPLY'}</p>
                </button>
              )}
              <Tooltip title="Like">
                <div className='flex flex-row items-center gap-2 p-2 bg-green-500 rounded-md'>
                  <BiSolidLike size={24} style={{ color: 'white' }} />
                  <p className='font-bold text-white'>{likeCount}</p>
                </div>
              </Tooltip>
            </div>
          </div>
          {/* Right Middle */}
          <div className='h-full font-normal text-[16] my-1 text-justify'>
            <div className='mb-3'>
              <Flex gap="middle" vertical>
                <Rate disabled tooltips={desc} defaultValue={rating.rating_score} />
              </Flex>
            </div>
            <div dangerouslySetInnerHTML={{ __html: rating.description }} />
            {/* Show Nested List Reply */}
            {rating.reply && (
              <>
                <div className='flex flex-row justify-start items-center gap-1 mt-3'>
                  <ImReply className='icon-reply' />
                  <p
                    onClick={handleOpenNestedReply}
                    className='text-[16] opacity-60 transform duration-300 my-2 hover:cursor-pointer hover:opacity-100'
                  >
                    {nestedReplyState === NESTED_REPLY_OPEN ? 'Close Reply' : 'Reply'}
                  </p>
                </div>
                {nestedReplyState !== NESTED_REPLY_CLOSED && (
                  <div className={`bg-neutral-200 w-full mb-5 border-r-4 gap-2 ${nestedReplyState === NESTED_REPLY_OPEN ? 'animate-openReply' : ''} ${nestedReplyState === NESTED_REPLY_CLOSING ? 'animate-closeReply' : ''}`}>
                    <Reply
                      ratingId={rating.rating_id}
                      replyDate={rating.reply_date}
                      replyContent={rating.reply}
                    />
                  </div>
                )}
              </>
            )}
          </div>
          {/* Right Bottom */}
          <div className='flex flex-row justify-between items-center'>
            {/* Right Bottom Left */}
            <div onClick={toggleReportModal} className='flex flex-row justify-between items-center m-0 pl-1 right-bottom-left'>
              <MdReport className='report-icon' />
              <p className='m-0 pl-1 report-text'>Report</p>
            </div>
            {/* Right Bottom Right */}
            <div
              onClick={handleLikeRating}
              className={`flex flex-row justify-between items-center m-0 pr-1 right-bottom-right`}
            >
              <AiFillLike
                className={`like-icon ${likeStatus ? 'liked-icon' : 'not-liked-icon'}`}
                style={{ color: likeStatus ? 'blue' : 'black' }}
              />
              <p
                className={`m-0 pl-1 like-text ${likeStatus ? 'liked-text' : 'not-liked-text'}`}
              >
                {likeStatus ? 'Liked' : 'Like'}
              </p>
            </div>
          </div>
        </div>
      </div>
      {replyState !== REPLY_WRAPPER_CLOSED && (
        // Reply Wrapper
        <div className={`reply-wrapper h-full bg-neutral-100 flex flex-row mb-5 ml-16 rounded-md gap-5 ${replyState === REPLY_WRAPPER_OPEN ? 'animate-openReply' : ''} ${replyState === REPLY_WRAPPER_CLOSING ? 'animate-closeReply' : ''}`}>
          {/* Reply Wrapper Left */}
          <div className="flex flex-col justify-start items-center py-4 pl-5 min-w-[12%] border-l-8 border-neutral-200 rounded-md">
            <div className='left-top'>
              <LazyLoadImage
                key={avatar}
                src={avatar}
                alt={`${avatar}`}
                effect="opacity"
                placeholderSrc={loading}
              />
              <p className='text-xl font-semibold mt-1 mb-2 transition duration-200 hover:cursor-pointer hover:text-blue-500'>{username}</p>
            </div>
          </div>
          {/* Vertical Divider */}
          <div className='flex flex-col border-l-2 border-neutral-600'></div>
          {/* Reply Wrapper Right */}
          <div className="flex flex-col justify-between h-auto w-full py-4 mr-5">
            <div className="flex justify-end items-center mb-3">
              <IoCloseSharp onClick={handleOpenOutsideReply} size={20} className="opacity-70 transition duration-300 hover:opacity-100 hover:cursor-pointer" />
            </div>
            <div className="right-editor">
              <TextEditor
                modules={createReplyModule}
                value={reply}
                placeholder={"Write your reply"}
                onChange={onChangeReply}
              />
              {replyError && (
                <div className="text-red-600 mt-2 text-sm text-start">
                  <p>Reply content is required</p>
                </div>
              )}
            </div>
            {previewState !== PREVIEW_CLOSED && (
              <div className={`flex flex-col justify-start items-start ${previewState === PREVIEW_OPEN ? 'animate-openPreview' : ''} ${previewState === PREVIEW_CLOSING ? 'animate-closePreview' : ''}`}>
                <p className='text-xl font-semibold underline mt-4 mb-2'>Preview</p>
                <div dangerouslySetInnerHTML={{ __html: reply }} />
              </div>
            )}
            <div className="flex flex-row justify-end items-center gap-3 mb-2 mt-4">
              <button
                onClick={handlePostReply}
                className="flex flex-row justify-between items-center gap-1 bg-blue-500 rounded-md border-none transition duration-300 h-9 px-2 hover:opacity-80"
              >
                <MdOutlineReply size={16} style={{ color: 'white' }} />
                <p className='m-0 text-[16] font-semibold text-white'>REPLY</p>
              </button>
              <button
                onClick={handlePreviewReply}
                className="flex flex-row justify-between items-center gap-1 bg-neutral-500 rounded-md border-none transition duration-300 h-9 px-2 hover:opacity-80"
              >
                <FaEye size={16} style={{ color: 'white' }} />
                <p className='m-0 text-[16] font-semibold text-white'>PREVIEW</p>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomerReview