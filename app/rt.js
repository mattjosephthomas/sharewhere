(function(){
function get(ctx,path){return path.split('.').reduce((o,k)=>o==null?undefined:o[k],ctx);}
function fill(str,ctx){return str.replace(/\{\{\s*([\w.$]+)\s*\}\}/g,(m,p)=>{const v=get(ctx,p);return v==null?'':String(v);});}
function key(s){return s.replace(/[{}\s]/g,'');}
function bindNode(n,ctx){
  if(n.nodeType===3){if(!('__t' in n))n.__t=n.nodeValue;if(n.__t.includes('{{'))n.nodeValue=fill(n.__t,ctx);return;}
  if(n.nodeType!==1)return;
  for(const a of Array.from(n.attributes)){
    const k='__a_'+a.name; if(!(k in n)) n[k]=a.value;
    if(a.name==='onclick'){const f=get(ctx,key(n[k]));if(typeof f==='function'){n.onclick=(e)=>{e.preventDefault();f();};}continue;}
    if(n.tagName==='SC-IF'&&a.name==='value')continue;
    if(n[k].includes('{{')) n.setAttribute(a.name,fill(n[k],ctx));
    if(a.name==='data-src') n.setAttribute('src',n.getAttribute('data-src'));
  }
  if(n.tagName==='SC-IF'){n.style.display=get(ctx,key(n.__a_value||n.getAttribute('value')))?'contents':'none';}
}
function walk(root,ctx){
  if(root.nodeType===1&&root.tagName==='SC-FOR'){
    if(!root.__tpl) root.__tpl=root.innerHTML;
    const list=get(ctx,key(root.getAttribute('list')))||[]; const as=root.getAttribute('as');
    root.innerHTML='';
    list.forEach((item,i)=>{const d=document.createElement('div');d.style.display='contents';d.innerHTML=root.__tpl;root.appendChild(d);const c=Object.assign({},ctx,{[as]:item,$index:i});Array.from(d.childNodes).forEach(ch=>walk(ch,c));});
    return;
  }
  bindNode(root,ctx);
  if(root.nodeType===1) Array.from(root.childNodes).forEach(ch=>walk(ch,ctx));
}
window.DCLogic=class{constructor(p){this.props=p||{};this.state={};}setState(s){Object.assign(this.state,s);this._r();}_r(){walk(document.body,this.renderVals());}};
window.addEventListener('DOMContentLoaded',()=>{const c=new Component({});c._r();});
})();
