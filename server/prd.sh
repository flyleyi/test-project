#用于生产环境的脚本执行 需要接受参数 $1 要打包的项目 
#是否打包全部
buildAll=false
#打包项目
project=$1
#（生产环境项目路径/data/frontend/mutilwap）
cd /data/frontend

#清除上次构建后的备份包
rm -rf mutilwap/dist/wap_bak/${project}
# 构建全部项目(true=删除整个wap备份，false=删除本次打包项目备份)
if [[ $project = "" ]];
then
  buildAll=true;
  cp -rf mutilwap/dist/wap mutilwap/dist/wap_bak
elif [ -d mutilwap/dist/wap/${project} ]; then
  cp -rf mutilwap/dist/wap/${project} mutilwap/dist/wap/${project}_bak
fi

#删除本次要构建的项目原始启动目录
rm -rf mutilwap/dist/wap/${project}

echo "unzip-------------"
#此压缩包为jenkins服务远程传输到生产容器内的压缩包，将此压缩包解压到项目内
tar -zxvf mutilwap.tar.gz -C mutilwap
echo "rm tar-------------"
rm -rf mutilwap.tar.gz

cd ./mutilwap

#echo `oss://hlmp-prod/web/mutilwap/wap$date`
if [[ $buildAll = true ]];
then 
  echo "task:all"
  #强制删除备份目录
  /usr/local/bin/ossutil64 rm -f -r oss://hlmp-prod/web/mutilwap/wap_bak/
  #备份当前目录
  /usr/local/bin/ossutil64 cp -r oss://hlmp-prod/web/mutilwap/wap/ oss://hlmp-prod/web/mutilwap/wap_bak/
  #清空原目录内容
  /usr/local/bin/ossutil64 rm -f -r oss://hlmp-prod/web/mutilwap/wap/
  #上传最新代码
  /usr/local/bin/ossutil64 cp -r dist/wap/ oss://hlmp-prod/web/mutilwap/wap/  -u --exclude "*.html"
else
  echo "task:$project"
  #强制删除备份子目录
  /usr/local/bin/ossutil64 rm -f -r oss://hlmp-prod/web/mutilwap/wap/${project}_bak
  #备份当前子目录
  /usr/local/bin/ossutil64 cp -r oss://hlmp-prod/web/mutilwap/wap/${project}/ oss://hlmp-prod/web/mutilwap/wap/${project}_bak/
  #清空原子目录内容
  /usr/local/bin/ossutil64 rm -f -r oss://hlmp-prod/web/mutilwap/wap/${project}/
  #上传最新代码
  /usr/local/bin/ossutil64 cp -r dist/wap/${project}/ oss://hlmp-prod/web/mutilwap/wap/${project}/  -u --exclude "*.html"
fi

pm2 restart pm2.json