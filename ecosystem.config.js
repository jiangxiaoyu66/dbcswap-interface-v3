module.exports = {
    apps: [{
      name: "dbc-swap",                   
      script: "yarn",                     // 使用 yarn 命令
      args: "serve -p 8028",              // 修改这里，明确指定端口
      cwd: "./apps/web",                  // 指定工作目录
      instances: 1,                       
      exec_mode: "fork",                  
      watch: false,                       
      max_memory_restart: "1G",           
      node_args: "--max-old-space-size=1024",
      listen_timeout: 50000,              
      kill_timeout: 5000,                 
      max_restarts: 5,                    
      min_uptime: "5m",                   
      source_map_support: false,          
      autorestart: true,                  
      exp_backoff_restart_delay: 100,     
      env: {
        NODE_ENV: "production",           
        PORT: 8028                        
      }
    },
    {
      name: "dbc-swap-prod",              // 生产环境应用名称
      script: "yarn",                     
      args: "serve -p 8038",              // 使用不同端口
      cwd: "./apps/web",                  
      instances: 1,
      exec_mode: "fork",
      watch: false,
      max_memory_restart: "2G",           // 增加内存限制
      node_args: "--max-old-space-size=2048",
      listen_timeout: 50000,
      kill_timeout: 5000,
      max_restarts: 3,                    // 减少重启次数
      min_uptime: "10m",                  // 增加最小运行时间
      source_map_support: false,
      autorestart: true,
      exp_backoff_restart_delay: 100,
      env: {
        NODE_ENV: "production",
        PORT: 8038                        // 使用不同端口
      }
    }]
  } 