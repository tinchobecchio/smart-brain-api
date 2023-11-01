import {ClarifaiStub, grpc} from "clarifai-nodejs-grpc"
import { config } from "dotenv";

config()

const stub = ClarifaiStub.grpc();
const metadata = new grpc.Metadata();

const PAT = process.env.PAT;
const USER_ID = 'tinchobecchio';       
const APP_ID = 'test';
const MODEL_ID = 'face-detection';

metadata.set("authorization", "Key " + PAT);

export const handleApiCall = (req,res) => {
    const {imgUrl} = req.body

    stub.PostModelOutputs(
        {
            user_app_id: {
                "user_id": USER_ID,
                "app_id": APP_ID
            },
            model_id: MODEL_ID,
            inputs: [
                { data: { image: { url: imgUrl, allow_duplicate_url: true } } }
            ]
        },
        metadata,
        (err, response) => {
            if (err) {
                console.log(err);
                return res.status(500).json({status: 'error'})
            }
    
            if (response.status.code !== 10000) {
                return res.status(500).json({status: 'error', error: response.status.description})
            }
    
            // Since we have one input, one output will exist here
            const output = response.outputs[0];

            return res.status(200).json({status: 'success', output})
        }
    
    );
}

export const handleImage = db => (req,res) => {
    const { id } = req.body
    db('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0].entries);
        })
        .catch(err => res.status(400).json('unable to get entries'))
}