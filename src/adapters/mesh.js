
var Type = require('../type');

function Mesh(ctx){
	var mesh = function(){};
	var opt = ctx.opt;

	mesh.out = function(msg){ var tmp;
		if(this.to){ this.to.next(msg) }
		//if(mesh.last != msg['#']){ return mesh.last = msg['#'], this.to.next(msg) }
		if((tmp = msg['@'])
		&& (tmp = ctx.dup.s[tmp])
		&& (tmp = tmp.it)
		&& tmp.mesh){
			mesh.say(msg, tmp.mesh.via, 1);
			tmp['##'] = msg['##'];
			return;
		}
		// add hook for AXE?
		mesh.say(msg);
	}

	ctx.on('create', function(root){
		root.opt.pid = root.opt.pid || Type.text.random(9);
		this.to.next(root);
		ctx.on('out', mesh.out);
	});

	mesh.hear = function(raw, peer){
		if(!raw){ return }
		var dup = ctx.dup, id, hash, msg, tmp = raw[0];
		try{msg = JSON.parse(raw);
		}catch(e){console.log('DAM JSON parse error', e)}
		if('{' === tmp){
			if(!msg){ return }
			if(dup.check(id = msg['#'])){ return }
			dup.track(id, true).it = msg; // GUN core also dedups, so `true` is needed.
			if((tmp = msg['@']) && msg.put){
				hash = msg['##'] || (msg['##'] = mesh.hash(msg));
				if((tmp = tmp + hash) != id){
					if(dup.check(tmp)){ return }
					(tmp = dup.s)[hash] = tmp[id];
				}
			}
			(msg.mesh = function(){}).via = peer;
			if((tmp = msg['><'])){
				msg.mesh.to = Type.obj.map(tmp.split(','), function(k,i,m){m(k,true)});
			}
			if(msg.dam){
				if(tmp = mesh.hear[msg.dam]){
					tmp(msg, peer, ctx);
				}
				return;
			}
			ctx.on('in', msg);
			
			return;
		} else
		if('[' === tmp){
			if(!msg){ return }
			var i = 0, m;
			while(m = msg[i++]){
				mesh.hear(m, peer);
			}

			return;
		}
	}

	;(function(){
		mesh.say = function(msg, peer, o){
			/*
				TODO: Plenty of performance optimizations
				that can be made just based off of ordering,
				and reducing function calls for cached writes.
			*/
			if(!peer){
				Type.obj.map(opt.peers, function(peer){
					mesh.say(msg, peer);
				});
				return;
			}
			var tmp, wire = peer.wire || ((opt.wire) && opt.wire(peer)), msh, raw;// || open(peer, ctx); // TODO: Reopen!
			if(!wire){ return }
			msh = msg.mesh || empty;
			if(peer === msh.via){ return }
			if(!(raw = msh.raw)){ raw = mesh.raw(msg) }
			if((tmp = msg['@'])
			&& (tmp = ctx.dup.s[tmp])
			&& (tmp = tmp.it)){
				if(tmp.get && tmp['##'] && tmp['##'] === msg['##']){ // PERF: move this condition outside say?
					return; // TODO: this still needs to be tested in the browser!
				}
			}
			if((tmp = msh.to) && (tmp[peer.url] || tmp[peer.id]) && !o){ return } // TODO: still needs to be tested
			if(peer.batch){
				peer.batch.push(raw);
				return;
			}
			peer.batch = [];
			setTimeout(function(){
				var tmp = peer.batch;
				if(!tmp){ return }
				peer.batch = null;
				if(!tmp.length){ return }
				send(JSON.stringify(tmp), peer);
			}, opt.gap || opt.wait || 1);
			send(raw, peer);
		}

		function send(raw, peer){
			var wire = peer.wire;
			try{
				if(wire.send){
					wire.send(raw);
				} else
				if(peer.say){
					peer.say(raw);
				}
			}catch(e){
				(peer.queue = peer.queue || []).push(raw);
			}
		}

	}());

	;(function(){

		mesh.raw = function(msg){
			if(!msg){ return '' }
			var dup = ctx.dup, msh = msg.mesh || {}, put, hash, tmp;
			if(tmp = msh.raw){ return tmp }
			if(typeof msg === 'string'){ return msg }
			if(msg['@'] && (tmp = msg.put)){
				if(!(hash = msg['##'])){
					put = $(tmp, sort) || '';
					hash = mesh.hash(msg, put);
					msg['##'] = hash;
				}
				(tmp = dup.s)[hash = msg['@']+hash] = tmp[msg['#']];
				msg['#'] = hash || msg['#'];
				if(put){ (msg = Type.obj.to(msg)).put = _ }
			}
			var i = 0, to = []; Type.obj.map(opt.peers, function(p){
				to.push(p.url || p.id); if(++i > 9){ return true } // limit server, fast fix, improve later!
			}); msg['><'] = to.join();
			var raw = $(msg);
			if(u !== put){
				tmp = raw.indexOf(_, raw.indexOf('put'));
				raw = raw.slice(0, tmp-1) + put + raw.slice(tmp + _.length + 1);
				//raw = raw.replace('"'+ _ +'"', put); // https://github.com/amark/gun/wiki/@$$ Heisenbug
			}
			if(msh){
				msh.raw = raw;
			}
			return raw;
		}

		mesh.hash = function(msg, hash){
			return Mesh.hash(hash || $(msg.put, sort) || '') || msg['#'] || Type.text.random(9);
		}

		function sort(k, v){ var tmp;
			if(!(v instanceof Object)){ return v }
			Type.obj.map(Object.keys(v).sort(), map, {to: tmp = {}, on: v});
			return tmp;
		}

		function map(k){
			this.to[k] = this.on[k];
		}
		var $ = JSON.stringify, _ = ':])([:';

	}());

	mesh.hi = function(peer){
		var tmp = peer.wire || {};
		if(peer.id || peer.url){
			opt.peers[peer.url || peer.id] = peer;
			Type.obj.del(opt.peers, tmp.id);
		} else {
			tmp = tmp.id = tmp.id || Type.text.random(9);
			mesh.say({dam: '?'}, opt.peers[tmp] = peer);
		}
		if(!tmp.hied){ ctx.on(tmp.hied = 'hi', peer) }
		tmp = peer.queue; peer.queue = [];
		Type.obj.map(tmp, function(msg){
			mesh.say(msg, peer);
		});
	}
	mesh.bye = function(peer){
		Type.obj.del(opt.peers, peer.id); // assume if peer.url then reconnect
		ctx.on('bye', peer);
	}

	mesh.hear['?'] = function(msg, peer){
		if(!msg.pid){ return mesh.say({dam: '?', pid: opt.pid, '@': msg['#']}, peer) }
		peer.id = peer.id || msg.pid;
		mesh.hi(peer);
	}

	return mesh;
}

Mesh.hash = function(s){ // via SO
	if(typeof s !== 'string'){ return {err: 1} }
	    var c = 0;
	    if(!s.length){ return c }
	    for(var i=0,l=s.length,n; i<l; ++i){
	      n = s.charCodeAt(i);
	      c = ((c<<5)-c)+n;
	      c |= 0;
	    }
	    return c; // Math.abs(c);
	  }

	  var empty = {}, u;
	  Object.keys = Object.keys || function(o){ return map(o, function(v,k,t){t(k)}) }

	  try{ module.exports = Mesh }catch(e){}

	