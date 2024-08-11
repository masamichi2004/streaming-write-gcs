import { Storage } from "@google-cloud/storage";
import { config } from "dotenv";
import * as fs from 'fs';

config();

const storage = new Storage();
const BUCKET_NAME = 'gcs_study_bucket';
const SOURCE_CSV_NAME = 'gcs_study_mock.csv';
const DEST_CSV_NAME = 'gcs_study_mock_data_stream.csv';


async function uploadCSVToGCSStream(){
    const bucket = storage.bucket(BUCKET_NAME);

    const uploadStream = bucket
    .file(DEST_CSV_NAME)
    .createWriteStream({
        resumable: false,
    });

    // SOURCE_CSV_NAMEをストリーミングで読み込んでGCSにストリームWriteするパイプ操作を実行
    fs.createReadStream(SOURCE_CSV_NAME).pipe(uploadStream);

    uploadStream.on('finish', () => {
        console.log(`${DEST_CSV_NAME} uploaded to ${BUCKET_NAME}`);
    });

    uploadStream.on('error', (err) => {
        console.error('error happend: ',err);
    });
}
uploadCSVToGCSStream().catch(console.error);
