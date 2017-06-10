var Music = (function(){
    function _Music(){
        this.sid = '';
        this.fmUrl = 'https://jirenguapi.applinzi.com/fm/';
        this.audioEle = $('#audio');
        this.audio = this.audioEle[0];
        this.lyricBox = $('.lyric-box');
        this.bigBox = $('.music-box');
        this.btn = $('.progress-handle');
        this.albumBox = $('.album-box');
        this.truePic = $('#picture');
        this.imgFilter = $('.img-filter');
        this.clicking = false;
        this.durationTime = $('.duration-time');
        this.currentTime = $('.current-time');
        this.progressLine = $('.progress-line');
        this.like = $('.like');
        this.lyric = $('.lyric');
        this.next =  $('.next');
        this.play = $('.play-btn');
        this.share = $('.share');
        this.volumeBar = $('.volume-bar');
        this.volumeLine = $('.volume-line');
        this.vol = $('.vol');
        this.progress = $('.progress');
        this.outType = $('.out-type');
        this.getSong();
        this.bindEvent();
    }
    _Music.prototype.getSong = function(){
        var _this = this;
        $.get(this.fmUrl+"getSong.php", {channel: 'public_shiguang_80hou'},function (data) {
            if(data.song[0].url === null && data.song[0].artist === null && data.song[0].title === null){
                this.getSong();
            }else{
                var musicName = '<h3>歌曲：'+data.song[0].title+' </h3><p>演唱者：'+data.song[0].artist+'</p><p> 来源：80后音乐榜单</p>';
                _this.audioEle.attr({'src': data.song[0].url , 'autoplay':'true'});
                _this.albumBox.html(musicName);
                _this.truePic.attr('src', data.song[0].picture);
                _this.imgFilter.css('backgroundImage', 'url('+data.song[0].picture+')');
                _this.sid = data.song[0].sid;
                _this.audio.volume = '0.7';
                _this.getLyric();
            }
        },'jsonp');
    }
    _Music.prototype.getLyric = function(){
        var lyricArr = [],
            _this = this;
        $.post(_this.fmUrl+"getLyric.php", {sid: _this.sid },function (data) {
            var lyric = JSON.parse(data).lyric;
            var lines = lyric.split('\n'),
                timeRegular = /\[\d{2}:\d{2}.\d{2}\]/g;
            lines.forEach(function (i) {
                if (!timeRegular.test(i)) {
                    lines.splice(i, 1);
                    return;
                }
                var time = i.match(timeRegular);
                var lyric = i.split(time);
                var seconds = time[0][1] * 600 + time[0][2] * 60 + time[0][4] * 10 + time[0][5] * 1;
                lyricArr.push([seconds, lyric[1]] );  
            });
            _this.readyLyric(lyricArr);
        });
    }
    _Music.prototype.readyLyric = function(lyric){
        this.lyricBox.empty();
        var lyricLength = 0;
        var html = '<div class="lyric-ani" data-height="20">';
        lyric.forEach(function(element,index) {
            var ele = element[1] === undefined ? '^_^歌词错误^_^' :  element[1];
            html += '<p class="lyric-line" data-id="'+index+'" data-time="' + element[0] + '">&nbsp;' +  ele + '&nbsp;</p>';
            lyricLength++;
        });
        html += '</div>';
        this.lyricBox.append(html);
        this.onTimeUpdate(lyricLength);
    }
    _Music.prototype.onTimeUpdate = function(lyricLength){
        var _this = this,
            lyricAni = $('.lyric-ani'),
            lyricH = lyricAni.data('height'),
            lyricP = _this.lyricBox.find('.lyric-ani p');
        var curTime = audio.currentTime,
            content = audio.duration;
        this.audioEle.on('timeupdate', function(){
            if(isNaN(content)){ content = audio.duration; }
            for (var i = 0; i < lyricLength; i++) {
                var curT = lyricP.eq(i).data("time");
                var nexT = lyricP.eq(i + 1).data("time");
                var curTime = audio.currentTime; 
                if(curTime > nexT){
                    lyricP.removeClass('active');
                    lyricAni.css({
                        'height': lyricH*lyricLength+'px',
                        'marginTop': - parseInt(lyricH * i - 100)+'px',
                        "transition": "6s"
                    });
                }
                if( (curTime > curT) && (curTime < nexT)){
                    lyricP.eq( i ).addClass("active");
                }
            }
            if(parseInt(content - (parseInt(content / 60) * 60)) < 10) {
                _this.durationTime.text(parseInt(content / 60) + ':0' + parseInt(content - (parseInt(content / 60) * 60)));
            } else {
                _this.durationTime.text(parseInt(content / 60) + ':' + parseInt(content- (parseInt(content / 60) * 60)));
            }
            if( parseInt(curTime - (parseInt(curTime/ 60) * 60)) < 10 ){
                _this.currentTime.text(parseInt(curTime / 60) + ':0' + parseInt(curTime - (parseInt(curTime/ 60) * 60)))
            }else{
                _this.currentTime.text(parseInt(curTime / 60) + ':' + parseInt(curTime - (parseInt(curTime/ 60) * 60)))
            }
            _this.progressLine.css({"width" : curTime / content * 100 +'%'});
            _this.audio.onended = function() { _this.like.html('&#xe601;'); _this.getSong();};
        });
        
    }
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
    _Music.prototype.volumeBarLine = function(){
        var _this = this;
        this.volumeBar.on('mousemove', function(e){
            var len = $(this).width(),
                left = e.pageX - $(this).offset().left,
                volume = left / len;
        
            if(left > 0 && left <= len){
                _this.volumeLine.css('width', volume * 100 +'%');
                _this.audio.volume = volume;
            }
            if(volume > 0.5){
                _this.vol.html('&#xe63d');
            }else if(volume < 0.5 && volume > 0.04 ){
                _this.vol.html('&#xe63c');
            }else{
                _this.vol.html('&#xe63b');
            }
        });
    }
    _Music.prototype.showLyric = function(){
        var _this = this;
        this.lyric.on('click', function(){
            var type = $(this).data('type');
            if(type){
                $(this).data('type', 0);
                _this.bigBox.removeClass('active');
            }else{
                $(this).data('type', 1);
                _this.bigBox.addClass('active');
            }
        });
    }
    _Music.prototype.nextMusic = function(){
        var _this = this;
        this.next.on('click', function(){
            _this.like.html('&#xe601;');
            _this.outType.data('type', 0).html('&#xe67c;');
            _this.audioEle.attr({'loop': false});
            _this.play.html('&#xe6ee;');
            _this.getSong();
        });
    }
    _Music.prototype.playMusic = function(){
        var _this = this;
        this.play.on('click', function(){
            if (_this.audio.paused) {
                _this.audio.play();
                $(this).html('&#xe6ee;');
            } else {
                _this.audio.pause();
                $(this).html('&#xe602;')
            }
        });
    }
    _Music.prototype.checkLove = function(){
        this.like.on('click', function(){
            var type = $(this).data('type');
            if(type){
                $(this).data('type', 0).html('&#xe601;');
            }else{
                $(this).data('type', 1).html('&#xe60a;');
            }
        })
    }
    _Music.prototype.checkShare = function(){
        var _this = this;
        this.share.on('click', function(){
            var title = _this.albumBox.text().replace(" ", '%0d%0a');
            var pic = _this.truePic.attr('src');
            window.open('http://service.weibo.com/share/share.php?title='+title+'%0d%0a龙柏龙的云音乐♪&url=' + window.location.href+'&pic='+pic);
        });
    }
    _Music.prototype.outMusicType = function(){
        var _this = this;
        this.outType.on('click', function(){
            var type = $(this).data('type');
            if(type){
                $(this).data('type', 0).html('&#xe67c;');
                _this.audioEle.attr({'loop': false});
            }else{
                $(this).data('type', 1).html('&#xe66d;');
                _this.audioEle.attr({'loop': true });
            }
        });
    }
    _Music.prototype.bindEvent = function(){
        this.volumeDrag();
        this.volumeBarLine();
        this.showLyric();
        this.nextMusic();
        this.playMusic();
        this.checkLove();
        this.outMusicType();
        this.checkShare();
    }

    return {
        init: function(){
            new _Music();
        }
    }
})();
Music.init();