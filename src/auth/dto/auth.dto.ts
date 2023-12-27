import { Types } from 'mongoose'
import { tokensDtoType } from './token.dto'

export class authDtoType {
    username: string
    password: string
    rememberMe: boolean
}

export class tokenPayloadType {
    username: string
    email: string
}

export class authReturnDtoType {
    user: userReturnDto
    tokens: tokensDtoType
}

export class regDtoType {
    username: string
    password: string
    email: string
}

export class userReturnDto {
    username
    email
    id: Types.ObjectId

    constructor(user: userDtoType) {
        ;(this.username = user.username),
            (this.email = user.email),
            (this.id = user._id)
    }
}

export class userDtoType {
    username: string
    email: string
    password: string
    _id: Types.ObjectId
}
