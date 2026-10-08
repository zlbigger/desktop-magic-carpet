#!/bin/bash
set -e
cd "$(dirname "$0")"
if ! command -v node >/dev/null 2>&1; then
  echo '请先安装 Node.js LTS：https://nodejs.org/'; read -r; exit 1
fi
# npm 和 Node 下载器不会默认继承 macOS 系统代理。
proxy_info="$(/usr/sbin/scutil --proxy)"
proxy_enabled="$(printf '%s\n' "$proxy_info" | awk '/HTTPSEnable :/{print $3}')"
proxy_host="$(printf '%s\n' "$proxy_info" | awk '/HTTPSProxy :/{print $3}')"
proxy_port="$(printf '%s\n' "$proxy_info" | awk '/HTTPSPort :/{print $3}')"
if [ "$proxy_enabled" = "1" ] && [ -n "$proxy_host" ] && [ -n "$proxy_port" ]; then
  export HTTPS_PROXY="http://$proxy_host:$proxy_port"
  export HTTP_PROXY="$HTTPS_PROXY"
  export npm_config_proxy="$HTTPS_PROXY"
  export npm_config_https_proxy="$HTTPS_PROXY"
  export NODE_USE_ENV_PROXY=1
fi
if [ ! -f node_modules/electron/package.json ]; then
  echo '正在安装依赖，请等待…'
  npm ci --no-audit --no-fund --fetch-retries=1 --fetch-timeout=30000
fi
if [ ! -f node_modules/electron/dist/Electron.app/Contents/MacOS/Electron ]; then
  echo '正在下载 Electron 运行环境，请等待…'
  node node_modules/electron/install.js
fi
npm start
