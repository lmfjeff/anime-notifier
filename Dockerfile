FROM public.ecr.aws/lambda/nodejs:16 as builder
WORKDIR /usr/app
# COPY . .
COPY package-lock.json package.json ./
COPY prisma ./prisma
COPY src ./src
RUN npm install -f
# RUN npm rebuild --arch=x64 --platform=linux --libc=glibc sharp
RUN npm run build-image
RUN npm run build-mal
RUN npm run build-db
RUN npm run build-acg
# RUN npm run generate-client
    
FROM public.ecr.aws/lambda/nodejs:16
WORKDIR ${LAMBDA_TASK_ROOT}
COPY --from=builder /usr/app/dist/ ./dist/
# COPY --from=builder /usr/app/.env ./.env
COPY --from=builder /usr/app/node_modules/.prisma/client/ ./node_modules/.prisma/client/

RUN npm install --arch=x64 --platform=linux --libc=glibc sharp
# COPY --from=builder /usr/app/node_modules/sharp/ ./node_modules/sharp/
# COPY --from=builder /usr/app/ ./

# CMD ["dist/imageBot.handler"]
CMD ["dist/malBot.handler"]
# CMD ["dist/dbBot.handler"]
# CMD ["dist/acgBot.handler"]
