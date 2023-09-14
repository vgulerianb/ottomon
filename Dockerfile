FROM node:lts as builder

WORKDIR /ottomon

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

FROM node:lts

WORKDIR /ottomon

COPY --from=builder /ottomon .

# Copy .env if it exists
# COPY --from=builder /ottomon/.env* ./

EXPOSE 3000

CMD ["yarn", "start"]