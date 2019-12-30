import { Request, Response } from 'express';
import * as admin from 'firebase-admin';
import { tmpdir } from 'os';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { respond } from '../utils';
import * as Busboy from 'busboy';

const bucket = admin.storage().bucket();
const filesRef = admin.firestore().collection('files');

const getFileByName = async (req: Request, res: Response) => {
  const name = req.params.name;

  if (!name) {
    respond(res, 'Name parameter required', 400);
    return;
  }

  const file = await bucket.file(name);

  if (!file.exists) {
    respond(res, `File with name: ${name} does not exist`, 404)
    return;
  }

  file.createReadStream().pipe(res);
};

const uploadFile = (req: any, res: Response) => {
  const busboy = new Busboy({ headers: req.headers });

  const uploadingFiles: Promise<any>[] = [];

  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    const filepath = join(tmpdir(), filename);

    uploadingFiles.push(
      new Promise(resolve => {
        file.pipe(createWriteStream(filepath)).on('close', () => {
          resolve({
            filename,
            filepath,
            mimetype,
            success: true,
          });
        });
      }).catch(err => {
        return {
          filename,
          filepath,
          mimetype,
          success: true,
        };
      }),
    );
  });

  busboy.on('finish', async () => {
    try {
      const files = await Promise.all(uploadingFiles);

      const itemsRef = filesRef.doc().collection('items');

      files.forEach(async ({ filename, filepath, mimetype }) => {
        const uploadResult = await bucket.upload(filepath, {
          metadata: {
            metadata: {
              mimetype,
            },
          },
        });

        const uploadedFile = uploadResult[0];
        const uploadedFileLink = uploadedFile.metadata.mediaLink;

        await itemsRef.doc().create({
          filename,
          url: uploadedFileLink,
        });
      });

      respond(res, files);
    } catch (err) {
      respond(res, err.message, 500);
    }
  });

  busboy.end(req.rawBody);
};

export { getFileByName, uploadFile };
