/**
 * Configure: ~/.aws/credentials
 * With: aws_access_key_id, aws_secret_access_key
 *
 */
const argv = require('minimist')(process.argv.slice(2));
const { exec, spawn } = require('child_process');

// Check for mandatory parameters
if (argv.bucket == undefined) {
    console.log('Please define a --bucket [name]!');
    return;
}

exec(`aws configure set default.s3.max_concurrent_requests 1000 && aws configure set default.s3.max_queue_size 100000`, (error, stdout, stderr) => {
    if (error) {
        console.error(`exec error: ${error}`);
        return;
    }

    const sync = spawn(`aws s3 sync s3://${argv.bucket} ./data`, [], { cwd: __dirname, shell: true })

    sync.stdout.on('data', (data) => {
        console.log(`${data}`);
    });

    sync.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    sync.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
});

