/*
    pm2 deploy ecosystem.config.js staging setup
    pm2 deploy ecosystem.config.js staging update

    pm2 deploy ecosystem.config.js dev update

*/

module.exports = {
    apps: [
      {
        name: 'portal-voice-agent-stage',
        script: 'npm',
        args: 'start',
        env: {
          NODE_ENV: 'staging',
          PORT: 4000
        }
      }
    ],
    deploy: {
      staging: {
        user: 'ubuntu',
        host: '98.80.59.215',
        ref: 'origin/main',
        repo: 'git@github.com:mubashshir-cloudmate/voice-agent-web.git',
        path: '/home/ubuntu/workspace/voice-agent-portal',
        'post-deploy':
          '/home/ubuntu/.nvm/versions/node/v22.12.0/bin/pnpm i && /home/ubuntu/.nvm/versions/node/v22.12.0/bin/pnpm build && /home/ubuntu/.nvm/versions/node/v22.12.0/bin/pm2 reload ecosystem.config.js --env staging'
      }
    }
  }
  
  // Setup
  // pm2 deploy ecosystem.config.js setup
  
  // deploy
  // pm2 deploy ecosystem.config.js production
  // pm2 deploy ecosystem.config.js dev
  // pm2 deploy ecosystem.config.js staging
  