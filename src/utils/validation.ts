import { object, string } from 'yup'

export const userLoginSchema = object({
  username: string()
    .required('用戶名不能留空')
    .matches(/^[a-zA-Z0-9]{1,64}$/, '用戶名只容許 a-z, A-Z, 0-9'),
  password: string()
    .required('密碼不能留空')
    .matches(/^[a-zA-Z0-9!@#$%^&*]{1,64}$/, '密碼只容許 a-z, A-Z, 0-9, !@#$%^&*'),
})

export const userRegisterSchema = userLoginSchema.shape({
  recaptcha_token: string().required('必須完成 Recaptcha 驗證'),
})
