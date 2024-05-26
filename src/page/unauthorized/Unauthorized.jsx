import { Button, Result } from 'antd'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const Unauthorized = () => {
	const navigate = useNavigate()

	const handleClick = () => {
		navigate('/login')
	}

	return (
		<div className='flex flex-row justify-center items-center h-screen'>
			<Result
				status="403"
				title="403"
				subTitle="Sorry, you are not authorized to access this page."
				extra={<Button type="primary" onClick={handleClick}>Go to login page</Button>}
			/>
		</div>
	)
}

export default Unauthorized