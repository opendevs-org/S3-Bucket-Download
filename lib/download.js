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
} = require('prompt');
const { say } = require('cfonts');
const os = require('os');
const fs = require("fs");


say('s3-bucket-downloader', {
  font: 'chrome',
  align: 'center',
  colors: ['system'],
  background: 'transparent',
  letterSpacing: 1,
  lineHeight: 1,
  space: true,
});


say('opendevs', {
  font: 'chrome',
  align: 'right',
  colors: ['system'],
  background: 'transparent',
  letterSpacing: 1,
  lineHeight: 1,
  space: true,
  gradient: ['#fff', '#89d8d3'],
});

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

  get(schema, (err, argv) => {
    if (err) {
      console.log(`Prompt error: ${err}`);
    } else {
      console.log(`Bucket names to download: ${argv.bucketName.split(',').map(el => el.trim())} ${argv.path}`);

      configure((error, _) => {
        if (error) {
          return;
        } else {
          initiate(argv.bucketName, argv.path);
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


const setConfig = (path) => {

  fs.mkdirSync(path);

  const configFilePath = path + '\\config';
  const credentialsFilePath = path + '\\credentials';

  let configFileContent = '';
  let credentialsFileContent = '';

  const credentialsSchema = {
    properties: {
      aws_access_key_id: {
        message: 'Please enter correct aws_access_key_id',
        required: true
      },
      aws_secret_access_key: {
        message: 'Please enter correct aws_secret_access_key',
        required: true
      },
    }
  };

  start();

  get(credentialsSchema, function (err, result) {
    credentialsFileContent = `[default]\naws_access_key_id = ${result.aws_access_key_id}\naws_secret_access_key = ${result.aws_secret_access_key}`;
    fs.writeFileSync(credentialsFilePath, credentialsFileContent);
  });

  fs.writeFileSync(configFilePath, '');
}


const starter = () => {
  if (argv.all) {
    console.log('Running in Download All mode!');
  
    exec(`aws s3api list-buckets --query "Buckets[].Name"`, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
  
        return;
      } else if (stderr) {
        console.error(`AWS CLI error: ${stderr}`);
      } else {
        console.log(`Buckets to download: ${stdout}`);
  
        configure((error, _) => {
          if (error) {
            return;
          } else {
            initiate(Array(stdout).join(','), argv.path);
          }
        });
      }
    });
  } else if (argv.bucketName === undefined && argv.path === undefined) {
    console.log('Running in Interactive mode!');
  
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
    console.log('Running in CLI mode!');
  
    configure((error, _) => {
      if (error) {
        return;
      } else {
        initiate(argv.bucketName, argv.path);
      }
    });
  }
};

const osType = os.type();
let filePath = '';
if (osType === 'Windows_NT') {
  // Windows
  filePath = `${os.userInfo().homedir}\\.aws`;
  if (fs.existsSync(filePath)) {
    starter();
  } else {
    setConfig(filePath);
  }
} else {
  filePath = '~/.aws';
  if (fs.existsSync(filePath)) {
    starter();
  } else {
    const path = '~/';
    setConfig(path);
  }
}
