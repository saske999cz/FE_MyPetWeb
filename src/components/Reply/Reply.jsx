import { Tooltip } from 'antd'
import React, { useEffect, useState } from 'react'
import AuthUser from '../../utils/AuthUser'
import TextEditor from '../TextEditor';
import { FaEdit } from 'react-icons/fa';
import { FaEye, FaPencil, FaTrash } from 'react-icons/fa6';
import './Reply.scss'
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../../utils/firebase';

const Reply = ({ isAdmin, shopAvatar, ratingId, replyDate, replyContent }) => {
  const { avatar, username, http } = AuthUser();
  const { accessToken } = useAuth()
  const navigate = useNavigate()

  const PREVIEW_OPEN = "open"
  const PREVIEW_CLOSING = "closing"
  const PREVIEW_CLOSED = "closed"

  const [processing, setProcessing] = useState(false);

  // --------------------------     Handle Reply     --------------------------
  const [reply, setReply] = useState(replyContent)
  const [replyError, setReplyError] = useState(false);
  const [previewEditReplyState, setPreviewEditReplyState] = useState(PREVIEW_CLOSED);
  const [isOpenReplyEditor, setOpenReplyEditor] = useState(false)

  const editReplyModule = {
    toolbar: [
      ["bold", "italic", "underline", "strike"], // toggled buttons
      ["blockquote", "code-block"],

      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }], // superscript/subscript
      [{ indent: "-1" }, { indent: "+1" }], // outdent/indent

      [{ size: ["small", false, "large", "huge"] }], // custom dropdown
      [{ header: [1, 2, 3, 4, 5, 6, false] }],

      [{ align: [] }],

      ["clean"], // remove formatting button
    ],
  };

  // -----------------------     Reply Action     -----------------------

  const toggleEditReply = () => {
    if (isOpenReplyEditor) {
      setOpenReplyEditor(false)
    } else {
      setOpenReplyEditor(true)
    }
  }

  // -----------------------     Preview Reply Action     -----------------------
  const handlePreviewEditReply = () => {
    if (previewEditReplyState === PREVIEW_OPEN) {
      setPreviewEditReplyState(PREVIEW_CLOSING)
      setTimeout(() => {
        setPreviewEditReplyState(PREVIEW_CLOSED)
      }, 400)
    } else {
      setPreviewEditReplyState(PREVIEW_OPEN)
    }
  }

  const handleConfirmReply = () => {
    if (!processing) {
      setProcessing(true);

      if (!reply.trim()) {
        setReplyError(true)
      } else {
        setReplyError(false)

        const params = new URLSearchParams()
        params.append('reply', reply)

        http.put(`shop/rating-products/${ratingId}/reply`, params, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then((resolve) => {
          setProcessing(false);

          if (resolve.status === 200) {
            Swal.fire({
              title: 'Done!',
              text: 'Successfully updated reply',
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
  }

  const handleDeleteReply = () => {
    if (!processing) {
      setProcessing(true);

      Swal.fire({
        title: 'This action cannot be undone',
        text: 'Want to delete this reply?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'OK',
        confirmButtonColor: '#d33',
        cancelButtonText: 'Cancel',
      }).then((result) => {
        if (result.isConfirmed) {
          http.delete(`shop/rating-products/${ratingId}/reply`)
            .then((resolve) => {
              setProcessing(false);

              if (resolve.status === 404) {
                Swal.fire({
                  icon: "error",
                  title: "Oops...",
                  text: resolve.data.message,
                })
              } else if (resolve.status === 200) {
                Swal.fire({
                  icon: "success",
                  title: 'Done',
                  text: resolve.data.message,
                }).then(() => {
                  navigate(0)
                })
              }
            })
            .catch((error) => {
              console.log(error)
            })
        }
      })
    }
  }

  const onChangeContent = (value) => {
    setReply(value);
  };

  useEffect(() => {
    // Effect to monitor changes in accessToken
    // When accessToken changes, reset processing state
    setProcessing(false);
  }, [accessToken]);

  return (
    // Reply Wrapper
    <div className='flex flex-col w-full h-full bg-neutral-200 py-4 px-5 gap-2 mt-2 mb-1 border-l-4 border-l-neutral-300 rounded-xl'>
      {/* Reply Wrapper Top */}
      <div className='flex flex-row gap-4 items-center justify-start mb-2'>
        {/* Wrapper Top Left */}
        <div className='flex flex-row justify-center items-center '>
          {isAdmin ? (
            <img src={shopAvatar} alt="avatar" className='w-16 h-16 rounded-full border-1 object-cover' />
          ) : (
            <img src={avatar} alt="avatar" className='w-16 h-16 rounded-full border-1 object-cover' />
          )}
        </div>
        {/* Wrapper Top Right */}
        <div className='flex flex-col items-start gap-1'>
          <p className='text font-semibold'>{username}</p>
          <Tooltip title="Reply Date">
            <p>{replyDate}</p>
          </Tooltip>
        </div>
      </div>
      <div>
        {isOpenReplyEditor ? (
          <div className='right-editor'>
            <TextEditor
              modules={editReplyModule}
              value={reply}
              placeholder={"Edit your reply"}
              onChange={onChangeContent}
            />
            {replyError && (
              <div className='text text-red-600 mt-2'>
                <p>Reply is required</p>
              </div>
            )}
            {previewEditReplyState !== PREVIEW_CLOSED && (
              <div className={`flex flex-col justify-start items-start ${previewEditReplyState === PREVIEW_OPEN ? 'animate-openPreview' : ''} ${previewEditReplyState === PREVIEW_CLOSING ? 'animate-closePreview' : ''}`}>
                <p className='text-xl font-semibold underline mt-4 mb-2'>Preview</p>
                <div dangerouslySetInnerHTML={{ __html: reply }} />
              </div>
            )}
            <div className='flex flex-row justify-end items-center gap-3 mb-2 mt-4'>
              <button
                onClick={handleConfirmReply}
                className='flex flex-row justify-between items-center gap-1 bg-blue-500 rounded-md border-none transition duration-300 h-9 px-2 hover:opacity-80 '
              >
                <FaEdit size={16} style={{ color: 'white' }} />
                <p className='m-0 text-[16] font-semibold text-white'>CONFIRM</p>
              </button>
              <button
                onClick={handlePreviewEditReply}
                className='flex flex-row justify-between items-center gap-1 bg-neutral-500 rounded-md border-none transition duration-300 h-9 px-2 hover:opacity-80'
              >
                <FaEye size={16} style={{ color: 'white' }} />
                <p className='m-0 text-[16] font-semibold text-white'>PREVIEW</p>
              </button>
            </div>
          </div>
        ) : (
          <div className='text-justify mx-1' dangerouslySetInnerHTML={{ __html: replyContent }} />
        )}
      </div>
      {!isAdmin && (
        <div className='flex flex-row mt-2 items-center justify-between'>
          <button
            onClick={toggleEditReply}
            className='flex flex-row items-center gap-2 p-2 bg-yellow-500 rounded-md'
          >
            <FaPencil size={18} style={{ color: 'white' }} />
            <p className='text-white text-sm font-semibold'>{isOpenReplyEditor ? 'Close Edit Reply' : 'Edit Reply'}</p>
          </button>
          <button
            onClick={handleDeleteReply}
            className='flex flex-row items-center gap-2 p-2 bg-red-500 rounded-md'
          >
            <FaTrash size={18} style={{ color: 'white' }} />
            <p className='text-white text-sm font-semibold'>Delete Reply</p>
          </button>
        </div>
      )}
    </div>
  )
}

export default Reply