import React, { useState } from 'react';
import { Divider, Flex, Pagination, Progress, Rate } from 'antd';
import { BiSolidCategoryAlt, BiSolidCommentDetail } from "react-icons/bi";
import { MdOutlineProductionQuantityLimits, MdPublishedWithChanges, MdSell, MdOutlineUpdate } from "react-icons/md";
import { GrCurrency } from "react-icons/gr";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import CustomerReview from '../../../components/CustomerReview/CustomerReview';
import avatar1 from '../../../assets/images/avatar1.jpg'
import avatar2 from '../../../assets/images/avatar2.jpg'
import './ProductDetail.scss';

const ProductDetail = () => {
	const [selectedImage, setSelectedImage] = useState("https://mironcoder-hotash.netlify.app/images/product/single/01.webp");
	const [value, setValue] = useState(3);
	const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];
	const images = [
		"https://mironcoder-hotash.netlify.app/images/product/single/01.webp",
		"https://mironcoder-hotash.netlify.app/images/product/single/02.webp",
		"https://mironcoder-hotash.netlify.app/images/product/single/03.webp",
		"https://mironcoder-hotash.netlify.app/images/product/single/04.webp",
		"https://mironcoder-hotash.netlify.app/images/product/single/05.webp"
	];

	// Pagination state
	const pageSizeOptions = [5, 10, 15];
	const DEFAULT_CURRENT_PAGE_NUMBER = 1;
	const DEFAULT_PAGE_SIZE_NUMBER = 5;
	const [listComments, setListComments] = useState([]); // Fetch list comments state
	const [currentPage, setCurrentPage] = useState(DEFAULT_CURRENT_PAGE_NUMBER);
	const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE_NUMBER);
	const [totalComments, setTotalComments] = useState(0);

	// --------------------------     Paginate     --------------------------
	const handleClickPaginate = (page, pageSize) => {
		console.log(page, pageSize);
		setCurrentPage(page);
	}

	const handleShowSizeChange = (currentPage, pageSize) => {
		console.log(currentPage, pageSize);
		setCurrentPage(currentPage);
		setPageSize(pageSize);
	}

	return (
		<div className='flex flex-col gap-4 justify-center p-4' style={{ background: '#fbfbfb' }}>
			<div className='flex flex-row items-start gap-8'>
				{/* Left Item */}
				<div className='flex flex-col items-start gap-4 max-w-[27%]'>
					<Divider orientation='left' orientationMargin={0}>
						<span className='text-gray-800 font-bold text-md'>Product Gallery</span>
					</Divider>
					<div>
						<img
							className='w-96 h-96 border-2 border-gray-300 border-dashed bg-cover rounded-md transition-all duration-300 ease-in-out'
							src={selectedImage}
							alt="product"
						/>
					</div>
					<div className='flex flex-row flex-wrap items-center justify-between w-full gap-3'>
						{images.map((image, index) => (
							<img
								key={index}
								className={`w-20 h-20 border-2 ${selectedImage === image ? 'border-blue-500' : 'border-gray-300'} border-dashed bg-cover rounded-md cursor-pointer transition-colors duration-200 ease-in-out hover:border-blue-400`}
								src={image}
								alt={`product-${index + 1}`}
								onClick={() => setSelectedImage(image)}
							/>
						))}
					</div>
				</div>
				{/* Right Item */}
				<div className='flex flex-col flex-1 items-start'>
					<Divider style={{ color: 'red' }} orientation='left' orientationMargin={0}>
						<span className='text-gray-800 font-bold text-md'>Product Details</span>
					</Divider>
					<div className='flex flex-col gap-2 w-full'>
						<p className='text-gray-800 text-2xl my-4 ml-4 mr-8 text-start font-semibold'>Formal suits for men wedding slim fit 3 piece dress business party jacket</p>
						<div className='flex flex-row justify-start my-1 ml-4 mr-8'>
							<div className='flex flex-row gap-3 items-center w-40'>
								<BiSolidCategoryAlt />
								<p className='text-gray-800 text-md font-semibold'>Category</p>
							</div>
							<div className='text-gray-800 text-md font-semibold'>:</div>
							<div className='ml-8 text-gray-600 text-md font-normal'>
								<p>Man's</p>
							</div>
						</div>
						<div className='flex flex-row justify-start my-1 ml-4 mr-8'>
							<div className='flex flex-row gap-3 items-center w-40'>
								<GrCurrency />
								<p className='text-gray-800 text-md font-semibold'>Price</p>
							</div>
							<div className='text-gray-800 text-md font-semibold'>:</div>
							<div className='ml-8 text-gray-600 text-md font-normal'>
								<p>70.000 VND</p>
							</div>
						</div>
						<div className='flex flex-row justify-start my-1 ml-4 mr-8'>
							<div className='flex flex-row gap-3 items-center w-40'>
								<MdOutlineProductionQuantityLimits />
								<p className='text-gray-800 text-md font-semibold'>Quantity</p>
							</div>
							<div className='text-gray-800 text-md font-semibold'>:</div>
							<div className='ml-8 text-gray-600 text-md font-normal'>
								<p>24 Pieces</p>
							</div>
						</div>
						<div className='flex flex-row justify-start my-1 ml-4 mr-8'>
							<div className='flex flex-row gap-3 items-center w-40'>
								<MdSell />
								<p className='text-gray-800 text-md font-semibold'>Sold</p>
							</div>
							<div className='text-gray-800 text-md font-semibold'>:</div>
							<div className='ml-8 text-gray-600 text-md font-normal'>
								<p>70 Sold</p>
							</div>
						</div>
						<div className='flex flex-row justify-start my-1 ml-4 mr-8'>
							<div className='flex flex-row gap-3 items-center w-40'>
								<BiSolidCommentDetail />
								<p className='text-gray-800 text-md font-semibold'>Review</p>
							</div>
							<div className='text-gray-800 text-md font-semibold'>:</div>
							<div className='ml-8 text-gray-600 text-md font-normal'>
								<p>10 Reviews</p>
							</div>
						</div>
						<div className='flex flex-row justify-start my-1 ml-4 mr-8'>
							<div className='flex flex-row gap-3 items-center w-40'>
								<MdPublishedWithChanges />
								<p className='text-gray-800 text-md font-semibold'>Published</p>
							</div>
							<div className='text-gray-800 text-md font-semibold'>:</div>
							<div className='ml-8 text-gray-600 text-md font-normal'>
								<p>02 Feb 2020</p>
							</div>
						</div>
						<div className='flex flex-row justify-start my-1 ml-4 mr-8'>
							<div className='flex flex-row gap-3 items-center w-40'>
								<MdOutlineUpdate />
								<p className='text-gray-800 text-md font-semibold text-start'>Last Updated</p>
							</div>
							<div className='text-gray-800 text-md font-semibold'>:</div>
							<div className='ml-8 text-gray-600 text-md font-normal'>
								<p>02 Feb 2020</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className='mt-4'>
				<Divider orientation='left' orientationMargin={0}>
					<span className='text-gray-800 font-bold text-md'>Product Description</span>
				</Divider>
				<p className='text-gray-600 m-6 text-justify'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae reprehenderit repellendus expedita esse cupiditate quos doloremque rerum, corrupti ab illum est nihil, voluptate ex dignissimos! Sit voluptatem delectus nam, molestiae, repellendus ab sint quo aliquam debitis amet natus doloremque laudantium? Repudiandae, consequuntur, officiis quidem quo deleniti, autem non laudantium sequi error molestiae ducimus accusamus facere velit consectetur vero dolore natus nihil temporibus aspernatur quia consequatur? Consequuntur voluptate deserunt repellat tenetur debitis molestiae doloribus dicta. In rem illum dolorem atque ratione voluptates asperiores maxime doloremque laudantium magni neque ad quae quos quidem, quaerat rerum ducimus blanditiis reiciendis</p>
			</div>
			<div className='mt-2'>
				<Divider orientation='left' orientationMargin={0}>
					<span className='text-gray-800 font-bold text-md'>Rating Analytics</span>
				</Divider>
				<div className='flex flex-row gap-20 justify-center items-center w-full'>
					<Flex className='flex flex-col items-start justify-center gap-2' gap="small" vertical style={{ width: 500 }}>
						<div className='flex flex-row items-center justify-between gap-2 w-full'>
							<span className='text-gray-800 text-md w-20'>5 Star</span>
							<Progress className='flex-1' percent={parseInt(22 / 38 * 100)} showInfo={false} />
							<span className='w-20'>(22)</span>
						</div>
						<div className='flex flex-row items-center justify-between gap-2 w-full'>
							<span className='text-gray-800 text-md w-20'>4 Star</span>
							<Progress className='flex-1' percent={parseInt(6 / 38 * 100)} showInfo={false} />
							<span className='w-20'>(06)</span>
						</div>
						<div className='flex flex-row items-center justify-between gap-2 w-full'>
							<span className='text-gray-800 text-md w-20'>3 Star</span>
							<Progress className='flex-1' percent={parseInt(5 / 38 * 100)} showInfo={false} />
							<span className='w-20'>(05)</span>
						</div>
						<div className='flex flex-row items-center justify-between gap-2 w-full'>
							<span className='text-gray-800 text-md w-20'>2 Star</span>
							<Progress className='flex-1' percent={parseInt(3 / 38 * 100)} showInfo={false} />
							<span className='w-20'>(03)</span>
						</div>
						<div className='flex flex-row items-center justify-between gap-2 w-full'>
							<span className='text-gray-800 text-md w-20'>1 Star</span>
							<Progress className='flex-1' percent={parseInt(2 / 38 * 100)} showInfo={false} />
							<span className='w-20'>(02)</span>
						</div>
					</Flex>
					<div className='flex flex-col justify-center items-start'>
						<span className='text-gray-800 font-bold'>Total Review (38)</span>
						<span className='text-gray-800 font-extrabold' style={{ fontSize: 86 }}>4.9</span>
						<Flex gap="middle" vertical>
							<Rate allowHalf tooltips={desc} onChange={setValue} defaultValue={4.5} />
						</Flex>
					</div>
				</div>
			</div>
			<div className='mt-2'>
				<Divider orientation='left' orientationMargin={0}>
					<span className='text-gray-800 font-bold text-md'>Customer Reviews</span>
				</Divider>
			</div>
			<CustomerReview />
			<CustomerReview />
			<CustomerReview />
			<CustomerReview />
			<CustomerReview />
			<div className='flex flex-row items-center mt-6'>
				<Pagination
					current={currentPage}
					defaultCurrent={DEFAULT_CURRENT_PAGE_NUMBER}
					defaultPageSize={DEFAULT_PAGE_SIZE_NUMBER}
					hideOnSinglePage
					total={totalComments}
					pageSizeOptions={pageSizeOptions}
					showTotal={(totalComments) => totalComments <= 1 ? `Total ${totalComments} comment` : `Total ${totalComments} comments`}
					showQuickJumper
					showSizeChanger
					onChange={handleClickPaginate}
					onShowSizeChange={handleShowSizeChange}
				/>
			</div>
		</div>
	);
}

export default ProductDetail;
