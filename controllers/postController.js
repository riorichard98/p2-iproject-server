const {Post,Relation,User} = require('../models/index.js')
const { Op } = require("sequelize")

class PostController{
    static async createPost(req,res,next){
        try {
            const {imageUrl,description,UserId} = req.body
            await Post.create({imageUrl,description,UserId})
            res.status(201).json({
                message:'Success create new post'
            })
        } catch (error) {
            if(error.name === 'SequelizeValidationError'){
                res.status(400).json({
                    message:error.errors.map(e=>e.message)[0]
                })
            }else{
                res.status(500).json({
                    message:'Internal server error'
                })
            }
        }
    }

    static async readAllPost(req,res,next){
        try {
            const UserId = req.auth.id
            const usersId = await Relation.findAll({where:{UserId},include:{model:User,attributes:['id']}})
            let arrayId = [{UserId}]
            usersId.forEach(e=>{
                arrayId.push({"UserId":e.User.id})
            })
            const posts = await Post.findAll({where:{[Op.or]:arrayId},order:[['id','DESC']]})
            res.status(200).json(posts)
        } catch (error) {
            res.status(500).json({
                message:'Internal server error'
            })
        }
    }
}

module.exports = {PostController}