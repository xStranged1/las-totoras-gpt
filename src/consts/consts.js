import dotenv from 'dotenv'
dotenv.config()

let stringAdmin = process.env.ADMIN_NUMBERS
export const ADMIN_NUMBERS = stringAdmin.split(',')

let stringWhite = process.env.WHITE_LIST
export const WHITE_LIST = stringWhite.split(',')