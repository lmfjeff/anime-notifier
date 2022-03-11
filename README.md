# Anime Notifier

This is the repository for a seasonal anime website built with Next.js

## Website Feature

- Visitors can view lists of airing animes sorted by day of week
- Users can follow animes they are watching

## Feature to be implemented

- add voting feature
- add daily notification of followed animes
- use own bucket & cloudfront to serve anime pictures
- cache by cloudflare cdn
- add pwa feature: offline cache, installable

## Technical choice

| **Package**                     | **Usage**                                    |
| ------------------------------- | -------------------------------------------- |
| Typescript                      | type check                                   |
| Next.js                         | Server side rendering, routing, backend, api |
| AWS Dynamodb                    | nosql database                               |
| Next-auth                       | authentiction, google oauth                  |
| React                           | frontend, state, hook                        |
| react-query                     | react hook for data fetching, caching        |
| Chakra UI                       | react component library                      |
| react-hook-form                 | react component                              |
| react-infinite-scroll-component | react component                              |

## Development

### Setup local environment

- Deploy local aws dynamodb by localstack docker image:

  ```bash
  docker-compose up -d
  docker-compose down
  ```

- Create table in dynamodb / anime data structure
  - Table Name: Anime
  - Partition key: id (created by nanoid)
  - Global Secondary Indexes: 
    - YearSeasonIndex
      - Partition key: yearSeason
      - for querying anime by season
    - MalIdIndex
      - Partition key: malId
      - for querying anime when importing anime infomation from MAL
    - StatusIndex
      - Partition key: status
      - for querying anime by airing status
  - Anime Properties:
    - title, picture, dayOfWeek, time, startDate, endDate, summary, genres, etc.

- Fetching anime data from 3rd party api
  - Deploy bot regularly to update anime data from 3rd party api, e.g.myanimelist
  - And fetch chinese name of the animes, e.g. acgsecrets.hk
  
### Start local development

create .env.local, fill up the environment variables

```bash
npm install
npm run dev
```

View dynamodb data using dynamodb-admin:

```bash
set DYNAMO_ENDPOINT=http://localhost:4566 && dynamodb-admin
```

### Next.js deployment in AWS EC2

- launch ec2, allow port 80/443
- get elastic ip for ec2 instance
- ssh as root, install nvm, install node 16, install pm2
- change aws dynamodb endpoint in .env.local
- filezilla ssh, transfer source file to ec2 (include build file if ec2 instance is low-spec)
- ssh, change file owner and group to root
- change NEXTAUTH_URL in .env.local, config gcp oauth domain
- npm install, install/config/start nginx
- (npm run build), pm2 npm start
- change DNS record, point domain to elastic ip
- certbot enable https, cron job renew
