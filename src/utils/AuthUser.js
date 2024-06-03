import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { removeAvatar } from "../redux/actions";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";

export default function AuthUser() {
  const { accessToken, updateToken, clearToken } = useAuth();

  const hasAccessToken = () => {
    const accessTokenString = localStorage.getItem('access_token');
    return !!accessTokenString
  }

  const hasUsername = () => {
    const usernameString = localStorage.getItem('username');
    return !!usernameString
  }

  const [userId, setUserId] = useState(() => {
    const userIdString = localStorage.getItem('user_id');
    const userId = JSON.parse(userIdString);
    return userId;
  });

  const [username, setUsername] = useState(() => {
    const usernameString = localStorage.getItem('username');
    const username = JSON.parse(usernameString);
    return username;
  });

  const [email, setEmail] = useState(() => {
    const emailString = localStorage.getItem('email');
    const email = JSON.parse(emailString);
    return email;
  });

  const [avatar, setAvatar] = useState(() => {
    const avatarString = localStorage.getItem('avatar');
    const avatar = JSON.parse(avatarString);
    return avatar;
  });

  const [role, setRole] = useState(() => {
    const roleString = localStorage.getItem('role');
    const role = JSON.parse(roleString);
    return role;
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const saveToken = (accessToken, user) => {
    updateToken(accessToken); // Sử dụng updateToken từ context
    localStorage.setItem('user_id', JSON.stringify(user.id))
    localStorage.setItem('username', JSON.stringify(user.username))
    localStorage.setItem('email', JSON.stringify(user.email))
    localStorage.setItem('avatar', JSON.stringify(user.avatar))
    localStorage.setItem('role', JSON.stringify(user.role_name))

    setUserId(user.id)
    setUsername(user.username)
    setEmail(user.email)
    setAvatar(user.avatar)
    setRole(user.role_name)
  }

  const logout = () => {
    clearToken(); // Sử dụng clearToken từ context
    localStorage.removeItem('user_id');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('avatar');
    localStorage.removeItem('role');

    dispatch(removeAvatar(''));
    navigate('/login')

    toast.success('Logout successful!', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    })
  }

  const http = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
    headers: {
      "Content-Type": 'multipart/form-data',
      "Authorization": `Bearer ${accessToken || ''}`, // Sử dụng accessToken từ context
    }
  });

  http.interceptors.request.use(
    config => {
      const token = accessToken; // Sử dụng accessToken từ context
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );
  
  http.interceptors.response.use(
    response => {
      return response;
    },
    async error => {
      const originalRequest = error.config;
  
      if (error.response.status === 401 && error.response.data.new_token && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const newToken = error.response.data.new_token;
          updateToken(newToken); // Sử dụng updateToken từ context
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          return http(originalRequest);
        } catch (tokenRefreshError) {
          // Handle refresh token error here
          clearToken(); // Clear the token if refresh fails
          navigate('/login'); // Redirect to login
          toast.error('Session expired. Please log in again.', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          return Promise.reject(tokenRefreshError);
        }
      }
  
      return Promise.reject(error);
    }
  );

  return {
    http,
    accessToken,
    userId,
    username,
    email,
    avatar,
    role,
    hasAccessToken,
    hasUsername,
    saveToken,
    setUsername,
    logout,
  }
}