/* pako bundled */
/*! pako 2.1.0 https://github.com/nodeca/pako @license (MIT AND Zlib) */
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t="undefined"!=typeof globalThis?globalThis:t||self).pako={})}(this,(function(t){"use strict";function e(t){let e=t.length;for(;--e>=0;)t[e]=0}const a=256,i=286,n=30,s=15,r=new Uint8Array([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0]),o=new Uint8Array([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13]),l=new Uint8Array([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7]),h=new Uint8Array([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),d=new Array(576);e(d);const _=new Array(60);e(_);const f=new Array(512);e(f);const c=new Array(256);e(c);const u=new Array(29);e(u);const w=new Array(n);function m(t,e,a,i,n){this.static_tree=t,this.extra_bits=e,this.extra_base=a,this.elems=i,this.max_length=n,this.has_stree=t&&t.length}let b,g,p;function k(t,e){this.dyn_tree=t,this.max_code=0,this.stat_desc=e}e(w);const v=t=>t<256?f[t]:f[256+(t>>>7)],y=(t,e)=>{t.pending_buf[t.pending++]=255&e,t.pending_buf[t.pending++]=e>>>8&255},x=(t,e,a)=>{t.bi_valid>16-a?(t.bi_buf|=e<<t.bi_valid&65535,y(t,t.bi_buf),t.bi_buf=e>>16-t.bi_valid,t.bi_valid+=a-16):(t.bi_buf|=e<<t.bi_valid&65535,t.bi_valid+=a)},z=(t,e,a)=>{x(t,a[2*e],a[2*e+1])},A=(t,e)=>{let a=0;do{a|=1&t,t>>>=1,a<<=1}while(--e>0);return a>>>1},E=(t,e,a)=>{const i=new Array(16);let n,r,o=0;for(n=1;n<=s;n++)o=o+a[n-1]<<1,i[n]=o;for(r=0;r<=e;r++){let e=t[2*r+1];0!==e&&(t[2*r]=A(i[e]++,e))}},R=t=>{let e;for(e=0;e<i;e++)t.dyn_ltree[2*e]=0;for(e=0;e<n;e++)t.dyn_dtree[2*e]=0;for(e=0;e<19;e++)t.bl_tree[2*e]=0;t.dyn_ltree[512]=1,t.opt_len=t.static_len=0,t.sym_next=t.matches=0},Z=t=>{t.bi_valid>8?y(t,t.bi_buf):t.bi_valid>0&&(t.pending_buf[t.pending++]=t.bi_buf),t.bi_buf=0,t.bi_valid=0},U=(t,e,a,i)=>{const n=2*e,s=2*a;return t[n]<t[s]||t[n]===t[s]&&i[e]<=i[a]},S=(t,e,a)=>{const i=t.heap[a];let n=a<<1;for(;n<=t.heap_len&&(n<t.heap_len&&U(e,t.heap[n+1],t.heap[n],t.depth)&&n++,!U(e,i,t.heap[n],t.depth));)t.heap[a]=t.heap[n],a=n,n<<=1;t.heap[a]=i},D=(t,e,i)=>{let n,s,l,h,d=0;if(0!==t.sym_next)do{n=255&t.pending_buf[t.sym_buf+d++],n+=(255&t.pending_buf[t.sym_buf+d++])<<8,s=t.pending_buf[t.sym_buf+d++],0===n?z(t,s,e):(l=c[s],z(t,l+a+1,e),h=r[l],0!==h&&(s-=u[l],x(t,s,h)),n--,l=v(n),z(t,l,i),h=o[l],0!==h&&(n-=w[l],x(t,n,h)))}while(d<t.sym_next);z(t,256,e)},T=(t,e)=>{const a=e.dyn_tree,i=e.stat_desc.static_tree,n=e.stat_desc.has_stree,r=e.stat_desc.elems;let o,l,h,d=-1;for(t.heap_len=0,t.heap_max=573,o=0;o<r;o++)0!==a[2*o]?(t.heap[++t.heap_len]=d=o,t.depth[o]=0):a[2*o+1]=0;for(;t.heap_len<2;)h=t.heap[++t.heap_len]=d<2?++d:0,a[2*h]=1,t.depth[h]=0,t.opt_len--,n&&(t.static_len-=i[2*h+1]);for(e.max_code=d,o=t.heap_len>>1;o>=1;o--)S(t,a,o);h=r;do{o=t.heap[1],t.heap[1]=t.heap[t.heap_len--],S(t,a,1),l=t.heap[1],t.heap[--t.heap_max]=o,t.heap[--t.heap_max]=l,a[2*h]=a[2*o]+a[2*l],t.depth[h]=(t.depth[o]>=t.depth[l]?t.depth[o]:t.depth[l])+1,a[2*o+1]=a[2*l+1]=h,t.heap[1]=h++,S(t,a,1)}while(t.heap_len>=2);t.heap[--t.heap_max]=t.heap[1],((t,e)=>{const a=e.dyn_tree,i=e.max_code,n=e.stat_desc.static_tree,r=e.stat_desc.has_stree,o=e.stat_desc.extra_bits,l=e.stat_desc.extra_base,h=e.stat_desc.max_length;let d,_,f,c,u,w,m=0;for(c=0;c<=s;c++)t.bl_count[c]=0;for(a[2*t.heap[t.heap_max]+1]=0,d=t.heap_max+1;d<573;d++)_=t.heap[d],c=a[2*a[2*_+1]+1]+1,c>h&&(c=h,m++),a[2*_+1]=c,_>i||(t.bl_count[c]++,u=0,_>=l&&(u=o[_-l]),w=a[2*_],t.opt_len+=w*(c+u),r&&(t.static_len+=w*(n[2*_+1]+u)));if(0!==m){do{for(c=h-1;0===t.bl_count[c];)c--;t.bl_count[c]--,t.bl_count[c+1]+=2,t.bl_count[h]--,m-=2}while(m>0);for(c=h;0!==c;c--)for(_=t.bl_count[c];0!==_;)f=t.heap[--d],f>i||(a[2*f+1]!==c&&(t.opt_len+=(c-a[2*f+1])*a[2*f],a[2*f+1]=c),_--)}})(t,e),E(a,d,t.bl_count)},O=(t,e,a)=>{let i,n,s=-1,r=e[1],o=0,l=7,h=4;for(0===r&&(l=138,h=3),e[2*(a+1)+1]=65535,i=0;i<=a;i++)n=r,r=e[2*(i+1)+1],++o<l&&n===r||(o<h?t.bl_tree[2*n]+=o:0!==n?(n!==s&&t.bl_tree[2*n]++,t.bl_tree[32]++):o<=10?t.bl_tree[34]++:t.bl_tree[36]++,o=0,s=n,0===r?(l=138,h=3):n===r?(l=6,h=3):(l=7,h=4))},I=(t,e,a)=>{let i,n,s=-1,r=e[1],o=0,l=7,h=4;for(0===r&&(l=138,h=3),i=0;i<=a;i++)if(n=r,r=e[2*(i+1)+1],!(++o<l&&n===r)){if(o<h)do{z(t,n,t.bl_tree)}while(0!=--o);else 0!==n?(n!==s&&(z(t,n,t.bl_tree),o--),z(t,16,t.bl_tree),x(t,o-3,2)):o<=10?(z(t,17,t.bl_tree),x(t,o-3,3)):(z(t,18,t.bl_tree),x(t,o-11,7));o=0,s=n,0===r?(l=138,h=3):n===r?(l=6,h=3):(l=7,h=4)}};let F=!1;const L=(t,e,a,i)=>{x(t,0+(i?1:0),3),Z(t),y(t,a),y(t,~a),a&&t.pending_buf.set(t.window.subarray(e,e+a),t.pending),t.pending+=a};var N=(t,e,i,n)=>{let s,r,o=0;t.level>0?(2===t.strm.data_type&&(t.strm.data_type=(t=>{let e,i=4093624447;for(e=0;e<=31;e++,i>>>=1)if(1&i&&0!==t.dyn_ltree[2*e])return 0;if(0!==t.dyn_ltree[18]||0!==t.dyn_ltree[20]||0!==t.dyn_ltree[26])return 1;for(e=32;e<a;e++)if(0!==t.dyn_ltree[2*e])return 1;return 0})(t)),T(t,t.l_desc),T(t,t.d_desc),o=(t=>{let e;for(O(t,t.dyn_ltree,t.l_desc.max_code),O(t,t.dyn_dtree,t.d_desc.max_code),T(t,t.bl_desc),e=18;e>=3&&0===t.bl_tree[2*h[e]+1];e--);return t.opt_len+=3*(e+1)+5+5+4,e})(t),s=t.opt_len+3+7>>>3,r=t.static_len+3+7>>>3,r<=s&&(s=r)):s=r=i+5,i+4<=s&&-1!==e?L(t,e,i,n):4===t.strategy||r===s?(x(t,2+(n?1:0),3),D(t,d,_)):(x(t,4+(n?1:0),3),((t,e,a,i)=>{let n;for(x(t,e-257,5),x(t,a-1,5),x(t,i-4,4),n=0;n<i;n++)x(t,t.bl_tree[2*h[n]+1],3);I(t,t.dyn_ltree,e-1),I(t,t.dyn_dtree,a-1)})(t,t.l_desc.max_code+1,t.d_desc.max_code+1,o+1),D(t,t.dyn_ltree,t.dyn_dtree)),R(t),n&&Z(t)},B={_tr_init:t=>{F||((()=>{let t,e,a,h,k;const v=new Array(16);for(a=0,h=0;h<28;h++)for(u[h]=a,t=0;t<1<<r[h];t++)c[a++]=h;for(c[a-1]=h,k=0,h=0;h<16;h++)for(w[h]=k,t=0;t<1<<o[h];t++)f[k++]=h;for(k>>=7;h<n;h++)for(w[h]=k<<7,t=0;t<1<<o[h]-7;t++)f[256+k++]=h;for(e=0;e<=s;e++)v[e]=0;for(t=0;t<=143;)d[2*t+1]=8,t++,v[8]++;for(;t<=255;)d[2*t+1]=9,t++,v[9]++;for(;t<=279;)d[2*t+1]=7,t++,v[7]++;for(;t<=287;)d[2*t+1]=8,t++,v[8]++;for(E(d,287,v),t=0;t<n;t++)_[2*t+1]=5,_[2*t]=A(t,5);b=new m(d,r,257,i,s),g=new m(_,o,0,n,s),p=new m(new Array(0),l,0,19,7)})(),F=!0),t.l_desc=new k(t.dyn_ltree,b),t.d_desc=new k(t.dyn_dtree,g),t.bl_desc=new k(t.bl_tree,p),t.bi_buf=0,t.bi_valid=0,R(t)},_tr_stored_block:L,_tr_flush_block:N,_tr_tally:(t,e,i)=>(t.pending_buf[t.sym_buf+t.sym_next++]=e,t.pending_buf[t.sym_buf+t.sym_next++]=e>>8,t.pending_buf[t.sym_buf+t.sym_next++]=i,0===e?t.dyn_ltree[2*i]++:(t.matches++,e--,t.dyn_ltree[2*(c[i]+a+1)]++,t.dyn_dtree[2*v(e)]++),t.sym_next===t.sym_end),_tr_align:t=>{x(t,2,3),z(t,256,d),(t=>{16===t.bi_valid?(y(t,t.bi_buf),t.bi_buf=0,t.bi_valid=0):t.bi_valid>=8&&(t.pending_buf[t.pending++]=255&t.bi_buf,t.bi_buf>>=8,t.bi_valid-=8)})(t)}};var C=(t,e,a,i)=>{let n=65535&t|0,s=t>>>16&65535|0,r=0;for(;0!==a;){r=a>2e3?2e3:a,a-=r;do{n=n+e[i++]|0,s=s+n|0}while(--r);n%=65521,s%=65521}return n|s<<16|0};const M=new Uint32Array((()=>{let t,e=[];for(var a=0;a<256;a++){t=a;for(var i=0;i<8;i++)t=1&t?3988292384^t>>>1:t>>>1;e[a]=t}return e})());var H=(t,e,a,i)=>{const n=M,s=i+a;t^=-1;for(let a=i;a<s;a++)t=t>>>8^n[255&(t^e[a])];return-1^t},j={2:"need dictionary",1:"stream end",0:"","-1":"file error","-2":"stream error","-3":"data error","-4":"insufficient memory","-5":"buffer error","-6":"incompatible version"},K={Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_ERRNO:-1,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_MEM_ERROR:-4,Z_BUF_ERROR:-5,Z_NO_COMPRESSION:0,Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,Z_BINARY:0,Z_TEXT:1,Z_UNKNOWN:2,Z_DEFLATED:8};const{_tr_init:P,_tr_stored_block:Y,_tr_flush_block:G,_tr_tally:X,_tr_align:W}=B,{Z_NO_FLUSH:q,Z_PARTIAL_FLUSH:J,Z_FULL_FLUSH:Q,Z_FINISH:V,Z_BLOCK:$,Z_OK:tt,Z_STREAM_END:et,Z_STREAM_ERROR:at,Z_DATA_ERROR:it,Z_BUF_ERROR:nt,Z_DEFAULT_COMPRESSION:st,Z_FILTERED:rt,Z_HUFFMAN_ONLY:ot,Z_RLE:lt,Z_FIXED:ht,Z_DEFAULT_STRATEGY:dt,Z_UNKNOWN:_t,Z_DEFLATED:ft}=K,ct=258,ut=262,wt=42,mt=113,bt=666,gt=(t,e)=>(t.msg=j[e],e),pt=t=>2*t-(t>4?9:0),kt=t=>{let e=t.length;for(;--e>=0;)t[e]=0},vt=t=>{let e,a,i,n=t.w_size;e=t.hash_size,i=e;do{a=t.head[--i],t.head[i]=a>=n?a-n:0}while(--e);e=n,i=e;do{a=t.prev[--i],t.prev[i]=a>=n?a-n:0}while(--e)};let yt=(t,e,a)=>(e<<t.hash_shift^a)&t.hash_mask;const xt=t=>{const e=t.state;let a=e.pending;a>t.avail_out&&(a=t.avail_out),0!==a&&(t.output.set(e.pending_buf.subarray(e.pending_out,e.pending_out+a),t.next_out),t.next_out+=a,e.pending_out+=a,t.total_out+=a,t.avail_out-=a,e.pending-=a,0===e.pending&&(e.pending_out=0))},zt=(t,e)=>{G(t,t.block_start>=0?t.block_start:-1,t.strstart-t.block_start,e),t.block_start=t.strstart,xt(t.strm)},At=(t,e)=>{t.pending_buf[t.pending++]=e},Et=(t,e)=>{t.pending_buf[t.pending++]=e>>>8&255,t.pending_buf[t.pending++]=255&e},Rt=(t,e,a,i)=>{let n=t.avail_in;return n>i&&(n=i),0===n?0:(t.avail_in-=n,e.set(t.input.subarray(t.next_in,t.next_in+n),a),1===t.state.wrap?t.adler=C(t.adler,e,n,a):2===t.state.wrap&&(t.adler=H(t.adler,e,n,a)),t.next_in+=n,t.total_in+=n,n)},Zt=(t,e)=>{let a,i,n=t.max_chain_length,s=t.strstart,r=t.prev_length,o=t.nice_match;const l=t.strstart>t.w_size-ut?t.strstart-(t.w_size-ut):0,h=t.window,d=t.w_mask,_=t.prev,f=t.strstart+ct;let c=h[s+r-1],u=h[s+r];t.prev_length>=t.good_match&&(n>>=2),o>t.lookahead&&(o=t.lookahead);do{if(a=e,h[a+r]===u&&h[a+r-1]===c&&h[a]===h[s]&&h[++a]===h[s+1]){s+=2,a++;do{}while(h[++s]===h[++a]&&h[++s]===h[++a]&&h[++s]===h[++a]&&h[++s]===h[++a]&&h[++s]===h[++a]&&h[++s]===h[++a]&&h[++s]===h[++a]&&h[++s]===h[++a]&&s<f);if(i=ct-(f-s),s=f-ct,i>r){if(t.match_start=e,r=i,i>=o)break;c=h[s+r-1],u=h[s+r]}}}while((e=_[e&d])>l&&0!=--n);return r<=t.lookahead?r:t.lookahead},Ut=t=>{const e=t.w_size;let a,i,n;do{if(i=t.window_size-t.lookahead-t.strstart,t.strstart>=e+(e-ut)&&(t.window.set(t.window.subarray(e,e+e-i),0),t.match_start-=e,t.strstart-=e,t.block_start-=e,t.insert>t.strstart&&(t.insert=t.strstart),vt(t),i+=e),0===t.strm.avail_in)break;if(a=Rt(t.strm,t.window,t.strstart+t.lookahead,i),t.lookahead+=a,t.lookahead+t.insert>=3)for(n=t.strstart-t.insert,t.ins_h=t.window[n],t.ins_h=yt(t,t.ins_h,t.window[n+1]);t.insert&&(t.ins_h=yt(t,t.ins_h,t.window[n+3-1]),t.prev[n&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=n,n++,t.insert--,!(t.lookahead+t.insert<3)););}while(t.lookahead<ut&&0!==t.strm.avail_in)},St=(t,e)=>{let a,i,n,s=t.pending_buf_size-5>t.w_size?t.w_size:t.pending_buf_size-5,r=0,o=t.strm.avail_in;do{if(a=65535,n=t.bi_valid+42>>3,t.strm.avail_out<n)break;if(n=t.strm.avail_out-n,i=t.strstart-t.block_start,a>i+t.strm.avail_in&&(a=i+t.strm.avail_in),a>n&&(a=n),a<s&&(0===a&&e!==V||e===q||a!==i+t.strm.avail_in))break;r=e===V&&a===i+t.strm.avail_in?1:0,Y(t,0,0,r),t.pending_buf[t.pending-4]=a,t.pending_buf[t.pending-3]=a>>8,t.pending_buf[t.pending-2]=~a,t.pending_buf[t.pending-1]=~a>>8,xt(t.strm),i&&(i>a&&(i=a),t.strm.output.set(t.window.subarray(t.block_start,t.block_start+i),t.strm.next_out),t.strm.next_out+=i,t.strm.avail_out-=i,t.strm.total_out+=i,t.block_start+=i,a-=i),a&&(Rt(t.strm,t.strm.output,t.strm.next_out,a),t.strm.next_out+=a,t.strm.avail_out-=a,t.strm.total_out+=a)}while(0===r);return o-=t.strm.avail_in,o&&(o>=t.w_size?(t.matches=2,t.window.set(t.strm.input.subarray(t.strm.next_in-t.w_size,t.strm.next_in),0),t.strstart=t.w_size,t.insert=t.strstart):(t.window_size-t.strstart<=o&&(t.strstart-=t.w_size,t.window.set(t.window.subarray(t.w_size,t.w_size+t.strstart),0),t.matches<2&&t.matches++,t.insert>t.strstart&&(t.insert=t.strstart)),t.window.set(t.strm.input.subarray(t.strm.next_in-o,t.strm.next_in),t.strstart),t.strstart+=o,t.insert+=o>t.w_size-t.insert?t.w_size-t.insert:o),t.block_start=t.strstart),t.high_water<t.strstart&&(t.high_water=t.strstart),r?4:e!==q&&e!==V&&0===t.strm.avail_in&&t.strstart===t.block_start?2:(n=t.window_size-t.strstart,t.strm.avail_in>n&&t.block_start>=t.w_size&&(t.block_start-=t.w_size,t.strstart-=t.w_size,t.window.set(t.window.subarray(t.w_size,t.w_size+t.strstart),0),t.matches<2&&t.matches++,n+=t.w_size,t.insert>t.strstart&&(t.insert=t.strstart)),n>t.strm.avail_in&&(n=t.strm.avail_in),n&&(Rt(t.strm,t.window,t.strstart,n),t.strstart+=n,t.insert+=n>t.w_size-t.insert?t.w_size-t.insert:n),t.high_water<t.strstart&&(t.high_water=t.strstart),n=t.bi_valid+42>>3,n=t.pending_buf_size-n>65535?65535:t.pending_buf_size-n,s=n>t.w_size?t.w_size:n,i=t.strstart-t.block_start,(i>=s||(i||e===V)&&e!==q&&0===t.strm.avail_in&&i<=n)&&(a=i>n?n:i,r=e===V&&0===t.strm.avail_in&&a===i?1:0,Y(t,t.block_start,a,r),t.block_start+=a,xt(t.strm)),r?3:1)},Dt=(t,e)=>{let a,i;for(;;){if(t.lookahead<ut){if(Ut(t),t.lookahead<ut&&e===q)return 1;if(0===t.lookahead)break}if(a=0,t.lookahead>=3&&(t.ins_h=yt(t,t.ins_h,t.window[t.strstart+3-1]),a=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart),0!==a&&t.strstart-a<=t.w_size-ut&&(t.match_length=Zt(t,a)),t.match_length>=3)if(i=X(t,t.strstart-t.match_start,t.match_length-3),t.lookahead-=t.match_length,t.match_length<=t.max_lazy_match&&t.lookahead>=3){t.match_length--;do{t.strstart++,t.ins_h=yt(t,t.ins_h,t.window[t.strstart+3-1]),a=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart}while(0!=--t.match_length);t.strstart++}else t.strstart+=t.match_length,t.match_length=0,t.ins_h=t.window[t.strstart],t.ins_h=yt(t,t.ins_h,t.window[t.strstart+1]);else i=X(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++;if(i&&(zt(t,!1),0===t.strm.avail_out))return 1}return t.insert=t.strstart<2?t.strstart:2,e===V?(zt(t,!0),0===t.strm.avail_out?3:4):t.sym_next&&(zt(t,!1),0===t.strm.avail_out)?1:2},Tt=(t,e)=>{let a,i,n;for(;;){if(t.lookahead<ut){if(Ut(t),t.lookahead<ut&&e===q)return 1;if(0===t.lookahead)break}if(a=0,t.lookahead>=3&&(t.ins_h=yt(t,t.ins_h,t.window[t.strstart+3-1]),a=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart),t.prev_length=t.match_length,t.prev_match=t.match_start,t.match_length=2,0!==a&&t.prev_length<t.max_lazy_match&&t.strstart-a<=t.w_size-ut&&(t.match_length=Zt(t,a),t.match_length<=5&&(t.strategy===rt||3===t.match_length&&t.strstart-t.match_start>4096)&&(t.match_length=2)),t.prev_length>=3&&t.match_length<=t.prev_length){n=t.strstart+t.lookahead-3,i=X(t,t.strstart-1-t.prev_match,t.prev_length-3),t.lookahead-=t.prev_length-1,t.prev_length-=2;do{++t.strstart<=n&&(t.ins_h=yt(t,t.ins_h,t.window[t.strstart+3-1]),a=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart)}while(0!=--t.prev_length);if(t.match_available=0,t.match_length=2,t.strstart++,i&&(zt(t,!1),0===t.strm.avail_out))return 1}else if(t.match_available){if(i=X(t,0,t.window[t.strstart-1]),i&&zt(t,!1),t.strstart++,t.lookahead--,0===t.strm.avail_out)return 1}else t.match_available=1,t.strstart++,t.lookahead--}return t.match_available&&(i=X(t,0,t.window[t.strstart-1]),t.match_available=0),t.insert=t.strstart<2?t.strstart:2,e===V?(zt(t,!0),0===t.strm.avail_out?3:4):t.sym_next&&(zt(t,!1),0===t.strm.avail_out)?1:2};function Ot(t,e,a,i,n){this.good_length=t,this.max_lazy=e,this.nice_length=a,this.max_chain=i,this.func=n}const It=[new Ot(0,0,0,0,St),new Ot(4,4,8,4,Dt),new Ot(4,5,16,8,Dt),new Ot(4,6,32,32,Dt),new Ot(4,4,16,16,Tt),new Ot(8,16,32,32,Tt),new Ot(8,16,128,128,Tt),new Ot(8,32,128,256,Tt),new Ot(32,128,258,1024,Tt),new Ot(32,258,258,4096,Tt)];function Ft(){this.strm=null,this.status=0,this.pending_buf=null,this.pending_buf_size=0,this.pending_out=0,this.pending=0,this.wrap=0,this.gzhead=null,this.gzindex=0,this.method=ft,this.last_flush=-1,this.w_size=0,this.w_bits=0,this.w_mask=0,this.window=null,this.window_size=0,this.prev=null,this.head=null,this.ins_h=0,this.hash_size=0,this.hash_bits=0,this.hash_mask=0,this.hash_shift=0,this.block_start=0,this.match_length=0,this.prev_match=0,this.match_available=0,this.strstart=0,this.match_start=0,this.lookahead=0,this.prev_length=0,this.max_chain_length=0,this.max_lazy_match=0,this.level=0,this.strategy=0,this.good_match=0,this.nice_match=0,this.dyn_ltree=new Uint16Array(1146),this.dyn_dtree=new Uint16Array(122),this.bl_tree=new Uint16Array(78),kt(this.dyn_ltree),kt(this.dyn_dtree),kt(this.bl_tree),this.l_desc=null,this.d_desc=null,this.bl_desc=null,this.bl_count=new Uint16Array(16),this.heap=new Uint16Array(573),kt(this.heap),this.heap_len=0,this.heap_max=0,this.depth=new Uint16Array(573),kt(this.depth),this.sym_buf=0,this.lit_bufsize=0,this.sym_next=0,this.sym_end=0,this.opt_len=0,this.static_len=0,this.matches=0,this.insert=0,this.bi_buf=0,this.bi_valid=0}const Lt=t=>{if(!t)return 1;const e=t.state;return!e||e.strm!==t||e.status!==wt&&57!==e.status&&69!==e.status&&73!==e.status&&91!==e.status&&103!==e.status&&e.status!==mt&&e.status!==bt?1:0},Nt=t=>{if(Lt(t))return gt(t,at);t.total_in=t.total_out=0,t.data_type=_t;const e=t.state;return e.pending=0,e.pending_out=0,e.wrap<0&&(e.wrap=-e.wrap),e.status=2===e.wrap?57:e.wrap?wt:mt,t.adler=2===e.wrap?0:1,e.last_flush=-2,P(e),tt},Bt=t=>{const e=Nt(t);var a;return e===tt&&((a=t.state).window_size=2*a.w_size,kt(a.head),a.max_lazy_match=It[a.level].max_lazy,a.good_match=It[a.level].good_length,a.nice_match=It[a.level].nice_length,a.max_chain_length=It[a.level].max_chain,a.strstart=0,a.block_start=0,a.lookahead=0,a.insert=0,a.match_length=a.prev_length=2,a.match_available=0,a.ins_h=0),e},Ct=(t,e,a,i,n,s)=>{if(!t)return at;let r=1;if(e===st&&(e=6),i<0?(r=0,i=-i):i>15&&(r=2,i-=16),n<1||n>9||a!==ft||i<8||i>15||e<0||e>9||s<0||s>ht||8===i&&1!==r)return gt(t,at);8===i&&(i=9);const o=new Ft;return t.state=o,o.strm=t,o.status=wt,o.wrap=r,o.gzhead=null,o.w_bits=i,o.w_size=1<<o.w_bits,o.w_mask=o.w_size-1,o.hash_bits=n+7,o.hash_size=1<<o.hash_bits,o.hash_mask=o.hash_size-1,o.hash_shift=~~((o.hash_bits+3-1)/3),o.window=new Uint8Array(2*o.w_size),o.head=new Uint16Array(o.hash_size),o.prev=new Uint16Array(o.w_size),o.lit_bufsize=1<<n+6,o.pending_buf_size=4*o.lit_bufsize,o.pending_buf=new Uint8Array(o.pending_buf_size),o.sym_buf=o.lit_bufsize,o.sym_end=3*(o.lit_bufsize-1),o.level=e,o.strategy=s,o.method=a,Bt(t)};var Mt={deflateInit:(t,e)=>Ct(t,e,ft,15,8,dt),deflateInit2:Ct,deflateReset:Bt,deflateResetKeep:Nt,deflateSetHeader:(t,e)=>Lt(t)||2!==t.state.wrap?at:(t.state.gzhead=e,tt),deflate:(t,e)=>{if(Lt(t)||e>$||e<0)return t?gt(t,at):at;const a=t.state;if(!t.output||0!==t.avail_in&&!t.input||a.status===bt&&e!==V)return gt(t,0===t.avail_out?nt:at);const i=a.last_flush;if(a.last_flush=e,0!==a.pending){if(xt(t),0===t.avail_out)return a.last_flush=-1,tt}else if(0===t.avail_in&&pt(e)<=pt(i)&&e!==V)return gt(t,nt);if(a.status===bt&&0!==t.avail_in)return gt(t,nt);if(a.status===wt&&0===a.wrap&&(a.status=mt),a.status===wt){let e=ft+(a.w_bits-8<<4)<<8,i=-1;if(i=a.strategy>=ot||a.level<2?0:a.level<6?1:6===a.level?2:3,e|=i<<6,0!==a.strstart&&(e|=32),e+=31-e%31,Et(a,e),0!==a.strstart&&(Et(a,t.adler>>>16),Et(a,65535&t.adler)),t.adler=1,a.status=mt,xt(t),0!==a.pending)return a.last_flush=-1,tt}if(57===a.status)if(t.adler=0,At(a,31),At(a,139),At(a,8),a.gzhead)At(a,(a.gzhead.text?1:0)+(a.gzhead.hcrc?2:0)+(a.gzhead.extra?4:0)+(a.gzhead.name?8:0)+(a.gzhead.comment?16:0)),At(a,255&a.gzhead.time),At(a,a.gzhead.time>>8&255),At(a,a.gzhead.time>>16&255),At(a,a.gzhead.time>>24&255),At(a,9===a.level?2:a.strategy>=ot||a.level<2?4:0),At(a,255&a.gzhead.os),a.gzhead.extra&&a.gzhead.extra.length&&(At(a,255&a.gzhead.extra.length),At(a,a.gzhead.extra.length>>8&255)),a.gzhead.hcrc&&(t.adler=H(t.adler,a.pending_buf,a.pending,0)),a.gzindex=0,a.status=69;else if(At(a,0),At(a,0),At(a,0),At(a,0),At(a,0),At(a,9===a.level?2:a.strategy>=ot||a.level<2?4:0),At(a,3),a.status=mt,xt(t),0!==a.pending)return a.last_flush=-1,tt;if(69===a.status){if(a.gzhead.extra){let e=a.pending,i=(65535&a.gzhead.extra.length)-a.gzindex;for(;a.pending+i>a.pending_buf_size;){let n=a.pending_buf_size-a.pending;if(a.pending_buf.set(a.gzhead.extra.subarray(a.gzindex,a.gzindex+n),a.pending),a.pending=a.pending_buf_size,a.gzhead.hcrc&&a.pending>e&&(t.adler=H(t.adler,a.pending_buf,a.pending-e,e)),a.gzindex+=n,xt(t),0!==a.pending)return a.last_flush=-1,tt;e=0,i-=n}let n=new Uint8Array(a.gzhead.extra);a.pending_buf.set(n.subarray(a.gzindex,a.gzindex+i),a.pending),a.pending+=i,a.gzhead.hcrc&&a.pending>e&&(t.adler=H(t.adler,a.pending_buf,a.pending-e,e)),a.gzindex=0}a.status=73}if(73===a.status){if(a.gzhead.name){let e,i=a.pending;do{if(a.pending===a.pending_buf_size){if(a.gzhead.hcrc&&a.pending>i&&(t.adler=H(t.adler,a.pending_buf,a.pending-i,i)),xt(t),0!==a.pending)return a.last_flush=-1,tt;i=0}e=a.gzindex<a.gzhead.name.length?255&a.gzhead.name.charCodeAt(a.gzindex++):0,At(a,e)}while(0!==e);a.gzhead.hcrc&&a.pending>i&&(t.adler=H(t.adler,a.pending_buf,a.pending-i,i)),a.gzindex=0}a.status=91}if(91===a.status){if(a.gzhead.comment){let e,i=a.pending;do{if(a.pending===a.pending_buf_size){if(a.gzhead.hcrc&&a.pending>i&&(t.adler=H(t.adler,a.pending_buf,a.pending-i,i)),xt(t),0!==a.pending)return a.last_flush=-1,tt;i=0}e=a.gzindex<a.gzhead.comment.length?255&a.gzhead.comment.charCodeAt(a.gzindex++):0,At(a,e)}while(0!==e);a.gzhead.hcrc&&a.pending>i&&(t.adler=H(t.adler,a.pending_buf,a.pending-i,i))}a.status=103}if(103===a.status){if(a.gzhead.hcrc){if(a.pending+2>a.pending_buf_size&&(xt(t),0!==a.pending))return a.last_flush=-1,tt;At(a,255&t.adler),At(a,t.adler>>8&255),t.adler=0}if(a.status=mt,xt(t),0!==a.pending)return a.last_flush=-1,tt}if(0!==t.avail_in||0!==a.lookahead||e!==q&&a.status!==bt){let i=0===a.level?St(a,e):a.strategy===ot?((t,e)=>{let a;for(;;){if(0===t.lookahead&&(Ut(t),0===t.lookahead)){if(e===q)return 1;break}if(t.match_length=0,a=X(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++,a&&(zt(t,!1),0===t.strm.avail_out))return 1}return t.insert=0,e===V?(zt(t,!0),0===t.strm.avail_out?3:4):t.sym_next&&(zt(t,!1),0===t.strm.avail_out)?1:2})(a,e):a.strategy===lt?((t,e)=>{let a,i,n,s;const r=t.window;for(;;){if(t.lookahead<=ct){if(Ut(t),t.lookahead<=ct&&e===q)return 1;if(0===t.lookahead)break}if(t.match_length=0,t.lookahead>=3&&t.strstart>0&&(n=t.strstart-1,i=r[n],i===r[++n]&&i===r[++n]&&i===r[++n])){s=t.strstart+ct;do{}while(i===r[++n]&&i===r[++n]&&i===r[++n]&&i===r[++n]&&i===r[++n]&&i===r[++n]&&i===r[++n]&&i===r[++n]&&n<s);t.match_length=ct-(s-n),t.match_length>t.lookahead&&(t.match_length=t.lookahead)}if(t.match_length>=3?(a=X(t,1,t.match_length-3),t.lookahead-=t.match_length,t.strstart+=t.match_length,t.match_length=0):(a=X(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++),a&&(zt(t,!1),0===t.strm.avail_out))return 1}return t.insert=0,e===V?(zt(t,!0),0===t.strm.avail_out?3:4):t.sym_next&&(zt(t,!1),0===t.strm.avail_out)?1:2})(a,e):It[a.level].func(a,e);if(3!==i&&4!==i||(a.status=bt),1===i||3===i)return 0===t.avail_out&&(a.last_flush=-1),tt;if(2===i&&(e===J?W(a):e!==$&&(Y(a,0,0,!1),e===Q&&(kt(a.head),0===a.lookahead&&(a.strstart=0,a.block_start=0,a.insert=0))),xt(t),0===t.avail_out))return a.last_flush=-1,tt}return e!==V?tt:a.wrap<=0?et:(2===a.wrap?(At(a,255&t.adler),At(a,t.adler>>8&255),At(a,t.adler>>16&255),At(a,t.adler>>24&255),At(a,255&t.total_in),At(a,t.total_in>>8&255),At(a,t.total_in>>16&255),At(a,t.total_in>>24&255)):(Et(a,t.adler>>>16),Et(a,65535&t.adler)),xt(t),a.wrap>0&&(a.wrap=-a.wrap),0!==a.pending?tt:et)},deflateEnd:t=>{if(Lt(t))return at;const e=t.state.status;return t.state=null,e===mt?gt(t,it):tt},deflateSetDictionary:(t,e)=>{let a=e.length;if(Lt(t))return at;const i=t.state,n=i.wrap;if(2===n||1===n&&i.status!==wt||i.lookahead)return at;if(1===n&&(t.adler=C(t.adler,e,a,0)),i.wrap=0,a>=i.w_size){0===n&&(kt(i.head),i.strstart=0,i.block_start=0,i.insert=0);let t=new Uint8Array(i.w_size);t.set(e.subarray(a-i.w_size,a),0),e=t,a=i.w_size}const s=t.avail_in,r=t.next_in,o=t.input;for(t.avail_in=a,t.next_in=0,t.input=e,Ut(i);i.lookahead>=3;){let t=i.strstart,e=i.lookahead-2;do{i.ins_h=yt(i,i.ins_h,i.window[t+3-1]),i.prev[t&i.w_mask]=i.head[i.ins_h],i.head[i.ins_h]=t,t++}while(--e);i.strstart=t,i.lookahead=2,Ut(i)}return i.strstart+=i.lookahead,i.block_start=i.strstart,i.insert=i.lookahead,i.lookahead=0,i.match_length=i.prev_length=2,i.match_available=0,t.next_in=r,t.input=o,t.avail_in=s,i.wrap=n,tt},deflateInfo:"pako deflate (from Nodeca project)"};const Ht=(t,e)=>Object.prototype.hasOwnProperty.call(t,e);var jt=function(t){const e=Array.prototype.slice.call(arguments,1);for(;e.length;){const a=e.shift();if(a){if("object"!=typeof a)throw new TypeError(a+"must be non-object");for(const e in a)Ht(a,e)&&(t[e]=a[e])}}return t},Kt=t=>{let e=0;for(let a=0,i=t.length;a<i;a++)e+=t[a].length;const a=new Uint8Array(e);for(let e=0,i=0,n=t.length;e<n;e++){let n=t[e];a.set(n,i),i+=n.length}return a};let Pt=!0;try{String.fromCharCode.apply(null,new Uint8Array(1))}catch(t){Pt=!1}const Yt=new Uint8Array(256);for(let t=0;t<256;t++)Yt[t]=t>=252?6:t>=248?5:t>=240?4:t>=224?3:t>=192?2:1;Yt[254]=Yt[254]=1;var Gt=t=>{if("function"==typeof TextEncoder&&TextEncoder.prototype.encode)return(new TextEncoder).encode(t);let e,a,i,n,s,r=t.length,o=0;for(n=0;n<r;n++)a=t.charCodeAt(n),55296==(64512&a)&&n+1<r&&(i=t.charCodeAt(n+1),56320==(64512&i)&&(a=65536+(a-55296<<10)+(i-56320),n++)),o+=a<128?1:a<2048?2:a<65536?3:4;for(e=new Uint8Array(o),s=0,n=0;s<o;n++)a=t.charCodeAt(n),55296==(64512&a)&&n+1<r&&(i=t.charCodeAt(n+1),56320==(64512&i)&&(a=65536+(a-55296<<10)+(i-56320),n++)),a<128?e[s++]=a:a<2048?(e[s++]=192|a>>>6,e[s++]=128|63&a):a<65536?(e[s++]=224|a>>>12,e[s++]=128|a>>>6&63,e[s++]=128|63&a):(e[s++]=240|a>>>18,e[s++]=128|a>>>12&63,e[s++]=128|a>>>6&63,e[s++]=128|63&a);return e},Xt=(t,e)=>{const a=e||t.length;if("function"==typeof TextDecoder&&TextDecoder.prototype.decode)return(new TextDecoder).decode(t.subarray(0,e));let i,n;const s=new Array(2*a);for(n=0,i=0;i<a;){let e=t[i++];if(e<128){s[n++]=e;continue}let r=Yt[e];if(r>4)s[n++]=65533,i+=r-1;else{for(e&=2===r?31:3===r?15:7;r>1&&i<a;)e=e<<6|63&t[i++],r--;r>1?s[n++]=65533:e<65536?s[n++]=e:(e-=65536,s[n++]=55296|e>>10&1023,s[n++]=56320|1023&e)}}return((t,e)=>{if(e<65534&&t.subarray&&Pt)return String.fromCharCode.apply(null,t.length===e?t:t.subarray(0,e));let a="";for(let i=0;i<e;i++)a+=String.fromCharCode(t[i]);return a})(s,n)},Wt=(t,e)=>{(e=e||t.length)>t.length&&(e=t.length);let a=e-1;for(;a>=0&&128==(192&t[a]);)a--;return a<0||0===a?e:a+Yt[t[a]]>e?a:e};var qt=function(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg="",this.state=null,this.data_type=2,this.adler=0};const Jt=Object.prototype.toString,{Z_NO_FLUSH:Qt,Z_SYNC_FLUSH:Vt,Z_FULL_FLUSH:$t,Z_FINISH:te,Z_OK:ee,Z_STREAM_END:ae,Z_DEFAULT_COMPRESSION:ie,Z_DEFAULT_STRATEGY:ne,Z_DEFLATED:se}=K;function re(t){this.options=jt({level:ie,method:se,chunkSize:16384,windowBits:15,memLevel:8,strategy:ne},t||{});let e=this.options;e.raw&&e.windowBits>0?e.windowBits=-e.windowBits:e.gzip&&e.windowBits>0&&e.windowBits<16&&(e.windowBits+=16),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new qt,this.strm.avail_out=0;let a=Mt.deflateInit2(this.strm,e.level,e.method,e.windowBits,e.memLevel,e.strategy);if(a!==ee)throw new Error(j[a]);if(e.header&&Mt.deflateSetHeader(this.strm,e.header),e.dictionary){let t;if(t="string"==typeof e.dictionary?Gt(e.dictionary):"[object ArrayBuffer]"===Jt.call(e.dictionary)?new Uint8Array(e.dictionary):e.dictionary,a=Mt.deflateSetDictionary(this.strm,t),a!==ee)throw new Error(j[a]);this._dict_set=!0}}function oe(t,e){const a=new re(e);if(a.push(t,!0),a.err)throw a.msg||j[a.err];return a.result}re.prototype.push=function(t,e){const a=this.strm,i=this.options.chunkSize;let n,s;if(this.ended)return!1;for(s=e===~~e?e:!0===e?te:Qt,"string"==typeof t?a.input=Gt(t):"[object ArrayBuffer]"===Jt.call(t)?a.input=new Uint8Array(t):a.input=t,a.next_in=0,a.avail_in=a.input.length;;)if(0===a.avail_out&&(a.output=new Uint8Array(i),a.next_out=0,a.avail_out=i),(s===Vt||s===$t)&&a.avail_out<=6)this.onData(a.output.subarray(0,a.next_out)),a.avail_out=0;else{if(n=Mt.deflate(a,s),n===ae)return a.next_out>0&&this.onData(a.output.subarray(0,a.next_out)),n=Mt.deflateEnd(this.strm),this.onEnd(n),this.ended=!0,n===ee;if(0!==a.avail_out){if(s>0&&a.next_out>0)this.onData(a.output.subarray(0,a.next_out)),a.avail_out=0;else if(0===a.avail_in)break}else this.onData(a.output)}return!0},re.prototype.onData=function(t){this.chunks.push(t)},re.prototype.onEnd=function(t){t===ee&&(this.result=Kt(this.chunks)),this.chunks=[],this.err=t,this.msg=this.strm.msg};var le={Deflate:re,deflate:oe,deflateRaw:function(t,e){return(e=e||{}).raw=!0,oe(t,e)},gzip:function(t,e){return(e=e||{}).gzip=!0,oe(t,e)},constants:K};const he=16209;var de=function(t,e){let a,i,n,s,r,o,l,h,d,_,f,c,u,w,m,b,g,p,k,v,y,x,z,A;const E=t.state;a=t.next_in,z=t.input,i=a+(t.avail_in-5),n=t.next_out,A=t.output,s=n-(e-t.avail_out),r=n+(t.avail_out-257),o=E.dmax,l=E.wsize,h=E.whave,d=E.wnext,_=E.window,f=E.hold,c=E.bits,u=E.lencode,w=E.distcode,m=(1<<E.lenbits)-1,b=(1<<E.distbits)-1;t:do{c<15&&(f+=z[a++]<<c,c+=8,f+=z[a++]<<c,c+=8),g=u[f&m];e:for(;;){if(p=g>>>24,f>>>=p,c-=p,p=g>>>16&255,0===p)A[n++]=65535&g;else{if(!(16&p)){if(0==(64&p)){g=u[(65535&g)+(f&(1<<p)-1)];continue e}if(32&p){E.mode=16191;break t}t.msg="invalid literal/length code",E.mode=he;break t}k=65535&g,p&=15,p&&(c<p&&(f+=z[a++]<<c,c+=8),k+=f&(1<<p)-1,f>>>=p,c-=p),c<15&&(f+=z[a++]<<c,c+=8,f+=z[a++]<<c,c+=8),g=w[f&b];a:for(;;){if(p=g>>>24,f>>>=p,c-=p,p=g>>>16&255,!(16&p)){if(0==(64&p)){g=w[(65535&g)+(f&(1<<p)-1)];continue a}t.msg="invalid distance code",E.mode=he;break t}if(v=65535&g,p&=15,c<p&&(f+=z[a++]<<c,c+=8,c<p&&(f+=z[a++]<<c,c+=8)),v+=f&(1<<p)-1,v>o){t.msg="invalid distance too far back",E.mode=he;break t}if(f>>>=p,c-=p,p=n-s,v>p){if(p=v-p,p>h&&E.sane){t.msg="invalid distance too far back",E.mode=he;break t}if(y=0,x=_,0===d){if(y+=l-p,p<k){k-=p;do{A[n++]=_[y++]}while(--p);y=n-v,x=A}}else if(d<p){if(y+=l+d-p,p-=d,p<k){k-=p;do{A[n++]=_[y++]}while(--p);if(y=0,d<k){p=d,k-=p;do{A[n++]=_[y++]}while(--p);y=n-v,x=A}}}else if(y+=d-p,p<k){k-=p;do{A[n++]=_[y++]}while(--p);y=n-v,x=A}for(;k>2;)A[n++]=x[y++],A[n++]=x[y++],A[n++]=x[y++],k-=3;k&&(A[n++]=x[y++],k>1&&(A[n++]=x[y++]))}else{y=n-v;do{A[n++]=A[y++],A[n++]=A[y++],A[n++]=A[y++],k-=3}while(k>2);k&&(A[n++]=A[y++],k>1&&(A[n++]=A[y++]))}break}}break}}while(a<i&&n<r);k=c>>3,a-=k,c-=k<<3,f&=(1<<c)-1,t.next_in=a,t.next_out=n,t.avail_in=a<i?i-a+5:5-(a-i),t.avail_out=n<r?r-n+257:257-(n-r),E.hold=f,E.bits=c};const _e=15,fe=new Uint16Array([3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0]),ce=new Uint8Array([16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,72,78]),ue=new Uint16Array([1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0]),we=new Uint8Array([16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64]);var me=(t,e,a,i,n,s,r,o)=>{const l=o.bits;let h,d,_,f,c,u,w=0,m=0,b=0,g=0,p=0,k=0,v=0,y=0,x=0,z=0,A=null;const E=new Uint16Array(16),R=new Uint16Array(16);let Z,U,S,D=null;for(w=0;w<=_e;w++)E[w]=0;for(m=0;m<i;m++)E[e[a+m]]++;for(p=l,g=_e;g>=1&&0===E[g];g--);if(p>g&&(p=g),0===g)return n[s++]=20971520,n[s++]=20971520,o.bits=1,0;for(b=1;b<g&&0===E[b];b++);for(p<b&&(p=b),y=1,w=1;w<=_e;w++)if(y<<=1,y-=E[w],y<0)return-1;if(y>0&&(0===t||1!==g))return-1;for(R[1]=0,w=1;w<_e;w++)R[w+1]=R[w]+E[w];for(m=0;m<i;m++)0!==e[a+m]&&(r[R[e[a+m]]++]=m);if(0===t?(A=D=r,u=20):1===t?(A=fe,D=ce,u=257):(A=ue,D=we,u=0),z=0,m=0,w=b,c=s,k=p,v=0,_=-1,x=1<<p,f=x-1,1===t&&x>852||2===t&&x>592)return 1;for(;;){Z=w-v,r[m]+1<u?(U=0,S=r[m]):r[m]>=u?(U=D[r[m]-u],S=A[r[m]-u]):(U=96,S=0),h=1<<w-v,d=1<<k,b=d;do{d-=h,n[c+(z>>v)+d]=Z<<24|U<<16|S|0}while(0!==d);for(h=1<<w-1;z&h;)h>>=1;if(0!==h?(z&=h-1,z+=h):z=0,m++,0==--E[w]){if(w===g)break;w=e[a+r[m]]}if(w>p&&(z&f)!==_){for(0===v&&(v=p),c+=b,k=w-v,y=1<<k;k+v<g&&(y-=E[k+v],!(y<=0));)k++,y<<=1;if(x+=1<<k,1===t&&x>852||2===t&&x>592)return 1;_=z&f,n[_]=p<<24|k<<16|c-s|0}}return 0!==z&&(n[c+z]=w-v<<24|64<<16|0),o.bits=p,0};const{Z_FINISH:be,Z_BLOCK:ge,Z_TREES:pe,Z_OK:ke,Z_STREAM_END:ve,Z_NEED_DICT:ye,Z_STREAM_ERROR:xe,Z_DATA_ERROR:ze,Z_MEM_ERROR:Ae,Z_BUF_ERROR:Ee,Z_DEFLATED:Re}=K,Ze=16180,Ue=16190,Se=16191,De=16192,Te=16194,Oe=16199,Ie=16200,Fe=16206,Le=16209,Ne=t=>(t>>>24&255)+(t>>>8&65280)+((65280&t)<<8)+((255&t)<<24);function Be(){this.strm=null,this.mode=0,this.last=!1,this.wrap=0,this.havedict=!1,this.flags=0,this.dmax=0,this.check=0,this.total=0,this.head=null,this.wbits=0,this.wsize=0,this.whave=0,this.wnext=0,this.window=null,this.hold=0,this.bits=0,this.length=0,this.offset=0,this.extra=0,this.lencode=null,this.distcode=null,this.lenbits=0,this.distbits=0,this.ncode=0,this.nlen=0,this.ndist=0,this.have=0,this.next=null,this.lens=new Uint16Array(320),this.work=new Uint16Array(288),this.lendyn=null,this.distdyn=null,this.sane=0,this.back=0,this.was=0}const Ce=t=>{if(!t)return 1;const e=t.state;return!e||e.strm!==t||e.mode<Ze||e.mode>16211?1:0},Me=t=>{if(Ce(t))return xe;const e=t.state;return t.total_in=t.total_out=e.total=0,t.msg="",e.wrap&&(t.adler=1&e.wrap),e.mode=Ze,e.last=0,e.havedict=0,e.flags=-1,e.dmax=32768,e.head=null,e.hold=0,e.bits=0,e.lencode=e.lendyn=new Int32Array(852),e.distcode=e.distdyn=new Int32Array(592),e.sane=1,e.back=-1,ke},He=t=>{if(Ce(t))return xe;const e=t.state;return e.wsize=0,e.whave=0,e.wnext=0,Me(t)},je=(t,e)=>{let a;if(Ce(t))return xe;const i=t.state;return e<0?(a=0,e=-e):(a=5+(e>>4),e<48&&(e&=15)),e&&(e<8||e>15)?xe:(null!==i.window&&i.wbits!==e&&(i.window=null),i.wrap=a,i.wbits=e,He(t))},Ke=(t,e)=>{if(!t)return xe;const a=new Be;t.state=a,a.strm=t,a.window=null,a.mode=Ze;const i=je(t,e);return i!==ke&&(t.state=null),i};let Pe,Ye,Ge=!0;const Xe=t=>{if(Ge){Pe=new Int32Array(512),Ye=new Int32Array(32);let e=0;for(;e<144;)t.lens[e++]=8;for(;e<256;)t.lens[e++]=9;for(;e<280;)t.lens[e++]=7;for(;e<288;)t.lens[e++]=8;for(me(1,t.lens,0,288,Pe,0,t.work,{bits:9}),e=0;e<32;)t.lens[e++]=5;me(2,t.lens,0,32,Ye,0,t.work,{bits:5}),Ge=!1}t.lencode=Pe,t.lenbits=9,t.distcode=Ye,t.distbits=5},We=(t,e,a,i)=>{let n;const s=t.state;return null===s.window&&(s.wsize=1<<s.wbits,s.wnext=0,s.whave=0,s.window=new Uint8Array(s.wsize)),i>=s.wsize?(s.window.set(e.subarray(a-s.wsize,a),0),s.wnext=0,s.whave=s.wsize):(n=s.wsize-s.wnext,n>i&&(n=i),s.window.set(e.subarray(a-i,a-i+n),s.wnext),(i-=n)?(s.window.set(e.subarray(a-i,a),0),s.wnext=i,s.whave=s.wsize):(s.wnext+=n,s.wnext===s.wsize&&(s.wnext=0),s.whave<s.wsize&&(s.whave+=n))),0};var qe={inflateReset:He,inflateReset2:je,inflateResetKeep:Me,inflateInit:t=>Ke(t,15),inflateInit2:Ke,inflate:(t,e)=>{let a,i,n,s,r,o,l,h,d,_,f,c,u,w,m,b,g,p,k,v,y,x,z=0;const A=new Uint8Array(4);let E,R;const Z=new Uint8Array([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]);if(Ce(t)||!t.output||!t.input&&0!==t.avail_in)return xe;a=t.state,a.mode===Se&&(a.mode=De),r=t.next_out,n=t.output,l=t.avail_out,s=t.next_in,i=t.input,o=t.avail_in,h=a.hold,d=a.bits,_=o,f=l,x=ke;t:for(;;)switch(a.mode){case Ze:if(0===a.wrap){a.mode=De;break}for(;d<16;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}if(2&a.wrap&&35615===h){0===a.wbits&&(a.wbits=15),a.check=0,A[0]=255&h,A[1]=h>>>8&255,a.check=H(a.check,A,2,0),h=0,d=0,a.mode=16181;break}if(a.head&&(a.head.done=!1),!(1&a.wrap)||(((255&h)<<8)+(h>>8))%31){t.msg="incorrect header check",a.mode=Le;break}if((15&h)!==Re){t.msg="unknown compression method",a.mode=Le;break}if(h>>>=4,d-=4,y=8+(15&h),0===a.wbits&&(a.wbits=y),y>15||y>a.wbits){t.msg="invalid window size",a.mode=Le;break}a.dmax=1<<a.wbits,a.flags=0,t.adler=a.check=1,a.mode=512&h?16189:Se,h=0,d=0;break;case 16181:for(;d<16;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}if(a.flags=h,(255&a.flags)!==Re){t.msg="unknown compression method",a.mode=Le;break}if(57344&a.flags){t.msg="unknown header flags set",a.mode=Le;break}a.head&&(a.head.text=h>>8&1),512&a.flags&&4&a.wrap&&(A[0]=255&h,A[1]=h>>>8&255,a.check=H(a.check,A,2,0)),h=0,d=0,a.mode=16182;case 16182:for(;d<32;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}a.head&&(a.head.time=h),512&a.flags&&4&a.wrap&&(A[0]=255&h,A[1]=h>>>8&255,A[2]=h>>>16&255,A[3]=h>>>24&255,a.check=H(a.check,A,4,0)),h=0,d=0,a.mode=16183;case 16183:for(;d<16;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}a.head&&(a.head.xflags=255&h,a.head.os=h>>8),512&a.flags&&4&a.wrap&&(A[0]=255&h,A[1]=h>>>8&255,a.check=H(a.check,A,2,0)),h=0,d=0,a.mode=16184;case 16184:if(1024&a.flags){for(;d<16;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}a.length=h,a.head&&(a.head.extra_len=h),512&a.flags&&4&a.wrap&&(A[0]=255&h,A[1]=h>>>8&255,a.check=H(a.check,A,2,0)),h=0,d=0}else a.head&&(a.head.extra=null);a.mode=16185;case 16185:if(1024&a.flags&&(c=a.length,c>o&&(c=o),c&&(a.head&&(y=a.head.extra_len-a.length,a.head.extra||(a.head.extra=new Uint8Array(a.head.extra_len)),a.head.extra.set(i.subarray(s,s+c),y)),512&a.flags&&4&a.wrap&&(a.check=H(a.check,i,c,s)),o-=c,s+=c,a.length-=c),a.length))break t;a.length=0,a.mode=16186;case 16186:if(2048&a.flags){if(0===o)break t;c=0;do{y=i[s+c++],a.head&&y&&a.length<65536&&(a.head.name+=String.fromCharCode(y))}while(y&&c<o);if(512&a.flags&&4&a.wrap&&(a.check=H(a.check,i,c,s)),o-=c,s+=c,y)break t}else a.head&&(a.head.name=null);a.length=0,a.mode=16187;case 16187:if(4096&a.flags){if(0===o)break t;c=0;do{y=i[s+c++],a.head&&y&&a.length<65536&&(a.head.comment+=String.fromCharCode(y))}while(y&&c<o);if(512&a.flags&&4&a.wrap&&(a.check=H(a.check,i,c,s)),o-=c,s+=c,y)break t}else a.head&&(a.head.comment=null);a.mode=16188;case 16188:if(512&a.flags){for(;d<16;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}if(4&a.wrap&&h!==(65535&a.check)){t.msg="header crc mismatch",a.mode=Le;break}h=0,d=0}a.head&&(a.head.hcrc=a.flags>>9&1,a.head.done=!0),t.adler=a.check=0,a.mode=Se;break;case 16189:for(;d<32;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}t.adler=a.check=Ne(h),h=0,d=0,a.mode=Ue;case Ue:if(0===a.havedict)return t.next_out=r,t.avail_out=l,t.next_in=s,t.avail_in=o,a.hold=h,a.bits=d,ye;t.adler=a.check=1,a.mode=Se;case Se:if(e===ge||e===pe)break t;case De:if(a.last){h>>>=7&d,d-=7&d,a.mode=Fe;break}for(;d<3;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}switch(a.last=1&h,h>>>=1,d-=1,3&h){case 0:a.mode=16193;break;case 1:if(Xe(a),a.mode=Oe,e===pe){h>>>=2,d-=2;break t}break;case 2:a.mode=16196;break;case 3:t.msg="invalid block type",a.mode=Le}h>>>=2,d-=2;break;case 16193:for(h>>>=7&d,d-=7&d;d<32;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}if((65535&h)!=(h>>>16^65535)){t.msg="invalid stored block lengths",a.mode=Le;break}if(a.length=65535&h,h=0,d=0,a.mode=Te,e===pe)break t;case Te:a.mode=16195;case 16195:if(c=a.length,c){if(c>o&&(c=o),c>l&&(c=l),0===c)break t;n.set(i.subarray(s,s+c),r),o-=c,s+=c,l-=c,r+=c,a.length-=c;break}a.mode=Se;break;case 16196:for(;d<14;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}if(a.nlen=257+(31&h),h>>>=5,d-=5,a.ndist=1+(31&h),h>>>=5,d-=5,a.ncode=4+(15&h),h>>>=4,d-=4,a.nlen>286||a.ndist>30){t.msg="too many length or distance symbols",a.mode=Le;break}a.have=0,a.mode=16197;case 16197:for(;a.have<a.ncode;){for(;d<3;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}a.lens[Z[a.have++]]=7&h,h>>>=3,d-=3}for(;a.have<19;)a.lens[Z[a.have++]]=0;if(a.lencode=a.lendyn,a.lenbits=7,E={bits:a.lenbits},x=me(0,a.lens,0,19,a.lencode,0,a.work,E),a.lenbits=E.bits,x){t.msg="invalid code lengths set",a.mode=Le;break}a.have=0,a.mode=16198;case 16198:for(;a.have<a.nlen+a.ndist;){for(;z=a.lencode[h&(1<<a.lenbits)-1],m=z>>>24,b=z>>>16&255,g=65535&z,!(m<=d);){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}if(g<16)h>>>=m,d-=m,a.lens[a.have++]=g;else{if(16===g){for(R=m+2;d<R;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}if(h>>>=m,d-=m,0===a.have){t.msg="invalid bit length repeat",a.mode=Le;break}y=a.lens[a.have-1],c=3+(3&h),h>>>=2,d-=2}else if(17===g){for(R=m+3;d<R;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}h>>>=m,d-=m,y=0,c=3+(7&h),h>>>=3,d-=3}else{for(R=m+7;d<R;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}h>>>=m,d-=m,y=0,c=11+(127&h),h>>>=7,d-=7}if(a.have+c>a.nlen+a.ndist){t.msg="invalid bit length repeat",a.mode=Le;break}for(;c--;)a.lens[a.have++]=y}}if(a.mode===Le)break;if(0===a.lens[256]){t.msg="invalid code -- missing end-of-block",a.mode=Le;break}if(a.lenbits=9,E={bits:a.lenbits},x=me(1,a.lens,0,a.nlen,a.lencode,0,a.work,E),a.lenbits=E.bits,x){t.msg="invalid literal/lengths set",a.mode=Le;break}if(a.distbits=6,a.distcode=a.distdyn,E={bits:a.distbits},x=me(2,a.lens,a.nlen,a.ndist,a.distcode,0,a.work,E),a.distbits=E.bits,x){t.msg="invalid distances set",a.mode=Le;break}if(a.mode=Oe,e===pe)break t;case Oe:a.mode=Ie;case Ie:if(o>=6&&l>=258){t.next_out=r,t.avail_out=l,t.next_in=s,t.avail_in=o,a.hold=h,a.bits=d,de(t,f),r=t.next_out,n=t.output,l=t.avail_out,s=t.next_in,i=t.input,o=t.avail_in,h=a.hold,d=a.bits,a.mode===Se&&(a.back=-1);break}for(a.back=0;z=a.lencode[h&(1<<a.lenbits)-1],m=z>>>24,b=z>>>16&255,g=65535&z,!(m<=d);){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}if(b&&0==(240&b)){for(p=m,k=b,v=g;z=a.lencode[v+((h&(1<<p+k)-1)>>p)],m=z>>>24,b=z>>>16&255,g=65535&z,!(p+m<=d);){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}h>>>=p,d-=p,a.back+=p}if(h>>>=m,d-=m,a.back+=m,a.length=g,0===b){a.mode=16205;break}if(32&b){a.back=-1,a.mode=Se;break}if(64&b){t.msg="invalid literal/length code",a.mode=Le;break}a.extra=15&b,a.mode=16201;case 16201:if(a.extra){for(R=a.extra;d<R;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}a.length+=h&(1<<a.extra)-1,h>>>=a.extra,d-=a.extra,a.back+=a.extra}a.was=a.length,a.mode=16202;case 16202:for(;z=a.distcode[h&(1<<a.distbits)-1],m=z>>>24,b=z>>>16&255,g=65535&z,!(m<=d);){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}if(0==(240&b)){for(p=m,k=b,v=g;z=a.distcode[v+((h&(1<<p+k)-1)>>p)],m=z>>>24,b=z>>>16&255,g=65535&z,!(p+m<=d);){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}h>>>=p,d-=p,a.back+=p}if(h>>>=m,d-=m,a.back+=m,64&b){t.msg="invalid distance code",a.mode=Le;break}a.offset=g,a.extra=15&b,a.mode=16203;case 16203:if(a.extra){for(R=a.extra;d<R;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}a.offset+=h&(1<<a.extra)-1,h>>>=a.extra,d-=a.extra,a.back+=a.extra}if(a.offset>a.dmax){t.msg="invalid distance too far back",a.mode=Le;break}a.mode=16204;case 16204:if(0===l)break t;if(c=f-l,a.offset>c){if(c=a.offset-c,c>a.whave&&a.sane){t.msg="invalid distance too far back",a.mode=Le;break}c>a.wnext?(c-=a.wnext,u=a.wsize-c):u=a.wnext-c,c>a.length&&(c=a.length),w=a.window}else w=n,u=r-a.offset,c=a.length;c>l&&(c=l),l-=c,a.length-=c;do{n[r++]=w[u++]}while(--c);0===a.length&&(a.mode=Ie);break;case 16205:if(0===l)break t;n[r++]=a.length,l--,a.mode=Ie;break;case Fe:if(a.wrap){for(;d<32;){if(0===o)break t;o--,h|=i[s++]<<d,d+=8}if(f-=l,t.total_out+=f,a.total+=f,4&a.wrap&&f&&(t.adler=a.check=a.flags?H(a.check,n,f,r-f):C(a.check,n,f,r-f)),f=l,4&a.wrap&&(a.flags?h:Ne(h))!==a.check){t.msg="incorrect data check",a.mode=Le;break}h=0,d=0}a.mode=16207;case 16207:if(a.wrap&&a.flags){for(;d<32;){if(0===o)break t;o--,h+=i[s++]<<d,d+=8}if(4&a.wrap&&h!==(4294967295&a.total)){t.msg="incorrect length check",a.mode=Le;break}h=0,d=0}a.mode=16208;case 16208:x=ve;break t;case Le:x=ze;break t;case 16210:return Ae;default:return xe}return t.next_out=r,t.avail_out=l,t.next_in=s,t.avail_in=o,a.hold=h,a.bits=d,(a.wsize||f!==t.avail_out&&a.mode<Le&&(a.mode<Fe||e!==be))&&We(t,t.output,t.next_out,f-t.avail_out),_-=t.avail_in,f-=t.avail_out,t.total_in+=_,t.total_out+=f,a.total+=f,4&a.wrap&&f&&(t.adler=a.check=a.flags?H(a.check,n,f,t.next_out-f):C(a.check,n,f,t.next_out-f)),t.data_type=a.bits+(a.last?64:0)+(a.mode===Se?128:0)+(a.mode===Oe||a.mode===Te?256:0),(0===_&&0===f||e===be)&&x===ke&&(x=Ee),x},inflateEnd:t=>{if(Ce(t))return xe;let e=t.state;return e.window&&(e.window=null),t.state=null,ke},inflateGetHeader:(t,e)=>{if(Ce(t))return xe;const a=t.state;return 0==(2&a.wrap)?xe:(a.head=e,e.done=!1,ke)},inflateSetDictionary:(t,e)=>{const a=e.length;let i,n,s;return Ce(t)?xe:(i=t.state,0!==i.wrap&&i.mode!==Ue?xe:i.mode===Ue&&(n=1,n=C(n,e,a,0),n!==i.check)?ze:(s=We(t,e,a,a),s?(i.mode=16210,Ae):(i.havedict=1,ke)))},inflateInfo:"pako inflate (from Nodeca project)"};var Je=function(){this.text=0,this.time=0,this.xflags=0,this.os=0,this.extra=null,this.extra_len=0,this.name="",this.comment="",this.hcrc=0,this.done=!1};const Qe=Object.prototype.toString,{Z_NO_FLUSH:Ve,Z_FINISH:$e,Z_OK:ta,Z_STREAM_END:ea,Z_NEED_DICT:aa,Z_STREAM_ERROR:ia,Z_DATA_ERROR:na,Z_MEM_ERROR:sa}=K;function ra(t){this.options=jt({chunkSize:65536,windowBits:15,to:""},t||{});const e=this.options;e.raw&&e.windowBits>=0&&e.windowBits<16&&(e.windowBits=-e.windowBits,0===e.windowBits&&(e.windowBits=-15)),!(e.windowBits>=0&&e.windowBits<16)||t&&t.windowBits||(e.windowBits+=32),e.windowBits>15&&e.windowBits<48&&0==(15&e.windowBits)&&(e.windowBits|=15),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new qt,this.strm.avail_out=0;let a=qe.inflateInit2(this.strm,e.windowBits);if(a!==ta)throw new Error(j[a]);if(this.header=new Je,qe.inflateGetHeader(this.strm,this.header),e.dictionary&&("string"==typeof e.dictionary?e.dictionary=Gt(e.dictionary):"[object ArrayBuffer]"===Qe.call(e.dictionary)&&(e.dictionary=new Uint8Array(e.dictionary)),e.raw&&(a=qe.inflateSetDictionary(this.strm,e.dictionary),a!==ta)))throw new Error(j[a])}function oa(t,e){const a=new ra(e);if(a.push(t),a.err)throw a.msg||j[a.err];return a.result}ra.prototype.push=function(t,e){const a=this.strm,i=this.options.chunkSize,n=this.options.dictionary;let s,r,o;if(this.ended)return!1;for(r=e===~~e?e:!0===e?$e:Ve,"[object ArrayBuffer]"===Qe.call(t)?a.input=new Uint8Array(t):a.input=t,a.next_in=0,a.avail_in=a.input.length;;){for(0===a.avail_out&&(a.output=new Uint8Array(i),a.next_out=0,a.avail_out=i),s=qe.inflate(a,r),s===aa&&n&&(s=qe.inflateSetDictionary(a,n),s===ta?s=qe.inflate(a,r):s===na&&(s=aa));a.avail_in>0&&s===ea&&a.state.wrap>0&&0!==t[a.next_in];)qe.inflateReset(a),s=qe.inflate(a,r);switch(s){case ia:case na:case aa:case sa:return this.onEnd(s),this.ended=!0,!1}if(o=a.avail_out,a.next_out&&(0===a.avail_out||s===ea))if("string"===this.options.to){let t=Wt(a.output,a.next_out),e=a.next_out-t,n=Xt(a.output,t);a.next_out=e,a.avail_out=i-e,e&&a.output.set(a.output.subarray(t,t+e),0),this.onData(n)}else this.onData(a.output.length===a.next_out?a.output:a.output.subarray(0,a.next_out));if(s!==ta||0!==o){if(s===ea)return s=qe.inflateEnd(this.strm),this.onEnd(s),this.ended=!0,!0;if(0===a.avail_in)break}}return!0},ra.prototype.onData=function(t){this.chunks.push(t)},ra.prototype.onEnd=function(t){t===ta&&("string"===this.options.to?this.result=this.chunks.join(""):this.result=Kt(this.chunks)),this.chunks=[],this.err=t,this.msg=this.strm.msg};var la={Inflate:ra,inflate:oa,inflateRaw:function(t,e){return(e=e||{}).raw=!0,oa(t,e)},ungzip:oa,constants:K};const{Deflate:ha,deflate:da,deflateRaw:_a,gzip:fa}=le,{Inflate:ca,inflate:ua,inflateRaw:wa,ungzip:ma}=la;var ba=ha,ga=da,pa=_a,ka=fa,va=ca,ya=ua,xa=wa,za=ma,Aa=K,Ea={Deflate:ba,deflate:ga,deflateRaw:pa,gzip:ka,Inflate:va,inflate:ya,inflateRaw:xa,ungzip:za,constants:Aa};t.Deflate=ba,t.Inflate=va,t.constants=Aa,t.default=Ea,t.deflate=ga,t.deflateRaw=pa,t.gzip=ka,t.inflate=ya,t.inflateRaw=xa,t.ungzip=za,Object.defineProperty(t,"__esModule",{value:!0})}));

;
/* ===========================
   app.js — Kroki Diagram Tester
   GitHub: thuphuong1010/kroki-diagram-tester
   =========================== */

'use strict';

// ─── Templates ───────────────────────────────────────────────────────────────
const TEMPLATES = {
  'mermaid-flowchart': {
    type: 'mermaid',
    code: `flowchart TD
    A([Start]) --> B{Login OK?}
    B -- Yes --> C[Load Dashboard]
    B -- No  --> D[Show Error]
    C --> E{Role?}
    E -- Admin --> F[Admin Panel]
    E -- User  --> G[User Panel]
    D --> H([End])
    F --> I([Done])
    G --> I`
  },
  'mermaid-sequence': {
    type: 'mermaid',
    code: `sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Database

    User->>Frontend: Login (email, password)
    Frontend->>Backend: POST /api/auth/login
    Backend->>Database: SELECT user WHERE email=?
    Database-->>Backend: User record
    Backend-->>Frontend: JWT Token
    Frontend-->>User: Redirect to Dashboard

    Note over Backend,Database: Password verified with bcrypt`
  },
  'mermaid-class': {
    type: 'mermaid',
    code: `classDiagram
    class Animal {
        +String name
        +int age
        +makeSound() String
        +move() void
    }
    class Dog {
        +String breed
        +fetch() void
    }
    class Cat {
        +bool isIndoor
        +purr() void
    }
    class Bird {
        +float wingspan
        +fly() void
    }

    Animal <|-- Dog
    Animal <|-- Cat
    Animal <|-- Bird`
  },
  'mermaid-erd': {
    type: 'mermaid',
    code: `erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ ORDER_ITEM : contains
    PRODUCT }|--|{ ORDER_ITEM : "included in"

    CUSTOMER {
        int    id         PK
        string name
        string email      UK
        date   created_at
    }
    ORDER {
        int    id         PK
        date   ordered_at
        string status
        int    customer_id FK
    }
    ORDER_ITEM {
        int   order_id   FK
        int   product_id FK
        int   quantity
        float unit_price
    }
    PRODUCT {
        int    id    PK
        string name
        float  price
        int    stock
    }`
  },
  'mermaid-gantt': {
    type: 'mermaid',
    code: `gantt
    title Sprint Q3 2026
    dateFormat  YYYY-MM-DD
    excludes    weekends

    section Backend
    API Design       :done,    api1, 2026-07-01, 5d
    Core Services    :active,  api2, 2026-07-07, 10d
    Unit Tests       :         api3, after api2, 4d

    section Frontend
    UI Mockup        :done,    ui1, 2026-07-01, 7d
    Component Build  :         ui2, 2026-07-08, 10d
    Integration      :         ui3, after ui2, 3d

    section Deploy
    Staging          :         dep1, after api3, 2d
    Production       :         dep2, after dep1, 1d`
  },
  'mermaid-state': {
    type: 'mermaid',
    code: `stateDiagram
    [*] --> Pending

    Pending --> Processing : Approve
    Pending --> Cancelled : Cancel

    Processing --> Completed : Success
    Processing --> Failed : Error

    Failed --> Processing : Retry
    Failed --> Cancelled : Give up

    Completed --> [*]
    Cancelled --> [*]`
  },
  'plantuml-swimlane': {
    type: 'plantuml',
    code: `@startuml
skinparam swimlaneWidth 220
skinparam backgroundColor #0d0f14
skinparam swimlaneBorderColor #3d4258
skinparam activityBackgroundColor #1a1e2a
skinparam activityBorderColor #6c8ef5
skinparam activityFontColor #e8eaf0
skinparam arrowColor #6c8ef5
skinparam noteBackgroundColor #21263a
skinparam noteBorderColor #a78bfa

title Leave Request Approval

|👤 Employee|
start
:Submit Leave Request;
note right
  Start date, end date,
  leave type, reason
end note

|🖥️ HR System|
:Auto-validate dates;
if (Dates valid &\nno overlap?) then (yes)

  |👔 Line Manager|
  :Review Request;
  if (Approved?) then (yes)

    |🖥️ HR System|
    :Deduct leave balance;
    :Send calendar invite;

    |👤 Employee|
    :Receive approval email;
    stop

  else (no)
    |👔 Line Manager|
    :Enter rejection reason;

    |👤 Employee|
    :Receive rejection email;
    stop
  endif

else (no)
  |🖥️ HR System|
  :Notify invalid dates;

  |👤 Employee|
  :Fix dates & resubmit;
  stop
endif
@enduml`
  },
  'plantuml-sequence': {
    type: 'plantuml',
    code: `@startuml
skinparam backgroundColor #0d0f14
skinparam sequenceArrowColor #6c8ef5
skinparam sequenceLifeLineBorderColor #6c8ef5
skinparam sequenceParticipantBackgroundColor #1a1e2a
skinparam sequenceParticipantBorderColor #6c8ef5
skinparam sequenceParticipantFontColor #e8eaf0
skinparam noteBorderColor #a78bfa
skinparam noteBackgroundColor #21263a

title API Authentication Flow

actor "User" as user
participant "Frontend" as fe
participant "API Gateway" as gw
participant "Auth Service" as auth
database "Redis Cache" as cache
database "PostgreSQL" as db

user -> fe : Login (email, pwd)
fe -> gw : POST /auth/login
gw -> auth : Validate credentials
auth -> cache : Check token blacklist
cache --> auth : Not blacklisted
auth -> db : Query user record
db --> auth : User found
auth --> gw : JWT + Refresh token
gw --> fe : 200 OK + tokens
fe --> user : Redirect Dashboard
@enduml`
  },
  'plantuml-usecase': {
    type: 'plantuml',
    code: `@startuml
left to right direction
skinparam packageStyle rectangle

actor "Customer" as customer
actor "Admin" as admin
actor "System" as system

rectangle "E-Commerce Platform" {
    usecase "Browse Products"  as UC1
    usecase "Add to Cart"      as UC2
    usecase "Checkout"         as UC3
    usecase "Track Order"      as UC4
    usecase "Manage Products"  as UC5
    usecase "View Reports"     as UC6
    usecase "Send Email"       as UC7
}

customer --> UC1
customer --> UC2
customer --> UC3
customer --> UC4

admin --> UC5
admin --> UC6

UC3 ..> UC7 : <<include>>
UC4 ..> UC7 : <<include>>
@enduml`
  },
  'plantuml-component': {
    type: 'plantuml',
    code: `@startuml
skinparam componentStyle rectangle

package "Client Layer" {
    [Web App] as web
    [Mobile App] as mobile
}

package "API Layer" {
    [API Gateway] as gw
    [Auth Service] as auth
    [Order Service] as order
    [Product Service] as product
}

package "Data Layer" {
    database "PostgreSQL" as pg
    database "Redis" as redis
    queue "RabbitMQ" as mq
}

cloud "External" {
    [Payment Gateway] as payment
    [Email Service] as email
}

web    --> gw
mobile --> gw
gw --> auth
gw --> order
gw --> product
auth --> redis
order --> pg
order --> mq
product --> pg
mq --> email
order --> payment
@enduml`
  },
  'plantuml-deployment': {
    type: 'plantuml',
    code: `@startuml
node "AWS Cloud" {
    node "VPC" {
        node "Public Subnet" {
            component [Load Balancer] as lb
        }
        node "Private Subnet" {
            node "EKS Cluster" {
                component [API Pods x3] as api
                component [Worker Pods x2] as worker
            }
            database "RDS PostgreSQL\n(Multi-AZ)" as rds
            database "ElastiCache Redis" as redis
        }
    }
    storage "S3 Bucket" as s3
}

node "CDN" {
    component [CloudFront] as cdn
}

actor "User" as user

user --> cdn
cdn --> lb
lb --> api
api --> rds
api --> redis
worker --> s3
@enduml`
  },
  'graphviz-simple': {
    type: 'graphviz',
    code: `digraph MicroservicesDependencies {
    rankdir=LR
    bgcolor="#0d0f14"
    node [shape=box, style="rounded,filled", fillcolor="#1a1e2a",
          fontcolor="#e8eaf0", fontname="Inter", color="#6c8ef5"]
    edge [color="#6c8ef5", fontcolor="#8b91a8"]

    Gateway   [label="API Gateway", fillcolor="#21263a"]
    Auth      [label="Auth Service"]
    Order     [label="Order Service"]
    Product   [label="Product Service"]
    Notify    [label="Notification"]
    DB_Order  [label="Orders DB", shape=cylinder]
    DB_Prod   [label="Products DB", shape=cylinder]
    Queue     [label="RabbitMQ", shape=parallelogram]

    Gateway  -> Auth
    Gateway  -> Order
    Gateway  -> Product
    Order    -> DB_Order
    Product  -> DB_Prod
    Order    -> Queue
    Queue    -> Notify
}`
  },
  'd2-simple': {
    type: 'd2',
    code: `vars: {
  d2-theme-id: 200
}

title: System Architecture {
  shape: text
  style.font-size: 24
}

user: 👤 User {
  shape: person
}

frontend: Frontend {
  shape: rectangle
  web: Web App
  mobile: Mobile App
}

backend: Backend Services {
  api: API Gateway
  auth: Auth Service
  order: Order Service
}

data: Data Layer {
  pg: PostgreSQL {shape: cylinder}
  redis: Redis {shape: cylinder}
}

user -> frontend.web
user -> frontend.mobile
frontend.web -> backend.api
frontend.mobile -> backend.api
backend.api -> backend.auth
backend.api -> backend.order
backend.auth -> data.redis
backend.order -> data.pg`
  },
  'bpmn-swimlane': {
    type: 'bpmn',
    code: `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"
  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
  xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
  targetNamespace="http://example.com/bpmn">

  <collaboration id="collab">
    <participant id="pool" name="Order Approval Process" processRef="proc"/>
  </collaboration>

  <process id="proc" isExecutable="false">
    <laneSet id="ls">
      <lane id="l_cust" name="Customer">
        <flowNodeRef>start</flowNodeRef>
        <flowNodeRef>t_submit</flowNodeRef>
        <flowNodeRef>t_receive</flowNodeRef>
        <flowNodeRef>end_ok</flowNodeRef>
      </lane>
      <lane id="l_staff" name="Approver">
        <flowNodeRef>t_review</flowNodeRef>
        <flowNodeRef>gw</flowNodeRef>
        <flowNodeRef>t_reject</flowNodeRef>
        <flowNodeRef>end_rej</flowNodeRef>
      </lane>
    </laneSet>

    <startEvent id="start" name="Order Placed"/>
    <sequenceFlow id="f1" sourceRef="start" targetRef="t_submit"/>
    <userTask id="t_submit" name="Fill Order Form"/>
    <sequenceFlow id="f2" sourceRef="t_submit" targetRef="t_review"/>
    <userTask id="t_review" name="Review Order"/>
    <sequenceFlow id="f3" sourceRef="t_review" targetRef="gw"/>
    <exclusiveGateway id="gw" name="Decision"/>
    <sequenceFlow id="f4" name="Approve" sourceRef="gw" targetRef="t_receive"/>
    <sequenceFlow id="f5" name="Reject"  sourceRef="gw" targetRef="t_reject"/>
    <userTask id="t_receive" name="Receive Confirmation"/>
    <sequenceFlow id="f6" sourceRef="t_receive" targetRef="end_ok"/>
    <endEvent id="end_ok" name="Order Confirmed"/>
    <serviceTask id="t_reject" name="Send Rejection Notice"/>
    <sequenceFlow id="f7" sourceRef="t_reject" targetRef="end_rej"/>
    <endEvent id="end_rej" name="Order Rejected"/>
  </process>

  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane bpmnElement="collab">
      <bpmndi:BPMNShape id="d_pool" bpmnElement="pool" isHorizontal="true">
        <dc:Bounds x="10" y="10" width="810" height="330"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="d_l_cust" bpmnElement="l_cust" isHorizontal="true">
        <dc:Bounds x="40" y="10" width="780" height="165"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="d_l_staff" bpmnElement="l_staff" isHorizontal="true">
        <dc:Bounds x="40" y="175" width="780" height="165"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="d_start" bpmnElement="start">
        <dc:Bounds x="80" y="74" width="36" height="36"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="d_t_submit" bpmnElement="t_submit">
        <dc:Bounds x="160" y="54" width="120" height="76"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="d_t_receive" bpmnElement="t_receive">
        <dc:Bounds x="600" y="54" width="120" height="76"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="d_end_ok" bpmnElement="end_ok">
        <dc:Bounds x="760" y="74" width="36" height="36"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="d_end_rej" bpmnElement="end_rej">
        <dc:Bounds x="760" y="239" width="36" height="36"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="d_t_review" bpmnElement="t_review">
        <dc:Bounds x="330" y="219" width="120" height="76"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="d_gw" bpmnElement="gw" isMarkerVisible="true">
        <dc:Bounds x="500" y="232" width="50" height="50"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="d_t_reject" bpmnElement="t_reject">
        <dc:Bounds x="600" y="219" width="120" height="76"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="e_f1" bpmnElement="f1">
        <di:waypoint x="116" y="92"/><di:waypoint x="160" y="92"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="e_f2" bpmnElement="f2">
        <di:waypoint x="220" y="130"/><di:waypoint x="220" y="257"/><di:waypoint x="330" y="257"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="e_f3" bpmnElement="f3">
        <di:waypoint x="450" y="257"/><di:waypoint x="500" y="257"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="e_f4" bpmnElement="f4">
        <di:waypoint x="525" y="232"/><di:waypoint x="525" y="92"/><di:waypoint x="600" y="92"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="e_f5" bpmnElement="f5">
        <di:waypoint x="550" y="257"/><di:waypoint x="600" y="257"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="e_f6" bpmnElement="f6">
        <di:waypoint x="720" y="92"/><di:waypoint x="760" y="92"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="e_f7" bpmnElement="f7">
        <di:waypoint x="720" y="257"/><di:waypoint x="760" y="257"/>
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</definitions>`
  },
  'bpmn-json': {
    type: 'bpmn',
    code: `{
  "pools": [
    {
      "id": "P_Customer",
      "name": "Khách hàng",
      "processId": "Proc_Customer",
      "lanes": [
        { "id": "L_Cust", "name": "Người mua", "nodeRefs": ["N_Start", "N_Submit"] }
      ]
    },
    {
      "id": "P_Company",
      "name": "Công ty",
      "processId": "Proc_Company",
      "lanes": [
        { "id": "L_Sales", "name": "Phòng Sale", "nodeRefs": ["N_CheckStock", "N_GatewayStock", "N_Invoice"] },
        { "id": "L_Account", "name": "Kế toán", "nodeRefs": ["N_Payment", "N_End"] }
      ]
    }
  ],
  "nodes": [
    { "id": "N_Start", "type": "start", "name": "Gửi yêu cầu mua hàng", "x": 250 },
    { "id": "N_Submit", "type": "task", "name": "Nhập thông tin đơn hàng", "x": 420 },
    { "id": "N_CheckStock", "type": "task", "name": "Kiểm tra kho hàng", "x": 420 },
    { "id": "N_GatewayStock", "type": "gateway", "name": "Còn hàng?", "x": 620 },
    { "id": "N_Invoice", "type": "task", "name": "Xuất hóa đơn & Giao hàng", "x": 780 },
    { "id": "N_Payment", "type": "task", "name": "Thu tiền khách hàng", "x": 980 },
    { "id": "N_End", "type": "end", "name": "Hoàn tất quy trình", "x": 1180 }
  ],
  "edges": [
    { "from": "N_Start", "to": "N_Submit", "label": "" },
    { "from": "N_CheckStock", "to": "N_GatewayStock", "label": "" },
    { "from": "N_GatewayStock", "to": "N_Invoice", "label": "Còn hàng" },
    { "from": "N_GatewayStock", "to": "N_Submit", "label": "Hết hàng (Sửa YC)" },
    { "from": "N_Invoice", "to": "N_Payment", "label": "" },
    { "from": "N_Payment", "to": "N_End", "label": "" }
  ],
  "messageFlows": [
    { "from": "N_Submit", "to": "N_CheckStock", "label": "Thông tin đơn" }
  ]
}`
  }
};

// ─── Diagram Library ─────────────────────────────────────────────────────────
function genId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
function escHtml(s) { return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

class DiagramLibrary {
  constructor() {
    this.KEY = 'mvl_diagrams';
    this._d = (() => { try { return JSON.parse(localStorage.getItem(this.KEY)) || {diagrams:[],currentId:null}; } catch { return {diagrams:[],currentId:null}; } })();
  }
  _save() { localStorage.setItem(this.KEY, JSON.stringify(this._d)); }
  get all()       { return this._d.diagrams; }
  get currentId() { return this._d.currentId; }
  set currentId(id){ this._d.currentId = id; this._save(); }
  get current()   { return this._d.diagrams.find(d => d.id === this._d.currentId) || null; }
  find(id)        { return this._d.diagrams.find(d => d.id === id) || null; }

  _upsert(entry) {
    const i = this._d.diagrams.findIndex(d => d.id === entry.id);
    if (i >= 0) this._d.diagrams[i] = entry; else this._d.diagrams.unshift(entry);
    this._save(); return entry;
  }
  create(name, code, type) {
    const e = { id: genId(), name: name||'Untitled', code, type,
      pageId:'', pageName:'', spaceKey:'', filename:'diagram.png',
      confluenceUrl:'', lastSynced:null, syncedCode:null, syncedType:null,
      modifiedSinceSync:false, checkStatus:null, checkAt:null, versions:[], pages:[] };
    this._upsert(e); this.currentId = e.id; return e;
  }
  updateCurrent(patch) {
    const c = this.current; if (!c) return null;
    const u = { ...c, ...patch };
    if (c.lastSynced && (patch.code !== undefined || patch.type !== undefined))
      u.modifiedSinceSync = (u.code !== c.syncedCode) || (u.type !== c.syncedType);
    return this._upsert(u);
  }
  rename(id, name) { const d = this.find(id); if (d) this._upsert({...d, name}); }
  markSynced(id, {pageId, pageName, spaceKey, filename, confluenceUrl}) {
    const d = this.find(id); if (!d) return;
    const now = new Date().toISOString();
    const versions = [...(d.versions||[]),
      {v:(d.versions?.length||0)+1, code:d.code, type:d.type, syncedAt:now, confluenceUrl}
    ].slice(-10);
    // Multi-page tracking: upsert into pages[] by pageId
    const pages = d.pages || [];
    const pi = pages.findIndex(p => p.pageId === pageId);
    const pe = {pageId, pageName, spaceKey, filename, confluenceUrl, lastSynced: now};
    const newPages = pi >= 0 ? pages.map((p,i) => i===pi ? pe : p) : [...pages, pe];
    return this._upsert({...d, pageId, pageName, spaceKey, filename, confluenceUrl,
      lastSynced:now, syncedCode:d.code, syncedType:d.type,
      modifiedSinceSync:false, versions, checkStatus:'live', checkAt:now, pages:newPages});
  }
  delete(id) {
    this._d.diagrams = this._d.diagrams.filter(d => d.id !== id);
    if (this._d.currentId === id) this._d.currentId = null;
    this._save();
  }
}
const library = new DiagramLibrary();

// ─── State ────────────────────────────────────────────────────────────────────
const state = {
  currentUrl: '',
  zoom: 1,
  renderTimer: null,
  isRendering: false,
  pageDiagrams: [],
  pageTitle: '',
  pageVersion: null,
  selectedPageDiagramIdx: null,
  pageDiagramMode: null,
  bpmnViewer: null
};

// API available when NOT on GitHub Pages (works on localhost, Railway, any custom domain)
const HAS_API = !window.location.hostname.endsWith('github.io');

// ─── DOM refs ─────────────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);

const editor        = $('codeEditor');
const diagramType   = $('diagramType');
const outputFormat  = $('outputFormat');
const templateSel   = $('templateSelect');

const previewPlaceholder = $('previewPlaceholder');
const previewLoading     = $('previewLoading');
const previewError       = $('previewError');
const previewContent     = $('previewContent');
const errorMessage       = $('errorMessage');

const confluenceUrl  = $('confluenceUrl');
const btnCopyUrl     = $('btnCopyUrl');
const copyBtnText    = $('copyBtnText');
const btnDownloadConfluence = $('btnDownloadConfluence');
const btnDownloadSvg = null; // removed from UI
const btnDownloadPng = null; // removed from UI

const statusDot  = $('statusDot');
const statusText = $('statusText');
const zoomLabel  = $('zoomLabel');

const diagramName    = $('diagramName');
const credFields     = $('credFields');
const btnOpenLibrary = $('btnOpenLibrary');
const btnLibNew      = $('btnLibNew');
const btnLibClose    = $('btnLibClose');
const libDrawer      = $('libDrawer');
const libBackdrop    = $('libBackdrop');
const libList        = $('libList');
const libSearch      = $('libSearch');
const libCount       = $('libCount');
const btnSaveDiagram    = $('btnSaveDiagram');
const btnOpenPage       = $('btnOpenPage');
const cfPageIdHint      = $('cfPageIdHint');
const syncModifiedBadge = $('syncModifiedBadge');
const editorStats       = $('editorStats');
const btnLoadPageDiagrams = $('btnLoadPageDiagrams');
const btnAddPageDiagram   = $('btnAddPageDiagram');
const pdmPageTitle        = $('pdmPageTitle');
const pdmList             = $('pdmList');
const pdmContext          = $('pdmContext');

// Tracks pageName/spaceKey picked via the page picker (cleared on new browse)
let pickedPageMeta = { pageName: '', spaceKey: '' };

// ─── BPMN 2.0 JSON → XML Converter (Ported from bpmn_generator) ─────────────
function getNodeSize(type) {
  if (type === 'start' || type === 'end') return { w: 36, h: 36 };
  if (type === 'gateway') return { w: 50, h: 50 };
  return { w: 120, h: 80 };
}

function convertJsonToXmlWithDI(jsonString) {
  try {
    const cleanStr = jsonString.replace(/```json|```/g, '').trim();
    if (!cleanStr) return null;
    const data = JSON.parse(cleanStr);
    const nodes = data.nodes || [];
    const edges = data.edges || [];
    const pools = data.pools || [];
    const messageFlows = data.messageFlows || [];

    if (!data.nodes && !data.pools && !data.edges) return null;

    let participantsXml = '';
    let processesXml = '';
    let diPoolsLanes = '';
    let diNodes = '';
    let diEdges = '';

    const POOL_X = 160;
    const NODE_X_OFFSET = 120;
    const maxNodeX = Math.max(...nodes.map(n => n.x || 0), 1000);
    const POOL_WIDTH = maxNodeX + 400;
    const LANE_HEIGHT = 200;
    const POOL_GAP = 120;
    let currentPoolY = 50;
    let finalNodeCoords = {};

    if (pools.length > 0) {
      pools.forEach((p, pIdx) => {
        const laneCount = p.lanes?.length || 1;
        const poolHeight = laneCount * LANE_HEIGHT;
        const procId = p.processId || `Proc_${pIdx}`;
        participantsXml += `<bpmn:participant id="${p.id}" name="${p.name || ''}" processRef="${procId}" />`;
        diPoolsLanes += `<bpmndi:BPMNShape id="${p.id}_di" bpmnElement="${p.id}" isHorizontal="true"><dc:Bounds x="${POOL_X}" y="${currentPoolY}" width="${POOL_WIDTH}" height="${poolHeight}" /></bpmndi:BPMNShape>`;
        let lanesXml = '';
        let nodeIdsInPool = new Set();
        if (p.lanes && p.lanes.length > 0) {
          lanesXml = `<bpmn:laneSet id="Set_${p.id}">`;
          p.lanes.forEach((lane, lIdx) => {
            const laneY = currentPoolY + (lIdx * LANE_HEIGHT);
            lanesXml += `<bpmn:lane id="${lane.id}" name="${lane.name || ''}">`;
            (lane.nodeRefs || []).forEach(ref => {
              lanesXml += `<bpmn:flowNodeRef>${ref}</bpmn:flowNodeRef>`;
              nodeIdsInPool.add(ref);
              const n = nodes.find(node => node.id === ref);
              if (n) {
                const s = getNodeSize(n.type);
                finalNodeCoords[n.id] = { x: Math.max(n.x || 300, POOL_X + NODE_X_OFFSET), y: laneY + (LANE_HEIGHT / 2) - (s.h / 2), w: s.w, h: s.h, laneBottom: laneY + LANE_HEIGHT };
              }
            });
            lanesXml += `</bpmn:lane>`;
            diPoolsLanes += `<bpmndi:BPMNShape id="${lane.id}_di" bpmnElement="${lane.id}" isHorizontal="true"><dc:Bounds x="${POOL_X + 30}" y="${laneY}" width="${POOL_WIDTH - 30}" height="${LANE_HEIGHT}" /></bpmndi:BPMNShape>`;
          });
          lanesXml += `</bpmn:laneSet>`;
        } else {
          nodes.filter(n => n.processId === p.processId).forEach(n => {
            nodeIdsInPool.add(n.id);
            const s = getNodeSize(n.type);
            finalNodeCoords[n.id] = { x: Math.max(n.x || 300, POOL_X + NODE_X_OFFSET), y: currentPoolY + (poolHeight / 2) - (s.h / 2), w: s.w, h: s.h, laneBottom: currentPoolY + poolHeight };
          });
        }
        const typeMap = { start: 'bpmn:startEvent', end: 'bpmn:endEvent', gateway: 'bpmn:exclusiveGateway', task: 'bpmn:userTask', subProcess: 'bpmn:subProcess' };
        let xmlN = nodes.filter(n => nodeIdsInPool.has(n.id)).map(n => `<${typeMap[n.type] || 'bpmn:task'} id="${n.id}" name="${n.name || ''}" />`).join('');
        let xmlF = edges.filter(e => nodeIdsInPool.has(e.from)).map(e => `<bpmn:sequenceFlow id="F_${e.from}_${e.to}" sourceRef="${e.from}" targetRef="${e.to}" name="${e.label || ''}" />`).join('');
        processesXml += `<bpmn:process id="${procId}" isExecutable="true">${lanesXml}${xmlN}${xmlF}</bpmn:process>`;
        currentPoolY += poolHeight + POOL_GAP;
      });
    } else {
      // Fallback if no pools specified
      const procId = 'Proc_1';
      const typeMap = { start: 'bpmn:startEvent', end: 'bpmn:endEvent', gateway: 'bpmn:exclusiveGateway', task: 'bpmn:userTask', subProcess: 'bpmn:subProcess' };
      nodes.forEach((n, idx) => {
        const s = getNodeSize(n.type);
        finalNodeCoords[n.id] = { x: n.x || (160 + idx * 180), y: n.y || 150, w: s.w, h: s.h, laneBottom: 300 };
      });
      let xmlN = nodes.map(n => `<${typeMap[n.type] || 'bpmn:task'} id="${n.id}" name="${n.name || ''}" />`).join('');
      let xmlF = edges.map(e => `<bpmn:sequenceFlow id="F_${e.from}_${e.to}" sourceRef="${e.from}" targetRef="${e.to}" name="${e.label || ''}" />`).join('');
      processesXml += `<bpmn:process id="${procId}" isExecutable="true">${xmlN}${xmlF}</bpmn:process>`;
    }

    Object.keys(finalNodeCoords).forEach(id => {
      const c = finalNodeCoords[id];
      diNodes += `<bpmndi:BPMNShape id="${id}_di" bpmnElement="${id}" isExpanded="false"><dc:Bounds x="${c.x}" y="${c.y}" width="${c.w}" height="${c.h}" /></bpmndi:BPMNShape>`;
    });

    edges.forEach((e) => {
      const f = finalNodeCoords[e.from];
      const t = finalNodeCoords[e.to];
      if (!f || !t) return;
      if (t.x < f.x) {
        const byY = f.laneBottom - 20;
        diEdges += `<bpmndi:BPMNEdge id="F_${e.from}_${e.to}_di" bpmnElement="F_${e.from}_${e.to}"><di:waypoint x="${f.x + f.w / 2}" y="${f.y + f.h}" /><di:waypoint x="${f.x + f.w / 2}" y="${byY}" /><di:waypoint x="${t.x + t.w / 2}" y="${byY}" /><di:waypoint x="${t.x + t.w / 2}" y="${t.y + t.h}" /></bpmndi:BPMNEdge>`;
      } else if (f.x === t.x) {
        diEdges += `<bpmndi:BPMNEdge id="F_${e.from}_${e.to}_di" bpmnElement="F_${e.from}_${e.to}"><di:waypoint x="${f.x + f.w / 2}" y="${f.y + f.h}" /><di:waypoint x="${f.x + f.w / 2}" y="${t.y}" /></bpmndi:BPMNEdge>`;
      } else {
        const sX = f.x + f.w; const sY = f.y + f.h / 2; const eX = t.x; const eY = t.y + t.h / 2; const mX = sX + (eX - sX) / 2;
        diEdges += `<bpmndi:BPMNEdge id="F_${e.from}_${e.to}_di" bpmnElement="F_${e.from}_${e.to}"><di:waypoint x="${sX}" y="${sY}" /><di:waypoint x="${mX}" y="${sY}" /><di:waypoint x="${mX}" y="${eY}" /><di:waypoint x="${eX}" y="${eY}" /></bpmndi:BPMNEdge>`;
      }
    });

    messageFlows.forEach((m, idx) => {
      const f = finalNodeCoords[m.from]; const t = finalNodeCoords[m.to];
      if (f && t) {
        participantsXml += `<bpmn:messageFlow id="Msg_${idx}" sourceRef="${m.from}" targetRef="${m.to}" name="${m.label || ''}" />`;
        diEdges += `<bpmndi:BPMNEdge id="Msg_${idx}_di" bpmnElement="Msg_${idx}"><di:waypoint x="${f.x + f.w / 2}" y="${f.y + f.h}" /><di:waypoint x="${t.x + t.w / 2}" y="${t.y + t.h}" /></bpmndi:BPMNEdge>`;
      }
    });

    const collabXml = participantsXml ? `<bpmn:collaboration id="C_M">${participantsXml}</bpmn:collaboration>` : '';
    const mainRef = participantsXml ? 'C_M' : 'Proc_1';

    return `<?xml version="1.0" encoding="UTF-8"?><bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" targetNamespace="http://bpmn.io/schema/bpmn">${collabXml}${processesXml}<bpmndi:BPMNDiagram id="D_1"><bpmndi:BPMNPlane id="P_1" bpmnElement="${mainRef}">${diPoolsLanes}${diNodes}${diEdges}</bpmndi:BPMNPlane></bpmndi:BPMNDiagram></bpmn:definitions>`;
  } catch (e) {
    return null;
  }
}

function getEffectiveBpmnXml(code) {
  const trimmed = (code || '').trim();
  if (!trimmed) return trimmed;
  if (trimmed.startsWith('{') || trimmed.startsWith('[') || (trimmed.includes('"nodes"') && trimmed.includes('"edges"'))) {
    const xml = convertJsonToXmlWithDI(trimmed);
    if (xml) return xml;
  }
  return trimmed;
}

// ─── Encoding & URL Building ─────────────────────────────────────────────────
/**
 * HYBRID ROUTING:
 *   Mermaid  → mermaid.ink  (uses headless browser on dedicated infra, always stable)
 *   Others   → kroki.io     (PlantUML, GraphViz, D2, BPMN, C4, DBML, etc.)
 *
 * Why: kroki.io public instance uses Puppeteer/Chromium for Mermaid rendering
 * and frequently hits resource limits ("Resource temporarily unavailable").
 * mermaid.ink is purpose-built for Mermaid and is much more reliable.
 */

// Mermaid encoding: base64url (UTF-8 safe) — mermaid.ink format.
// Standard btoa() produces + and / which are NOT URL-safe; mermaid.ink requires base64url.
function encodeMermaid(text) {
  return btoa(unescape(encodeURIComponent(text)))
    .replace(/\+/g, '-').replace(/\//g, '_');
}

// Kroki encoding: pako zlib deflate → base64url — used by PlantUML, GraphViz, D2, etc.
function encodeKroki(text) {
  const compressed = pako.deflate(text, { level: 9 });
  let binary = '';
  const len = compressed.length;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(compressed[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_');
}

// Diagram types routed to mermaid.ink
const MERMAID_TYPES = new Set(['mermaid']);

function buildDiagramUrl(code, type, format) {
  if (type === 'bpmn') {
    code = getEffectiveBpmnXml(code);
  }
  if (MERMAID_TYPES.has(type)) {
    // mermaid.ink supports svg and img (png)
    const endpoint = format === 'png' ? 'img' : 'svg';
    return `https://mermaid.ink/${endpoint}/${encodeMermaid(code)}`;
  }
  // All other types → kroki.io
  return `https://kroki.io/${type}/${format}/${encodeKroki(code)}`;
}

// Keep backward compat alias
function buildKrokiUrl(code, type, format) {
  return buildDiagramUrl(code, type, format);
}

// ─── Render ───────────────────────────────────────────────────────────────────
function showState(s) {
  previewPlaceholder.style.display = s === 'placeholder' ? 'flex' : 'none';
  previewLoading.classList.toggle('visible', s === 'loading');
  previewError.classList.toggle('visible', s === 'error');
  previewContent.classList.toggle('visible', s === 'content');
}

function setStatus(type, text) {
  statusDot.className = 'status-dot' + (type ? ' ' + type : '');
  statusText.textContent = text;
}

async function renderDiagram() {
  const code = editor.value.trim();
  if (!code) {
    if (state.bpmnViewer) {
      try { state.bpmnViewer.destroy(); } catch (e) {}
      state.bpmnViewer = null;
    }
    showState('placeholder');
    setStatus('', 'Ready');
    confluenceUrl.value = '';
    btnCopyUrl.disabled = true;
    btnDownloadConfluence.disabled = true;
    state.currentUrl = '';
    return;
  }

  const type   = diagramType.value;
  const format = outputFormat.value;

  // BPMN 2.0 Canvas Rendering via bpmn-js (bpmn_generator)
  if (type === 'bpmn' && (window.BpmnJS || window.BpmnJSViewer)) {
    const effectiveXml = getEffectiveBpmnXml(code);
    if (effectiveXml) {
      const url = buildDiagramUrl(effectiveXml, type, format);

      setStatus('loading', 'Rendering BPMN Canvas...');
      state.isRendering = true;

      try {
        if (state.bpmnViewer) {
          try { state.bpmnViewer.destroy(); } catch (e) {}
          state.bpmnViewer = null;
        }

        previewContent.innerHTML = '';
        previewContent.classList.add('bpmn-mode');
        previewContent.style.transform = 'none';

        const container = document.createElement('div');
        container.className = 'bpmn-container';
        container.id = 'bpmnCanvas';
        previewContent.appendChild(container);

        // Show content FIRST so element is visible & has layout dimensions in DOM
        showState('content');

        const BpmnClass = window.BpmnJS || window.BpmnJSViewer;
        state.bpmnViewer = new BpmnClass({
          container: container,
          keyboard: { bindTo: window }
        });

        // Sync visual canvas edits back to code editor and Kroki URLs
        try {
          state.bpmnViewer.on('commandStack.changed', async () => {
            try {
              const { xml } = await state.bpmnViewer.saveXML({ format: true });
              if (xml && editor.value !== xml) {
                editor.isCanvasUpdating = true;
                editor.value = xml;
                updateEditorStats();
                updateSyncBtn();
                updateModifiedBadge();
                const url = buildDiagramUrl(xml, 'bpmn', outputFormat.value);
                state.currentUrl = url;
                confluenceUrl.value = url;
                btnCopyUrl.disabled = false;
                btnDownloadConfluence.disabled = false;
                setTimeout(() => { editor.isCanvasUpdating = false; }, 150);
              }
            } catch (err) {}
          });
        } catch (e) {}

        await state.bpmnViewer.importXML(effectiveXml);

        // Fit viewport after DOM layout is ready
        requestAnimationFrame(() => {
          setTimeout(() => {
            if (state.bpmnViewer) {
              try {
                const canvas = state.bpmnViewer.get('canvas');
                canvas.resized();
                canvas.zoom('fit-viewport');
                const z = canvas.zoom();
                if (typeof z === 'number' && !isNaN(z)) {
                  state.zoom = z;
                  zoomLabel.textContent = Math.round(state.zoom * 100) + '%';
                }
              } catch (e) {}
            }
          }, 50);
        });

        previewContent.classList.add('animate');
        setTimeout(() => previewContent.classList.remove('animate'), 400);

        setStatus('success', 'Rendered (BPMN Canvas) ✓');

        state.currentUrl = url;
        confluenceUrl.value = url;
        btnCopyUrl.disabled = false;
        btnDownloadConfluence.disabled = false;
        state.isRendering = false;
        updateSyncBtn();
        return;
      } catch (err) {
        console.warn('BPMN Canvas render failed, falling back to Kroki image:', err);
      }
    }
  }

  // Fallback for non-BPMN or if BPMN canvas fails
  previewContent.classList.remove('bpmn-mode');
  if (state.bpmnViewer) {
    try { state.bpmnViewer.destroy(); } catch (e) {}
    state.bpmnViewer = null;
  }

  const url = buildDiagramUrl(code, type, format);

  showState('loading');
  setStatus('loading', 'Rendering...');
  state.isRendering = true;

  // Use an Image object to test if the URL loads successfully
  // then display it — works for both SVG and PNG without fetch/CORS issues
  const img = new Image();

  img.onload = () => {
    previewContent.innerHTML = '';
    img.style.maxWidth = '100%';
    img.style.height = 'auto';
    img.style.display = 'block';
    img.alt = 'Diagram';
    previewContent.appendChild(img);

    previewContent.classList.add('animate');
    setTimeout(() => previewContent.classList.remove('animate'), 400);

    showState('content');
    setStatus('success', 'Rendered ✓');

    state.currentUrl = url;
    confluenceUrl.value = url;
    btnCopyUrl.disabled = false;
    btnDownloadConfluence.disabled = false;
    state.isRendering = false;
    updateSyncBtn();
  };

  img.onerror = () => {
    showState('error');
    errorMessage.textContent = 'Render failed: invalid diagram syntax or unsupported diagram type.';
    setStatus('error', 'Error');
    state.currentUrl = '';
    confluenceUrl.value = '';
    btnCopyUrl.disabled = true;
    btnDownloadConfluence.disabled = true;
    state.isRendering = false;
    updateSyncBtn();
  };

  // Set src — browser loads directly from mermaid.ink or kroki.io
  img.src = url;
}

// Debounced auto-render
function scheduleRender() {
  clearTimeout(state.renderTimer);
  setStatus('loading', 'Waiting...');
  state.renderTimer = setTimeout(renderDiagram, 600);
}

// ─── Copy URL ─────────────────────────────────────────────────────────────────
btnCopyUrl.addEventListener('click', async () => {
  const urlToCopy = confluenceUrl.value;
  if (!urlToCopy) return;
  try {
    await navigator.clipboard.writeText(urlToCopy);
    btnCopyUrl.classList.add('copied');
    copyBtnText.textContent = 'Copied!';
    setTimeout(() => {
      btnCopyUrl.classList.remove('copied');
      copyBtnText.textContent = 'Copy';
    }, 2000);
  } catch {
    // Fallback
    confluenceUrl.select();
    document.execCommand('copy');
  }
});

// ─── Download for Confluence (PNG) ───────────────────────────────────────────
btnDownloadConfluence.addEventListener('click', async () => {
  const code = editor.value.trim();
  if (!code) return;
  // Always download as PNG for Confluence compatibility
  const pngUrl = buildDiagramUrl(code, diagramType.value, 'png');
  try {
    const res  = await fetch(pngUrl);
    const blob = await res.blob();
    const a    = document.createElement('a');
    a.href     = URL.createObjectURL(blob);
    a.download = `diagram-${diagramType.value}.png`;
    a.click();
  } catch {
    alert('Download failed. Please try again.');
  }
});

// ─── Templates ───────────────────────────────────────────────────────────────
templateSel.addEventListener('change', () => {
  const key = templateSel.value;
  if (!key || !TEMPLATES[key]) return;
  const tpl = TEMPLATES[key];
  editor.value = tpl.code.trimStart();
  diagramType.value = tpl.type;
  templateSel.value = '';
  scheduleRender();
});

// ─── Render Button ────────────────────────────────────────────────────────────
$('btnRender').addEventListener('click', () => {
  clearTimeout(state.renderTimer);
  renderDiagram();
});

// ─── Clear ────────────────────────────────────────────────────────────────────
$('btnClear').addEventListener('click', () => {
  editor.value = '';
  previewContent.innerHTML = '';
  showState('placeholder');
  setStatus('', 'Ready');
  confluenceUrl.value = '';
  btnCopyUrl.disabled = true;
  btnDownloadConfluence.disabled = true;
  state.currentUrl = '';
});

// ─── Zoom ─────────────────────────────────────────────────────────────────────
function applyZoom() {
  if (state.bpmnViewer) {
    try {
      state.bpmnViewer.get('canvas').zoom(state.zoom);
      zoomLabel.textContent = Math.round(state.zoom * 100) + '%';
      return;
    } catch (e) {}
  }
  previewContent.style.transform = `scale(${state.zoom})`;
  zoomLabel.textContent = Math.round(state.zoom * 100) + '%';
}

$('btnZoomIn').addEventListener('click', () => {
  state.zoom = Math.min(state.zoom + 0.15, 3);
  applyZoom();
});

$('btnZoomOut').addEventListener('click', () => {
  state.zoom = Math.max(state.zoom - 0.15, 0.25);
  applyZoom();
});

$('btnZoomReset').addEventListener('click', () => {
  if (state.bpmnViewer) {
    try {
      const canvas = state.bpmnViewer.get('canvas');
      canvas.resized();
      canvas.zoom('fit-viewport');
      const z = canvas.zoom();
      if (typeof z === 'number' && !isNaN(z)) {
        state.zoom = z;
        zoomLabel.textContent = Math.round(z * 100) + '%';
      }
      return;
    } catch (e) {}
  }
  state.zoom = 1;
  applyZoom();
});

// ─── Split Pane Drag ─────────────────────────────────────────────────────────
const divider     = $('divider');
const mainContent = document.querySelector('.main-content');
const editorPanel = document.querySelector('.editor-panel');

let isDragging = false;

divider.addEventListener('mousedown', e => {
  isDragging = true;
  divider.classList.add('dragging');
  document.body.style.cursor = 'col-resize';
  document.body.style.userSelect = 'none';
  e.preventDefault();
});

document.addEventListener('mousemove', e => {
  if (!isDragging) return;
  const rect = mainContent.getBoundingClientRect();
  const pct  = ((e.clientX - rect.left) / rect.width) * 100;
  const clamped = Math.min(Math.max(pct, 20), 80);
  editorPanel.style.flex = `0 0 ${clamped}%`;
});

document.addEventListener('mouseup', () => {
  if (!isDragging) return;
  isDragging = false;
  divider.classList.remove('dragging');
  document.body.style.cursor = '';
  document.body.style.userSelect = '';
});

// ─── Editor Events ────────────────────────────────────────────────────────────
editor.addEventListener('input', () => {
  if (editor.isCanvasUpdating) return;
  scheduleRender();
  autoSaveToLibrary();
  updateEditorStats();
});

// ─── Editor Stats (line / char count) ─────────────────────────────────────────
function updateEditorStats() {
  if (!editorStats) return;
  const code  = editor.value;
  const lines = code ? code.split('\n').length : 0;
  const chars = code.length;
  editorStats.textContent = lines > 0 ? `${lines}L · ${chars}C` : '';
}

// ─── Ctrl+Scroll Zoom (on preview panel) ──────────────────────────────────────
document.getElementById('previewWrapper')?.addEventListener('wheel', e => {
  if (!e.ctrlKey && !e.metaKey) return;
  e.preventDefault();
  const delta = e.deltaY > 0 ? -0.1 : 0.1;
  state.zoom = Math.min(Math.max(state.zoom + delta, 0.25), 3);
  applyZoom();
}, { passive: false });

// Tab key → insert spaces
// Ctrl+Enter → immediate render
editor.addEventListener('keydown', e => {
  if (e.key === 'Tab') {
    e.preventDefault();
    const start = editor.selectionStart;
    const end   = editor.selectionEnd;
    editor.value = editor.value.substring(0, start) + '  ' + editor.value.substring(end);
    editor.selectionStart = editor.selectionEnd = start + 2;
  }
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault();
    clearTimeout(state.renderTimer);
    renderDiagram();
  }
});

// Re-render on type change
diagramType.addEventListener('change', () => {
  if (editor.value.trim()) scheduleRender();
});

outputFormat.addEventListener('change', () => {
  if (editor.value.trim()) scheduleRender();
});

// ─── Confluence Sync ──────────────────────────────────────────────────────────
// Page Diagram Manager
function currentPageId() {
  return extractPageId(cfPageId.value.trim()) || cfPageId.value.trim();
}

function diagramKindFromCode(d) {
  const code = (d.code || '').trim();
  const first = code.split(/\r?\n/).map(line => line.trim()).find(Boolean) || '';
  const title = code.match(/^(?:title|caption)\s+(.+)$/im)?.[1]?.trim();
  if (title) return title.replace(/["']/g, '').slice(0, 54);
  if (d.type === 'mermaid') {
    const kinds = {
      sequencediagram: 'Sequence diagram', flowchart: 'Flowchart', graph: 'Flowchart',
      classdiagram: 'Class diagram', erdiagram: 'Entity relationship diagram',
      statediagram: 'State diagram', gantt: 'Gantt chart', mindmap: 'Mind map',
      gitgraph: 'Git graph', journey: 'User journey', pie: 'Pie chart'
    };
    const key = (first.match(/^([\w-]+)/)?.[1] || '').toLowerCase();
    return kinds[key] || 'Mermaid diagram';
  }
  if (d.type === 'plantuml') {
    if (/usecase/i.test(code)) return 'Use case diagram';
    if (/component/i.test(code)) return 'Component diagram';
    if (/class\s+/i.test(code)) return 'Class diagram';
    if (/actor\s+|participant\s+|->/i.test(code)) return 'Sequence diagram';
    return 'PlantUML diagram';
  }
  const labels = { graphviz: 'Graph diagram', d2: 'Architecture diagram', bpmn: 'Process diagram', dbml: 'Database diagram', erd: 'Entity relationship diagram' };
  return labels[d.type] || `${d.type || 'Diagram'} diagram`;
}

function shortNameFromDiagram(d, i) {
  return diagramKindFromCode(d) || `${d.type || 'Diagram'} ${i + 1}`;
}

function diagramContextText(d) {
  const parts = [d.contextBefore, d.contextAfter].filter(Boolean);
  if (!parts.length) return 'No nearby page text was found.';
  return parts.join(' · ').replace(/\s+/g, ' ').slice(0, 360);
}

function renderPageDiagramManager() {
  if (!pdmList) return;
  const pid = extractPageId(cfPageId.value.trim()) || cfPageId.value.trim();
  pdmPageTitle.textContent = state.pageTitle || (pid ? `Page ${pid}` : 'No page loaded');

  if (!state.pageDiagrams.length) {
    pdmList.innerHTML = '<span class="pdm-empty">No diagrams loaded for this page.</span>';
    if (state.pageDiagramMode !== 'add') pdmContext.innerHTML = '';
    return;
  }

  pdmList.innerHTML = state.pageDiagrams.map((d, i) => {
    const active = Number(state.selectedPageDiagramIdx) === Number(d.idx) && state.pageDiagramMode === 'update';
    const rendered = d.hasKrokiBlock ? 'Rendered' : 'Source only';
    return `<button class="pdm-item${active ? ' active' : ''}" type="button" data-idx="${d.idx}">
      <span class="pdm-item-index">${String(i + 1).padStart(2, '0')}</span>
      <span class="pdm-item-main">
        <span class="pdm-item-name">${escHtml(shortNameFromDiagram(d, i))}</span>
        <span class="pdm-item-meta"><b>${escHtml(d.type)}</b><em>${rendered}</em></span>
      </span>
    </button>`;
  }).join('');

  pdmList.querySelectorAll('.pdm-item').forEach(btn => {
    btn.addEventListener('click', () => selectPageDiagram(Number(btn.dataset.idx)));
  });
}

function selectPageDiagram(idx) {
  const d = state.pageDiagrams.find(x => Number(x.idx) === Number(idx));
  if (!d) return;
  state.selectedPageDiagramIdx = d.idx;
  state.pageDiagramMode = 'update';
  editor.value = d.code;
  diagramType.value = d.type;
  cfFileName.value = d.filename || d.generatedFilename || 'diagram.png';
  diagramName.value = shortNameFromDiagram(d, d.idx);
  const position = state.pageDiagrams.findIndex(x => Number(x.idx) === Number(idx)) + 1;
  pdmContext.innerHTML = `
    <div class="pdm-context-head">
      <strong>${escHtml(shortNameFromDiagram(d, position - 1))}</strong>
      <span>Diagram ${position} of ${state.pageDiagrams.length} · ${escHtml(d.type)}</span>
    </div>
    <div class="pdm-context-page"><span>Page</span><strong>${escHtml(state.pageTitle || currentPageId() || 'Selected page')}</strong></div>
    <div class="pdm-context-copy"><span>Nearby page text</span>${escHtml(diagramContextText(d))}</div>`;
  library.currentId = null;
  saveCreds();
  updateSyncBtn();
  updateEditorStats();
  renderPageDiagramManager();
  scheduleRender();
}

async function loadPageDiagrams() {
  const pageId = extractPageId(cfPageId.value.trim()) || cfPageId.value.trim();
  if (!pageId || !HAS_API) return;
  cfPageId.value = pageId;
  setSyncStatus('loading', 'Loading page diagrams...');
  btnLoadPageDiagrams.disabled = true;
  try {
    const res = await fetch(`/api/confluence/process/${pageId}`);
    const data = await res.json();
    if (!res.ok || data.error) throw new Error(data.error || `Server ${res.status}`);
    state.pageDiagrams = data.diagrams || [];
    state.pageTitle = data.pageTitle || pickedPageMeta.pageName || `Page ${pageId}`;
    state.pageVersion = data.pageVersion || null;
    state.selectedPageDiagramIdx = null;
    state.pageDiagramMode = null;
    renderPageDiagramManager();
    if (state.pageDiagrams.length) {
      selectPageDiagram(state.pageDiagrams[0].idx);
      setSyncStatus('success', `Loaded ${state.pageDiagrams.length} diagram${state.pageDiagrams.length > 1 ? 's' : ''}`);
    } else {
      setSyncStatus('', 'No diagrams found on page');
      showToast('No diagrams found. Use + Add Diagram to create one.', 'warn');
    }
  } catch (err) {
    setSyncStatus('error', 'Error: ' + err.message.substring(0, 100));
  } finally {
    btnLoadPageDiagrams.disabled = false;
    setTimeout(() => setSyncStatus('', ''), 3500);
  }
}

function addPageDiagramDraft() {
  const pageId = extractPageId(cfPageId.value.trim()) || cfPageId.value.trim();
  if (!pageId) {
    cfPageId.focus();
    showToast('Choose a page before adding a diagram', 'warn');
    return;
  }
  const tpl = TEMPLATES['mermaid-flowchart'];
  state.selectedPageDiagramIdx = null;
  state.pageDiagramMode = 'add';
  editor.value = tpl.code.trimStart();
  diagramType.value = tpl.type;
  diagramName.value = 'New page diagram';
  cfFileName.value = `diagram-${Date.now().toString(36)}.png`;
  pdmContext.innerHTML = '<strong>New diagram:</strong> this will be appended to the selected Confluence page.';
  library.currentId = null;
  saveCreds();
  updateSyncBtn();
  updateEditorStats();
  renderPageDiagramManager();
  scheduleRender();
}

btnLoadPageDiagrams?.addEventListener('click', loadPageDiagrams);
btnAddPageDiagram?.addEventListener('click', addPageDiagramDraft);

const cfUrl      = $('cfUrl');
const cfEmail    = $('cfEmail');
const cfToken    = $('cfToken');
const cfPageId   = $('cfPageId');
const cfFileName = $('cfFileName');
const btnSync    = $('btnSync');
const syncStatus = $('syncStatus');

// Persist credentials in localStorage (token stored locally only)
function saveCreds() {
  localStorage.setItem('cf_url',    cfUrl.value);
  localStorage.setItem('cf_email',  cfEmail.value);
  localStorage.setItem('cf_pageid', cfPageId.value);
  localStorage.setItem('cf_fname',  cfFileName.value);
  // Note: token NOT saved to localStorage for security
}
function loadCreds() {
  cfUrl.value      = localStorage.getItem('cf_url')    || '';
  cfEmail.value    = localStorage.getItem('cf_email')  || '';
  cfPageId.value   = localStorage.getItem('cf_pageid') || '';
  cfFileName.value = localStorage.getItem('cf_fname')  || 'diagram.png';
}
[cfUrl, cfEmail, cfPageId, cfFileName].forEach(el => el.addEventListener('input', saveCreds));

function syncReady() {
  if (HAS_API) return !!cfPageId.value && !!state.currentUrl;
  return !!(cfUrl.value && cfEmail.value && cfToken.value && cfPageId.value && state.currentUrl);
}
function updateSyncBtn() {
  if (!HAS_API) {
    btnSync.disabled = true;
    btnSync.title    = 'Run "npm run kroki" then open http://localhost:3333 to enable sync';
    return;
  }
  btnSync.disabled = !syncReady();
  btnSync.title    = '';
}
[cfUrl, cfEmail, cfToken, cfPageId].forEach(el => el.addEventListener('input', updateSyncBtn));

// Upload PNG diagram to Confluence via local proxy (server.js handles auth).
// Stable URL: /wiki/download/attachments/{pageId}/{filename} — never changes on re-upload.
btnSync.addEventListener('click', async () => {
  if (!syncReady()) return;

  // Check if we're in "Edit from Confluence" mode (came from an Edit-in-Kroki link)
  const isEditMode = !!new URLSearchParams(window.location.search).get('page') && HAS_API;

  // Defensive: extract page ID from URL if user didn't wait for debounce
  const pageId = extractPageId(cfPageId.value.trim()) || cfPageId.value.trim();
  if (pageId !== cfPageId.value.trim()) { cfPageId.value = pageId; cfPageIdHint.textContent = ''; }
  const fname  = cfFileName.value.trim() || 'diagram.png';

  btnSync.disabled = true;
  btnSync.classList.add('btn--loading');
  btnSync.textContent = 'Syncing…';

  try {
    if (HAS_API && state.pageDiagramMode) {
      const res = await fetch(`/api/confluence/process/${pageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: state.pageDiagramMode,
          idx: state.pageDiagramMode === 'update' ? state.selectedPageDiagramIdx : null,
          type: diagramType.value,
          code: editor.value.trim(),
          filename: fname
        })
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || `Server ${res.status}`);

      const savedAt  = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const diagNums = state.pageDiagrams.length;
      const diagLabel = state.pageDiagramMode === 'add'
        ? 'New diagram added'
        : `Diagram #${(Number(state.selectedPageDiagramIdx) + 1)} of ${diagNums || '?'} updated`;
      setSyncStatus('success', `✅ ${diagLabel} at ${savedAt} — refresh Confluence to see changes`);
      confluenceUrl.value = data.url;
      btnCopyUrl.disabled = false;
      cfFileName.value = data.filename || fname;

      const targetUrl = data.url || buildCleanConfluencePageUrl(cfUrl.value, pageId, data.url);
      if (targetUrl) {
        btnOpenPage.href = targetUrl;
        btnOpenPage.style.display = '';
      }

      navigator.clipboard.writeText(data.url).catch(() => {});
      showToast(state.pageDiagramMode === 'add'
        ? 'Diagram added — refresh Confluence page to see it'
        : `Diagram #${(Number(state.selectedPageDiagramIdx) + 1)} saved — refresh Confluence (Ctrl+Shift+R)`);
      await loadPageDiagrams();
      return;
    }

    // 1. Render diagram as PNG blob via kroki.io
    const pngUrl = buildDiagramUrl(editor.value.trim(), diagramType.value, 'png');
    const pngRes = await fetch(pngUrl);
    if (!pngRes.ok) throw new Error('Diagram render failed');
    const pngBlob = await pngRes.blob();

    if (!HAS_API) {
      throw new Error('Open the team server URL or run: npm run kroki → http://localhost:3333');
    }

    // 2. Send PNG as base64 JSON — embed endpoint uploads attachment + patches page body
    const base64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload  = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(pngBlob);
    });
    const res  = await fetch(`/api/confluence/embed/${pageId}`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ filename: fname, data: base64, type: diagramType.value, code: editor.value.trim() }),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) throw new Error(data.error || `Server ${res.status}`);

    setSyncStatus('success', data.updated ? '✅ Updated!' : '✅ Uploaded!');
    confluenceUrl.value = data.url;
    btnCopyUrl.disabled = false;

    // Show "Open ↗" link to the Confluence page
    const targetUrl = data.url || buildCleanConfluencePageUrl(cfUrl.value, pageId, data.url);
    if (targetUrl) {
      btnOpenPage.href = targetUrl;
      btnOpenPage.style.display = '';
    }

    // Save to library
    if (library.currentId) {
      library.markSynced(library.currentId, {
        pageId, filename: fname, confluenceUrl: data.url,
        pageName: pickedPageMeta.pageName || cfPageId.value,
        spaceKey: pickedPageMeta.spaceKey || ''
      });
    } else {
      const name = diagramName.value.trim() || 'Untitled';
      const entry = library.create(name, editor.value.trim(), diagramType.value);
      library.markSynced(entry.id, {
        pageId, filename: fname, confluenceUrl: data.url,
        pageName: pickedPageMeta.pageName || pageId,
        spaceKey: pickedPageMeta.spaceKey || ''
      });
    }
    updateLibCount();
    updateModifiedBadge();

    // Auto-copy Confluence URL + show inline (no modal popup)
    navigator.clipboard.writeText(data.url).catch(() => {});

    // When opened from "Edit in Kroki" link, show "close tab" prompt
    if (isEditMode) {
      showToast(`✅ Saved to Confluence! You can close this tab.`);
      setSyncStatus('success', '✅ Saved! <a href="javascript:window.close()" style="color:inherit;text-decoration:underline">Close tab ↗</a>');
    } else {
      showToast(`✅ Synced! URL copied — click "Open ↗" to embed`);
      setTimeout(() => setSyncStatus('', ''), 4000);
    }

  } catch (err) {
    let msg = err.message || 'Unknown error';
    if (msg === 'Failed to fetch' || msg.includes('NetworkError') || msg === 'Load failed') {
      msg = 'Cannot reach server — run: npm run kroki';
    }
    setSyncStatus('error', '❌ ' + msg.substring(0, 100));
    console.error('Confluence sync error:', err);
  } finally {
    btnSync.classList.remove('btn--loading');
    btnSync.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg> Sync to Confluence`;
    updateSyncBtn();
  }
});

function setSyncStatus(type, msg) {
  syncStatus.textContent = msg;
  syncStatus.className = 'sync-status' + (type ? ' ' + type : '');
}

// ─── Modified Badge ───────────────────────────────────────────────────────────
function updateModifiedBadge() {
  if (!syncModifiedBadge) return;
  const cur = library.current;
  const show = !!(cur?.lastSynced && cur?.modifiedSinceSync);
  syncModifiedBadge.classList.toggle('visible', show);
}

// ─── Process Page ─────────────────────────────────────────────────────────────
const btnProcessPage = $('btnProcessPage');

function updateProcessBtn() {
  btnProcessPage.disabled = !HAS_API || !cfPageId.value.trim();
}
cfPageId.addEventListener('input', updateProcessBtn);

btnProcessPage.addEventListener('click', async () => {
  // Defensive: extract page ID from URL if user didn't wait for debounce
  const pageId = extractPageId(cfPageId.value.trim()) || cfPageId.value.trim();
  if (pageId !== cfPageId.value.trim()) { cfPageId.value = pageId; cfPageIdHint.textContent = ''; }
  if (!pageId) return;
  setSyncStatus('loading', '⏳ Scanning page...');
  btnProcessPage.disabled = true;
  try {
    const res  = await fetch(`/api/confluence/process/${pageId}`, { method: 'POST' });
    const data = await res.json();
    if (!res.ok || data.error) throw new Error(data.error || `Server ${res.status}`);

    const processed = data.processed ?? data.rendered ?? 0;
    if (processed === 0 && !data.cached) {
      setSyncStatus('', data.message || 'No diagram code blocks found');
      showToast('No diagrams found on this page', 'warn');
    } else {
      const total   = data.total ?? processed;
      const cached  = data.cached ?? 0;
      const detail  = data.bodyUpdated ? 'embedded on page' : 'images uploaded';
      const cacheNote = cached > 0 ? ` (${cached} cached)` : '';
      setSyncStatus('success', `✅ ${total} diagrams ${detail}${cacheNote}`);
      showToast(`Processed ${total} diagram${total > 1 ? 's' : ''} — refresh Confluence page to see updates`);
    }
    if (data.errors?.length) {
      console.warn('Process errors:', data.errors);
    }
    await loadPageDiagrams();
  } catch (err) {
    setSyncStatus('error', '❌ ' + err.message.substring(0, 100));
  } finally {
    updateProcessBtn();
    setTimeout(() => setSyncStatus('', ''), 5000);
  }
});

function buildCleanConfluencePageUrl(baseUrlInput, pageId, fullDataUrl) {
  if (fullDataUrl && typeof fullDataUrl === 'string' && fullDataUrl.startsWith('http')) {
    return fullDataUrl;
  }
  let base = (baseUrlInput || 'https://mvillage.atlassian.net').trim().replace(/\/+$/, '');
  if (base.endsWith('/wiki')) base = base.slice(0, -5);
  return `${base}/wiki/pages/viewpage.action?pageId=${pageId}`;
}

// ─── Sync Result Modal ────────────────────────────────────────────────────────
function showSyncResult({url, pageName, pageId, filename}) {
  $('srUrl').value = url;
  $('srFilename').textContent = filename;
  $('srPageLink').textContent = pageName || `Page ${pageId}`;
  const pageUrl = buildCleanConfluencePageUrl(cfUrl.value, pageId, url);
  $('srPageLink').href  = pageUrl;
  $('srOpenPageBtn').href = pageUrl;
  $('syncResultOverlay').classList.add('open');
}
(function initSyncResultModal() {
  const overlay = $('syncResultOverlay');
  const close = () => overlay.classList.remove('open');
  $('syncResultClose').addEventListener('click', close);
  $('syncResultClose2').addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  $('btnCopySrUrl').addEventListener('click', async () => {
    const url = $('srUrl').value; if (!url) return;
    await navigator.clipboard.writeText(url).catch(() => {});
    $('srCopyText').textContent = 'Copied!';
    setTimeout(() => $('srCopyText').textContent = 'Copy', 2000);
  });
})();

// ─── How-to Modal ─────────────────────────────────────────────────────────────
const modalOverlay = $('modalOverlay');
const btnHowTo     = $('btnHowTo');
const modalClose   = $('modalClose');

// ─── Global keyboard shortcuts ────────────────────────────────────────────────
document.addEventListener('keydown', e => {
  // ESC — close any open modal
  if (e.key === 'Escape') {
    [modalOverlay, pagePickerOverlay, $('syncResultOverlay')].forEach(el => {
      if (el?.classList.contains('open')) el.classList.remove('open');
    });
    if (libDrawer?.classList.contains('open')) closeLibrary();
    return;
  }

  // Ctrl+S / Cmd+S — save diagram
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault();
    const hasPage = !!new URLSearchParams(window.location.search).get('page');
    if (hasPage && HAS_API) {
      // Edit-from-Confluence mode → sync back to Confluence
      if (!btnSync.disabled) btnSync.click();
    } else {
      // Normal mode → save to local library (auto-name if needed)
      if (editor.value.trim()) btnSaveDiagram.click();
    }
  }
});

const btnConfluencePanel = $('btnConfluencePanel');
const outputBar = document.querySelector('.output-bar');
btnConfluencePanel?.addEventListener('click', () => {
  const open = outputBar.classList.toggle('confluence-open');
  btnConfluencePanel.classList.toggle('active', open);
  btnConfluencePanel.setAttribute('aria-expanded', String(open));
  btnConfluencePanel.title = open ? 'Close Confluence workspace' : 'Open Confluence workspace';
});

btnHowTo.addEventListener('click', () => modalOverlay.classList.add('open'));
modalClose.addEventListener('click', () => modalOverlay.classList.remove('open'));
modalOverlay.addEventListener('click', e => {
  if (e.target === modalOverlay) modalOverlay.classList.remove('open');
});

// ─── Page Picker ──────────────────────────────────────────────────────────────
const pagePickerOverlay = $('pagePickerOverlay');
const btnPickerClose    = $('btnPickerClose');
const pickerTitle       = $('pickerTitle');
const pickerSearch      = $('pickerSearch');
const pickerList        = $('pickerList');
const pickerBreadcrumb  = $('pickerBreadcrumb');
const btnBrowsePages    = $('btnBrowsePages');

let pickerMode            = 'spaces';
let pickerAllItems        = [];
let pickerCurrentSpaceKey = '';

function setPickerContent(html) { pickerList.innerHTML = html; }

function applyPickerFilter() {
  const q = pickerSearch.value.toLowerCase();
  const items = q ? pickerAllItems.filter(i => i.label.toLowerCase().includes(q)) : pickerAllItems;
  if (!items.length) { setPickerContent('<div class="picker-empty">No results</div>'); return; }
  const icon = pickerMode === 'spaces' ? '📁' : '📄';
  setPickerContent(items.map(i =>
    `<div class="picker-item" data-id="${i.id}" data-key="${i.key||''}" data-label="${encodeURIComponent(i.label)}">
      <span class="picker-icon">${icon}</span>
      <span class="picker-item-label">${i.label}</span>
      <span class="picker-item-meta">${i.key || '#'+i.id}</span>
    </div>`
  ).join(''));
  pickerList.querySelectorAll('.picker-item').forEach(el =>
    el.addEventListener('click', () => onPickerClick(el))
  );
}

async function onPickerClick(el) {
  const id    = el.dataset.id;
  const key   = el.dataset.key;
  const label = decodeURIComponent(el.dataset.label);

  if (pickerMode === 'spaces') {
    pickerCurrentSpaceKey = key;
    pickerMode = 'pages';
    pickerTitle.textContent = label;
    pickerBreadcrumb.innerHTML =
      `<button class="picker-back-btn" id="crumbBack">← Spaces</button>
       <span class="picker-crumb-sep">›</span>
       <span class="picker-crumb-active">${label}</span>`;
    $('crumbBack').addEventListener('click', openPicker);
    pickerSearch.value = '';
    setPickerContent('<div class="picker-loading"><div class="spinner" style="width:18px;height:18px;border-width:2px"></div><span>Loading pages…</span></div>');
    try {
      const res  = await fetch(`/api/confluence/pages/${key}`);
      if (!res.ok) throw new Error(`${res.status}: ${(await res.text()).substring(0, 80)}`);
      const data = await res.json();
      pickerAllItems = (data.results || []).map(p => ({ id: p.id, label: p.title }));
      applyPickerFilter();
    } catch (e) {
      setPickerContent(`<div class="picker-error">⚠ ${e.message}</div>`);
    }
  } else {
    cfPageId.value = id;
    pickedPageMeta = { pageName: label, spaceKey: pickerCurrentSpaceKey || '' };
    saveCreds();
    updateSyncBtn();
    pagePickerOverlay.classList.remove('open');
    loadPageDiagrams();
  }
}

async function openPicker() {
  pickerMode = 'spaces';
  pickerTitle.textContent = 'Browse Confluence';
  pickerBreadcrumb.innerHTML = '<span class="picker-crumb-active">Spaces</span>';
  pickerSearch.value = '';
  pagePickerOverlay.classList.add('open');
  setPickerContent('<div class="picker-loading"><div class="spinner" style="width:18px;height:18px;border-width:2px"></div><span>Loading spaces…</span></div>');

  if (!HAS_API) {
    setPickerContent('<div class="picker-error">⚠ Browse requires local server — run <code>npm run kroki</code> then open <code>http://localhost:3333</code></div>');
    return;
  }

  try {
    const res  = await fetch('/api/confluence/spaces');
    if (!res.ok) throw new Error(`${res.status}: ${(await res.text()).substring(0, 80)}`);
    const data = await res.json();
    pickerAllItems = (data.results || []).map(s => ({ id: s.id, key: s.key, label: s.name }));
    applyPickerFilter();
  } catch (e) {
    setPickerContent(`<div class="picker-error">⚠ ${e.message}</div>`);
  }
}

// Save pageName/spaceKey when picker selects a page
// (injected into onPickerClick via pickedPageMeta)

btnBrowsePages.addEventListener('click', openPicker);
btnPickerClose.addEventListener('click', () => pagePickerOverlay.classList.remove('open'));
pagePickerOverlay.addEventListener('click', e => {
  if (e.target === pagePickerOverlay) pagePickerOverlay.classList.remove('open');
});
pickerSearch.addEventListener('input', applyPickerFilter);

// ─── Library UI ──────────────────────────────────────────────────────────────
function showToast(msg, type = 'success') {
  const t = $('appToast');
  if (!t) return;
  t.textContent = msg;
  t.className = `app-toast app-toast--${type} app-toast--visible`;
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('app-toast--visible'), 2800);
}

// Persistent banner for autoprocess result — stays until closed or tab is closed.
function showAutoBanner(msg, type = 'ok') {
  const isOk = type === 'ok';
  const bg    = isOk ? '#1f7a4b' : (type === 'warn' ? '#856404' : '#8b1a1a');
  const banner = document.createElement('div');
  banner.style.cssText = [
    'position:fixed;top:0;left:0;right:0;z-index:9999',
    `background:${bg};color:#fff`,
    'padding:14px 20px;display:flex;align-items:center;justify-content:center;gap:12px',
    'font-size:14px;font-weight:500;box-shadow:0 2px 8px rgba(0,0,0,.35)',
  ].join(';');

  const text = document.createElement('span');
  text.textContent = msg;
  banner.appendChild(text);

  if (isOk) {
    const hint = document.createElement('span');
    hint.textContent = '— Go back and refresh your Confluence page.';
    hint.style.cssText = 'opacity:.75;font-weight:400';
    banner.appendChild(hint);

    const close = document.createElement('button');
    close.textContent = 'Close tab';
    close.style.cssText = [
      'background:rgba(255,255,255,.22);border:none;color:#fff',
      'padding:5px 14px;border-radius:4px;cursor:pointer;margin-left:8px;font-size:13px',
    ].join(';');
    close.addEventListener('click', () => window.close());
    banner.appendChild(close);
  }

  document.body.prepend(banner);
  document.body.style.paddingTop = (banner.offsetHeight + 4) + 'px';
}

function updateLibCount() {
  const n = library.all.length;
  libCount.textContent = n || '';
  libCount.style.display = n > 0 ? 'inline-flex' : 'none';
}

function fmtDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', {day:'2-digit',month:'2-digit'}) + ' ' +
         d.toLocaleTimeString('en-GB', {hour:'2-digit',minute:'2-digit'});
}

function openLibrary()  { renderLibrary(); libDrawer.classList.add('open'); libBackdrop.classList.add('open'); }
function closeLibrary() { libDrawer.classList.remove('open'); libBackdrop.classList.remove('open'); }

function renderLibrary() {
  const q = (libSearch?.value || '').toLowerCase();
  const items = library.all.filter(d =>
    !q || d.name.toLowerCase().includes(q) ||
    (d.pageName||'').toLowerCase().includes(q) ||
    (d.filename||'').toLowerCase().includes(q)
  );
  updateLibCount();
  if (!items.length) {
    libList.innerHTML = '<div class="lib-empty">No diagrams saved yet.<br>Click <strong>Save</strong> in the sync bar or <strong>+ New</strong> to start.</div>';
    return;
  }
  libList.innerHTML = items.map(d => {
    const isCur  = d.id === library.currentId;
    const hasCf  = !!d.confluenceUrl;
    const hasPg  = !!d.pageId;
    const badge  = !d.lastSynced
      ? '<span class="lib-badge lib-badge--local">Local</span>'
      : d.modifiedSinceSync
        ? '<span class="lib-badge lib-badge--modified">Modified</span>'
        : '<span class="lib-badge lib-badge--synced">Synced</span>';
    const chk = d.checkStatus === 'live'    ? ' <span class="lib-badge lib-badge--live">✓ Live</span>'
              : d.checkStatus === 'missing' ? ' <span class="lib-badge lib-badge--missing">✗ Missing</span>'
              : d.checkStatus === 'checking'? ' <span class="lib-badge lib-badge--checking">…</span>'
              : '';
    const multiPages = (d.pages||[]).length > 1;
    const pagesHtml  = multiPages
      ? `<div class="lib-pages">${d.pages.map(p =>
          `<span class="lib-page-pill" title="${escHtml(p.pageName||p.pageId)}">${escHtml((p.pageName||p.pageId).slice(0,28))}</span>`
        ).join('')}</div>` : '';
    return `<div class="lib-card${isCur?' lib-card--active':''}" data-id="${d.id}">
      <div class="lib-card-top">
        <span class="lib-card-name">${escHtml(d.name)}</span>
        <button class="lib-del-btn" data-del="${d.id}" title="Delete">✕</button>
      </div>
      <div class="lib-card-meta">
        <span class="lib-type">${d.type}</span>
        ${multiPages ? '' : (d.pageName ? `<span class="lib-page">📄 ${escHtml(d.pageName)}</span>` : '<span class="lib-page lib-no-page">no page</span>')}
        ${d.filename && d.filename !== 'diagram.png' ? `<span class="lib-filename" title="filename on Confluence">🖼 ${escHtml(d.filename)}</span>` : ''}
      </div>
      ${pagesHtml}
      <div class="lib-card-status">${badge}${chk}${d.lastSynced?`<span class="lib-time">${fmtDate(d.lastSynced)}</span>`:''}</div>
      <div class="lib-card-actions">
        <button class="btn btn-ghost btn-sm lib-act" data-a="load"    data-id="${d.id}">Load</button>
        ${hasCf ? `<button class="btn btn-ghost btn-sm lib-act" data-a="getlink" data-id="${d.id}">Get Link</button>` : ''}
        ${hasCf&&hasPg ? `<button class="btn btn-ghost btn-sm lib-act" data-a="check"   data-id="${d.id}">Check</button>` : ''}
        ${hasCf ? `<button class="btn btn-ghost btn-sm lib-act" data-a="addpage" data-id="${d.id}" title="Sync này sang trang Confluence khác">+ Page</button>` : ''}
        ${d.versions?.length ? `<button class="btn btn-ghost btn-sm lib-act" data-a="history" data-id="${d.id}">History (${d.versions.length})</button>` : ''}
      </div>
      <div class="lib-versions" id="lv-${d.id}" style="display:none">
        ${(d.versions||[]).slice().reverse().map(v =>
          `<div class="lib-ver-row">v${v.v} · ${fmtDate(v.syncedAt)}
           <button class="btn btn-ghost btn-sm lib-act" data-a="restore" data-id="${d.id}" data-v="${v.v}">Restore</button>
          </div>`
        ).join('')}
      </div>
    </div>`;
  }).join('');

  libList.querySelectorAll('.lib-act').forEach(btn =>
    btn.addEventListener('click', e => { e.stopPropagation(); onLibAction(btn.dataset.a, btn.dataset.id, btn.dataset.v); })
  );
  libList.querySelectorAll('[data-del]').forEach(btn =>
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const d = library.find(btn.dataset.del);
      if (d && confirm(`Delete "${d.name}"?`)) { library.delete(btn.dataset.del); renderLibrary(); }
    })
  );
}

async function onLibAction(action, id, vNum) {
  const d = library.find(id);
  if (!d) return;

  if (action === 'load') {
    editor.value = d.code;
    diagramType.value = d.type;
    diagramName.value = d.name;
    cfPageId.value    = d.pageId   || '';
    cfFileName.value  = d.filename || 'diagram.png';
    if (d.pageName) pickedPageMeta = { pageName: d.pageName, spaceKey: d.spaceKey || '' };
    library.currentId = id;
    saveCreds(); updateSyncBtn(); renderLibrary(); closeLibrary(); scheduleRender();
    updateEditorStats(); updateModifiedBadge();

  } else if (action === 'getlink') {
    if (!d.confluenceUrl) return;
    navigator.clipboard.writeText(d.confluenceUrl).catch(()=>{});
    showToast(`Copied: ${d.confluenceUrl.split('/').pop()}`);

  } else if (action === 'check') {
    if (!d.pageId || !d.filename) return;
    library._upsert({ ...d, checkStatus: 'checking' }); renderLibrary();
    try {
      const r    = await fetch(`/api/confluence/check/${d.pageId}?filename=${encodeURIComponent(d.filename)}`);
      const data = await r.json();
      library._upsert({ ...library.find(id), checkStatus: data.exists ? 'live' : 'missing', checkAt: new Date().toISOString() });
    } catch { library._upsert({ ...library.find(id), checkStatus: 'missing' }); }
    renderLibrary();

  } else if (action === 'history') {
    const el = document.getElementById(`lv-${id}`);
    if (el) el.style.display = el.style.display === 'none' ? 'block' : 'none';

  } else if (action === 'restore') {
    const v = (d.versions||[]).find(v => String(v.v) === String(vNum));
    if (!v || !confirm(`Restore v${v.v} (${fmtDate(v.syncedAt)})?`)) return;
    editor.value = v.code; diagramType.value = v.type;
    library.currentId = id;
    library.updateCurrent({ code: v.code, type: v.type });
    diagramName.value = d.name; cfPageId.value = d.pageId||''; cfFileName.value = d.filename||'diagram.png';
    closeLibrary(); scheduleRender();
    showToast(`Restored v${v.v}`);

  } else if (action === 'addpage') {
    // Load diagram + clear page pick → open Browse to pick another page
    editor.value      = d.code;
    diagramType.value = d.type;
    diagramName.value = d.name;
    cfFileName.value  = d.filename || 'diagram.png';
    cfPageId.value    = '';
    pickedPageMeta    = { pageName: '', spaceKey: '' };
    library.currentId = id;
    updateSyncBtn(); closeLibrary(); scheduleRender();
    showToast('Chọn trang mới → Sync để thêm trang');
    setTimeout(() => btnBrowsePages.click(), 400);
  }
}

// Auto-save current library entry when code changes (debounced 2s)
let _autoSaveTimer;
function autoSaveToLibrary() {
  clearTimeout(_autoSaveTimer);
  _autoSaveTimer = setTimeout(() => {
    if (!library.currentId) return;
    library.updateCurrent({ code: editor.value, type: diagramType.value });
    updateLibCount();
    updateModifiedBadge();
  }, 2000);
}

// Save / create library entry from sync bar
btnSaveDiagram.addEventListener('click', () => {
  let name = diagramName.value.trim();
  if (!name) {
    // Auto-name: "mermaid-flowchart 23/07" style
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    name = `${diagramType.value}-${dd}/${mm}`;
    diagramName.value = name;
  }
  if (library.currentId) {
    library.updateCurrent({ code: editor.value, type: diagramType.value });
    library.rename(library.currentId, name);
    showToast(`Saved "${name}"`);
  } else {
    library.create(name, editor.value, diagramType.value);
    showToast(`Saved "${name}" to library`);
  }
  updateLibCount();
});

// Slugify name → safe filename (e.g. "Login Flow" → "login-flow.png")
function slugify(name) {
  return name.trim()
    .toLowerCase()
    .replace(/[àáảãạăằắẳẵặâầấẩẫậ]/g, 'a')
    .replace(/[èéẻẽẹêềếểễệ]/g, 'e')
    .replace(/[ìíỉĩị]/g, 'i')
    .replace(/[òóỏõọôồốổỗộơờớởỡợ]/g, 'o')
    .replace(/[ùúủũụưừứửữự]/g, 'u')
    .replace(/[ỳýỷỹỵ]/g, 'y')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 60) || 'diagram';
}

// Rename when user changes the name field + auto-update filename if still default
diagramName.addEventListener('change', () => {
  const name = diagramName.value.trim();
  if (!name) return;
  if (library.currentId) library.rename(library.currentId, name);
  // Auto-set filename only if still using "diagram.png" default
  if (cfFileName.value === 'diagram.png' || cfFileName.value === '') {
    cfFileName.value = slugify(name) + '.png';
    saveCreds();
  }
});

// Library drawer events
btnOpenLibrary.addEventListener('click', openLibrary);
btnLibClose.addEventListener('click', closeLibrary);
libBackdrop.addEventListener('click', closeLibrary);
btnLibNew.addEventListener('click', () => {
  editor.value = '';
  diagramType.value = 'mermaid';
  diagramName.value = '';
  cfPageId.value = ''; cfFileName.value = 'diagram.png';
  pickedPageMeta = { pageName:'', spaceKey:'' };
  library.currentId = null;
  showState('placeholder'); confluenceUrl.value = ''; state.currentUrl = '';
  btnCopyUrl.disabled = true; btnDownloadConfluence.disabled = true;
  btnOpenPage.style.display = 'none';
  updateSyncBtn(); closeLibrary();
  diagramName.focus();
});
libSearch.addEventListener('input', renderLibrary);

// Extract page ID from a Confluence page URL or plain ID string
function extractPageId(text) {
  if (!text) return null;
  const t = text.trim();
  // ?pageId=123456 or &pageId=123456
  const m1 = t.match(/[?&]pageId=(\d+)/);
  if (m1) return m1[1];
  // /pages/123456/... or /pages/123456
  const m2 = t.match(/\/pages\/(\d+)/);
  if (m2) return m2[1];
  // plain numeric ID
  if (/^\d+$/.test(t)) return t;
  return null;
}

// ─── Page ID field: accept URL → extract ID, show hint ────────────────────────

function tryExtractPageId(raw) {
  const id = extractPageId(raw);
  if (id && id !== raw.trim()) {
    cfPageId.value = id;
    cfPageIdHint.textContent = `↳ extracted from URL`;
    saveCreds(); updateSyncBtn(); updateProcessBtn();
    return true;
  }
  cfPageIdHint.textContent = '';
  return false;
}

// Immediate extraction on paste (intercept before field updates)
cfPageId.addEventListener('paste', e => {
  const text = (e.clipboardData || window.clipboardData).getData('text');
  const id = extractPageId(text);
  if (id && id !== text.trim()) {
    e.preventDefault();
    cfPageId.value = id;
    cfPageIdHint.textContent = '↳ extracted from URL';
    saveCreds(); updateSyncBtn(); updateProcessBtn();
  }
});

// Debounced extraction on manual input (handles typing a URL, auto-fill, etc.)
let _pageIdTimer;
cfPageId.addEventListener('input', () => {
  clearTimeout(_pageIdTimer);
  cfPageIdHint.textContent = '';
  _pageIdTimer = setTimeout(() => tryExtractPageId(cfPageId.value), 350);
});

// ─── Init ─────────────────────────────────────────────────────────────────────
(function init() {
  loadCreds();
  const p = new URLSearchParams(window.location.search);

  // URL params: ?type=mermaid&template=sequence&page=PAGE_ID
  // Used by "Edit in Kroki ↗" links and shareable tool bookmarks.
  const paramType     = p.get('type');
  const paramPage     = p.get('page');
  const paramTemplate = p.get('template');
  const paramCode     = p.get('code');

  if (paramType || paramPage || paramTemplate || paramCode) {
    if (paramType) diagramType.value = paramType;
    if (paramPage) {
      cfPageId.value = paramPage;
      saveCreds();
    } else if (paramCode) {
      cfPageId.value = '';
      saveCreds();
    }
    if (paramTemplate && !paramCode) {
      const key = paramType ? `${paramType}-${paramTemplate}` : paramTemplate;
      const tpl = TEMPLATES[key] || TEMPLATES[paramTemplate];
      if (tpl) { editor.value = tpl.code.trimStart(); if (!paramType) diagramType.value = tpl.type; }
    }
    // Keep URL params so the link stays bookmarkable and shareable
    if (HAS_API && credFields) credFields.style.display = 'none';
    updateSyncBtn();
    updateProcessBtn();

    // ── Edit-in-Kroki mode: page param present → rename Sync button ──────────
    if (paramPage && HAS_API) {
      btnSync.innerHTML = '💾 Save to Confluence';
      btnSync.title = 'Save diagram back to this Confluence page (Ctrl+S)';
    }

    // ── ?autoprocess=1: Re-sync link clicked from Confluence page ──────────────
    const paramAutoProcess = p.get('autoprocess');
    if (paramAutoProcess && paramPage && HAS_API) {
      setStatus('loading', '⏳ Re-syncing page diagrams…');
      fetch(`/api/confluence/process/${paramPage}`, { method: 'POST' })
        .then(r => r.json())
        .then(data => {
          if (data.error) throw new Error(data.error);
          const n = data.processed ?? 0;
          showAutoBanner(
            n === 0
              ? '⚠️ No diagram code blocks found on this page'
              : `✅ ${n} diagram${n > 1 ? 's' : ''} synced successfully`,
            n === 0 ? 'warn' : 'ok'
          );
        })
        .catch(err => showAutoBanner('❌ ' + err.message.slice(0, 120), 'error'));
      return;
    }

    // ── Auto-load diagram code from "Edit in Kroki" link ──────────────────────
    // Priority: ?code= param (embedded, self-contained) > Confluence API fetch > nothing.
    const paramCode = p.get('code');
    const paramIdx  = p.get('idx');
    if (paramCode) {
      function processParamCode(rawCode, attempts = 0) {
        if ((rawCode.startsWith('eN') || rawCode.startsWith('eJ')) && typeof pako === 'undefined' && attempts < 30) {
          setTimeout(() => processParamCode(rawCode, attempts + 1), 50);
          return;
        }

        let decoded = null;

        // 1. Try Zlib inflate / inflateRaw if code starts with zlib header prefix (eN or eJ from Kroki / pako.deflate)
        if (typeof pako !== 'undefined') {
          try {
            const bin   = atob(rawCode.replace(/-/g, '+').replace(/_/g, '/'));
            const bytes = new Uint8Array([...bin].map(c => c.charCodeAt(0)));
            try {
              decoded = new TextDecoder().decode(pako.inflate(bytes));
            } catch (_) {
              decoded = pako.inflateRaw(bytes, { to: 'string' });
            }
          } catch (_) {}
        }

        // 2. Check if raw string is already plain XML or Diagram code
        if (!decoded && (
          rawCode.startsWith('<') ||
          rawCode.startsWith('<?xml') ||
          rawCode.startsWith('flowchart') ||
          rawCode.startsWith('sequenceDiagram') ||
          rawCode.startsWith('@startuml') ||
          rawCode.startsWith('digraph') ||
          rawCode.startsWith('direction:') ||
          rawCode.includes('\n') ||
          rawCode.includes(' ')
        )) {
          decoded = rawCode;
        }

        // 3. Try URL Component decode
        if (!decoded) {
          try {
            const urlDecoded = decodeURIComponent(rawCode);
            if (urlDecoded.startsWith('<') || urlDecoded.startsWith('<?xml') || urlDecoded.includes('\n')) {
              decoded = urlDecoded;
            }
          } catch (_) {}
        }

        // 4. Fallback
        if (!decoded) {
          decoded = rawCode;
        }

        editor.value = decoded;
        if (typeof updateEditorStats === 'function') updateEditorStats();

        // If idx is present, enter PDM "update" mode so Save uses PATCH (not embed)
        // This prevents duplicate images when saving back to the same Confluence page.
        if (paramIdx !== null && paramPage && HAS_API) {
          const idxNum = parseInt(paramIdx, 10);
          if (!isNaN(idxNum)) {
            state.selectedPageDiagramIdx = idxNum;
            state.pageDiagramMode = 'update';
            // Clear default filename so server recomputes from new code hash
            cfFileName.value = '';
            saveCreds();
          }
        }

        scheduleRender();
      }

      processParamCode(paramCode);
      return;
    }
    if (paramPage && HAS_API && !paramTemplate) {
      // Fallback: fetch from Confluence API (requires server credentials)
      fetch(`/api/confluence/process/${paramPage}`)
        .then(r => r.json())
        .then(data => {
          if (!data.diagrams?.length) { scheduleRender(); return; }
          const d = data.diagrams[0];
          editor.value      = d.code;
          diagramType.value = d.type;
          cfFileName.value  = d.filename;
          saveCreds(); updateSyncBtn(); scheduleRender();
        })
        .catch(() => scheduleRender());
      return; // scheduleRender will be called by the fetch chain above
    }

    scheduleRender();
    return;
  }

  // Legacy params (bookmarks / manual config)
  if (p.get('cfUrl'))    cfUrl.value      = p.get('cfUrl');
  if (p.get('cfEmail'))  cfEmail.value    = p.get('cfEmail');
  if (p.get('cfPageId') || p.get('page')) cfPageId.value = p.get('cfPageId') || p.get('page');
  if (p.get('cfFname'))  cfFileName.value = p.get('cfFname');

  // Hide credential fields when server handles them
  if (HAS_API && credFields) credFields.style.display = 'none';

  // Restore last active library entry
  const cur = library.current;
  if (cur) {
    editor.value      = cur.code;
    diagramType.value = cur.type;
    diagramName.value = cur.name;
    cfPageId.value    = cur.pageId   || '';
    cfFileName.value  = cur.filename || 'diagram.png';
    if (cur.pageName) pickedPageMeta = { pageName: cur.pageName, spaceKey: cur.spaceKey||'' };
  } else {
    // Load default template
    const tpl = TEMPLATES['mermaid-flowchart'];
    editor.value = tpl.code.trimStart();
    diagramType.value = tpl.type;
  }

  updateLibCount();
  updateSyncBtn();
  updateEditorStats();
  updateModifiedBadge();
  editor.focus();
  setTimeout(renderDiagram, 300);
})();

// ═══════════════════════════════════════════════════════════════════════════════
// DIAGRAM FILE IMPORT ENGINE
// Supported input formats:
//   • .drawio / .xml  → draw.io XML  → Mermaid flowchart TD
//   • .excalidraw     → Excalidraw JSON → Mermaid (or excalidraw type if complex)
//   • .mmd / .mermaid → raw Mermaid code (passthrough)
//   • .puml           → PlantUML code (passthrough)
//   • .d2             → D2 code (passthrough)
//   • .dot            → Graphviz DOT (passthrough)
// ═══════════════════════════════════════════════════════════════════════════════

// ─── draw.io XML → Mermaid ────────────────────────────────────────────────────
function drawioToMermaid(xmlText) {
  const parser = new DOMParser();
  const doc    = parser.parseFromString(xmlText, 'text/xml');
  if (doc.querySelector('parsererror')) throw new Error('Invalid XML / draw.io file');

  const nodes = {};
  const edges = [];

  doc.querySelectorAll('mxCell').forEach(cell => {
    const id     = cell.getAttribute('id');
    const vertex = cell.getAttribute('vertex');
    const edge   = cell.getAttribute('edge');
    const style  = (cell.getAttribute('style') || '').toLowerCase();
    const source = cell.getAttribute('source');
    const target = cell.getAttribute('target');
    const rawVal = cell.getAttribute('value') || '';
    const label  = rawVal
      .replace(/<[^>]+>/g, '')
      .replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>')
      .trim();

    if (id === '0' || id === '1') return;

    if (vertex === '1') {
      let shape = 'rect';
      if (/ellipse|circle|startstate|endstate/.test(style)) shape = 'circle';
      else if (/rhombus|diamond|condition/.test(style)) shape = 'diamond';
      else if (/cylinder|storage/.test(style)) shape = 'cylinder';
      else if (/parallelogram|input/.test(style)) shape = 'parallelogram';
      else if (/hexagon/.test(style)) shape = 'hexagon';
      else if (/rounded=1/.test(style)) shape = 'stadium';
      nodes[id] = { label: label || id, shape };
    }

    if (edge === '1' && source && target) {
      edges.push({ source, target, label });
    }
  });

  if (!Object.keys(nodes).length && !edges.length) {
    throw new Error(
      'Không tìm thấy elements.\n' +
      'Thử export Uncompressed XML từ draw.io: Extras → Edit Diagram → copy XML.'
    );
  }

  const nid = {};
  Object.keys(nodes).forEach((id, i) => { nid[id] = `N${i}`; });
  const q = s => (s || '').replace(/"/g, "'").replace(/\n/g, ' ').substring(0, 80);

  let mmd = '%%{init:{"flowchart":{"htmlLabels":false}}}%%\nflowchart TD\n';

  Object.entries(nodes).forEach(([id, node]) => {
    const n = nid[id]; const lbl = q(node.label);
    switch (node.shape) {
      case 'circle':        mmd += `  ${n}(("${lbl}"))\n`; break;
      case 'diamond':       mmd += `  ${n}{"${lbl}"}\n`;   break;
      case 'cylinder':      mmd += `  ${n}[("${lbl}")]\n`; break;
      case 'parallelogram': mmd += `  ${n}[/"${lbl}"/]\n`; break;
      case 'hexagon':       mmd += `  ${n}{{"${lbl}"}}\n`; break;
      case 'stadium':       mmd += `  ${n}(["${lbl}"])\n`; break;
      default:              mmd += `  ${n}["${lbl}"]\n`;
    }
  });

  edges.forEach(e => {
    const s = nid[e.source]; const t = nid[e.target];
    if (!s || !t) return;
    mmd += e.label ? `  ${s} -->|"${q(e.label)}"| ${t}\n` : `  ${s} --> ${t}\n`;
  });

  return mmd.trim();
}

// ─── Excalidraw JSON → Mermaid (or excalidraw passthrough) ────────────────────
function excalidrawImport(jsonText) {
  const data     = JSON.parse(jsonText);
  const elements = data.elements || [];

  const shapes = {}; // id → { type, label }
  const arrows = []; // { source, target, label }

  elements.forEach(el => {
    if (!el || el.isDeleted) return;
    if (['rectangle', 'diamond', 'ellipse'].includes(el.type)) {
      shapes[el.id] = { type: el.type, label: (el.label?.text || el.text || '').trim() };
    }
    if (el.type === 'arrow' && el.startBinding?.elementId && el.endBinding?.elementId) {
      arrows.push({
        source: el.startBinding.elementId,
        target: el.endBinding.elementId,
        label:  (el.label?.text || el.text || '').trim()
      });
    }
  });

  const connectedIds = new Set([...arrows.map(a => a.source), ...arrows.map(a => a.target)]);
  const hasGraph = arrows.length > 0 && Object.keys(shapes).some(id => connectedIds.has(id));

  // No graph structure → render as full Excalidraw canvas
  if (!hasGraph) return { type: 'excalidraw', code: jsonText };

  // Has graph → convert to Mermaid for text-based AI readability
  const nid = {};
  Object.keys(shapes).forEach((id, i) => { nid[id] = `N${i}`; });
  const q = s => (s || '').replace(/"/g, "'").replace(/\n/g, ' ').substring(0, 80);

  let mmd = 'flowchart TD\n';
  Object.entries(shapes).forEach(([id, node]) => {
    const n = nid[id]; const lbl = q(node.label) || n;
    switch (node.type) {
      case 'diamond': mmd += `  ${n}{"${lbl}"}\n`;   break;
      case 'ellipse': mmd += `  ${n}(("${lbl}"))\n`; break;
      default:        mmd += `  ${n}["${lbl}"]\n`;
    }
  });
  arrows.forEach(a => {
    const s = nid[a.source]; const t = nid[a.target];
    if (!s || !t) return;
    mmd += a.label ? `  ${s} -->|"${q(a.label)}"| ${t}\n` : `  ${s} --> ${t}\n`;
  });

  return { type: 'mermaid', code: mmd.trim() };
}

// ─── Extension → type map ─────────────────────────────────────────────────────
const EXT_TO_TYPE = {
  mmd: 'mermaid', mermaid: 'mermaid',
  puml: 'plantuml', pu: 'plantuml',
  d2: 'd2',
  dot: 'graphviz', gv: 'graphviz',
};

// ─── Load a File object into the editor ───────────────────────────────────────
function loadDiagramFile(file) {
  const ext  = (file.name.split('.').pop() || '').toLowerCase();
  const name = file.name.replace(/\.[^.]+$/, '');

  const reader = new FileReader();
  reader.onload = e => {
    const text = e.target.result;
    try {
      let code = text;
      let type = EXT_TO_TYPE[ext] || diagramType.value;

      if (ext === 'drawio' || (ext === 'xml' && (text.includes('mxCell') || text.includes('mxGraphModel')))) {
        code = drawioToMermaid(text);
        type = 'mermaid';
        showToast(`✅ draw.io → Mermaid (${code.split('\n').length} dòng)`);

      } else if (ext === 'excalidraw' || (ext === 'json' && text.includes('"excalidraw"'))) {
        const result = excalidrawImport(text);
        code = result.code;
        type = result.type;
        showToast(type === 'mermaid'
          ? `✅ Excalidraw → Mermaid (${code.split('\n').length} dòng)`
          : `✅ Excalidraw loaded (render mode)`);

      } else if (EXT_TO_TYPE[ext]) {
        code = text;
        showToast(`✅ ${file.name} imported`);

      } else {
        showToast(`⚠ Không hỗ trợ .${ext}  (dùng .drawio .excalidraw .mmd .puml .d2 .dot)`, 'warn');
        return;
      }

      // Load into editor
      editor.value      = code;
      diagramType.value = type;
      diagramName.value = name;
      if (!cfFileName.value || cfFileName.value === 'diagram.png') {
        cfFileName.value = slugify(name) + '.png';
      }

      // Save as new library entry
      const entry = library.create(name, code, type);
      library.currentId = entry.id;

      updateEditorStats();
      updateSyncBtn();
      updateModifiedBadge();
      renderLibrary();
      btnCopyMd.disabled = false;
      clearTimeout(state.renderTimer);
      renderDiagram();

    } catch (err) {
      showToast(`❌ ${err.message.substring(0, 100)}`, 'warn');
      console.error('[import]', err);
    }
  };
  reader.onerror = () => showToast('❌ Không đọc được file', 'warn');
  reader.readAsText(file, 'utf-8');
}

// ─── Import button ─────────────────────────────────────────────────────────────
const importFileInput = document.getElementById('importFileInput');
const btnImportFile   = document.getElementById('btnImportFile');
btnImportFile.addEventListener('click', () => importFileInput.click());
importFileInput.addEventListener('change', e => {
  if (e.target.files[0]) loadDiagramFile(e.target.files[0]);
  importFileInput.value = '';
});

// ─── Drag & Drop onto editor panel ────────────────────────────────────────────
const editorWrapper = document.querySelector('.editor-wrapper');
editorWrapper.addEventListener('dragover', e => {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'copy';
  editorWrapper.classList.add('drag-over');
});
editorWrapper.addEventListener('dragleave', e => {
  if (!editorWrapper.contains(e.relatedTarget)) editorWrapper.classList.remove('drag-over');
});
editorWrapper.addEventListener('drop', e => {
  e.preventDefault();
  editorWrapper.classList.remove('drag-over');
  if (e.dataTransfer.files[0]) loadDiagramFile(e.dataTransfer.files[0]);
});

// ─── "Copy .md" — wrap code in fenced block for AI tools ──────────────────────
// Output: ```mermaid\n<code>\n```  (Claude/ChatGPT/Gemini đọc được ngay)
const btnCopyMd = document.getElementById('btnCopyMd');

function copyMarkdownBlock() {
  const code = editor.value.trim();
  if (!code) return;
  const type = diagramType.value;
  const md   = `\`\`\`${type}\n${code}\n\`\`\``;
  navigator.clipboard.writeText(md)
    .then(() => {
      const orig = btnCopyMd.innerHTML;
      btnCopyMd.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Copied!';
      setTimeout(() => { btnCopyMd.innerHTML = orig; }, 1800);
      showToast(`📋 Đã copy \`\`\`${type} block — paste vào AI chat`);
    })
    .catch(() => {
      // Fallback: execCommand
      const ta = Object.assign(document.createElement('textarea'), {
        value: md, style: 'position:fixed;opacity:0'
      });
      document.body.appendChild(ta); ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast('📋 Copied as Markdown block');
    });
}

btnCopyMd.addEventListener('click', copyMarkdownBlock);
editor.addEventListener('input', () => { btnCopyMd.disabled = !editor.value.trim(); });
// Enable on startup
btnCopyMd.disabled = !editor.value.trim();
