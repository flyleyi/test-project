#执行jest单元测试脚本
echo =======start--jest=======
#默认执行目录
testPath=
#赋值传参
pages=$1
testPath=
if [[ $pages = "" ]];
then
  #默认不传参，执行全部目录下的jest
  testPath=/.*.spec.js
  echo =======执行全部项目=======
else
  echo =======执行项目$pages=======
  #传入参数为a,b,c逗号分割字符串，转成数组类型
  array=(${pages//,/ }) 
  for var in ${array[@]}
  do
    temp=src/pages/$var/tests/*.spec.js
    # echo $temp
    fPaths=(${temp// / }) 
    #可能存在多个文件
    echo $fPaths
    if [ -e "$fPaths" ];then
      testPath=$testPath" "$temp
      echo "测试文件存在"
    else
      echo "测试文件不存在"
    fi
    #执行目录增加此pages下的tests目录
  done
fi
#判断测试文件是否存在，存在则执行jest
if [ ! "$testPath" ]; then
  echo "跳过jest"
else
  jest ${testPath} -u --coverage --reporters default jest-stare
fi