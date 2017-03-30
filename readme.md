# 手势密码
------
### 使用方式
1. 手机上打开build文件夹下的index.html即可看到相应的效果。
2. 或者在本项目根目录下执行
```
npm install // 根据package.json安装依赖node_modules
npm run dev //启动webpack，端口号3000
```
访问 http://localhost:3000 即可
3. 使用demo地址： http://iwtofly.cn/

### 本程序特点如下：

- [x] 支持设置密码功能
- [x] 支持密码验证
- [x] 密码输错/正确，有相应颜色的提示信息
- [x] 选中的密码球颜色会变化
- [x] 使用reactjs（ES6） + webpack实现
- [x] 使用scss函数配合js用rem实现移动端各种屏幕自适应

### 程序目录结构如下
- lock-mobile
    - build
        -  index.html
        -  manifest.json
        -  Touch.js
        -  vendor.dll.js
        -  bundle.js
    - src
        -  main.js
        -  style.scss
    -  webpack.config.js
    -  webpack-dll-config.js
    -  package.json
    -  readme.md
使用**webpack**构造项目，webpack-dll-config.js是对React、ReactDom等做一次性编译压缩，产生vendor.dll.js及映射表manifest.json。在index.html中引用vendor.dll.js即引入了React等，避免开发过程中热加载时对此类文件的编译，节省开发时间。bundle.js为最终由源问价合成的压缩文件。
其中**src**存放了主要的**源文件**，包含入口文件main.js和样式文件style.scss，此外build文件夹下的Touch.js实现了对touch事件的一次封装，提供了事件类型touchout,touchover等。
### 思路
分为样式和功能方面
#### 样式上
由于没有采用canvas，因此九个点使用div包裹9个span标签实现，div为正方形，span设置diplay: inline-block，宽度高度为父div的三分之一，border-radius为50%,实现圆形。scale设置为0.5缩放原形，实现彼此间距一定均匀分布。
需要注意的有
```
display：inline-block；
```
会产生一定的间隙，处理办法如下：
```
font-size: 0;
-webkit-text-size-adjust: none;
```
#### 功能方面
main.js中的App组件初始化时设置了参数**firstTempKey**（存放第一次输入的密码）和**secondTempKey**（存放第二次输入的密码）以及**times**（第几次设置密码）。密码模块所在元素.points设置了事件委托，事件处理程序为handleTouchStart，当该元素上触发touchStart事件后再对相应的子元素做出监听设置。

记录下两次设置密码的结果，在**times**为2时触发的touchEnd需要进行checkMatch()操作,并返回对比结果。如果不符合，times归1,重新进行设置。如符合，提示相应信息，并存入localStorage。

此外**times** = 0以及tempKey对应验证密码的操作，单选输入变为“验证密码”即value='config'后，times设置为0,tempKey准备接收参数和localStorage中的信息进行checkMatch()操作并返回相应提示。
### 移动端屏幕自适应：
1. 首先，index.html中设置,width=设备宽度,设置初始缩放比例和最大缩放比例（不可缩放）
```
<meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
```
2. 检测屏幕大小从而改变当前的文档根节点fontSize（基准）
```
<script>
    document.querySelector('html').style.fontSize=window.innerWidth/10+'px';
</script>
```
3. style.scss中设置px2rem函数,之后设置宽度等调用该函数进行转换。
```
@function px2rem($px){
   $rem: 37.5;
   @return ($px/$rem) + rem;
}
```
### 项目缺点
- 那个密码连线的红线审题时不知道要实现，没有使用**canvas**。
- 使用React时合成事件与原生事件混用
还有很多不完善之处，希望可以慢慢完善
### 踩到的坑
> * touchmove: 触控点在屏幕上移动时触发，类似于mousemove。但是在当在移动设备上，触控点从一个元素移动到另一个元素上时，并不会像pc端一样触发类似mouseover/mouseout mouseenter/mouseleave的事件。