import React, { Fragment, useEffect, useState } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { FaClockRotateLeft, FaFilter, FaPlus, FaProductHunt, FaStar } from "react-icons/fa6";
import { FaBagShopping } from "react-icons/fa6";
import { Button, Divider, Table, Tooltip } from 'antd';
import { MdCategory, MdOutlinePets } from "react-icons/md";
import { VscFeedback } from "react-icons/vsc";
import { FaEye, FaPencilAlt, FaSearch, FaTrash, FaTrashRestore } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import Search from 'antd/es/input/Search';
import './ProductList.scss'
import { toast } from 'react-toastify';
import AuthUser from '../../../../utils/AuthUser';
import currency from '../../../../utils/currency';
import { BiSolidCategory } from 'react-icons/bi';
import Column from 'antd/es/table/Column';
import Swal from 'sweetalert2';
import { format } from 'date-fns';
import { BeatLoader } from 'react-spinners';
import { storage } from '../../../../utils/firebase';
import { getDownloadURL, listAll, ref } from 'firebase/storage';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import loadingImg from '../../../../assets/images/loading.png'
import { useAuth } from '../../../../utils/AuthContext';

function BoxWrapper({ children, className, menuPosition = 'bottom-0 right-4', isLastCard = false }) {
  return (
    <div className={`relative rounded-lg p-4 flex-1 flex items-center justify-between shadow-lg ${className}`}>
      {children}
      <Menu as="div" className={`absolute ${menuPosition}`}>
        <MenuButton className="inline-flex justify-center w-10 h-10 text-gray-500 hover:text-gray-700">
          {isLastCard ? (
            <HiOutlineDotsHorizontal className="w-6 h-6" />
          ) : (
            <HiOutlineDotsVertical className="w-6 h-6" />
          )}
        </MenuButton>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <MenuItems className="absolute right-0 w-44 -mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
            <div className="py-1">
              <MenuItem>
                {({ focus }) => (
                  <button
                    className={`${focus ? 'bg-gray-100' : ''} flex items-center gap-2 p-2 text-sm text-gray-700 w-full`}
                  >
                    <FaClockRotateLeft />
                    Last day
                  </button>
                )}
              </MenuItem>
              <MenuItem>
                {({ focus }) => (
                  <button
                    className={`${focus ? 'bg-gray-100' : ''} flex items-center gap-2 p-2 text-sm text-gray-700 w-full`}
                  >
                    <FaClockRotateLeft />
                    Last week
                  </button>
                )}
              </MenuItem>
              <MenuItem>
                {({ focus }) => (
                  <button
                    className={`${focus ? 'bg-gray-100' : ''} flex items-center gap-2 p-2 text-sm text-gray-700 w-full`}
                  >
                    <FaClockRotateLeft />
                    Last month
                  </button>
                )}
              </MenuItem>
              <MenuItem>
                {({ focus }) => (
                  <button
                    className={`${focus ? 'bg-gray-100' : ''} flex items-center gap-2 p-2 text-sm text-gray-700 w-full`}
                  >
                    <FaClockRotateLeft />
                    Last year
                  </button>
                )}
              </MenuItem>
            </div>
          </MenuItems>
        </Transition>
      </Menu>
    </div>
  );
}

