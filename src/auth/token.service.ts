import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { tokenPayloadType, userDtoType, userReturnDto } from './dto/auth.dto'
import * as jwt from 'jsonwebtoken'
import { generateTokensDtoType, tokensDtoType } from './dto/token.dto'
import { Token } from 'src/schemas/token.schema'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

@Injectable()
export default class TokenService {
    constructor(@InjectModel(Token.name) private tokenModel: Model<Token>) {}

    validateAccessToken(accessToken: string): userReturnDto {
        if (!accessToken)
            throw new HttpException(
                'Пользователь не авторизован',
                HttpStatus.UNAUTHORIZED,
            )

        const userData: jwt.JwtPayload | string = jwt.verify(
            accessToken,
            process.env.JWT_ACCESS_KEY,
        )

        const userDto = new userReturnDto(userData as userDtoType)

        return userDto
    }

    validateRefreshToken(refreshToken: string): userReturnDto {
        if (!refreshToken)
            throw new HttpException(
                'Пользователь не авторизован',
                HttpStatus.UNAUTHORIZED,
            )

        const userData: jwt.JwtPayload | string = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_KEY,
        )

        const userDto = new userReturnDto(userData as userDtoType)

        return userDto
    }

    generateTokens(data: generateTokensDtoType): tokensDtoType {
        const expiresIn: string = data.rememberMe ? '45d' : '1d'
        const tokenPayload: tokenPayloadType = {
            username: data.username,
            email: data.email,
        }

        const refreshToken: string = jwt.sign(
            tokenPayload,
            process.env.JWT_REFRESH_KEY,
            {
                expiresIn: expiresIn,
            },
        )
        const accessToken: string = jwt.sign(
            tokenPayload,
            process.env.JWT_ACCESS_KEY,
            {
                expiresIn: '30m',
            },
        )

        return {
            refreshToken: refreshToken,
            accessToken: accessToken,
        }
    }

    async findToken(token: string): Promise<Token> {
        const tokenFromDb: Token = await this.tokenModel.findOne({
            refreshToken: token,
        })

        return tokenFromDb
    }
}
