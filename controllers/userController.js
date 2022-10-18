const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const {
  createTokenUser, 
  attachCookiesToResponse,
  checkPermissions
} = require('../utils')
const User = require('../model/User')


const getAllUsers = async (req, res) => {
  const users = await User.find({role: 'user'}).select('-password')
  res.status(StatusCodes.OK).send({ users })
}

const getSingleUser = async (req, res) => {
  const { id } = req.params
  const user = await User.findOne({ _id : id}).select('-password')
  if (!user){
    throw new CustomError.NotFoundError(`No user with id: ${req.params.id}`)
  }
  checkPermissions(req.user, user._id)
  res.status(StatusCodes.OK).send({ user })
}

const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).send({user : req.user})
}

const updateUser = async (req, res) => {
  const { email, name } = req.body
  if (!email || !name) {
    throw new CustomError.BadRequestError('Please provide all values')
  }
  const user = await User.findOne({ _id: req.user.userId })

  user.email = email
  user.name = name 

  await user.save()

  const tokenUser = createTokenUser(user)
  attachCookiesToResponse( {res, user: tokenUser })
  res.status(StatusCodes.OK).send({msg : 'success'})
}

const updateUserPassword = async (req, res) => {
  const { newPassword, oldPassword } = req.body
  if (!newPassword || !oldPassword) {
    throw new CustomError.BadRequestError('Please provide both values')
  }
  const user = await User.findOne({_id : req.user.userId})
  const passwordCorrect = await user.comparePassword(oldPassword)
  if (!passwordCorrect){
    throw new CustomError.UnauthenticatedError('invalid credentials')
  }
  user.password = newPassword
  await user.save()
  res.status(StatusCodes.OK).send({msg : 'Success! Password Updated!'})
}

module.exports = { 
  getAllUsers, 
  getSingleUser, 
  showCurrentUser, 
  updateUser, 
  updateUserPassword
}