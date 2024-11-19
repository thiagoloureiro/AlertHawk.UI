# Stage 1
FROM node:23-alpine as react-build
WORKDIR /app
COPY . ./
RUN npm install
# Remove version information from Moment.js
RUN sed -i '/^\/\/! version : [0-9]\+\.[0-9]\+\.[0-9]\+$/d' node_modules/moment/moment.js
RUN cat node_modules/moment/moment.js
RUN npm run build

# Stage 2 - the production environment
FROM nginx:alpine
RUN chown -R nginx:nginx /usr/share/nginx/html && chmod -R 755 /usr/share/nginx/html && \
        chown -R nginx:nginx /var/cache/nginx && \
        chown -R nginx:nginx /var/log/nginx && \
        chown -R nginx:nginx /etc/nginx/conf.d
RUN touch /var/run/nginx.pid && \
        chown -R nginx:nginx /var/run/nginx.pid
RUN apk update && apk upgrade

USER nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=react-build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
