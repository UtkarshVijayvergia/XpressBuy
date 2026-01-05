#!/bin/sh

# 1. Define the placeholders we used during the build
PLACEHOLDER_BACKEND_URL="REPLACE_WITH_REAL_BACKEND_URL"
PLACEHOLDER_USER_POOL_ID="REPLACE_WITH_REAL_USER_POOL_ID"
PLACEHOLDER_CLIENT_ID="REPLACE_WITH_REAL_CLIENT_ID"

# 2. Find all JS files in the static folder
JS_FILES="/usr/share/nginx/html/static/js/*.js"

# 3. Loop through files and replace placeholders with real Environment Variables
# (These Env Vars are passed by CDK at runtime)
for file in $JS_FILES; do
  echo "Updating config in $file..."
  sed -i "s|$PLACEHOLDER_BACKEND_URL|$REACT_APP_BACKEND_URL|g" "$file"
  sed -i "s|$PLACEHOLDER_USER_POOL_ID|$REACT_APP_AWS_USER_POOLS_ID|g" "$file"
  sed -i "s|$PLACEHOLDER_CLIENT_ID|$REACT_APP_AWS_USER_POOL_WEB_CLIENT_ID|g" "$file"
done

# 4. Start Nginx
echo "Starting Nginx..."
nginx -g 'daemon off;'