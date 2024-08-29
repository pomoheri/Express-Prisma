const express = require('express');
const { validationResult } = require('express-validator')
const bycrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const prisma = require('../prisma/client')

const login = async (req, res) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        return res.status(422).json({
            success: false,
            message: "Validation error",
            errors: errors.array()
        })
    }

    try {
        const user = await prisma.user.findFirst({
            where: {
                email: req.body.email,
            },
            select: {
                id: true,
                name: true,
                email: true,
                password: true
            }
        })

        if(!user) {
            return res.status(404).json({
                success: false,
                message: "User Not Found"
            })
        }

        const validPassword = await bycrypt.compare(
            req.body.password,
            user.password
        )

        if(!validPassword) {
            return res.status(401).json({
                success: false,
                message: "Invalid Password"
            })
        }

        const token = jwt.sign({ id:user.id }, process.env.JWT_SECRET, {
            expiresIn: "1h"
        })

        const { password, ...userwithoutPassword } = user;

        res.status(200).send({
            success: true,
            message: "Login successfully",
            data: {
                user: userwithoutPassword,
                token: token
            }
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Internal server error"
        })
    }
}

module.exports = { login }