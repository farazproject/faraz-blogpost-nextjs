import * as Yup from "yup"
import { VALIDATION, CATEGORIES, USER_ROLES } from "./constants"

export const loginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email format").required("Email is required"),
  password: Yup.string()
    .min(VALIDATION.PASSWORD_MIN_LENGTH, `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`)
    .required("Password is required"),
  role: Yup.string().oneOf(Object.values(USER_ROLES), "Please select a valid role").required("Role is required"),
})

export const registerSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email format").required("Email is required"),
  password: Yup.string()
    .min(VALIDATION.PASSWORD_MIN_LENGTH, `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`)
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Please confirm your password"),
  role: Yup.string().oneOf(Object.values(USER_ROLES), "Please select a valid role").required("Role is required"),
})

export const postSchema = Yup.object().shape({
  title: Yup.string()
    .max(VALIDATION.TITLE_MAX_LENGTH, `Title must be less than ${VALIDATION.TITLE_MAX_LENGTH} characters`)
    .required("Title is required"),
  content: Yup.string().required("Content is required"),
  excerpt: Yup.string()
    .max(VALIDATION.EXCERPT_MAX_LENGTH, `Excerpt must be less than ${VALIDATION.EXCERPT_MAX_LENGTH} characters`)
    .required("Excerpt is required"),
  category: Yup.string().oneOf(CATEGORIES, "Please select a valid category").required("Category is required"),
})

export const profileSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  bio: Yup.string().max(VALIDATION.BIO_MAX_LENGTH, `Bio must be less than ${VALIDATION.BIO_MAX_LENGTH} characters`),
  email: Yup.string().email("Invalid email format").required("Email is required"),
})
