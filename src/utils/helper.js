function convertUpdateBody(body, keys) {
	const newBody = {};
	keys.forEach(k => {
	  if (body[k]) {
		newBody[k] = body[k];
	  }
	});
	return newBody;
  }

//   function formatResponse(res, code, message, finalPostData) {
// 	res.status(code).json({
// 		status: code === 200 ? "success" : "error",
// 		message: message,
// 		data: finalPostData
// 	});
// }

function formatResponse(res, payload, code = 200) {
	const response = { code };
	if (code < 400) {
	  if (payload.data) {
		response.data = payload.data;
	  } else {
		response.data = payload;
	  }
	} else {
	  response.error = payload;
	}
	if (payload.pagination) {
	  response.pagination = payload.pagination;
	}
	return res.status(code).send(response);
  }

  module.exports = {
	convertUpdateBody,
	formatResponse
  };  