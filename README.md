Used Package:

Typescript: type check
Next: Server side rendering, routing, serverless function
next-auth: authentiction, google oauth
react: frontend, state, hook
chakra: ui
aws dynamodb: nosql database

react-query: fetching, caching, pagination of database data
image-type: identify image type

eslint, prettier: format, error check

Procedures:

---deploy local aws---
docker-compose up -d

docker-compose -f "docker-compose-localstack.yaml" up -d
docker-compose -f "docker-compose-localstack.yaml" down

---dynamodb---
aws dynamodb create-table --table-name Music --attribute-definitions AttributeName=Artist,AttributeType=S AttributeName=SongTitle,AttributeType=S --key-schema AttributeName=Artist,KeyType=HASH AttributeName=SongTitle,KeyType=RANGE --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1  --endpoint-url http://localhost:4566

aws dynamodb list-tables --endpoint-url http://localhost:4566

aws dynamodb describe-table --table-name Animes  --endpoint-url http://localhost:4566

aws dynamodb delete-table --table-name Animes  --endpoint-url http://localhost:4566

set DYNAMO_ENDPOINT=http://localhost:4566
dynamodb-admin

---s3---
aws s3api create-bucket --bucket music-bucket --region us-east-1  --endpoint-url http://localhost:4566

aws s3api put-object --bucket music-bucket --key hyouka1.png --body hyouka1.png --endpoint-url http://localhost:4566

aws s3api get-object --bucket music-bucket --key hyouka1.png abc.png --endpoint-url http://localhost:4566

aws s3api list-buckets --endpoint-url http://localhost:4566