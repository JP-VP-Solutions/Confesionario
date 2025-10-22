import{J as u,M as m,Oa as y,P as f,Qb as C,Sa as r,Sb as S,Ta as k,Tb as w,a,b as l,la as h,m as s,ma as b,nb as v,p as d,q as p,ua as g,x as c}from"./chunk-ESM7SC5T.js";var D=`
    .p-skeleton {
        display: block;
        overflow: hidden;
        background: dt('skeleton.background');
        border-radius: dt('skeleton.border.radius');
    }

    .p-skeleton::after {
        content: '';
        animation: p-skeleton-animation 1.2s infinite;
        height: 100%;
        left: 0;
        position: absolute;
        right: 0;
        top: 0;
        transform: translateX(-100%);
        z-index: 1;
        background: linear-gradient(90deg, rgba(255, 255, 255, 0), dt('skeleton.animation.background'), rgba(255, 255, 255, 0));
    }

    [dir='rtl'] .p-skeleton::after {
        animation-name: p-skeleton-animation-rtl;
    }

    .p-skeleton-circle {
        border-radius: 50%;
    }

    .p-skeleton-animation-none::after {
        animation: none;
    }

    @keyframes p-skeleton-animation {
        from {
            transform: translateX(-100%);
        }
        to {
            transform: translateX(100%);
        }
    }

    @keyframes p-skeleton-animation-rtl {
        from {
            transform: translateX(100%);
        }
        to {
            transform: translateX(-100%);
        }
    }
`;var U={root:{position:"relative"}},F={root:({instance:t})=>["p-skeleton p-component",{"p-skeleton-circle":t.shape==="circle","p-skeleton-animation-none":t.animation==="none"}]},I=(()=>{class t extends S{name="skeleton";theme=D;classes=F;inlineStyles=U;static \u0275fac=(()=>{let e;return function(o){return(e||(e=c(t)))(o||t)}})();static \u0275prov=s({token:t,factory:t.\u0275fac})}return t})();var G=(()=>{class t extends w{styleClass;shape="rectangle";animation="wave";borderRadius;size;width="100%";height="1rem";_componentStyle=p(I);get containerStyle(){let e=this._componentStyle?.inlineStyles.root,n;return this.size?n=l(a({},e),{width:this.size,height:this.size,borderRadius:this.borderRadius}):n=l(a({},e),{width:this.width,height:this.height,borderRadius:this.borderRadius}),n}static \u0275fac=(()=>{let e;return function(o){return(e||(e=c(t)))(o||t)}})();static \u0275cmp=u({type:t,selectors:[["p-skeleton"]],hostVars:7,hostBindings:function(n,o){n&2&&(f("aria-hidden",!0)("data-pc-name","skeleton")("data-pc-section","root"),h(o.containerStyle),b(o.cn(o.cx("root"),o.styleClass)))},inputs:{styleClass:"styleClass",shape:"shape",animation:"animation",borderRadius:"borderRadius",size:"size",width:"width",height:"height"},features:[g([I]),m],decls:0,vars:0,template:function(n,o){},dependencies:[y,C],encapsulation:2,changeDetection:0})}return t})();var O=class t{constructor(i){this.http=i}apiUrl=`${v.apiUrl}/confesiones`;getPreview(){return this.http.get(`${this.apiUrl}/preview`)}getStats(){return this.http.get(`${this.apiUrl}/stats`)}getAll(i){let e=new r().set("Usuario-Id",i.toString());return this.http.get(this.apiUrl,{headers:e})}create(i,e){let n=new r().set("Usuario-Id",i.toString());return this.http.post(this.apiUrl,e,{headers:n})}like(i,e){let n=new r().set("Usuario-Id",e.toString());return this.http.post(`${this.apiUrl}/${i}/like`,{},{headers:n})}unlike(i,e){let n=new r().set("Usuario-Id",e.toString());return this.http.delete(`${this.apiUrl}/${i}/like`,{headers:n})}static \u0275fac=function(e){return new(e||t)(d(k))};static \u0275prov=s({token:t,factory:t.\u0275fac,providedIn:"root"})};export{G as a,O as b};
