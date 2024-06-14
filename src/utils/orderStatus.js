const getOrderStatus = (status) => {
  // Convert status to uppercase to match the switch cases
  const upperCaseStatus = status.toUpperCase();

  switch (upperCaseStatus) {
    case 'PAID':
      return (
        <span className="capitalize py-1 px-2 rounded-md text-xs text-sky-600 bg-sky-100">
          {status.replaceAll('_', ' ').toLowerCase()}
        </span>
      )
    case 'DELIVERING':
      return (
        <span className="capitalize py-1 px-2 rounded-md text-xs text-orange-600 bg-orange-100">
          {status.replaceAll('_', ' ').toLowerCase()}
        </span>
      )
    case 'DONE':
      return (
        <span className="capitalize py-1 px-2 rounded-md text-xs text-teal-600 bg-teal-100">
          {status.replaceAll('_', ' ').toLowerCase()}
        </span>
      )
    case 'CREATED':
      return (
        <span className="capitalize py-1 px-2 rounded-md text-xs text-yellow-600 bg-yellow-100">
          {status.replaceAll('_', ' ').toLowerCase()}
        </span>
      )
    default:
      return (
        <span className="capitalize py-1 px-2 rounded-md text-xs text-gray-600 bg-gray-100">
          {status.replaceAll('_', ' ').toLowerCase()}
        </span>
      )
  }
}

export default getOrderStatus;