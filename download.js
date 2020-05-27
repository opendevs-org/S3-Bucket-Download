/**
 * Configure: ~/.aws/credentials on linux or <%userprofile%>/.aws/credentials on Windows
 * With: aws_access_key_id, aws_secret_access_key
 *
 */
const argv = require('minimist')(process.argv.slice(2));
const {
  exec,
  spawn
} = require('child_process');
const {
  start,
  get
} = require('prompt')


const chooseBucketAndPath = () => {
  const schema = {
    properties: {
      bucketName: {
        description: '[bucket name]/ [bucket name1,bucket name2,etc]',
        pattern: /^[a-zA-Z0-9.,\-]+$/,
        message: 'Specify comma separated Bucket names. It must only consist of lowercase letters, numbers, dots (.), comma (,) and hyphens (-)',
        required: true
      },
      path: {
        description: 'Specify directory where to download the files, if no path provided, files will be downloaded in ./data directory',
        pattern: /^(.+)\/([^/]+)$/,
        message: 'Specify directory where to download the files, if no path provided, files will be downloaded in ./data directory',
        default: './data'
      }
    }
  };

  start();

  get(schema, (err, { bucketName, path }) => {
    if (err) {
      console.log(`Prompt error: ${err}`);
    } else {
      console.log(`Bucket names to download: ${bucketName.split(',').map(el => el.trim())} ${path}`);

      configure((error, _) => {
        if (error) {
          return;
        } else {
          initiate(bucketName, path);
        }
      });
    }
  });
}


const downloadStart = (bucketName, path) => {
  const sync = spawn(`aws s3 sync s3://${bucketName} ${path}/${bucketName}`, [], {
    cwd: __dirname,
    shell: true
  })

  sync.stdout.on('data', (data) => {
    console.log(`${data}`);
  });

  sync.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  sync.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
}


const initiate = (bucketsName, path = './data') => {
  for (let bucket of bucketsName.split(',').map(el => el.trim())) {
    downloadStart(bucket, path);
  }
};


const configure = (callback) => {
  exec(`aws configure set default.s3.max_concurrent_requests 1000 && aws configure set default.s3.max_queue_size 100000`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);

      callback(error, null);
    }

    callback(null, true);
  });
};


if (argv.bucket === undefined && argv.path === undefined) {
  console.log('Running in Custom mode!');

  exec(`aws s3api list-buckets --query "Buckets[].Name"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);

      return;
    } else if (stderr) {
      console.error(`AWS CLI error: ${stderr}`);
    } else {
      console.log(`Buckets available: ${stdout}`);

      chooseBucketAndPath();
    }
  });
} else {
  console.log('Running in Auto mode!');

  configure((error, _) => {
    if (error) {
      return;
    } else {
      initiate(argv.bucket, argv.path);
    }
  });
}
