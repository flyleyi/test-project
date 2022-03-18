## 图片上传

## 属性
|参数|说明|类型|可选值|默认值|
|:-:|:-:|:-:|:-:|:-:|
|value|绑定的图片url|Array|-|[]|
|accepts|接受上传图片类型|Array|-|[]|
|max-size|最大上传文件大小限制|Number|-|0|
|action|上传接口url|String|-|''|
|successField|上传成功接收后台回调数据url的filed值|String|-|'fileUrl'|
|http-request|上传接口,覆盖默认action实现|Function|-|function(){}|
|customFileError|是否接管文件上传前错误处理（文件格式错误/大小超出限制）|Boolean|-|false|
|accepts-unmatch|配合:customFileError="true",使用@accepts-unmatch接管文件格式错误回调处理|Function|-|-|
|over-max-size|配合:customFileError="true",使用@over-max-size接管文件大小超限错误回调处理|Function|-|-|
|limit|最多上传文件数|-|1|