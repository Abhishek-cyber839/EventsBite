export interface User {
    userName: string,
    displayName: string,
    token: string,
    image?: string
}

// For Registration Form
export interface UserForm{
    userName?: string,
    displayName?: string,
    password: string,
    email: string,
}
