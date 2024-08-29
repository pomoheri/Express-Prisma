const express = require('express')
const prisma = require('../prisma/client')
bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator')

const findUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true
            },
            orderBy: {
                id: "desc"
            }
        })

        res.status(200).send({
            success: true,
            message: "Get all users successfully",
            data: users
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const createUser = async (req, res) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        return res.status(422).json({
            success: false,
            message: "Validation error",
            errors: errors.array(),
        })
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    try {
        const user = await prisma.user.create({
            data: {
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword
            }
        })

        res.status(201).send({
            success: true,
            message: "User created successfully",
            data: user
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Internal server error",
        })
    }
}

const findUserById = async (req, res) => {
   try {
        const user = await prisma.user.findMany({
            where: {
                id: Number(req.params.id),
            },
            select: {
                id: true,
                name: true,
                email: true
            }
        })

        res.status(200).send({
            success: true,
            message: "Get User By Id :"+Number(req.params.id),
            data: user
        })
   } catch (error) {
        res.status(500).send({
            success: false,
            message: "Internal server error"
        })
   }
}

const updateUser = async (req, res) => {
    const id = req.params.id

    const errors = validationResult(req)

    if(!errors.isEmpty()){
        res.status(422).json({
            success: true,
            message: "Validation error",
            errors: errors.array()
        })
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    try {
        const user = await prisma.user.update({
            where: {
                id: Number(id)
            },
            data: {
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword
            }
        })

        res.status(200).send({
            success: true,
            message: "User updated successfully",
            data: user
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Internal server error",
        });
    }
}

const deleteUser = async (req, res) => {

    //get ID from params
    const { id } = req.params;
    try {

        //delete user
        await prisma.user.delete({
            where: {
                id: Number(id),
            },
        });

        //send response
        res.status(200).send({
            success: true,
            message: 'User deleted successfully',
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Internal server error",
            error: error
        });
    }

};

module.exports = { findUsers, createUser, findUserById, updateUser, deleteUser }