const clarifai = require('clarifai');
import fetch from 'node-fetch';


const setupClarifai = (imageUrl) => {
    const PAT = '3019e98844444670871e5fde9dd3f399';
      // Specify the correct user_id/app_id pairings
      // Since you're making inferences outside your app's scope
    const USER_ID = 'clarifai';       
    const APP_ID = 'main';
      // Change these to whatever model and image URL you want to use
      // const MODEL_ID = 'face-detection';
      // const MODEL_VERSION_ID = 'aa7f35c01e0642fda5cf400f543e7c40';  
      // const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';  
    const IMAGE_URL = imageUrl;

    const raw = JSON.stringify({
      "user_app_id": {
          "user_id": USER_ID,
          "app_id": APP_ID
      },
      "inputs": [
          {
              "data": {
                  "image": {
                      "url": IMAGE_URL
                  }
              }
          }
      ]
  });

    const requestOptions = {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Authorization': 'Key ' + PAT
      },
      body: raw
}; 

    return requestOptions


}

const handleApiCall = (req, res) => {
    fetch(`https://api.clarifai.com/v2/models/face-detection/versions/6dc7e46bc9124c5c8824be4822abe105/outputs`, 
          setupClarifai(req.body.input))
          .then(data => {
            res.json(data);
          })
          .catch(err => res.status(400).json('Unable to work with API'))
}



const handleImage = (req, res, db) => {
	const { id } = req.body;
	
	// let found = false;
	db('users').where('id', '=', id)
	.increment('entries', 1)
	.returning('entries')
	.then(entries => {
		res.json(entries[0].entries);
	})
	.catch(err => res.status(400).json('unable to get entries'))
	// database.users.forEach(user => {
	// 	if (user.id === id) {
	// 		found = true;
	// 		user.entries++
	// 		return res.json(user.entries);
	// 	}
	// })
	// 	if (!found) {
	// 	res.status(400).json("not found");
	// }
}

module.exports = {
    handleImage,
    handleApiCall
}