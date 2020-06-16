const commentModel = require("../models/comment");
const {
    formatResponse
  } = require('../utils/helper');

async function getComment(req,res) {
    const {commentId} = req.params;
    const comment =  await commentModel.findById(commentId)
                    .populate('builder')
                    .exec();

    if(!comment){
        return formatResponse(res, 'Comment not found', 404);
    }

    return formatResponse(res, comment);
};

module.exports = {
    getComment
};