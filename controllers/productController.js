const path = require('path')
const Product = require('../model/Product')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors/')


const createProduct = async (req, res) => {
  req.body.user = req.user.userId
  const product = await Product.create(req.body)
  res.status(StatusCodes.CREATED).json({ product })
}

const getAllProducts = async (req, res) => {
  const products = await Product.find({})
  res.status(StatusCodes.OK).json({ products })
}

const getSingleProduct = async (req, res) => {
  const id = req.params.id
  const product = await Product.findOne({ _id: id}).populate('reviews')
  if(!product){
    throw new CustomError.NotFoundError('Product not found')
  }
  
  res.status(StatusCodes.OK).json({ product })
}

const updateProduct = async (req, res) => {
  const id = req.params.id
  const product = await Product.findByIdAndUpdate({ _id: id}, req.body, {
    new: true, 
    runValidators: true
  })
  if (!product) {
    throw new CustomError.NotFoundError(`No product with id: ${id}`)
  }
  res.status(StatusCodes.OK).json({ product })
}

const deleteProduct = async (req, res) => {
  const id = req.params.id
  const product = await Product.findOne({ _id: id })
  if (!product) {
    throw new CustomError.NotFoundError(`No product with id: ${id}`)
  }
  await product.remove()
  res.status(StatusCodes.OK).json({msg: 'Success! Product removed!'})
}

const uploadImage = async (req, res) => {
  console.log(req.files.photoUpload)
  if (!req.files) {
    throw new CustomError.BadRequestError('No File Uploaded')
  }
  const productImage = req.files.photoUpload
  
  if (!productImage.mimetype.startsWith('image')) {
    throw new CustomError.BadRequestError('Please Upload Image')
  }

  const maxSize = 1024 * 1024 

  if (productImage.size > maxSize) {
    throw new CustomError.BadRequestError(
      'Please upload image smaller than 1MB'
    )
  }

  const imagePath = path.join(
    __dirname, 
    '../public/uploads/' + `${productImage.name}`
  )
  productImage.mv(imagePath)
  res.status(StatusCodes.OK).json({msg: 'succes'})
}

module.exports = {
  createProduct, 
  getAllProducts, 
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage
}