const ProductList = () => {
  const { http } = AuthUser()
  const { accessToken } = useAuth()
  const navigate = useNavigate()
  const TOOLTIP_MESSAGE = "Need to combine with other * to search"

  const [loading, setLoading] = useState(true);
  const [searchProductInput, setSearchProductInput] = useState('');
  const [searchDeletedProductInput, setSearchDeletedProductInput] = useState('');

  const handleClickCreateButton = () => {
    navigate('/dashboard/product-create')
  }

  // // --------------     PRODUCT BANNER     --------------
  // const DEFAULT_CURRENT_PAGE_NUMBER = 1;
  // const DEFAULT_PAGE_SIZE_NUMBER = 10;
  // const allPageSize = [10, 20, 30];

  // // --------------     RATING BANNER     --------------
  // const DEFAULT_CURRENT_PAGE_NUMBER = 1;
  // const DEFAULT_PAGE_SIZE_NUMBER = 10;
  // const allPageSize = [10, 20, 30];

  // // --------------     ORDER BANNER     --------------
  // const DEFAULT_CURRENT_PAGE_NUMBER = 1;
  // const DEFAULT_PAGE_SIZE_NUMBER = 10;
  // const allPageSize = [10, 20, 30];

  // --------------     PAGINATION STATE     --------------
  const DEFAULT_CURRENT_PAGE_NUMBER = 1;
  const DEFAULT_PAGE_SIZE_NUMBER = 10;
  const allPageSize = [10, 20, 30];

  const [currentPage, setCurrentPage] = useState(DEFAULT_CURRENT_PAGE_NUMBER);
  const [currentPageDeleted, setCurrentPageDeleted] = useState(DEFAULT_CURRENT_PAGE_NUMBER);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE_NUMBER);
  const [pageSizeDeleted, setPageSizeDeleted] = useState(DEFAULT_PAGE_SIZE_NUMBER);

  const [listProducts, setListProducts] = useState([]) // Fetch list products state
  const [totalProducts, setTotalProducts] = useState(0); // Fetch total products state
  const [listDeletedProducts, setListDeletedProducts] = useState([]) // Fetch list deleted products state
  const [totalDeletedProducts, setTotalDeletedProducts] = useState([]) // Fetch total deleted products state

  // --------------     FILTER BY     --------------
  const ALL_FILTER = 'All'
  const BEST_SELLING_FILTER = 'Best Selling'
  const HIGHEST_RATING_FILTER = 'Highest Rating'
  const LOWEST_RATING_FILTER = 'Lowest Rating'
  const PRICE_ASCENDING_FILTER = 'Price Acsending'
  const PRICE_DESCENDING_FILTER = 'Price Descending'
  const SOLD_OUT = 'Sold Out'
  const FIVE_STAR_FILTER = 5
  const FOUR_STAR_FILTER = 4
  const THREE_STAR_FILTER = 3
  const TWO_STAR_FILTER = 2
  const ONE_STAR_FILTER = 1

  const [rating, setRating] = useState(0)
  const [ratingDeleted, setRatingDeleted] = useState(0)

  const listFilter = [
    ALL_FILTER,
    BEST_SELLING_FILTER,
    HIGHEST_RATING_FILTER,
    LOWEST_RATING_FILTER,
    PRICE_ASCENDING_FILTER,
    PRICE_DESCENDING_FILTER,
    SOLD_OUT,
    FIVE_STAR_FILTER,
    FOUR_STAR_FILTER,
    THREE_STAR_FILTER,
    TWO_STAR_FILTER,
    ONE_STAR_FILTER,
  ]

  const [filter, setFilter] = useState(ALL_FILTER)
  const [filterDeleted, setFilterDeleted] = useState(ALL_FILTER)

  const handleFilterChange = (event) => {
    const value = event.target.value

    setFilter(value)
    if (!isNaN(value)) {
      setRating(value)
    }
  }

  const handleFilterDeletedChange = (event) => {
    const value = event.target.value

    setFilterDeleted(value);
    if (!isNaN(value)) {
      setRatingDeleted(value)
    }
  }

  // --------------     CATEGORY BY     --------------
  const ALL_CATEGORY_FILTER = 'All'
  const [category, setCategory] = useState(ALL_CATEGORY_FILTER)
  const [categoryDeleted, setCategoryDeleted] = useState()
  const [listCategories, setListCategories] = useState([])

  const handleCategoryChange = (event) => {
    const value = event.target.value
    setCategory(value)
  }

  const handleCategoryDeletedChange = (event) => {
    const value = event.target.value
    setCategoryDeleted(value)
  }

  // --------------     TARGET BY     --------------
  const ALL_TARGET_FILTER = 'All'
  const DOG_TARGET_FILTER = 'Dog'
  const CAT_TARGET_FILTER = 'Cat'
  const listTarget = [ALL_TARGET_FILTER, DOG_TARGET_FILTER, CAT_TARGET_FILTER]
  const [target, setTarget] = useState(ALL_TARGET_FILTER)
  const [targetDeleted, setTargetDeleted] = useState(ALL_TARGET_FILTER)

  const handleTargetChange = (event) => {
    const value = event.target.value
    setTarget(value);
  }

  const handleTargetDeletedChange = (event) => {
    const value = event.target.value
    setTargetDeleted(value);
  }

  // --------------     SEARCH PRODUCT     --------------
  const handleSearchProduct = (e) => {
    setSearchProductInput(e.target.value)
  }

  const handleSearchDeletedProduct = (e) => {
    setSearchDeletedProductInput(e.target.value)
  }
  
  const onSearch = () => {
    const lowercaseTarget = target.charAt(0).toLocaleLowerCase() + target.slice(1)

    http.get(`shop/products/search?page_number=${currentPage}&num_of_page=${pageSize}&category=${category}&target=${lowercaseTarget}&name=${searchProductInput}`)
      .then((resolve) => {
        console.log(resolve)
        
        const productData = resolve.data.data
        setTotalProducts(resolve.data.pagination.total)

        const productsWithImagesPromises = productData.map((product) => {
          return new Promise((resolve) => {
            fetchImages(product.image, (fetchedImages) => {
              resolve({ ...product, image_url: fetchedImages[0] || '' });
            });
          });
        });

        Promise.all(productsWithImagesPromises).then((productsWithImages) => {
          setListProducts(productsWithImages);
          setLoading(false);
        });

        toast.success('Successfully search product', {
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
      .catch((reject) => {
        console.log(reject)
        if (reject.response.status === 404) {
          toast.error(reject.response.data.message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: 0,
            theme: "colored",
          })
        }
      })
  }

  const onSearchDeleted = () => {
    const lowercaseTarget = targetDeleted.charAt(0).toLocaleLowerCase() + targetDeleted.slice(1)

    http.get(`shop/products/search-deleted?page_number=${currentPageDeleted}&num_of_page=${pageSizeDeleted}&category=${categoryDeleted}&target=${lowercaseTarget}&name=${searchDeletedProductInput}`)
      .then((resolve) => {
        const productData = resolve.data.data
        setTotalDeletedProducts(resolve.data.pagination.total)

        const productsWithImagesPromises = productData.map((product) => {
          return new Promise((resolve) => {
            fetchImages(product.image, (fetchedImages) => {
              resolve({ ...product, image_url: fetchedImages[0] || '' });
            });
          });
        });

        Promise.all(productsWithImagesPromises).then((productsWithImages) => {
          setListDeletedProducts(productsWithImages);
          setLoading(false);
        });

        toast.success('Successfully search deleted product', {
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
      .catch((reject) => {
        if (reject.response.status === 404) {
          toast.error(reject.response.data.message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: 0,
            theme: "colored",
          })
        }
      })
  }

  // --------------     ACTION HANDLER     --------------
  const handleViewProduct = (record) => {
    navigate(`/dashboard/product-view/${record.id}`)
  }

  const handleUpdateProduct = (record) => {
    navigate(`/dashboard/product-update/${record.id}`)
  }

  const handleDeleteProduct = (record) => {
    const productId = record.id
    Swal.fire({
      title: 'Hold up!',
      text: 'Want to delete this product from selling products?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'OK',
      confirmButtonColor: '#d33',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        http.delete(`shop/products/${productId}`)
          .then((resolve) => {
            if (resolve.status === 404) {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: resolve.data.message,
              })
            } else if (resolve.status === 200) {
              Swal.fire({
                icon: "success",
                title: resolve.data.message,
                text: `You can restore product anytime you want`,
              }).then(() => {
                navigate(0)
              })
            }
          })
          .catch((reject) => {
            console.log(reject)
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong. Try again",
            })
          })
      }
    })
  }

  const handleRestoreProduct = (record) => {
    const productId = record.id
    Swal.fire({
      title: 'Restore',
      text: 'Want to restore this product?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: '#3085d6',
      cancelButtonText: 'Cancel',
      cancelButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        http.put(`shop/products/${productId}/restore`)
          .then((resolve) => {
            if (resolve.status === 404) {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: resolve.data.message,
              })
            } else if (resolve.status === 200) {
              Swal.fire({
                icon: "success",
                title: resolve.data.message,
                text: `Please check at selling products table`,
              }).then(() => {
                navigate(0)
              })
            }
          })
          .catch((reject) => {
            console.log(reject)
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong. Try again",
            })
          })
      }
    })
  }

  // --------------------------     Paginate     --------------------------
  const handleClickPaginate = (page, pageSize) => {
    setCurrentPage(page)
    setPageSize(pageSize)
  }

  const handleShowSizeChange = (currentPage, pageSize) => {
    setCurrentPage(currentPage);
    setPageSize(pageSize)
  }

  // DELETED PRODUCTS
  const handleClickPaginateDeleted = (page, pageSize) => {
    setCurrentPageDeleted(page)
    setPageSizeDeleted(pageSize)
  }

  const handleShowSizeChangeDeleted = (currentPage, pageSize) => {
    setCurrentPageDeleted(currentPage);
    setPageSizeDeleted(pageSize)
  }

  // --------------------------     Fetch API     --------------------------
  useEffect(() => {
    const fetchProductCategories = () => {
      http.get('shop/product-categories/type')
        .then((resolve) => {
          const categories = [ALL_CATEGORY_FILTER, ...resolve.data.data];
          setCategory(categories[0]);
          setListCategories(categories);
        })
        .catch((reject) => {
          console.log(reject);
        })
    }

    fetchProductCategories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken])

  // --------------------------     Fetch Firebase Image     --------------------------
  const fetchImages = (imagePath, callback) => {
    const fetchedImages = [];
    const imageRef = ref(storage, imagePath);
    listAll(imageRef)
      .then((response) => {
        const promises = response.items.map((item) =>
          getDownloadURL(item)
            .then((url) => {
              fetchedImages.push(url);
            })
            .catch((error) => {
              console.log(error);
            })
        );
        Promise.all(promises).then(() => {
          callback(fetchedImages);
        });
      })
      .catch((error) => {
        console.log(error);
        callback([]);
      });
  };

  // --------------------------     Fetch Filter API     --------------------------
  useEffect(() => {
    const fetchProducts = () => {
      if (filter === ALL_FILTER) {
        if (loading === false) {
          setLoading(true)
        }

        http.get(`shop/products/paginate?page_number=${currentPage}&num_of_page=${pageSize}`)
          .then((resolve) => {
            const productData = resolve.data.data
            setTotalProducts(resolve.data.total_products)

            const productsWithImagesPromises = productData.map((product) => {
              return new Promise((resolve) => {
                fetchImages(product.image, (fetchedImages) => {
                  resolve({ ...product, image_url: fetchedImages[0] || '' });
                });
              });
            });

            Promise.all(productsWithImagesPromises).then((productsWithImages) => {
              setListProducts(productsWithImages);
              setLoading(false);
            });
          })
          .catch((reject) => {
            if (reject.response.status === 404) {
              toast.error(reject.response.data.message, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: 0,
                theme: "colored",
              })
            }
          })
      } else if (filter === BEST_SELLING_FILTER) {
        http.get(`shop/products/best-selling?page_number=${currentPage}&num_of_page=${pageSize}`)
          .then((resolve) => {
            const productData = resolve.data.data
            setTotalProducts(resolve.data.total_products)

            const productsWithImagesPromises = productData.map((product) => {
              return new Promise((resolve) => {
                fetchImages(product.image, (fetchedImages) => {
                  resolve({ ...product, image_url: fetchedImages[0] || '' });
                });
              });
            });

            Promise.all(productsWithImagesPromises).then((productsWithImages) => {
              setListProducts(productsWithImages);
            });

            toast.success('Successfully filtered by best-selling', {
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
          .catch((reject) => {
            if (reject.response.status === 404) {
              toast.error(reject.response.data.message, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: 0,
                theme: "colored",
              })
            }
          })
      } else if (filter === HIGHEST_RATING_FILTER) {
        http.get(`shop/products/highest-rating?page_number=${currentPage}&num_of_page=${pageSize}`)
          .then((resolve) => {
            const productData = resolve.data.data
            setTotalProducts(resolve.data.total_products)

            const productsWithImagesPromises = productData.map((product) => {
              return new Promise((resolve) => {
                fetchImages(product.image, (fetchedImages) => {
                  resolve({ ...product, image_url: fetchedImages[0] || '' });
                });
              });
            });

            Promise.all(productsWithImagesPromises).then((productsWithImages) => {
              setListProducts(productsWithImages);
            });

            toast.success('Successfully filtered by highest rating', {
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
          .catch((reject) => {
            if (reject.response.status === 404) {
              toast.error(reject.response.data.message, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: 0,
                theme: "colored",
              })
            }
          })
      } else if (filter === LOWEST_RATING_FILTER) {
        http.get(`shop/products/lowest-rating?page_number=${currentPage}&num_of_page=${pageSize}`)
          .then((resolve) => {
            const productData = resolve.data.data
            setTotalProducts(resolve.data.total_products)

            const productsWithImagesPromises = productData.map((product) => {
              return new Promise((resolve) => {
                fetchImages(product.image, (fetchedImages) => {
                  resolve({ ...product, image_url: fetchedImages[0] || '' });
                });
              });
            });

            Promise.all(productsWithImagesPromises).then((productsWithImages) => {
              setListProducts(productsWithImages);
            });

            toast.success('Successfully filtered by lowest rating', {
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
          .catch((reject) => {
            if (reject.response.status === 404) {
              toast.error(reject.response.data.message, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: 0,
                theme: "colored",
              })
            }
          })
      } else if (filter === SOLD_OUT) {
        http.get(`shop/products/sold-out?page_number=${currentPage}&num_of_page=${pageSize}`)
          .then((resolve) => {
            const productData = resolve.data.data
            setTotalProducts(resolve.data.total_products)

            const productsWithImagesPromises = productData.map((product) => {
              return new Promise((resolve) => {
                fetchImages(product.image, (fetchedImages) => {
                  resolve({ ...product, image_url: fetchedImages[0] || '' });
                });
              });
            });

            Promise.all(productsWithImagesPromises).then((productsWithImages) => {
              setListProducts(productsWithImages);
            });

            toast.success('Successfully filtered by sold-out', {
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
          .catch((reject) => {
            if (reject.response.status === 404) {
              toast.error(reject.response.data.message, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: 0,
                theme: "colored",
              })
            }
          })
      } else if (filter === PRICE_ASCENDING_FILTER) {
        http.get(`shop/products/sort?page_number=${currentPage}&num_of_page=${pageSize}`)
          .then((resolve) => {
            const productData = resolve.data.data
            setTotalProducts(resolve.data.pagination.total)

            const productsWithImagesPromises = productData.map((product) => {
              return new Promise((resolve) => {
                fetchImages(product.image, (fetchedImages) => {
                  resolve({ ...product, image_url: fetchedImages[0] || '' });
                });
              });
            });

            Promise.all(productsWithImagesPromises).then((productsWithImages) => {
              setListProducts(productsWithImages);
            });

            toast.success('Successfully filtered by ascending price', {
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
          .catch((reject) => {
            if (reject.response.status === 404) {
              toast.error(reject.response.data.message, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: 0,
                theme: "colored",
              })
            }
          })
      } else if (filter === PRICE_DESCENDING_FILTER) {
        http.get(`shop/products/sort?page_number=${currentPage}&num_of_page=${pageSize}&order=desc`)
          .then((resolve) => {
            const productData = resolve.data.data
            setTotalProducts(resolve.data.pagination.total)

            const productsWithImagesPromises = productData.map((product) => {
              return new Promise((resolve) => {
                fetchImages(product.image, (fetchedImages) => {
                  resolve({ ...product, image_url: fetchedImages[0] || '' });
                });
              });
            });

            Promise.all(productsWithImagesPromises).then((productsWithImages) => {
              setListProducts(productsWithImages);
            });

            toast.success('Successfully filtered by descending price', {
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
          .catch((reject) => {
            if (reject.response.status === 404) {
              toast.error(reject.response.data.message, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: 0,
                theme: "colored",
              })
            }
          })
      } else {
        http.get(`shop/products/rating?page_number=${currentPage}&num_of_page=${pageSize}&rating=${rating}`)
          .then((resolve) => {
            const productData = resolve.data.data
            setTotalProducts(resolve.data.pagination.total)

            const productsWithImagesPromises = productData.map((product) => {
              return new Promise((resolve) => {
                fetchImages(product.image, (fetchedImages) => {
                  resolve({ ...product, image_url: fetchedImages[0] || '' });
                });
              });
            });

            Promise.all(productsWithImagesPromises).then((productsWithImages) => {
              setListProducts(productsWithImages);
            });

            toast.success(`Successfully filtered by ${rating} star`, {
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
          .catch((reject) => {
            if (reject.response.status === 404) {
              toast.error(reject.response.data.message, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: 0,
                theme: "colored",
              })
            }
          })
      }
    }

    fetchProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, filter, accessToken])

  // --------------------------     Fetch Deleted Products API     --------------------------
  useEffect(() => {
    const fetchDeletedProducts = () => {
      if (filterDeleted === ALL_FILTER) {
        if (loading === false) {
          setLoading(true)
        }

        http.get('shop/products/deleted')
          .then((resolve) => {
            const productDeletedData = resolve.data.data
            setTotalDeletedProducts(resolve.data.pagination.total)

            const productsDeletedWithImagesPromises = productDeletedData.map((productDeleted) => {
              return new Promise((resolve) => {
                fetchImages(productDeleted.image, (fetchedImages) => {
                  resolve({ ...productDeleted, image_url: fetchedImages[0] || '' });
                });
              });
            });

            Promise.all(productsDeletedWithImagesPromises).then((productsDeletedWithImages) => {
              setListDeletedProducts(productsDeletedWithImages);
              setLoading(false);
            });
          })
          .catch((reject) => {
            console.log(reject)
          })
      } else if (filterDeleted === BEST_SELLING_FILTER) {
        http.get(`shop/products/best-selling?page_number=${currentPage}&num_of_page=${pageSize}&deleted=true`)
          .then((resolve) => {
            const productDeletedData = resolve.data.data
            setTotalDeletedProducts(resolve.data.total_products)

            const productsDeletedWithImagesPromises = productDeletedData.map((productDeleted) => {
              return new Promise((resolve) => {
                fetchImages(productDeleted.image, (fetchedImages) => {
                  resolve({ ...productDeleted, image_url: fetchedImages[0] || '' });
                });
              });
            });

            Promise.all(productsDeletedWithImagesPromises).then((productsDeletedWithImages) => {
              setListDeletedProducts(productsDeletedWithImages);
            });

            toast.success('Successfully filtered by best-selling', {
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
          .catch((reject) => {
            if (reject.response.status === 404) {
              toast.error(reject.response.data.message, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: 0,
                theme: "colored",
              })
            }
          })
      } else if (filterDeleted === HIGHEST_RATING_FILTER) {
        http.get(`shop/products/highest-rating?page_number=${currentPage}&num_of_page=${pageSize}&deleted=true`)
          .then((resolve) => {
            const productDeletedData = resolve.data.data
            setTotalDeletedProducts(resolve.data.total_products)

            const productsDeletedWithImagesPromises = productDeletedData.map((productDeleted) => {
              return new Promise((resolve) => {
                fetchImages(productDeleted.image, (fetchedImages) => {
                  resolve({ ...productDeleted, image_url: fetchedImages[0] || '' });
                });
              });
            });

            Promise.all(productsDeletedWithImagesPromises).then((productsDeletedWithImages) => {
              setListDeletedProducts(productsDeletedWithImages);
            });

            toast.success('Successfully filtered by highest rating', {
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
          .catch((reject) => {
            if (reject.response.status === 404) {
              toast.error(reject.response.data.message, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: 0,
                theme: "colored",
              })
            }
          })
      } else if (filterDeleted === LOWEST_RATING_FILTER) {
        http.get(`shop/products/lowest-rating?page_number=${currentPage}&num_of_page=${pageSize}`)
          .then((resolve) => {
            const productData = resolve.data.data
            setTotalDeletedProducts(resolve.data.total_products)

            const productsWithImagesPromises = productData.map((product) => {
              return new Promise((resolve) => {
                fetchImages(product.image, (fetchedImages) => {
                  resolve({ ...product, image_url: fetchedImages[0] || '' });
                });
              });
            });

            Promise.all(productsWithImagesPromises).then((productsWithImages) => {
              setListDeletedProducts(productsWithImages);
            });

            toast.success('Successfully filtered by lowest rating', {
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
          .catch((reject) => {
            if (reject.response.status === 404) {
              toast.error(reject.response.data.message, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: 0,
                theme: "colored",
              })
            }
          })
      } else if (filterDeleted === SOLD_OUT) {
        http.get(`shop/products/sold-out?page_number=${currentPage}&num_of_page=${pageSize}&deleted=true`)
          .then((resolve) => {
            const productData = resolve.data.data
            setTotalDeletedProducts(resolve.data.total_products)

            const productsWithImagesPromises = productData.map((product) => {
              return new Promise((resolve) => {
                fetchImages(product.image, (fetchedImages) => {
                  resolve({ ...product, image_url: fetchedImages[0] || '' });
                });
              });
            });

            Promise.all(productsWithImagesPromises).then((productsWithImages) => {
              setListDeletedProducts(productsWithImages);
            });

            toast.success('Successfully filtered by sold-out', {
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
          .catch((reject) => {
            if (reject.response.status === 404) {
              toast.error(reject.response.data.message, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: 0,
                theme: "colored",
              })
            }
          })
      } else if (filterDeleted === PRICE_ASCENDING_FILTER) {
        http.get(`shop/products/sort?page_number=${currentPage}&num_of_page=${pageSize}&deleted=true`)
          .then((resolve) => {
            const productDeletedData = resolve.data.data
            setTotalDeletedProducts(resolve.data.pagination.total)

            const productsDeletedWithImagesPromises = productDeletedData.map((productDeleted) => {
              return new Promise((resolve) => {
                fetchImages(productDeleted.image, (fetchedImages) => {
                  resolve({ ...productDeleted, image_url: fetchedImages[0] || '' });
                });
              });
            });

            Promise.all(productsDeletedWithImagesPromises).then((productsDeletedWithImages) => {
              setListDeletedProducts(productsDeletedWithImages);
            });

            toast.success('Successfully filtered by ascending price', {
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
          .catch((reject) => {
            if (reject.response.status === 404) {
              toast.error(reject.response.data.message, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: 0,
                theme: "colored",
              })
            }
          })
      } else if (filterDeleted === PRICE_DESCENDING_FILTER) {
        http.get(`shop/products/sort?page_number=${currentPage}&num_of_page=${pageSize}&order=desc&deleted=true`)
          .then((resolve) => {
            const productDeletedData = resolve.data.data
            setTotalDeletedProducts(resolve.data.pagination.total)

            const productsDeletedWithImagesPromises = productDeletedData.map((productDeleted) => {
              return new Promise((resolve) => {
                fetchImages(productDeleted.image, (fetchedImages) => {
                  resolve({ ...productDeleted, image_url: fetchedImages[0] || '' });
                });
              });
            });

            Promise.all(productsDeletedWithImagesPromises).then((productsDeletedWithImages) => {
              setListDeletedProducts(productsDeletedWithImages);
            });

            toast.success('Successfully filtered by descending price', {
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
          .catch((reject) => {
            if (reject.response.status === 404) {
              toast.error(reject.response.data.message, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: 0,
                theme: "colored",
              })
            }
          })
      } else {
        http.get(`shop/products/rating?page_number=${currentPage}&num_of_page=${pageSize}&rating=${ratingDeleted}&deleted=true`)
          .then((resolve) => {
            const productDeletedData = resolve.data.data
            setTotalDeletedProducts(resolve.data.pagination.total)

            const productsDeletedWithImagesPromises = productDeletedData.map((productDeleted) => {
              return new Promise((resolve) => {
                fetchImages(productDeleted.image, (fetchedImages) => {
                  resolve({ ...productDeleted, image_url: fetchedImages[0] || '' });
                });
              });
            });

            Promise.all(productsDeletedWithImagesPromises).then((productsDeletedWithImages) => {
              setListDeletedProducts(productsDeletedWithImages);
            });

            toast.success(`Successfully filtered by ${ratingDeleted} star`, {
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
          .catch((reject) => {
            if (reject.response.status === 404) {
              toast.error(reject.response.data.message, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: 0,
                theme: "colored",
              })
            }
          })
      }
    }

    fetchDeletedProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPageDeleted, pageSizeDeleted, filterDeleted, accessToken])

  if (loading) {
    return (
      <div className='h-full'>
        <BeatLoader className='relative top-1/2 transform -translate-y-1/2' color="#2463eb" size={36} />
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-row justify-between items-center gap-10 mt-4'>
        <BoxWrapper className="bg-gradient-to-t from-blue-600 to-blue-400 text-white">
          <div className="flex flex-col items-start justify-between w-full pl-2">
            <div className="flex items-center">
              <strong className="text-2xl font-bold">547</strong>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xl font-semibold">Total Products</span>
              <span className="text-md">+95% Last Month</span>
            </div>
          </div>
          <div className='absolute -top-6 right-5 text-blue-300'>
            <FaBagShopping size={50} />
          </div>
        </BoxWrapper>
        <BoxWrapper className="bg-gradient-to-t from-green-600 to-green-400 text-white">
          <div className="flex flex-col items-start justify-between w-full pl-2">
            <div className="flex items-center">
              <strong className="text-2xl font-bold">605</strong>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xl font-semibold">Total Ratings</span>
              <span className="text-md">+95% Last Month</span>
            </div>
          </div>
          <div className='absolute -top-6 right-5 text-green-300'>
            <MdCategory size={50} />
          </div>
        </BoxWrapper>
        <BoxWrapper className="bg-gradient-to-t from-purple-600 to-purple-400 text-white">
          <div className="flex flex-col items-start justify-between w-full pl-2">
            <div className="flex items-center">
              <strong className="text-2xl font-bold">428</strong>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xl font-semibold">Total Orders</span>
              <span className="text-md">+95% Last Month</span>
            </div>
          </div>
          <div className='absolute -top-6 right-5 text-purple-300'>
            <VscFeedback size={50} />
          </div>
        </BoxWrapper>
      </div>
      <div className='flex flex-col items-start justify-between bg-white p-6 rounded-md'>
        <div className='flex flex-row items-start justify-end w-full mb-6'>
          <button
            onClick={handleClickCreateButton}
            className='flex flex-row items-center gap-2 px-4 py-2 bg-blue-600 rounded-md hover:opacity-80 transition duration-300'
          >
            <FaPlus size={18} style={{ color: 'white' }} />
            <p className='text text-[16] text-white'>Create</p>
          </button>
        </div>
        <Divider orientation='left'>
          <div className='flex flex-row gap-2 items-center'>
            <FaProductHunt />
            <span className='text-gray-800 font-bold text-md'>Selling Products</span>
          </div>
        </Divider>
        <div className='flex flex-row items-center w-full gap-6 mb-6'>
          <div className='flex flex-row items-center justify-between gap-6'>
            <div className='flex flex-col items-start'>
              <div className='flex flex-row items-center gap-1'>
                <FaFilter />
                <span className='text-md font-semibold'>FILTER BY</span>
              </div>
              <select
                className='minimal w-52 mt-2 h-10 px-4 py-2 border border-gray-300 rounded-md shadow-sm hover:cursor-pointer hover:border-blue-500 transition duration-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none text-left'
                value={filter}
                onChange={handleFilterChange}
              >
                {listFilter.map((item, index) => (
                  <option key={index} value={item}>
                    {isNaN(item) ? item : `${item} Star`}
                  </option>
                ))}
              </select>
            </div>
            <div className='flex flex-col items-start'>
              <div className='flex flex-row items-center gap-1'>
                <BiSolidCategory />
                <Tooltip title={TOOLTIP_MESSAGE}>
                  <p className='text-md font-semibold'>CATEGORY GROUP BY <span className='text-red-600'>*</span></p>
                </Tooltip>
              </div>
              <select
                className='minimal w-72 mt-2 h-10 px-4 py-2 border border-gray-300 rounded-md shadow-sm hover:cursor-pointer hover:border-blue-500 transition duration-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none text-left'
                value={category}
                onChange={handleCategoryChange}
              >
                {listCategories.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div className='flex flex-col items-start'>
              <div className='flex flex-row items-center gap-1'>
                <MdOutlinePets />
                <Tooltip title={TOOLTIP_MESSAGE}>
                  <p className='text-md font-semibold'>TARGET BY <span className='text-red-600'>*</span></p>
                </Tooltip>
              </div>
              <select
                className='minimal w-40 mt-2 h-10 px-4 py-2 border border-gray-300 rounded-md shadow-sm hover:cursor-pointer hover:border-blue-500 transition duration-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none text-left'
                value={target}
                onChange={handleTargetChange}
              >
                {listTarget.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className='flex flex-col items-start w-full'>
            <div className='flex flex-row items-center gap-1'>
              <FaSearch />
              <Tooltip title={TOOLTIP_MESSAGE}>
                <p className='text-md font-semibold'>SEARCH BY <span className='text-red-600'>*</span></p>
              </Tooltip>
            </div>
            <Search
              className='mt-2'
              placeholder="Search Product"
              enterButton={
                <Button type="primary" disabled={searchProductInput.trim() === ''}>
                  Search
                </Button>
              }
              size="large"
              onSearch={onSearch}
              onChange={handleSearchProduct}
              value={searchProductInput}
            />
          </div>
        </div>
        {/* PRODUCTS */}
        <div className='w-full'>
          <Table
            bordered
            dataSource={listProducts}
            pagination={{
              defaultCurrent: DEFAULT_CURRENT_PAGE_NUMBER,
              defaultPageSize: DEFAULT_PAGE_SIZE_NUMBER,
              hideOnSinglePage: true,
              current: currentPage,
              pageSizeOptions: allPageSize,
              showSizeChanger: true,
              showQuickJumper: true,
              total: totalProducts,
              showTotal: (totalProducts) => `Total ${totalProducts} products`,
              onChange: handleClickPaginate,
              onShowSizeChange: handleShowSizeChange
            }}
          >
            <Column
              align='left'
              title='UID'
              key='index'
              render={(text, record, index) => <span className='font-semibold'>#{currentPage * DEFAULT_PAGE_SIZE_NUMBER - DEFAULT_PAGE_SIZE_NUMBER + index + 1}</span>}
            />
            <Column
              align='left'
              title='Product Name'
              key='name'
              dataIndex='name'
              render={(text, record, index) => {
                return (
                  <div className='flex flex-row items-center gap-3'>
                    <LazyLoadImage
                      key={index}
                      src={record.image_url}
                      alt={`Product ${index}`}
                      className='w-10 h-10 bg-white border-neutral-300 border-2 rounded-md p-1 object-cover'
                      effect='blur'
                      placeholderSrc={loadingImg}
                    />
                    <span className='font-semibold'>{text}</span>
                  </div>
                )
              }}
            />
            <Column
              align='left'
              title='Category'
              key='category'
              dataIndex='category'
              render={(text, record) => text.name} // Renderer of the table cell. The return value should be a ReactNode (function(text, record, index) {})
            />
            <Column
              align='left'
              title='Target'
              key='target'
              dataIndex={['category', 'target']} // Display field of the data record, support nest path by string array
              render={(text, record) => text.charAt(0).toUpperCase() + text.slice(1)}
            />
            <Column
              align='left'
              title='Price'
              key='price'
              dataIndex='price'
              render={(text, record) => <span className='font-semibold'>{currency(text)}</span>}
            />
            <Column
              align='left'
              title='Stock'
              key='stock'
              dataIndex='quantity'
            />
            <Column
              align='left'
              title='Solded'
              key='sold_quantity'
              dataIndex='sold_quantity'
            />
            <Column
              align='left'
              title='Rating'
              key='rating'
              dataIndex='rating'
              width={110}
              render={(text, record) => {
                const roundedRating = parseFloat(text).toFixed(1);

                return (
                  <div className='flex flex-row gap-2 items-center'>
                    <FaStar style={{ color: '#fadb14' }} />
                    <p className='text-sm font-bold'>{roundedRating} <span className='font-normal'>({record.rating_count})</span></p>
                  </div>
                )
              }}
            />
            <Column
              align='center'
              title='Action'
              key='solded'
              dataIndex='rating'
              render={(text, record) => (
                <div className="flex flex-row items-center justify-evenly space-x-2 w-full my-1">
                  <button onClick={() => handleViewProduct(record)} className='bg-purple-200 rounded-md p-1.5'>
                    <FaEye size={18} className='text-purple-600' />
                  </button>
                  <button onClick={() => handleUpdateProduct(record)} className='bg-blue-200 rounded-md p-1.5'>
                    <FaPencilAlt size={18} className='text-blue-600' />
                  </button>
                  <button onClick={() => handleDeleteProduct(record)} className='bg-red-200 rounded-md p-1.5'>
                    <FaTrash size={18} className='text-red-600' />
                  </button>
                </div>
              )}
            />
          </Table>
        </div>
        {/* DIVIDE LINE */}
        <Divider orientation='left'>
          <div className='flex flex-row gap-2 items-center'>
            <FaTrash />
            <span className='text-gray-800 font-bold text-md'>Deleted Products</span>
          </div>
        </Divider>
        {/* DELETED PRODUCTS */}
        <div className='flex flex-row items-center w-full gap-6 mb-6'>
          <div className='flex flex-row items-center justify-between gap-6'>
            <div className='flex flex-col items-start'>
              <div className='flex flex-row items-center gap-1'>
                <FaFilter />
                <span className='text-md font-semibold'>FILTER BY</span>
              </div>
              <select
                className='minimal w-52 mt-2 h-10 px-4 py-2 border border-gray-300 rounded-md shadow-sm hover:cursor-pointer hover:border-blue-500 transition duration-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none text-left'
                value={filterDeleted}
                onChange={handleFilterDeletedChange}
              >
                {listFilter.map((item, index) => (
                  <option key={index} value={item}>
                    {isNaN(item) ? item : `${item} Star`}
                  </option>
                ))}
              </select>
            </div>
            <div className='flex flex-col items-start'>
              <div className='flex flex-row items-center gap-1'>
                <BiSolidCategory />
                <Tooltip title={TOOLTIP_MESSAGE}>
                  <p className='text-md font-semibold'>CATEGORY GROUP BY <span className='text-red-600'>*</span></p>
                </Tooltip>
              </div>
              <select
                className='minimal w-72 mt-2 h-10 px-4 py-2 border border-gray-300 rounded-md shadow-sm hover:cursor-pointer hover:border-blue-500 transition duration-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none text-left'
                value={categoryDeleted}
                onChange={handleCategoryDeletedChange}
              >
                {listCategories.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div className='flex flex-col items-start'>
              <div className='flex flex-row items-center gap-1'>
                <MdOutlinePets />
                <Tooltip title={TOOLTIP_MESSAGE}>
                  <p className='text-md font-semibold'>TARGET BY <span className='text-red-600'>*</span></p>
                </Tooltip>
              </div>
              <select
                className='minimal w-40 mt-2 h-10 px-4 py-2 border border-gray-300 rounded-md shadow-sm hover:cursor-pointer hover:border-blue-500 transition duration-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none text-left'
                value={targetDeleted}
                onChange={handleTargetDeletedChange}
              >
                {listTarget.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className='flex flex-col items-start w-full'>
            <div className='flex flex-row items-center gap-1'>
              <FaSearch />
              <Tooltip title={TOOLTIP_MESSAGE}>
                <p className='text-md font-semibold'>SEARCH BY <span className='text-red-600'>*</span></p>
              </Tooltip>
            </div>
            <Search
              className='mt-2'
              placeholder="Search Deleted Product"
              enterButton={
                <Button type="primary" disabled={searchDeletedProductInput.trim() === ''}>
                  Search
                </Button>
              }
              size="large"
              onSearch={onSearchDeleted}
              onChange={handleSearchDeletedProduct}
              value={searchDeletedProductInput}
            />
          </div>
        </div>
        <div className='w-full'>
          <Table
            bordered
            dataSource={listDeletedProducts}
            pagination={{
              defaultCurrent: DEFAULT_CURRENT_PAGE_NUMBER,
              defaultPageSize: DEFAULT_PAGE_SIZE_NUMBER,
              hideOnSinglePage: true,
              current: currentPageDeleted,
              pageSizeOptions: allPageSize,
              showSizeChanger: true,
              showQuickJumper: true,
              total: totalDeletedProducts,
              showTotal: (totalDeletedProducts) => `Total ${totalDeletedProducts} products`,
              onChange: handleClickPaginateDeleted,
              onShowSizeChange: handleShowSizeChangeDeleted
            }}
          >
            <Column
              align='left'
              title='UID'
              key='index'
              render={(text, record, index) => (
                <span className='font-semibold'>#{currentPageDeleted * DEFAULT_PAGE_SIZE_NUMBER - DEFAULT_PAGE_SIZE_NUMBER + index + 1}</span>
              )}
            />
            <Column
              align='left'
              title='Product Name'
              key='name'
              dataIndex='name'
              render={(text, record, index) => {
                return (
                  <div className='flex flex-row items-center gap-3'>
                    <LazyLoadImage
                      key={index}
                      src={record.image_url}
                      alt={`Product Deleted ${index}`}
                      className='w-10 h-10 bg-white border-neutral-300 border-2 rounded-md p-1 object-cover'
                      effect='blur'
                      placeholderSrc={loadingImg}
                    />
                    <span className='font-semibold'>{text}</span>
                  </div>
                )
              }}
            />
            <Column
              align='left'
              title='Category'
              key='category'
              dataIndex='category'
              render={(text, record) => text.name} // Renderer of the table cell. The return value should be a ReactNode (function(text, record, index) {})
            />
            <Column
              align='left'
              title='Target'
              key='target'
              dataIndex={['category', 'target']} // Display field of the data record, support nest path by string array
              render={(text, record) => text.charAt(0).toUpperCase() + text.slice(1)}
            />
            <Column
              align='left'
              title='Price'
              key='price'
              dataIndex='price'
              render={(text, record) => <span className='font-semibold'>{currency(text)}</span>}
            />
            <Column
              align='left'
              title='Stock'
              key='stock'
              dataIndex='quantity'
            />
            <Column
              align='left'
              title='Solded'
              key='sold_quantity'
              dataIndex='sold_quantity'
            />
            <Column
              align='left'
              title='Rating'
              key='rating'
              dataIndex='rating'
              render={(text, record) => {
                const roundedRating = parseFloat(text).toFixed(1);

                return (
                  <div className='flex flex-row gap-2 items-center'>
                    <FaStar style={{ color: '#fadb14' }} />
                    <p className='text-sm font-bold'>{roundedRating} <span className='font-normal'>({record.rating_count})</span></p>
                  </div>
                )
              }}
            />
            <Column
              align='left'
              title='Deleted at'
              key='deleted_at'
              dataIndex='deleted_at'
              render={(text, record) => {
                const formatTime = (time) => {
                  return format(new Date(time), 'EEEE, dd-MM-yyyy HH:mm');
                };

                return (
                  <span>{formatTime(text)}</span>
                )
              }}
            />
            <Column
              align='center'
              title='Action'
              key='action'
              render={(text, record) => (
                <div className="flex flex-row items-center justify-evenly space-x-2 w-full my-1">
                  <button onClick={() => handleViewProduct(record)} className='bg-purple-200 rounded-md p-1.5'>
                    <FaEye size={18} className='text-purple-600' />
                  </button>
                  <button onClick={() => handleUpdateProduct(record)} className='bg-blue-200 rounded-md p-1.5'>
                    <FaPencilAlt size={18} className='text-blue-600' />
                  </button>
                  <button onClick={() => handleRestoreProduct(record)} className='bg-green-200 rounded-md p-1.5'>
                    <FaTrashRestore size={18} className='text-green-600' />
                  </button>
                </div>
              )}
            />
          </Table>
        </div>
      </div>
    </div>
  )
}

export default ProductList