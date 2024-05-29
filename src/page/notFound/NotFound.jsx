import { Button, Result } from 'antd';
import React from 'react'
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
	const navigate = useNavigate();

	const handleClick = () => {
		navigate('/')
	}

	return (
		<div className='flex flex-row justify-center items-center h-screen'>
			<Result
				status="404"
				title="404"
				subTitle="Sorry, the page you visited does not exist."
				extra={<Button type="primary" onClick={handleClick}>Go Back</Button>}
			/>
		</div>
	)
}

export default NotFound