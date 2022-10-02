FROM public.ecr.aws/lambda/nodejs:16 as builder
WORKDIR /usr/app
COPY . .
RUN npm install
# RUN npm rebuild --arch=x64 --platform=linux --libc=glibc sharp
RUN npm run build-image
RUN npm run build-mal
RUN npm run build-db
RUN npm run build-acg
    

FROM public.ecr.aws/lambda/nodejs:16
WORKDIR ${LAMBDA_TASK_ROOT}
COPY --from=builder /usr/app/dist/ ./dist/

RUN npm install --arch=x64 --platform=linux --libc=glibc sharp
# COPY --from=builder /usr/app/node_modules/sharp/ ./node_modules/sharp/
# COPY --from=builder /usr/app/ ./

# CMD ["dist/imageBot.handler"]
CMD ["dist/malBot.handler"]
# CMD ["dist/dbBot.handler"]
# CMD ["dist/acgBot.handler"]
