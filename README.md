# music
Homemade music player

>声明：此文章版权归饥人谷和本人所有，转载须得到本人同意，项目为开源项目，不能用于商业应用，仅供学习。

## 相关技能
- `HTML5+CSS3`（实现页面布局和动态效果）
- `Iconfont`（使用矢量图标库添加播放器相关图标）
- `LESS` （动态CSS编写）
- `jQuery`（快速编写js脚本）
- `gulp+webpack`（自动化构建工具，实现LESS,CSS,JS等编译和压缩代码）

## 实现的功能
- 播放暂停（点击切换播放状态）
- 下一曲（切换下一首）
- 随机播放（当前歌曲播放完自动播放下一曲）
- 单曲循环（点击随机播放图标可切换成单曲循环）
- 音量调节（鼠标移入滑动设置音量大小）
- 歌曲进度条（可点击切换进度直接跳，也可以点击小圆点拖拽切换进度）
- 实时歌词（点击词，切换歌词界面，根据实时进度自动滚动歌词）
- 喜欢（点击添加了一个active效果）
- 分享（可以直接分享到新浪微博）

## audio 标签使用
- `autoplay `   自动播放
- `loop`        循环播放
- `volume`      音量设置
- `currentTime` 当前播放位置
- `duration`    音频的长度
- `pause `      暂停
- `play`        播放
- `ended`       返回音频是否已结束

## 播放和暂停代码
```
_Music.prototype.playMusic = function(){
    var _this = this;
    this.play.on('click', function(){
        if (_this.audio.paused) {
            _this.audio.play();
            $(this).html('');
        } else {
            _this.audio.pause();
            $(this).html('')
        }
    });
}
```
## 音乐进度条代码
```
_Music.prototype.volumeDrag = function(){
    var _this = this;
    this.btn.on('mousedown', function(){
        _this.clicking = true;
        _this.audio.pause();
    })
    this.btn.on('mouseup', function(){
        _this.clicking = false;
        _this.audio.play();
    })
    this.progress.on('mousemove click', function(e){
        if(_this.clicking || e.type === 'click'){
            var len = $(this).width(),
                left = e.pageX - $(this).offset().left,
                volume = left / len;
            if(volume <= 1 || volume >= 0){
                _this.audio.currentTime =  volume * _this.audio.duration;
                _this.progressLine.css('width', volume *100 +'%');
            }
        }
    });
}
```
## 歌词添加代码 
```
_Music.prototype.readyLyric = function(lyric){
    this.lyricBox.empty();
    var lyricLength = 0;
    var html = '<div class="lyric-ani" data-height="20">';
    lyric.forEach(function(element,index) {
        var ele = element[1] === undefined ? '^_^歌词错误^_^' :  element[1];
        html += '<p class="lyric-line" data-id="'+index+'" data-time="' + element[0] + '"> ' +  ele + ' </p>';
        lyricLength++;
    });
    html += '</div>';
    this.lyricBox.append(html);
    this.onTimeUpdate(lyricLength);
}
```
代码还有很多就不一一添加了，觉得还行的话可以给个Star，你的Star是我继续创作的动力，非常感谢！！！

有什么疑问或问题，欢迎大家指出。