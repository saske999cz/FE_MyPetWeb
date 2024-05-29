import React, { useState } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import avatar1 from '../../assets/images/avatar1.jpg'
import avatar2 from '../../assets/images/avatar2.jpg'
import './CustomerReview.scss'
import TextEditor from "../TextEditor";
import { Flex, Rate, Tooltip } from 'antd'
import { FaEye, FaUser } from 'react-icons/fa6'
import { BiSolidLike, BiSolidMessageRoundedDetail } from 'react-icons/bi'
import { MdOutlineReply, MdReport } from 'react-icons/md'
import { FaEdit } from 'react-icons/fa'
import { AiFillLike } from "react-icons/ai";
import { IoCloseSharp } from 'react-icons/io5'

const CustomerReview = ({
	toggleReportModal,
	comment = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis quo nostrum dolore fugiat ducimus labore debitis unde autem recusandae? Eius harum tempora quis minima, adipisci natus quod magni omnis quas. Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis quo nostrum dolore fugiat ducimus labore debitis unde autem recusandae? Eius harum tempora quis minima, adipisci natus quod magni omnis quas. '
}) => {
	const [value, setValue] = useState(4);

	const REPLY_WRAPPER_OPEN = "open"
	const REPLY_WRAPPER_CLOSING = "closing"
	const REPLY_WRAPPER_CLOSED = "closed"
	const PREVIEW_OPEN = "open"
	const PREVIEW_CLOSING = "closing"
	const PREVIEW_CLOSED = "closed"

	const [replyState, setReplyState] = useState(REPLY_WRAPPER_CLOSED)
	const [previewState, setPreviewState] = useState(PREVIEW_CLOSED);
	const [isOpenCommentEditor, setOpenCommentEditor] = useState(false)
	const [isOnModePreviewEdit, setOnModePreviewEdit] = useState(false)
	const [isOpenListReplies, setOpenListReplies] = useState(false)

	const [content, setContent] = useState(() => comment);
	const [contentError, setContentError] = useState(false);
	const [reply, setReply] = useState('')
	const [replyError, setRelpyError] = useState(false);

	// --------------------------     Handle Comment     --------------------------
	const editCommentModule = {
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

	const handleClickUsername = () => {

	}

	const handleEditComment = () => {

	}

	const handlePreviewEditComment = () => {

	}

	const handleDeleteComment = () => {

	}

	const handleLikeComment = () => {

	}

	const onChangeContent = (value) => {
		setContent(value);
		console.log("Comment:", value);
	};

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

	const handleOpenReply = () => {
		if (replyState === REPLY_WRAPPER_OPEN) {
			setReplyState(REPLY_WRAPPER_CLOSING);
      setTimeout(() => {
        setReplyState(REPLY_WRAPPER_CLOSED);
      }, 400);

		} else {
			setReplyState(REPLY_WRAPPER_OPEN);
		}
	}

	const handleOpenViewReplies = () => {

	}

	const handlePostReply = () => {

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
							key={avatar2}
							src={avatar2}
							alt={`${avatar2}`}
							effect="opacity"
							placeholderSrc={avatar2}
						/>
						<p
							onClick={handleClickUsername}
							className='text-xl font-semibold mt-1 mb-2 transition duration-200 hover:cursor-pointer hover:text-blue-500'>
							Toronto
						</p>
					</div>
					{/* Left Bottom */}
					<div className='flex flex-col justify-start items-start w-full gap-1'>
						<div className='flex flex-row justify-start items-center gap-3'>
							<Tooltip title="Joined Date">
								<FaUser />
							</Tooltip>
							<p>May 26, 2024</p>
						</div>
						<div className='flex flex-row justify-start items-center gap-3'>
							<Tooltip title="Total Comment">
								<BiSolidMessageRoundedDetail />
							</Tooltip>
							<p>4</p>
						</div>
						<div className='flex flex-row justify-start items-center gap-3'>
							<Tooltip title="Total Like">
								<BiSolidLike />
							</Tooltip>
							<p>14</p>
						</div>
					</div>
				</div>
				{/* Vertical Divider */}
				<div className='flex flex-col border-l-2 border-neutral-600'></div>
				{/* Comment Wrapper Right */}
				<div className='flex flex-col w-full mr-6 py-4 gap-3'>
					{/* Right Top */}
					<div className='flex flex-row items-center justify-between w-full'>
						<div className='font-normal text-[18] text-neutral-500'>
							<Tooltip title="Comment Date">
								<p>May 26, 2024</p>
							</Tooltip>
						</div>
						<div>
							<button onClick={handleOpenReply} className='flex flex-row items-center gap-2 p-2 bg-blue-600 transition duration-300 rounded-md hover:opacity-80'>
								<MdOutlineReply size={24} style={{ color: 'white' }} />
								<p className='font-bold text-white'>{replyState !== REPLY_WRAPPER_OPEN ? 'REPLY' : 'CLOSE REPLY'}</p>
							</button>
						</div>
					</div>
					{/* Right Middle */}
					<div className='h-[70%] font-normal text-[16] my-1 text-justify'>
						{isOpenCommentEditor ? (
							<div className='w-full'>
								<TextEditor
									modules={editCommentModule}
									value={content}
									placeholder={"Edit your comment"}
									onChange={onChangeContent}
								/>
								{contentError && (
									<div className='text-red mt-2 text-sm'>
										<p>Content is required</p>
									</div>
								)}
								{isOnModePreviewEdit && (
									<div className='flex flex-col justify-start items-start'>
										<p className='text-xl font-semibold underline ml-1 mb-2'>Preview</p>
										<div className='font-normal text-[16] my-1 text-justify' dangerouslySetInnerHTML={{ __html: content }} />
									</div>
								)}
								<div className='flex flex-row justify-end items-center gap-3 w-full mt-3'>
									<button
										onClick={handleEditComment}
										className='flex flex-row items-center gap-1 justify-between border-none rounded-md transition duration-300 h-9 px-2 hover:cursor-pointer hover:bg-green-300 opacity-80'
									>
										<FaEdit size={16} />
										<p className='m-0 font-semibold text-[16]'>CONFIRM</p>
									</button>
									<button
										onClick={handlePreviewEditComment}
										className='flex flex-row items-center gap-1 justify-between border-none rounded-md transition duration-300 h-9 px-2 hover:cursor-pointer hover:bg-slate-300 opacity-80'
									>
										<FaEye size={16} />
										<p className='m-0 font-semibold text-[16]'>PREVIEW</p>
									</button>
								</div>
							</div>
						) : (
							<>
								<div className='mb-3'>
									<Flex gap="middle" vertical>
										<Rate disabled defaultValue={value} />
									</Flex>
								</div>
								<div dangerouslySetInnerHTML={{ __html: comment }} />
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
						<div onClick={handleLikeComment} className='flex flex-row justify-between items-center m-0 pr-1 right-bottom-right'>
							<AiFillLike className='like-icon' />
							<p className='m-0 pl-1 like-text'>Like</p>
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
								key={avatar1}
								src={avatar1}
								alt={`${avatar1}`}
								effect="opacity"
								placeholderSrc={avatar1}
							/>
							<p>Shiba</p>
						</div>
					</div>
					{/* Vertical Divider */}
					<div className='flex flex-col border-l-2 border-neutral-600'></div>
					{/* Reply Wrapper Right */}
					<div className="flex flex-col justify-between h-auto w-full py-4 mr-5">
						<div className="flex justify-end items-center mb-3">
							<IoCloseSharp onClick={handleOpenReply} size={20} className="opacity-70 transition duration-300 hover:opacity-100 hover:cursor-pointer" />
						</div>
						<div className="right-editor">
							<TextEditor
								modules={createReplyModule}
								value={reply}
								placeholder={"Write your reply"}
								onChange={onChangeReply}
							/>
							{replyError && (
								<div className="text-red-600 mt-2 text-sm">
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
							<button className="flex flex-row justify-between items-center gap-1 bg-blue-500 rounded-md border-none transition duration-300 h-9 px-2 hover:opacity-80" onClick={handlePostReply}>
								<MdOutlineReply size={16} style={{color: 'white'}} />
								<p className='m-0 text-[16] font-semibold text-white'>REPLY</p>
							</button>
							<button className="flex flex-row justify-between items-center gap-1 bg-neutral-500 rounded-md border-none transition duration-300 h-9 px-2 hover:opacity-80" onClick={handlePreviewReply}>
								<FaEye size={16} style={{color: 'white'}} />
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