const jwt = require('jsonwebtoken')

const createJWT = async ({payload}) => {
  const token = await jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  })
  return token
}

const isTokenValid = async ({ token }) => await jwt.verify(token, process.env.JWT_SECRET)

const attachCookiesToResponse = async ({ res, user }) => {
  const token = await createJWT({ payload: user })
  const oneDay = 1000 * 60 * 60 * 24
  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production',
    signed: true
  })
}



module.exports = {
  createJWT, 
  isTokenValid, 
  attachCookiesToResponse
}