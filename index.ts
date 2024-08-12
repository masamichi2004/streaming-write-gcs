import { Storage } from "@google-cloud/storage";
import { config } from "dotenv";

config();

const storage = new Storage({projectId: process.env.PROJECT_ID});
const BUCKET_NAME = 'gcs_study_bucket';
const SOURCE_CSV_NAME = 'gcs_study_mock_data.csv';
const DEST_CSV_NAME = 'gcs_study_mock_data_stream_copy.csv';


async function uploadCSVToGCSStream(){
    const bucket = storage.bucket(BUCKET_NAME);

    // GCSのCSVファイルをストリームで読み込む
    const readStream = bucket
    .file(SOURCE_CSV_NAME)
    .createReadStream();

    const uploadStream = bucket
    .file(DEST_CSV_NAME)
    .createWriteStream({
        resumable: false,
    });

    // SOURCE_CSV_NAMEをストリーミングで読み込んでGCSにストリームWriteするパイプ操作を実行
    readStream.pipe(uploadStream);

    uploadStream.on('finish', () => {
        console.log(`${DEST_CSV_NAME} uploaded to ${BUCKET_NAME}`);
    });

    uploadStream.on('error', (err) => {
        console.error('error happend: ',err);
    });
}
uploadCSVToGCSStream().catch(console.error);
