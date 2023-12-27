import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    Post,
    Req,
    Res,
} from '@nestjs/common'
import AuthService from './auth.service'
import { authDtoType, authReturnDtoType, regDtoType } from './dto/auth.dto'
import { Request, Response } from 'express'

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('')
    async authorization(
        @Body() authDto: authDtoType,
        @Res({ passthrough: true }) res: Response,
    ): Promise<authReturnDtoType> {
        try {
            const data: authReturnDtoType =
                await this.authService.authorizationService(authDto)

            res.cookie('refreshToken', data.tokens.refreshToken, {
                maxAge: 45 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                secure: true,
                sameSite: false,
                domain: 'fipimath.netlify.app',
            })

            return data
        } catch (error) {
            throw new HttpException(error.message, error.statusCode)
        }
    }

    @Get('/refresh')
    refreshAccessToken(@Req() request: Request): Promise<authReturnDtoType> {
        const { refreshToken } = request.cookies

        return this.authService.refreshAccessTokenService(refreshToken)
    }

    @Delete('/logout')
    async logout(@Req() request: Request): Promise<number> {
        try {
            const { refreshToken } = request.cookies

            const status: number =
                await this.authService.logoutService(refreshToken)

            return status
        } catch (error) {
            throw new HttpException(error.message, error.statusCode)
        }
    }
}

@Controller('registration')
export class RegController {
    constructor(private authService: AuthService) {}

    @Post('')
    registration(
        @Body() regDto: regDtoType,
    ): Promise<typeof HttpStatus.CREATED> {
        return this.authService.registrationService(regDto)
    }
}
