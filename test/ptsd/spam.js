;(function(){
window.SPAM = function(cb, opt){
	opt = Gun.num.is(opt)? {each: opt} : opt || {};
	setInterval(burst, opt.wait);

var n = Gun.time.is(), i = 0, c = 0, b = opt.burst || 1, l = opt.each || 100;
var raw = "AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA AAAAA "

function save(i){
	if(!window.SPAM){ return }
	if(i > l){
		return clearTimeout(t);
	}
	cb(i, raw + i);
	return;
	var d;
	var ref = window.gun.get('asdf'+i);
	ref.put({hello: raw + i}, function(ack){
		if(d){ return } d = true;
		c++;
		!(i % b) && console.log(i+'/'+l);//, '@'+Math.floor(b/((-n + (n = Gun.time.is()))/1000))+'/sec');
		//localStorage.clear();
		ref.off();
		//console.log("gl:", Object.keys(window.gun._.graph).length);
		if(c < l){ return }
		setTimeout(function(){
			test.done();
		}, 1000);
	});
}
function burst(){
	for(var j = 0; j <= b; j++){
		save(++i);
	}
}
var t;
}
}());

SPAM(function(i, v){
	$("#message-input").text(v);
	$('.say').trigger('click');
}, 10000);