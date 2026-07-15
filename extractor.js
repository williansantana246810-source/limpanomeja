// LimpaNomeJá - Extrator Multi-Plataforma
// Hospedar em: https://SEU-SITE.netlify.app/extractor.js
(function(){
    const D='https://SEU-SITE.netlify.app';
    const u=window.location.href.toLowerCase();
    let p='desconhecida';
    if(u.includes('serasa'))p='serasa';
    else if(u.includes('spc'))p='spc';
    else if(u.includes('acordocerto'))p='acordocerto';
    else if(u.includes('queroquitar'))p='queroquitar';
    else if(u.includes('boavista'))p='boavista';
    else if(u.includes('registrato')||u.includes('bcb'))p='registrato';
    else if(u.includes('quiteja'))p='quiteja';
    else if(u.includes('zerv'))p='zerv';
    if(p==='desconhecida'){alert('Site não reconhecido.\nFunciona com: Serasa, SPC, Acordo Certo, QueroQuitar, Boa Vista.');return;}
    const l=document.createElement('div');
    l.style.cssText='position:fixed;top:10px;right:10px;background:#7c3aed;color:#fff;padding:10px 16px;border-radius:10px;z-index:99999;font-weight:600;font-size:13px;font-family:Inter,sans-serif;';
    l.textContent='Extraindo...';document.body.appendChild(l);
    (async()=>{
        let d=[];try{d=await extrairAPI();}catch(e){}if(!d.length)d=extrairHTML();
        l.textContent=d.length?d.length+' dividas!' : 'Nenhuma';
        setTimeout(()=>{if(d.length){window.location.href=D+'?dados='+encodeURIComponent(JSON.stringify(d));}else{l.remove();alert('Nenhuma dívida encontrada.');}},300);
    })();
    async function extrairAPI(){
        const d=[];
        for(const ep of ['/api/offers','/api/debts','/api/v3/offers','/api/v2/offers','/api/v1/debts']){
            try{const r=await fetch(ep,{credentials:'include'});if(!r.ok)continue;const data=await r.json();const items=data.offers||data.debts||data.data||data;if(!Array.isArray(items))continue;
                items.forEach(o=>{const par=[];if(o.installments)o.installments.forEach(i=>par.push({parcelas:i.count||i.parcelas,valor:i.value||i.valor}));else if(o.installmentOptions)o.installmentOptions.forEach(i=>par.push({parcelas:i.count||i.parcelas,valor:i.value||i.valor}));
                d.push({original:o.originalAmount||o.totalAmount||o.total||0,vista:o.cashAmount||o.discountedAmount||o.vista||0,parcela:o.installmentValue||(par[0]?.valor)||null,nParc:o.installmentCount||(par[0]?.parcelas)||null,parcelamentos:par.length?par:null,credor:o.creditor||o.company||o.credor||p,site:p});});
                if(d.length)return d;
            }catch(e){}
        }return d;
    }
    function extrairHTML(){
        const d=[];document.querySelectorAll('[class*="card"],[class*="offer"],[class*="debt"],article,li[class*="item"],tr').forEach(c=>{const t=c.textContent||'';const v=t.match(/R\$\s*[\d.,]+/g)||[];const n=v.map(x=>parseFloat(x.replace(/[R$\s.]/g,'').replace(',','.')));if(n.length>=2){const o=Math.max(...n);const vista=n.find(x=>x<o*0.9)||Math.min(...n);if(!d.find(x=>x.original===o&&x.vista===vista))d.push({original:o,vista,parcela:null,nParc:null,parcelamentos:null,credor:p,site:p});}});
        return d;
    }
})();
