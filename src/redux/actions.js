export const addAvatar = (data) => {
    return {
        type: 'avatar/addAvatar',
        payload: data
    }
}

export const removeAvatar = (data) => {
    return {
        type: 'avatar/removeAvatar',
        payload: data
    }
}
