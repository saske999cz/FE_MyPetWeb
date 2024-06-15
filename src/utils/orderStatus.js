const getOrderStatus = (status) => {
  // Convert status to uppercase to match the switch cases
  const upperCaseStatus = status.toUpperCase();

  switch (upperCaseStatus) {
    case 'PAID':
      return (
        <span className="capitalize py-1 px-2 rounded-md font-semibold text-[16px] text-sky-600 bg-sky-100">
          {status.replaceAll('_', ' ').toLowerCase()}
        </span>
      )
    case 'DELIVERING':
      return (
        <span className="capitalize py-1 px-2 rounded-md font-semibold text-[16px] text-orange-600 bg-orange-100">
          {status.replaceAll('_', ' ').toLowerCase()}
        </span>
      )
    case 'DONE':
      return (
        <span className="capitalize py-1 px-2 rounded-md font-semibold text-[16px] text-teal-600 bg-teal-100">
          {status.replaceAll('_', ' ').toLowerCase()}
        </span>
      )
    case 'CREATED':
      return (
        <span className="capitalize py-1 px-2 rounded-md font-semibold text-[16px] text-yellow-600 bg-yellow-100">
          {status.replaceAll('_', ' ').toLowerCase()}
        </span>
      )
    default:
      return (
        <span className="capitalize py-1 px-2 rounded-md font-semibold text-[16px] text-gray-600 bg-gray-100">
          {status.replaceAll('_', ' ').toLowerCase()}
        </span>
      )
  }
}

export default getOrderStatus;